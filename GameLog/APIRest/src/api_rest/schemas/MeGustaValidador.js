import zod from 'zod';

const MeGustaEsquema = zod.object({
    idJugador: zod.number({ invalid_type_error: 'El idJugador ingresado no es válido',required_error: 'El ID del jugador es un campo requerido' }).int().positive(),
    idResena: zod.number({ invalid_type_error: 'El idReseña ingresado no es válido',required_error: 'El ID de la reseña es un campo requerido'}).int().positive(),
    idJugadorAutor: zod.number({ invalid_type_error: 'El idJugadorAutor ingresado no es válido',required_error: 'El ID de la reseña es un campo requerido'}).int().positive(),
    idJuego: zod.number({ invalid_type_error: 'El idJuego ingresado no es válido',required_error: 'El ID de la reseña es un campo requerido'}).int().positive()
})


export function ValidarMeGusta(entrada)
{
    return MeGustaEsquema.safeParse(entrada);
}