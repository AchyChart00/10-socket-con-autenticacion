const { response } = require("express");

const esAdminRole = (req, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      message: "se quiere verificar el role sin validad el token primero",
    });
  }
  const { role, nombre } = req.usuario;
  if (role !== "ADMIN_ROLE") {
    return res.status(401).json({
      message: `${nombre} no es administrador - No puede hacer esto`,
    });
  }

  next();
};

const tieneRole = (...roles) => {
  return (req, res = response, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        message: "se quiere verificar el role sin validad el token primero",
      });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(200).json({
        msg: `El servicio requiere uno de estos roles ${roles}`,
      });
    }

    next();
  };
};

module.exports = { esAdminRole, tieneRole };
