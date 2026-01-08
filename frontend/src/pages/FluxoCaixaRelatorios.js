import React, { useState } from 'react';
import './FluxoCaixaRelatorios.css';

const FluxoCaixaRelatorios = () => {
  const [relatorios] = useState([
    {
      id: '1',
      nome: 'Relatório Mensal de Fluxo de Caixa',
      periodo: 'Janeiro/2026',
      tipo: 'Mensal',
      geradoEm: '08/01/2026 14:30',
      tamanho: '245 KB'
    },
    {
      id: '2',
      nome: 'Relatório Semanal de Entradas',
      periodo: 'Semana 1 - Janeiro/2026',
      tipo: 'Semanal',
      geradoEm: '07/01/2026 09:15',
      tamanho: '128 KB'
    },
    {
      id: '3',
      nome: 'Análise de Despesas Fixas',
      periodo: 'Dezembro/2025',
      tipo: 'Análise',
      geradoEm: '02/01/2026 16:45',
      tamanho: '512 KB'
    }
  ]);

  return (
    <div className="fluxo-caixa-relatorios">
      <div className="relatorios-header">
        <h2>Relatórios de Fluxo de Caixa</h2>
        <div className="header-actions">
          <select className="periodo-select">
            <option value="">Todos os Períodos</option>
            <option value="hoje">Hoje</option>
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mês</option>
            <option value="ano">Este Ano</option>
          </select>
          <button className="btn btn-primary">
            Gerar Novo Relatório
          </button>
        </div>
      </div>

      <div className="relatorios-filtros">
        <div className="filtro-cards">
          <div className="filtro-card">
            <h3>Relatórios Gerados</h3>
            <p className="numero">{relatorios.length}</p>
          </div>
          <div className="filtro-card">
            <h3>Tamanho Total</h3>
            <p className="numero">885 KB</p>
          </div>
          <div className="filtro-card">
            <h3>Último Gerado</h3>
            <p className="numero">08/01/2026</p>
          </div>
        </div>
      </div>

      <div className="relatorios-table-container">
        <table className="relatorios-table">
          <thead>
            <tr>
              <th>Nome do Relatório</th>
              <th>Período</th>
              <th>Tipo</th>
              <th>Gerado em</th>
              <th>Tamanho</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {relatorios.map((relatorio) => (
              <tr key={relatorio.id}>
                <td className="nome-col">{relatorio.nome}</td>
                <td>{relatorio.periodo}</td>
                <td>
                  <span className="tipo-badge">{relatorio.tipo}</span>
                </td>
                <td>{relatorio.geradoEm}</td>
                <td>{relatorio.tamanho}</td>
                <td className="acoes-col">
                  <button className="btn btn-sm btn-outline-primary">
                    Visualizar
                  </button>
                  <button className="btn btn-sm btn-outline-success">
                    Download
                  </button>
                  <button className="btn btn-sm btn-outline-danger">
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="relatorios-config">
        <h3>Configurações de Relatórios</h3>
        <div className="config-grid">
          <div className="config-item">
            <label>
              <input type="checkbox" defaultChecked />
              Gerar relatório mensal automaticamente
            </label>
          </div>
          <div className="config-item">
            <label>
              <input type="checkbox" defaultChecked />
              Incluir gráficos nos relatórios
            </label>
          </div>
          <div className="config-item">
            <label>
              <input type="checkbox" />
              Enviar relatório por e-mail
            </label>
          </div>
          <div className="config-item">
            <label>
              Formato padrão:
              <select className="formato-select">
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FluxoCaixaRelatorios;
