// Variables globales
let currentUser = null;

// Función para cargar la sesión del usuario
function loadUserSession() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        return true;
    }
    return false;
}

// Función para actualizar la UI de autenticación en el header
function updateAuthUI() {
    const userSection = document.getElementById('user-section');
    if (!userSection) return;

    if (currentUser) {
        userSection.innerHTML = `
            <div class="user-info">
                <span class="user-welcome">¡Hola, ${currentUser.nombre}!</span>
                <button class="logout-btn" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                </button>
            </div>
        `;
    } else {
        userSection.innerHTML = `
            <a href="auth.html" class="auth-button">
                <i class="fas fa-user"></i> Iniciar Sesión
            </a>
        `;
    }
}

// Función para mostrar error
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    document.getElementById('loading').style.display = 'none';
    document.getElementById('profile-content').style.display = 'none';
}

// Función para mostrar el perfil
function showProfile() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('error-message').style.display = 'none';
    document.getElementById('profile-content').style.display = 'block';
}

// Función para llenar los datos del perfil
function fillProfileData() {
    if (!currentUser) return;

    // Llenar información básica
    const initials = (currentUser.nombre.charAt(0) + (currentUser.apellido?.charAt(0) || '')).toUpperCase();
    document.getElementById('profile-avatar').textContent = initials;
    document.getElementById('profile-name').textContent = `${currentUser.nombre} ${currentUser.apellido || ''}`;
    document.getElementById('profile-email').textContent = currentUser.email;

    // Llenar información detallada
    document.getElementById('info-nombre').textContent = currentUser.nombre || 'No especificado';
    document.getElementById('info-apellido').textContent = currentUser.apellido || 'No especificado';
    document.getElementById('info-email').textContent = currentUser.email || 'No especificado';
    document.getElementById('info-telefono').textContent = currentUser.telefono || 'No especificado';
    document.getElementById('info-direccion').textContent = currentUser.direccion || 'No especificado';
}

// Función para cargar estadísticas del usuario
async function loadUserStats() {
    try {
        // Cargar estadísticas del carrito
        const carritoResponse = await fetch('/api/carrito');
        if (carritoResponse.ok) {
            const carritoItems = await carritoResponse.json();
            document.getElementById('stat-carrito').textContent = carritoItems.length;
        }

        // Simular otras estadísticas (puedes implementar endpoints reales)
        document.getElementById('stat-compras').textContent = '0'; // Implementar endpoint de historial
        document.getElementById('stat-favoritos').textContent = '0'; // Implementar sistema de favoritos

    } catch (error) {
        console.error('Error cargando estadísticas:', error);
        // No mostrar error, solo dejar valores por defecto
    }
}

// Función para cerrar sesión
function logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('currentUser');
        currentUser = null;

        // Mostrar mensaje y redirigir
        alert('Sesión cerrada correctamente');
        window.location.href = 'index.html';
    }
}

// Función para editar perfil (placeholder)
function editProfile() {
    alert('Funcionalidad de edición de perfil próximamente disponible');
    // Aquí puedes implementar un modal o redirigir a una página de edición
}

// Función para hacer peticiones API
async function apiRequest(url, method = 'GET', data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        return await response.json();
    } catch (error) {
        console.error('Error en la petición:', error);
        throw error;
    }
}

// Función para refrescar datos del usuario desde el servidor
async function refreshUserData() {
    if (!currentUser || !currentUser.id) return;

    try {
        const response = await fetch(`/api/clientes/${currentUser.id}`);
        if (response.ok) {
            const updatedUser = await response.json();
            // Actualizar los datos locales
            currentUser = updatedUser;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            fillProfileData();
        }
    } catch (error) {
        console.error('Error refrescando datos del usuario:', error);
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay una sesión activa
    if (!loadUserSession()) {
        showError('No tienes una sesión activa. Por favor inicia sesión.');
        setTimeout(() => {
            window.location.href = 'auth.html';
        }, 3000);
        return;
    }

    // Actualizar UI de autenticación
    updateAuthUI();

    // Llenar datos del perfil
    fillProfileData();

    // Cargar estadísticas
    loadUserStats();

    // Refrescar datos del usuario
    refreshUserData();

    // Mostrar el perfil
    showProfile();
});

// Función para manejar el botón "Atrás" del navegador
window.addEventListener('beforeunload', function() {
    // Guardar cualquier cambio pendiente si es necesario
});

// Manejar errores globales
window.addEventListener('error', function(event) {
    console.error('Error global:', event.error);
});

// Función para verificar la validez de la sesión
function isSessionValid() {
    if (!currentUser) return false;

    // Verificar si han pasado más de 24 horas desde el login
    const loginTime = localStorage.getItem('loginTime');
    if (loginTime) {
        const now = Date.now();
        const hoursSinceLogin = (now - parseInt(loginTime)) / (1000 * 60 * 60);
        if (hoursSinceLogin > 24) {
            // Sesión expirada
            logout();
            return false;
        }
    }

    return true;
}

// Verificar sesión al cargar
if (currentUser && !isSessionValid()) {
    logout();
}