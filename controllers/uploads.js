//path y fs ya estan incluido en nodeJS
const { path } = require("path");
const { fs } = require("fs");

//claudinary sdk
const cloudinary = require("cloudinary").v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers");

const { Usuario, Producto } = require("../models");

const cargarArchivo = async (req, res = response) => {
  try {
    //txt, md
    //const nombre = await subirArchivo(req.files, ["txt", "md"], "textos");
    const nombre = await subirArchivo(req.files, undefined, "imgs");
    res.json({
      nombre,
    });
  } catch (msg) {
    res.status(400).json({ msg });
  }
};

//Funcion asincrona por qué es conexion a base de datos.
const actualizarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(404).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(404).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Se me olvido validar esto",
      });
  }

  //limpiar imagenes previas
  if (modelo.img) {
    //Hay que borrar la imagen del servidor
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    console.log(pathImagen);
    //borrar imagen del servidor
    if (fs.existsSync(pathImagen)) {
      //permite borrar el archivo
      fs.unlinkSync(pathImagen);
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre;
  await modelo.save();
  res.json(modelo);
};

const actualizarImagenCloudinary = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res.status(404).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(404).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({
        msg: "Se me olvido validar esto",
      });
  }

  //limpiar imagenes previas
  if (modelo.img) {
    //divido el elemto en un arreglo
    const nombreArr = modelo.img.split("/");
    //extraigo la última fila del arreglo
    const nombre = nombreArr[nombreArr.length - 1];
    //corto mi arreglo por el punto
    const [public_id] = nombre.split(".");
    cloudinary.uploader.destroy(public_id);
  }

  //subir archivo a cloudinary
  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

  modelo.img = secure_url;
  await modelo.save();
  res.json(modelo);
};

const mostrarImagen = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let modelo;

  switch (coleccion) {
    case "usuarios":
      modelo = await Usuario.findById(id);
      if (!modelo) {
        return res
          .status(404)
          .json({ msg: `No existe un usuario con el id ${id}` });
      }
      break;

    case "productos":
      modelo = await Producto.findById(id);
      if (!modelo) {
        return res.status(404).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvido validar esto" });
  }

  //limpiar imagenes previas
  if (modelo.img) {
    //Hay que borrar la imagen del servidor
    const pathImagen = path.join(
      __dirname,
      "../uploads",
      coleccion,
      modelo.img
    );
    console.log(pathImagen);
    //borrar imagen del servidor
    if (fs.existsSync(pathImagen)) {
      return res.sendFile(pathImagen);
    }
  }

  const pathImagen = path.join(__dirname, "../assets/no-image.jpg");
  res.sendFile(pathImagen);
};

module.exports = {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
};
