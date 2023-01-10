const router = require('express').Router();
const userController =require('../controller/controller')

router.post('/save',userController.add);
router.post('/login',userController.login);
router.get("/session",userController.session)
router.post('/post',userController.emailSend)
module.exports = router;
