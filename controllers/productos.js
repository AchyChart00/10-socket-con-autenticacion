const { response } = require("express");
const { Producto } = require("../models");

//obtenerCategorias- paginado - total - populate
const obtenerProductos = async (req, res = response) => {
  //indico que solo los usuarios en estado true se muestren

  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  /* Promesas de manera individual   
const usuarios = await Usuario.find(query).skip(desde).limit(limite);

  const total = await Usuario.countDocuments(query); */

  //disparar peticiones de manera simultanea
  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .skip(desde)
      .limit(limite)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre"),
  ]);

  res.json({
    total,
    productos,
  });
};

//obtenerCategoria - populate{}
const obtenerProducto = async (req, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");

  res.json({
    producto,
  });
};

const crearProducto = async (req, res = response) => {
  /*para este proyecto grabaremos las categorias en mayusculas, 
    pero esto es a discreción de nuestro modelo, no tiene que ser así
  */
  const { estado, usuario, ...body } = req.body;
  const productoDB = await Producto.findOne({ nombre: body.nombre });

  if (productoDB) {
    return res
      .status(400)
      .json({ msg: `El producto ${productoDB.nombre} ya existe` });
  }

  //generar la data a guardar la categoria
  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.usuario._id,
  };

  const producto = new Producto(data);

  //guardar db
  await producto.save();

  res.status(201).json(producto);
};

//actualizarCategoria //Solo el nombre
const actualizarProducto = async (req, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;
  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }
  data.usuario = req.usuario._id;
  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });

  res.json({
    producto,
  });
};

//borrarCategoria - estado: false
const borrarProducto = async (req, res = response) => {
  const { id } = req.params;

  //fisicamente los borramos, para siempre
  /* const usuario = await Usuario.findByIdAndDelete(id); */

  //cambiamos el estado del usuario
  const producto = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json({
    producto,
    msg: "Categoria borrada exitosamente",
  });
};

module.exports = {
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  borrarProducto,
};
