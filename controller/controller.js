const { PrismaClient } = require("@prisma/client");
const jwt =require('jsonwebtoken')
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();
//post
const add = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = encryptedPassword;
    console.log("password::   " + encryptedPassword);
    const user = await prisma.user.create({
      data: req.body,
    });
    //res.json(user);
    res.status(200).json({
      message: "record inserted successfully",
      Response: user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "record not inserted successfully",
      Response: error.message,
    });
  }
};
//token updation
const login = async (req, res) => {
  try {
    let user = JSON.parse(JSON.stringify(req.body.user));

    // const { userName, password } = req.body;

    const find_user = await prisma.user.findUnique({
      where: {
        userName: String(user.userName),
      },
    });

    console.log(find_user.password);

    console.log(user.password);

    if (find_user) {
      const issame = await bcrypt.compare(user.password, find_user.password);

      if (issame) {
        user.token = jwt.sign({ id: find_user.id }, process.env.secretKey);

        // res.cookie("jwt", token)

        console.log(user.token);

        const resp = await prisma.user.update({
          where:{
            userName: String(user.userName)
          },
          data:{
            userName:user.userName,
            password:find_user.password,
            token:user.token}
          });

       
        res.status(200).json({
          status: "success",
          response: find_user,
          message: "you have logged in successfully",
        });
      } else {
        res.status(401).json({
          status: "failed!..",

          response: null,

          message: "incorrect password",
        });
      }
    } else {
      res.status(401).json({
        status: "failed!..",

        response: null,

        message: "incorrect or invalid username",
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "failed",

      response: null,

      message: error.message,
    });
  }
};



module.exports = { add,login};
