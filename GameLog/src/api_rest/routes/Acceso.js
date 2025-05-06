import { Router } from 'express';
import { AccesoControlador } from "../controllers/Acceso.js";
import { ValidarJwt } from '../middlewares/jwt.js';

export const CrearRutaAcceso = ({ModeloAcceso}) =>
{
    /**
     * @swagger
     * tags:
     *  name: Acceso
     *  description: Gestión de las cuentas de acceso a la API
     */
    const AccesoEnrutador = Router();
    const ControladorAccesoEnrutador = new AccesoControlador({ModeloAcceso});

    /**
     *  @swagger
     *  /acceso/:
     *    post:
     *      summary: Crear cuentas de acceso para iniciar sesión en el sistema.
     *      tags: [Acceso]
     *      description: Crea una nueva cuenta de acceso dentro del sistema.
     *      requestBody:
     *        required: true
     *        content:
     *          application/json:
     *            schema:
     *              type: object
     *              properties:
     *                correo:
     *                  type: string
     *                  example: usuario@gmail.com
     *                contrasenia:
     *                  type: string
     *                  example: (contraseña encriptada)
     *                estado:
     *                  type: string
     *                  example: Desbaneado
     *                nombre:
     *                  type: string
     *                  example: Chris
     *                primerApellido:
     *                  type: string
     *                  example: Vasquez
     *                segundoApellido:
     *                  type: string
     *                  example: Zapata
     *                nombreDeUsuario:
     *                  type: string
     *                  example: christolin1234
     *                descripcion:
     *                  type: string
     *                  example: Soy el primer jugador de gamelog
     *                foto:
     *                  type: string
     *                  example: foto1.jpg
     *                tipoDeUsuario:
     *                  type: string
     *                  example: Jugador
     *      responses:
     *        200:
     *          description: La cuenta ha sido creada de manera exitosa.
     *        400:
     *          description: Datos inválidos o correo y nombre de usuario registrados previamente
     *        500:
     *          description: Error interno en el servidor al querer registrar la nueva cuenta de acceso
     */
    AccesoEnrutador.post('/',ControladorAccesoEnrutador.RegistrarAcceso);
    
    /**
     * @swagger
     * /acceso/{correo}:
     *   get:
     *     summary: Obtener el ID de acceso por correo
     *     tags: [Acceso]
     *     description: Retorna el ID de la cuenta de acceso asociada a un correo electrónico si existe.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: correo
     *         required: true
     *         schema:
     *           type: string
     *         description: Correo electrónico del usuario
     *     responses:
     *       200:
     *         description: ID de acceso encontrado
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: boolean
     *                 estado:
     *                   type: integer
     *                   example: 200
     *                 idAcceso:
     *                   type: integer
     *                   example: 42
     *       400:
     *         description: Datos inválidos o incompletos
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
     *                   description: Detalle de los errores de validación
     *       500:
     *         description: Error interno del servidor
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
     *                   example: 
     *                      - "Ha ocurrido un error al obtener los datos del usuario."
     *                      - "Ha ocurrido un error en la base de datos al querer editar los datos una cuenta de acceso"
     */
    AccesoEnrutador.get('/:correo',ValidarJwt,ControladorAccesoEnrutador.ObtenerIDDeCuentaDeAcceso);

    /**
     * @swagger
     * /acceso/{idAcceso}:
     *   put:
     *     summary: Editar datos de acceso (correo y/o contraseña)
     *     tags: [Acceso]
     *     description: Permite editar el correo y/o contraseña de una cuenta de acceso existente. Requiere autenticación mediante token JWT.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idAcceso
     *         required: true
     *         description: ID de la cuenta de acceso a modificar
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               correo:
     *                 type: string
     *                 example: nuevo_correo@gmail.com
     *               contrasenia:
     *                 type: string
     *                 example: nueva_contrasenia_encriptada
     *     responses:
     *       200:
     *         description: Edición exitosa
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
     *                   example: Datos actualizados correctamente
     *       400:
     *         description: Datos inválidos, correo registrado a otra cuenta
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
     *                   type: string
     *                   example: 
     *                      - "correo: campo requerido"
     *                      - "El correo ingresado ya ha sido registrado"
     *       500:
     *         description: Error interno del servidor o de la base de datos
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
     *                   example: Ha ocurrido un error al editar el acceso del usuario.
     */
    AccesoEnrutador.put('/:idAcceso',ValidarJwt,ControladorAccesoEnrutador.EditarAcceso);

    /**
     * @swagger
     * /acceso/{idAcceso}:
     *   put:
     *     summary: Editar el estado de una cuenta de acceso
     *     tags: [Acceso]
     *     description: Permite cambiar el estado (por ejemplo, baneado o desbaneado) de una cuenta de acceso existente. Requiere autenticación mediante token JWT.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idAcceso
     *         required: true
     *         description: ID de la cuenta de acceso cuyo estado se desea modificar
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               estadoAcceso:
     *                 type: string
     *                 example: Desbaneado
     *     responses:
     *       200:
     *         description: Estado actualizado correctamente
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
     *                   example: Estado actualizado correctamente
     *       400:
     *         description: Datos inválidos
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
     *                   type: string
     *                   example: 
     *                      - "estadoAcceso: campo requerido"
     *                      - "idAcceso ingresado no encontrado"
     *       500:
     *         description: Error interno del servidor o de la base de datos
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
     *                   example: Ha ocurrido un error al editar el estado de acceso
     */
    AccesoEnrutador.patch('/:idAcceso',ValidarJwt,ControladorAccesoEnrutador.EditarEstadoAcceso);

    /**
     * @swagger
     * /acceso/{idAcceso}:
     *   delete:
     *     summary: Eliminar una cuenta de acceso
     *     tags: [Acceso]
     *     description: Permite eliminar una cuenta de acceso del sistema. Requiere autenticación mediante token JWT.
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: idAcceso
     *         required: true
     *         description: ID de la cuenta de acceso que se desea eliminar
     *         schema:
     *           type: integer
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               correo:
     *                 type: string
     *                 example: usuario@gmail.com
     *     responses:
     *       200:
     *         description: Cuenta de acceso eliminada correctamente
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
     *                   example: Cuenta eliminada correctamente
     *       400:
     *         description: Datos inválidos
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
     *                   type: string
     *                   example: 
     *                      - "correo: campo requerido"
     *                      - "idAcceso ingresado no encontrado"
     *       500:
     *         description: Error interno del servidor o de la base de datos
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
     *                   example: Ha ocurrido un error al eliminar al usuario.
     */
    AccesoEnrutador.delete('/:idAcceso',ValidarJwt,ControladorAccesoEnrutador.BorrarAcceso);

    return AccesoEnrutador;
}