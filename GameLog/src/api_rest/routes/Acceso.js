import { Router } from 'express';
import { AccesoControlador } from "../controllers/Acceso.js";
import { ValidarJwt } from '../middlewares/jwt.js';

export const CrearRutaAcceso = ({ModeloAcceso}) =>
{

    const AccesoEnrutador = Router();
    const ControladorAccesoEnrutador = new AccesoControlador({ModeloAcceso});
    AccesoEnrutador.post('/',ControladorAccesoEnrutador.RegistrarAcceso);
    AccesoEnrutador.get('/login',ValidarJwt,ControladorAccesoEnrutador.ObtenerUsuarioLogin);
    AccesoEnrutador.get('/:correo',ValidarJwt,ControladorAccesoEnrutador.ObtenerIDDeCuentaDeAcceso)
    AccesoEnrutador.put('/:idAcceso',ValidarJwt,ControladorAccesoEnrutador.EditarAcceso);
    AccesoEnrutador.patch('/:idAcceso',ValidarJwt,ControladorAccesoEnrutador.EditarEstadoAcceso);
    AccesoEnrutador.delete('/:idAcceso',ValidarJwt,ControladorAccesoEnrutador.BorrarAcceso);

    return AccesoEnrutador;
}