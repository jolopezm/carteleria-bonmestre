const loginData = {
    usuario: "admin",
    password: "tecnoactive",
}

function cleanToken() {
    if (localStorage.getItem("jwt_token")) {
        localStorage.removeItem("jwt_token")
        localStorage.removeItem("user_data")
    }
}

function saveToken(token, user) {
    localStorage.setItem("jwt_token", token)
    localStorage.setItem("user_data", JSON.stringify(user))
}

async function authUser() {
    try {
        const response = await fetch("https://clientes.tecnoactive.cl/cms_content/api/auth/login.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        })

        const data = await response.json()

        if (data.success) {
            return { success: true, mensaje: "Autenticación exitosa", datos: { token: data.token, user: data.user } }
        } else {
            return { success: false, mensaje: data.error }
        }
    } catch (error) {
        console.error("Error de conexión:", error)
        return { success: false, mensaje: "Error de conexión" }
    }
}

export async function logUser() {
    cleanToken()
    const result = await authUser()

    if (result.success) {
        saveToken(result.datos.token, result.datos.user)
    }
    return result.mensaje
}
