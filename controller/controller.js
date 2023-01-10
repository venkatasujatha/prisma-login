const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();
const appConst = require("../appConstants");
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
      status: appConst.status.success,
      message: null,
      Response: user,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: appConst.status.fail,
      response: null,
      message: error.message,
    });
  }
};
//token updation
const login = async (req, res) => {
  try {
    let user = JSON.parse(JSON.stringify(req.body.user));
    console.log("user", user);

    // const { userName, password } = req.body;

    const find_user = await prisma.user.findUnique({
      where: {
        userName: String(user.userName),
      },
    });

    console.log(user.password);

    if (find_user) {
      const issame = await bcrypt.compare(user.password, find_user.password);

      if (issame) {
        user.token = jwt.sign({ id: find_user.id }, process.env.secretKey);

        // res.cookie("jwt", token)

        console.log(user.token);

        const resp = await prisma.user.update({
          where: {
            userName: String(user.userName),
          },
          data: {
            userName: user.userName,
            password: find_user.password,
            token: user.token,
          },
        });

        res.status(200).json({
          status: appConst.status.success,
          response: find_user,
          message: null,
        });
      } else {
        res.status(401).json({
          status: appConst.status.in_correct,
          response: null,
        });
      }
    } else {
      res.status(401).json({
        status: appConst.status.in_correct_userName,

        response: null,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: appConst.status.fail,

      response: null,

      message: error.message,
    });
  }
};

//session expiration
const session = async (req, res) => {
  try {
    if (req.session.views) {
      req.session.views++;
      res.write(
        `
  <p> Session expires after 1 min of in activity: ` +
          req.session.cookie.expires +
          "</p>"
      );
      res.end();
    } else {
      req.session.views = 1;
      res.end(" New session is started");
    }
  } catch (error) {
    res.send(error.message);
  }
};

module.exports = { add, login, session };
