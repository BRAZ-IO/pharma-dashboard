import React, { useState } from 'react';
import './FluxoCaixaResumo.css';

const FluxoCaixaResumo = () => {
  const [periodo, setPeriodo] = useState('mes');
  const [dados] = useState({
    saldoAnterior: 15000,
    entradas: 28500,
    saidas: 12300,
    saldoAtual: 31200
  });

  return (
    <div className="fluxo-caixa-resumo">
      <div className="resumo-header">
        <h2>Resumo do Fluxo de Caixa</h2>
        <select 
          className="periodo-select"
          value={periodo} 
          onChange={(e) => setPeriodo(e.target.value)}
        >
          <option value="dia">Hoje</option>
          <option value="semana">Esta Semana</option>
          <option value="mes">Este Mês</option>
          <option value="ano">Este Ano</option>
        </select>
      </div>

      <div className="resumo-cards">
        <div className="card saldo-anterior">
          <h3>Saldo Anterior</h3>
          <p className="valor">R$ {dados.saldoAnterior.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="card entradas">
          <h3>Entradas</h3>
          <p className="valor positivo">+R$ {dados.entradas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="card saidas">
          <h3>Saídas</h3>
          <p className="valor negativo">-R$ {dados.saidas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="card saldo-atual">
          <h3>Saldo Atual</h3>
          <p className="valor">R$ {dados.saldoAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="resumo-graficos">
        <div className="grafico-container">
          <h3>Evolução do Saldo</h3>
          <div className="grafico-placeholder">
            <p>Gráfico de linha mostrando evolução do saldo no período</p>
          </div>
        </div>
        <div className="grafico-container">
          <h3>Distribuição Entradas vs Saídas</h3>
          <div className="grafico-placeholder">
            <p>Gráfico de pizza ou barras comparando entradas e saídas</p>
          </div>
        </div>
      </div>

      <div className="resumo-transacoes-recentes">
        <h3>Transações Recentes</h3>
        <div className="tabela-container">
          <table className="transacoes-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>08/01/2026</td>
                <td>Venda PDV - Pedido #1234</td>
                <td>Vendas</td>
                <td className="tipo-entrada">Entrada</td>
                <td className="valor positivo">+R$ 450,00</td>
              </tr>
              <tr>
                <td>08/01/2026</td>
                <td>Compra de Medicamentos</td>
                <td>Compras</td>
                <td className="tipo-saida">Saída</td>
                <td className="valor negativo">-R$ 1.200,00</td>
              </tr>
              <tr>
                <td>07/01/2026</td>
                <td>Venda PDV - Pedido #1233</td>
                <td>Vendas</td>
                <td className="tipo-entrada">Entrada</td>
                <td className="valor positivo">+R$ 320,00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FluxoCaixaResumo;
