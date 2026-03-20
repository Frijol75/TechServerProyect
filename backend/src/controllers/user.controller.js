const getUsers = (req, res) => {
  res.json({ message: "List of users" });
};

const createUser = (req, res) => {
  res.json({ message: "User created" });
};

module.exports = {
  getUsers,
  createUser
};