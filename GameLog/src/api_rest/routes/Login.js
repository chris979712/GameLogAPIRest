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
     * /login/:
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

    LoginEnrutador.post('/recuperacionDeCuenta',ControladorLoginEnrutador.IniciarRecuperacionDeContraseña);

    return LoginEnrutador;
}