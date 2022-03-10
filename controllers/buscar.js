const { response } = require("express");
const { ObjectId } = require("mongoose").Types;

const { Usuario, Categoria, Producto } = require("../models/");

//coleccion que indica al usuario el parametro  que debe ir en el url
const coleccionesPermitidas = ["usuarios", "categorias", "productos", "roles"];

const buscarUsuarios = async (termino = "", res = response) => {
  //validamos si el termino es un mongo ID
  const esMongoID = ObjectId.isValid(termino); //true

  if (esMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      //En caso de que el id sea un mongo valido pero no exista, utilizamos un ternario para que no nos regrese un null
      results: usuario ? [usuario] : [],
    });
  }

  //expresion regular, para no se sensible a mayuculas.
  const regex = new RegExp(termino, "i");

  //puede utilizarse el cound para ver cuantos resultados nos encuentra.
  const usuarios = await Usuario.find({
    //or propio de mongoDB
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });

  res.json({
    results: usuarios,
  });
};

const buscarCategorias = async (termino = "", res = response) => {
  //validamos si el termino es un mongo ID
  const esMongoID = ObjectId.isValid(termino); //true

  if (esMongoID) {
    const categoria = await Categoria.findById(termino);
    return res.json({
      //En caso de que el id sea un mongo valido pero no exista, utilizamos un ternario para que no nos regrese un null
      results: categoria ? [categoria] : [],
    });
  }

  //expresion regular, para no se sensible a mayuculas.
  const regex = new RegExp(termino, "i");

  //puede utilizarse el cound para ver cuantos resultados nos encuentra.
  const categorias = await Categoria.find(
    //or propio de mongoDB
    { nombre: regex, estado: true }
  );

  res.json({
    results: categorias,
  });
};

const buscarProductos = async (termino = "", res = response) => {
  //validamos si el termino es un mongo ID
  const esMongoID = ObjectId.isValid(termino); //true

  if (esMongoID) {
    const producto = await Producto.findById(termino).populate(
      "categoria",
      "nombre"
    );
    return res.json({
      //En caso de que el id sea un mongo valido pero no exista, utilizamos un ternario para que no nos regrese un null
      results: producto ? [producto] : [],
    });
  }

  //expresion regular, para no se sensible a mayuculas.
  const regex = new RegExp(termino, "i");

  //puede utilizarse el cound para ver cuantos resultados nos encuentra.
  const productos = await Producto.find({ nombre: regex, estado: true });
  populate("categoria", "nombre");

  res.json({
    results: productos,
  });
};

const buscar = (req, res = response) => {
  const { coleccion, termino } = req.params;

  //validamos la busqueda
  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: `Las colecciones permitidas: ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case "usuarios":
      buscarUsuarios(termino, res);
      break;
    case "categorias":
      buscarCategorias(termino, res);
      break;
    case "productos":
      buscarProductos(termino, res);
      break;

    default:
      res.status(500).json({ msg: "Se me olvido hacer una busqueda" });
      break;
  }
};

module.exports = {
  buscar,
};
