const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const Staff = db.staff;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.session.token;

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.staffId = decoded.id;
    next();
  });
};

isProjectAdmin = (req, res, next) => {
  Staff.findById(req.staffId).exec((err, staff) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: staff.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "project-admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Project Admin Role!" });
        return;
      }
    );
  });
};

isPlanetAdmin = (req, res, next) => {
  Staff.findById(req.staffId).exec((err, staff) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: staff.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "planet-admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Planet Admin Role!" });
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  isProjectAdmin,
  isPlanetAdmin,
};
module.exports = authJwt;
