const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Obtener todos los usuarios
router.get('/', usersController.getUsers);

// Buscar usuarios
router.get('/search', usersController.searchUsers); // Debe ir antes de /:id para que no tome 'search' como un id

// Obtener un cliente por ID
router.get('/:id', usersController.getUserById);

// Crear un nuevo usuario
router.post('/', usersController.createUser);

// Actualizar un usuario
router.put('/:id', usersController.updateUser);

module.exports = router;