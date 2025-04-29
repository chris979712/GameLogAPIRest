import request  from "supertest";
import { CrearServidorTest } from "../server.js";
import { ModeloAcceso } from "../api_rest/model/sql/Acceso.js";

let servidor;

beforeAll(async () => {
    const { server: servidorCreado } = CrearServidorTest({ModeloAcceso : ModeloAcceso});
    servidor = servidorCreado;
});

afterAll(async () => {
    servidor.close();
});

describe('Tests para el servicio CRUD de cuentas e inicio de sesion', () => 
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

    test('POST /acceso - Se crea una cuenta con datos duplicados', async () => 
        {
            const datos = 
            {
                correo: "oscarcito666@gmail.com",
                contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
                estado: "Desbaneado",
                nombre: "Chris",
                primerApellido: "Vasquez",
                segundoApellido: "Zapata",
                nombreDeUsuario: "christolin555",
                descripcion: " ",
                foto: "pepe",
                tipoDeUsuario: "Administrador"
            };
            const res = await request(servidor)
                .post("/acceso")
                .set("Content-Type","application/json")
                .send(datos);
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty("mensaje");
            expect(res.body.mensaje).toBe("El correo ingresado ya se encuentra registrado")
        })

    test('GET /acceso - Obtiene la cuenta que se ingresa para iniciar sesión', async() => 
    {
        const correo = "oscarcito666@gmail.com";
        const contrasenia = "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
        const tipoDeUsuario = "Administrador";
        const res = await request(servidor)
            .get(`/acceso/login?correo=${correo}&contrasenia=${contrasenia}&tipoDeUsuario=${tipoDeUsuario}`);
        console.log(res.body.cuenta);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("cuenta");
    })

    test('GET /acceso - No se obtiene ninguna cuenta registrada dentro de la base de datos', async() => 
        {
            const correo= "chrisvasquez404@gmail.com";
            const contrasenia = "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000";
            const tipoDeUsuario = "Administrador";
            const res = await request(servidor)
                .get(`/acceso/login?correo=${correo}&contrasenia=${contrasenia}&tipoDeUsuario=${tipoDeUsuario}`)
            expect(res.statusCode).toBe(404);
        })

    test('GET /acceso/:correo - Obtiene el id de la cuenta a través del correo ingresado', async() => 
    {
        const correo = "oscarcito666@gmail.com";
        const tipoDeUsuario = "Administrador";
        const resIdUsuario = await request(servidor)
            .get(`/acceso/${correo}?tipoDeUsuario=${tipoDeUsuario}`);
        expect(resIdUsuario.status).toBe(200);
        expect(resIdUsuario.body).toHaveProperty("idAcceso");
    })

    test('GET /acceso/:correo - Se intenta obtener el id de una cuenta inexistente', async() => 
        {
            const correo = "chrisvasquez404@gmail.com";
            const tipoDeUsuario = "Administrador";
            const resIdUsuario = await request(servidor)
                .get(`/acceso/${correo}?tipoDeUsuario=${tipoDeUsuario}`);
            expect(resIdUsuario.status).toBe(404);
        })

    test('PUT /acceso/:id - Se editan las credenciales de acceso de una cuenta existente', async () => 
    {
        const correo = "oscarcito666@gmail.com";
        const tipoDeUsuario = "Administrador";
        const resIdUsuario = await request(servidor)
            .get(`/acceso/${correo}?tipoDeUsuario=${tipoDeUsuario}`)
        const idAcceso = resIdUsuario.body.idAcceso;
        const datosEdicion = {
            correo: "chrisvasquez777@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            tipoDeUsuario: "Administrador"
        }
        const resEdicion = await request(servidor)
            .put(`/acceso/${idAcceso}`)
            .set("Content-Type","application/json")
            .send(datosEdicion);
        expect(resEdicion.body.mensaje).toBe("Los datos de acceso han sido modificados con éxito.");
        expect(resEdicion.statusCode).toBe(200);
        expect(resEdicion.body).toHaveProperty("mensaje");
    })

    test('PUT /acceso/:id - Se tratan de editar credenciales de una cuenta inexistente', async () => 
    {
        const datosEdicion = {
            correo: "chrisvasquez777@gmail.com",
            contrasenia: "0x636C617665313233000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            tipoDeUsuario: "Administrador"
        }
        const resEdicion = await request(servidor)
            .put(`/acceso/${24}`)
            .set("Content-Type","application/json")
            .send(datosEdicion);
        expect(resEdicion.body.mensaje).toBe("El ID de la cuenta ingresada no existe.");
        expect(resEdicion.statusCode).toBe(400);
        expect(resEdicion.body).toHaveProperty("mensaje");
    })

    test('PATCH /acceso/:id - Se edita el estado de la cuenta de acceso a Baneado o Desbaneado', async() => 
    {
        const correo = "chrisvasquez777@gmail.com";
        const tipoDeUsuario = "Administrador";
        const resIdUsuario = await request(servidor)
            .get(`/acceso/${correo}?tipoDeUsuario=${tipoDeUsuario}`)
        const idAcceso = resIdUsuario.body.idAcceso;
        const datosEdicion = {
            idAcceso,
            tipoDeUsuario: "Administrador",
            estadoAcceso: "Baneado"
        }
        const resEdicion = await request(servidor)
            .patch(`/acceso/${idAcceso}`)
            .set("Content-Type","application/json")
            .send(datosEdicion);
        expect(resEdicion.body.mensaje).toBe("El estado de la cuenta ha sido modificada con éxito");
        expect(resEdicion.statusCode).toBe(200);
        expect(resEdicion.body).toHaveProperty("mensaje");
    })

    test("PATCH /acceso/:id - Se trata de editar el estado de una cuenta inexistente", async () => {
        const datosEdicion = {
            idAcceso: 24,
            tipoDeUsuario: "Administrador",
            estadoAcceso: "Baneado",
        };
        const resEdicion = await request(servidor)
            .patch(`/acceso/${24}`)
            .set("Content-Type", "application/json")
            .send(datosEdicion);
        expect(resEdicion.body.mensaje).toBe(
            "El ID de la cuenta ingresada no existe."
        );
        expect(resEdicion.statusCode).toBe(400);
        expect(resEdicion.body).toHaveProperty("mensaje");
    });

    test("DELETE /acceso/:id - Elimina de la base de datos una cuenta", async () => {
        const correo = "chrisvasquez777@gmail.com";
        const tipoDeUsuario = "Administrador";
        const resIdUsuario = await request(servidor)
            .get(`/acceso/${correo}?tipoDeUsuario=${tipoDeUsuario}`)
        const idAcceso = resIdUsuario.body.idAcceso;
        const datosEliminacion = {
            tipoDeUsuario: "Administrador",
            correo: "chrisvasquez777@gmail.com"
        }
        const resEliminacion = await request(servidor)
            .delete(`/acceso/${idAcceso}`)
            .set("Content-Type","application/json")
            .send(datosEliminacion);
        expect(resEliminacion.statusCode).toBe(200);
    })

    test("DELETE /acceso/:id - Eliminar una cuenta inexistente de la base de datos", async() => {
        const datosEliminacion = {
            tipoDeUsuario: "Administrador",
            correo: "chrisvasquez985@gmail.com"
        }
        const resEliminacion = await request(servidor)
            .delete(`/acceso/${24}`)
            .set("Content-Type","application/json")
            .send(datosEliminacion);
        expect(resEliminacion.statusCode).toBe(400);
    })
})