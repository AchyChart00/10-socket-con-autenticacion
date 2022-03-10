const { Router } = require("express");
const { check } = require("express-validator");

const {
  crearProducto,
  actualizarProducto,
  borrarProducto,
  obtenerProducto,
  obtenerProductos,
} = require("../controllers/productos");
const {
  existeCategoriaPorId,
  existeProductoPorId,
} = require("../helpers/db-validators");

const {
  validarCampos,
  validarJWT,
  tieneRole,
  esAdminRole,
} = require("../middleware");

//ruta del router
const router = Router();

//obtener todas las categorias - publico
router.get("/", obtenerProductos);

//obtener una categoria por id - publico
//validación personalizada para validar ID
router.get(
  "/:id",
  [
    check("id", "No es un ID de Mongo válido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  obtenerProducto
);

//crear categoria- privado - cualquier persona con un token válido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "No es un ID de mongo").isMongoId(),
    check("categoria").custom(existeCategoriaPorId),
    validarCampos,
  ],
  crearProducto
);

//actualizar - privado- cualquiera con token válido
router.put(
  "/:id",
  [
    validarJWT,
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  actualizarProducto
);

//borrar una categoria- admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un ID Mongo válido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  borrarProducto
);

module.exports = router;
