//modelo
const { Schema, model } = require("mongoose");

const UsuarioSchema = Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es obligatorio"],
  },
  correo: {
    type: String,
    required: [true, "El correo es obligatorio"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "El contraseña es obligatorio"],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    //enum: ["ADMIN_ROLE", "USER_ROLE"],
  },
  estado: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

//modificamos el json que de resp
UsuarioSchema.methods.toJSON =function(){
  const{__v, password, ...usuario} = this.toObject();
  return usuario;
}


//exportamos el modelo y va a ser el nombre que va a almacenar en la BD
module.exports = model("Usuario", UsuarioSchema);
