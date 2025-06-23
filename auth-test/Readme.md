# Auth-Test

**Versión:** 1.0.0

## Descripción

Este proyecto es un ejemplo básico de backend para autenticación de usuarios utilizando Node.js, Express y almacenamiento en un archivo JSON. Permite registrar usuarios y realizar inicio de sesión, gestionando los datos de manera sencilla para fines de aprendizaje y pruebas.

---

## Características implementadas

- **Registro de usuarios** (`POST /api/auth/register`):  
  Permite crear nuevos usuarios, validando que el usuario no exista previamente y que las contraseñas coincidan. Los datos se almacenan en `database/database.json`.

- **Inicio de sesión** (`POST /api/auth/login`):  
  Permite autenticar usuarios existentes verificando nombre de usuario y contraseña.

- **Persistencia de datos**:  
  Los usuarios se almacenan en un archivo JSON local, simulando una base de datos.

- **Manejo básico de errores**:  
  Se valida la existencia de usuarios, coincidencia de contraseñas y campos requeridos, devolviendo mensajes de error claros y códigos HTTP apropiados.

---

## Ejemplo de uso

### Registro de usuario

**Endpoint:**  
`POST /api/auth/register`

**Body (JSON):**
`{
  "username": "ejemplo",
  "email": "ejemplo@correo.com",
  "password": "123456",
  "confirmPassword": "123456"
}`

**Respuesta (JSON):**
```{ "success": "User created" }```

### Inicio de sesión

**Endpoint:**  
`POST /api/auth/login`

**Body (JSON):**
```{
  "username": "ejemplo",
  "password": "123456"
}```

**Respuesta (JSON):**
```{ "success": "Login successful" }```

**Version (1.0.1):**

#Descripción

Se le agrego al proceso de authenticacion el hash de la contraseña antes de guardarla en la base de datos.

#Características implementadas
Las caracteristicas se mantienen pero añadiendo el hash de la contraseña antes de guardarla en la base de datos para mayor seguridad.