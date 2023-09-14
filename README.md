# Requisitos previos

- Node.js
- MySQL

## Instalación en local

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/GabrielVall/API---News
   cd {nombre del proyecto}
   ```

2. **Instalación de dependencias**

   ```bash
   npm install
   ```

3. **Configuración del archivo `.env`**

   En la raíz del proyecto, crea un archivo llamado `.env`. Este archivo almacenará las variables de entorno necesarias para el proyecto.
   Luego, abre este archivo en tu editor de texto y añade las siguientes variables con sus respectivos valores:

   ```env
   DB_HOST=TuServidorMySQL
   DB_USER=TuUsuarioMySQL
   DB_PASSWORD=TuContraseñaMySQL
   DB_NAME=NombreDeTuBaseDeDatos
   ```

   Asegúrate de reemplazar `TuServidorMySQL`, `TuUsuarioMySQL`, `TuContraseñaMySQL`, y `NombreDeTuBaseDeDatos` con tus propios valores de configuración de MySQL.

4. **Ejecución en local**

   Con todo configurado, puedes iniciar el servidor con:

   ```bash
   npm start
   ```

   Una vez que el servidor esté corriendo, deberías ver un mensaje indicando que está corriendo en `http://localhost:3000`.

---
