// Descripcion: Archivo principal de la aplicación
const express = require('express');
const morgan = require('morgan');
const AuthRoutes = require('./routes/authRoutes');

// Descripcion: Clase que representa el servidor de la aplicación
// Esta clase se encarga de configurar y ejecutar el servidor Express, incluyendo las rutas de autenticación.
class Server {
    // Constructor de la clase donde se inicializa el servidor Express y se define el puerto.
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
    }

    // Método para inicializar el servidor, configurar middlewares y definir las rutas.
    // Este método se encarga de configurar el servidor para que escuche en el puerto definido
    init() {
        // Configuración de middlewares
        this.app.use(express.json());
        this.app.use(morgan('dev'));

        // Rutas de la API
        this.app.get('/api', (req, res) => {
            res.send('Welcome to the Auth API');
        })

        // Rutas de autenticación
        // Aquí se importan y utilizan las rutas de autenticación definidas en authRoutes.js
        this.app.use('/api/auth', AuthRoutes);

        // Incialización del servidor para que escuche en el puerto definido
        // Al iniciar el servidor, se imprime un mensaje en la consola indicando que está corriendo
        this.app.listen(this.port, () => {
            console.log(`Server is running on http://localhost:${this.port}/api`);
        });
    }
}

// Exportación de la clase Server para que pueda ser utilizada en otros archivos
// Esto permite que el servidor sea importado y utilizado en el archivo principal de la aplicación.
module.exports = Server;