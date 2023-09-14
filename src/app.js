const express = require('express');
const app = express();
const PORT = 3000;
// Requiere la conexión de la base de datos
require('./config/database');

app.use(express.json());

// Ruta por defecto
app.get('/', (req, res) => {
  res.send(`
    <h1>API de Usuarios</h1>
    <p>Endpoints disponibles:</p>
    <ul>
      <li>GET /usuarios</li>
      <li>POST /usuarios</li>
      <li>PUT /usuarios/:id</li>
      <li>DELETE /usuarios/:id</li>
    </ul>
  `);
});

// Ruta para categorias
const categoriesRoutes = require('./routes/categoriesRoutes');
app.use('/categories', categoriesRoutes);

// Ruta para clientes
const clientsRoutes = require('./routes/clientsRoutes');
app.use('/clients', clientsRoutes);

// Ruta para usuarios
const usersRoutes = require('./routes/usersRoutes');
app.use('/users', usersRoutes);

// Ruta para complementos
const complementsRoutes = require('./routes/complementsRoutes');
app.use('/complements', complementsRoutes);

// Iniciar servicio
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
