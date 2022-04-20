const { Role, Usuario, Categoria, Producto } = require("../models/");

const esRoleValido = async (role = "") => {
  const existeRol = await Role.findOne({ role });
  if (!existeRol) {
    throw new Error(`El rol ${role} no esta registrado en la DB`);
  }
};

const emailExiste = async (correo = "") => {
  const existeEmail = await Usuario.findOne({ correo });
  if (existeEmail) {
    throw new Error(`El correo ${correo} esta registrado en la DB`);
  }
};

const existeUsuarioPorId = async (id) => {
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario) {
    throw new Error(`El id no existe ${id}`);
  }
};

//Validador personalizado para categorias
const existeCategoriaPorId = async (id) => {
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(`El id no existe ${id}`);
  }
};

//Validador personalizado para productos
const existeProductoPorId = async (id) => {
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) {
    throw new Error(`El id no existe ${id}`);
  }
};

//validar colecciones permitidas
const coleccionesPermitidas = (coleccion = "", colecciones= [])=>{
  const incluida = colecciones.includes(coleccion);

  if(!incluida){
    throw new Error(`La colección ${coleccion} no es permitida, ${colecciones}`)
  }

  return true;
}

module.exports = {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
  existeCategoriaPorId,
  existeProductoPorId,
  coleccionesPermitidas
};
