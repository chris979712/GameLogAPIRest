
export function ErrorEnLaConfiguracionDeConexion()
{
    return { estado: 400, mensaje: "El tipo de usuario a conectar a la base de datos es inválido."}
}

export function ErrorEnLaBaseDeDatosAcceso()
{
    return {estado: 500, mensaje: "Ha ocurrido un error en la base de datos"}
}

export function MensajeDeRetornoBaseDeDatos({datos})
{
    const { estado, mensaje } = datos;
    return { estado, mensaje };
}

export function MensajeDeRetornoBaseDeDatosAcceso({datos})
{
    const { resultado, mensaje } = datos;
    return {resultado, mensaje};
}

export function ErrorEnLaBaseDeDatosAccesoInsercion()
{
    return {resultado: 500, mensaje: "Ha ocurrido un error en la base de datos"}
}

export function ErrorEnLaConfiguracionDeConexionAcceso()
{
    return { resultado: 400, mensaje: "El tipo de usuario a conectar a la base de datos es inválido."}
}
