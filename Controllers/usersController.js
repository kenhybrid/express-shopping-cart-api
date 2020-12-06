const argon = require("argon2");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { SECRET, EMAIL, PASSWORD, TITLE } = require("../Config");
const User = require("../Models/Users");

// all
exports.all = (req, res) => {
  // res.json({ message: "this is a list of all users" });
  User.find({})
    .then((users) => {
      const count = users.length;
      if (count < 1) {
        res.json({ error: "There are no Users" });
      } else {
        res.json({ count, users });
      }
    })
    .catch((error) => {
      res.json({ error: "Failed fetching users" });
    });
};

//register
exports.register = (req, res) => {
  // res.json({ message: "you can register here" });
  User.find({ u_email: req.body.u_email })
    .then((users) => {
      //check for an existing user
      if (users.length >= 1) {
        return res.json({ error: "Mail is already registered" });
      } else {
        //hash the password
        argon
          .hash(req.body.u_password)
          .then((hash) => {
            const newUser = new User({
              u_firstname: req.body.u_firstname,
              u_secondname: req.body.u_secondname,
              u_email: req.body.u_email,
              u_phone: req.body.u_phone,
              u_password: hash,
              u_roles: req.body.u_roles,
            });
            //save a user
            newUser
              .save()
              .then((doc) => {
                res.json({ message: "You have been registered", doc });
              })
              .catch((error) => {
                res.json({ error: "Failed to create a user" });
              });
          })
          .catch((error) => {
            res.json({ error: "Error hashing the password" });
          });
      }
    })
    .catch((error) => {
      res.json({ error: "Failed to create a user" });
    });
};

//login
exports.login = (req, res) => {
  // res.json({ message: "you can login here" });
  User.findOne({ u_email: req.body.u_email })
    .then((user) => {
      //check if user is registerd
      if (user) {
        argon
          .verify(user.u_password, req.body.u_password)
          .then((match) => {
            if (match) {
              //create a token
              const token = jwt.sign(
                {
                  _id: user._id,
                  u_email: user.u_email,
                  u_firstname: user.u_firstname,
                  u_phone: user.u_phone,
                  u_secondname: user.u_secondname,
                  u_roles: user.u_roles,
                },
                SECRET,
                {
                  expiresIn: "2d",
                }
              );
              res.json({ message: "You are logged in", token, user });
            } else {
              res.json({ error: "Auth failed" });
            }
          })
          .catch((error) => {
            res.json({ error: "Auth failed" });
          });
      } else {
        res.json({ error: "Email is not registered" });
      }
    })
    .catch((error) => {
      res.json({ error: "Auth failed" });
    });
};

//delete
exports.delete = (req, res) => {
  // res.json({ message: "delete a user" });
  const id = req.params.userId;
  User.deleteOne({
    _id: id,
  })
    .then((doc) => {
      res.json({
        message: "User  has been deleted",
      });
    })
    .catch((err) => {
      res.json({
        error: "could not delete user",
      });
    });
};

//reset
exports.reset = (req, res) => {
  //find the email to reset password for
  User.findOne({ u_email: req.body.u_email })
    .then((email) => {
      //if mail exists continue
      if (email) {
        const password = Math.floor(100000 + Math.random() * 900000);
        // hash a password

        argon
          .hash(`${password}`)
          .then((hash) => {
            //update password from database
            User.updateOne(
              { email: req.body.email },
              {
                $set: {
                  u_password: hash,
                },
              }
            )
              .then((update) => {
                //mail the password to the user

                // create a transporter
                const transporter = nodemailer.createTransport({
                  host: "smtp.gmail.com",
                  port: 587,
                  secure: false, // true for 465, false for other ports
                  auth: {
                    user: EMAIL,
                    pass: PASSWORD,
                  },
                });
                const message = {
                  from: TITLE + `<${EMAIL}>`, // sender address
                  to: req.body.email, // list of receivers req.body.email
                  subject: "PASSWORD RESET", // Subject line
                  text: `${this.password}`, // plain text body
                  html: `<center>HERE IS YOUR PASSWORD</center><br> <center> <b><h1>${password}</h1></b></center> `, // html body
                };
                // send mail with defined transport object
                transporter
                  .sendMail(message)
                  .then(() => {
                    res.json({
                      message: "Mail has been sent password reset successful",
                    });
                  })
                  .catch((error) => {
                    res.json({ error: "Mail has failed" });
                  });
              })
              .catch((error) => {
                res.json({ error: "Password reset has failed" });
              });
          })
          .catch((error) => {
            res.json({ error: " an error ocured" + error.message });
          });

        //out
      } else {
        res.json({ message: "Email is not registered" });
      }
    })
    .catch((error) => {
      res.json({ error: "Password reset has failed" });
    });
};

//change password
exports.change = (req, res) => {
  const id = req.params.userId;
  // find the user by id
  User.findById({ _id: id })
    .then((user) => {
      // confirm the initial password
      argon
        .verify(user.u_password, req.body.u_password)
        .then((match) => {
          if (!match) {
            res.json({
              error: "Password change failed initial password does not match",
            });
          } else {
            // if they match hash the new password and update
            argon
              .hash(req.body.u_newpassword)
              .then((hash) => {
                User.updateOne(
                  { _id: id },
                  {
                    $set: {
                      u_password: hash,
                    },
                  }
                )
                  .then((change) => {
                    res.json({ message: "Password has been changed" });
                  })
                  .catch((error) => {
                    res.json({ error: "Password change failed" });
                  });
              })
              .catch((error) => {
                res.json({ error: "Auth failed" });
              });
          }
        })
        .catch((error) => {
          res.json({ error: "Auth failed" });
        });
    })
    .catch((error) => {
      res.json({ error: "User not found" });
    });
};
