process.loadEnvFile();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Employee, Department } = require('../config/database');
const { sendEmailToEmployee } = require('../util/email-sender');
const { Op } = require('sequelize');

exports.register = async (req, res) => {
  const { username, firstName: first_name, lastName: last_name, code, departmentId, email, phone } = req.body;
  try {
    const dept = await checkDepartmentExist(departmentId);
    
    if (!dept) {
      res.status(401).json({ error: 'Invalid department Id' });
    }
    
    const password = generateRandomPassword(6);
    const hashedPassword = await bcrypt.hash(password, 10);
    await Employee.create({ username, first_name, last_name, code, departmentId, email, phone, password: hashedPassword, createdAt : new Date(), isActive: true });
    sendEmailToEmployee(email, password, username);
    
    return res.status(201).json({ message: 'Employee registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register employee' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Employee.findOne({ where: { username } });
    if (!user) return res.status(404).json({ error: 'Employee not found' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.id, username: user.username, code: user.code }, process.env.ACCESS_TOKEN_SECRET);
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to log in' });
  }
};
  
exports.getEmploeyees = async (req, res) => {
  try {
    const dept = await checkDepartmentExist(req.params.id);
    if (!dept) {
      res.status(401).json({ error: 'Invalid department Id' });
    }
    const { limit, offset, sort, desc } = req.query;
    const FIELDS = ['id', 'first_name', 'last_name', 'code', 'email', 'phone'];
    if(!FIELDS.includes(sort)) {
      res.status(401).json({ error: 'Invalid sort field' });
    }
    const employee = await Employee.findAndCountAll(
      {
        limit: parseInt(limit),
        offset: parseInt(offset),
        where: {
          departmentId: { [Op.eq]: req.params.id }
        },
        order: [[sort, desc ? 'DESC' : 'ASC']],
        attributes: FIELDS
      }
    );
    res.status(201).json({ data: employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
}

exports.updateEmployee = async (req, res) => {
  const { username, firstName: first_name, lastName: last_name, code, departmentId, email, phone } = req.body;
  try {
    const dept = await checkDepartmentExist(departmentId);
    
    if (!dept) {
      res.status(401).json({ error: 'Invalid department Id' });
    }
  
    await Employee.update({ 
      username, first_name, 
      last_name, code, 
      departmentId, 
      email, 
      phone,
    }, {
      where: { id: req.params.id }
    });
    
    return res.status(201).json({ message: 'Employee updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update employee' });
  }
}

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await checkEmployeeExist(req.params.id);
    if (!employee) {
      res.status(401).json({ error: 'Invalid Employee Id' });
    }
    await Employee.destroy({
      where: {
         id: req.params.id
      }
    });
    res.status(201).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
  
}
exports.getOneEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({ 
      where: { id: req.params.id },
      attributes: ['id', 'first_name', 'last_name', 'code', 'phone', 'email', 'profile_path']
    });

    if (!employee) {
      res.status(401).json({ error: 'Invalid Employee Id' });
    }
    employee.profilePath = `uploads/${employee.code}`;
    res.status(201).json({ data: employee });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
}

exports.updateProfilePath = async (fileName, employeeId) => {
 try {
  await Employee.update({ 
    profile_path: `uploads/${fileName}`
  }, {
    where: { id: employeeId }
  });
  return true;
 } catch (error) {
  console.log(error);
 }
}

const checkEmployeeExist = async(id) => {
  const employee = await Employee.findOne({ where: { id }})
  return employee ? true : false;
}
const checkDepartmentExist = async departmentId => {
  const department = await Department.findOne({ where: { id: departmentId } });
  return department ? true : false;
}

const generateRandomPassword = (length) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
  let password = '';
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
  }
  return password;
}