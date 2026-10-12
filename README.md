
---
```go
# 🐦 TwitterGo - Cliente (Frontend)

Esta es la interfaz de usuario de **TwitterGo**, una réplica de las funciones principales de Twitter construida con **React**.

## 🚀 Demo en Vivo
¡La aplicación ya está desplegada! Puedes verla funcionando aquí:  
👉 [https://puricalvo.github.io/twitterGo-client](https://puricalvo.github.io/twitterGo-client)

## ✨ Características
* **Registro e inicio de sesión**: Autenticación segura.
* **Timeline Inteligente**: Visualización de Tweets de los usuarios que sigues.
* **Navegación Móvil Adaptativa**: Menú lateral en escritorio y menú desplegable (hamburguesa) en dispositivos móviles para una experiencia nativa.
* **Gestión Centralizada de Tweets**: Sistema de modales global que permite twittear desde cualquier sección de la app.
* **Multimedia**: Subida de imágenes al backend; este proyecto las guarda en MongoDB GridFS.
* **Optimización de carga**: Compresión de imágenes en el cliente antes de la subida para mayor velocidad.
* **Perfil de usuario**: Edición de banner, avatar y biografía con previsualización en tiempo real.
* **Diseño responsivo avanzado**: Estilos pulidos con **SASS**, garantizando que los títulos, avatares y elementos interactivos se adapten perfectamente a cualquier tamaño de pantalla.

## 🛠️ Tecnologías utilizadas
* **React** - Librería principal.
* **React Bootstrap** - Para el diseño y componentes.
* **SASS** - Estilos modulares y variables personalizadas.
* **Browser-image-compression** - Optimización de rendimiento en subidas.
* **Moment.js** - Gestión amigable de fechas y tiempos de publicación.
* **GitHub Pages** - Hosting del frontend.

## Backend

El cliente se conecta a una API en Go. La URL puede configurarse mediante `REACT_APP_API_HOST`; los nombres de variables se documentan en [`.env.example`](./.env.example). Para desarrollo local, la URL por defecto es `http://localhost:8080`.

En PowerShell, para compilar y publicar en GitHub Pages usando el backend de producción:

```powershell
$env:REACT_APP_API_HOST = "https://api.cadesa.serv00.net"
npm run deploy
```

El origen CORS configurado en el backend debe ser `https://puricalvo.github.io`. No pongas credenciales del backend en las variables compiladas del frontend.

El código fuente del backend está en [TwitterGo Backend](https://github.com/puricalvo/twitterGo).
```
---
