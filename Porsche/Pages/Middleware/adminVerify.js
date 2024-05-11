module.exports checkAdmin = (req, res, next) => {
  const  role  = req.user; // Assuming user role is stored in req.user
  if (role !== 'admin') {
      return res.status(400).json({ msg: "You are not an admin" });
  }
  next();
};
