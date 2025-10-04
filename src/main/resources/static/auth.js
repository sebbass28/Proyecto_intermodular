// Variables globales
let currentUser = null;

// Función para mostrar el formulario de login
function showLogin() {
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));

    document.querySelector('.auth-tab').classList.add('active');
    document.getElementById('login-form').classList.add('active');

    clearMessages();
}

// Función para mostrar el formulario de registro
function showRegister() {
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));

    document.querySelectorAll('.auth-tab')[1].classList.add('active');
    document.getElementById('register-form').classList.add('active');

    clearMessages();
}

// Función para limpiar mensajes
function clearMessages() {
    document.getElementById('error-message').style.display = 'none';
    document.getElementById('success-message').style.display = 'none';
}

// Función para mostrar mensaje de error
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';

    document.getElementById('success-message').style.display = 'none';
}

// Función para mostrar mensaje de éxito
function showSuccess(message) {
    const successDiv = document.getElementById('success-message');
    successDiv.textContent = message;
    successDiv.style.display = 'block';

    document.getElementById('error-message').style.display = 'none';
}

// Función para hacer peticiones API
async function apiRequest(url, method, data = null) {
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
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error en la petición:', error);
        return { success: false, message: 'Error de conexión' };
    }
}

// Función para validar email
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Función para validar formulario de registro
function validateRegisterForm(formData) {
    if (!formData.nombre.trim()) {
        return { valid: false, message: 'El nombre es requerido' };
    }

    if (!formData.apellido.trim()) {
        return { valid: false, message: 'El apellido es requerido' };
    }

    if (!validateEmail(formData.email)) {
        return { valid: false, message: 'Email inválido' };
    }

    if (formData.password.length < 6) {
        return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
    }

    if (formData.password !== formData.confirmPassword) {
        return { valid: false, message: 'Las contraseñas no coinciden' };
    }

    return { valid: true };
}

// Función para guardar usuario en localStorage
function saveUserSession(userData) {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('loginTime', Date.now().toString());
    currentUser = userData;
}

// Función para cargar usuario del localStorage
function loadUserSession() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        return true;
    }
    return false;
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('loginTime');
    currentUser = null;
    window.location.href = 'auth.html';
}

// Función para redirigir a la tienda
function redirectToStore() {
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// Event listeners cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si ya hay una sesión activa
    if (loadUserSession()) {
        showSuccess(`¡Bienvenido de vuelta, ${currentUser.nombre}!`);
        redirectToStore();
        return;
    }

    // Manejar formulario de login
    document.getElementById('login-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        clearMessages();

        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        if (!validateEmail(email)) {
            showError('Email inválido');
            return;
        }

        if (!password) {
            showError('La contraseña es requerida');
            return;
        }

        // Mostrar loading
        const submitBtn = e.target.querySelector('.auth-button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Iniciando sesión...';
        submitBtn.disabled = true;

        try {
            const result = await apiRequest('/api/auth/login', 'POST', {
                email: email,
                password: password
            });

            if (result.success) {
                showSuccess(result.message);
                saveUserSession(result.cliente);
                redirectToStore();
            } else {
                showError(result.message);
            }
        } catch (error) {
            showError('Error de conexión');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Manejar formulario de registro
    document.getElementById('register-form').addEventListener('submit', async function(e) {
        e.preventDefault();
        clearMessages();

        const formData = {
            nombre: document.getElementById('register-nombre').value,
            apellido: document.getElementById('register-apellido').value,
            email: document.getElementById('register-email').value,
            telefono: document.getElementById('register-telefono').value,
            direccion: document.getElementById('register-direccion').value,
            password: document.getElementById('register-password').value,
            confirmPassword: document.getElementById('register-confirm-password').value
        };

        // Validar formulario
        const validation = validateRegisterForm(formData);
        if (!validation.valid) {
            showError(validation.message);
            return;
        }

        // Mostrar loading
        const submitBtn = e.target.querySelector('.auth-button');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Registrando...';
        submitBtn.disabled = true;

        try {
            const result = await apiRequest('/api/auth/register', 'POST', {
                nombre: formData.nombre,
                apellido: formData.apellido,
                email: formData.email,
                telefono: formData.telefono,
                direccion: formData.direccion,
                password: formData.password
            });

            if (result.success) {
                showSuccess(result.message + ' - Redirigiendo a la tienda...');
                saveUserSession(result.cliente);
                redirectToStore();
            } else {
                showError(result.message);
            }
        } catch (error) {
            showError('Error de conexión');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // Validar email en tiempo real para registro
    document.getElementById('register-email').addEventListener('blur', async function() {
        const email = this.value;
        if (validateEmail(email)) {
            try {
                const result = await apiRequest('/api/auth/validate-email', 'POST', { email: email });
                if (result.exists) {
                    showError('Este email ya está registrado');
                }
            } catch (error) {
                console.error('Error validando email:', error);
            }
        }
    });
});