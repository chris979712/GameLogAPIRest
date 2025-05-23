FROM nginx:latest

# Instala OpenSSL
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copia el script de entrada
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copia tu configuración de NGINX
COPY nginx.conf /etc/nginx/nginx.conf

# Sobrescribe el entrypoint
ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]