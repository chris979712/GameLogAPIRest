import { ValidarInsercionAcceso } from "../schemas/Acceso.js";

export class AccesoControlador
{
    constructor({ModeloAcceso})
    {
        this.modeloAcceso = ModeloAcceso;
    }

    RegistrarAcceso = async (req, res) =>
    {
        const ResultadoValidacion = ValidarInsercionAcceso(req.body);
        try
        {
            if(ResultadoValidacion.success)
            {
                const {
                    tipoDeUsuario
                } = req.body;
                const ResultadoInsercion = await this.modeloAcceso.InsertarNuevaCuenta({datos: ResultadoValidacion.data, tipoDeUsuario: tipoDeUsuario})
                res.status(parseInt(ResultadoInsercion.resultado)).json(
                    {
                        estado: ResultadoInsercion.resultado,
                        mensaje: ResultadoInsercion.mensaje
                    });
            }
            else
            {
                res.status(400).json({
                    error: true,
                    estado: 400,
                    detalles: ResultadoValidacion.error.formErrors
                });
            }
        }
        catch(error)
        {
            console.log(error);
            res.status(500).json(
            {
                error: true,
                estado: 500,
                detalles: "Ha ocurrido un error al querer registrar el Acceso."
            });
        }
    }
}