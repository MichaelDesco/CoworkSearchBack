const userRoles = ['user', 'admin', 'superadmin']

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {msg : "username already exist"},
        validate: {
            notNull: {
                msg: "fill username field"
            }
        }
      },
      roles: {
        type: DataTypes.STRING,
        defaultValue: 'user',
        set(roles) {
          this.setDataValue('roles', roles.join())
        },
        get() {
          return this.getDataValue('roles').split(',')
        },
        validate: {
          areRolesValid(roles){
            if(!roles){
              throw new Error('roles cannot be empty')
            }
            roles.split(',').forEach(role => {
              if(!userRoles.includes(role)){
                throw new Error(`role ${role} is not valid`)
              }
            })
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mail:{
        type: DataTypes.STRING,
        allowNull: false,
        isEmail: true
      }
    })
  }