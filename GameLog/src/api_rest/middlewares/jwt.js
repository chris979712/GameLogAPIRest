import jwt from 'jsonwebtoken';
import {request,response} from 'express';
import { logger } from '../utilidades/logger.js';

export const ValidarJwt = (req = request, res = response, next) =>
{
    try
    {
        const HeaderAutenticacion = req.header('access_token');
        const Token = HeaderAutenticacion && HeaderAutenticacion.startsWith('Bearer ')
            ? HeaderAutenticacion.split(' ')[1]
            : null;
        if(Token)
        {
                const {correo, tipoDeUsuario} = jwt.verify(Token,process.env.SECRETO_JWT);
                req.correo = correo;
                req.tipoDeUsuario = tipoDeUsuario;
                next();
        }
        else
        {
            res.status(401).json(
            {
                mensaje: 'No hay un token dentro de la solicitud'
            })
        }
    }
    catch(error)
    {
        logger(error);
        res.status(401).json({
            mensaje: 'Token inválido'
        })
    }
}