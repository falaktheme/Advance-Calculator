class Calculator {
    constructor() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
        this.history = [];
        this.maxHistoryItems = 10;
    }

    clear() {
        this.previousOperand = '';
        this.currentOperand = '0';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '0') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '0';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;

        try {
            switch (this.operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case '*':
                    computation = prev * current;
                    break;
                case '/':
                    if (current === 0) throw new Error('Cannot divide by zero!');
                    computation = prev / current;
                    break;
                case '^':
                    computation = Math.pow(prev, current);
                    break;
                case '%':
                    computation = prev % current;
                    break;
                default:
                    return;
            }

            // Add to history
            const calculation = `${prev} ${this.operation} ${current} = ${computation}`;
            this.addToHistory(calculation);

            this.currentOperand = computation.toString();
            this.operation = undefined;
            this.previousOperand = '';
        } catch (error) {
            alert(error.message);
            this.clear();
        }
    }

    executeFunction(func) {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;

        try {
            let result;
            switch (func) {
                case 'sin':
                    result = Math.sin(current * Math.PI / 180);
                    break;
                case 'cos':
                    result = Math.cos(current * Math.PI / 180);
                    break;
                case 'tan':
                    result = Math.tan(current * Math.PI / 180);
                    break;
                case 'sqrt':
                    if (current < 0) throw new Error('Cannot calculate square root of negative number!');
                    result = Math.sqrt(current);
                    break;
                case 'log':
                    if (current <= 0) throw new Error('Cannot calculate logarithm of non-positive number!');
                    result = Math.log10(current);
                    break;
                case 'ln':
                    if (current <= 0) throw new Error('Cannot calculate natural logarithm of non-positive number!');
                    result = Math.log(current);
                    break;
                case 'pi':
                    result = Math.PI;
                    break;
                default:
                    return;
            }

            // Add to history
            const calculation = `${func}(${current}) = ${result}`;
            this.addToHistory(calculation);

            this.currentOperand = result.toString();
            this.operation = undefined;
            this.previousOperand = '';
        } catch (error) {
            alert(error.message);
            this.clear();
        }
    }

    addToHistory(calculation) {
        this.history.unshift(calculation);
        if (this.history.length > this.maxHistoryItems) {
            this.history.pop();
        }
        this.updateHistory();
    }

    clearHistory() {
        this.history = [];
        this.updateHistory();
    }

    updateDisplay() {
        document.querySelector('.current-operand').textContent = this.formatNumber(this.currentOperand);
        if (this.operation != null) {
            document.querySelector('.previous-operand').textContent = 
                `${this.formatNumber(this.previousOperand)} ${this.operation}`;
        } else {
            document.querySelector('.previous-operand').textContent = '';
        }
    }

    formatNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '0';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateHistory() {
        const historyContent = document.querySelector('.history-content');
        historyContent.innerHTML = this.history.join('<br>');
    }
}

// Initialize Calculator
const calculator = new Calculator();

// Theme Toggle
const body = document.body;
const themeToggle = document.querySelector('.theme-toggle i');

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    themeToggle.classList.toggle('fa-moon');
    themeToggle.classList.toggle('fa-sun');
});

// Mode Toggle
const modeButtons = document.querySelectorAll('.mode-btn');
const basicButtons = document.querySelector('.basic-buttons');
const scientificButtons = document.querySelector('.scientific-buttons');

modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        modeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        if (button.dataset.mode === 'basic') {
            basicButtons.classList.remove('hidden');
            scientificButtons.classList.add('hidden');
        } else {
            basicButtons.classList.add('hidden');
            scientificButtons.classList.remove('hidden');
        }
    });
});

// Clear History
document.querySelector('.clear-history').addEventListener('click', () => {
    calculator.clearHistory();
});

// Button Click Handlers
document.querySelectorAll('.buttons button').forEach(button => {
    button.addEventListener('click', () => {
        // Add click animation
        button.classList.add('clicked');
        setTimeout(() => button.classList.remove('clicked'), 100);

        if (button.classList.contains('number')) {
            calculator.appendNumber(button.innerText);
            calculator.updateDisplay();
        } else if (button.classList.contains('operator')) {
            calculator.chooseOperation(button.dataset.action);
            calculator.updateDisplay();
        } else if (button.classList.contains('equals')) {
            calculator.compute();
            calculator.updateDisplay();
        } else if (button.classList.contains('decimal')) {
            calculator.appendNumber('.');
            calculator.updateDisplay();
        } else if (button.dataset.action === 'clear') {
            calculator.clear();
            calculator.updateDisplay();
        } else if (button.dataset.action === 'backspace') {
            calculator.delete();
            calculator.updateDisplay();
        } else if (button.classList.contains('function')) {
            calculator.executeFunction(button.dataset.action);
            calculator.updateDisplay();
        }
    });
});

// Keyboard Support
document.addEventListener('keydown', event => {
    if (event.key >= '0' && event.key <= '9') {
        calculator.appendNumber(event.key);
    } else if (event.key === '.') {
        calculator.appendNumber('.');
    } else if (['+', '-', '*', '/', '^', '%'].includes(event.key)) {
        calculator.chooseOperation(event.key);
    } else if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculator.compute();
    } else if (event.key === 'Backspace') {
        calculator.delete();
    } else if (event.key === 'Escape') {
        calculator.clear();
    } else if (event.key === 'p' || event.key === 'P') {
        calculator.executeFunction('pi');
    }
    calculator.updateDisplay();
});
