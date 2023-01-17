const { authJwt } = require("../middlewares");
const controller = require("../controllers/staff.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", 
    controller.allAccess );

  app.get("/api/test/pdaStaff", 
    [ authJwt.verifyToken ], 
    controller.pdaStaffPlatform );

  app.get(
    "/api/test/projectAdmin",
    [ authJwt.verifyToken, authJwt.isProjectAdmin ],
    controller.projectAdminsPlatform
  );

  app.get(
    "/api/test/planetAdmin",
    [ authJwt.verifyToken, authJwt.isPlanetAdmin ],
    controller.planetAdminsPlatform
  );
};
