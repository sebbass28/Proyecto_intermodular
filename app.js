document.addEventListener('DOMContentLoaded', () => {
    cargarProductos();
});

async function cargarProductos() {
    const lista = document.getElementById('producto-lista'); // contenedor de productos
    const loading = document.getElementById('loading');      // opcional: un div para "cargando..."
    
    if (loading) loading.style.display = 'block';
    lista.innerHTML = '';

    try {
        const res = await fetch('api/productos');
        if (!res.ok) throw new Error('Error al cargar productos');

        const productos = await res.json();

        productos.forEach(producto => {
            const div = document.createElement('div');
            div.classList.add('producto');
            div.innerHTML = `
                <img src="${producto.imagen || ''}" alt="${producto.nombre}" class="producto-imagen"
                     onerror="this.src='https://via.placeholder.com/300x250/ff6b6b/white?text=Peluche'">
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p class="producto-descripcion">${producto.descripcion}</p>
                    <p class="producto-stock">${producto.stock}</p>
                    <div class="producto-precio">$${producto.precio}</div>
                    <button class="btn-comprar" onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio})">
                        Agregar al Carrito
                    </button>
                </div>
            `;
            lista.appendChild(div);
        });

    } catch (err) {
        console.error(err);
        lista.innerHTML = '<p>No se pudieron cargar los productos</p>';
    } finally {
        if (loading) loading.style.display = 'none';
    }
}

// Carrito simple
let carrito = [];

function agregarAlCarrito(id, nombre, precio) {
    carrito.push({ id, nombre, precio });
    actualizarContadorCarrito();
    mostrarNotificacion(`${nombre} agregado al carrito`, 'success');
}

function actualizarContadorCarrito() {
    const contador = document.getElementById('cart-count');
    if (!contador) return;
    contador.textContent = carrito.length;
    contador.style.display = carrito.length > 0 ? 'flex' : 'none';
}

function mostrarNotificacion(mensaje, tipo = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${tipo === 'error' ? 'error' : ''}`;
    notification.innerHTML = mensaje;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
