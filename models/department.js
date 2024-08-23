module.exports = (sequelize, Sequelize) => {
    const Department = sequelize.define('department', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING(32),
        allowNull: false
      }
    }, {  
      tableName: 'department',
      timestamps: false 
    });
    return Department;
  };
  