// Variables globales para autenticación
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    loadUserSession();
    updateAuthUI();
    setupNavigation();
    setupEventListeners();
    loadSection('home');
    actualizarContadorCarrito();
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
            const stockInfo = producto.stock !== null ?
                (producto.stock > 0 ?
                    `<div class="producto-stock">Stock: ${producto.stock}</div>` :
                    `<div class="producto-sin-stock">Sin stock</div>`) :
                `<div class="producto-stock-desconocido">Stock no disponible</div>`;

            const buttonHTML = producto.stock > 0 || producto.stock === null ?
                `<button class="btn-comprar" onclick="agregarAlCarrito(${producto.id}, '${producto.nombre}', ${producto.precio})">
                    Agregar al Carrito
                </button>` :
                `<button class="btn-comprar btn-disabled" disabled>Sin Stock</button>`;

            div.innerHTML = `
                <img src="${producto.imagen || ''}" alt="${producto.nombre}" class="producto-imagen"
                     onerror="this.src='https://via.placeholder.com/300x250/ff6b6b/white?text=Peluche'">
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p class="producto-descripcion">${producto.descripcion}</p>
                    <div class="producto-precio">$${producto.precio}</div>
                    ${stockInfo}
                    ${buttonHTML}
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

async function actualizarContadorCarrito() {
    try {
        const response = await fetch('/api/carrito');
        const carritoItems = await response.json();

        const contador = document.getElementById('cart-count');
        if (!contador) return;

        let totalItems = 0;
        carritoItems.forEach(item => {
            totalItems += item.cantidad;
        });

        contador.textContent = totalItems;
        contador.style.display = totalItems > 0 ? 'flex' : 'none';
    } catch (error) {
        console.error('Error al actualizar contador del carrito:', error);
    }
}

function mostrarNotificacion(mensaje, tipo = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${tipo === 'error' ? 'error' : ''}`;
    notification.innerHTML = `
        <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        ${mensaje}
    `;

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Funciones de autenticación
function loadUserSession() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        try {
            currentUser = JSON.parse(userData);
            console.log('Usuario cargado:', currentUser); // Debug
            return true;
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('currentUser');
            currentUser = null;
            return false;
        }
    }
    console.log('No hay usuario en localStorage'); // Debug
    currentUser = null;
    return false;
}

function updateAuthUI() {
    const userSection = document.getElementById('user-section');
    if (!userSection) {
        console.log('No se encontró user-section'); // Debug
        return;
    }

    console.log('Actualizando UI con usuario:', currentUser); // Debug

    if (currentUser && currentUser.nombre) {
        userSection.innerHTML = `
            <div class="user-info">
                <a href="profile.html" class="user-welcome" title="Ver mi perfil">
                    <i class="fas fa-user-circle"></i> ¡Hola, ${currentUser.nombre}!
                </a>
                <button class="logout-btn" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                </button>
            </div>
        `;
        console.log('UI actualizada para usuario logueado'); // Debug
    } else {
        userSection.innerHTML = `
            <a href="auth.html" class="auth-button">
                <i class="fas fa-user"></i> Iniciar Sesión
            </a>
        `;
        console.log('UI actualizada para usuario no logueado'); // Debug
    }
}

function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('loginTime');
        currentUser = null;
        updateAuthUI();
        mostrarNotificacion('Sesión cerrada correctamente', 'success');

        // Limpiar carrito local
        carrito = [];
        actualizarContadorCarrito();

        // Redirigir después de un momento
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
}

// Navigation functionality
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            loadSection(section);
            updateActiveNav(link);
        });
    });
}

function updateActiveNav(activeLink) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    activeLink.classList.add('active');
}

function loadSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });

    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    if (sectionName === 'productos') {
        cargarProductos();
    } else if (sectionName === 'carrito') {
        cargarCarrito();
    }
}

// Event listeners setup
function setupEventListeners() {
    const form = document.getElementById('form-contacto');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            enviarFormulario(e);
        });
    }

    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', () => {
            loadSection('carrito');
            updateActiveNav(document.querySelector('.nav-link[data-section="carrito"]'));
        });
    }

    const btnFinalizar = document.getElementById('btn-finalizar');
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', finalizarCompra);
    }
}

async function enviarFormulario(e) {
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    mostrarNotificacion('Enviando mensaje...', 'info');

    try {
        const response = await fetch('/api/contacto', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            mostrarNotificacion(`¡Gracias por tu mensaje, ${data.nombre}! Te contactaremos pronto.`, 'success');
            e.target.reset();
        } else {
            mostrarNotificacion('Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al enviar el mensaje. Inténtalo de nuevo.', 'error');
    }
}

async function cargarCarrito() {
    const loading = document.getElementById('carrito-loading');
    const contenido = document.getElementById('carrito-contenido');
    const items = document.getElementById('carrito-items');
    const vacio = document.getElementById('carrito-vacio');

    if (loading) loading.style.display = 'block';
    if (contenido) contenido.style.display = 'none';

    try {
        const response = await fetch('/api/carrito');
        const carrito = await response.json();

        if (loading) loading.style.display = 'none';

        if (carrito.length === 0) {
            if (contenido) contenido.style.display = 'none';
            if (vacio) vacio.style.display = 'block';
            return;
        }

        if (vacio) vacio.style.display = 'none';
        if (contenido) contenido.style.display = 'block';

        let total = 0;
        if (items) items.innerHTML = '';

        carrito.forEach(item => {
            const subtotal = item.producto.precio * item.cantidad;
            total += subtotal;

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('carrito-item');
            itemDiv.innerHTML = `
                <img src="${item.producto.imagen || 'https://via.placeholder.com/100x100/ff6b6b/white?text=Peluche'}" alt="${item.producto.nombre}" class="carrito-imagen">
                <div class="carrito-info">
                    <h4>${item.producto.nombre}</h4>
                    <p>${item.producto.descripcion || ''}</p>
                    <div class="carrito-precio">
                        <span>$${item.producto.precio}</span>
                        <strong>$${subtotal.toFixed(2)}</strong>
                    </div>
                </div>
                <div class="carrito-controles">
                    <div class="cantidad-controles">
                        <button class="btn-cantidad" onclick="cambiarCantidadCarrito(this, ${item.id}, ${item.cantidad - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="cantidad">${item.cantidad}</span>
                        <button class="btn-cantidad" onclick="cambiarCantidadCarrito(this, ${item.id}, ${item.cantidad + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="btn-eliminar" onclick="eliminarDelCarrito(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            if (items) items.appendChild(itemDiv);
        });

        const totalElement = document.getElementById('total-precio');
        if (totalElement) totalElement.textContent = total.toFixed(2);

    } catch (error) {
        if (loading) loading.style.display = 'none';
        console.error('Error cargando carrito:', error);
        mostrarNotificacion('Error al cargar el carrito', 'error');
    }
}

async function eliminarDelCarrito(carritoId) {
    try {
        const response = await fetch(`/api/carrito/${carritoId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            mostrarNotificacion('Producto eliminado del carrito', 'success');
            cargarCarrito();
            actualizarContadorCarrito();
        } else {
            mostrarNotificacion('Error al eliminar producto', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al eliminar producto', 'error');
    }
}

async function cambiarCantidadCarrito(buttonElement, carritoId, nuevaCantidad) {
    if (nuevaCantidad < 1) {
        eliminarDelCarrito(carritoId);
        return;
    }

    try {
        // Deshabilitar botón para evitar doble click
        buttonElement.disabled = true;

        const response = await fetch(`/api/carrito/${carritoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cantidad: nuevaCantidad
            })
        });

        if (response.ok) {
            // Recargar todo el carrito para asegurar sincronización
            await cargarCarrito();
            await actualizarContadorCarrito();
        } else {
            mostrarNotificacion('Error al actualizar cantidad', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarNotificacion('Error al actualizar cantidad', 'error');
    } finally {
        // Re-habilitar botón
        buttonElement.disabled = false;
    }
}

async function actualizarTotalCarrito() {
    try {
        const response = await fetch('/api/carrito');
        const carrito = await response.json();

        let total = 0;
        carrito.forEach(item => {
            total += item.producto.precio * item.cantidad;
        });

        const totalElement = document.getElementById('total-precio');
        if (totalElement) totalElement.textContent = total.toFixed(2);
    } catch (error) {
        console.error('Error actualizando total:', error);
    }
}

// Mejorar la función de agregar al carrito para usuarios logueados
function agregarAlCarrito(id, nombre, precio) {
    if (!currentUser) {
        mostrarNotificacion('Debes iniciar sesión para agregar productos al carrito', 'error');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 2000);
        return;
    }

    // Call backend API to add to cart
    fetch('/api/carrito', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            productoId: id,
            cantidad: 1
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Error al agregar al carrito');
    })
    .then(data => {
        actualizarContadorCarrito();
        mostrarNotificacion(`${nombre} agregado al carrito`, 'success');
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarNotificacion('Error al agregar producto al carrito', 'error');
    });
}

async function finalizarCompra() {
    if (!currentUser) {
        mostrarNotificacion('Debes iniciar sesión para finalizar la compra', 'error');
        return;
    }

    const btnFinalizar = document.getElementById('btn-finalizar');
    const originalText = btnFinalizar.textContent;

    try {
        // Deshabilitar botón y mostrar loading
        btnFinalizar.disabled = true;
        btnFinalizar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

        const response = await fetch('/api/carrito/finalizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (data.success) {
            // Compra exitosa
            mostrarNotificacion(
                `¡Compra realizada exitosamente! Total: $${data.total.toFixed(2)}. Se compraron ${data.itemsComprados} productos.`,
                'success'
            );

            // Recargar carrito (debería estar vacío ahora)
            await cargarCarrito();
            await actualizarContadorCarrito();

            // Opcional: redirigir a productos después de un momento
            setTimeout(() => {
                loadSection('productos');
                updateActiveNav(document.querySelector('.nav-link[data-section="productos"]'));
            }, 3000);

        } else {
            // Error en la compra
            if (data.productoError) {
                mostrarNotificacion(
                    `${data.message}. Stock disponible: ${data.stockDisponible}, solicitado: ${data.cantidadSolicitada}`,
                    'error'
                );
            } else {
                mostrarNotificacion(data.message, 'error');
            }

            // Recargar carrito para mostrar estado actualizado
            await cargarCarrito();
        }

    } catch (error) {
        console.error('Error al finalizar compra:', error);
        mostrarNotificacion('Error al procesar la compra. Inténtalo de nuevo.', 'error');
    } finally {
        // Re-habilitar botón
        btnFinalizar.disabled = false;
        btnFinalizar.innerHTML = originalText;
    }
}
