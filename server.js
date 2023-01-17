const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");

const dbConfig = require("./app/config/db.config");

const app = express();

var corsOptions = {
  origin:['http://localhost:8081'], 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "clope-session",
    secret: "COOKIE_SECRET", // should use as secret environment variable
    httpOnly: true
  })
);

const db = require("./app/models");
const Role = db.role;

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

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Planet Staff Management application." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/staff.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
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
