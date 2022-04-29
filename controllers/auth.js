const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { json } = require("express/lib/response");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");

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
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Hable con el adminsitrador" });
  }
};

//mandando a la BD con google signin
const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;
  try {
    const { correo, nombre, img } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      //tengo que crearlo
      const data = {
        correo,
        nombre,
        role: "ADMIN_ROLE", // le asigna un rol por defecto
        password: ":P",
        img,
        google: true,
      };

      usuario = new Usuario(data);

      await usuario.save();
    }

    //si el usuario en db
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Hable con el administrador, usuario bloqueado",
      });
    }

    //generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      message: "El token de google no se pudo verificar",
    });
  }
};

const renovarToken = async (req, res = response) => {
  const { usuario } = req;

  //generar JWT
  const token = await generarJWT(usuario.id);

  res.json({
    usuario,
    token,
  });
};

module.exports = { login, googleSignIn, renovarToken };
