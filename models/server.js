const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { createServer } = require("http");

const { dbConnection } = require("../database/config");
const { socketController } = require("../sockets/Controller");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = createServer(this.app);
    this.io = require("socket.io")(this.server);

    this.paths = {
      auth: "/api/auth",
      buscar: "/api/buscar",
      categorias: "/api/categorias",
      usuarios: "/api/usuarios",
      productos: "/api/productos",
      uploads: "/api/uploads",
    };
    /* this.usuariosPath = "/api/usuarios";
    this.authPath = "/api/auth"; */

    //Conectar a Base de Datos para
    this.conectarDB();
    //middlewares Función que va añadir funcionalidad a mi webserver
    this.middlewares();
    //rutas de mi aplicacion
    this.routes();
    //Sockets
    this.sockets();
  }

  async conectarDB() {
    await dbConnection();
  }

  middlewares() {
    //CORS
    this.app.use(cors());

    //lectura y parseo del body
    this.app.use(express.json());

    //Directorio publico
    //middleware usando use
    this.app.use(express.static("public"));

    //FileUpload - Carga de archivos
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    //definición de rutas
    this.app.use(this.paths.auth, require("../routes/auth"));
    this.app.use(this.paths.usuarios, require("../routes/usuarios"));
    this.app.use(this.paths.categorias, require("../routes/categorias"));
    this.app.use(this.paths.productos, require("../routes/productos"));
    this.app.use(this.paths.buscar, require("../routes/buscar"));
    this.app.use(this.paths.uploads, require("../routes/uploads"));
  }

  sockets() {
    this.io.on("connection", socketController);
  }

  listen() {
    //Usabamos server en lugar de express ya que express no tiene sockets
    this.server.listen(this.port, () => {
      console.log("listening on port " + this.port);
    });
  }
}

module.exports = Server;
