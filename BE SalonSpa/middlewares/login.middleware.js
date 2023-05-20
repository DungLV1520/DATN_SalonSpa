module.exports = async (req, res, next) => {
  const user = req.query;
  if (!user.room || !user.name) {
    res.redirect('/');
  }
  next();
};
