import React, { useState } from 'react';
import './FluxoCaixaEntradas.css';

const FluxoCaixaEntradas = () => {
  const [entradas] = useState([
    {
      id: '1',
      data: '08/01/2026',
      descricao: 'Venda PDV - Pedido #1234',
      categoria: 'Vendas',
      formaPagamento: 'Dinheiro',
      valor: 450.00,
      responsavel: 'João Silva'
    },
    {
      id: '2',
      data: '08/01/2026',
      descricao: 'Venda PDV - Pedido #1235',
      categoria: 'Vendas',
      formaPagamento: 'Cartão Crédito',
      valor: 320.00,
      responsavel: 'Maria Santos'
    },
    {
      id: '3',
      data: '07/01/2026',
      descricao: 'Recebimento de Cliente',
      categoria: 'Contas a Receber',
      formaPagamento: 'Transferência',
      valor: 1500.00,
      responsavel: 'Carlos Oliveira'
    }
  ]);

  const totalEntradas = entradas.reduce((sum, e) => sum + e.valor, 0);

  return (
    <div className="fluxo-caixa-entradas">
      <div className="entradas-header">
        <h2>Entradas de Caixa</h2>
        <button className="btn btn-primary">
          + Registrar Entrada
        </button>
      </div>

      <div className="entradas-stats">
        <div className="stat-card">
          <h3>Total do Período</h3>
          <p className="stat-number">R$ {totalEntradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="stat-card">
          <h3>Qtd. Transações</h3>
          <p className="stat-number">{entradas.length}</p>
        </div>
        <div className="stat-card">
          <h3>Média por Transação</h3>
          <p className="stat-number">R$ {(totalEntradas / entradas.length).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="entradas-table-container">
        <table className="entradas-table">
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
            {entradas.map((entrada) => (
              <tr key={entrada.id}>
                <td>{entrada.data}</td>
                <td className="descricao-col">{entrada.descricao}</td>
                <td>{entrada.categoria}</td>
                <td>{entrada.formaPagamento}</td>
                <td>{entrada.responsavel}</td>
                <td className="valor-col positivo">+R$ {entrada.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
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

export default FluxoCaixaEntradas;
