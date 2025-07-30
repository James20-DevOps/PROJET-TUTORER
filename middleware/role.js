// middleware/role.js
const role = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Accès interdit : rôle insuffisant.' });
      }
      next();
    };
  };
  
  module.exports = role;