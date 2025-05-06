import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion';
import {MensajeDeRetornoBaseDeDatos,ErrorEnLaConfiguracionDeConexionAcceso} from '../../utilidades/Constantes.js';

export class ModeloReseña
{
    static async RegistrarReseña({datos, tipoDeUsuario})
    {
        let resultadoInsercion;
        let conexion;
        try
        {
            const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
            if(ConfiguracionConexion)
            {
                conexion = await sql.connect(ConfiguracionConexion);
                const {idJugador,idJuego,opinion,calificacion} = datos;
                const Solicitud = conexion.request();
                const ResultadoSolicitud = await Solicitud.input('idJugador',sql.Int,idJugador)
                    .input('idJuego',sql.Int,idJuego)
                    .input('opinion',sql.VarChar,opinion)
                    .input('calificacion',sql.Decimal(3,1),calificacion)
                    .output('estado',sql.Int)
                    .output('mensaje',sql.VarChar)
                    .execute('spi_Reseña');
                resultadoInsercion = MensajeDeRetornoBaseDeDatos({datos: ResultadoSolicitud.output});
            }
            else
            {
                resultadoInsercion = ErrorEnLaConfiguracionDeConexionAcceso();
            }
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

    static async EliminarReseña({datos,tipoDeUsuario})
    {
        let conexion;
        let resultadoEliminacion;
        try
        {
            const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
            if(ConfiguracionConexion)
            {
                conexion = await sql.connect(ConfiguracionConexion);
                const {idReseña} = datos;
                const Solicitud = conexion.request();
                const ResultadoEliminacion = await Solicitud.input('idReseña',sql.Int,idReseña)
                    .output('estado',sql.Int)
                    .output('mensaje',sql.VarChar)
                    .execute('spd_Reseñas');
                resultadoEliminacion = MensajeDeRetornoBaseDeDatos({datos: ResultadoEliminacion.output});
            }
            else
            {
                resultadoEliminacion = ErrorEnLaConfiguracionDeConexionAcceso();
            }
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