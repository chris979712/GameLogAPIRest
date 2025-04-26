import { Router } from 'express';
import { AccesoControlador } from "../controllers/Acceso.js";

export const CrearRutaAcceso = ({ModeloAcceso}) =>
{

    const AccesoEnrutador = Router();
    const ControladorAccesoEnrutador = new AccesoControlador({ModeloAcceso});
    AccesoEnrutador.post('/',ControladorAccesoEnrutador.RegistrarAcceso);
    AccesoEnrutador.get('/',ControladorAccesoEnrutador.ObtenerUsuarioLogin);
    AccesoEnrutador.get('/:correo',ControladorAccesoEnrutador.ObtenerIDDeCuentaDeAcceso)
    AccesoEnrutador.put('/:idAcceso',ControladorAccesoEnrutador.EditarAcceso);
    AccesoEnrutador.patch('/:idAcceso',ControladorAccesoEnrutador.EditarEstadoAcceso);
    AccesoEnrutador.delete('/:idAcceso',ControladorAccesoEnrutador.BorrarAcceso);

    return AccesoEnrutador;
}