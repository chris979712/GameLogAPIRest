import { Router } from "express";
import { LikeControlador } from "../controllers/Like.js";
import { ValidarJwt } from '../middlewares/jwt.js';

export const CrearRutaLike = ({ModeloLike}) =>
{
    /**
     * @swagger
     * tags:
     *  name: Likes
     *  description: Rutas para el registro y eliminación de likes a una reseña
     */

    const LikeEnrutador = Router();
    const ControladorLikeEnrutador = new LikeControlador({ModeloLike});

    LikeEnrutador.post('/',ValidarJwt,ControladorLikeEnrutador.RegistrarLikeAReseña);

    LikeEnrutador.delete('/:idResena/:idJugador',ValidarJwt,ControladorLikeEnrutador.EliminarLikeDeReseña);

    return LikeEnrutador;
}