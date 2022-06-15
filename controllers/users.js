const handleUsers = (req, res, db) => {
  db.select("*")
    .from("users")
    .then((users) => res.json(users.sort((a, b) => a.id - b.id)));
};

module.exports = {
  handleUsers: handleUsers,
};
