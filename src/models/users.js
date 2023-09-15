// Importar las clases Model y DataTypes de Sequelize
const { Model, DataTypes } = require('sequelize');

// Importar la instancia de Sequelize previamente configurada
const sequelize = require('../config/database'); // Suponiendo que tienes una configuración de Sequelize en '../config/database'

// Definición de la clase de modelo "Users" que extiende de Sequelize "Model"
class Users extends Model { }

// Inicializar el modelo "Users"
Users.init(
    {
        // Definir los campos de la tabla y sus tipos de datos
        id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        level_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status_id: {
            type: DataTypes.INTEGER,
            allowNull: false, // No se permite un valor nulo para este campo
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false, // No se permite un valor nulo para este campo
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false, // No se permite un valor nulo para este campo
        }
    },
    {
        // Pasar la instancia de Sequelize para la conexión a la base de datos
        sequelize,

        // Especificar el nombre de la tabla en la base de datos (opcional)
        modelName: 'Users' // Esto establecerá el nombre de la tabla en la base de datos como 'Users'
    }
);

// Exportar el modelo "Users" para que pueda ser utilizado en otros archivos
module.exports = Users;