const { Router } = require("express");
const { check } = require("express-validator");

const {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
  actualizarImagenCloudinary,
} = require("../controllers/uploads");
const { coleccionesPermitidas } = require("../helpers");
const { validarCampos, validarArchivoSubir } = require("../middleware");

//ruta del router
const router = Router();

router.post("/", validarArchivoSubir, cargarArchivo);

router.put(
  "/:coleccion/:id",
  [
    validarArchivoSubir,
    check("id", "El id debe ser un mongo ID").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  //actualizarImagen
  actualizarImagenCloudinary
);

router.get(
  "/:coleccion/:id",
  [
    check("id", "El id debe ser un mongo ID").isMongoId(),
    check("coleccion").custom((c) =>
      coleccionesPermitidas(c, ["usuarios", "productos"])
    ),
    validarCampos,
  ],
  mostrarImagen
);

module.exports = router;
