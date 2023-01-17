const config = require("../config/auth.config");
const db = require("../models");
const Staff = db.staff;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const staff = new Staff({
    surname: req.body.surname,
    givenName: req.body.givenName,
    email: req.body.email,
    phoneNumber : req.body.phoneNumber,
    password : bcrypt.hashSync(req.body.password, 8),
    gender: req.body.gender,
  });

  staff.save((err, staff) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          staff.roles = roles.map((role) => role._id);
          staff.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "Staff was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "staff" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        staff.roles = [role._id];
        staff.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "Staff was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  Staff.findOne({
    email: req.body.email,
  })
    .populate("roles", "-__v")
    .exec((err, staff) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!staff) {
        return res.status(404).send({ message: "Staff Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        staff.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      var token = jwt.sign({ id: staff.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < staff.roles.length; i++) {
        authorities.push("ROLE_" + staff.roles[i].name.toUpperCase());
      }

      req.session.token = token;

      res.status(200).send({
        id: staff._id,
        email: staff.email,
        roles: authorities,
        surname: staff.surname,
        givenName: staff.givenName,
        phoneNumber : staff.phoneNumber,
        gender: staff.gender,
      });
    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};
