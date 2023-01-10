const router = require('express').Router();
const userController =require('../controller/controller')

router.post('/save',userController.add);
router.post('/login',userController.login);
router.get("/session",userController.session)
module.exports = router;
