const { body, validationResult } = require('express-validator');
const TransferenciaEstoque = require('../models/TransferenciaEstoque');
const Estoque = require('../models/Estoque');
const Filial = require('../models/Filial');
const Produto = require('../models/Produto');
const Usuario = require('../models/Usuario');
const { Op } = require('sequelize');

class TransferenciaController {
  // Listar transferências
  async listar(req, res) {
    try {
      const { 
        page = 1, 
        limit = 20, 
        status, 
        filial_origem_id, 
        filial_destino_id,
        data_inicio,
        data_fim
      } = req.query;
      
      const where = { empresa_id: req.empresaId };
      
      if (status) where.status = status;
      if (filial_origem_id) where.filial_origem_id = filial_origem_id;
      if (filial_destino_id) where.filial_destino_id = filial_destino_id;
      
      if (data_inicio || data_fim) {
        where.data_solicitacao = {};
        if (data_inicio) where.data_solicitacao[Op.gte] = new Date(data_inicio);
        if (data_fim) where.data_solicitacao[Op.lte] = new Date(data_fim);
      }

      const transferencias = await TransferenciaEstoque.findAndCountAll({
        where,
        include: [
          {
            model: Filial,
            as: 'filialOrigem',
            attributes: ['id', 'nome_fantasia', 'tipo']
          },
          {
            model: Filial,
            as: 'filialDestino',
            attributes: ['id', 'nome_fantasia', 'tipo']
          },
          {
            model: Produto,
            as: 'produto',
            attributes: ['id', 'nome', 'codigo_barras']
          },
          {
            model: Usuario,
            as: 'usuarioSolicitante',
            attributes: ['id', 'nome', 'email']
          },
          {
            model: Usuario,
            as: 'usuarioAprovador',
            attributes: ['id', 'nome', 'email'],
            required: false
          }
        ],
        order: [['data_solicitacao', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      });

      return res.json({
        transferencias: transferencias.rows,
        total: transferencias.count,
        page: parseInt(page),
        totalPages: Math.ceil(transferencias.count / parseInt(limit))
      });
    } catch (error) {
      console.error('Erro ao listar transferências:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Criar nova transferência
  async criar(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        filial_origem_id,
        filial_destino_id,
        produto_id,
        quantidade,
        lote,
        motivo_transferencia,
        observacoes
      } = req.body;

      // Verificar se filiais são diferentes
      if (filial_origem_id === filial_destino_id) {
        return res.status(400).json({ 
          error: 'Filial de origem e destino devem ser diferentes' 
        });
      }

      // Verificar se filiais pertencem à mesma empresa
      const [filialOrigem, filialDestino] = await Promise.all([
        Filial.findOne({ where: { id: filial_origem_id, empresa_id: req.empresaId } }),
        Filial.findOne({ where: { id: filial_destino_id, empresa_id: req.empresaId } })
      ]);

      if (!filialOrigem || !filialDestino) {
        return res.status(404).json({ error: 'Uma ou ambas as filiais não encontradas' });
      }

      // Verificar se existe estoque suficiente na origem
      const estoqueOrigem = await Estoque.findOne({
        where: {
          filial_id: filial_origem_id,
          produto_id,
          lote: lote || null
        }
      });

      if (!estoqueOrigem || estoqueOrigem.quantidade_atual < quantidade) {
        return res.status(400).json({ 
          error: 'Estoque insuficiente na filial de origem' 
        });
      }

      // Verificar configurações das filiais
      if (!filialOrigem.configuracoes.permite_transferencia_saida) {
        return res.status(400).json({ 
          error: 'Filial de origem não permite transferências de saída' 
        });
      }

      if (!filialDestino.configuracoes.permite_transferencia_entrada) {
        return res.status(400).json({ 
          error: 'Filial de destino não permite transferências de entrada' 
        });
      }

      // Criar transferência
      const transferencia = await TransferenciaEstoque.create({
        empresa_id: req.empresaId,
        filial_origem_id,
        filial_destino_id,
        produto_id,
        quantidade,
        lote,
        motivo_transferencia,
        observacoes,
        usuario_solicitante_id: req.usuarioId,
        status: filialOrigem.configuracoes.exige_aprovacao_transferencia ? 
          'solicitada' : 'aprovada'
      });

      // Se não exige aprovação, aprovar automaticamente
      if (!filialOrigem.configuracoes.exige_aprovacao_transferencia) {
        await this.aprovarTransferencia(transferencia.id, req.usuarioId);
      }

      return res.status(201).json(transferencia);
    } catch (error) {
      console.error('Erro ao criar transferência:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Aprovar transferência
  async aprovar(req, res) {
    try {
      const { id } = req.params;
      const result = await this.aprovarTransferencia(id, req.usuarioId);
      
      if (result.error) {
        return res.status(400).json(result);
      }

      return res.json(result.transferencia);
    } catch (error) {
      console.error('Erro ao aprovar transferência:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async aprovarTransferencia(transferenciaId, usuarioAprovadorId) {
    try {
      const transferencia = await TransferenciaEstoque.findByPk(transferenciaId);

      if (!transferencia) {
        return { error: 'Transferência não encontrada' };
      }

      if (transferencia.status !== 'solicitada') {
        return { error: 'Transferência já foi processada' };
      }

      // Verificar estoque novamente
      const estoqueOrigem = await Estoque.findOne({
        where: {
          filial_id: transferencia.filial_origem_id,
          produto_id: transferencia.produto_id,
          lote: transferencia.lote || null
        }
      });

      if (!estoqueOrigem || estoqueOrigem.quantidade_atual < transferencia.quantidade) {
        return { error: 'Estoque insuficiente na filial de origem' };
      }

      // Atualizar transferência
      await transferencia.update({
        status: 'aprovada',
        data_aprovacao: new Date(),
        usuario_aprovador_id: usuarioAprovadorId
      });

      return { transferencia };
    } catch (error) {
      console.error('Erro ao aprovar transferência:', error);
      return { error: 'Erro interno do servidor' };
    }
  }

  // Iniciar transporte (dar baixa no estoque de origem)
  async iniciarTransporte(req, res) {
    try {
      const { id } = req.params;
      const transferencia = await TransferenciaEstoque.findByPk(id);

      if (!transferencia) {
        return res.status(404).json({ error: 'Transferência não encontrada' });
      }

      if (transferencia.status !== 'aprovada') {
        return res.status(400).json({ error: 'Transferência precisa estar aprovada' });
      }

      // Dar baixa no estoque de origem
      const estoqueOrigem = await Estoque.findOne({
        where: {
          filial_id: transferencia.filial_origem_id,
          produto_id: transferencia.produto_id,
          lote: transferencia.lote || null
        }
      });

      if (!estoqueOrigem || estoqueOrigem.quantidade_atual < transferencia.quantidade) {
        return res.status(400).json({ error: 'Estoque insuficiente na filial de origem' });
      }

      await estoqueOrigem.update({
        quantidade_atual: estoqueOrigem.quantidade_atual - transferencia.quantidade,
        ultima_atualizacao: new Date(),
        usuario_atualizacao_id: req.usuarioId
      });

      // Atualizar status da transferência
      await transferencia.update({
        status: 'em_transito',
        data_envio: new Date()
      });

      return res.json(transferencia);
    } catch (error) {
      console.error('Erro ao iniciar transporte:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Confirmar recebimento (dar entrada no estoque de destino)
  async confirmarRecebimento(req, res) {
    try {
      const { id } = req.params;
      const { quantidade_recebida, observacoes_recebimento } = req.body;
      
      const transferencia = await TransferenciaEstoque.findByPk(id);

      if (!transferencia) {
        return res.status(404).json({ error: 'Transferência não encontrada' });
      }

      if (transferencia.status !== 'em_transito') {
        return res.status(400).json({ error: 'Transferência não está em trânsito' });
      }

      // Verificar ou criar estoque no destino
      let estoqueDestino = await Estoque.findOne({
        where: {
          filial_id: transferencia.filial_destino_id,
          produto_id: transferencia.produto_id,
          lote: transferencia.lote || null
        }
      });

      if (!estoqueDestino) {
        // Criar novo registro de estoque
        const produto = await Produto.findByPk(transferencia.produto_id);
        estoqueDestino = await Estoque.create({
          empresa_id: transferencia.empresa_id,
          filial_id: transferencia.filial_destino_id,
          produto_id: transferencia.produto_id,
          quantidade_atual: quantidade_recebida || transferencia.quantidade,
          quantidade_minima: produto.quantidade_minima || 10,
          quantidade_maxima: produto.quantidade_maxima || 1000,
          lote: transferencia.lote,
          data_validade: transferencia.data_validade,
          ultima_atualizacao: new Date(),
          usuario_atualizacao_id: req.usuarioId
        });
      } else {
        // Atualizar estoque existente
        await estoqueDestino.update({
          quantidade_atual: estoqueDestino.quantidade_atual + 
            (quantidade_recebida || transferencia.quantidade),
          ultima_atualizacao: new Date(),
          usuario_atualizacao_id: req.usuarioId
        });
      }

      // Atualizar status da transferência
      await transferencia.update({
        status: 'concluida',
        data_recebimento: new Date(),
        observacoes: observacoes_recebimento || transferencia.observacoes
      });

      return res.json(transferencia);
    } catch (error) {
      console.error('Erro ao confirmar recebimento:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Cancelar transferência
  async cancelar(req, res) {
    try {
      const { id } = req.params;
      const { motivo_cancelamento } = req.body;
      
      const transferencia = await TransferenciaEstoque.findByPk(id);

      if (!transferencia) {
        return res.status(404).json({ error: 'Transferência não encontrada' });
      }

      if (!['solicitada', 'aprovada'].includes(transferencia.status)) {
        return res.status(400).json({ 
          error: 'Apenas transferências solicitadas ou aprovadas podem ser canceladas' 
        });
      }

      await transferencia.update({
        status: 'cancelada',
        observacoes: motivo_cancelamento || 'Transferência cancelada'
      });

      return res.json(transferencia);
    } catch (error) {
      console.error('Erro ao cancelar transferência:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  // Obter transferência por ID
  async obterPorId(req, res) {
    try {
      const { id } = req.params;
      
      const transferencia = await TransferenciaEstoque.findByPk(id, {
        include: [
          {
            model: Filial,
            as: 'filialOrigem',
            attributes: ['id', 'nome_fantasia', 'tipo', 'endereco']
          },
          {
            model: Filial,
            as: 'filialDestino',
            attributes: ['id', 'nome_fantasia', 'tipo', 'endereco']
          },
          {
            model: Produto,
            as: 'produto',
            attributes: ['id', 'nome', 'codigo_barras', 'descricao']
          },
          {
            model: Usuario,
            as: 'usuarioSolicitante',
            attributes: ['id', 'nome', 'email']
          },
          {
            model: Usuario,
            as: 'usuarioAprovador',
            attributes: ['id', 'nome', 'email'],
            required: false
          }
        ]
      });

      if (!transferencia) {
        return res.status(404).json({ error: 'Transferência não encontrada' });
      }

      return res.json(transferencia);
    } catch (error) {
      console.error('Erro ao obter transferência:', error);
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}

module.exports = new TransferenciaController();
