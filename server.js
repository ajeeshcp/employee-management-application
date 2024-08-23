const express = require('express');
const http = require('http');
const { sequelize } = require('./config/database');
const authenticateToken = require('./middleware/auth');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const server = http.createServer(app);
app.use(express.static('./public'));


app.use(express.json());
app.use('/api/employee', employeeRoutes);

sequelize.sync().then(() => {
  server.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});
