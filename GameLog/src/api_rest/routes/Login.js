import { Router } from "express";
import { LoginControlador } from "../controllers/login.js";

export const CrearRutaLogin = ({ModeloLogin,ModeloAcceso}) =>
{
    /**
     * @swagger
     * tags:
     *  name: Login
     *  description: Rutas del inicio de sesion
     */

    const LoginEnrutador = Router();
    const ControladorLoginEnrutador = new LoginControlador({ModeloLogin,ModeloAcceso});

    /**
     * @swagger
     * /login:
     *   post:
     *     summary: Iniciar sesión en la API
     *     tags: [Login]
     *     description: Verifica correo, contraseña y tipo de usuario para poder iniciar sesión en el API.
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
     *               contrasenia:
     *                 type: string
     *                 example: (contraseña encriptada)
     *               tipoDeUsuario:
     *                 type: string
     *                 example: Administrador
     *     responses:
     *       200:
     *         description: Inicio de sesión exitoso
     *       400:
     *         description: Credenciales inválidas, datos inválidos o inexistentes
     *       404:
     *         description: La cuenta no se ha encontrado dentro del sistema
     *       500:
     *         description: Error interno en el servidor al querer iniciar sesion
     */
    LoginEnrutador.post('/',ControladorLoginEnrutador.Login);

    /**
     * @swagger
     * /login/recuperacionDeCuenta:
     *   post:
     *     summary: Solicita un código de verificación para recuperar contraseña
     *     tags: [Login]
     *     description: Envía un código de verificación al correo proporcionado para iniciar el proceso de recuperación de contraseña. No requiere autenticación.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - correo
     *               - tipoDeUsuario
     *             properties:
     *               correo:
     *                 type: string
     *                 format: email
     *                 example: usuario@ejemplo.com
     *               tipoDeUsuario:
     *                 type: string
     *                 example: jugador
     *     responses:
     *       200:
     *         description: Código de verificación enviado exitosamente
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
     *                   example: El correo con el código de verificación ha sido enviado de manera exitosa
     *       400:
     *         description: Error de validación en los datos enviados
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
     *                   description: Detalles de los errores de validación
     *       404:
     *         description: Correo no registrado en el sistema
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
     *                   example: 404
     *                 mensaje:
     *                   type: string
     *                   example: El correo ingresado no se encuentra registrado dentro del sistema.
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
     *                   example: Ha ocurrido un error al obtener un código de verificación.
     */
    LoginEnrutador.post('/recuperacionDeCuenta',ControladorLoginEnrutador.SolicitudRecuperacionDeContraseña);

    /**
     * @swagger
     * /login/recuperacionDeCuenta/validacion:
     *   post:
     *     summary: Valida el código de verificación enviado al correo
     *     tags: [Login]
     *     description: Valida si el código ingresado por el usuario es correcto y está vigente. No requiere autenticación.
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - correo
     *               - codigo
     *               - tipoDeUsuario
     *             properties:
     *               correo:
     *                 type: string
     *                 format: email
     *                 example: usuario@ejemplo.com
     *               codigo:
     *                 type: integer
     *                 example: 123456
     *               tipoDeUsuario:
     *                 type: string
     *                 example: jugador
     *     responses:
     *       200:
     *         description: Código válido
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
     *                   example: Código de verificación válido
     *       400:
     *         description: Error de validación o código expirado/no solicitado
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
     *                   example: El código ingresado ha expirado.
     *       404:
     *         description: Código incorrecto o no solicitado
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
     *                   example: 404
     *                 mensaje:
     *                   type: string
     *                   example: El código ingresado no es correcto.
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
     *                   example: Ha ocurrido un error al verificar un código de verificación.
     */
    LoginEnrutador.post('/recuperacionDeCuenta/validacion',ControladorLoginEnrutador.ValidarCodigoDeVerificacion)

    return LoginEnrutador;
}