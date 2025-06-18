🖧 GameLog Backend
Este proyecto contiene la parte del Backend del sistema desarrollado en la experiencia educativa Desarrollo de Sistemas en Red.

En este repositorio encontrarás los archivos de configuración necesarios para su despliegue tanto en máquina virtual como en contenedor Docker.

📋 Requisitos
Tener instalado Docker o VirtualBox (con Vagrant).

💻 Instalación en Máquina Virtual (Vagrant)
Abre el proyecto en la carpeta GameLog.

Ejecuta el siguiente comando:

bash
Copy
Edit
vagrant ssh
¡Listo! Estás dentro del entorno virtual.

🐳 Instalación con Docker
Abre el proyecto en la carpeta GameLog.

Ejecuta uno de los siguientes comandos:

bash
Copy
Edit
docker compose up -d --build
o

bash
Copy
Edit
docker-compose up -d --build
¡Listo! El entorno se ha levantado con Docker.
