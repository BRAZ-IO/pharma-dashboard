import React from 'react';

const Produtos = () => {
  return (
    <div className="produtos-page">
      <div className="page-header">
        <h1>Produtos</h1>
        <p>Gestão completa do catálogo de medicamentos</p>
      </div>
      <div className="content-wrapper">
        <div className="produtos-container">
          <div className="produtos-message">
            <h2>🚀 Gestão de Produtos em Desenvolvimento</h2>
            <p>Estamos construindo um sistema completo para gestão de produtos com:</p>
            <ul>
              <li>💊 Cadastro detalhado de medicamentos</li>
              <li>📦 Controle de lote e validade</li>
              <li>🏷️ Gestão de categorias</li>
              <li>📸 Integração com fornecedores</li>
              <li>📊 Relatórios de estoque</li>
              <li>🔍 Busca avançada e filtros</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Produtos;
