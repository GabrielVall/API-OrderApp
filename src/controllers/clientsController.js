const connection = require("../config/database.js");

// Obtener todos los clientes
exports.getClients = (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    connection.query(
        "SELECT * FROM clientes LIMIT ? OFFSET ?",
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

// Obtener un cliente por ID
exports.getClientById = (req, res) => {
    const id = req.params.id;

    connection.query(
        "SELECT * FROM clientes WHERE idCliente = ?",
        [id],
        (error, results) => {
            if (error || results.length === 0) {
                res.status(404).send("Client not found");
                return;
            }
            res.json(results[0]);
        }
    );
};

// Crear una nuevo cliente
exports.createClient = (req, res) => {
    const { idUsuario, nombreCliente, telefonoCliente } = req.body;  // Extraer los datos del cuerpo de la petición

    if (!idUsuario || !nombreCliente || !telefonoCliente) {
        res.status(400).send('idUsuario, nombreCliente, and telefonoCliente are required');
        return;
    }

    // Utilizar una consulta preparada para insertar los valores en la base de datos
    connection.query('INSERT INTO clientes (idUsuario, nombreCliente, telefonoCliente) VALUES (?, ?, ?)', [idUsuario, nombreCliente, telefonoCliente], (error, results) => {
        if (error) {
            console.error('Error while inserting:', error.stack);
            res.status(500).send('Error while inserting client');
            return;
        }
        res.status(201).send(`Client created with ID: ${results.insertId}`);
    });
};

// Actualizar cliente
exports.updateClient = (req, res) => {
    const idCliente = req.params.id;
    const { nombreCliente, telefonoCliente } = req.body;

    if (!nombreCliente && !telefonoCliente) {
        res.status(400).send('nombreCliente or telefonoCliente is required');
        return;
    }

    // Comprobar qué campos se deben actualizar y construir la consulta SQL en consecuencia
    let updateFields = [];
    if (nombreCliente) {
        updateFields.push('nombreCliente = ?');
    }
    if (telefonoCliente) {
        updateFields.push('telefonoCliente = ?');
    }

    // Construir la consulta SQL con los campos actualizables
    const sql = `UPDATE clientes SET ${updateFields.join(', ')} WHERE idCliente = ?`;

    // Crear un array con los valores a actualizar
    const values = [];
    if (nombreCliente) {
        values.push(nombreCliente);
    }
    if (telefonoCliente) {
        values.push(telefonoCliente);
    }
    values.push(idCliente);

    connection.query(sql, values, (error) => {
        if (error) {
            console.error('Error while updating:', error.stack);
            res.status(500).send('Error while updating category');
            return;
        }
        res.send('Client updated successfully');
    });
};

// Buscar clientes
exports.searchClients = (req, res) => {
    const idUsuario = req.query.idUsuario;
    const nombreCliente = req.query.nombreCliente;
    const telefonoCliente = req.query.telefonoCliente;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    let sql = 'SELECT * FROM clientes WHERE ';

    const searchConditions = [];
    const searchValues = [];

    if (idUsuario) {
        searchConditions.push('idUsuario = ?');
        searchValues.push(idUsuario);
    }

    if (nombreCliente) {
        searchConditions.push('nombreCliente LIKE ?');
        searchValues.push(`%${nombreCliente}%`);
    }

    if (telefonoCliente) {
        searchConditions.push('telefonoCliente LIKE ?');
        searchValues.push(`%${telefonoCliente}%`);
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