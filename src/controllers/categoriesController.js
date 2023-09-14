const connection = require('../config/database.js');

// Obtener todas las categorías
exports.getCategories = (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  connection.query('SELECT * FROM categorias LIMIT ? OFFSET ?', [limit, offset], (error, results) => {
    if (error) {
      console.error('Error executing query:', error.stack);
      res.status(500).send('Error executing query');
      return;
    }
    res.json(results);
  });
};

// Obtener una categoría por ID
exports.getCategoryById = (req, res) => {
  const id = req.params.id;

  connection.query('SELECT * FROM categorias WHERE idCategoria = ?', [id], (error, results) => {
    if (error || results.length === 0) {
      res.status(404).send('Category not found');
      return;
    }
    res.json(results[0]);
  });
};

// Crear una nueva categoría
exports.createCategory = (req, res) => {
  const { nombreCategoria } = req.body;  // Extraemos sólo el nombre de la categoría del cuerpo de la petición

  if (!nombreCategoria) {
    res.status(400).send('Category name is required');
    return;
  }

  connection.query('INSERT INTO categorias (nombreCategoria) VALUES (?)', [nombreCategoria], (error, results) => {
    if (error) {
      console.error('Error while inserting:', error.stack);
      res.status(500).send('Error while inserting category');
      return;
    }
    res.status(201).send(`Category created with ID: ${results.insertId}`);
  });
};

// Actualizar una categoría
exports.updateCategory = (req, res) => {
  const id = req.params.id;
  const { nombreCategoria } = req.body;

  if (!nombreCategoria) {
    res.status(400).send('Category name is required');
    return;
  }

  connection.query('UPDATE categorias SET nombreCategoria = ? WHERE idCategoria = ?', [nombreCategoria, id], (error) => {
    if (error) {
      console.error('Error while updating:', error.stack);
      res.status(500).send('Error while updating category');
      return;
    }
    res.send('Category updated successfully');
  });
};

// Eliminar una categoría
exports.deleteCategory = (req, res) => {
  const id = req.params.id;

  connection.query('UPDATE categorias SET estadoCategoria = 0 WHERE idCategoria = ?', [id], (error) => {
    if (error) {
      console.error('Error while updating the status:', error.stack);
      res.status(500).send('Error while updating category status');
      return;
    }
    res.send('Category status updated successfully');
  });
};

// Reactivar una categoría
exports.reactivateCategory = (req, res) => {
  const id = req.params.id;

  connection.query('UPDATE categorias SET estadoCategoria = 1 WHERE idCategoria = ?', [id], (error) => {
    if (error) {
      console.error('Error while updating the status:', error.stack);
      res.status(500).send('Error while reactivating category');
      return;
    }
    res.send('Category reactivated successfully');
  });
};


// Buscar categorías
exports.searchCategories = (req, res) => {
  const search = `%${req.query.q}%`; // Usamos % para buscar subcadenas en SQL
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  connection.query('SELECT * FROM categorias WHERE nombreCategoria LIKE ? LIMIT ? OFFSET ?', [search, limit, offset], (error, results) => {
    if (error) {
      console.error('Error executing query:', error.stack);
      res.status(500).send('Error executing query');
      return;
    }
    res.json(results);
  });
};