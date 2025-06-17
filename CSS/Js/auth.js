// Función para alternar la visibilidad de la contraseña
function togglePasswordVisibility(fieldId) {
    const passwordField = document.getElementById(fieldId);
    const icon = passwordField.nextElementSibling;
    
    if (passwordField.type === "password") {
        passwordField.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        passwordField.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
    }
}

// Validación del formulario de login
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const tipoIdentificacion = document.getElementById('tipoIdentificacion').value;
            const numeroIdentificacion = document.getElementById('numeroIdentificacion').value;
            const password = document.getElementById('password').value;
            
            // Validar campos vacíos
            if (!tipoIdentificacion || !numeroIdentificacion || !password) {
                showError('Por favor complete todos los campos');
                return;
            }
            
            // Verificar credenciales
            const user = getUser(tipoIdentificacion, numeroIdentificacion);
            
            if (!user) {
                showError('Usuario no encontrado');
                return;
            }
            
            // En un caso real, aquí se compararía con una contraseña hasheada
            if (user.password !== password) {
                showError('Contraseña incorrecta');
                return;
            }
            
            // Guardar sesión y redirigir
            sessionStorage.setItem('currentUser', JSON.stringify({
                tipoIdentificacion,
                numeroIdentificacion
            }));
            
            window.location.href = 'dashboard.html';
        });
    }
});

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}