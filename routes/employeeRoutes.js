const express = require('express');
const { register, login, updateEmployee, deleteEmployee, getOneEmployee, updateProfilePath } = require('../controller/employeeController');
const { validationResult } = require('express-validator');
const { validate } = require('../middleware/user-validation');
const { getEmploeyees } = require('../controller/employeeController');
const multer = require('multer');
const router = express.Router();
const path = require('path');
const authenticateToken = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
     cb(null, 'public/uploads'); 
  },
  filename: function(req, file, cb) {
     cb(null, req.user.code + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: function(req, file, cb) {
     checkFileType(file, cb);
  }
}).single('image'); 


function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/; 
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
     return cb(null, true);
  } else {
     cb('Pls select any images');
  }
}

const checkValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
      return res.status(422).json({ errors: errors.array() });
    }
    next();
}

router.post('/register',validate('register'), checkValidation, register);
router.post('/login',validate('login'), checkValidation, login);
router.get('/department/:id',validate('getEmployee'), checkValidation, getEmploeyees);
router.get('/:id',validate('get'), checkValidation, getOneEmployee);
router.put('/:id',validate('update'), checkValidation, updateEmployee);
router.delete('/:id',validate('delete'), checkValidation, deleteEmployee);
router.post('/upload', authenticateToken, (req, res) => {
  upload(req, res, (err) => {
     if (err) {
        res.status(400).json({ message: err });
     } else {
        if (req.file == undefined) {
           res.status(400).json({ message: 'Pls select any files!' });
        } else {
          updateProfilePath(req.file.filename, req.user.id);
           res.json({
              message: 'Image uploaded successfully!',
              file: `uploads/${req.file.filename}`
           });
        }
     }
  });
});

module.exports = router;
