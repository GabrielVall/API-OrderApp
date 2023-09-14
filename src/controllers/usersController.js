const connection = require("../config/database.js");

// Obtener todos los usuarios
exports.getUsers = (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    connection.query(
        "SELECT * FROM usuarios LIMIT ? OFFSET ?",
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

// Obtener un usuario por ID
exports.getUserById = (req, res) => {
    const id = req.params.id;

    connection.query(
        "SELECT * FROM usuarios WHERE idUsuario = ?",
        [id],
        (error, results) => {
            if (error || results.length === 0) {
                res.status(404).send("User not found");
                return;
            }
            res.json(results[0]);
        }
    );
};

// Buscar usuarios
exports.searchUsers = (req, res) => {
    const idNivel = req.query.idNivel;
    const idEstado = req.query.idEstado;
    const correoUsuario = req.query.correoUsuario;
    const contrasenaUsuario = req.query.contrasenaUsuario;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    let sql = 'SELECT * FROM usuarios WHERE ';

    const searchConditions = [];
    const searchValues = [];

    if (idNivel) {
        searchConditions.push('idNivel = ?');
        searchValues.push(idNivel);
    }

    if (idEstado) {
        searchConditions.push('idEstado = ?');
        searchValues.push(idEstado);
    }

    if (correoUsuario) {
        searchConditions.push('correoUsuario LIKE ?');
        searchValues.push(`%${correoUsuario}%`);
    }

    if (contrasenaUsuario) {
        searchConditions.push('contrasenaUsuario LIKE ?');
        searchValues.push(`%${contrasenaUsuario}%`);
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

const bcrypt = require('bcrypt'); //Libreria de encriptación
const saltRounds = 10; // Número de rondas de hashing

exports.createUser = (req, res) => {
    const { idNivel, idEstado, correoUsuario, contrasenaUsuario } = req.body;  // Extraer los datos del cuerpo de la petición

    if (!idNivel || !idEstado || !correoUsuario || !contrasenaUsuario) {
        res.status(400).send('idNivel, idEstado, correoUsuario, and contrasenaUsuario are required');
        return;
    }

    // Encriptar la contraseña
    bcrypt.hash(contrasenaUsuario, saltRounds, (error, hashedPassword) => {
        if (error) {
            console.error('Error while hashing password:', error.stack);
            res.status(500).send('Error while hashing password');
            return;
        }

        // Utilizar una consulta preparada para insertar los valores en la base de datos
        connection.query('INSERT INTO usuarios (idNivel, idEstado, correoUsuario, contrasenaUsuario) VALUES (?, ?, ?, ?)', [idNivel, idEstado, correoUsuario, hashedPassword], (error, results) => {
            if (error) {
                console.error('Error while inserting:', error.stack);
                res.status(500).send('Error while inserting user');
                return;
            }
            res.status(201).send(`User created with ID: ${results.insertId}`);
        });
    });
};

// Actualizar usuario
exports.updateUser = (req, res) => {
    const idUsuario = req.params.id;
    const { idNivel, idEstado, correoUsuario, contrasenaUsuario } = req.body;

    // Verificar si se proporcionó al menos un campo para actualizar
    if (!idNivel && !idEstado && !correoUsuario && !contrasenaUsuario) {
        res.status(400).send('Se debe proporcionar al menos un campo para actualizar');
        return;
    }

    // Encriptar la nueva contraseña si se proporciona
    if (contrasenaUsuario) {
        bcrypt.hash(contrasenaUsuario, saltRounds, (error, hashedPassword) => {
            if (error) {
                console.error('Error while hashing password:', error.stack);
                res.status(500).send('Error while hashing password');
                return;
            }

            // Construir y ejecutar la consulta SQL de actualización con la nueva contraseña encriptada
            const sql = 'UPDATE usuarios SET ' +
                (idNivel ? 'idNivel = ?,' : '') +
                (idEstado ? 'idEstado = ?,' : '') +
                (correoUsuario ? 'correoUsuario = ?,' : '') +
                'contrasenaUsuario = ? ' +
                'WHERE idUsuario = ?';

            const values = [];
            if (idNivel) values.push(idNivel);
            if (idEstado) values.push(idEstado);
            if (correoUsuario) values.push(correoUsuario);
            values.push(hashedPassword, idUsuario);

            connection.query(sql, values, (error) => {
                if (error) {
                    console.error('Error while updating:', error.stack);
                    res.status(500).send('Error while updating user');
                    return;
                }
                res.send('User updated successfully');
            });
        });
    } else {
        // Si no se proporciona nueva contraseña, actualizar los otros campos
        // Construir y ejecutar la consulta SQL de actualización sin cambiar la contraseña
        const sql = 'UPDATE usuarios SET ' +
            (idNivel ? 'idNivel = ?,' : '') +
            (idEstado ? 'idEstado = ?,' : '') +
            (correoUsuario ? 'correoUsuario = ?,' : '') +
            'contrasenaUsuario = contrasenaUsuario ' +
            'WHERE idUsuario = ?';

        const values = [];
        if (idNivel) values.push(idNivel);
        if (idEstado) values.push(idEstado);
        if (correoUsuario) values.push(correoUsuario);
        values.push(idUsuario);

        connection.query(sql, values, (error) => {
            if (error) {
                console.error('Error while updating:', error.stack);
                res.status(500).send('Error while updating user');
                return;
            }
            res.send('User updated successfully');
        });
    }
};