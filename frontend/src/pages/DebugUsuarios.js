import React, { useState, useEffect } from 'react';
import api from '../services/api';

const DebugUsuarios = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/usuarios');
        console.log('Resposta completa da API:', response);
        console.log('Response.data:', response.data);
        console.log('Response.data.usuarios:', response.data.usuarios);
        
        setData(response.data);
        setError('');
      } catch (error) {
        console.error('Erro completo:', error);
        setError(error.message || 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>🔍 Debug - Dados dos Usuários</h2>
      
      <div style={{ background: '#f5f5f5', padding: '10px', margin: '10px 0' }}>
        <h3>Response.data:</h3>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>

      {data?.usuarios && (
        <div style={{ background: '#e8f5e8', padding: '10px', margin: '10px 0' }}>
          <h3>Usuários encontrados: {data.usuarios.length}</h3>
          {data.usuarios.map((user, index) => (
            <div key={user.id} style={{ background: 'white', padding: '10px', margin: '5px 0', border: '1px solid #ccc' }}>
              <h4>Usuário #{index + 1}</h4>
              <pre>{JSON.stringify(user, null, 2)}</pre>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: '#fff3cd', padding: '10px', margin: '10px 0' }}>
        <h3>LocalStorage:</h3>
        <pre>{JSON.stringify({
          token: localStorage.getItem('token') ? '***TOKEN***' : 'null',
          usuario: localStorage.getItem('usuario')
        }, null, 2)}</pre>
      </div>

      <button 
        onClick={() => {
          localStorage.clear();
          sessionStorage.clear();
          window.location.reload();
        }}
        style={{ padding: '10px 20px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}
      >
        🧹 Limpar Cache e Recarregar
      </button>
    </div>
  );
};

export default DebugUsuarios;
