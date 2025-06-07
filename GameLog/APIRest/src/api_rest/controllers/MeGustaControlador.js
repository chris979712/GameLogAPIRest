import { logger } from "../utilidades/logger.js";
import { ValidarMeGusta } from "../schemas/MeGustaValidador.js";
import { PublicarAccionReseña, PublicarAccionSocial } from "../utilidades/Redis.js";

export class MeGustaControlador
{
    constructor({ModeloMeGusta})
    {
        this.modeloMeGusta = ModeloMeGusta;
    }

    RegistrarMeGustaAReseña = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario,nombreDeUsuario} = req;
            const NombreDeUsuario = nombreDeUsuario;
            const ResultadoValidacion = ValidarMeGusta(req.body);
            if(ResultadoValidacion.success)
            {
                const ResultadoInsercion = await this.modeloMeGusta.RegistrarMeGustaAReseña({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario});
                let resultadoInsercion = parseInt(ResultadoInsercion.estado);
                if(resultadoInsercion === 500)
                {
                    logger({mensaje: ResultadoInsercion.mensaje});
                    res.status(resultadoInsercion).json(
                    {
                        error: true,
                        estado: resultadoInsercion.resultado,
                        mensaje: 'Ha ocurrido un error en la base de datos al querer darle me gusta a una reseña'
                    });
                }
                else
                {
                    if(resultadoInsercion === 200)
                    {
                        const {idJugadorAutor,idJuego} = ResultadoValidacion.data;
                        await PublicarAccionReseña(idJuego,'Dar_MeGusta',{mensaje: 'Se ha agregado un me gusta'});
                        await PublicarAccionSocial(idJugadorAutor,'Interactuar_resena',{mensaje:`${NombreDeUsuario} le ha dado me gusta a tu reseña`});
                    }
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
                    mensaje: "Campos inválidos, por favor verifique que sean correctos."
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
                    mensaje: "Ha ocurrido un error al querer registar el me gusta a la reseña"
                }
            )
        }
    }

    EliminarMeGustaDeReseña = async (req, res) =>
    {
        try
        {
            const {tipoDeUsuario} = req;
            const idJuego = parseInt(req.params.idJuego);
            const {idResena,idJugadorAutor,idJugador} = req.body;
            const Datos = {idJugador,idResena,idJugadorAutor,idJuego};
            const ResultadoValidacion = ValidarMeGusta(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoEliminacion = await this.modeloMeGusta.EliminarMeGustaDeReseña({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario});
                let resultadoEliminacion = parseInt(ResultadoEliminacion.estado);
                if(resultadoEliminacion === 500)
                {
                    logger({mensaje: resultadoEliminacion.mensaje});
                    res.status(resultadoEliminacion).json(
                    {
                        error: true,
                        estado: resultadoEliminacion.resultado,
                        mensaje: 'Ha ocurrido un error en la base de datos al querer eliminar el me gusta de una reseña'
                    });
                }
                else
                {
                    if(resultadoEliminacion === 200)
                    {
                        await PublicarAccionReseña(idJuego,'Quitar_MeGusta',{mensaje: 'Se ha eliminado un me gusta'});
                    }
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
                    mensaje: "Campos inválidos, por favor verifique que sean correctos."
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
                    mensaje: "Ha ocurrido un error al querer eliminar el me gusta a la reseña"
                }
            )
        }
    }
}