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

    /**
     * @swagger
     * /like:
     *   post:
     *     summary: Registrar un like a una reseña
     *     tags: [Likes]
     *     description: Permite que un jugador registrado le dé "like" a una reseña específica. Requiere autenticación.
     *     security:
     *       - bearerAuth: [] 
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               idResenia:
     *                 type: integer
     *                 description: ID de la reseña a la que se desea dar like
     *                 example: 12
     *               idJugador:
     *                 type: integer
     *                 description: ID del jugador que realiza el like
     *                 example: 5
     *     responses:
     *       200:
     *         description: Like registrado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: false
     *                 estado:
     *                   type: integer
     *                   example: 200
     *                 mensaje:
     *                   type: string
     *                   example: Like registrado correctamente
     *       400:
     *         description: Datos inválidos proporcionados para el like
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 estado:
     *                   type: integer
     *                   example: 400
     *                 mensaje:
     *                   type: object
     *                   example: { idResenia: "Debe ser un entero positivo", idJugador: "Debe ser un entero válido","El id de reseña ingresado no se encuentra registrado" }
     *       500:
     *         description: Error interno del servidor o en la base de datos
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 estado:
     *                   type: integer
     *                   example: 500
     *                 mensaje:
     *                   type: string
     *                   example: Ha ocurrido un error al querer registar el like a la reseña
     */
    LikeEnrutador.post('/',ValidarJwt,ControladorLikeEnrutador.RegistrarLikeAReseña);

    /**
     * @swagger
     * /like/{idResena}/{idJugador}:
     *   delete:
     *     summary: Eliminar un like de una reseña
     *     tags: [Likes]
     *     description: Permite que un jugador elimine un like que ha dado previamente a una reseña. Requiere autenticación.
     *     security:
     *       - bearerAuth: []  # Requiere token JWT
     *     parameters:
     *       - in: path
     *         name: idJugador
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del jugador que dio el like
     *         example: 5
     *       - in: path
     *         name: idResena
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de la reseña que recibió el like
     *         example: 12
     *     responses:
     *       200:
     *         description: Like eliminado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: false
     *                 estado:
     *                   type: integer
     *                   example: 200
     *                 mensaje:
     *                   type: string
     *                   example: Like eliminado correctamente
     *       400:
     *         description: Parámetros inválidos para eliminar el like
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 estado:
     *                   type: integer
     *                   example: 400
     *                 mensaje:
     *                   type: object
     *                   example: { idJugador: "Debe ser un número entero", idResena: "Debe ser un número entero","El id de reseña ingresado no se encuentra registrado"}
     *       500:
     *         description: Error interno del servidor o de base de datos
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                   example: true
     *                 estado:
     *                   type: integer
     *                   example: 500
     *                 mensaje:
     *                   type: string
     *                   example: Ha ocurrido un error al querer eliminar el like a la reseña
     */
    LikeEnrutador.delete('/:idResena/:idJugador',ValidarJwt,ControladorLikeEnrutador.EliminarLikeDeReseña);

    return LikeEnrutador;
}