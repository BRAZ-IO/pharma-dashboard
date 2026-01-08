import api from './api';

const produtosService = {
  /**
   * Listar todos os produtos
   * @param {object} params - Parâmetros de filtro e paginação
   * @returns {Promise<{produtos: Array, total: number, pagina: number, totalPaginas: number}>}
   */
  async listar(params = {}) {
    try {
      const { data } = await api.get('/produtos', { params });
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Buscar produto por ID
   * @param {string} id 
   * @returns {Promise<object>}
   */
  async buscarPorId(id) {
    try {
      const { data } = await api.get(`/produtos/${id}`);
      return data.produto;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Buscar produto por código de barras
   * @param {string} codigoBarras 
   * @returns {Promise<object>}
   */
  async buscarPorCodigoBarras(codigoBarras) {
    try {
      const { data } = await api.get(`/produtos/codigo-barras/${codigoBarras}`);
      return data.produto;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Criar novo produto
   * @param {object} produto 
   * @returns {Promise<object>}
   */
  async criar(produto) {
    try {
      const { data } = await api.post('/produtos', produto);
      return data.produto;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Atualizar produto
   * @param {string} id 
   * @param {object} produto 
   * @returns {Promise<object>}
   */
  async atualizar(id, produto) {
    try {
      const { data } = await api.put(`/produtos/${id}`, produto);
      return data.produto;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Deletar produto
   * @param {string} id 
   * @returns {Promise<void>}
   */
  async deletar(id) {
    try {
      await api.delete(`/produtos/${id}`);
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Adicionar estoque
   * @param {string} id 
   * @param {number} quantidade 
   * @param {string} lote 
   * @param {string} dataValidade 
   * @returns {Promise<object>}
   */
  async adicionarEstoque(id, { quantidade, lote, dataValidade }) {
    try {
      const { data } = await api.post(`/produtos/${id}/estoque`, {
        quantidade,
        lote,
        data_validade: dataValidade
      });
      return data.estoque;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Tratar erros da API
   * @param {Error} error 
   * @returns {Error}
   */
  handleError(error) {
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error || 'Erro na requisição';
      return new Error(message);
    }
    
    if (error.request) {
      return new Error('Servidor não respondeu. Verifique sua conexão.');
    }
    
    return error;
  }
};

export default produtosService;
