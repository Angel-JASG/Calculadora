document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const history = document.getElementById('history');
    const buttons = document.querySelectorAll('button');
    const themeToggle = document.getElementById('themeToggle');

    let currentInput = '';
    let previousInput = '';
    let operation = null;
    let shouldResetDisplay = false;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.classList.contains('number')) {
                appendNumber(button.innerText);
            } else if (button.classList.contains('operator')) {
                handleOperator(button.dataset.action);
            } else {
                handleFunction(button.dataset.action);
            }
            updateDisplay();
        });
    });

    function appendNumber(number) {
        if (shouldResetDisplay) {
            currentInput = '';
            shouldResetDisplay = false;
        }
        if (number === '.' && currentInput.includes('.')) return;
        if (currentInput === '0' && number !== '.') {
            currentInput = number;
        } else {
            currentInput += number;
        }
    }

    function handleOperator(action) {
        if (currentInput === '' && previousInput === '') return;
        if (currentInput !== '') {
            if (previousInput !== '') {
                calculate();
            }
            previousInput = currentInput;
            currentInput = '';
        }
        operation = action;
        updateDisplay();
    }

    function handleFunction(action) {
        switch (action) {
            case 'clear':
                clear();
                break;
            case 'calculate':
                calculate();
                break;
            case 'toggleSign':
                toggleSign();
                break;
            case 'percentage':
                percentage();
                break;
            case 'squareRoot':
                squareRoot();
                break;
            case 'sin':
            case 'cos':
            case 'tan':
            case 'log':
            case 'ln':
                mathFunction(action);
                break;
            case 'power':
                power();
                break;
        }
        updateDisplay();
    }

    function clear() {
        currentInput = '';
        previousInput = '';
        operation = null;
        history.textContent = '';
    }

    function calculate() {
        if (previousInput === '' || currentInput === '') return;
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        switch (operation) {
            case 'add':
                result = prev + current;
                break;
            case 'subtract':
                result = prev - current;
                break;
            case 'multiply':
                result = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    result = 'Error';
                } else {
                    result = prev / current;
                }
                break;
        }
        history.textContent = `${prev} ${getOperationSymbol(operation)} ${current} =`;
        currentInput = result.toString();
        previousInput = '';
        operation = null;
        shouldResetDisplay = true;
    }

    function toggleSign() {
        currentInput = (parseFloat(currentInput) * -1).toString();
    }

    function percentage() {
        currentInput = (parseFloat(currentInput) / 100).toString();
    }

    function squareRoot() {
        const value = parseFloat(currentInput);
        if (value < 0) {
            currentInput = 'Error';
        } else {
            currentInput = Math.sqrt(value).toString();
        }
    }

    function mathFunction(func) {
        const value = parseFloat(currentInput);
        switch (func) {
            case 'sin':
                currentInput = Math.sin(value).toString();
                break;
            case 'cos':
                currentInput = Math.cos(value).toString();
                break;
            case 'tan':
                currentInput = Math.tan(value).toString();
                break;
            case 'log':
                if (value <= 0) {
                    currentInput = 'Error';
                } else {
                    currentInput = Math.log10(value).toString();
                }
                break;
            case 'ln':
                if (value <=0) {
                    currentInput = 'Error';
                } else {
                    currentInput = Math.log(value).toString();
                }
                break;
        }
    }

    function power() {
        if (currentInput !== '' && previousInput !== '') {
            const base = parseFloat(previousInput);
            const exponent = parseFloat(currentInput);
            currentInput = Math.pow(base, exponent).toString();
            previousInput = '';
            operation = null;
        }
    }

    function getOperationSymbol(op) {
        switch (op) {
            case 'add': return '+';
            case 'subtract': return '-';
            case 'multiply': return '×';
            case 'divide': return '÷';
            default: return '';
        }
    }

    function updateDisplay() {
        if (operation) {
            display.value = `${previousInput} ${getOperationSymbol(operation)} ${currentInput || ''}`;
        } else {
            display.value = currentInput || '0';
        }
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        themeToggle.innerHTML = document.body.classList.contains('dark-theme') 
            ? '<i class="fas fa-sun"></i>' 
            : '<i class="fas fa-moon"></i>';
    });

    // Keyboard support
    document.addEventListener('keydown', (event) => {
        if (event.key >= '0' && event.key <= '9' || event.key === '.') {
            appendNumber(event.key);
        } else if (event.key === '+') {
            handleOperator('add');
        } else if (event.key === '-') {
            handleOperator('subtract');
        } else if (event.key === '*') {
            handleOperator('multiply');
        } else if (event.key === '/') {
            handleOperator('divide');
        } else if (event.key === 'Enter' || event.key === '=') {
            handleFunction('calculate');
        } else if (event.key === 'Escape') {
            handleFunction('clear');
        }
        updateDisplay();
    });
});