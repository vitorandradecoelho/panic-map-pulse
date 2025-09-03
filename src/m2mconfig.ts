//##### PARA TESTES LOCAL, REMOVER OS COMENTARIOS DAS 2 LINHAS A SEGUIR
// const matcher = ["zn4"];
// const urlFila = `https://${matcher[0]}.m2mcontrol.com.br/`;

const urlFila = "";

let ZONE = "zn0"; // valor por defeito
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

const zoneValue = ZONE;

const SERVICE_API_HOST = `https://${zoneValue}.m2mcontrol.com.br`;
const DASHBOARD_API_HOST = `${urlFila}`;
const SERVICE = `https://${zoneValue}.m2mcontrol.com.br/api/controlePartida`;
const VIAGEM_PLANEJAMENTO_API_HOST = zoneValue.includes("0")
    ? `https://planejamento-viagem-api-hmg.m2mcontrol.com.br`
    : `https://planejamento-viagem-api.sinopticoplus.com`;
export const ApiPrefix = {
  SERVICE_API: `${SERVICE_API_HOST}/service-api`,
  SERVICE: SERVICE,
  DASHBOARD_API: `${DASHBOARD_API_HOST}/api`,
  VIAGEM_PLANEJAMENTO_API: `${VIAGEM_PLANEJAMENTO_API_HOST}/planejamento-viagem-api`,
};