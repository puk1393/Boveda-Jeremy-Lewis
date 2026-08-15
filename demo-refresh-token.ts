import { RepositorioMemoria } from "@/lib/repository.memory";
import { firmarRefreshToken, rotarRefresh } from "@/lib/refresh";

const SESSION_SECRET="@costarricense.cr";
const repo = new RepositorioMemoria();
const sesion = await repo.crearSesion("u-ana");

const vigente = await firmarRefreshToken(sesion.id, sesion.refreshActual, SESSION_SECRET);
console.log('vigente', vigente);
console.log('rotación normal', await rotarRefresh(repo, vigente, SESSION_SECRET));
console.log('reutilizamos el viejo', await rotarRefresh(repo, vigente, SESSION_SECRET)); /*porque el vigente ya no esta activo*/
console.log('sesión revocada', (await repo.buscarSesion(sesion.id))?.revocadaEn !== null);
const bitacora = await repo.listarAuditoria();
console.log('motivo:', bitacora.find(a => a.evento === "ACCESO_DENEGADO")?.metadatos.motivo); /*la sesión en general se asesino y se revoco*/