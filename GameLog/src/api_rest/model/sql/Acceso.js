import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion.js';
import { MensajeDeRetornoBaseDeDatosAcceso, MensajeDeRetornoBaseDeDatos, ErrorEnLaConfiguracionDeConexion, ErrorEnLaBaseDeDatos } from '../../utilidades/Constantes.js';

export class ModeloAcceso{

    static async InsertarNuevaCuenta({datos, tipoDeUsuario})
    {
        let resultadoInsercion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            if(ConfiguracionConexion)
            {
                const Conexion = await sql.connect(ConfiguracionConexion);
                const {
                    correo,
                    contrasenia,
                    estado,
                    nombre,
                    primerApellido,
                    segundoApellido,
                    nombreDeUsuario,
                    descripcion,
                    foto,
                    tipoDeUsuario
                } = datos;
                const Solicitud = Conexion.request();
                const ResultadoSolicitud = await Solicitud.input('correo',sql.VarChar,correo)
                    .input('contrasenia',sql.VarChar,contrasenia)
                    .input('estado',sql.VarChar,estado)
                    .input('nombre',sql.VarChar,nombre)
                    .input('primerApellido',sql.VarChar,primerApellido)
                    .input('segundoApellido',sql.VarChar,segundoApellido)
                    .input('nombreDeUsuario',sql.VarChar,nombreDeUsuario)
                    .input('descripcion',sql.VarChar,descripcion)
                    .input('foto',sql.VarChar,foto)
                    .input('tipoDeAcceso',sql.VarChar,tipoDeUsuario)
                    .output('resultado',sql.Int)
                    .output('mensaje',sql.VarChar)
                    .execute('spi_Acceso');
                resultadoInsercion = MensajeDeRetornoBaseDeDatosAcceso({datos: ResultadoSolicitud.output})
            }
            else
            {
                resultadoInsercion = ErrorEnLaConfiguracionDeConexion();
            }
        }
        catch(error)
        {
            console.log(error);
            resultadoInsercion = ErrorEnLaBaseDeDatos();
            throw error;
        }
        finally
        {
            if(sql.conected)
            {
                await sql.close();
            }
        }
        return resultadoInsercion;
    }

    static async EditarAcceso({datos, tipoDeUsuario})
    {

    }

    static async EditarEstadoAcceso({datos, tipoDeUsuario})
    {

    }

}