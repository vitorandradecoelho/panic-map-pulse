# Sistema Completo de Autenticação

Este documento descreve o sistema completo de autenticação implementado na aplicação.

## 🏗️ Arquitetura

O sistema é composto por:

- **Services**: Lógica principal de autenticação e API
- **Hooks**: React hooks para gerenciamento de estado
- **Contexts**: Contexto global de autenticação
- **Components**: Telas de loading e erro
- **Utils**: Utilitários para facilitar o uso

## 📁 Estrutura de Arquivos

```
src/
├── services/
│   ├── auth.ts           # Serviço principal de autenticação
│   └── api.ts           # Configuração axios com interceptadores
├── hooks/
│   └── useAuth.ts       # Hook customizado de autenticação
├── contexts/
│   └── AuthContext.tsx  # Contexto global
├── components/
│   ├── LoadingScreen.tsx # Tela de carregamento
│   └── ErrorScreen.tsx   # Tela de erro
├── utils/
│   └── auth.ts          # Utilitários e constantes
└── m2mconfig.ts         # Configuração dinâmica de URLs
```

## 🚀 Como Usar

### 1. Inicialização Automática

A aplicação inicializa automaticamente tentando autenticar o usuário:

```typescript
// App.tsx - Já configurado
const App = () => {
  return (
    <AuthProvider>
      {/* Sua aplicação */}
    </AuthProvider>
  );
};
```

### 2. Usando o Hook de Autenticação

```typescript
import { useAuthContext } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { 
    isAuthenticated, 
    isLoading, 
    error, 
    cliente, 
    login, 
    logout 
  } = useAuthContext();

  if (isLoading) return <div>Carregando...</div>;
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Bem-vindo, {cliente.nomeUsuario}!</p>
      ) : (
        <p>Modo demo ativo</p>
      )}
    </div>
  );
};
```

### 3. Utilitários Rápidos

```typescript
import AuthUtils from '@/utils/auth';

// Verificações
const isLoggedIn = AuthUtils.isLoggedIn();
const isDemoMode = AuthUtils.isDemoMode();

// Dados do usuário
const userName = AuthUtils.getUserName();
const userId = AuthUtils.getUserId();
const companies = AuthUtils.getUserCompanies();

// Permissões
const hasAccess = AuthUtils.hasAccess('MODULO_VEICULOS');
const canAccessCompany = AuthUtils.hasCompanyAccess(123);
```

### 4. Hooks Específicos

```typescript
import { useRequireAuth, useCliente } from '@/contexts/AuthContext';

// Para componentes que precisam de autenticação
const { canAccess } = useRequireAuth();

// Para acessar dados do cliente
const { cliente, hasClientData } = useCliente();
```

## 🔧 Configuração

### URLs da API

As URLs são configuradas dinamicamente baseadas na zona:

```typescript
// m2mconfig.ts
const ApiPrefix = {
  SERVICE_API: "https://zn4.m2mcontrol.com.br/service-api",
  DASHBOARD_API: "https://zn4.m2mcontrol.com.br/api",
  // ... outras URLs
};
```

### Parâmetros de URL Suportados

- `?token=ABC123` - Token de autenticação
- `?zn=4` - Zona da aplicação (ignorado se sem ancestorOrigins)
- `#token=ABC123&zn=4` - Também suporta hash

## 🔐 Fluxo de Autenticação

1. **Captura de Parâmetros**: Token e zona são extraídos da URL
2. **Armazenamento**: Token no localStorage, zona no sessionStorage
3. **Configuração**: URLs da API são atualizadas com a zona
4. **Validação**: Chamada para `/user/data` para validar token
5. **Carregamento**: Dados do usuário são carregados e armazenados
6. **Estado**: App atualiza estado de autenticação

## 📊 Estados Possíveis

- **Autenticado**: Usuário logado com dados válidos
- **Demo**: Sem token, funcionando com dados mock
- **Loading**: Inicializando ou carregando dados
- **Erro**: Falha na autenticação (app continua em demo)

## 🛠️ Interceptadores HTTP

### Requisição
- Adiciona automaticamente `Authorization: Bearer {token}`
- Adiciona header `Zone: {zona}`
- Logs detalhados para debug

### Resposta
- Trata erro 401 limpando dados de autenticação
- Emite evento `auth:unauthorized`
- Logs de erro estruturados

## 🎯 Eventos Customizados

```typescript
// Escutar eventos de autenticação
window.addEventListener('auth:login', (event) => {
  console.log('Login realizado', event.detail);
});

window.addEventListener('auth:logout', () => {
  console.log('Logout realizado');
});

window.addEventListener('auth:unauthorized', () => {
  console.log('Token inválido');
});
```

## 📱 Exemplo Prático

```typescript
import { useAuthContext } from '@/contexts/AuthContext';
import AuthUtils from '@/utils/auth';

const Dashboard = () => {
  const { isAuthenticated, cliente } = useAuthContext();
  
  // Mostrar informações baseadas no estado
  if (AuthUtils.isDemoMode()) {
    return (
      <div className="demo-banner">
        ⚠️ Executando em modo demo
      </div>
    );
  }
  
  return (
    <div>
      <h1>Bem-vindo, {cliente.nomeUsuario}</h1>
      <p>Empresas: {cliente.empresas.join(', ')}</p>
      <p>Timezone: {cliente.gmtCliente}</p>
      
      {AuthUtils.hasAccess('ADMIN') && (
        <button>Área Administrativa</button>
      )}
    </div>
  );
};
```

## 🔍 Debug e Logs

O sistema gera logs detalhados para facilitar o debug:

```
🔄 Iniciando autenticação...
🔍 URL atual: https://app.com/?token=abc&zn=4
📋 Parâmetros detectados: { token: "PRESENTE", zone: "4" }
✅ Token salvo no localStorage
✅ Zone salva: 4
🌐 Carregando dados do usuário...
👤 Cliente configurado: { idCliente: 123, nomeUsuario: "João" }
✅ Autenticação concluída com sucesso
```

## 🚨 Tratamento de Erros

- **401 Unauthorized**: Limpa token e continua em modo demo
- **403 Forbidden**: Log de acesso negado
- **404 Not Found**: Log de recurso não encontrado
- **5xx Server Error**: Log de erro do servidor

## 💡 Melhores Práticas

1. **Sempre use o contexto** para acessar dados de autenticação
2. **Não armazene token em variáveis** - use as funções do serviço
3. **Verifique isDemoMode()** antes de fazer operações críticas
4. **Use AuthUtils** para verificações rápidas
5. **Escute eventos** para reagir a mudanças de autenticação

## 🔄 Compatibilidade

O sistema mantém compatibilidade com o código existente através de:

- `initGetLocalStorage()` - Alias para `initializeAuth()`
- Mesmas interfaces exportadas
- Mesmas funções de token management