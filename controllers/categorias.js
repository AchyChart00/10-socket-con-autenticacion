const { response } = require("express");
const { Categoria } = require("../models");

//obtenerCategorias- paginado - total - populate
const obtenerCategorias = async (req, res = response) => {
  //indico que solo los usuarios en estado true se muestren

  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  /* Promesas de manera individual   
const usuarios = await Usuario.find(query).skip(desde).limit(limite);

  const total = await Usuario.countDocuments(query); */

  //disparar peticiones de manera simultanea
  const [total, categorias] = await Promise.all([
    Categoria.countDocuments(query),
    Categoria.find(query)
      .skip(desde)
      .limit(limite)
      .populate("usuario", "nombre"),
  ]);

  res.json({
    total,
    categorias,
  });
};

//obtenerCategoria - populate{}
const obtenerCategoria = async (req, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findById(id).populate("usuario", "nombre");

  res.json({
    categoria,
  });
};

const crearCategoria = async (req, res = response) => {
  /*para este proyecto grabaremos las categorias en mayusculas, 
    pero esto es a discreción de nuestro modelo, no tiene que ser así
  */
  const nombre = req.body.nombre.toUpperCase();
  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res
      .status(400)
      .json({ msg: `La categoria ${categoriaDB.nombre} ya existe` });
  }

  //generar la data a guardar la categoria
  const data = {
    nombre,
    usuario: req.usuario._id,
  };

  const categoria = new Categoria(data);

  //guardar db
  await categoria.save();

  res.status(201).json(categoria);
};

//actualizarCategoria //Solo el nombre
const actualizarCategoria = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.usuario._id;
  const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true });

  res.json({
    categoria,
  });
};

//borrarCategoria - estado: false
const borrarCategoria = async (req, res = response) => {
  const { id } = req.params;

  //fisicamente los borramos, para siempre
  /* const usuario = await Usuario.findByIdAndDelete(id); */

  //cambiamos el estado del usuario
  const categoria = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json({
    categoria,
    msg: "Categoria borrada exitosamente",
  });
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
};
