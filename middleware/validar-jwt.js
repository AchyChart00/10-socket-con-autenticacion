const { response, request } = require("express");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({ message: "No hay token en la petición" });
  }
  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    //leer usuario que coresponde al uid est
    const usuario = await Usuario.findById(uid);
    //verifico si el usuario existe en la DB 
    if (!usuario) {
      return res
        .status(401)
        .json({ message: "token no valido - usuario no existe DB" });
    }
    //verificar si el uid tiene estado true
    if (!usuario.estado) {
      return res
        .status(401)
        .json({ message: "Token no valido - usuario estado false" });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "token no valido" });
  }
};

module.exports = {
  validarJWT,
};
