// Description: AuthService class para manejar la autenticación de usuarios
// Este servicio se encarga de verificar la existencia de usuarios, crear nuevos usuarios y manejar el registro e inicio de sesión.
const fs = require('node:fs');
const path = require('node:path');

// Ruta al archivo de base de datos JSON
// Este archivo se utiliza para almacenar y leer la información de los usuarios registrados en la aplicación (solo para caso de ejemplo).
const dbPath = path.join(__dirname, '../../database/database.json');

// Descripción: Clase que representa el servicio de autenticación
class AuthService  {
    constructor() {}

    // Método para verificar si un usuario ya existe en la base de datos
    // Este método lee el archivo de base de datos JSON y verifica si el usuario solicitado ya existe en la lista de usuarios.
    // Si el usuario existe, devuelve verdadero, de lo contrario, devuelve falso.
    async UserExists(username) {
        try {
            const data =fs.readFileSync(dbPath, 'utf8');
            const users = data ? JSON.parse(data).users || [] : [];
            return users.some(user => user.username === username);
        } catch (error) {
            if (error.code === 'ENOENT') {
                return false; 
            } else {
                console.error('Error reading file:', error);
                return { error: 'Failed to check user existence' }
            }
        }
    }

    // Método para crear un nuevo usuario
    // Este método recibe un objeto de usuario, lo agrega a la lista de usuarios en el archivo de base de datos JSON y luego escribe el archivo modificado en disco.
    // Si ocurre algún error durante la creación del usuario, devuelve un objeto con un mensaje de error.
    async CreateUser(user) {
        try {
            let users = [];
            if (fs.existsSync(dbPath)) {
                const data = fs.readFileSync(dbPath, 'utf8');
                users = data ? JSON.parse(data).users || [] : [];
            }
            users.push(user);
            fs.writeFileSync(dbPath, JSON.stringify({ users }, null, 2));
            return { success: true }; 
        }
        catch (error) {
            console.error('Error writing to database:', error);
            return { error: 'Failed to create user' }
        }
    }

    // Método para el registro de usuarios
    // Este método recibe los datos del usuario solicitado y los valida, luego crea el usuario en la base de datos.
    // Si ocurre algún error durante el registro, devuelve un objeto con un mensaje de error.
    async Register(username, email, password, confirmPassword) {
        console.log('Register service hit');
        if (password !== confirmPassword) return { error: 'Passwords do not match' }
        if (!username || !email || !password || !confirmPassword) return { error: 'All fields are required' }

        const user = {
            id: Date.now(),
            username,
            email,
            password
        }

        console.log('User object created:', user);
        const userExists = await this.UserExists(username)

        if (userExists) return { error: 'User already exists' }
        console.log('User does not exist, proceeding to create user');

        const result = await this.CreateUser(user)
        console.log('User created:', result);

        if (result.error) return { error: result.error }

        return { success: 'User created' }
    }

    // Método para iniciar sesión
    // Este método recibe el nombre de usuario y la contraseña, verifica si el usuario existe y si la contraseña es correcta.
    // Si la autenticación es exitosa, devuelve un mensaje de éxito, de lo contrario, devuelve un mensaje de error.
    async Login(username, password) {
        console.log('Login service hit');
        const user = await this.GetUser(username);

        if (!user) return { error: 'User not found' };
        if (user.password !== password) return { error: 'Incorrect password' };

        return { success: 'Login successful' };
    }

    // Método para obtener un usuario por su nombre de usuario
    // Este método verifica si el usuario existe y, si es así, devuelve el objeto del usuario.
    // Si el usuario no existe, devuelve null.
    async GetUser(username) {
        const user = await this.UserExists(username);
        if (!user) return null;
        return user;
    }
}

// Exportación de la clase AuthService para que pueda ser utilizada en otros archivos
// Esto permite que el servicio de autenticación sea importado y utilizado en el archivo principal del servidor.
module.exports = AuthService