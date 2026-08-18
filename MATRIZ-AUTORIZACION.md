# Matriz de autorizacion - Boveda

Documento entregable de la Practica 2. Una fila por operacion. La columna
`authz.ts` apunta a la linea real de `src/lib/authz.ts` que implementa la regla:
si no podes apuntar a una linea concreta, esa regla esta regada por el codigo
en vez de vivir en la politica, y eso es un hallazgo que hay que anotar.

| Operacion | ANALISTA | APROBADOR | AUDITOR | Condicion ABAC | authz.ts |
|---|---|---|---|---|---|
| Ver solicitud | | | | | L17 |
| Crear solicitud | | | | | L26 |
| Resolver solicitud | No | Si | No | misma sucursal + estado PENDIENTE + no es quien la creo | L37 |
| Ver bitacora | | | | | L54 |

## Los agujeros que justifican cada linea

Una linea por agujero: que se rompe si esa regla no existe.

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
