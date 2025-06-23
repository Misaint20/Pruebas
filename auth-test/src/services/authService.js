// Description: AuthService class para manejar la autenticación de usuarios
// Este servicio se encarga de verificar la existencia de usuarios, crear nuevos usuarios y manejar el registro e inicio de sesión.
const fs = require('node:fs');
const path = require('node:path');
const bcrypt = require('bcryptjs');

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

    // Método para hashear la contraseña del usuario
    // Este método utiliza bcrypt para generar un hash seguro de la contraseña del usuario.
    async HashPassword(password) {
        try {
            // Se genera un salt de 16 rondas para mayor seguridad
            const salt = await bcrypt.genSalt(16)
            // Se hashea la contraseña utilizando el salt generado
            // bcrypt.hash es una función asíncrona que devuelve una promesa
            const hash = await bcrypt.hash(password, salt)
            // Se devuelve el hash generado
            console.log('Password hashed successfully');
            return hash
        } catch (error) {
            // Se imprime el error generado en caso de que ocurra un problema al hashear la contraseña
            // Esto es útil para depurar problemas de seguridad o errores en el proceso de hashing
            console.error('Error hashing password:', error);
            return { error: 'Failed to hash password' }
        }
    }

    async comparePasswords(password, hash) {
        try {
            // Se compara la contraseña con el hash recibido
            const isMatch = await bcrypt.compare(password, hash)
            if (!isMatch) {
                // Si las contraseñas no coinciden, se imprime un mensaje de error
                console.error('Passwords do not match');
                return { error: 'Passwords do not match' }
            }
            // Se devuelve verdadero si las contraseñas coinciden, de lo contrario, se devuelve falso
            return isMatch
        } catch (error) {
            // Se imprime el error generado en caso de que ocurra un problema al comparar las contraseñas
            // Esto es útil para depurar problemas de seguridad o errores en el proceso de comparación de contraseñas
            console.error('Error comparing passwords:', error);
            return { error: 'Failed to compare passwords' }
        }
    }

    // Método para el registro de usuarios
    // Este método recibe los datos del usuario solicitado y los valida, luego crea el usuario en la base de datos.
    // Si ocurre algún error durante el registro, devuelve un objeto con un mensaje de error.
    async Register(username, email, password, confirmPassword) {
        console.log('Register service hit');
        if (password !== confirmPassword) return { error: 'Passwords do not match' }
        if (!username || !email || !password || !confirmPassword) return { error: 'All fields are required' }

        // Se crea un objeto de usuario con los datos recibidos
        const user = {
            id: Date.now(),
            username,
            email,
            password
        }

        console.log('User object created:', user);
        // Se verifica si el usuario ya existe en la base de datos
        const userExists = await this.UserExists(username)
        if (userExists) return { error: 'User already exists' }
        console.log('User does not exist, proceeding to create user');

        // Se hashea la contraseña del usuario antes de guardarla en la base de datos
        const hashedPassword = await this.HashPassword(password)
        // Se asigna la contraseña hasheada al objeto de usuario
        if (hashedPassword.error) return { error: hashedPassword.error }
        user.password = hashedPassword

        // Se crea el usuario en la base de datos
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

        // Se verifica si el nombre de usuario y la contraseña están presentes
        // Si alguno de los campos está vacío, se devuelve un mensaje de error.
        if (!username || !password) return { error: 'Username and password are required' };

        // Se obtiene el usuario por su nombre de usuario
        // Este método verifica si el usuario existe y, si es así, devuelve el objeto del usuario.
        const user = await this.GetUser(username);

        // Si el usuario no existe, se devuelve un mensaje de error.
        if (!user) return { error: 'User not found' };

        // Se compara la contraseña con la contraseña hashada
        const isMatch = await this.comparePasswords(password, user.password)
        if (isMatch.error) return { error: isMatch.error };

        return { success: 'Login successful' };
    }

    // Método para obtener un usuario por su nombre de usuario
    // Este método verifica si el usuario existe y, si es así, devuelve el objeto del usuario.
    // Si el usuario no existe, devuelve null.
    async GetUser(username) {
        try {
            // Se lee el archivo de base de datos JSON
            const data = fs.readFileSync(dbPath, 'utf8');
            // Se extrae los usuarios del objeto JSON
            const users = data ? JSON.parse(data).users || [] : [];
            // Se busca el usuario por nombre de usuario
            const user = users.find(user => user.username === username);
            return user || null;
        } catch (error) {
            console.error('Error reading file:', error);
            return null;
        }
    }
}

// Exportación de la clase AuthService para que pueda ser utilizada en otros archivos
// Esto permite que el servicio de autenticación sea importado y utilizado en el archivo principal del servidor.
module.exports = AuthService