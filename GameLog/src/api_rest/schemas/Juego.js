import zod from 'zod';
import {SoloLetrasNumerosCaracteres } from '../utilidades/RegexValidadores.js';

const JuegoEsquema = zod.object({
    idJuego: zod.number({ invalid_type_error: 'El idJuego ingresado no es válido' }).int().positive(),
    nombre: zod.string({ invalid_type_error: 'El nombre ingresado no es válido'}).min(1).max(100).regex(SoloLetrasNumerosCaracteres),
})

export function ValidarJuego(entrada)
{
    return JuegoEsquema.safeParse(entrada);
}

export function ValidarJuegoParcial(entrada)
{
    return JuegoEsquema.partial().safeParse(entrada);
}