// File: authRoutes.js
// Descripción: Este archivo define las rutas de autenticación de la aplicación.
const express = require('express');

// Importar el controlador de autenticación
// Este controlador maneja la lógica de negocio relacionada con la autenticación, como el registro de usuarios.
// Se encarga de recibir las solicitudes HTTP y procesarlas, interactuando con el servicio de autenticación.
const AuthController = require('../controllers/authController');

// Crear una instancia del enrutador de Express
// Este enrutador se utiliza para definir las rutas de la API relacionadas con la autenticación
const router = express.Router();

// Crear una instancia del controlador de autenticación
// Esta instancia se utilizará para manejar las solicitudes de registro de usuarios.
const controller = new AuthController();

// Definir la ruta para el registro de usuarios
// Esta ruta maneja las solicitudes POST a '/register' y utiliza el método Register del controlador de autenticación
router.post('/register', async (req, res) => {
        // Llamar al método Register del controlador de autenticación
        console.log('Register endpoint hit');
        await controller.Register(req, res);
})

// Definir la ruta para el inicio de sesión de usuarios
// Esta ruta maneja las solicitudes POST a '/login' y utiliza el método Login del controlador de autenticación.
router.post('/login', async (req, res) => {
        // Llamar al método Login del controlador de autenticación
        console.log('Login endpoint hit');
        await controller.Login(req, res);
});

// Exportar el enrutador para que pueda ser utilizado en otros archivos
// Esto permite que las rutas definidas en este archivo sean accesibles desde el archivo principal del servidor.
module.exports = router;