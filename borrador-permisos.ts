type Rol = 'ANALISTA' | 'APROBADOR' | 'AUDITOR';
type Actor ={usuarioId: string; rol: Rol; sucursalId:string};
type Solicitud = { id:string; sucursalId:string; creadaPor:string; estado:string; monto:number};
type Decision ={ permitido:boolean; motivo?:string};
const denegar = ( motivo:string) : Decision =>({permitido:false,motivo});
const PERMITIR: Decision = { permitido: true };
const ana: Actor = { usuarioId: 'u-ana', rol: 'ANALISTA', sucursalId: 'central' };
const beto: Actor = { usuarioId: 'u-beto', rol: 'APROBADOR', sucursalId: 'central' };
const dina: Actor = { usuarioId: 'u-dina', rol: 'AUDITOR', sucursalId: 'central' };
const edu: Actor = { usuarioId: 'u-edu', rol: 'ANALISTA', sucursalId: 'heredia' };
const deCentral: Solicitud = { id: 'sol-1', sucursalId: 'central', creadaPor: 'u-ana', estado: 'PENDIENTE', monto: 5000000,};
const deHeredia: Solicitud = { id: 'sol-2', sucursalId: 'heredia', creadaPor: 'u-edu', estado: 'PENDIENTE', monto: 800000,};
function puedeVer(actor: Actor, solicitud: Solicitud): Decision {
  if (actor.rol === 'AUDITOR') { /*A2: Excepción por Rol*/
    return PERMITIR
  }
  if (solicitud.sucursalId !== actor.sucursalId) {
    return denegar('La solicitud pertenece a otra sucursal');
  }
  return PERMITIR;
}
console.log('ana ve la de central:', puedeVer(ana, deCentral));
console.log('ana ve la de heredia:', puedeVer(ana, deHeredia));
console.log('dina (auditora) ve la de heredia:', puedeVer(dina, deHeredia));
console.log('edu ve la de central:', puedeVer(edu, deCentral));
/*FIN PARTE A*/
function puedeCrear(actor: Actor): Decision {
  return actor.rol === 'ANALISTA'
    ? PERMITIR
    : denegar('Solo un analista puede crear solicitudes');
}
console.log('dina (auditora) crea:', puedeCrear(dina));
console.log('beto (aprobador) crea:', puedeCrear(beto));