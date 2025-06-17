// Configuración de los formularios de operaciones
function setupOperationForms(account, user) {
    // Configurar formulario de consignación
    const depositForm = document.getElementById('depositForm');
    if (depositForm) {
        document.getElementById('depositAccountNumber').textContent = account.numeroCuenta;
        document.getElementById('depositAccountHolder').textContent = `${user.nombres} ${user.apellidos}`;
        
        depositForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const amount = parseFloat(document.getElementById('depositAmount').value);
            
            if (isNaN(amount) || amount <= 0) {
                showError('Ingrese un valor válido');
                return;
            }
            
            // Crear transacción
            const transaction = {
                referencia: generateTransactionReference(),
                fecha: new Date().toISOString(),
                tipo: 'consignacion',
                concepto: 'Consignación por canal electrónico',
                valor: amount,
                numeroCuenta: account.numeroCuenta,
                saldoResultante: account.saldo + amount
            };
            
            // Actualizar saldo y guardar transacción
            updateAccountBalance(account.numeroCuenta, amount);
            saveTransaction(transaction);
            
            // Mostrar comprobante
            showReceipt('deposit', transaction, user, account);
        });
    }
    
    // Configurar formulario de retiro
    const withdrawalForm = document.getElementById('withdrawalForm');
    if (withdrawalForm) {
        document.getElementById('withdrawalAccountNumber').textContent = account.numeroCuenta;
        document.getElementById('withdrawalAccountHolder').textContent = `${user.nombres} ${user.apellidos}`;
        
        withdrawalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const amount = parseFloat(document.getElementById('withdrawalAmount').value);
            
            if (isNaN (amount) {
                showError('Ingrese un valor válido');
                return;
            }
            
            if (amount <= 0) {
                showError('El valor debe ser mayor a cero');
                return;
            }
            
            if (amount > account.saldo) {
                showError('Saldo insuficiente');
                return;
            }
            
            // Crear transacción
            const transaction = {
                referencia: generateTransactionReference(),
                fecha: new Date().toISOString(),
                tipo: 'retiro',
                concepto: 'Retiro de dinero',
                valor: amount,
                numeroCuenta: account.numeroCuenta,
                saldoResultante: account.saldo - amount
            };
            
            // Actualizar saldo y guardar transacción
            updateAccountBalance(account.numeroCuenta, -amount);
            saveTransaction(transaction);
            
            // Mostrar comprobante
            showReceipt('withdrawal', transaction, user, account);
        });
    }
    
    // Configurar formulario de pagos
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        document.getElementById('paymentAccountNumber').textContent = account.numeroCuenta;
        document.getElementById('paymentAccountHolder').textContent = `${user.nombres} ${user.apellidos}`;
        
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const serviceType = document.getElementById('serviceType').value;
            const serviceReference = document.getElementById('serviceReference').value;
            const amount = parseFloat(document.getElementById('paymentAmount').value);
            
            if (!serviceType) {
                showError('Seleccione un servicio');
                return;
            }
            
            if (!serviceReference) {
                showError('Ingrese el número de referencia');
                return;
            }
            
            if (isNaN(amount) || amount <= 0) {
                showError('Ingrese un valor válido');
                return;
            }
            
            if (amount > account.saldo) {
                showError('Saldo insuficiente');
                return;
            }
            
            // Obtener nombre del servicio
            const serviceNames = {
                'ENERGIA': 'Energía',
                'AGUA': 'Agua',
                'GAS': 'Gas Natural',
                'INTERNET': 'Internet',
                'TELEFONO': 'Teléfono'
            };
            
            const serviceName = serviceNames[serviceType] || 'Servicio Público';
            
            // Crear transacción
            const transaction = {
                referencia: generateTransactionReference(),
                fecha: new Date().toISOString(),
                tipo: 'retiro',
                concepto: `Pago de servicio público ${serviceName}`,
                valor: amount,
                numeroCuenta: account.numeroCuenta,
                saldoResultante: account.saldo - amount,
                detallesAdicionales: {
                    servicio: serviceType,
                    referenciaServicio: serviceReference
                }
            };
            
            // Actualizar saldo y guardar transacción
            updateAccountBalance(account.numeroCuenta, -amount);
            saveTransaction(transaction);
            
            // Mostrar comprobante
            showReceipt('payment', transaction, user, account);
        });
    }
}

function showReceipt(type, transaction, user, account) {
    let receiptContainer, receiptContent;
    
    switch (type) {
        case 'deposit':
            receiptContainer = document.getElementById('depositReceipt');
            receiptContent = document.getElementById('depositReceiptContent');
            document.getElementById('depositForm').style.display = 'none';
            break;
        case 'withdrawal':
            receiptContainer = document.getElementById('withdrawalReceipt');
            receiptContent = document.getElementById('withdrawalReceiptContent');
            document.getElementById('withdrawalForm').style.display = 'none';
            break;
        case 'payment':
            receiptContainer = document.getElementById('paymentReceipt');
            receiptContent = document.getElementById('paymentReceiptContent');
            document.getElementById('paymentForm').style.display = 'none';
            break;
        default:
            return;
    }
    
    // Formatear fecha
    const transactionDate = new Date(transaction.fecha);
    const formattedDate = transactionDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Generar contenido del comprobante
    receiptContent.innerHTML = `
        <div class="receipt-header">
            <h4>Banco Acme</h4>
            <p>Comprobante de ${type === 'deposit' ? 'Consignación' : type === 'withdrawal' ? 'Retiro' : 'Pago'}</p>
        </div>
        
        <div class="receipt-details">
            <div class="detail-row">
                <span>Número de transacción:</span>
                <strong>${transaction.referencia}</strong>
            </div>
            <div class="detail-row">
                <span>Fecha y hora:</span>
                <strong>${formattedDate}</strong>
            </div>
            <div class="detail-row">
                <span>Número de cuenta:</span>
                <strong>${account.numeroCuenta}</strong>
            </div>
            <div class="detail-row">
                <span>Titular:</span>
                <strong>${user.nombres} ${user.apellidos}</strong>
            </div>
            
            ${type === 'payment' ? `
            <div class="detail-row">
                <span>Servicio:</span>
                <strong>${transaction.concepto.replace('Pago de servicio público ', '')}</strong>
            </div>
            <div class="detail-row">
                <span>Referencia:</span>
                <strong>${transaction.detallesAdicionales.referenciaServicio}</strong>
            </div>
            ` : ''}
            
            <div class="detail-row">
                <span>${type === 'deposit' ? 'Valor consignado' : type === 'withdrawal' ? 'Valor retirado' : 'Valor pagado'}:</span>
                <strong>${formatCurrency(transaction.valor)}</strong>
            </div>
            <div class="detail-row">
                <span>Nuevo saldo:</span>
                <strong>${formatCurrency(transaction.saldoResultante)}</strong>
            </div>
        </div>
        
        <div class="receipt-footer">
            <p>Gracias por utilizar nuestros servicios</p>
        </div>
    `;
    
    receiptContainer.style.display = 'block';
}

function printReceipt(elementId) {
    const printContent = document.getElementById(elementId).innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    
    // Recargar la página para restaurar el estado
    window.location.reload();
}

function printTransactions() {
    const printContent = document.getElementById('allTransactionsList').parentNode.parentNode.outerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
}

function loadRecentTransactions(accountNumber) {
    const transactions = getTransactionsByAccount(accountNumber, 5);
    const transactionsList = document.getElementById('recentTransactionsList');
    
    if (!transactionsList) return;
    
    if (transactions.length === 0) {
        transactionsList.innerHTML = '<p class="no-transactions">No hay transacciones recientes</p>';
        return;
    }
    
    transactionsList.innerHTML = transactions.map(t => {
        const date = new Date(t.fecha);
        const formattedDate = date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short'
        });
        
        const amountClass = t.tipo === 'consignacion' ? 'positive' : 'negative';
        
        return `
            <div class="transaction-item">
                <div class="transaction-date">${formattedDate}</div>
                <div class="transaction-description">${t.concepto}</div>
                <div class="transaction-amount ${amountClass}">
                    ${t.tipo === 'consignacion' ? '+' : '-'} ${formatCurrency(t.valor)}
                </div>
            </div>
        `;
    }).join('');
}

function setupBankStatement(account) {
    const statementForm = document.getElementById('statementForm');
    if (!statementForm) return;
    
    // Llenar años disponibles
    const yearSelect = document.getElementById('statementYear');
    const currentYear = new Date().getFullYear();
    
    for (let year = currentYear; year >= currentYear - 5; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
    
    statementForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const year = parseInt(document.getElementById('statementYear').value);
        const month = parseInt(document.getElementById('statementMonth').value);
        
        if (!year || !month) {
            showError('Seleccione un año y un mes');
            return;
        }
        
        const transactions = getTransactionsByDateRange(account.numeroCuenta, year, month);
        const resultsDiv = document.getElementById('statementResults');
        const transactionsList = document.getElementById('statementTransactionsList');
        
        if (transactions.length === 0) {
            transactionsList.innerHTML = '<tr><td colspan="5">No hay transacciones en este período</td></tr>';
        } else {
            transactionsList.innerHTML = transactions.map(t => {
                const date = new Date(t.fecha);
                const formattedDate = date.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                });
                
                const amountClass = t.tipo === 'consignacion' ? 'positive' : 'negative';
                
                return `
                    <tr>
                        <td>${formattedDate}</td>
                        <td>${t.referencia}</td>
                        <td>${t.tipo === 'consignacion' ? 'Consignación' : 'Retiro'}</td>
                        <td>${t.concepto}</td>
                        <td class="${amountClass}">
                            ${t.tipo === 'consignacion' ? '+' : '-'} ${formatCurrency(t.valor)}
                        </td>
                    </tr>
                `;
            }).join('');
        }
        
        // Calcular saldos
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        
        document.getElementById('statementPeriod').textContent = `${monthNames[month - 1]} de ${year}`;
        
        // Mostrar resultados
        resultsDiv.style.display = 'block';
    });
}

function printStatement() {
    const printContent = document.getElementById('statementResults').outerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
}

function setupBankCertificate(user, account) {
    const certificateSection = document.getElementById('certificateSection');
    if (!certificateSection) return;
    
    const docTypes = {
        'CC': 'Cédula de Ciudadanía',
        'TI': 'Tarjeta de Identidad',
        'CE': 'Cédula de Extranjería',
        'PA': 'Pasaporte'
    };
    
    const creationDate = new Date(account.fechaCreacion);
    const formattedCreationDate = creationDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    
    const currentDate = new Date();
    const formattedCurrentDate = currentDate.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
    
    document.getElementById('certificateUserName').textContent = `${user.nombres} ${user.apellidos}`;
    document.getElementById('certificateUserDocType').textContent = docTypes[user.tipoIdentificacion] || user.tipoIdentificacion;
    document.getElementById('certificateUserDocNumber').textContent = user.numeroIdentificacion;
    document.getElementById('certificateAccountNumber').textContent = account.numeroCuenta;
    document.getElementById('certificateAccountDate').textContent = formattedCreationDate;
    document.getElementById('certificateIssueDate').textContent = formattedCurrentDate;
}

function printCertificate() {
    const printContent = document.querySelector('.bank-certificate').outerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
}

function showCurrentDate() {
    const currentDateElement = document.getElementById('currentDate');
    if (!currentDateElement) return;
    
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
    };
    
    currentDateElement.textContent = now.toLocaleDateString('es-ES', options);
}

function setupDashboardNavigation() {
    const menuLinks = document.querySelectorAll('.menu a[data-section]');
    const quickActions = document.querySelectorAll('.quick-action[data-section]');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Función para mostrar una sección específica
    function showSection(sectionId) {
        contentSections.forEach(section => {
            section.style.display = 'none';
        });
        
        document.getElementById(`${sectionId}Section`).style.display = 'block';
        
        // Actualizar menú activo
        menuLinks.forEach(link => {
            link.parentElement.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`.menu a[data-section="${sectionId}"]`);
        if (activeLink) {
            activeLink.parentElement.classList.add('active');
        }
        
        // Actualizar título de la sección
        const sectionTitle = document.getElementById('sectionTitle');
        if (sectionTitle) {
            const titles = {
                'resumen': 'Resumen de Cuenta',
                'transacciones': 'Historial de Transacciones',
                'consignacion': 'Consignación Electrónica',
                'retiro': 'Retiro de Dinero',
                'pagos': 'Pago de Servicios Públicos',
                'extracto': 'Extracto Bancario',
                'certificado': 'Certificado Bancario'
            };
            
            sectionTitle.textContent = titles[sectionId] || sectionId;
        }
    }
    
    // Configurar eventos para los enlaces del menú
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showSection(this.getAttribute('data-section'));
        });
    });
    
    // Configurar eventos para las acciones rápidas
    quickActions.forEach(action => {
        action.addEventListener('click', function() {
            showSection(this.getAttribute('data-section'));
        });
    });
    
    // Mostrar la sección de resumen por defecto
    showSection('resumen');
}