import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const UsuariosCadastro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    address: '',
    role: 'vendedor',
    status: 'ativo',
    password: '',
    confirmPassword: '',
  });

  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [errors, setErrors] = useState({});

  const usuarios = [
    { id: 1, name: 'João Silva', email: 'joao.silva@pharma.com', role: 'admin', status: 'ativo', phone: '(11) 98765-4321', cpf: '123.456.789-00', address: 'Rua das Flores, 123 - São Paulo, SP', permissions: ['gerenciar_usuarios', 'gerenciar_produtos', 'gerenciar_estoque', 'visualizar_relatorios', 'configuracoes'] },
    { id: 2, name: 'Maria Santos', email: 'maria.santos@pharma.com', role: 'gerente', status: 'ativo', phone: '(11) 97654-3210', cpf: '234.567.890-11', address: 'Av. Paulista, 456 - São Paulo, SP', permissions: ['gerenciar_produtos', 'gerenciar_estoque', 'visualizar_relatorios'] },
    { id: 3, name: 'Pedro Costa', email: 'pedro.costa@pharma.com', role: 'vendedor', status: 'ativo', phone: '(11) 96543-2109', cpf: '345.678.901-22', address: 'Rua Augusta, 789 - São Paulo, SP', permissions: ['realizar_vendas', 'visualizar_produtos'] },
  ];

  const availablePermissions = [
    { id: 'gerenciar_usuarios', label: 'Gerenciar Usuários', description: 'Criar, editar e excluir usuários' },
    { id: 'gerenciar_produtos', label: 'Gerenciar Produtos', description: 'Adicionar e editar produtos' },
    { id: 'gerenciar_estoque', label: 'Gerenciar Estoque', description: 'Controlar entrada e saída de estoque' },
    { id: 'visualizar_relatorios', label: 'Visualizar Relatórios', description: 'Acessar relatórios do sistema' },
    { id: 'configuracoes', label: 'Configurações', description: 'Alterar configurações do sistema' },
    { id: 'realizar_vendas', label: 'Realizar Vendas', description: 'Processar vendas no PDV' },
    { id: 'visualizar_produtos', label: 'Visualizar Produtos', description: 'Ver catálogo de produtos' },
  ];

  useEffect(() => {
    if (isEditing) {
      const usuario = usuarios.find(u => u.id === parseInt(id));
      if (usuario) {
        setFormData({
          name: usuario.name,
          email: usuario.email,
          phone: usuario.phone,
          cpf: usuario.cpf,
          address: usuario.address,
          role: usuario.role,
          status: usuario.status,
          password: '',
          confirmPassword: '',
        });
        setSelectedPermissions(usuario.permissions);
      }
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(p => p !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'E-mail inválido';
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
    if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
    
    if (!isEditing) {
      if (!formData.password) newErrors.password = 'Senha é obrigatória';
      if (formData.password.length < 6) newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem';
    } else {
      if (formData.password && formData.password.length < 6) newErrors.password = 'Senha deve ter no mínimo 6 caracteres';
      if (formData.password && formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem';
    }

    if (selectedPermissions.length === 0) newErrors.permissions = 'Selecione ao menos uma permissão';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    console.log('Dados do formulário:', { ...formData, permissions: selectedPermissions });
    alert(isEditing ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!');
    navigate('/app/usuarios');
  };

  return (
    <div className="usuario-cadastro">
      <div className="usuario-cadastro-header">
        <h2>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</h2>
        <button 
          className="btn-secondary"
          onClick={() => navigate('/app/usuarios')}
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="usuario-form">
        <div className="form-section">
          <h3>Informações Pessoais</h3>
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="name">Nome Completo *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder="Ex: João Silva"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="usuario@pharma.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">Telefone *</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? 'error' : ''}
                placeholder="(11) 98765-4321"
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="cpf">CPF *</label>
              <input
                type="text"
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                className={errors.cpf ? 'error' : ''}
                placeholder="123.456.789-00"
              />
              {errors.cpf && <span className="error-message">{errors.cpf}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="address">Endereço</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Rua, número - Cidade, Estado"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Acesso e Permissões</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="role">Cargo *</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="vendedor">Vendedor</option>
                <option value="estoquista">Estoquista</option>
                <option value="gerente">Gerente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                {isEditing ? 'Nova Senha (deixe em branco para manter)' : 'Senha *'}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Mínimo 6 caracteres"
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Senha</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Repita a senha"
              />
              {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className="permissions-section">
            <label className="permissions-label">Permissões *</label>
            {errors.permissions && <span className="error-message">{errors.permissions}</span>}
            <div className="permissions-grid">
              {availablePermissions.map(permission => (
                <div 
                  key={permission.id} 
                  className={`permission-card ${selectedPermissions.includes(permission.id) ? 'selected' : ''}`}
                  onClick={() => handlePermissionToggle(permission.id)}
                >
                  <div className="permission-checkbox">
                    {selectedPermissions.includes(permission.id) ? '✓' : ''}
                  </div>
                  <div className="permission-info">
                    <span className="permission-title">{permission.label}</span>
                    <span className="permission-description">{permission.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/app/usuarios')}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            {isEditing ? 'Salvar Alterações' : 'Cadastrar Usuário'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UsuariosCadastro;
