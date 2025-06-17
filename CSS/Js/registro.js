document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const userData = {
                tipoIdentificacion: document.getElementById('regTipoIdentificacion').value,
                numeroIdentificacion: document.getElementById('regNumeroIdentificacion').value,
                nombres: document.getElementById('regNombres').value,
                apellidos: document.getElementById('regApellidos').value,
                genero: document.getElementById('regGenero').value,
                telefono: document.getElementById('regTelefono').value,
                email: document.getElementById('regEmail').value,
                direccion: document.getElementById('regDireccion').value,
                ciudad: document.getElementById('regCiudad').value,
                password: document.getElementById('regPassword').value,
                cuentas: []
            };
            
            // Validar campos
            if (!validateRegisterForm(userData)) {
                return;
            }
            
            // Verificar si el usuario ya existe
            if (getUser(userData.tipoIdentificacion, userData.numeroIdentificacion)) {
                showError('Ya existe un usuario con esta identificación');
                return;
            }
            
            // Crear cuenta bancaria
            const accountNumber = generateAccountNumber();
            const creationDate = new Date().toISOString();
            
            const accountData = {
                numeroCuenta: accountNumber,
                fechaCreacion: creationDate,
                saldo: 0,
                idUsuario: userData.numeroIdentificacion,
                tipoIdentificacionUsuario: userData.tipoIdentificacion
            };
            
            // Asignar cuenta al usuario
            userData.cuentas.push(accountNumber);
            
            // Guardar datos
            saveUser(userData);
            saveAccount(accountData);
            
            // Mostrar éxito
            showSuccess(accountNumber, creationDate);
        });
    }
});

function validateRegisterForm(userData) {
    // Validar que todos los campos estén completos
    for (const key in userData) {
        if (userData[key] === '' && key !== 'cuentas') {
            showError('Por favor complete todos los campos');
            return false;
        }
    }
    
    // Validar términos y condiciones
    if (!document.getElementById('regTerms').checked) {
        showError('Debe aceptar los términos y condiciones');
        return false;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
        showError('Por favor ingrese un email válido');
        return false;
    }
    
    // Validar longitud de contraseña
    if (userData.password.length < 6) {
        showError('La contraseña debe tener al menos 6 caracteres');
        return false;
    }
    
    return true;
}

function generateAccountNumber() {
    return '10' + Math.floor(100000000 + Math.random() * 900000000).toString();
}

function showSuccess(accountNumber, creationDate) {
    const registerForm = document.getElementById('registerForm');
    const successMessage = document.getElementById('successMessage');
    const accountDetails = document.getElementById('accountDetails');
    
    registerForm.style.display = 'none';
    successMessage.style.display = 'block';
    
    const formattedDate = new Date(creationDate).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    accountDetails.innerHTML = `
        <p>Su cuenta bancaria ha sido creada exitosamente.</p>
        <p><strong>Número de cuenta:</strong> ${accountNumber}</p>
        <p><strong>Fecha de creación:</strong> ${formattedDate}</p>
    `;
}