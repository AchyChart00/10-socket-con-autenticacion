const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { generarJWT } = require("../helpers/generarJWT");

const Usuario = require("../models/usuario");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    //Verificar si el correo existe en
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res
        .status(404)
        .json({ message: "Usuario / password no son correctos" });
    }
    //Verificar si el usuario esta activo en mi db

    if (!usuario.estado) {
      return res.status(404).json({
        message: "Usuario / password no son correctos -- estado:false",
      });
    }
    //Verificar Contraseña

    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(404).json({
        message: "Usuario / password no son correctos -- password",
      });
    }
    //generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Hable con el adminsitrador" });
  }
};

module.exports = { login };
