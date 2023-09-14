const connection = require("../config/database.js");

// Obtener todos los usuarios
exports.getComplements = (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    connection.query(
        "SELECT * FROM complementos LIMIT ? OFFSET ?",
        [limit, offset],
        (error, results) => {
            if (error) {
                console.error("Error executing query:", error.stack);
                res.status(500).send("Error executing query");
                return;
            }
            res.json(results);
        }
    );
};

// Buscar usuarios
exports.searchComplements = (req, res) => {
    const nombreComplemento = req.query.nombreComplemento;
    const minimoComplemento = req.query.minimoComplemento;
    const maximoComplemento = req.query.maximoComplemento;
    const estadoComplemento = req.query.estadoComplemento;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    let sql = 'SELECT * FROM usuarios WHERE ';

    const searchConditions = [];
    const searchValues = [];

    if (nombreComplemento) {
        searchConditions.push('nombreComplemento LIKE ?');
        searchValues.push(`%${nombreComplemento}%`);
    }

    if (minimoComplemento !== undefined && !isNaN(minimoComplemento)) {
        searchConditions.push('minimoComplemento = ?');
        searchValues.push(parseInt(minimoComplemento));
    }

    if (maximoComplemento !== undefined && !isNaN(maximoComplemento)) {
        searchConditions.push('maximoComplemento = ?');
        searchValues.push(parseInt(maximoComplemento));
    }

    if (estadoComplemento !== undefined && (estadoComplemento === '0' || estadoComplemento === '1')) {
        searchConditions.push('estadoComplemento = ?');
        searchValues.push(parseInt(estadoComplemento));
    }

    // Verificar si no se proporcionó ningún criterio de búsqueda válido
    if (searchConditions.length === 0) {
        res.status(400).json({ error: 'Se requieren parámetros de búsqueda válidos' });
        return;
    }

    sql += searchConditions.join(' AND ');

    // Agregar LIMIT y OFFSET a la consulta SQL
    sql += ' LIMIT ? OFFSET ?';
    searchValues.push(limit, offset);

    connection.query(sql, searchValues, (error, results) => {
        if (error) {
            console.error('Error executing query:', error.stack);
            res.status(500).send('Error executing query');
            return;
        }

        res.json(results);
    });
};

// Actualizar complemento
exports.updateComplement = (req, res) => {
    const idComplemento = req.params.id; // Obtener el ID del complemento de los parámetros de ruta
    const { nombreComplemento, minimoComplemento, maximoComplemento, estadoComplemento } = req.body; // Obtener los datos a actualizar del cuerpo de la petición

    // Verificar que al menos uno de los campos a actualizar esté presente en el cuerpo de la petición
    if (!nombreComplemento && minimoComplemento === undefined && maximoComplemento === undefined && estadoComplemento === undefined) {
        res.status(400).json({ error: 'Se requieren al menos uno de los campos para actualizar' });
        return;
    }

    // Construir la consulta SQL dinámicamente
    let sql = 'UPDATE complementos SET ';
    const updateFields = [];
    const updateValues = [];

    if (nombreComplemento) {
        updateFields.push('nombreComplemento = ?');
        updateValues.push(nombreComplemento);
    }

    if (minimoComplemento !== undefined) {
        updateFields.push('minimoComplemento = ?');
        updateValues.push(minimoComplemento);
    }

    if (maximoComplemento !== undefined) {
        updateFields.push('maximoComplemento = ?');
        updateValues.push(maximoComplemento);
    }

    if (estadoComplemento !== undefined) {
        updateFields.push('estadoComplemento = ?');
        updateValues.push(estadoComplemento);
    }

    sql += updateFields.join(', ');
    sql += ` WHERE idComplemento = ?`;
    updateValues.push(idComplemento);

    // Ejecutar la consulta SQL
    connection.query(sql, updateValues, (error, results) => {
        if (error) {
            console.error('Error while updating:', error.stack);
            res.status(500).json({ error: 'Error al actualizar el complemento' });
            return;
        }
        res.json({ message: 'Complemento actualizado exitosamente' });
    });
};

// Crear un nuevo complemento
exports.createComplement = (req, res) => {
    const { nombreComplemento, minimoComplemento, maximoComplemento, estadoComplemento } = req.body; // Obtener los datos del cuerpo de la petición

    // Verificar que se proporcionen los datos requeridos
    if (!nombreComplemento || minimoComplemento === undefined || maximoComplemento === undefined || estadoComplemento === undefined) {
        res.status(400).json({ error: 'Todos los campos son requeridos' });
        return;
    }

    // Construir la consulta SQL para la inserción
    const sql = 'INSERT INTO complementos (nombreComplemento, minimoComplemento, maximoComplemento, estadoComplemento) VALUES (?, ?, ?, ?)';
    const values = [nombreComplemento, minimoComplemento, maximoComplemento, estadoComplemento];

    // Ejecutar la consulta SQL para la inserción
    connection.query(sql, values, (error, results) => {
        if (error) {
            console.error('Error while inserting:', error.stack);
            res.status(500).json({ error: 'Error al insertar el complemento' });
            return;
        }
        res.status(201).json({ message: `Complemento creado con ID: ${results.insertId}` });
    });
};

// Desactivar un complemento (cambiar estado a 0)
exports.deleteComplement = (req, res) => {
    const idComplemento = req.params.id; // Obtener el ID del complemento de los parámetros de ruta

    // Construir la consulta SQL para cambiar el estado a 0
    const sql = 'UPDATE complementos SET estadoComplemento = 0 WHERE idComplemento = ?';

    // Ejecutar la consulta SQL para cambiar el estado a 0
    connection.query(sql, [idComplemento], (error, results) => {
        if (error) {
            console.error('Error while deleting:', error.stack);
            res.status(500).json({ error: 'Error al cambiar el estado del complemento' });
            return;
        }

        // Verificar si se actualizó algún registro
        if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Complemento no encontrado' });
        } else {
            res.json({ message: 'Complemento desactivado exitosamente' });
        }
    });
};

// Reactivar una complemento
exports.reactivateComplement = (req, res) => {
    const id = req.params.id;
  
    connection.query('UPDATE complementos SET estadoComplemento = 1 WHERE idComplemento = ?', [id], (error) => {
      if (error) {
        console.error('Error while updating the status:', error.stack);
        res.status(500).send('Error while reactivating complement');
        return;
      }
      res.send('Complement reactivated successfully');
    });
  };