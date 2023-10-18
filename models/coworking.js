// le coworking model sert à créer un modèle de données qui sera ensuite utilisé pour créer des instances de données
module.exports = (sequelize , DataTypes) => {
    return sequelize.define('Coworking', {
        // Model attributes are defined here
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {msg : "this coworking already exist, please choose another name"},
            validate: {
                notNull: {
                    msg: "fill name field"
                }
            }
        },
        picture: {
            type: DataTypes.STRING
        },
        superficy: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "fill superficy field"
                },
                isInt: {
                    msg: "superficy must be an integer"
                  }
            }
        },
        capacity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        price: {
            type: DataTypes.JSON,
            allowNull: false,
            validate: {
                customValidator(value) {
                  if (value.hour === null && value.day === null && value.month === null) {
                    throw new Error("fill one of the price field");
                  }
                }
              }
        },
        address: {
            type: DataTypes.JSON,
        }
    }, {
        timestamps: true,
        createdAt: 'created',
        updatedAt: false
    })
}