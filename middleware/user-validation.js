const { body, param, query } = require('express-validator');

exports.validate = (validationType) => {
    switch (validationType) {
        case 'register': {
            return [ 
                body('username', 'username doesnt exists').exists(),
                body('code', 'code doesnt exists').exists(),
                body('firstName', 'firstName doesnt exists').exists(),
                body('lastName', 'lastName doesnt exists').exists(),
                body('departmentId', 'departmentId doesnt exists').exists(),
                body('email', 'email doesnt exists').exists(),
                body('phone', 'phone doesnt exists').exists(),
               ]  
            }
        case 'login': {
            return [ 
                body('username', 'Name doesnt exists').exists(),
                body('password', 'password doesnt exists').exists(),
                ]  
            }
        case 'getEmployee': {
            return [ 
                param('id', 'id doesnt exists').exists(),
                query('limit', 'limit doesnt exists').exists(),
                query('offset', 'offset doesnt exists').exists(),
                query('sort', 'sort doesnt exists').exists(),
                query('desc', 'sort doesnt exists').exists(),
                ]  
            }
        case 'update': {
            return [ 
                param('id', 'id doesnt exists').exists(),
                body('username', 'username doesnt exists').exists(),
                body('code', 'code doesnt exists').exists(),
                body('firstName', 'firstName doesnt exists').exists(),
                body('lastName', 'lastName doesnt exists').exists(),
                body('departmentId', 'departmentId doesnt exists').exists(),
                body('email', 'email doesnt exists').exists(),
                body('phone', 'phone doesnt exists').exists(),
            ]  
            }
        case 'delete': {
            return [ 
                param('id', 'id doesnt exists').exists()
            ]  
            }
        case 'get': {
            return [ 
                param('id', 'id doesnt exists').exists()
            ]  
            }
        default:
            break;
    }
}