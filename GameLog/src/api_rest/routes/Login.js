import { Router } from "express";
import { LoginControlador } from "../controllers/login.js";

export const CrearRutaLogin = ({ModeloLogin}) =>
{
    const LoginEnrutador = Router();
    const ControladorLoginEnrutador = new LoginControlador({ModeloLogin});
    LoginEnrutador.post('/',ControladorLoginEnrutador.Login);

    return LoginEnrutador;
}