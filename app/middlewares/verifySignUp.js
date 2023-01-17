const db = require("../models");
const ROLES = db.ROLES;
const Staff = db.staff;

checkDuplicateEmailOrPhoneNumber = (req, res, next) => {
  // Username
  Staff.findOne({
    phoneNumber: req.body.phoneNumber
  }).exec((err, staff) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (staff) {
      res.status(400).send({ message: "Failed! Phone Number is already in use!" });
      return;
    }

    // Email
    Staff.findOne({
      email: req.body.email
    }).exec((err, staff) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (staff) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
        return;
      }

      next();
    });
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateEmailOrPhoneNumber,
  checkRolesExisted
};

module.exports = verifySignUp;
