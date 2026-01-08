import React, { useState } from 'react';
import './FluxoCaixaSaidas.css';

const FluxoCaixaSaidas = () => {
  const [saidas] = useState([
    {
      id: '1',
      data: '08/01/2026',
      descricao: 'Compra de Medicamentos',
      categoria: 'Compras',
      formaPagamento: 'Transferência',
      valor: 1200.00,
      responsavel: 'Ana Costa'
    },
    {
      id: '2',
      data: '08/01/2026',
      descricao: 'Pagamento de Aluguel',
      categoria: 'Despesas Fixas',
      formaPagamento: 'TED',
      valor: 3500.00,
      responsavel: 'Carlos Oliveira'
    },
    {
      id: '3',
      data: '07/01/2026',
      descricao: 'Conta de Luz',
      categoria: 'Despesas Fixas',
      formaPagamento: 'Boleto',
      valor: 450.00,
      responsavel: 'Maria Santos'
    }
  ]);

  const totalSaidas = saidas.reduce((sum, s) => sum + s.valor, 0);

  return (
    <div className="fluxo-caixa-saidas">
      <div className="saidas-header">
        <h2>Saídas de Caixa</h2>
        <button className="btn btn-primary">
          + Registrar Saída
        </button>
      </div>

      <div className="saidas-stats">
        <div className="stat-card">
          <h3>Total do Período</h3>
          <p className="stat-number">R$ {totalSaidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="stat-card">
          <h3>Qtd. Transações</h3>
          <p className="stat-number">{saidas.length}</p>
        </div>
        <div className="stat-card">
          <h3>Média por Transação</h3>
          <p className="stat-number">R$ {(totalSaidas / saidas.length).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="saidas-table-container">
        <table className="saidas-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Forma Pagamento</th>
              <th>Responsável</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {saidas.map((saida) => (
              <tr key={saida.id}>
                <td>{saida.data}</td>
                <td className="descricao-col">{saida.descricao}</td>
                <td>{saida.categoria}</td>
                <td>{saida.formaPagamento}</td>
                <td>{saida.responsavel}</td>
                <td className="valor-col negativo">-R$ {saida.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                <td className="acoes-col">
                  <button className="btn btn-sm btn-outline-primary">Editar</button>
                  <button className="btn btn-sm btn-outline-danger">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FluxoCaixaSaidas;
