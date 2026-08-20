# Postura de seguridad - Boveda

Documento entregable de la Practica 3, y el mismo que pide el Proyecto Final.No es un resumen de lo que hiciste: es la declaracion de que controlas cada
riesgo o de que lo aceptaste a sabiendas. Un riesgo aceptado y escrito es ingenieria; un riesgo no visto es negligencia. La diferencia es este documento.

Regla para llenarlo: cada fila necesita una **prueba** que la respalde. Si no podes nombrar el comando que la verifica, ese control no esta cubierto -- y eso
va en la seccion de riesgos aceptados, no escondido.

## 1. Cobertura de controles

Una fila por control. En "Como se verifica" va el comando exacto, no una idea.

| # | Control | Donde vive (archivo) | Como se verifica (comando) | Estado |
|---|---|---|---|---|
| 1 | Sesion validada en servidor por render | src/app/page.tsx, src/lib/session.ts | `npm run build` / aparece como ƒ | Cubierto |
| 2 | Ninguna ruta autenticada estatica | src/app/auditoria, src/app/solicitudes | `npm run build` /auditoria, /solicitudes y /solicitudes/[id] aparecen como ƒ  | Cubierto |
| 3 | Acceso a datos solo tras el repositorio | src/lib/db.ts, src/lib/repository.ts | npm run test:p3 | Cubierto |
| 4 | `ResultadoAccion` uniforme, sin filtrar detalle | src/lib/errors.ts, acciones de servidor | npm run test:p3 | Cubierto |
| 5 | `error.tsx` no renderiza `error.message` | src/app/error.tsx | npm run test:p3 | Cubierto |
| 6 | Allowlist anti-SSRF en fetch de servidor | src/lib/outbound.ts | `npx vitest run tests/unit/practica-3/extra/outbound.test.ts` | Cubierto |
| 7 | Autorizacion pegada al dato (sin IDOR) | src/lib/authz.ts + rutas de solicitudes | `npm run e2e` | Cubierto |
| 8 | Doble control (el creador no aprueba) | src/lib/authz.ts | `npm run test:authz` | Cubierto |
| 9 | Cookie de sesion endurecida | src/lib/session.ts | `npm run e2e` | Cubierto |
| 10 | Middleware como capa, no como borde | src/middleware.ts | `npm run e2e` | Cubierto |

Estado: `Cubierto` / `Parcial` / `No cubierto`. Si es parcial, decir que falta.

### Evidencia del build

El resultado de `npm run build` clasificó las rutas de la siguiente manera:

- `ƒ /`
- `ƒ /auditoria`
- `ƒ /solicitudes`
- `ƒ /solicitudes/[id]`
- `○ /_not-found`
- `○ /login`
- `○ /no-autorizado`

La ruta `/` es dinámica porque `src/app/page.tsx` ejecuta `verificarSesion()` para decidir si redirige a `/solicitudes` o `/login`.
No fue declarada manualmente como dinámica; Next.js detecta la dependencia de la sesión.

## 2. Riesgos aceptados

Lo que decidiste NO cerrar, y por que. Esta seccion vale tanto como la anterior.
Para cada uno: cual es el riesgo, por que se acepta, y que lo compensa mientras tanto.

| Riesgo | Por que se acepta | Que lo compensa | Cuando se revisa |
|---|---|---|---|
| DNS rebinding en el fetch saliente | La defensa actual valida el destino y bloquea hosts e IPs internos, pero no garantiza completamente que la resolucion DNS no cambie entre la validacion y la conexion. | Allowlist estricta y bloqueo de destinos internos antes de realizar el fetch. | En una siguiente iteracion, implementando una validacion de la IP efectiva justo antes de conectar. |

## 3. Evidencia

Como se corrio y que dio. Pegar la salida real, no de memoria.

```
npm run test:p3    -> 
    ✓ tests/unit/practica-2/base/schemas.test.ts (7 tests) 19ms
    ✓ tests/unit/practica-1/base/tokens.test.ts (7 tests) 50ms
    ✓ tests/unit/practica-1/extra/refresh.test.ts (5 tests) 53ms
    ✓ tests/unit/practica-3/extra/outbound.test.ts (6 tests) 8ms
    ✓ tests/unit/practica-2/base/authz.test.ts (13 tests) 24ms
    ✓ tests/unit/practica-3/base/ssr-y-costura.test.ts (15 tests) 23ms
    ✓ tests/unit/practica-2/extra/authz-efecto.test.ts (5 tests) 9ms

    Test Files  7 passed (7)
        Tests  58 passed (58)
    Start at  20:25:32
    Duration  2.65s (transform 409ms, setup 0ms, import 6.45s, tests 185ms, environment 1ms)

npm run e2e        ->
    > frontend-empresarial-seguro@1.0.0 e2e
    > playwright test --reporter=line


    Running 9 tests using 1 worker
    9 passed (11.8s)

npm run build      ->  
    > frontend-empresarial-seguro@1.0.0 build
    > next build

    ▲ Next.js 16.3.0 (Turbopack)
    - Environments: .env.local, .env
    ✓ Running next.config.ts took 52ms

    Creating an optimized production build ...
    ✓ Compiled successfully in 1325ms
    ✓ Finished TypeScript in 612ms    
    ✓ Collecting page data using 5 workers in 2.7s    
    ✓ Generating static pages using 5 workers (5/5) in 283ms
    ✓ Finalizing page optimization in 38ms    

    Route (app)
    ┌ ƒ /
    ├ ○ /_not-found
    ├ ƒ /auditoria
    ├ ○ /login
    ├ ○ /no-autorizado
    ├ ƒ /solicitudes
    └ ƒ /solicitudes/[id]

    ƒ Proxy (Middleware)

    ○  (Static)   prerendered as static content
    ƒ  (Dynamic)  server-rendered on demand

npm run grade ->
     > frontend-empresarial-seguro@1.0.0 grade
     > node grading/grade.mjs


     === Calificación de aceptación · Bóveda ===
     Objetivo: http://localhost:3000

     — Chequeos HTTP —
     [PASA] (c1) login_disponible — HTTP 200
     [PASA] (c2) ruta_protegida_redirige — HTTP 307 → /login
     [PASA] (c2) auditoria_protegida — HTTP 307
     [PASA] (c3) estado_403_existe — HTTP 200
     [FALLA] (c4) cabecera_Content-Security-Policy — ausente
     [PASA] (c4) cabecera_Strict-Transport-Security — max-age=63072000; includeSubDomains; preload
     [PASA] (c4) cabecera_X-Content-Type-Options — nosniff
     [PASA] (c4) cabecera_Referrer-Policy — strict-origin-when-cross-origin
     [FALLA] (c4) csp_con_nonce — sin nonce

     HTTP smoke: 7/9 pasan

     — Chequeos E2E (Playwright) —

     Running 12 tests using 1 worker

     ✓   1 [chromium] › grading\acceptance.spec.ts:16:3 › Criterio 1 — flujo de autenticación › [c1] login válido crea sesión con cookie httpOnly (819ms)
     ✓   2 [chromium] › grading\acceptance.spec.ts:24:3 › Criterio 1 — flujo de autenticación › [c1] credenciales inválidas no autentican y dan mensaje uniforme (453ms)
     ✓   3 [chromium] › grading\acceptance.spec.ts:33:3 › Criterio 1 — flujo de autenticación › [c1] logout invalida la sesión (1.0s)
     ✓   4 [chromium] › grading\acceptance.spec.ts:43:3 › Criterio 2 — rutas privadas y validación por rol › [c2] ruta protegida sin sesión redirige a login (500ms)
     ✓   5 [chromium] › grading\acceptance.spec.ts:48:3 › Criterio 2 — rutas privadas y validación por rol › [c2] el auditor accede a la bitácora (984ms)
     ✓   6 [chromium] › grading\acceptance.spec.ts:54:3 › Criterio 2 — rutas privadas y validación por rol › [c2] un analista NO accede a la bitácora (836ms)
     ✓   7 [chromium] › grading\acceptance.spec.ts:60:3 › Criterio 2 — rutas privadas y validación por rol › [c2] el analista no ve el botón de aprobar (3.0s)
     ✓   8 [chromium] › grading\acceptance.spec.ts:68:3 › Criterio 4 — buenas prácticas de seguridad › [c4] IDOR: analista de A no abre solicitud de B (se comporta como inexistente) (896ms)
     ✓   9 [chromium] › grading\acceptance.spec.ts:74:3 › Criterio 4 — buenas prácticas de seguridad › [c4] el listado de un analista no incluye datos de otra sucursal (712ms)
     -  10 [chromium] › grading\acceptance.spec.ts:80:3 › Criterio 4 — buenas prácticas de seguridad › [c4] doble control: el aprobador no aprueba su propia solicitud
     ✓  11 [chromium] › grading\acceptance.spec.ts:89:3 › Criterio 3 — estados y retroalimentación › [c3] la página de no autorizado comunica el estado (1.6s)
     ✓  12 [chromium] › grading\acceptance.spec.ts:98:3 › Criterio 3 — estados y retroalimentación › [c3] recorrido con teclado: el formulario de login es navegable (400ms)

     1 skipped
     11 passed (12.3s)

     === Reporte por criterio (rúbrica oficial de prácticas) ===

     C1 · Configuración correcta del flujo de autenticación del laboratorio
          4/4 chequeos · sugerencia: Satisfactoria (8–10)

     C2 · Implementación de rutas privadas y validación por rol
          6/6 chequeos · sugerencia: Satisfactoria (8–10)

     C3 · Manejo adecuado de errores, estados y retroalimentación visual
          3/3 chequeos · sugerencia: Satisfactoria (8–10)

     C4 · Aplicación básica de buenas prácticas de seguridad en frontend
          6/8 chequeos · sugerencia: Aceptable (5–7)
          ✗ cabecera_Content-Security-Policy
          ✗ csp_con_nonce

     C5 · Organización, funcionamiento y explicación de la solución
          (sin chequeos automáticos — evaluación manual)

     Global automatizado: 19/21 chequeos.
     Nota: C5 (organización y explicación) y la defensa incluyen juicio docente; el harness cubre lo verificable.

Ojo con `test:p3`: arrastra p1 y p2 como regresion. Que este verde NO prueba
que hiciste el trabajo de la Practica 3 -- prueba que no rompiste lo anterior.
Lo de la Practica 3 se demuestra con el build, el E2E y los tests que escribas vos.

## 4. Lo que falta
- Corregir la configuración de Content-Security-Policy para que la cabecera CSP sea detectada por el chequeo de aceptación y contenga el nonce esperado.
- Mitigar completamente el riesgo de DNS rebinding mediante una validación de la IP efectiva en el momento de realizar la conexión.

-
## 5. Agujeros
B1:  
Agujero 1 - Elasticsearch: falló la lista, porque se agregó 10.0.1.50, un destino interno, y la función automáticamente pasó a permitirlo. 
Agujero 2 — Métricas: falló la lista, porque se agregó metrics.interno, haciendo accesible otro servicio interno desde una URL controlada por el usuario.

## 6. Preguntas B3
1.	¿Qué casos cubre el archivo que su versión no cubría?
R/ Cubre localhost, subdominios .localhost y loopback IPv6 (::1). Además, valida explícitamente que una IPv4 sea válida antes de revisar sus rangos.
2.	¿En qué posición está la llamada, y qué pasaría si estuviera una línea más abajo?
R/ La comprobación de esHostInterno() está antes de consultar la allowlist. Si estuviera una línea más abajo, un host interno que haya sido agregado accidentalmente a HOSTS_PERMITIDOS podría pasar la allowlist y ser permitido antes de llegar a la comprobación de seguridad.gt