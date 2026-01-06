 import React from 'react';
 import './Produtos.css';

const Produtos = () => {
  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Produtos</h1>
        <p>Gerenciamento de produtos do sistema</p>
      </div>

      <div className="content-wrapper-inner">
        <div className="content-card">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Lista de Produtos</h3>
            <button className="btn-primary">Adicionar Produto</button>
          </div>
          
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>EAN</th>
                  <th>Preço</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>001</td>
                  <td>Dipirona 500mg (10 comp)</td>
                  <td>Medicamento</td>
                  <td>7891000100101</td>
                  <td>R$ 8,90</td>
                  <td><span className="status-badge active">Ativo</span></td>
                  <td>
                    <button className="btn-sm btn-edit">Editar</button>
                    <button className="btn-sm btn-delete">Excluir</button>
                  </td>
                </tr>
                <tr>
                  <td>002</td>
                  <td>Paracetamol 750mg (20 comp)</td>
                  <td>Medicamento</td>
                  <td>7891000200202</td>
                  <td>R$ 14,50</td>
                  <td><span className="status-badge active">Ativo</span></td>
                  <td>
                    <button className="btn-sm btn-edit">Editar</button>
                    <button className="btn-sm btn-delete">Excluir</button>
                  </td>
                </tr>
                <tr>
                  <td>003</td>
                  <td>Amoxicilina 500mg (21 caps)</td>
                  <td>Antibiótico</td>
                  <td>7891000300303</td>
                  <td>R$ 29,90</td>
                  <td><span className="status-badge inactive">Inativo</span></td>
                  <td>
                    <button className="btn-sm btn-edit">Editar</button>
                    <button className="btn-sm btn-delete">Excluir</button>
                  </td>
                </tr>
                <tr>
                  <td>004</td>
                  <td>Protetor Solar FPS 50 (200ml)</td>
                  <td>Dermocosmético</td>
                  <td>7891000600606</td>
                  <td>R$ 59,90</td>
                  <td><span className="status-badge active">Ativo</span></td>
                  <td>
                    <button className="btn-sm btn-edit">Editar</button>
                    <button className="btn-sm btn-delete">Excluir</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Produtos;
