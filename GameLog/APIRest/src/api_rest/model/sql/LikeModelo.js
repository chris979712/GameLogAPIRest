import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion.js';
import {MensajeDeRetornoBaseDeDatos} from '../../utilidades/Constantes.js';

export class ModeloLike
{

    static async RegistrarLikeAReseña({datos, tipoDeUsuario})
    {
        let resultadoInsercion;
        let conexion;
        try
        {
            const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJugador,idResena} = datos;
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud.input('idJugador',sql.Int,idJugador)
                .input('idResenia',sql.Int,idResena)
                .output('estado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spi_Likes');
            resultadoInsercion = MensajeDeRetornoBaseDeDatos({datos: ResultadoSolicitud.output})
        }
        catch(error)
        {
            throw error;
        }
        finally
        {
            if(conexion)
            {
                await sql.close();
            }
        }
        return resultadoInsercion;
    }

    static async EliminarLikeDeReseña({datos,tipoDeUsuario})
    {
        let resultadoEliminacion;
        let conexion;
        try
        {
            const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
            conexion = await sql.connect(ConfiguracionConexion);
            const {idJugador,idResena} = datos;
            const Solicitud = conexion.request();
            const ResultadoSolicitud = await Solicitud.input('idResenia',sql.Int,idResena)
                .input('idJugador',sql.Int,idJugador)
                .output('estado',sql.Int)
                .output('mensaje',sql.VarChar)
                .execute('spd_Likes');
            resultadoEliminacion = MensajeDeRetornoBaseDeDatos({datos: ResultadoSolicitud.output})
        }
        catch(error)
        {
            throw error;
        }
        finally
        {
            if(conexion)
            {
                await sql.close();
            }
        }
        return resultadoEliminacion;
    }

}