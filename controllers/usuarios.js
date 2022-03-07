const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
//Permite crear instancias de mi modelo
//es un estandar la U mayuscula
const Usuario = require("../models/usuario");

const usuariosGet = async (req = request, res = response) => {
  //const { q, nombre = "No name", apikey } = req.query;

  //get de todos los usuarios

  const { limite = 5, desde = 0 } = req.query;

  //indico que solo los usuarios en estado true se muestren
  const query = { estado: true };

  /* Promesas de manera individual   
const usuarios = await Usuario.find(query).skip(desde).limit(limite);

  const total = await Usuario.countDocuments(query); */

  //disparar peticiones de manera simultanea
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(desde).limit(limite),
  ]);

  res.json({
    total,
    usuarios,
  });
};

const usuariosPost = async (req, res = response) => {
  //extraigo el body
  const { nombre, correo, password, role } = req.body;
  //creo la instancia para mongo
  const usuario = new Usuario({ nombre, correo, password, role });
  //guarda la información recibida en mongoDB

  //Encriptar Contraseña
  //1 verificar que el correo exite

  //2 encriptar la contraseña, el valor por defecto es 10
  const salt = bcryptjs.genSaltSync();
  usuario.password = bcryptjs.hashSync(password, salt);
  //guarda la información recibida en mongoDB
  await usuario.save();

  res.json({
    usuario,
  });
};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  //TODO validar contra base de datos para
  if (password) {
    //encriptar la contraseña, el valor por defecto es 10
    const salt = bcryptjs.genSaltSync();
    resto.password = bcryptjs.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json({
    usuario,
  });
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;

  //fisicamente los borramos, para siempre
  /* const usuario = await Usuario.findByIdAndDelete(id); */

  //cambiamos el estado del usuario
  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

  res.json({
    usuario,
  });
};

const usuariosPath = (req, res = response) => {
  res.json({
    msg: "path API-controlador",
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
  usuariosPath,
};
