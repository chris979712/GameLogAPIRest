import request  from "supertest";
import { CrearServidorTest } from "../server.js";
import { ModeloAcceso } from "../api_rest/model/sql/Acceso.js";

let servidor;

beforeAll(async () => {
    const { app, server: servidorCreado } = CrearServidorTest({ModeloAcceso : ModeloAcceso});
    servidor = servidorCreado;
});

afterAll(async () => {
    const correo = "chrisvasquez777@gmail.com";
    const datos = { tipoDeUsuario: "Administrador"};
    const resIdUsuario = await request(servidor)
        .get(`/acceso/${correo}`)
        .set("Content-Type","application/json")
        .send(datos);
    const idAcceso = resIdUsuario.body.data.idAcceso;
    const datosEliminacion = {
        idAcceso: idAcceso,
        tipoDeUsuario: "Administrador",
        correo: "Baneado"
    }
    const resEliminacion = await request(servidor)
        .delete(`/acceso/:idAcceso`)
        .set("Content-Type","application/json")
        .send(datosEliminacion);
    servidor.close();
});

describe('Test para el modelo de Acceso (Creaciond de cuenta, edicion de cuenta y estado de la cuenta)', () => 
{
    test('POST /acceso - Se crea una nueva cuenta de acceso', async () => 
    {
        const datos = 
        {
            correo: "oscarcito666@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            estado: "Desbaneado",
            nombre: "Oscar",
            primerApellido: "Hizay",
            segundoApellido: "Apodaca",
            nombreDeUsuario: "Garcia",
            descripcion: " ",
            foto: "ranarene",
            tipoDeUsuario: "Administrador"
        };
        const res = await request(servidor)
            .post("/acceso")
            .set("Content-Type","application/json")
            .send(datos);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("mensaje");
        expect(res.body.mensaje).toBe("La nueva cuenta de acceso ha sido registrada correctamente")
    })

    test('GET /acceso - Obtiene la cuenta que se ingresa para iniciar sesión', async() => 
    {
        const datos =
        {
            correo: "oscarcito666@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            tipoDeUsuario: "Administrador"
        }
        const res = await request(servidor)
            .get('/acceso')
            .set("Content-Type","application/json")
            .send(datos);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("cuenta");
    })

    test('GET /acceso/:correo - Obtiene el id de la cuenta a través del correo ingresado', async() => 
    {
        const correo = "oscarcito666@gmail.com";
        const datos = { tipoDeUsuario: "Administrador"};
        const resIdUsuario = await request(servidor)
            .get(`/acceso/${correo}`)
            .set("Content-Type","application/json")
            .send(datos);
        expect(resIdUsuario.status).toBe(200);
        expect(resIdUsuario.body).toHaveProperty("idAcceso");
    })

    test('PUT /acceso/:id - Se editan las credenciales de acceso de una cuenta existente', async () => 
    {
        const correo = "oscarcito666@gmail.com";
        const datos = { tipoDeUsuario: "Administrador"};
        const resIdUsuario = await request(servidor)
            .get(`/acceso/${correo}`)
            .set("Content-Type","application/json")
            .send(datos);
        const idAcceso = resIdUsuario.body.data.idAcceso;
        const datosEdicion = {
            idAcceso: idAcceso,
            correo: "chrisvasquez777@gmail.com",
            contrasenia: "0x1111111111313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            tipoDeUsuario: "Administrador"
        }
        const resEdicion = await request(servidor)
            .put(`/acceso/${idAcceso}`)
            .set("Content-Type","application/json")
            .send(datosEdicion);
        expect(resEdicion.statusCode).toBe(200);
        expect(resEdicion.body).toHaveProperty("mensaje");
        expect(resEdicion.body.mensaje).toBe("Los datos de acceso han sido modificados con éxito.");
    })

    test('PATCH /acceso/:id - Se edita el estado de la cuenta de acceso a Baneado o Desbaneado', async() => 
    {
        const correo = "chrisvasquez777@gmail.com";
        const datos = { tipoDeUsuario: "Administrador"};
        const resIdUsuario = await request(servidor)
            .get(`/acceso/${correo}`)
            .set("Content-Type","application/json")
            .send(datos);
        const idAcceso = resIdUsuario.body.data.idAcceso;
        const datosEdicion = {
            idAcceso: idAcceso,
            tipoDeUsuario: "Administrador",
            estadoAcceso: "Baneado"
        }
        const resEdicion = await request(servidor)
            .patch(`/acceso/${idAcceso}`)
            .set("Content-Type","application/json")
            .send(datosEdicion);
        expect(resEdicion.statusCode).toBe(200);
        expect(resEdicion.body).toHaveProperty("mensaje");
        expect(resEdicion.body.mensaje).toBe("El estado de la cuenta ha sido modificada con éxito");
    })
})