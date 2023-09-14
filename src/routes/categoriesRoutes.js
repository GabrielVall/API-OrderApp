const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');

// Obtener todas las categorías
router.get('/', categoriesController.getCategories);

// Buscar categorías
router.get('/search', categoriesController.searchCategories); // Debe ir antes de /:id para que no tome 'search' como un id

// Obtener una categoría por ID
router.get('/:id', categoriesController.getCategoryById);

// Crear una nueva categoría
router.post('/', categoriesController.createCategory);

// Reactivar una categoría
router.put('/reactivate/:id', categoriesController.reactivateCategory);

// Actualizar una categoría
router.put('/:id', categoriesController.updateCategory);

// Eliminar una categoría
router.delete('/:id', categoriesController.deleteCategory);

module.exports = router;
