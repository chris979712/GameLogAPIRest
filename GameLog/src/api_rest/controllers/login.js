import { ValidarDatosLoginIngresados } from "../schemas/Login.js";
import { logger } from "../utilidades/logger.js";
import { GenerarJWT } from "../utilidades/generadorjwt.js";

export class LoginControlador
{
    constructor({ModeloLogin})
    {
        this.modeloLogin = ModeloLogin;
    }

    Login = async(req, res) =>
    {
        try
        {
            const {correo,contrasenia,tipoDeUsuario} = req.body;
            const Datos = {correo, contrasenia, tipoDeUsuario};
            const ResultadoValidacion = ValidarDatosLoginIngresados(Datos);
            if(ResultadoValidacion.success)
            {
                const ResultadoConsulta = await this.modeloLogin.Login({datos: ResultadoValidacion.data, tipoDeUsuario: ResultadoValidacion.data.tipoDeUsuario});
                let resultadoConsulta = parseInt(ResultadoConsulta.estado);
                if(resultadoConsulta === 200)
                {
                    const DatosUsuario = {correo, tipoDeUsuario};
                    const token = await GenerarJWT(DatosUsuario);
                    res.header('access_token',token);
                    res.json({
                        error: false,
                        estado: resultadoConsulta,
                        cuenta: ResultadoConsulta.cuenta
                    })
                }
                else
                {
                    res.status(resultadoConsulta).json({
                        error: true,
                        estado: resultadoConsulta,
                        mensaje: ResultadoConsulta.mensaje
                    })
                }
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
            console.log(error);
            logger({mensaje: error});
            res.status(500).json(
            {
                error: true,
                estado: 500,
                mensaje: 'Ha ocurrido un error al obtener los datos del usuario.'
            }
            )
        }
    }
}