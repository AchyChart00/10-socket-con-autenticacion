const { Router } = require("express");
const { check } = require("express-validator");

const {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosPath,
  usuariosDelete,
} = require("../controllers/usuarios");
const {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validators");

/* const { validarCampos } = require("../middleware/validar-campos");
const { validarJWT } = require("../middleware/validar-jwt");
const { esAdminRole, tieneRole } = require("../middleware/validar-roles"); */
const {validarCampos, tieneRole, validarJWT} = require("../middleware/index")

//ruta del router
const router = Router();

router.get("/", usuariosGet);

router.put(
  "/:id",
  [
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("role").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPut
);

router.post(
  "/",
  [
    //check lo que hace es enviar un par de erroes a request
    //si es que se generan

    //se realiza la netacion de con not.isEmpty = !isEmpty
    check("nombre", "El nombre no es valido").not().isEmpty(),
    check(
      "password",
      "El password no es obligatorio y debe de más de 6 letras"
    ).isLength({ min: 6 }),
    check("correo", "El correo no es valido").isEmail(),
    check("correo").custom(emailExiste),
    //check("role", "No es un rol valido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    //check("role").custom((role)=>esRoleValido(role)),
    check("role").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPost
);

router.delete(
  "/:id",
  [
    validarJWT,
    //esAdminRole,
    tieneRole("ADMIN_ROLE", "VENTAS_ROLE"),
    check("id", "No es un ID válido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuariosDelete
);
router.patch("/", usuariosPath);

module.exports = router;
