const express = require('express');
const router = express.Router();
const complementsController = require('../controllers/complementsController');

// Obtener todos los complementos
router.get('/', complementsController.getComplements);

// Buscar complementos
router.get('/search', complementsController.searchComplements); // Debe ir antes de /:id para que no tome 'search' como un id

// Actualizar un complemento
router.put('/:id', complementsController.updateComplement);

// Crear un complemento
router.post('/', complementsController.createComplement);

// Eliminar una categoría
router.delete('/:id', complementsController.deleteComplement);


module.exports = router;