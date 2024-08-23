const Department = require('./department');
module.exports = (sequelize, Sequelize) => {
  const Employee = sequelize.define('employee', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: Sequelize.STRING(32),
      allowNull: false
    },
    last_name: {
      type: Sequelize.STRING(32),
      allowNull: false
    },
    code: {
      type: Sequelize.STRING(32),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(32),
      allowNull: false
    },
    phone: {
      type: Sequelize.STRING(32),
      allowNull: false
    },
    username: {
      type: Sequelize.STRING(32),
      allowNull: false
    },
    password: {
      type: Sequelize.STRING(255),
      allowNull: false
    },
    departmentId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false
    },
    profile_path: {
      type: Sequelize.STRING(255),
      allowNull: true
    }
  }, {  
    tableName: 'employee',
    timestamps: false 
  });
  return Employee;
};
