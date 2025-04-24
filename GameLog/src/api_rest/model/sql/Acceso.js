import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion';
import { MensajeDeRetornoBaseDeDatos, ErrorEnLaConexion } from '../../utilidades/Constantes';

export class ModeloAcceso{

    static async InsertarNuevaCuenta({datos, tipoDeUsuario})
    {
        let resultadoInsercion;
        const ConfiguracionConexion = RetornarTipoDeConexion(tipoDeUsuario);
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
                    tipoDeAcceso
                } = datos;
                const Solicitud = Conexion.request();
                const ResultadoSolicitud = await Solicitud.input('correo',sql.VarChar,correo)
                    .input('contrasenia',sql.Binary,contrasenia)
                    .input('estado',sql.VarChar,estado)
                    .input('nombre',sql.VarChar,nombre)
                    .input('primerApellido',sql.VarChar,primerApellido)
                    .input('segundoApellido',sql.VarChar,segundoApellido)
                    .input('nombreDeUsuario',sql.VarChar,nombreDeUsuario)
                    .input('descripcion',sql.VarChar,descripcion)
                    .input('foto',sql.VarChar,foto)
                    .input('tipoDeAcceso',sql.VarChar,tipoDeAcceso)
                    .output('estadoSalida',sql.Int)
                    .output('mensajeSalida',sql.VarChar)
                    .execute('spi_Acceso');
                resultadoInsercion = MensajeDeRetornoBaseDeDatos(ResultadoSolicitud.output)
                
            }
            else
            {
                resultadoInsercion = ErrorEnLaConexion;
            }
        }
        catch(error)
        {
            console.log(error);
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