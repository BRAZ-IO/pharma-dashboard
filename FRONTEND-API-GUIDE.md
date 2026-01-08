# 🚀 Guia de Integração Frontend - Pharma Dashboard API

## 📋 Índice

1. [Configuração Inicial](#configuração-inicial)
2. [Autenticação](#autenticação)
3. [Consumindo Endpoints](#consumindo-endpoints)
4. [Hooks Customizados](#hooks-customizados)
5. [Exemplos Práticos](#exemplos-práticos)
6. [Tratamento de Erros](#tratamento-de-erros)
7. [Boas Práticas](#boas-práticas)

---

## 🔧 Configuração Inicial

### 1. Instalar Dependências

```bash
cd frontend
npm install axios
```

### 2. Configurar Variáveis de Ambiente

Crie `.env` na raiz do frontend:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 3. Estrutura de Pastas

```
frontend/src/
├── services/
│   ├── api.js              # Configuração axios
│   ├── authService.js      # Serviço de autenticação
│   ├── produtosService.js  # Serviço de produtos
│   ├── usuariosService.js  # Serviço de usuários
│   └── vendasService.js    # Serviço de vendas
├── hooks/
│   ├── useAuth.js          # Hook de autenticação
│   ├── useProdutos.js      # Hook de produtos
│   └── useApi.js           # Hook genérico
└── contexts/
    └── AuthContext.js      # Context de autenticação
```

---

## 🔐 Autenticação

### Serviço de Autenticação (`services/authService.js`)

```javascript
import api from './api';

const authService = {
  // Login
  async login(email, senha) {
    const { data } = await api.post('/auth/login', { email, senha });
    
    // Se 2FA está ativado
    if (data.requires2FA) {
      return {
        requires2FA: true,
        userId: data.userId,
        message: data.message
      };
    }
    
    // Login normal
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    
    return data;
  },

  // Validar 2FA
  async validate2FA(userId, token, isBackupCode = false) {
    const { data } = await api.post('/2fa/validate', {
      userId,
      token,
      isBackupCode
    });
    
    return data;
  },

  // Registro
  async register(userData) {
    const { data } = await api.post('/auth/register', userData);
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    
    return data;
  },

  // Obter usuário atual
  async me() {
    const { data } = await api.get('/auth/me');
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    return data.usuario;
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    window.location.href = '/login';
  },

  // Verificar autenticação
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Obter usuário
  getUser() {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  },

  // Verificar role
  hasRole(roles) {
    const user = this.getUser();
    if (!user) return false;
    
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    return allowedRoles.includes(user.role);
  }
};

export default authService;
```

### Componente de Login

```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [codigo2FA, setCodigo2FA] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(email, senha);
      
      if (result.requires2FA) {
        setRequires2FA(true);
        setUserId(result.userId);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleValidate2FA = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.validate2FA(userId, codigo2FA);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (requires2FA) {
    return (
      <div className="login-container">
        <h2>Autenticação de Dois Fatores</h2>
        <form onSubmit={handleValidate2FA}>
          <input
            type="text"
            placeholder="Código 2FA"
            value={codigo2FA}
            onChange={(e) => setCodigo2FA(e.target.value)}
            maxLength={6}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Validando...' : 'Validar'}
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
```

---

## 📦 Consumindo Endpoints

### Serviço de Produtos (`services/produtosService.js`)

```javascript
import api from './api';

const produtosService = {
  // Listar produtos
  async listar(params = {}) {
    const { data } = await api.get('/produtos', { params });
    return data;
  },

  // Buscar por ID
  async buscarPorId(id) {
    const { data } = await api.get(`/produtos/${id}`);
    return data.produto;
  },

  // Buscar por código de barras
  async buscarPorCodigoBarras(codigo) {
    const { data } = await api.get(`/produtos/codigo-barras/${codigo}`);
    return data.produto;
  },

  // Criar produto
  async criar(produto) {
    const { data } = await api.post('/produtos', produto);
    return data.produto;
  },

  // Atualizar produto
  async atualizar(id, produto) {
    const { data } = await api.put(`/produtos/${id}`, produto);
    return data.produto;
  },

  // Deletar produto
  async deletar(id) {
    await api.delete(`/produtos/${id}`);
  },

  // Adicionar estoque
  async adicionarEstoque(id, estoque) {
    const { data } = await api.post(`/produtos/${id}/estoque`, estoque);
    return data.estoque;
  }
};

export default produtosService;
```

### Componente de Listagem de Produtos

```jsx
import React, { useState, useEffect } from 'react';
import produtosService from '../services/produtosService';

function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);

  useEffect(() => {
    carregarProdutos();
  }, [pagina]);

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      const data = await produtosService.listar({
        pagina,
        limite: 10
      });
      
      setProdutos(data.produtos);
      setTotalPaginas(data.totalPaginas);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletar = async (id) => {
    if (!window.confirm('Deseja realmente deletar este produto?')) return;

    try {
      await produtosService.deletar(id);
      carregarProdutos(); // Recarregar lista
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h2>Produtos</h2>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Código de Barras</th>
            <th>Preço</th>
            <th>Estoque</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.map((produto) => (
            <tr key={produto.id}>
              <td>{produto.nome}</td>
              <td>{produto.codigo_barras}</td>
              <td>R$ {produto.preco_venda.toFixed(2)}</td>
              <td>{produto.quantidade_estoque}</td>
              <td>
                <button onClick={() => handleDeletar(produto.id)}>
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginação */}
      <div className="paginacao">
        <button 
          onClick={() => setPagina(p => p - 1)} 
          disabled={pagina === 1}
        >
          Anterior
        </button>
        <span>Página {pagina} de {totalPaginas}</span>
        <button 
          onClick={() => setPagina(p => p + 1)} 
          disabled={pagina === totalPaginas}
        >
          Próxima
        </button>
      </div>
    </div>
  );
}

export default ListaProdutos;
```

---

## 🎣 Hooks Customizados

### Hook useAuth

```jsx
import { useState, useEffect, createContext, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado
    const storedUser = authService.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    const data = await authService.login(email, senha);
    if (!data.requires2FA) {
      setUser(data.usuario);
    }
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    hasRole: (roles) => authService.hasRole(roles)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
```

### Hook useProdutos

```jsx
import { useState, useEffect } from 'react';
import produtosService from '../services/produtosService';

export function useProdutos(params = {}) {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    pagina: 1,
    totalPaginas: 1,
    total: 0
  });

  const carregarProdutos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await produtosService.listar(params);
      
      setProdutos(data.produtos);
      setPagination({
        pagina: data.pagina,
        totalPaginas: data.totalPaginas,
        total: data.total
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, [JSON.stringify(params)]);

  const criar = async (produto) => {
    const novoProduto = await produtosService.criar(produto);
    setProdutos([...produtos, novoProduto]);
    return novoProduto;
  };

  const atualizar = async (id, produto) => {
    const produtoAtualizado = await produtosService.atualizar(id, produto);
    setProdutos(produtos.map(p => p.id === id ? produtoAtualizado : p));
    return produtoAtualizado;
  };

  const deletar = async (id) => {
    await produtosService.deletar(id);
    setProdutos(produtos.filter(p => p.id !== id));
  };

  return {
    produtos,
    loading,
    error,
    pagination,
    criar,
    atualizar,
    deletar,
    recarregar: carregarProdutos
  };
}
```

### Uso do Hook

```jsx
import React from 'react';
import { useProdutos } from '../hooks/useProdutos';

function ProdutosComHook() {
  const { produtos, loading, error, deletar } = useProdutos({
    pagina: 1,
    limite: 10
  });

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {produtos.map(produto => (
        <div key={produto.id}>
          <h3>{produto.nome}</h3>
          <button onClick={() => deletar(produto.id)}>Deletar</button>
        </div>
      ))}
    </div>
  );
}
```

---

## 🛡️ Proteção de Rotas

### Componente PrivateRoute

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function PrivateRoute({ children, roles }) {
  const { isAuthenticated, hasRole, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && !hasRole(roles)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default PrivateRoute;
```

### Uso no Router

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/Produtos';
import Usuarios from './pages/Usuarios';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/produtos" element={
            <PrivateRoute>
              <Produtos />
            </PrivateRoute>
          } />
          
          <Route path="/usuarios" element={
            <PrivateRoute roles={['admin', 'gerente']}>
              <Usuarios />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

## ⚠️ Tratamento de Erros

### Interceptor de Erros (já configurado em `api.js`)

```javascript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Token expirado - refresh automático
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      
      try {
        const { data } = await axios.post('/auth/refresh');
        localStorage.setItem('token', data.accessToken);
        
        error.config.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(error.config);
      } catch (refreshError) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }

    // Rate limit
    if (error.response?.status === 429) {
      alert('Muitas requisições. Aguarde um momento.');
    }

    return Promise.reject(error);
  }
);
```

### Componente de Erro Global

```jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erro capturado:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <h1>Algo deu errado</h1>
          <p>{this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>
            Recarregar Página
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

---

## 📝 Exemplos Práticos Completos

### Formulário de Criação de Produto

```jsx
import React, { useState } from 'react';
import produtosService from '../services/produtosService';

function CriarProduto() {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    codigo_barras: '',
    preco_custo: '',
    preco_venda: '',
    quantidade_minima: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await produtosService.criar({
        ...formData,
        preco_custo: parseFloat(formData.preco_custo),
        preco_venda: parseFloat(formData.preco_venda),
        quantidade_minima: parseInt(formData.quantidade_minima)
      });
      
      setSuccess(true);
      setFormData({
        nome: '',
        descricao: '',
        codigo_barras: '',
        preco_custo: '',
        preco_venda: '',
        quantidade_minima: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="criar-produto">
      <h2>Criar Novo Produto</h2>
      
      {success && <div className="success">Produto criado com sucesso!</div>}
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nome:</label>
          <input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Descrição:</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Código de Barras:</label>
          <input
            type="text"
            name="codigo_barras"
            value={formData.codigo_barras}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Preço de Custo:</label>
          <input
            type="number"
            step="0.01"
            name="preco_custo"
            value={formData.preco_custo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Preço de Venda:</label>
          <input
            type="number"
            step="0.01"
            name="preco_venda"
            value={formData.preco_venda}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Quantidade Mínima:</label>
          <input
            type="number"
            name="quantidade_minima"
            value={formData.quantidade_minima}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Criando...' : 'Criar Produto'}
        </button>
      </form>
    </div>
  );
}

export default CriarProduto;
```

---

## 🎯 Boas Práticas

### 1. **Sempre use try/catch**

```javascript
try {
  const data = await produtosService.listar();
  setProdutos(data.produtos);
} catch (error) {
  setError(error.message);
}
```

### 2. **Loading states**

```javascript
const [loading, setLoading] = useState(false);

setLoading(true);
try {
  await api.post('/produtos', produto);
} finally {
  setLoading(false); // Sempre executado
}
```

### 3. **Debounce em buscas**

```javascript
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

function BuscaProdutos() {
  const [busca, setBusca] = useState('');
  const [resultados, setResultados] = useState([]);

  useEffect(() => {
    const buscarProdutos = debounce(async (termo) => {
      if (termo.length < 3) return;
      
      const data = await produtosService.listar({ busca: termo });
      setResultados(data.produtos);
    }, 500);

    buscarProdutos(busca);
  }, [busca]);

  return (
    <input
      type="text"
      value={busca}
      onChange={(e) => setBusca(e.target.value)}
      placeholder="Buscar produtos..."
    />
  );
}
```

### 4. **Cancelar requisições**

```javascript
useEffect(() => {
  const controller = new AbortController();

  const carregarDados = async () => {
    try {
      const { data } = await api.get('/produtos', {
        signal: controller.signal
      });
      setProdutos(data.produtos);
    } catch (error) {
      if (error.name !== 'CanceledError') {
        setError(error.message);
      }
    }
  };

  carregarDados();

  return () => controller.abort(); // Cleanup
}, []);
```

### 5. **Validação de formulários**

```javascript
const validarProduto = (produto) => {
  const erros = {};

  if (!produto.nome || produto.nome.length < 3) {
    erros.nome = 'Nome deve ter no mínimo 3 caracteres';
  }

  if (produto.preco_venda <= produto.preco_custo) {
    erros.preco_venda = 'Preço de venda deve ser maior que custo';
  }

  return erros;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const erros = validarProduto(formData);
  if (Object.keys(erros).length > 0) {
    setErros(erros);
    return;
  }

  // Enviar...
};
```

---

## 📚 Referência Rápida de Endpoints

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Registro
- `GET /api/auth/me` - Usuário atual
- `POST /api/auth/refresh` - Refresh token

### 2FA
- `GET /api/2fa/status` - Status 2FA
- `POST /api/2fa/setup` - Configurar 2FA
- `POST /api/2fa/verify` - Verificar e ativar
- `POST /api/2fa/validate` - Validar código
- `POST /api/2fa/disable` - Desativar 2FA

### Produtos
- `GET /api/produtos` - Listar
- `GET /api/produtos/:id` - Buscar por ID
- `GET /api/produtos/codigo-barras/:codigo` - Buscar por código
- `POST /api/produtos` - Criar
- `PUT /api/produtos/:id` - Atualizar
- `DELETE /api/produtos/:id` - Deletar
- `POST /api/produtos/:id/estoque` - Adicionar estoque

### Usuários
- `GET /api/usuarios` - Listar
- `GET /api/usuarios/:id` - Buscar por ID
- `POST /api/usuarios` - Criar
- `PUT /api/usuarios/:id` - Atualizar
- `DELETE /api/usuarios/:id` - Deletar

---

## 🚀 Próximos Passos

1. ✅ Implementar todos os serviços (usuários, vendas, etc.)
2. ✅ Criar hooks customizados para cada recurso
3. ✅ Adicionar testes unitários (Jest + React Testing Library)
4. ✅ Implementar cache de requisições (React Query)
5. ✅ Adicionar notificações toast
6. ✅ Implementar upload de imagens
7. ✅ Adicionar WebSocket para atualizações em tempo real

---

**Documentação criada em:** 07/01/2026  
**Versão da API:** 1.0.0  
**Contato:** dev@pharmadashboard.com
