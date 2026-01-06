import React from 'react';

const Estoque = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Estoque</h1>
        <p>Controle de estoque e inventário</p>
      </div>
      
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-content">
              <h3>567</h3>
              <p>Itens em Estoque</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-content">
              <h3>23</h3>
              <p>Estoque Baixo</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-icon">🔄</div>
            <div className="stat-content">
              <h3>45</h3>
              <p>Movimentações Hoje</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="content-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Movimentação de Estoque</h3>
          <button className="btn-primary">Nova Movimentação</button>
        </div>
        
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Estoque Atual</th>
                <th>Data</th>
                <th>Responsável</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Notebook Dell Inspiron</td>
                <td><span className="movement-badge entrada">Entrada</span></td>
                <td>+10</td>
                <td>25</td>
                <td>06/01/2026</td>
                <td>João Silva</td>
              </tr>
              <tr>
                <td>Mouse Logitech MX</td>
                <td><span className="movement-badge saida">Saída</span></td>
                <td>-5</td>
                <td>15</td>
                <td>06/01/2026</td>
                <td>Maria Santos</td>
              </tr>
              <tr>
                <td>Teclado Mecânico</td>
                <td><span className="movement-badge entrada">Entrada</span></td>
                <td>+20</td>
                <td>45</td>
                <td>05/01/2026</td>
                <td>Pedro Costa</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Estoque;
