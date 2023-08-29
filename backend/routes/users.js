var express = require('express');
var router = express.Router();
const { getAll , addUser , getUser , updateUser, deleteUser, login } = require('./controllers/usersController')

/* GET users listing. */
router.post('/login', login);
router.post('/register', addUser);
router.get('/', getAll)
router.get('/:id',getUser)
router.put('/:id',updateUser)
router.delete('/:id',deleteUser)

module.exports = router;
