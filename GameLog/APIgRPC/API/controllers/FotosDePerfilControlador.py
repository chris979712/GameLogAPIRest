import grpc
import os
from ..ficheros.fotosDePerfil import Fotos_De_Perfil_pb2,Fotos_De_Perfil_pb2_grpc

class FotosDePerfilControlador(Fotos_De_Perfil_pb2_grpc.FotosDePerfilServicer):
    def SubirFotoDeUsuario(self, request, context):
        nombreDeUsuario = request.nombreDeUsuario
        datosImagen = request.datos
        rutaBase = os.path.abspath(os.getcwd())
        carpetaDeFotos = os.path.join(rutaBase,os.getenv("CARPETAFOTOS"))
        rutaFinalArchivo = os.path.join(carpetaDeFotos,f"{nombreDeUsuario}.jpg")

        try:
            if os.path.exists(rutaFinalArchivo):
                os.remove(rutaFinalArchivo)
            with open(rutaFinalArchivo,"wb") as archivo:
                archivo.write(datosImagen)
        except Exception:
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Error al querer guardar la imagen en el servidor")
            return Fotos_De_Perfil_pb2.FotoDePerfilRuta(rutaArchivo="Error")
        
        context.set_code(grpc.StatusCode.OK)
        context.set_details(f"Foto guardada de manera correcta")
        return Fotos_De_Perfil_pb2.FotoDePerfilRuta(rutaArchivo=rutaFinalArchivo)
    
    def ObtenerFotoDePerfilUsuario(self, request, context):
        rutaImagen = request.rutaArchivo
        nombreDeUsuarioFoto = os.path.splitext(os.path.basename(rutaImagen))[0]
        try:
            with open(rutaImagen,"rb") as archivo:
                datos = archivo.read()
        except FileNotFoundError:
            context.set_code(grpc.StatusCode.NOT_FOUND)
            context.set_details("La imagen de perfil no fue encontrada.")
            return Fotos_De_Perfil_pb2.FotoDePerfilDatos(nombreDeUsuario="Imagen no encontrada", datos=b"")
        except Exception as e:
                context.set_code(grpc.StatusCode.INTERNAL)
                context.set_details(f"Error al leer la imagen")
                return Fotos_De_Perfil_pb2.FotoDePerfilDatos(nombreDeUsuario="Error al leer la imagen", datos=b"")
        return Fotos_De_Perfil_pb2.FotoDePerfilDatos(nombreDeUsuario=nombreDeUsuarioFoto,datos=datos)
    
    def ActualizarFotoDePerfil(self, request, context):
        nombreDeUsuario = request.nombreDeUsuario
        rutaImagenAntigua = request.rutaImagenAntigua
        datosNuevaImagen = request.datos
        rutaBase = os.path.abspath(os.getcwd())
        carpetaDeFotos = os.path.join(rutaBase,os.getenv("CARPETAFOTOS"))
        rutaFinalArchivo = os.path.join(carpetaDeFotos,f"{nombreDeUsuario}.jpg")

        try:
            if os.path.exists(rutaImagenAntigua) or os.path.abspath(rutaImagenAntigua) != os.path.abspath(rutaFinalArchivo):
                os.remove(rutaImagenAntigua)
            with open(rutaFinalArchivo,"wb") as archivo:
                archivo.write(datosNuevaImagen)
        except Exception as e:
            print(e)
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Error al querer actualizar la imagen en el servidor")
            return Fotos_De_Perfil_pb2.FotoDePerfilRuta(rutaArchivo="Error")
        
        context.set_code(grpc.StatusCode.OK)
        context.set_details(f"Foto actualizada de manera correcta")
        return Fotos_De_Perfil_pb2.FotoDePerfilRuta(rutaArchivo=rutaFinalArchivo)
