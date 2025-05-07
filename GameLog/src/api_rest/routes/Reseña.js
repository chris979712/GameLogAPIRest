import { Router } from "express";
import { ReseñaControlador } from "../controllers/Reseña.js";
import { ValidarJwt } from '../middlewares/jwt.js';

export const CrearRutaReseña =  ({ModeloReseña}) =>
{
    /**
     * @swagger
     * tags:
     *  name: Reseñas
     *  description: Rutas de la gestión de reseñas
     */

    const ReseñaEnrutador = Router();
    const ControladorReseñaEnrutador = new ReseñaControlador({ModeloReseña});

    ReseñaEnrutador.post('/',ValidarJwt,ControladorReseñaEnrutador.RegistrarReseña);
    ReseñaEnrutador.get('/jugador/:idJugador',ValidarJwt,ControladorReseñaEnrutador.ObtenerReseñasDeJugador);
    ReseñaEnrutador.get('/juego/:idJuego',ValidarJwt,ControladorReseñaEnrutador.ObtenerReseñasDeUnJuego);
    ReseñaEnrutador.get('/juego/:idJuego/seguidos',ValidarJwt,ControladorReseñaEnrutador.ObtenerReseñasDeUnJuegoReseñadoPorJugadoresSeguidos);
    ReseñaEnrutador.delete('/:idResena',ValidarJwt,ControladorReseñaEnrutador.EliminarReseña);
    
    return ReseñaEnrutador;
}