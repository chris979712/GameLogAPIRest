import { logger } from "../utilidades/logger.js";
import {ValidarDatosReseña,ValidarDatosBusquedaReseña} from '../schemas/Reseña.js';

export class ReseñaControlador
{
    constructor({ModeloReseña})
    {
        this.modeloReseña = ModeloReseña;
    }

    RegistrarReseña = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const ResultadoValidacion = ValidarDatosReseña(req.body);
            if(ResultadoValidacion.success)
            {
                const ResultadoInsercion = await this.modeloReseña.RegistrarReseña({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario});
                let resultadoInsercion = parseInt(ResultadoInsercion.estado);
                if(resultadoInsercion === 500)
                {
                    logger({mensaje: ResultadoInsercion.mensaje});
                    res.status(resultadoInsercion).json(
                    {
                        error: true,
                        estado: resultadoInsercion.resultado,
                        mensaje: 'Ha ocurrido un error en la base de datos al querer insertar un nueva reseña'
                    });
                }
                else
                {
                    res.status(resultadoInsercion).json({
                        error: resultadoInsercion !== 200,
                        estado: resultadoInsercion,
                        mensaje: ResultadoInsercion.mensaje
                    });
                }
            }
            else
            {
                res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: ResultadoValidacion.error.formErrors
                });
            }
        }
        catch(error)
        {
            logger({mensaje: error})
            res.status(500).json(
                {
                    error: true,
                    estado: 500,
                    mensaje: "Ha ocurrido un error al querer registar la reseña"
                }
            )
        }
    }

    ObtenerReseñasDeJugador = async (req,res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const idJugador = parseInt(req.params.idJugador);
            const Datos = {idJugador};
            const ResultadoValidacion = ValidarDatosBusquedaReseña(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoConsulta = await this.modeloReseña.ObtenerReseñasDeJugador({datos: ResultadoValidacion.data,tipoDeUsuario: tipoDeUsuario});
                let resultadoConsulta = parseInt(ResultadoConsulta.estado);
                res.status(resultadoConsulta).json({
                    error: resultadoConsulta !== 200,
                    estado: resultadoConsulta,
                    ...(resultadoConsulta === 200
                        ? {reseñas: ResultadoConsulta.reseñas}
                        : {mensaje: ResultadoConsulta.mensaje}
                    )
                })
            }
            else
            {
                res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: ResultadoValidacion.error.formErrors
                });
            }
        }
        catch(error)
        {
            logger({mensaje: error})
            res.status(500).json(
                {
                    error: true,
                    estado: 500,
                    mensaje: "Ha ocurrido un error al querer obtener las reseñas de un jugador"
                }
            )
        }
    }

    ObtenerReseñasDeUnJuego = async (req,res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const idJuego = parseInt(req.params.idJuego);
            const Datos = {idJuego};
            const ResultadoValidacion = ValidarDatosBusquedaReseña(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoConsulta = await this.modeloReseña.ObtenerReseñasDeUnJuego({datos: ResultadoValidacion.data,tipoDeUsuario: tipoDeUsuario});
                let resultadoConsulta = parseInt(ResultadoConsulta.estado);
                res.status(resultadoConsulta).json({
                    error: resultadoConsulta !== 200,
                    estado: resultadoConsulta,
                    ...(resultadoConsulta === 200
                        ? {reseñas: ResultadoConsulta.reseñas}
                        : {mensaje: ResultadoConsulta.mensaje}
                    )
                })
            }
            else
            {
                res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: ResultadoValidacion.error.formErrors
                });
            }
        }
        catch(error)
        {
            logger({mensaje: error})
            res.status(500).json(
                {
                    error: true,
                    estado: 500,
                    mensaje: "Ha ocurrido un error al querer obtener las reseñas del juego seleccionado"
                }
            )
        }
    }

    ObtenerReseñasDeUnJuegoReseñadoPorJugadoresSeguidos = async (req,res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const idJuego = parseInt(req.params.idJuego);
            const idJugador = parseInt(req.query.idJugador)
            const Datos = {idJuego,idJugador};
            const ResultadoValidacion = ValidarDatosBusquedaReseña(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoConsulta = await this.modeloReseña.ObtenerReseñasDeUnJuegoReseñadoPorJugadoresSeguidos({datos: ResultadoValidacion.data,tipoDeUsuario: tipoDeUsuario});
                let resultadoConsulta = parseInt(ResultadoConsulta.estado);
                res.status(resultadoConsulta).json({
                    error: resultadoConsulta !== 200,
                    estado: resultadoConsulta,
                    ...(resultadoConsulta === 200
                        ? {reseñas: ResultadoConsulta.reseñas}
                        : {mensaje: ResultadoConsulta.mensaje}
                    )
                })
            }
            else
            {
                res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: ResultadoValidacion.error.formErrors
                });
            }
        }
        catch(error)
        {
            logger({mensaje: error})
            res.status(500).json(
                {
                    error: true,
                    estado: 500,
                    mensaje: "Ha ocurrido un error al querer obtener las reseñas de los jugadores seguidos"
                }
            )
        }
    }

    EliminarReseña = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const idReseña = parseInt(req.params.idResena);
            const Datos = {idReseña};
            const ResultadoValidacion = ValidarDatosBusquedaReseña(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoEliminacion = await this.modeloReseña.EliminarReseña({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario});
                let resultadoEliminacion = parseInt(ResultadoEliminacion.estado);
                if(resultadoEliminacion === 500)
                {
                    logger({mensaje: ResultadoEliminacion.mensaje});
                    res.status(resultadoEliminacion).json(
                    {
                        error: true,
                        estado: resultadoEliminacion.resultado,
                        mensaje: 'Ha ocurrido un error en la base de datos al querer eliminar un juego como pendiente'
                    });
                }
                else
                {
                    res.status(resultadoEliminacion).json({
                        error: resultadoEliminacion !== 200,
                        estado: resultadoEliminacion,
                        mensaje: ResultadoEliminacion.mensaje
                    });
                }
            }
            else
            {
                res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: ResultadoValidacion.error.formErrors
                });
            }
        }
        catch(error)
        {
            logger({mensaje: error})
            res.status(500).json(
                {
                    error: true,
                    estado: 500,
                    mensaje: "Ha ocurrido un error al querer eliminar la reseña"
                }
            )
        }
    }
}