import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './UsuariosLista.css';

const UsuariosLista = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get('/usuarios');
      setUsuarios(response.data.usuarios || []);
      setError('');
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      if (error.response?.status === 401) {
        setError('Não autorizado. Faça login novamente.');
      } else if (error.response?.status === 403) {
        setError('Acesso negado. Verifique suas permissões.');
      } else if (error.response?.status === 500) {
        setError('Erro no servidor. Tente novamente mais tarde.');
      } else if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
        setError('Erro de conexão. Verifique sua internet.');
      } else {
        setError('Não foi possível carregar os usuários');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setUsuarios([]);
    carregarUsuarios();
  };

  const filteredUsers = usuarios.filter(usuario => {
    const matchesSearch = usuario.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'todos' || usuario.role === filterRole;
    const matchesStatus = filterStatus === 'todos' || usuario.ativo === (filterStatus === 'ativo');
    return matchesSearch && matchesRole && matchesStatus;
  });

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
    <div style={{ padding: '2rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem',
        gap: '1rem'
      }}>
        <div style={{
          display: 'flex',
          gap: '1.5rem',
          flexWrap: 'wrap',
          flex: 1
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #0f1a2e 0%, #1a2332 100%)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            minWidth: '140px'
          }}>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#64b5f6'
            }}>
              {filteredUsers.length}
            </span>
            <span style={{
              fontSize: '0.9rem',
              color: '#78909c',
              fontWeight: '500'
            }}>
              Total de Usuários
            </span>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(231, 76, 60, 0.1) 0%, #0f1a2e 100%)',
            border: '1px solid rgba(231, 76, 60, 0.3)',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            minWidth: '140px'
          }}>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#e74c3c'
            }}>
              {filteredUsers.filter(u => !u.ativo).length}
            </span>
            <span style={{
              fontSize: '0.9rem',
              color: '#78909c',
              fontWeight: '500'
            }}>
              Inativos
            </span>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(38, 222, 129, 0.1) 0%, #0f1a2e 100%)',
            border: '1px solid rgba(38, 222, 129, 0.3)',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            minWidth: '140px'
          }}>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#26de81'
            }}>
              {filteredUsers.filter(u => u.ativo).length}
            </span>
            <span style={{
              fontSize: '0.9rem',
              color: '#78909c',
              fontWeight: '500'
            }}>
              Ativos
            </span>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(100, 181, 246, 0.1) 0%, #0f1a2e 100%)',
            border: '1px solid rgba(100, 181, 246, 0.3)',
            borderRadius: '12px',
            padding: '1rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.25rem',
            minWidth: '140px'
          }}>
            <span style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#64b5f6'
            }}>
              {filteredUsers.filter(u => u.role === 'admin').length}
            </span>
            <span style={{
              fontSize: '0.9rem',
              color: '#78909c',
              fontWeight: '500'
            }}>
              Administradores
            </span>
          </div>
        </div>

        <button 
          onClick={() => navigate('/app/usuarios/cadastrar')}
          style={{ 
            padding: '12px 24px', 
            backgroundColor: '#64b5f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(100, 181, 246, 0.3)',
            whiteSpace: 'nowrap'
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
          + Adicionar Usuário
        </button>
      </div>

      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            flex: 1,
            minWidth: '200px',
            padding: '12px 16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: '#e8eaed',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#64b5f6';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          }}
        />

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: '#e8eaed',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#64b5f6';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          }}
        >
          <option value="todos">Todos os Cargos</option>
          <option value="admin">Administrador</option>
          <option value="gerente">Gerente</option>
          <option value="funcionario">Funcionário</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            padding: '12px 16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: '#e8eaed',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#64b5f6';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
          }}
        >
          <option value="todos">Todos os Status</option>
          <option value="ativo">Ativos</option>
          <option value="inativo">Inativos</option>
        </select>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        {filteredUsers.map(usuario => (
          <div 
            key={usuario.id} 
            style={{ 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              padding: '20px', 
              borderRadius: '12px',
              backgroundColor: 'rgba(26, 35, 50, 0.8)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '20px'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: '#64b5f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: '700',
              color: 'white',
              boxShadow: '0 4px 12px rgba(100, 181, 246, 0.3)'
            }}>
              {usuario.nome?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                color: '#e8eaed',
                margin: '0 0 8px 0',
                fontSize: '1.2rem',
                fontWeight: '600'
              }}>
                {usuario.nome || 'Sem nome'}
              </h3>
              
              <p style={{ 
                color: '#78909c',
                margin: '0 0 8px 0',
                fontSize: '0.9rem'
              }}>
                {usuario.email || 'Sem email'}
              </p>
              
              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                flexWrap: 'wrap'
              }}>
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: usuario.role === 'admin' ? '#e74c3c' : 
                                 usuario.role === 'gerente' ? '#f39c12' : '#3498db',
                  color: 'white',
                  borderRadius: '16px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {usuario.role || 'Sem cargo'}
                </span>
                
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: usuario.ativo ? '#27ae60' : '#e74c3c',
                  color: 'white',
                  borderRadius: '16px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {usuario.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '8px'
            }}>
              <button 
                onClick={() => navigate(`/app/usuarios/editar/${usuario.id}`)}
                style={{ 
                  padding: '8px 16px',
                  backgroundColor: '#27ae60',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#229954';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#27ae60';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Editar
              </button>
              
              <button 
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
                    setUsuarios(prev => prev.filter(u => u.id !== usuario.id));
                    
                    api.delete(`/usuarios/${usuario.id}`).catch(err => {
                      console.error('Erro ao excluir usuário:', err);
                      alert('Erro ao excluir usuário');
                      carregarUsuarios();
                    });
                  }
                }}
                style={{ 
                  padding: '8px 16px',
                  backgroundColor: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#c0392b';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = '#e74c3c';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 40px',
          backgroundColor: 'rgba(26, 35, 50, 0.5)',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ 
            fontSize: '3rem', 
            marginBottom: '20px',
            opacity: '0.7'
          }}>
            👥
          </div>
          <h3 style={{ 
            color: '#e8eaed',
            marginBottom: '10px',
            fontSize: '1.3rem',
            fontWeight: '600'
          }}>
            Nenhum usuário encontrado
          </h3>
          <p style={{ 
            color: '#78909c',
            fontSize: '1rem'
          }}>
            {searchTerm || filterRole !== 'todos' || filterStatus !== 'todos'
              ? 'Tente ajustar os filtros para ver mais usuários.'
              : 'Clique em "Adicionar Usuário" para criar o primeiro usuário.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default UsuariosLista;
