const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  empresa_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'empresas',
      key: 'id'
    }
  },
  nome: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Nome é obrigatório' },
      len: { args: [3, 255], msg: 'Nome deve ter entre 3 e 255 caracteres' }
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: { msg: 'Este email já está cadastrado' },
    validate: {
      isEmail: { msg: 'Email inválido' },
      notEmpty: { msg: 'Email é obrigatório' }
    }
  },
  senha: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Senha é obrigatória' },
      len: { args: [6, 255], msg: 'Senha deve ter no mínimo 6 caracteres' }
    }
  },
  cpf: {
    type: DataTypes.STRING(14),
    unique: true,
    allowNull: true
  },
  telefone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  cargo: {
    type: DataTypes.STRING(100),
    defaultValue: 'Funcionário'
  },
  role: {
    type: DataTypes.ENUM('admin', 'gerente', 'funcionario'),
    defaultValue: 'funcionario'
  },
  ativo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  avatar_url: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ultimo_login: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'usuarios',
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.senha) {
        usuario.senha = await bcrypt.hash(usuario.senha, 10);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('senha')) {
        usuario.senha = await bcrypt.hash(usuario.senha, 10);
      }
    }
  }
});

Usuario.prototype.validarSenha = async function(senha) {
  return await bcrypt.compare(senha, this.senha);
};

Usuario.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.senha;
  return values;
};

module.exports = Usuario;
