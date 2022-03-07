const { Router } = require("express");
const { check } = require("express-validator");

const { login } = require("../controllers/auth");
const { validarCampos } = require("../middleware/validar-campos");

//ruta del router
const router = Router();

//defino la ruta post
router.post(
  "/login",
  [
    check("correo", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  login
);

module.exports = router;
