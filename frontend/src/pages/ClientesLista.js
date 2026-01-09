import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ClientesLista = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Timeout de 10 segundos para evitar loop infinito
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout na requisição')), 10000)
      );
      
      // Adicionar delay para evitar rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = await Promise.race([
        api.get('/clientes'),
        timeoutPromise
      ]);
      
      setClientes(response.data.clientes || []);
      setError('');
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      if (error.message === 'Timeout na requisição') {
        setError('Tempo esgotado. Verifique se o backend está rodando.');
      } else if (error.response?.status === 429) {
        setError('Muitas requisições. Tente novamente em alguns instantes.');
      } else if (error.response?.status === 401) {
        setError('Não autorizado. Faça login novamente.');
      } else {
        setError('Não foi possível carregar os clientes');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    // Limpar cache e recarregar
    setClientes([]);
    carregarClientes();
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        minHeight: '100vh',
        backgroundColor: '#0b1220',
        color: '#e8eaed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #64b5f6', 
          borderTop: '4px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <p>Carregando...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        minHeight: '100vh',
        backgroundColor: '#0b1220',
        color: '#e8eaed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <p>{error}</p>
        <button 
          onClick={handleRetry}
          style={{
            padding: '10px 20px',
            backgroundColor: '#64b5f6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          🔄 Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '40px',
      minHeight: '100vh',
      backgroundColor: '#0b1220',
      color: '#e8eaed'
    }}>
      <div style={{
        marginBottom: '40px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '30px'
      }}>
        <h1 style={{ 
          color: '#e8eaed',
          margin: '0 0 30px 0',
          fontSize: '2.5rem',
          fontWeight: '700',
          letterSpacing: '-0.5px'
        }}>
          Clientes
        </h1>
        
        <button 
          onClick={() => navigate('/app/clientes/cadastrar')}
          style={{ 
            padding: '16px 32px', 
            backgroundColor: '#64b5f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '18px',
            fontWeight: '600',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(100, 181, 246, 0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#42a5f5';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(100, 181, 246, 0.4)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#64b5f6';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(100, 181, 246, 0.3)';
          }}
        >
          + Adicionar Cliente
        </button>
      </div>

      <div style={{ display: 'grid', gap: '30px' }}>
        {clientes.map(cliente => (
          <div 
            key={cliente.id} 
            style={{ 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              padding: '30px', 
              borderRadius: '16px',
              backgroundColor: 'rgba(26, 35, 50, 0.8)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#27ae60',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                color: 'white',
                marginRight: '20px',
                boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)'
              }}>
                {cliente.nome?.charAt(0)?.toUpperCase() || 'C'}
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  color: '#e8eaed',
                  margin: '0 0 8px 0',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  letterSpacing: '-0.3px'
                }}>
                  {cliente.nome || 'Sem nome'}
                </h3>
                
                <p style={{ 
                  color: '#78909c',
                  margin: '0 0 4px 0',
                  fontSize: '1rem',
                  fontWeight: '400'
                }}>
                  {cliente.email || 'Sem email'}
                </p>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '12px', 
              marginBottom: '24px',
              flexWrap: 'wrap'
            }}>
              <span style={{
                padding: '8px 16px',
                backgroundColor: cliente.status === 'ativo' ? '#27ae60' : '#e74c3c',
                color: 'white',
                borderRadius: '24px',
                fontSize: '0.9rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}>
                {cliente.status || 'Ativo'}
              </span>
              
              {cliente.cpf && (
                <span style={{
                  padding: '8px 16px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  borderRadius: '24px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  letterSpacing: '0.5px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                }}>
                  CPF: {cliente.cpf}
                </span>
              )}
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <button 
                onClick={() => navigate(`/app/clientes/editar/${cliente.id}`)}
                style={{ 
                  padding: '12px 24px',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#229954';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(39, 174, 96, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#27ae60';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(39, 174, 96, 0.3)';
                }}
              >
                Editar
              </button>
              
              <button 
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
                    // Remover imediatamente da lista para melhor UX
                    setClientes(prev => prev.filter(c => c.id !== cliente.id));
                    
                    api.delete(`/clientes/${cliente.id}`).catch(err => {
                      // Se falhar, recarregar a lista
                      console.error('Erro ao excluir cliente:', err);
                      alert('Erro ao excluir cliente');
                      carregarClientes();
                    });
                  }
                }}
                style={{ 
                  padding: '12px 24px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(231, 76, 60, 0.3)'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#c0392b';
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(231, 76, 60, 0.4)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#e74c3c';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(231, 76, 60, 0.3)';
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {clientes.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '80px 40px',
          backgroundColor: 'rgba(26, 35, 50, 0.5)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '30px',
            opacity: '0.7'
          }}>
            👥
          </div>
          <h3 style={{ 
            color: '#e8eaed',
            marginBottom: '16px',
            fontSize: '1.8rem',
            fontWeight: '600'
          }}>
            Nenhum cliente encontrado
          </h3>
          <p style={{ 
            color: '#78909c',
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}>
            Clique em "Adicionar Cliente" para criar o primeiro cliente.
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientesLista;