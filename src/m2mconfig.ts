//##### PARA TESTES LOCAL, REMOVER OS COMENTARIOS DAS 2 LINHAS A SEGUIR
// const matcher = ["zn4"];
// const urlFila = `https://${matcher[0]}.m2mcontrol.com.br/`;

const urlFila = "";

// Função para obter a zone da URL, sessão ou localStorage
const getZoneValue = (): string => {
  // Primeiro, verifica parâmetros da URL
  const params = new URLSearchParams(window.location.search);
  const urlZone = params.get("zn");
  if (urlZone) {
    console.log("🔍 Zone obtida da URL:", urlZone);
    return urlZone;
  }

  // Segundo, verifica sessão
  const sessionZone = sessionStorage.getItem("zn");
  if (sessionZone) {
    console.log("🔍 Zone obtida da sessão:", sessionZone);
    return sessionZone;
  }

  // Terceiro, verifica localStorage
  const localZone = localStorage.getItem("zone");
  if (localZone) {
    console.log("🔍 Zone obtida do localStorage:", localZone);
    return localZone;
  }

  // Fallback para lógica original
  let ZONE = "zn4"; // valor por defeito alterado para zn4
  let origin = "https://dashboard-mobile.sinopticoplus.com/";
  let matcher: RegExpMatchArray | null = null;

  try {
    const origins = window.location.ancestorOrigins || [];
    origin = origins[0] || "";
    matcher = origin.match(/zn4|zn5|zn6|zn02|zn03|zn04|zn05|zn06|zn07|zn08|zn0/) || null;

    if (matcher && matcher[0]) {
      ZONE = matcher[0];
    } else {
      console.warn("Nenhuma zona correspondente encontrada na origem:", origin);
    }
  } catch (error) {
    console.warn("Erro ao tentar obter a origem do parent:", error);
  }

  console.log("🔍 Zone obtida do fallback:", ZONE);
  return ZONE;
};

// Função para construir as URLs dinamicamente
const buildApiUrls = (zoneValue: string) => {
  const SERVICE_API_HOST = `https://${zoneValue}.m2mcontrol.com.br`;
  const DASHBOARD_API_HOST = `${urlFila}`;
  const SERVICE = `https://${zoneValue}.m2mcontrol.com.br/api/controlePartida`;
  const VIAGEM_PLANEJAMENTO_API_HOST = zoneValue.includes("0")
      ? `https://planejamento-viagem-api-hmg.m2mcontrol.com.br`
      : `https://planejamento-viagem-api.sinopticoplus.com`;

  return {
    SERVICE_API: `${SERVICE_API_HOST}/service-api`,
    SERVICE: SERVICE,
    DASHBOARD_API: `${DASHBOARD_API_HOST}/api`,
    VIAGEM_PLANEJAMENTO_API: `${VIAGEM_PLANEJAMENTO_API_HOST}/planejamento-viagem-api`,
  };
};

// Obter zone atual e construir URLs
const zoneValue = getZoneValue();
console.log("🌐 Zone final utilizada:", zoneValue);

export const ApiPrefix = buildApiUrls(zoneValue);

// Função para atualizar as URLs quando a zone mudar
export const updateApiUrls = (newZone: string) => {
  console.log("🔄 Atualizando URLs da API para zone:", newZone);
  const newUrls = buildApiUrls(newZone);
  Object.assign(ApiPrefix, newUrls);
  console.log("✅ URLs atualizadas:", ApiPrefix);
};