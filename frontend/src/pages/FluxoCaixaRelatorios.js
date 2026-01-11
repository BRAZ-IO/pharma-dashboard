import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './FluxoCaixaRelatorios.css';

const FluxoCaixaRelatorios = () => {
  const [relatorios, setRelatorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({
    periodo: '',
    tipo: '',
    dataInicio: '',
    dataFim: ''
  });

  useEffect(() => {
    carregarRelatorios();
  }, [filtros]);

  const carregarRelatorios = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtros.periodo) params.append('periodo', filtros.periodo);
      if (filtros.tipo) params.append('tipo', filtros.tipo);
      if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
      if (filtros.dataFim) params.append('dataFim', filtros.dataFim);

      const response = await api.get(`/fluxo-caixa/relatorio?${params}`);
      setRelatorios(response.data.dados || []);
      setError('');
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      setError('Não foi possível carregar os relatórios');
      setRelatorios([]);
    } finally {
      setLoading(false);
    }
  };

  const gerarRelatorio = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtros.periodo) params.append('periodo', filtros.periodo);
      if (filtros.tipo) params.append('tipo', filtros.tipo);
      if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
      if (filtros.dataFim) params.append('dataFim', filtros.dataFim);

      const response = await api.post(`/fluxo-caixa/relatorio?${params}`);
      
      // Criar um link para download
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-fluxo-caixa-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      setError('');
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      setError('Não foi possível gerar o relatório');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fluxo-caixa-relatorios">
      <div className="relatorios-header">
        <h2>Relatórios de Fluxo de Caixa</h2>
        <div className="header-actions">
          <select 
            className="periodo-select"
            value={filtros.periodo}
            onChange={(e) => setFiltros({...filtros, periodo: e.target.value})}
          >
            <option value="">Todos os Períodos</option>
            <option value="hoje">Hoje</option>
            <option value="semana">Esta Semana</option>
            <option value="mes">Este Mês</option>
            <option value="ano">Este Ano</option>
          </select>
          <button 
            className="btn btn-primary"
            onClick={gerarRelatorio}
            disabled={loading}
          >
            {loading ? 'Gerando...' : 'Gerar Novo Relatório'}
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
            <p className="numero">{formatFileSize(relatorios.reduce((sum, r) => sum + (r.tamanho || 0), 0))}</p>
          </div>
          <div className="filtro-card">
            <h3>Último Gerado</h3>
            <p className="numero">{relatorios.length > 0 ? formatDate(relatorios[0].gerado_em) : 'N/A'}</p>
          </div>
        </div>
        
        <div className="filtro-avancado">
          <div className="filter-group">
            <label>Tipo:</label>
            <select
              value={filtros.tipo}
              onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
            >
              <option value="">Todos</option>
              <option value="completo">Completo</option>
              <option value="entradas">Apenas Entradas</option>
              <option value="saidas">Apenas Saídas</option>
              <option value="resumo">Resumo</option>
            </select>
          </div>
          <div className="filter-group">
            <label>Data Início:</label>
            <input
              type="date"
              value={filtros.dataInicio}
              onChange={(e) => setFiltros({...filtros, dataInicio: e.target.value})}
            />
          </div>
          <div className="filter-group">
            <label>Data Fim:</label>
            <input
              type="date"
              value={filtros.dataFim}
              onChange={(e) => setFiltros({...filtros, dataFim: e.target.value})}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={carregarRelatorios} className="btn btn-secondary">
            🔄 Tentar novamente
          </button>
        </div>
      )}

      <div className="relatorios-table-container">
        {relatorios.length === 0 ? (
          <div className="empty-state">
            <h3>Nenhum relatório encontrado</h3>
            <p>Use os filtros acima ou gere um novo relatório</p>
          </div>
        ) : (
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
                    <span className={`tipo-badge ${relatorio.tipo}`}>
                      {relatorio.tipo}
                    </span>
                  </td>
                  <td>{formatDate(relatorio.gerado_em)}</td>
                  <td>{formatFileSize(relatorio.tamanho || 0)}</td>
                  <td className="acoes-col">
                    <button className="btn btn-sm btn-outline-primary">
                      📄 Visualizar
                    </button>
                    <button className="btn btn-sm btn-outline-success">
                      📥 Baixar
                    </button>
                    <button className="btn btn-sm btn-outline-danger">
                      🗑️ Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
                <option value="json">JSON</option>
              </select>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FluxoCaixaRelatorios;
