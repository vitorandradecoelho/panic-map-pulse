import { initializeAuth, setToken, setZoneInStorage } from '../services/auth';

/**
 * Função para testar autenticação com token e zona específicos
 */
export const testAuthWithToken = async (token: string, zone: string) => {
  try {
    console.log('🧪 Testando autenticação com:', { 
      token: token.substring(0, 20) + '...', 
      zone 
    });
    
    // Definir token e zona manualmente
    setToken(token);
    setZoneInStorage(zone);
    
    // Inicializar autenticação
    const success = await initializeAuth(token, zone);
    
    if (success) {
      console.log('✅ Teste de autenticação bem-sucedido!');
      return true;
    } else {
      console.log('❌ Teste de autenticação falhou');
      return false;
    }
  } catch (error) {
    console.error('❌ Erro no teste de autenticação:', error);
    return false;
  }
};

// Adicionar função global para teste via console
(window as any).testAuth = () => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMzE0OjI5NzMiLCJ6bmUiOjUsImp0aSI6IjgyNzk5MTAiLCJpYXQiOjE3NTc5NTgyMDd9.klKOeLMWiAGgQQwmSMGUu6fThC-DJw0ZC__AnVP9X0I";
  const zone = "5";
  
  return testAuthWithToken(token, zone);
};

console.log('🧪 Para testar autenticação, execute: testAuth() no console');