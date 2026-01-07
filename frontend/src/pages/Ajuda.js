import React, { useState } from 'react';
import './Ajuda.css';

const Ajuda = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    { id: 'todos', name: 'Todos', icon: '📚' },
    { id: 'inicio', name: 'Início Rápido', icon: '🚀' },
    { id: 'vendas', name: 'Vendas', icon: '💰' },
    { id: 'estoque', name: 'Estoque', icon: '📦' },
    { id: 'usuarios', name: 'Usuários', icon: '👥' },
    { id: 'relatorios', name: 'Relatórios', icon: '📊' }
  ];

  const faqs = [
    {
      id: 1,
      category: 'inicio',
      question: 'Como fazer o primeiro acesso ao sistema?',
      answer: 'Para fazer o primeiro acesso, utilize as credenciais fornecidas pelo administrador do sistema. Após o login inicial, você será solicitado a alterar sua senha. Acesse o menu Perfil > Segurança para configurar sua senha pessoal.'
    },
    {
      id: 2,
      category: 'inicio',
      question: 'Como navegar pelo dashboard?',
      answer: 'O dashboard principal exibe informações importantes como vendas do dia, produtos em estoque baixo e últimas transações. Use o menu lateral para acessar diferentes módulos do sistema. Você pode recolher o menu clicando no ícone de menu no topo.'
    },
    {
      id: 3,
      category: 'vendas',
      question: 'Como realizar uma venda no PDV?',
      answer: 'Acesse o módulo PDV pelo menu lateral. Digite o código de barras ou nome do produto no campo de busca. Adicione os produtos ao carrinho, informe a quantidade desejada e finalize a venda escolhendo a forma de pagamento.'
    },
    {
      id: 4,
      category: 'vendas',
      question: 'Como aplicar desconto em uma venda?',
      answer: 'Durante a venda no PDV, clique no botão "Aplicar Desconto" no carrinho. Você pode aplicar desconto em porcentagem ou valor fixo. Descontos acima de 10% podem requerer autorização de supervisor.'
    },
    {
      id: 5,
      category: 'vendas',
      question: 'Como cancelar uma venda?',
      answer: 'Para cancelar uma venda, acesse PDV > Vendas, localize a venda desejada e clique em "Cancelar Venda". Informe o motivo do cancelamento. Vendas canceladas ficam registradas no histórico para auditoria.'
    },
    {
      id: 6,
      category: 'estoque',
      question: 'Como cadastrar um novo produto?',
      answer: 'Acesse Produtos > Cadastro. Preencha as informações obrigatórias: nome, código de barras, categoria, preço e estoque inicial. Você pode adicionar foto do produto e informações complementares como descrição e fornecedor.'
    },
    {
      id: 7,
      category: 'estoque',
      question: 'Como fazer entrada de produtos no estoque?',
      answer: 'Acesse Estoque > Movimentações > Nova Entrada. Selecione o produto, informe a quantidade e o motivo da entrada (compra, devolução, ajuste). O sistema atualizará automaticamente o estoque disponível.'
    },
    {
      id: 8,
      category: 'estoque',
      question: 'Como configurar alertas de estoque baixo?',
      answer: 'Acesse Configurações > Sistema > Estoque. Defina o estoque mínimo para cada categoria de produto. O sistema enviará notificações automáticas quando o estoque atingir o nível mínimo configurado.'
    },
    {
      id: 9,
      category: 'usuarios',
      question: 'Como adicionar um novo usuário?',
      answer: 'Acesse Usuários > Cadastro. Preencha nome, email, cargo e defina o nível de permissão (Administrador, Gerente, Vendedor). O novo usuário receberá um email com instruções de primeiro acesso.'
    },
    {
      id: 10,
      category: 'usuarios',
      question: 'Quais são os níveis de permissão?',
      answer: 'Administrador: acesso total ao sistema. Gerente: acesso a vendas, estoque e relatórios. Vendedor: acesso apenas ao PDV e consulta de produtos. Cada nível pode ser personalizado nas configurações de permissões.'
    },
    {
      id: 11,
      category: 'relatorios',
      question: 'Como gerar relatórios de vendas?',
      answer: 'Acesse PDV > Relatórios. Selecione o período desejado e o tipo de relatório (vendas por período, produtos mais vendidos, vendas por vendedor). Você pode exportar os relatórios em PDF ou Excel.'
    },
    {
      id: 12,
      category: 'relatorios',
      question: 'Como acompanhar o desempenho de vendas?',
      answer: 'O Dashboard principal exibe métricas em tempo real. Para análises detalhadas, acesse PDV > Relatórios > Análise de Desempenho. Você pode filtrar por período, vendedor, categoria de produto e forma de pagamento.'
    }
  ];

  const tutoriais = [
    {
      id: 1,
      title: 'Configuração Inicial do Sistema',
      description: 'Aprenda a configurar o sistema pela primeira vez',
      duration: '10 min',
      icon: '⚙️'
    },
    {
      id: 2,
      title: 'Realizando sua Primeira Venda',
      description: 'Passo a passo completo para usar o PDV',
      duration: '8 min',
      icon: '🛒'
    },
    {
      id: 3,
      title: 'Gerenciamento de Estoque',
      description: 'Como controlar entrada e saída de produtos',
      duration: '12 min',
      icon: '📦'
    },
    {
      id: 4,
      title: 'Relatórios e Análises',
      description: 'Extraindo insights dos seus dados',
      duration: '15 min',
      icon: '📈'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'todos' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <div className="ajuda-container">
      <div className="ajuda-header">
        <h1>Central de Ajuda</h1>
        <p>Encontre respostas para suas dúvidas e aprenda a usar o sistema</p>
      </div>

      <div className="ajuda-search">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Buscar ajuda..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="ajuda-content">
        <div className="ajuda-sidebar">
          <h3>Categorias</h3>
          <div className="categories-list">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>

          <div className="contact-support">
            <h3>Precisa de mais ajuda?</h3>
            <p>Entre em contato com nosso suporte</p>
            <button className="btn-contact">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Falar com Suporte
            </button>
          </div>
        </div>

        <div className="ajuda-main">
          <section className="tutoriais-section">
            <h2>Tutoriais em Vídeo</h2>
            <div className="tutoriais-grid">
              {tutoriais.map(tutorial => (
                <div key={tutorial.id} className="tutorial-card">
                  <div className="tutorial-icon">{tutorial.icon}</div>
                  <h3>{tutorial.title}</h3>
                  <p>{tutorial.description}</p>
                  <div className="tutorial-footer">
                    <span className="tutorial-duration">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12,6 12,12 16,14"></polyline>
                      </svg>
                      {tutorial.duration}
                    </span>
                    <button className="btn-watch">Assistir</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="faq-section">
            <h2>Perguntas Frequentes</h2>
            {filteredFaqs.length === 0 ? (
              <div className="no-results">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <p>Nenhum resultado encontrado</p>
                <span>Tente usar outras palavras-chave</span>
              </div>
            ) : (
              <div className="faq-list">
                {filteredFaqs.map(faq => (
                  <div key={faq.id} className="faq-item">
                    <button
                      className={`faq-question ${expandedFaq === faq.id ? 'active' : ''}`}
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <span>{faq.question}</span>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`faq-icon ${expandedFaq === faq.id ? 'rotated' : ''}`}
                      >
                        <polyline points="6,9 12,15 18,9"></polyline>
                      </svg>
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="faq-answer">
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="recursos-section">
            <h2>Recursos Adicionais</h2>
            <div className="recursos-grid">
              <div className="recurso-card">
                <div className="recurso-icon">📖</div>
                <h3>Documentação</h3>
                <p>Guia completo do sistema</p>
                <button className="btn-recurso">Acessar</button>
              </div>
              <div className="recurso-card">
                <div className="recurso-icon">🎓</div>
                <h3>Treinamentos</h3>
                <p>Cursos e certificações</p>
                <button className="btn-recurso">Ver Cursos</button>
              </div>
              <div className="recurso-card">
                <div className="recurso-icon">💬</div>
                <h3>Comunidade</h3>
                <p>Fórum de discussões</p>
                <button className="btn-recurso">Participar</button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Ajuda;
