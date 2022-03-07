const { Router } = require("express");
const { check } = require("express-validator");

const { login, googleSignIn } = require("../controllers/auth");
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

router.post(
  "/google",
  [
    check("id_token", "Token de google necesario ").not().isEmpty(),
    validarCampos,
  ],
  googleSignIn
);

module.exports = router;
