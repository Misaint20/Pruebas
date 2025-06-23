// File: auth-test/src/controllers/authController.js
// Descripción: Este archivo contiene el controlador de autenticación que maneja las solicitudes relacionadas con la autenticación.
// El controlador se encarga de recibir las solicitudes HTTP y procesarlas, interactuar con el servicio de autenticación y devolver los resultados.
const AuthService = require('../services/authService');

// Descripción: Clase que representa el controlador de autenticación
class AuthController {
    // Constructor de la clase AuthController
    // Este constructor inicializa una instancia del servicio de autenticación, que se utilizará para realizar las operaciones de autenticación.
    constructor() {
        this.authService = new AuthService();
    }

    // Método para el registro de usuarios
    // Este método recibe las solicitudes POST a '/register' y procesa las solicitudes para registrar un nuevo usuario.
    // El método llama al servicio de autenticación para realizar la operación de registro de usuarios.
    async Register(req, res) {
        // Obtener los datos de la solicitud POST
        const { username, email, password, confirmPassword } = req.body;

        // Enviaar los datos de registro al servicio de autenticación
        // Si ocurre un error durante el registro, se captura y se devuelve una respuesta de error HTTP 400
        console.log('Register controller hit');
        const result = await this.authService.Register(username, email, password, confirmPassword);

        if (result.error) {
            console.error('Error in registration:', result.error);
            return res.status(400).json({ error: result.error });
        }
        res.status(201).json(result);
    }

    // Método para el inicio de sesión de usuarios
    // Este método recibe las solicitudes POST a '/login' y procesa las solicitudes para iniciar sesión de un usuario.
    // El método llama al servicio de autenticación para realizar la operación de inicio de sesión.
    async Login(req, res) {
        const { username, password } = req.body;

        // Enviar los datos de inicio de sesión al servicio de autenticación
        // Si ocurre un error durante el inicio de sesión, se captura y se devuelve una respuesta de error HTTP 400
        console.log('Login controller hit');
        const result = await this.authService.Login(username, password);

        if (result.error) {
            console.error('Error in login:', result.error);
            return res.status(400).json({ error: result.error });
        }
        res.status(200).json(result);
    }
}

// Exportación de la clase AuthController para que pueda ser utilizada en otros archivos
// Esto permite que el controlador de autenticación sea importado y utilizado en el archivo principal del servidor.
module.exports = AuthController;