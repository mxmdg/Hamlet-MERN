FROM nginx:stable-alpine

# 1. Borramos la configuración por defecto de Nginx para que no haya conflictos
RUN rm /etc/nginx/conf.d/default.conf

# 2. Copiamos TU archivo y lo renombramos a default.conf en el destino
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 3. Copiamos el build
COPY ./build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
