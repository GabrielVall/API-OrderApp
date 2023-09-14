const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clientsController');

// Obtener todas las clientes
router.get('/', clientsController.getClients);

// Buscar Clientes
router.get('/search', clientsController.searchClients); // Debe ir antes de /:id para que no tome 'search' como un id

// Obtener un cliente por ID
router.get('/:id', clientsController.getClientById);

// Crear una nueva categoría
router.post('/', clientsController.createClient);

// Actualizar un cliente
router.put('/:id', clientsController.updateClient);

module.exports = router;
