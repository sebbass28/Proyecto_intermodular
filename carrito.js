const productos = [
    { 
        id: 1, 
        nombre: "Osito Daisy Peluche", 
        precio: 15.99, 
        imagen: "",
        descripcion: "Suave y tierno osito perfecto para acurrucarse"
    },
    { 
        id: 2, 
        nombre: "Conejito Rosa", 
        precio: 18.99, 
        imagen: "",
        descripcion: "Adorable conejito en tono rosa pastel"
    },
    { 
        id: 3, 
        nombre: "Elefante Francisca La Tierna", 
        precio: 23.99, 
        imagen: "",
        descripcion: "Elefante suave con orejas extra grandes"
    },
    { 
        id: 4, 
        nombre: "León Valiente", 
        precio: 21.99, 
        imagen: "",
        descripcion: "León con melena esponjosa y sonrisa amigable"
    },
    { 
        id: 5, 
        nombre: "Pingüino Polar", 
        precio: 19.99, 
        imagen: "",
        descripcion: "Pingüino suave con bufanda invernal"
    },
    { 
        id: 6, 
        nombre: "Unicornio Mágico", 
        precio: 25.99, 
        imagen: "",
        descripcion: "Unicornio brillante con cuerno dorado"
    }
];

let currentSection = 'home';


class TiendaPeluches {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupEventListeners();
        this.loadSection('home');
        this.actualizarContadorCarrito();
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.loadSection(section);
                this.updateActiveNav(link);
            });
        });
    }

    updateActiveNav(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    loadSection(sectionName) {
        
        document.querySelectorAll('.section').forEach(section => {
            section.style.display = 'none';
        });

        
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.style.display = 'block';
        }

       
        if (sectionName === 'productos') {
            this.cargarProductos();
        } else if (sectionName === 'carrito') {
            this.cargarCarrito();
        }

        currentSection = sectionName;
    }

    async cargarProductos() {
    const loading = document.getElementById('loading');
    const lista = document.getElementById('producto-lista');
    
    // Mostrar loading
    loading.style.display = 'block';
    lista.innerHTML = '';

    try {
        // Llamar al backend
        const res = await fetch('http://localhost:8080/api/productos');
        if (!res.ok) throw new Error('Error al cargar productos');

        const productos = await res.json();  // JSON del backend

        // Ocultar loading
        loading.style.display = 'none';

        // Crear elementos para cada producto
        productos.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto');
            productoDiv.innerHTML = `
                <img src="${producto.imagen || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iI2ZmNmI2YiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UGVsdWNoZTwvdGV4dD4KPC9zdmc+'}" alt="${producto.nombre}" class="producto-imagen">
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p class="producto-descripcion">${producto.descripcion}</p>
                    <div class="producto-precio">$${producto.precio}</div>
                    <button class="btn-comprar" onclick="tienda.agregarAlCarrito(${producto.id})">
                        <i class="fas fa-cart-plus"></i> Agregar al Carrito
                    </button>
                </div>
            `;
            lista.appendChild(productoDiv);
        });

    } catch (error) {
        loading.style.display = 'none';
        console.error(error);
        this.mostrarNotificacion('No se pudieron cargar los productos', 'error');
    }
}

    async agregarAlCarrito(productId) {
        try {
            const response = await fetch('http://localhost:8080/api/carrito', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    productoId: productId,
                    cantidad: 1
                })
            });

            if (response.ok) {
                const carrito = await response.json();
                this.actualizarContadorCarrito();
                this.mostrarNotificacion(`${carrito.producto.nombre} agregado al carrito`, 'success');
            } else {
                this.mostrarNotificacion('Error al agregar producto al carrito', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.mostrarNotificacion('Error al agregar producto al carrito', 'error');
        }
    }

    async actualizarContadorCarrito() {
        try {
            const response = await fetch('http://localhost:8080/api/carrito');
            const carrito = await response.json();

            const contador = document.getElementById('cart-count');
            contador.textContent = carrito.length;

            if (carrito.length > 0) {
                contador.style.display = 'flex';
            } else {
                contador.style.display = 'none';
            }
        } catch (error) {
            console.error('Error actualizando contador:', error);
        }
    }

    async cargarCarrito() {
        const loading = document.getElementById('carrito-loading');
        const contenido = document.getElementById('carrito-contenido');
        const items = document.getElementById('carrito-items');
        const vacio = document.getElementById('carrito-vacio');

        loading.style.display = 'block';
        contenido.style.display = 'none';

        try {
            const response = await fetch('http://localhost:8080/api/carrito');
            const carrito = await response.json();

            loading.style.display = 'none';

            if (carrito.length === 0) {
                contenido.style.display = 'none';
                vacio.style.display = 'block';
                return;
            }

            vacio.style.display = 'none';
            contenido.style.display = 'block';

            let total = 0;
            items.innerHTML = '';

            carrito.forEach(item => {
                const subtotal = item.producto.precio * item.cantidad;
                total += subtotal;

                const itemDiv = document.createElement('div');
                itemDiv.classList.add('carrito-item');
                itemDiv.innerHTML = `
                    <img src="${item.producto.imagen || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2ZmNmI2YiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+UGVsdWNoZTwvdGV4dD4KPC9zdmc+'}" alt="${item.producto.nombre}" class="carrito-imagen">
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
                            <button class="btn-cantidad" onclick="tienda.cambiarCantidad(${item.id}, ${item.cantidad - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="cantidad">${item.cantidad}</span>
                            <button class="btn-cantidad" onclick="tienda.cambiarCantidad(${item.id}, ${item.cantidad + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="btn-eliminar" onclick="tienda.eliminarDelCarrito(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                items.appendChild(itemDiv);
            });

            document.getElementById('total-precio').textContent = total.toFixed(2);

        } catch (error) {
            loading.style.display = 'none';
            console.error('Error cargando carrito:', error);
            this.mostrarNotificacion('Error al cargar el carrito', 'error');
        }
    }

    async eliminarDelCarrito(carritoId) {
        try {
            const response = await fetch(`http://localhost:8080/api/carrito/${carritoId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                this.mostrarNotificacion('Producto eliminado del carrito', 'success');
                this.cargarCarrito();
                this.actualizarContadorCarrito();
            } else {
                this.mostrarNotificacion('Error al eliminar producto', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.mostrarNotificacion('Error al eliminar producto', 'error');
        }
    }

    async cambiarCantidad(carritoId, nuevaCantidad) {
        if (nuevaCantidad < 1) {
            // Si la cantidad es menor a 1, eliminar el producto
            this.eliminarDelCarrito(carritoId);
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/carrito/${carritoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cantidad: nuevaCantidad
                })
            });

            if (response.ok) {
                this.cargarCarrito();
                this.actualizarContadorCarrito();
            } else {
                this.mostrarNotificacion('Error al actualizar cantidad', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            this.mostrarNotificacion('Error al actualizar cantidad', 'error');
        }
    }

    mostrarNotificacion(mensaje, tipo = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${tipo === 'error' ? 'error' : ''}`;
        notification.innerHTML = `
            <i class="fas fa-${tipo === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            ${mensaje}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    setupEventListeners() {
        
        const form = document.getElementById('form-contacto');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.enviarFormulario(e);
        });

 
        document.getElementById('cart-icon').addEventListener('click', () => {
            this.mostrarCarrito();
        });
    }

    async enviarFormulario(e) {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
       
        this.mostrarNotificacion('Enviando mensaje...', 'info');
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        this.mostrarNotificacion(`¡Gracias por tu mensaje, ${data.nombre}! Te contactaremos pronto.`, 'success');
        e.target.reset();
    }

    mostrarCarrito() {
        // Redirigir a la página del carrito
        this.loadSection('carrito');
        this.updateActiveNav(document.querySelector('.nav-link[data-section="carrito"]'));
    }
}


let tienda;
window.addEventListener('DOMContentLoaded', () => {
    tienda = new TiendaPeluches();
});


window.cargarProductos = () => tienda.cargarProductos();
window.agregarAlCarrito = (id) => tienda.agregarAlCarrito(id);
