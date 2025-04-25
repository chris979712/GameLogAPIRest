
export function ErrorEnLaConfiguracionDeConexion()
{
    return { estadoSalida: 400, mensajeSalida: "El tipo de usuario a conectar a la base de datos es inválido."}
}

export function ErrorEnLaBaseDeDatos()
{
    return {estadoSalida: 500, mensajeSalida: "Ha ocurrido un error en la base de datos"}
}

export function MensajeDeRetornoBaseDeDatosAcceso({datos})
{
    const { resultado, mensaje } = datos;
    return {resultado, mensaje};
}

export function MensajeDeRetornoBaseDeDatos({datos})
{
    const { estado, mensaje } = datos;
    return { estado, mensaje };
}