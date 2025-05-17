import jwt from 'jsonwebtoken';
import { logger } from '../utilidades/logger.js';
import { UsuariosActivos } from '../utilidades/Constantes.js';

export const ValidarJwt = (request,response, next) =>
{
    try
    {
        const HeaderAutenticacion = request.header('access_token');
        const Token = HeaderAutenticacion && HeaderAutenticacion.startsWith('Bearer ')
            ? HeaderAutenticacion.split(' ')[1]
            : null;
        if(Token)
        {
                const {correo, tipoDeUsuario} = jwt.verify(Token,process.env.SECRETO_JWT);
                request.correo = correo;
                request.tipoDeUsuario = tipoDeUsuario;
                next();
        }
        else
        {
            response.status(401).json(
            {
                error: true,
                estado: 401,
                mensaje: 'No hay un token dentro de la solicitud'
            })
        }
    }
    catch(error)
    {
        const Token = request.header('access_token')?.split(' ')[1];
        const payload = jwt.decode(Token);
        if (UsuariosActivos[payload?.correo]) {
            delete UsuariosActivos[payload?.correo];
        }
        logger(error);
        response.status(401).json({
            error: true,
            estado: 401,
            mensaje: 'Token inválido, será redirigido al menú principal. Por favor vuelva a iniciar sesión en la aplicación.'
        })
    }
}