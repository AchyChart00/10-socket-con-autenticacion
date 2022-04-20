const path = require("path");
const { nanoid } = require("nanoid");

const subirArchivo = (
  files,
  extensionesValidas = ["png", "jpg", "jpeg", "gif"],
  carpeta = ""
) => {
  return new Promise((resolve, reject) => {
    console.log("req.files >>>", files); // eslint-disable-line

    const { archivo } = files;

    //VALIDAR EXTENSION
    //separo el nombre del archivo en arreglo
    const nombreCortado = archivo.name.split(".");
    //sacar extension
    const extension = nombreCortado[nombreCortado.length - 1];
    //validar EXTENSION

    if (!extensionesValidas.includes(extension)) {
      return reject(
        `La extension ${extension} no es permitida - ${extensionesValidas}`
      );
    }

    //asignar id a los archivos
    const nombreTemp = nanoid() + "." + extension;

    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemp);
    //const uploadPath = path.join(__dirname, "../uploads/", archivo.name);

    archivo.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(uploadPath);
    });
  });
};

module.exports = {
  subirArchivo,
};
