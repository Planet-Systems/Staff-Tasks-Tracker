exports.allAccess = (req, res) => {
  res.status(200).send("Authentication Content.");
};

exports.pdaStaffPlatform = (req, res) => {
  res.status(200).send("PDA Staff Content.");
};

exports.projectAdminsPlatform = (req, res) => {
  res.status(200).send("Project Admin Content.");
};

exports.planetAdminsPlatform = (req, res) => {
  res.status(200).send("Planet Admin Content.");
};
