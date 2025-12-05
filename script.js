document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('length-value');
    const includeUppercase = document.getElementById('include-uppercase');
    const includeLowercase = document.getElementById('include-lowercase');
    const includeNumbers = document.getElementById('include-numbers');
    const includeSafe = document.getElementById('include-safe');
    const includeRisky = document.getElementById('include-risky');
    const generateBtn = document.getElementById('generate-btn');
    const generateMultipleBtn = document.getElementById('generate-multiple-btn');
    const passwordOutput = document.getElementById('password-output');
    const copyBtn = document.getElementById('copy-btn');
    const refreshBtn = document.getElementById('refresh-btn');
    const copySqlBtn = document.getElementById('copy-sql-btn');
    const sqlCommand = document.getElementById('sql-command');
    const strengthBar = document.getElementById('strength-bar');
    const strengthLabel = document.getElementById('strength-label');
    const multiplePasswords = document.getElementById('multiple-passwords');
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');

    // Conjuntos de caracteres
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const safeSpecialChars = '!@#$%^*()_+-=';
    const riskySpecialChars = '&\'";\\`|';

    // Actualizar valor del slider
    lengthSlider.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });

    // Generar contraseña
    function generatePassword() {
        let charset = '';
        let password = '';
        
        // Construir conjunto de caracteres según selección
        if (includeUppercase.checked) charset += uppercaseChars;
        if (includeLowercase.checked) charset += lowercaseChars;
        if (includeNumbers.checked) charset += numberChars;
        if (includeSafe.checked) charset += safeSpecialChars;
        if (includeRisky.checked) charset += riskySpecialChars;
        
        // Validar que al menos un tipo de caracter esté seleccionado
        if (charset.length === 0) {
            showNotification('Selecciona al menos un tipo de caracteres', 'error');
            return 'Selecciona opciones primero';
        }
        
        const length = parseInt(lengthSlider.value);
        
        // Asegurar al menos un caracter de cada tipo seleccionado
        const selectedTypes = [];
        if (includeUppercase.checked) selectedTypes.push(uppercaseChars);
        if (includeLowercase.checked) selectedTypes.push(lowercaseChars);
        if (includeNumbers.checked) selectedTypes.push(numberChars);
        if (includeSafe.checked) selectedTypes.push(safeSpecialChars);
        if (includeRisky.checked) selectedTypes.push(riskySpecialChars);
        
        // Añadir un caracter de cada tipo seleccionado
        selectedTypes.forEach(type => {
            const randomChar = type[Math.floor(Math.random() * type.length)];
            password += randomChar;
        });
        
        // Completar la contraseña con caracteres aleatorios
        for (let i = password.length; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        
        // Mezclar la contraseña para que no esté en orden fijo
        password = shuffleString(password);
        
        return password;
    }

    // Función para mezclar cadena (algoritmo de Fisher-Yates)
    function shuffleString(str) {
        const arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    }

    // Calcular fuerza de la contraseña
    function calculatePasswordStrength(password) {
        let score = 0;
        
        // Longitud
        if (password.length >= 12) score += 2;
        else if (password.length >= 8) score += 1;
        
        // Diversidad de caracteres
        if (/[A-Z]/.test(password)) score += 1;
        if (/[a-z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 2;
        
        // Caracteres problemáticos para MariaDB
        if (/[&'"\\;`|]/.test(password)) score -= 1;
        
        // Normalizar score a porcentaje (0-100)
        let percentage = Math.min(100, Math.max(0, (score / 7) * 100));
        
        return {
            percentage: percentage,
            level: percentage >= 80 ? 'Fuerte' : percentage >= 50 ? 'Media' : 'Débil'
        };
    }

    // Actualizar indicador de fuerza
    function updateStrengthIndicator(password) {
        const strength = calculatePasswordStrength(password);
        
        strengthBar.style.width = `${strength.percentage}%`;
        strengthLabel.textContent = `Fuerza: ${strength.level}`;
        
        // Colores según fuerza
        if (strength.level === 'Fuerte') {
            strengthBar.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
            strengthLabel.style.color = '#10b981';
        } else if (strength.level === 'Media') {
            strengthBar.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
            strengthLabel.style.color = '#f59e0b';
        } else {
            strengthBar.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
            strengthLabel.style.color = '#ef4444';
        }
    }

    // Actualizar comando SQL
    function updateSqlCommand(password) {
        // Escapar comillas simples para SQL
        const escapedPassword = password.replace(/'/g, "\\'");
        sqlCommand.textContent = `CREATE USER 'nuevo_usuario'@'localhost' IDENTIFIED BY '${escapedPassword}';`;
    }

    // Mostrar notificación
    function showNotification(message, type = 'success') {
        notificationText.textContent = message;
        
        // Cambiar color según tipo
        if (type === 'error') {
            notification.style.background = '#ef4444';
        } else if (type === 'warning') {
            notification.style.background = '#f59e0b';
        } else {
            notification.style.background = '#10b981';
        }
        
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // Copiar al portapapeles
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copiado al portapapeles');
        }).catch(err => {
            console.error('Error al copiar: ', err);
            showNotification('Error al copiar', 'error');
        });
    }

    // Generar y mostrar contraseña
    function generateAndDisplayPassword() {
        const password = generatePassword();
        passwordOutput.value = password;
        updateStrengthIndicator(password);
        updateSqlCommand(password);
        
        // Limpiar múltiples contraseñas
        multiplePasswords.innerHTML = '';
    }

    // Generar múltiples contraseñas
    function generateMultiplePasswords() {
        multiplePasswords.innerHTML = '';
        
        for (let i = 0; i < 3; i++) {
            const password = generatePassword();
            const passwordElement = document.createElement('div');
            passwordElement.className = 'password-option';
            
            passwordElement.innerHTML = `
                <span>${password}</span>
                <button class="copy-password-btn" data-password="${password}">
                    <i class="far fa-copy"></i> Copiar
                </button>
            `;
            
            multiplePasswords.appendChild(passwordElement);
        }
        
        // Actualizar la contraseña principal con la primera
        const firstPassword = multiplePasswords.querySelector('.password-option span').textContent;
        passwordOutput.value = firstPassword;
        updateStrengthIndicator(firstPassword);
        updateSqlCommand(firstPassword);
        
        // Añadir event listeners a los botones de copiar
        document.querySelectorAll('.copy-password-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const pass = this.getAttribute('data-password');
                copyToClipboard(pass);
            });
        });
    }

    // Event Listeners
    generateBtn.addEventListener('click', generateAndDisplayPassword);
    generateMultipleBtn.addEventListener('click', generateMultiplePasswords);
    refreshBtn.addEventListener('click', generateAndDisplayPassword);

    copyBtn.addEventListener('click', function() {
        if (passwordOutput.value && passwordOutput.value !== 'Selecciona opciones primero') {
            copyToClipboard(passwordOutput.value);
        }
    });

    copySqlBtn.addEventListener('click', function() {
        copyToClipboard(sqlCommand.textContent);
    });

    // Copiar contraseña al hacer doble click
    passwordOutput.addEventListener('dblclick', function() {
        if (this.value && this.value !== 'Selecciona opciones primero') {
            copyToClipboard(this.value);
        }
    });

    // Generar contraseña inicial
    generateAndDisplayPassword();
    
    // Actualizar fuerza cuando cambian las opciones
    const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
    allCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (passwordOutput.value && passwordOutput.value !== 'Selecciona opciones primero') {
                updateStrengthIndicator(passwordOutput.value);
            }
        });
    });
    
    lengthSlider.addEventListener('input', () => {
        if (passwordOutput.value && passwordOutput.value !== 'Selecciona opciones primero') {
            updateStrengthIndicator(passwordOutput.value);
        }
    });
});