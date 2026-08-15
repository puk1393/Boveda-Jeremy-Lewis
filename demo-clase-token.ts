import { firmarAccess, verificar } from "@/lib/tokens";
import type { Identidad } from "@/lib/types";
import {randomUUID} from 'crypto';

let sessionId = randomUUID();

const SESSION_SECRET="@costarricense.cr";

const ana: Identidad = {
    sesionId: sessionId.toString(),
    usuarioId: randomUUID().toString(),
    rol: "ANALISTA",
    sucursalId: randomUUID().toString(),
    refreshId: randomUUID().toString(),
}

const token = await firmarAccess(ana, SESSION_SECRET);
console.log(token);
const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
console.log('Payload',payload);
console.log('Token Verificado', await verificar(token, "access", SESSION_SECRET));
console.log('secret que no es', await verificar(token, "access", "prueba"));
console.log('tipo que no es', await verificar(token, "refresh", SESSION_SECRET)); /*Porque se genero como access y se esta enviando para refresh*/