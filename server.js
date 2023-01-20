const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const dbConfig = require("./app/authentication/config/db.config");
const db = require("./app/authentication/models");
const app = express();
const Role = db.role;
const PORT = process.env.PORT || 8080;

var corsOptions = {
  origin:['http://localhost:4200'], 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
};

app.use(cors(corsOptions));

app.use(
  cookieSession({
    name: "clope-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true
  })
);

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Connect to db
db.mongoose
  .connect(`${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

  // First route
  app.get("/", (req, res) => {
    res.json({ message: "Welcome to Planet Staff Management application." });
  });

  // Authentication routes
  require("./app/authentication/routes/auth.routes")(app);
  require("./app/authentication/routes/staff.routes")(app);

  // set port, listen for requests
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });

  function initial() {
    Role.estimatedDocumentCount((err, count) => {
      if (!err && count === 0) {
        new Role({
          name: "pda-staff"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'PDA-Staff' to roles collection");
        });

        new Role({
          name: "project-admin"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'Project Admin' to roles collection");
        });

        new Role({
          name: "planet-admin"
        }).save(err => {
          if (err) {
            console.log("error", err);
          }
          console.log("added 'Planet Admin' to roles collection");
        });
      }
    });     
}
