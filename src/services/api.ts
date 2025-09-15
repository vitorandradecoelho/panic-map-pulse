import axios from "axios";
import { getToken, getZoneFromStorage, clearToken } from "./auth";

// Configuração base do Axios
const api = axios.create({
  timeout: 30000, // 30 segundos
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptador de requisição - adiciona token e zona automaticamente
api.interceptors.request.use(
  async (config) => {
    const token = getToken();
    const zone = getZoneFromStorage();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔐 Token adicionado à requisição");
    }
    
    if (zone) {
      config.headers.Zone = zone;
      console.log("🌐 Zone adicionada à requisição:", zone);
    }
    
    console.log("📤 Requisição:", {
      method: config.method?.toUpperCase(),
      url: config.url,
      hasToken: !!token,
      zone: zone
    });
    
    return config;
  },
  (error) => {
    console.error("❌ Erro no interceptador de requisição:", error);
    return Promise.reject(error);
  }
);

// Interceptador de resposta - trata erros de autenticação
api.interceptors.response.use(
  (response) => {
    console.log("📥 Resposta recebida:", {
      status: response.status,
      url: response.config.url,
      dataSize: JSON.stringify(response.data).length
    });
    return response;
  },
  (error) => {
    const { response, config } = error;
    
    console.error("❌ Erro na resposta:", {
      status: response?.status,
      url: config?.url,
      message: error.message
    });
    
    // Tratar erro 401 - Token expirado ou inválido
    if (response?.status === 401) {
      console.warn("🚫 Token inválido ou expirado - limpando autenticação");
      clearToken();
      
      // Opcional: emitir evento para components reagirem
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      
      console.warn("⚠️ Executando em modo demo após falha na autenticação");
    }
    
    // Tratar outros erros comuns
    if (response?.status === 403) {
      console.warn("🔒 Acesso negado - permissões insuficientes");
    }
    
    if (response?.status === 404) {
      console.warn("📭 Recurso não encontrado:", config?.url);
    }
    
    if (response?.status >= 500) {
      console.error("🚨 Erro interno do servidor");
    }
    
    return Promise.reject(error);
  }
);

export default api;