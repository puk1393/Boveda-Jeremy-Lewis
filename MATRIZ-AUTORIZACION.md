# Matriz de autorizacion - Boveda

Documento entregable de la Practica 2. Una fila por operacion. La columna `authz.ts` apunta a la linea real de `src/lib/authz.ts` que implementa la regla:
si no podes apuntar a una linea concreta, esa regla esta regada por el codigo en vez de vivir en la politica, y eso es un hallazgo que hay que anotar.

| Operacion | ANALISTA | APROBADOR | AUDITOR | Condicion ABAC | authz.ts |
|---|---|---|---|---|---|
| Ver solicitud | Solo su sucursal | Solo su sucursal | Todas | s.sucursalId === actor.sucursalId | L17 |
| Crear solicitud | Si | No | No | actor.rol === 'ANALISTA' | L26 |
| Resolver solicitud | No | Si | No | Misma sucursal + estado PENDIENTE + aprobador no es quien la creo | L37 |
| Ver bitacora |No | No | Si | | L54 |

## Los agujeros que justifican cada linea

Una linea por agujero: que se rompe si esa regla no existe.
Agujero A1: se daba porque un analista podia ver las transferencias de una sucursal distinta a la suya; por lo cual se valida la sucursal del usuario con la de la solicitud para que sean iguales, si son distintas daria fallo. Afectaria al banco porque personas estarian viendo transferencias de sucursales que no le corresponden.<br>
Agujero A2: se daba porque no se hacia una excepción por rol, en este caso el Auditor debe de poder ver todas las solicitudes, se excluye el rol de auditor para que 
pueda ver todas las solicitudes. Afectaria al banco porque los auditores no podrian revisar las solicitudes y se podrian dar muchos fraudes.
Agujero B1: se daba porque no se tenia una validación por rol, en este caso un auditor estaba intentando crear un caso, un auditor solo puede ver porque sino seria juez y parte. Se crea una validación para que el rol solo sea analista en la creación. Afectaria al banco porque un auditor podria crear casos y existir fraude.
Agujero B2 se daba porque no se tenia una validación por rol, en este caso un aprobador estaba intentando crear un caso y a nivel bancario esto es muy delicado. 
Se crea una validación para que el rol solo sea analista en la creación. Afectaria al banco porque un auditor podria crear casos y existir fraude.

- Resolver / rol: 
- Resolver / sucursal: 
- Resolver / estado: 
- Resolver / doble control: 
- Ver / sucursal: 
- Ver / excepcion del auditor: 
- Crear / roles excluidos: 

## Evidencia de ataques fallidos

Para cada ataque: que se intento, que respondio la app, y **que quedo en la base**
(el estado sin cambiar es lo que prueba la defensa, no el mensaje de error).

1. 
2. 
3. 
4. 
5. 
