import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProdutosCadastro = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    name: '',
    barcode: '',
    category: '',
    manufacturer: '',
    description: '',
    price: '',
    stock: '',
    minStock: '',
    maxStock: '',
    unit: 'comprimido',
    status: 'ativo'
  });

  const [errors, setErrors] = useState({});

  const produtos = [
    { id: 1, name: 'Paracetamol 750mg', price: 12.50, stock: 45, category: 'Analgésico', barcode: '7891234567890', status: 'ativo', description: 'Analgésico e antitérmico indicado para dores leves a moderadas e febre.', manufacturer: 'EMS', minStock: 10, maxStock: 100, unit: 'comprimido' },
    { id: 2, name: 'Dipirona 500mg', price: 8.90, stock: 32, category: 'Analgésico', barcode: '7891234567891', status: 'ativo', description: 'Analgésico e antitérmico para dores e febre.', manufacturer: 'Medley', minStock: 15, maxStock: 80, unit: 'comprimido' },
    { id: 3, name: 'Amoxicilina 500mg', price: 15.80, stock: 28, category: 'Antibiótico', barcode: '7891234567892', status: 'ativo', description: 'Antibiótico de amplo espectro para infecções bacterianas.', manufacturer: 'Eurofarma', minStock: 10, maxStock: 60, unit: 'cápsula' },
    { id: 4, name: 'Ibuprofeno 400mg', price: 18.50, stock: 15, category: 'Anti-inflamatório', barcode: '7891234567893', status: 'ativo', description: 'Anti-inflamatório não esteroidal para dores e inflamações.', manufacturer: 'Neo Química', minStock: 8, maxStock: 50, unit: 'comprimido' },
    { id: 5, name: 'Vitamina D3', price: 35.90, stock: 22, category: 'Vitamina', barcode: '7891234567894', status: 'ativo', description: 'Suplemento vitamínico para fortalecimento ósseo.', manufacturer: 'Sundown', minStock: 5, maxStock: 40, unit: 'cápsula' },
    { id: 6, name: 'Omeprazol 20mg', price: 22.30, stock: 18, category: 'Antiácido', barcode: '7891234567895', status: 'ativo', description: 'Inibidor de bomba de prótons para tratamento de úlceras e refluxo.', manufacturer: 'Aché', minStock: 10, maxStock: 50, unit: 'cápsula' },
    { id: 7, name: 'Loratadina 10mg', price: 25.80, stock: 35, category: 'Antialérgico', barcode: '7891234567896', status: 'ativo', description: 'Anti-histamínico para alergias e rinite.', manufacturer: 'Cimed', minStock: 12, maxStock: 60, unit: 'comprimido' },
    { id: 8, name: 'Ácido Fólico 5mg', price: 28.90, stock: 12, category: 'Vitamina', barcode: '7891234567897', status: 'inativo', description: 'Vitamina do complexo B essencial para gestantes.', manufacturer: 'Vitamedic', minStock: 5, maxStock: 30, unit: 'comprimido' },
  ];

  const categories = ['Analgésico', 'Antibiótico', 'Anti-inflamatório', 'Vitamina', 'Antiácido', 'Antialérgico'];
  const units = ['comprimido', 'cápsula', 'ml', 'mg', 'unidade', 'frasco', 'ampola'];

  useEffect(() => {
    if (isEditing) {
      const produto = produtos.find(p => p.id === parseInt(id));
      if (produto) {
        setFormData({
          name: produto.name,
          barcode: produto.barcode,
          category: produto.category,
          manufacturer: produto.manufacturer,
          description: produto.description,
          price: produto.price.toString(),
          stock: produto.stock.toString(),
          minStock: produto.minStock.toString(),
          maxStock: produto.maxStock.toString(),
          unit: produto.unit,
          status: produto.status
        });
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

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.barcode.trim()) newErrors.barcode = 'Código de barras é obrigatório';
    if (!formData.category) newErrors.category = 'Categoria é obrigatória';
    if (!formData.manufacturer.trim()) newErrors.manufacturer = 'Fabricante é obrigatório';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Preço deve ser maior que zero';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Estoque não pode ser negativo';
    if (!formData.minStock || parseInt(formData.minStock) < 0) newErrors.minStock = 'Estoque mínimo não pode ser negativo';
    if (!formData.maxStock || parseInt(formData.maxStock) <= 0) newErrors.maxStock = 'Estoque máximo deve ser maior que zero';
    
    if (parseInt(formData.minStock) >= parseInt(formData.maxStock)) {
      newErrors.minStock = 'Estoque mínimo deve ser menor que o máximo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;

    console.log('Dados do formulário:', formData);
    alert(isEditing ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!');
    navigate('/app/produtos');
  };

  return (
    <div className="produto-cadastro">
      <div className="produto-cadastro-header">
        <h2>{isEditing ? 'Editar Produto' : 'Novo Produto'}</h2>
        <button 
          className="btn-secondary"
          onClick={() => navigate('/app/produtos')}
        >
          Cancelar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="produto-form">
        <div className="form-section">
          <h3>Informações Básicas</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Nome do Produto *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder="Ex: Paracetamol 750mg"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="barcode">Código de Barras *</label>
              <input
                type="text"
                id="barcode"
                name="barcode"
                value={formData.barcode}
                onChange={handleChange}
                className={errors.barcode ? 'error' : ''}
                placeholder="Ex: 7891234567890"
              />
              {errors.barcode && <span className="error-message">{errors.barcode}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Categoria *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Selecione...</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="manufacturer">Fabricante *</label>
              <input
                type="text"
                id="manufacturer"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                className={errors.manufacturer ? 'error' : ''}
                placeholder="Ex: EMS"
              />
              {errors.manufacturer && <span className="error-message">{errors.manufacturer}</span>}
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Descrição do produto..."
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Preço e Estoque</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="price">Preço (R$) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={errors.price ? 'error' : ''}
                step="0.01"
                min="0"
                placeholder="0,00"
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="unit">Unidade *</label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
              >
                {units.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="stock">Estoque Atual *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                className={errors.stock ? 'error' : ''}
                min="0"
                placeholder="0"
              />
              {errors.stock && <span className="error-message">{errors.stock}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="minStock">Estoque Mínimo *</label>
              <input
                type="number"
                id="minStock"
                name="minStock"
                value={formData.minStock}
                onChange={handleChange}
                className={errors.minStock ? 'error' : ''}
                min="0"
                placeholder="0"
              />
              {errors.minStock && <span className="error-message">{errors.minStock}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="maxStock">Estoque Máximo *</label>
              <input
                type="number"
                id="maxStock"
                name="maxStock"
                value={formData.maxStock}
                onChange={handleChange}
                className={errors.maxStock ? 'error' : ''}
                min="1"
                placeholder="0"
              />
              {errors.maxStock && <span className="error-message">{errors.maxStock}</span>}
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
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/app/produtos')}>
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            {isEditing ? 'Salvar Alterações' : 'Cadastrar Produto'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProdutosCadastro;
