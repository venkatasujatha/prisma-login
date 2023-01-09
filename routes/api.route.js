const router = require('express').Router();
const userController =require('../controller/controller')

router.post('/save',userController.add)
module.exports = router;
