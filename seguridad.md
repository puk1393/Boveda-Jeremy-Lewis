# Seguridad Boveda JLCnpm 

## 1. Autenticación con JWT

La aplicación utiliza JWT firmados con HS256 para manejar la autenticación.

Se utilizan dos tipos de tokens:

- Access token: duración de 15 minutos.
- Refresh token: duración de 8 horas.

El algoritmo HS256 se fija explícitamente durante la verificación para evitar aceptar tokens con algoritmos no permitidos.

El secreto utilizado para firmar los tokens se obtiene mediante la variable de entorno:

`SESSION_SECRET`

El secreto no se almacena directamente en el código fuente.

---

## 2. Sesiones revocables

Los JWT no son considerados suficientes por sí solos para mantener una sesión válida.

Cada inicio de sesión crea una nueva sesión en la base de datos mediante:

`repo().crearSesion(usuario.id)`

La sesión contiene:

- `id`
- `usuarioId`
- `creadaEn`
- `ultimoAccesoEn`
- `revocadaEn`
- `refreshActual`

Al verificar una sesión se comprueba tanto la validez criptográfica del JWT como la existencia de la sesión y que no haya sido revocada.

Por lo tanto, un JWT copiado no puede seguir siendo utilizado después de que la sesión sea revocada.

---

## 3. Cookies seguras

Los tokens se almacenan en cookies con los siguientes atributos:

- `HttpOnly`: evita que JavaScript del navegador pueda leer directamente el token.
- `Secure`: en producción obliga a utilizar HTTPS.
- `SameSite=Lax`: proporciona protección básica contra CSRF.
- `Path=/`: limita el alcance de la cookie al sitio.

El access token tiene una duración de 15 minutos y el refresh token de 8 horas.

---

## 4. Cierre de sesión

El logout no se limita a eliminar las cookies.

Primero se identifica la sesión y se revoca en el repositorio mediante:

`repo().revocarSesion(actor.sesionId)`

Después se eliminan las cookies.

Esto evita que un atacante pueda continuar utilizando un token que haya copiado antes del cierre de sesión.

---

## 5. Rotación de refresh tokens

Los refresh tokens utilizan rotación.

Cada vez que un refresh válido es utilizado:

1. Se genera un nuevo `refreshId`.
2. Se actualiza `refreshActual` en la sesión.
3. Se emite un nuevo refresh token.
4. El refresh anterior deja de ser válido.

La sesión mantiene únicamente el identificador del refresh vigente.

---

## 6. Detección de reutilización

Si se presenta un refresh token cuyo `refreshId` ya no coincide con `refreshActual`, significa que ese token ya fue utilizado anteriormente.

Esto se considera una posible señal de robo.

Ante esta situación:

1. Se revoca la sesión completa.
2. Se registra el evento `ACCESO_DENEGADO`.
3. Se registra el motivo `reuso_de_refresh`.
4. El refresh reutilizado es rechazado.

De esta manera no se intenta mantener activa parcialmente una sesión potencialmente comprometida.

---

## 7. Rotación y reuso

Si un refresh token se filtra, sin rotación el atacante podría reutilizarlo mientras el token siga siendo válido y obtener nuevas credenciales.
Con este mecanismo, cada uso del refresh genera una nueva emisión y el refresh anterior deja de ser el vigente.
Si un atacante intenta reutilizar el refresh filtrado, se detecta que su `refreshId` ya no coincide con `refreshActual`.
La sesión completa se revoca y se registra el evento `ACCESO_DENEGADO` con el motivo en la bitacora de: `reuso_de_refresh`.
Así, el robo de un refresh puede ser detectado y provoca el cierre de toda la sesión, no solamente la eliminación de los cookies.

---

## 8. Ataques comprobados

### Ataque 1 — Robo mediante JavaScript / XSS

Se verificó que la cookie `boveda_access` tiene:

`HttpOnly = true`

Por lo tanto:

### Ataque 2 - Intentar ingresar a la aplicación desde un power shell con un cookie ya revocado
curl.exe -i http://localhost:3000/solicitudes -H "Cookie: boveda_access=TU_TOKEN_COPIADO"
Da en powershell: Http/1.1 307 Temporary Redirect por lo cual aguanto el ataque