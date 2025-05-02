import sql from 'mssql';
import { RetornarTipoDeConexion } from './connection/ConfiguracionConexion.js';

export class ModeloLogin
{
    static async Login({datos, tipoDeUsuario})
    {
        let resultadoConsulta;
        let conexion;
        const ConfiguracionConexion = RetornarTipoDeConexion({tipoDeUsuario});
        try
        {
            if(ConfiguracionConexion)
            {
                conexion = await sql.connect(ConfiguracionConexion);
                const {
                    correo,
                    contrasenia
                } = datos;
                const QueryCuenta = await conexion.request()
                    .input('correo',sql.VarChar,correo)
                    .input('contrasenia',sql.VarChar,contrasenia)
                    .query('SELECT a.idCuenta,a.correo,a.estado,ta.tipoDeAcceso,j.idJugador,j.nombre,j.primerApellido,j.segundoApellido,j.nombreDeUsuario,j.descripcion,j.foto '+
                        'FROM Accesos a JOIN Jugadores j ON a.idCuenta = j.idAcceso '+
                        'JOIN TiposDeAccesos ta ON a.tipoDeAcceso = ta.idTipoDeAcceso '+
                        'WHERE a.correo = @correo AND a.contrasenia = @contrasenia');
                const ResultadoQueryCuenta = QueryCuenta.recordset;
                if(ResultadoQueryCuenta.length >= 1)
                {
                    resultadoConsulta = {estado: 200, cuenta: ResultadoQueryCuenta};
                }
                else
                {
                    resultadoConsulta = {estado: 404, mensaje: 'No se ha encontrado la cuenta a buscar dentro del sistema'};
                }
            }
            else
            {
                resultadoConsulta = { estado: 400, mensaje: "El tipo de usuario a conectar a la base de datos es inválido."};
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
        return resultadoConsulta;
    }
}