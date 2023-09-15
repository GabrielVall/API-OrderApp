const express = require('express');
const router = express.Router();
const addonsController = require('../controllers/addonsController');

// Obtener todos los addons
router.get('/', addonsController.getAddons);

// Buscar addons
router.get('/search', addonsController.searchAddons); // Debe ir antes de /:id para que no tome 'search' como un id

// Obtener un addon por ID
router.get('/:id', addonsController.getAddonById);

// Actualizar un addon
router.put('/:id', addonsController.updateAddon);

// Crear un addon
router.post('/', addonsController.createAddon);

// Eliminar una categoría
router.delete('/:id', addonsController.deleteAddon);


module.exports = router;