// Archivo principal de la aplicación
'use strict';

// Importar el módulo de servidor
const Server = require('./server');

// Crear una instancia del servidor
const server =new Server();

// Inicializar el servidor
server.init();

// Log para confirmar que el servidor se ha inicializado correctamente
console.log('Server initialized successfully');