
export const ErrorEnTipoDeUsuario = {
    estadoSalida: 400,
    mensajeSalida: "El tipo de usuario a conectar a la base de datos es inválido."
}

export function MensajeDeRetornoBaseDeDatos({datos})
{
    const { estadoSalida, mensajeSalida } = datos;
    return {estadoSalida, mensajeSalida};
}