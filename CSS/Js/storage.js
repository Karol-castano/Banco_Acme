// Funciones para manejar usuarios
function saveUser(user) {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Verificar si el usuario ya existe
    const existingUserIndex = users.findIndex(u => 
        u.tipoIdentificacion === user.tipoIdentificacion && 
        u.numeroIdentificacion === user.numeroIdentificacion
    );
    
    if (existingUserIndex !== -1) {
        users[existingUserIndex] = user; // Actualizar usuario existente
    } else {
        users.push(user); // Agregar nuevo usuario
    }
    
    localStorage.setItem('users', JSON.stringify(users));
}

function getUser(tipoId, numeroId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(u => u.tipoIdentificacion === tipoId && u.numeroIdentificacion === numeroId);
}

// Funciones para manejar cuentas bancarias
function saveAccount(account) {
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    
    // Verificar si la cuenta ya existe
    const existingAccountIndex = accounts.findIndex(a => a.numeroCuenta === account.numeroCuenta);
    
    if (existingAccountIndex !== -1) {
        accounts[existingAccountIndex] = account; // Actualizar cuenta existente
    } else {
        accounts.push(account); // Agregar nueva cuenta
    }
    
    localStorage.setItem('accounts', JSON.stringify(accounts));
}

function getAccount(accountNumber) {
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    return accounts.find(a => a.numeroCuenta === accountNumber);
}

function updateAccountBalance(accountNumber, amount) {
    const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
    const accountIndex = accounts.findIndex(a => a.numeroCuenta === accountNumber);
    
    if (accountIndex !== -1) {
        accounts[accountIndex].saldo += amount;
        localStorage.setItem('accounts', JSON.stringify(accounts));
        return accounts[accountIndex];
    }
    
    return null;
}

// Funciones para manejar transacciones
function saveTransaction(transaction) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function getTransactionsByAccount(accountNumber, limit = null) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions = transactions.filter(t => t.numeroCuenta === accountNumber);
    
    // Ordenar por fecha (más recientes primero)
    transactions.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    
    if (limit) {
        return transactions.slice(0, limit);
    }
    
    return transactions;
}

function getTransactionsByDateRange(accountNumber, year, month) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    
    return transactions.filter(t => {
        if (t.numeroCuenta !== accountNumber) return false;
        
        const transactionDate = new Date(t.fecha);
        return transactionDate.getFullYear() === year && 
               transactionDate.getMonth() + 1 === month;
    });
}

// Funciones de utilidad
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
}

function generateTransactionReference() {
    const now = new Date();
    const random = Math.floor(100 + Math.random() * 900);
    return `TRX-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${random}`;
}
// Datos iniciales para pruebas (solo ejecutar una vez)
function initializeSampleData() {
    if (localStorage.getItem('users')) return; // No inicializar si ya hay datos
    
    const sampleUser = {
        tipoIdentificacion: "CC",
        numeroIdentificacion: "123456789",
        nombres: "karol",
        apellidos: "castaño",
        genero: "f",
        telefono: "3237631625",
        email: "yulianacastano31@gmail.com",
        direccion: "Calle 1 #45-67",
        ciudad: "Bucaramanga",
        password: "password123", // En una aplicación real, esto debería estar hasheado
        cuentas: ["1049290561"]
    };
    
    const sampleAccount = {
        numeroCuenta: "1049290561",
        fechaCreacion: new Date().toISOString(),
        saldo: 1500000,
        idUsuario: "123456789",
        tipoIdentificacionUsuario: "CC"
    };
    
    saveUser(sampleUser);
    saveAccount(sampleAccount);
    
    // Agregar algunas transacciones de ejemplo
    const sampleTransactions = [
        {
            referencia: generateTransactionReference(),
            fecha: new Date(Date.now() - 86400000).toISOString(), // Ayer
            tipo: "consignacion",
            concepto: "Consignación inicial",
            valor: 2000000,
            numeroCuenta: "1049290561",
            saldoResultante: 2000000
        },
        {
            referencia: generateTransactionReference(),
            fecha: new Date(Date.now() - 172800000).toISOString(), // Hace 2 días
            tipo: "retiro",
            concepto: "Retiro en cajero",
            valor: 500000,
            numeroCuenta: "1049290561",
            saldoResultante: 1500000
        }
    ];
    
    sampleTransactions.forEach(t => saveTransaction(t));
}

// Llamar a la función de inicialización
initializeSampleData();