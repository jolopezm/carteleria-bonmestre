async function obtenerMenuQR(marcaId, sucursalId, token) {
    const response = await fetch(`https://clientes.tecnoactive.cl/cms_content/api/menu_qr.php?marca_id=${marcaId}&sucursal=${sucursalId}`, {
        method: "GET",
        headers: {
            Authorization: "Bearer " + token,
        },
    })

    const data = await response.json()

    if (data.success) {
        return data.data
    } else {
        throw new Error(data.error)
    }
}

export { obtenerMenuQR }