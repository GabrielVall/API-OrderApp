// Importar las clases Model y DataTypes de Sequelize
const { Model, DataTypes } = require('sequelize');

// Importar la instancia de Sequelize previamente configurada
const sequelize = require('../config/database'); // Suponiendo que tienes una configuración de Sequelize en '../config/database'

// Definición de la clase de modelo "Complements" que extiende de Sequelize "Model"
class Complements extends Model { }

// Inicializar el modelo "Complements"
Complements.init(
    {
        // Definir los campos de la tabla y sus tipos de datos
        idComplemento: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nombreComplemento: {
            type: DataTypes.STRING,
            allowNull: false, // No se permite un valor nulo para este campo
        },
        minimoComplemento: {
            type: DataTypes.INTEGER,
        },
        maximoComplemento: {
            type: DataTypes.INTEGER,
        },
        estadoComplemento: {
            type: DataTypes.STRING,
            allowNull: false, // No se permite un valor nulo para este campo
        }
    },
    {
        // Pasar la instancia de Sequelize para la conexión a la base de datos
        sequelize,

        // Especificar el nombre de la tabla en la base de datos (opcional)
        modelName: 'Complements' // Esto establecerá el nombre de la tabla en la base de datos como 'Complements'
    }
);

// Exportar el modelo "Complements" para que pueda ser utilizado en otros archivos
module.exports = Complements;