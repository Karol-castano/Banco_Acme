document.addEventListener('DOMContentLoaded', function() {
    const recoveryForm = document.getElementById('recoveryForm');
    const resetPasswordForm = document.getElementById('resetPasswordForm');
    
    if (recoveryForm) {
        recoveryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const tipoIdentificacion = document.getElementById('recTipoIdentificacion').value;
            const numeroIdentificacion = document.getElementById('recNumeroIdentificacion').value;
            const email = document.getElementById('recEmail').value;
            
            // Validar campos
            if (!tipoIdentificacion || !numeroIdentificacion || !email) {
                showError('Por favor complete todos los campos');
                return;
            }
            
            // Verificar usuario
            const user = getUser(tipoIdentificacion, numeroIdentificacion);
            
            if (!user) {
                showError('No se encontró un usuario con estos datos');
                return;
            }
            
            if (user.email !== email) {
                showError('El correo electrónico no coincide con nuestros registros');
                return;
            }
            
            // Mostrar formulario de nueva contraseña
            document.getElementById('recoveryFormContainer').style.display = 'none';
            document.getElementById('resetPasswordContainer').style.display = 'block';
            
            // Guardar datos para el cambio de contraseña
            sessionStorage.setItem('passwordResetUser', JSON.stringify({
                tipoIdentificacion,
                numeroIdentificacion
            }));
        });
    }
    
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validar contraseñas
            if (newPassword.length < 6) {
                showError('La contraseña debe tener al menos 6 caracteres');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                showError('Las contraseñas no coinciden');
                return;
            }
            
            // Obtener usuario del sessionStorage
            const userData = JSON.parse(sessionStorage.getItem('passwordResetUser'));
            if (!userData) {
                showError('Error en el proceso de recuperación');
                return;
            }
            
            // Actualizar contraseña
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const userIndex = users.findIndex(u => 
                u.tipoIdentificacion === userData.tipoIdentificacion && 
                u.numeroIdentificacion === userData.numeroIdentificacion
            );
            
            if (userIndex === -1) {
                showError('Usuario no encontrado');
                return;
            }
            
            users[userIndex].password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            
            // Mostrar mensaje de éxito
            document.getElementById('resetPasswordContainer').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
            
            // Limpiar sessionStorage
            sessionStorage.removeItem('passwordResetUser');
        });
    }
});