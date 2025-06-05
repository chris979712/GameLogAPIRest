import { Router } from "express";
import { MeGustaControlador } from "../controllers/MeGustaControlador.js";
import { ValidarJwt } from '../middlewares/jwt.js';

export const CrearRutaMeGusta = ({ModeloMeGusta}) =>
{
    /**
     * @swagger
     * tags:
     *  name: MeGusta
     *  description: Rutas para el registro y eliminación de MeGusta a una reseña
     */

    const MeGustaEnrutador = Router();
    const ControladorMeGustaEnrutador = new MeGustaControlador({ModeloMeGusta});

    /**
     * @swagger
     * /MeGusta:
     *   post:
     *     summary: Registrar un MeGusta a una reseña
     *     tags: [MeGusta]
     *     description: Permite que un jugador registrado le dé "MeGusta" a una reseña específica. Requiere autenticación.
     *     security:
     *       - bearerAuth: [] 
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               idResena:
     *                 type: integer
     *                 description: ID de la reseña a la que se desea dar MeGusta
     *                 example: 12
     *               idJugador:
     *                 type: integer
     *                 description: ID del jugador que realiza el MeGusta
     *                 example: 5
     *     responses:
     *       200:
     *         description: MeGusta registrado exitosamente
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
     *                   example: MeGusta registrado correctamente
     *       400:
     *         description: Datos inválidos proporcionados para el MeGusta
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
     *                   example: Ha ocurrido un error al querer registar el MeGusta a la reseña
     */
    MeGustaEnrutador.post('/',ValidarJwt,ControladorMeGustaEnrutador.RegistrarMeGustaAReseña);

    /**
     * @swagger
     * /MeGusta/{idResena}/{idJugador}:
     *   delete:
     *     summary: Eliminar un MeGusta de una reseña
     *     tags: [MeGusta]
     *     description: Permite que un jugador elimine un MeGusta que ha dado previamente a una reseña. Requiere autenticación.
     *     security:
     *       - bearerAuth: []  # Requiere token JWT
     *     parameters:
     *       - in: path
     *         name: idJugador
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del jugador que dio el MeGusta
     *         example: 5
     *       - in: path
     *         name: idResena
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID de la reseña que recibió el MeGusta
     *         example: 12
     *     responses:
     *       200:
     *         description: MeGusta eliminado exitosamente
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
     *                   example: MeGusta eliminado correctamente
     *       400:
     *         description: Parámetros inválidos para eliminar el MeGusta
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
     *                   example: Ha ocurrido un error al querer eliminar el MeGusta a la reseña
     */
    MeGustaEnrutador.delete('/:idResena/:idJugador',ValidarJwt,ControladorMeGustaEnrutador.EliminarMeGustaDeReseña);

    return MeGustaEnrutador;
}