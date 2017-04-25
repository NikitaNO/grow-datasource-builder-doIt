module.exports = (req, res, next) => {
  res.locals = {
    title: 'Grow DataSources'
  };
  next();
};
