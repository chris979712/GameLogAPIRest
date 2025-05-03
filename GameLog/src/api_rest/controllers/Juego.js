import { ValidarJuego, ValidarJuegoParcial } from "../schemas/Juego.js";
import { logger } from "../utilidades/logger.js";

export class JuegoControlador
{
    constructor({ModeloJuego})
    {
        this.modeloJuego = ModeloJuego;
    }

    RegistrarJuego = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const ResultadoValidacion = ValidarJuego(req.body);
            if(ResultadoValidacion.success)
            {
                const ResultadoInsercion = await this.modeloJuego.RegistrarJuego({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario});
                let resultadoInsercion = parseInt(ResultadoInsercion.estado);
                res.status(resultadoInsercion).json({
                    error: resultadoInsercion !== 200,
                    estado: resultadoInsercion,
                    mensaje: ResultadoInsercion.mensaje
                });
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
            res.status(500).json(
                {
                    error: true,
                    estado: 500,
                    mensaje: "Ha ocurrido un error al querer registar el juego"
                }
            )
        }
    }

    BuscarJuegoPorID = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const idJuego = parseInt(req.params.idJuego);
            const Datos = {idJuego};
            const ResultadoValidacion = ValidarJuegoParcial(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoConsulta = await this.modeloJuego.BuscarJuegoPorId({datos: ResultadoValidacion.data,tipoDeUsuario: tipoDeUsuario});
                let resultadoConsulta = parseInt(ResultadoConsulta.estado);
                res.status(resultadoConsulta).json({
                    error: resultadoConsulta !== 200,
                    estado: resultadoConsulta,
                    ...(resultadoConsulta === 200
                        ? {juego: ResultadoConsulta.juego}
                        : {mensaje: ResultadoConsulta.mensaje}
                    )
                })
            }
            else
            {
                console.log(error);
                res.status(400).json({
                    error: true,
                    estado: 400,
                    mensaje: ResultadoValidacion.error.formErrors
                });
            }
        }
        catch(error)
        {
            res.status(500).json(
            {
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al querer buscar el juego por ID"
            }
            )
        }
    }

    BuscarJuegoPorNombre = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const {nombre} = req.query;
            const Datos = {nombre};
            const ResultadoValidacion = ValidarJuegoParcial(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoConsulta = await this.modeloJuego.BuscarJuegoPorNombre({datos: ResultadoValidacion.data,tipoDeUsuario: tipoDeUsuario});
                let resultadoConsulta = parseInt(ResultadoConsulta.estado);
                res.status(resultadoConsulta).json({
                    error: resultadoConsulta !== 200,
                    estado: resultadoConsulta,
                    ...(resultadoConsulta === 200
                        ? {juego: ResultadoConsulta.juego}
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
            logger({mensaje: error});
            res.status(500).json(
            {
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al querer buscar el juego por nombre"
            }
            )
        }
    }

    EliminarJuego = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const idJuego = parseInt(req.params.idJuego);
            console.log(idJuego)
            const Datos = {idJuego};
            const ResultadoValidacion = ValidarJuegoParcial(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoEliminacion = await this.modeloJuego.EliminarJuego({datos: ResultadoValidacion.data,tipoDeUsuario: tipoDeUsuario});
                let resultadoEliminacion = parseInt(ResultadoEliminacion.estado);
                res.status(resultadoEliminacion).json({
                    error: resultadoEliminacion !== 200,
                    estado: resultadoEliminacion,
                    mensaje: ResultadoEliminacion.mensaje
                });
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
            logger({mensaje: error});
            res.status(500).json(
            {
                error: true,
                estado: 500,
                mensaje: "Ha ocurrido un error al querer eliminar el juego"
            }
            )  
        }
    }
}