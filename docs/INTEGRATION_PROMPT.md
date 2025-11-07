# Prompt de Integração - Sistema de Autenticação via Token e Roteamento QueryString

Este documento serve como prompt completo para implementar o sistema de autenticação via token e roteamento por queryString em outros projetos.

---

## 📋 Visão Geral do Sistema

O sistema implementa:
1. **Autenticação via Token JWT** passado por URL
2. **Seleção de Zona/Ambiente** via parâmetro `zn`
3. **Roteamento via QueryString** usando parâmetro `pg`
4. **Modo Demo** quando não há autenticação

---

## 🎯 Requisitos do Sistema

Implemente um sistema de autenticação e roteamento que:

1. **Capture token e zona da URL** (suporte a query string e hash)
   - Formato: `?token=JWT_TOKEN&zn=5` ou `#token=JWT_TOKEN&zn=5`
   - Token: JWT para autenticação
   - Zona (zn): número que determina o ambiente/servidor

2. **Armazene credenciais localmente**
   - Token no `localStorage`
   - Zona no `sessionStorage` (prioritário) e `localStorage` (fallback)

3. **Configure URLs da API dinamicamente** baseado na zona
   - Exemplo: zona 5 → `https://zn5.m2mcontrol.com.br`

4. **Valide o token** fazendo chamada para `/user/data`
   - Carregue dados do usuário (nome, empresas, acessos, timezone)
   - Configure idioma e início do dia operacional

5. **Suporte roteamento via queryString**
   - Parâmetro `pg` indica a página destino
   - Remova `pg` e mantenha outros parâmetros ao redirecionar

6. **Opere em modo demo** quando não houver token
   - Não bloqueie acesso, apenas indique modo demo

---

## 🏗️ Estrutura de Arquivos

```
src/
├── services/
│   ├── auth.ts              # Serviço principal de autenticação
│   └── api.ts              # Cliente axios com interceptadores
├── contexts/
│   └── AuthContext.tsx     # Contexto React de autenticação
├── hooks/
│   └── useAuth.ts          # Hook customizado
├── pages/
│   └── Index.tsx           # Página inicial com roteamento
├── utils/
│   └── auth.ts             # Utilitários auxiliares
└── m2mconfig.ts            # Configuração de URLs por zona
```

---

## 📝 Implementação Detalhada

### 1. Configuração de Zonas (m2mconfig.ts)

```typescript
// Mapeamento de URLs por zona
const zoneConfigs = {
  zn1: "https://zn1.m2mcontrol.com.br",
  zn2: "https://zn2.m2mcontrol.com.br",
  zn3: "https://zn3.m2mcontrol.com.br",
  zn4: "https://zn4.m2mcontrol.com.br",
  zn5: "https://zn5.m2mcontrol.com.br"
};

export const ApiPrefix = {
  SERVICE_API: "https://zn4.m2mcontrol.com.br/service-api",
  DASHBOARD_API: "https://zn4.m2mcontrol.com.br/api",
  // ... outras URLs
};

export const updateApiUrls = (zone: string) => {
  const baseUrl = zoneConfigs[zone] || zoneConfigs.zn4;
  ApiPrefix.SERVICE_API = `${baseUrl}/service-api`;
  ApiPrefix.DASHBOARD_API = `${baseUrl}/api`;
  // Atualize todas as URLs necessárias
};
```

### 2. Serviço de Autenticação (services/auth.ts)

```typescript
// Interfaces
export interface ICliente {
  idCliente: number;
  gmtCliente: string;
  nomeUsuario: string;
  idUsuario: string;
  empresas: number[];
  acessos: Record<string, unknown>[];
  inicioDiaOperacional: string;
}

export interface IAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Estado global
let token: string | null = null;
let authState: IAuthState = {
  isAuthenticated: false,
  isLoading: false,
  error: null
};

const cliente: ICliente = {
  idCliente: 0,
  acessos: [],
  empresas: [],
  gmtCliente: "",
  nomeUsuario: "",
  idUsuario: "",
  inicioDiaOperacional: "00:00:00",
};

// Extração de parâmetros da URL
const extractUrlParams = (): { token: string | null; zone: string | null } => {
  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  
  const token = urlParams.get("token") || hashParams.get("token");
  const zone = urlParams.get("zn") || hashParams.get("zn");
  
  return { token, zone };
};

// Gerenciamento de zona
export const getZoneFromStorage = (): string | null => {
  return sessionStorage.getItem("zn") || localStorage.getItem("zone");
};

export const setZoneInStorage = (zone: string): void => {
  sessionStorage.setItem("zn", zone);
  localStorage.setItem("zone", zone);
};

// Inicialização da autenticação
export const initializeAuth = async (
  urlToken?: string | null,
  urlZone?: string | null
): Promise<boolean> => {
  try {
    authState.isLoading = true;
    authState.error = null;

    console.log("🔄 Iniciando autenticação...");
    
    // Extrair parâmetros da URL
    if (!urlToken || !urlZone) {
      const params = extractUrlParams();
      urlToken = urlToken || params.token;
      urlZone = urlZone || params.zone;
    }

    // Gerenciar token
    if (urlToken) {
      setToken(urlToken);
      console.log("✅ Token salvo");
    } else {
      token = getToken();
      console.log("📦 Token recuperado do storage");
    }

    // Gerenciar zona e atualizar URLs da API
    if (urlZone) {
      setZoneInStorage(urlZone);
      console.log("✅ Zona salva:", urlZone);
      
      const { updateApiUrls } = await import("../m2mconfig");
      const zoneWithPrefix = urlZone.startsWith("zn") ? urlZone : `zn${urlZone}`;
      updateApiUrls(zoneWithPrefix);
    }

    if (!token) {
      console.warn("⚠️ Modo demo - sem token");
      authState.isAuthenticated = false;
      return false;
    }

    // Validar token e carregar dados
    await loadUserData();
    
    authState.isAuthenticated = true;
    console.log("✅ Autenticação completa");
    return true;

  } catch (error) {
    console.error("❌ Erro na autenticação:", error);
    authState.error = error instanceof Error ? error.message : "Erro desconhecido";
    authState.isAuthenticated = false;
    return false;
  } finally {
    authState.isLoading = false;
  }
};

// Carregar dados do usuário
const loadUserData = async (): Promise<void> => {
  console.log("🌐 Carregando dados do usuário...");
  
  const response = await api.get(`${ApiPrefix.SERVICE_API}/user/data`);

  // Processar resposta da API
  cliente.idCliente = response.data.cli?.id || 0;
  cliente.gmtCliente = response.data.cli?.tz || "America/Fortaleza";
  cliente.acessos = response.data.user?.acss || [];
  cliente.empresas = response.data.user?.emp || [];
  cliente.nomeUsuario = response.data.user?.nm || "";
  cliente.idUsuario = response.data.user?.id || "";

  console.log("👤 Cliente configurado:", {
    idCliente: cliente.idCliente,
    nomeUsuario: cliente.nomeUsuario
  });
};

// Gerenciamento de token
export const getToken = (): string | null => {
  if (!token) {
    token = localStorage.getItem("token");
  }
  return token;
};

export const setToken = (newToken: string): void => {
  token = newToken;
  localStorage.setItem("token", newToken);
  authState.isAuthenticated = true;
};

export const clearToken = (): void => {
  token = null;
  localStorage.removeItem("token");
  sessionStorage.removeItem("zn");
  localStorage.removeItem("zone");
  authState.isAuthenticated = false;
  
  // Limpar dados do cliente
  Object.assign(cliente, {
    idCliente: 0,
    acessos: [],
    empresas: [],
    gmtCliente: "",
    nomeUsuario: "",
    idUsuario: "",
    inicioDiaOperacional: "00:00:00"
  });
};

// Exports
export const getClienteLocalStorage = (): ICliente => cliente;
export const isAuthenticated = (): boolean => !!getToken();
export const getAuthState = (): IAuthState => ({ ...authState });
export const logout = (): void => clearToken();
```

### 3. Cliente API com Interceptadores (services/api.ts)

```typescript
import axios from 'axios';
import { getToken, getZoneFromStorage, clearToken } from './auth';

const api = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptador de requisição - adiciona token e zona
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    const zone = getZoneFromStorage();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (zone) {
      config.headers['Zone'] = zone;
    }

    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Erro na requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptador de resposta - trata erros de autenticação
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, config } = error.response;
      
      if (status === 401) {
        console.warn('⚠️ Token inválido - limpando autenticação');
        clearToken();
        window.dispatchEvent(new CustomEvent('auth:unauthorized'));
      }
      
      console.error(`❌ ${status} ${config.url}`);
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

### 4. Contexto de Autenticação (contexts/AuthContext.tsx)

```typescript
import React, { createContext, useContext } from 'react';
import { useAuth, UseAuthReturn } from '@/hooks/useAuth';

const AuthContext = createContext<UseAuthReturn | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = (): UseAuthReturn => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext deve ser usado dentro de AuthProvider');
  }
  
  return context;
};

// Hook auxiliar para verificar autenticação
export const useRequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuthContext();
  
  return {
    isAuthenticated,
    isLoading,
    canAccess: isAuthenticated || !isLoading
  };
};
```

### 5. Hook useAuth (hooks/useAuth.ts)

```typescript
import { useState, useEffect } from 'react';
import {
  initializeAuth,
  logout as authLogout,
  getAuthState,
  getClienteLocalStorage,
  ICliente,
  IAuthState
} from '@/services/auth';

export interface UseAuthReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  cliente: ICliente;
  login: (token?: string, zone?: string) => Promise<boolean>;
  logout: () => void;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState<IAuthState>(getAuthState());
  const [cliente, setCliente] = useState<ICliente>(getClienteLocalStorage());

  useEffect(() => {
    // Inicializar autenticação
    const init = async () => {
      try {
        await initializeAuth();
        setAuthState(getAuthState());
        setCliente(getClienteLocalStorage());
      } catch (error) {
        console.error('Erro na inicialização:', error);
      }
    };

    init();

    // Listener para eventos de autenticação
    const handleUnauthorized = () => {
      setAuthState(getAuthState());
      setCliente(getClienteLocalStorage());
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (token?: string, zone?: string): Promise<boolean> => {
    try {
      const success = await initializeAuth(token, zone);
      setAuthState(getAuthState());
      setCliente(getClienteLocalStorage());
      return success;
    } catch {
      return false;
    }
  };

  const logout = () => {
    authLogout();
    setAuthState(getAuthState());
    setCliente(getClienteLocalStorage());
  };

  const refresh = async () => {
    await login();
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    error: authState.error,
    cliente,
    login,
    logout,
    refresh,
    clearError
  };
};
```

### 6. Página Inicial com Roteamento (pages/Index.tsx)

```typescript
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Sistema de roteamento via queryString
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const page = urlParams.get('pg');

    if (page) {
      // Mapeamento de códigos de página para rotas
      const pageRoutes: Record<string, string> = {
        'dashboardPanico': '/dashboardPanico',
        'dashboardCAN': '/dashboardCAN',
        'criticalMonitoring': '/critical-monitoring',
        'alertas': '/alertas'
      };

      const targetRoute = pageRoutes[page];
      if (targetRoute) {
        // Remove 'pg' mas mantém outros parâmetros (token, zn, etc)
        urlParams.delete('pg');
        const remainingParams = urlParams.toString();
        const finalRoute = remainingParams 
          ? `${targetRoute}?${remainingParams}` 
          : targetRoute;

        console.log(`🔄 Redirecionando para: ${finalRoute}`);
        navigate(finalRoute);
      }
    }
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen">
      <h1>Sistema de Monitoramento</h1>
      {/* Seu conteúdo aqui */}
    </div>
  );
};

export default Index;
```

### 7. Integração no App.tsx

```typescript
import { AuthProvider } from '@/contexts/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboardPanico" element={<DashboardPanico />} />
          <Route path="/dashboardCAN" element={<DashboardCAN />} />
          {/* Outras rotas */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

---

## 🔧 Utilitários Opcionais (utils/auth.ts)

```typescript
import { 
  getToken, 
  isAuthenticated, 
  getClienteLocalStorage,
  getZoneFromStorage 
} from '@/services/auth';

const AuthUtils = {
  // Verificações
  isLoggedIn: (): boolean => isAuthenticated(),
  isDemoMode: (): boolean => !isAuthenticated(),
  
  // Dados do usuário
  getUserName: (): string => getClienteLocalStorage().nomeUsuario || "Usuário",
  getUserId: (): string => getClienteLocalStorage().idUsuario || "",
  getUserCompanies: (): number[] => getClienteLocalStorage().empresas || [],
  getTimezone: (): string => getClienteLocalStorage().gmtCliente || "America/Fortaleza",
  
  // Token e zona
  getToken: (): string | null => getToken(),
  getZone: (): string | null => getZoneFromStorage(),
  
  // Permissões
  hasAccess: (module: string): boolean => {
    const acessos = getClienteLocalStorage().acessos;
    return acessos.some((a: any) => a.modulo === module);
  },
  
  hasCompanyAccess: (companyId: number): boolean => {
    const empresas = getClienteLocalStorage().empresas;
    return empresas.includes(companyId);
  }
};

export default AuthUtils;
```

---

## 📚 Exemplos de Uso

### Exemplo 1: URLs Aceitas

```
✅ Com query string
https://app.com/?token=eyJhbG...&zn=5

✅ Com hash
https://app.com/#token=eyJhbG...&zn=5

✅ Com roteamento
https://app.com/?pg=dashboardPanico&token=eyJhbG...&zn=5

✅ Sem autenticação (modo demo)
https://app.com/
```

### Exemplo 2: Fluxo de Roteamento

```
URL Inicial:
https://app.com/?pg=dashboardCAN&token=ABC&zn=5&filtro=critico

Processamento:
1. Index captura pg=dashboardCAN
2. Remove 'pg' da URL
3. Redireciona para: /dashboardCAN?token=ABC&zn=5&filtro=critico

Resultado:
- Usuário vai para dashboard CAN
- Token e zona são processados
- Parâmetro 'filtro' é preservado
```

### Exemplo 3: Usando em Componentes

```typescript
import { useAuthContext } from '@/contexts/AuthContext';
import AuthUtils from '@/utils/auth';

const MyComponent = () => {
  const { isAuthenticated, cliente, logout } = useAuthContext();
  
  return (
    <div>
      {AuthUtils.isDemoMode() && (
        <div className="demo-banner">
          ⚠️ Modo Demo Ativo
        </div>
      )}
      
      {isAuthenticated && (
        <div>
          <p>Bem-vindo, {cliente.nomeUsuario}!</p>
          <p>Timezone: {cliente.gmtCliente}</p>
          <button onClick={logout}>Sair</button>
        </div>
      )}
    </div>
  );
};
```

---

## 🎯 Checklist de Implementação

- [ ] Criar estrutura de arquivos (services, contexts, hooks)
- [ ] Implementar m2mconfig.ts com mapeamento de zonas
- [ ] Criar serviço de autenticação (auth.ts)
- [ ] Configurar cliente API com interceptadores (api.ts)
- [ ] Implementar contexto de autenticação (AuthContext.tsx)
- [ ] Criar hook useAuth (useAuth.ts)
- [ ] Adicionar roteamento por queryString na página inicial
- [ ] Integrar AuthProvider no App.tsx
- [ ] Testar fluxo com token e zona válidos
- [ ] Testar modo demo (sem token)
- [ ] Testar roteamento via parâmetro pg
- [ ] Implementar utilitários auxiliares (opcional)

---

## 🐛 Troubleshooting

### Token não é salvo
- Verifique se localStorage está disponível
- Confirme que extractUrlParams está encontrando o token
- Verifique console logs: "✅ Token salvo"

### Zona não atualiza URLs
- Confirme que updateApiUrls está sendo chamado
- Verifique se o formato é "zn5" e não apenas "5"
- Confirme que m2mconfig tem a zona configurada

### Roteamento não funciona
- Verifique se pageRoutes tem a rota mapeada
- Confirme que outros parâmetros não são removidos
- Verifique console: "🔄 Redirecionando para:"

### Modo demo não ativa
- Confirme que initializeAuth retorna false quando sem token
- Verifique se isAuthenticated está correto
- Use AuthUtils.isDemoMode() para verificar

---

## 📖 Referências

- Documentação completa: `/docs/AUTHENTICATION.md`
- Testes: `/src/utils/testAuth.ts`
- Exemplo prático: `/src/pages/Index.tsx`

---

## 🚀 Resultado Esperado

Após implementação completa:

1. **Usuário acessa com token/zona**: Sistema autentica automaticamente
2. **Usuário acessa sem token**: Sistema funciona em modo demo
3. **Usuário acessa com pg**: Sistema redireciona mantendo parâmetros
4. **Token expira**: Sistema limpa automaticamente e emite evento
5. **Requisições API**: Incluem automaticamente token e zona nos headers
6. **Estado global**: Mantém dados do usuário acessíveis em toda aplicação

---

## 💡 Customizações Comuns

### Adicionar novo endpoint de zona

```typescript
// m2mconfig.ts
const zoneConfigs = {
  // ... existentes
  zn6: "https://zn6.m2mcontrol.com.br"
};
```

### Adicionar nova rota via queryString

```typescript
// pages/Index.tsx
const pageRoutes: Record<string, string> = {
  // ... existentes
  'novaRota': '/nova-rota'
};
```

### Adicionar validação de permissão

```typescript
// utils/auth.ts
hasFeatureAccess: (feature: string): boolean => {
  const acessos = getClienteLocalStorage().acessos;
  return acessos.some((a: any) => a.feature === feature && a.enabled);
}
```

---

**Última atualização**: 2025-01-07
**Versão**: 1.0.0
