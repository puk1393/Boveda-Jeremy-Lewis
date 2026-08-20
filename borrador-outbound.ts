type Resultado = { permitido: true; url: URL } | { permitido: false; motivo: string };

const destinos = [
  'https://api.banco.cr/v1/tipo-cambio',
  'https://10.0.1.50:9200/_search',
  'https://metrics.interno/health',
  'http://169.254.169.254/latest/meta-data/',
];

function esDestinoInterno(hostname: string): boolean {
  const host = hostname.toLowerCase();

  if (host === 'localhost' || host === '::1' || host === '0.0.0.0') {
    return true;
  }

  const partes = host.split('.').map(Number);

  if (
    partes.length === 4 &&
    partes.every((n) => Number.isInteger(n) && n >= 0 && n <= 255)
  ) {
    const [a, b] = partes;

    if (a === 10) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 0) return true;
  }

  return false;
}

function probar(titulo: string, fn: (e: string) => Resultado) {
  console.log('\n' + titulo);
  console.log('-'.repeat(62));
  for (const d of destinos) {
    const r = fn(d);
    console.log((r.permitido ? '  PASA  ' : 'BLOQUEA ') + d.padEnd(42) + (r.permitido ? '' : '<- ' + r.motivo));
  }
}

const HOSTS_PERMITIDOS = new Set([
  'api.banco.cr',
  'core.banco.cr',
  '10.0.1.50',        // agregado para el tablero
  'metrics.interno',  // agregado para las metricas
]);

probar('IT.4 allowlist exacta + solo https', (e) => {
  let url: URL;

  try {
    url = new URL(e);
  } catch {
    return { permitido: false, motivo: 'URL invalida' };
  }

  if (url.protocol !== 'https:') {
    return { permitido: false, motivo: 'Solo se permite https' };
  }

  // B.2: bloquear destinos internos ANTES de consultar la allowlist
  if (esDestinoInterno(url.hostname)) {
    return { permitido: false, motivo: 'Destino interno no permitido' };
  }

  if (!HOSTS_PERMITIDOS.has(url.hostname)) {
    return {
      permitido: false,
      motivo: 'Host no esta en la allowlist'
    };
  }

  return { permitido: true, url };
});