import { firmarAccess, verificar } from "@/lib/tokens";
import type { Identidad } from "@/lib/types";
import {randomUUID} from 'crypto';

let sessionId = randomUUID();

const ana: Identidad = {
    sesionId: sessionId.toString(),
    usuarioId: randomUUID().toString(),
    rol: "ANALISTA",
    sucursalId: randomUUID.toString()
}