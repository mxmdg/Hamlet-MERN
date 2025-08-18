# Hamlet-MERN

Hamlet es una solución integral para la gestión de presupuestos y producción en imprentas, desarrollada con el stack MERN (MongoDB, Express, React, Node.js).

## Descripción

Hamlet permite a imprentas gestionar sus trabajos, materiales, equipos y usuarios, optimizando el proceso de cotización y producción. El sistema calcula automáticamente el material necesario, sugiere formatos y equipos adecuados, y genera órdenes de trabajo listas para imprimir.

## Estructura de la base de datos

- **Impresoras**: Equipos de impresión y sus características principales.
- **Materiales**: Tipos de soporte (papeles, cartulinas, etc.).
- **Formatos**: Tamaños estándar o personalizados utilizados en los equipos.
- **Precios**: Fórmulas y valores para calcular costos.
- **Trabajos**: Tipos de trabajo (libros, revistas, folletos, tarjetas, etc.).
- **Usuarios**: Roles de Administrador, Vendedor y Cliente, con distintos privilegios.

## Funcionalidades principales

- Solicitud y gestión de presupuestos por parte de clientes.
- Validación automática de características según el tipo de trabajo.
- Propuestas optimizadas por vendedores para reducir costos de producción.
- Generación de órdenes de trabajo imprimibles tras la aprobación del presupuesto.
- Cálculo automático de:
  - Cantidad de material necesario para cada trabajo.
  - Equipos de impresión compatibles.
  - Formatos recomendados según el material.
  - Distribución de páginas por hoja (incluye gráficos).
  - Costos y márgenes de ganancia.
- Paneles de estadísticas y reportes para análisis de producción y ventas.

## Tecnologías utilizadas

- **Frontend**: React + Material UI
- **Backend**: Node.js + Express
- **Base de datos**: MongoDB

## Instalación rápida

```bash
git clone https://github.com/tuusuario/Hamlet-MERN.git
cd Hamlet-MERN
# Instalar dependencias backend
cd backend
npm install
# Instalar dependencias frontend
cd ../frontend
npm install
```

## Ejecución

- Backend: `npm start` (en la carpeta backend)
- Frontend: `npm start` (en la carpeta frontend)

## Despliegue y comercialización

### 1. Despliegue en la nube

Se recomienda desplegar Hamlet en una plataforma cloud como [Vercel](https://vercel.com/) o [Netlify](https://www.netlify.com/) para el frontend, y [Render](https://render.com/), [Heroku](https://heroku.com/), [Railway](https://railway.app/) o [DigitalOcean](https://digitalocean.com/) para el backend y la base de datos MongoDB Atlas.

### 2. Uso de Docker

Para facilitar el despliegue y la portabilidad, puedes crear archivos Docker para el frontend y backend. Ejemplo básico:

**Dockerfile (backend):**

```dockerfile
# filepath: d:\Maxi\Hamlet\Hamlet-MERN\backend\Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**Dockerfile (frontend):**

```dockerfile
# filepath: d:\Maxi\Hamlet\Hamlet-MERN\frontend\Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

**docker-compose.yml ejemplo:**

```yaml
# filepath: d:\Maxi\Hamlet\Hamlet-MERN\docker-compose.yml
version: "3"
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=tu_mongo_uri
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

### 3. Registro y monitoreo

- Registra la aplicación en [UptimeRobot](https://uptimerobot.com/) o [StatusCake](https://www.statuscake.com/) para monitoreo.
- Usa [Sentry](https://sentry.io/) para errores y [Google Analytics](https://analytics.google.com/) para métricas de uso.

### 4. Monetización por suscripción

Para cobrar a los usuarios, puedes integrar [Stripe](https://stripe.com/) o [MercadoPago](https://www.mercadopago.com.ar/) en el backend. El flujo básico es:

- Crear planes de suscripción (mensual/anual).
- Integrar Stripe/MercadoPago en el backend (Node.js) y frontend (React).
- Al registrar un usuario, asociar el pago y controlar el acceso según el estado de la suscripción.
- Puedes usar [Stripe Checkout](https://stripe.com/docs/payments/checkout) para pagos rápidos.

**Ejemplo de integración Stripe en Node.js:**

```js
// filepath: d:\Maxi\Hamlet\Hamlet-MERN\backend\stripe.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.post("/api/subscribe", async (req, res) => {
  const { email, priceId } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: "https://tuapp.com/success",
    cancel_url: "https://tuapp.com/cancel",
  });
  res.json({ url: session.url });
});
```

En el frontend, redirige al usuario a la URL de Stripe para completar el pago.

### 5. Recomendaciones finales

- Configura variables de entorno seguras para claves y URIs.
- Haz backups regulares de la base de datos.
- Actualiza el README con instrucciones de despliegue y comercialización.

## Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias o mejoras.

## Licencia

MIT

## Contacto

Para consultas o soporte, contacta a maxi@hamlet.com
