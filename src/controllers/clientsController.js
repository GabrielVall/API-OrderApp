// Nos conectamos a la bd
const connection = require('../config/database.js');
// Incluimos las funciones
const { calculateExecutionTime, sendJsonResponse } = require('../utils/utilsCRUD');
// Mensaje estandar de error
const error_message = 'Error in mysql query';
// Mensaje estandar consulta completa
const success_message = null;
// Mensaje estanadar sin resultados
const no_data_message = null;

// Función para obtener todos los clientes
exports.getClients = (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 10;
    const offset = parseInt(req.query.offset, 10) || 0;
    const startTime = performance.now();

    connection.query(
        "SELECT * FROM clients LIMIT ? OFFSET ?",
        [limit, offset],
        (error, results) => {
            const executionTimeMs = calculateExecutionTime(startTime);

            if (error) {
                console.error("Error al ejecutar la consulta:", error.stack);
                sendJsonResponse(res, 'error', error_message, null, executionTimeMs);
                return;
            }

            sendJsonResponse(res, 'success', success_message, { clients: results, total_results: results.length }, executionTimeMs);
        }
    );
};

// Función para obtener un cliente por ID
exports.getClientById = (req, res) => {
    const id = req.params.id;
    const startTime = performance.now();

    connection.query(
        "SELECT * FROM clients WHERE id = ?",
        [id],
        (error, results) => {
            const executionTimeMs = calculateExecutionTime(startTime);

            if (error) {
                console.error("Error al ejecutar la consulta:", error.stack);
                sendJsonResponse(res, 'error', error_message, null, executionTimeMs);
                return;
            }

            if (results.length === 0) {
                sendJsonResponse(res, 'error', no_data_message, null, executionTimeMs);
                return;
            }

            sendJsonResponse(res, 'success', success_message, results[0], executionTimeMs);
        }
    );
};

// Función para crear un nuevo cliente
exports.createClient = (req, res) => {
    const { id, name, phone } = req.body;  // Extraer los datos del cuerpo de la petición
    const startTime = performance.now();

    if (!id || !name || !phone) {
        const executionTimeMs = calculateExecutionTime(startTime);
        sendJsonResponse(res, 'error', 'id, name y phone are required', null, executionTimeMs);
        return;
    }

    connection.query('INSERT INTO clients (user_id, name, phone) VALUES (?, ?, ?)', [id, name, phone], (error, results) => {
        const executionTimeMs = calculateExecutionTime(startTime);

        if (error) {
            console.error("Error al insertar:", error.stack);
            sendJsonResponse(res, 'error', error_message, null, executionTimeMs);
            return;
        }

        sendJsonResponse(res, 'success', success_message, { clientId: results.insertId }, executionTimeMs);
    });
};

// Función para actualizar cliente
exports.updateClient = (req, res) => {
    const id = req.params.id;
    const { name, phone } = req.body;
    const startTime = performance.now();

    if (!name && !phone) {
        const executionTimeMs = calculateExecutionTime(startTime);
        sendJsonResponse(res, 'error', 'name o phone are required', null, executionTimeMs);
        return;
    }

    // Comprobar qué campos se deben actualizar y construir la consulta SQL en consecuencia
    let updateFields = [];
    if (name) {
        updateFields.push('name = ?');
    }
    if (phone) {
        updateFields.push('phone = ?');
    }

    // Construir la consulta SQL con los campos actualizables
    const sql = `UPDATE clients SET ${updateFields.join(', ')} WHERE id = ?`;

    // Crear un array con los valores a actualizar
    const values = [];
    if (name) {
        values.push(name);
    }
    if (phone) {
        values.push(phone);
    }
    values.push(id);

    connection.query(sql, values, (error) => {
        const executionTimeMs = calculateExecutionTime(startTime);

        if (error) {
            console.error("Error al actualizar:", error.stack);
            sendJsonResponse(res, 'error', error_message, null, executionTimeMs);
            return;
        }

        sendJsonResponse(res, 'success', success_message, null, executionTimeMs);
    });
};

// Función para buscar clientes
exports.searchClients = (req, res) => {
    const startTime = performance.now();
    const id = req.query.id;
    const name = req.query.name;
    const phone = req.query.phone;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    let sql = 'SELECT * FROM clients WHERE '; // corregido "clientes" por "clients"

    const searchConditions = [];
    const searchValues = [];

    if (id) {
        searchConditions.push('id = ?');
        searchValues.push(id);
    }

    if (name) {
        searchConditions.push('name LIKE ?');
        searchValues.push(`%${name}%`);
    }

    if (phone) {
        searchConditions.push('phone LIKE ?');
        searchValues.push(`%${phone}%`);
    }

    // Verificar si no se proporcionó ningún criterio de búsqueda válido
    if (searchConditions.length === 0) {
        const executionTimeMs = calculateExecutionTime(startTime);
        sendJsonResponse(res, 'error', 'Se requieren parámetros de búsqueda válidos', null, executionTimeMs);
        return;
    }

    sql += searchConditions.join(' AND ');

    // Agregar LIMIT y OFFSET a la consulta SQL
    sql += ' LIMIT ? OFFSET ?';
    searchValues.push(limit, offset);

    connection.query(sql, searchValues, (error, results) => {
        const executionTimeMs = calculateExecutionTime(startTime);

        if (error) {
            console.error("Error ejecutando la consulta:", error.stack);
            sendJsonResponse(res, 'error', error_message, null, executionTimeMs);
            return;
        }

        sendJsonResponse(res, 'success', success_message, results, executionTimeMs);
    });
};