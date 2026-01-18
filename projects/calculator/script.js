// CalcPro - Advanced Calculator JavaScript

class Calculator {
    constructor() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = '';
        this.waitingForOperand = false;
        this.history = JSON.parse(localStorage.getItem('calcHistory')) || [];
        this.currentMode = 'basic';
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateDisplay();
        this.renderHistory();
        this.bindKeyboard();
    }

    bindEvents() {
        // Mode toggle buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchMode(e.target.dataset.mode);
            });
        });
    }

    bindKeyboard() {
        document.addEventListener('keydown', (e) => {
            e.preventDefault();
            
            if (e.key >= '0' && e.key <= '9') {
                this.inputNumber(e.key);
            } else if (e.key === '.') {
                this.inputDecimal();
            } else if (e.key === '+') {
                this.inputOperator('+');
            } else if (e.key === '-') {
                this.inputOperator('-');
            } else if (e.key === '*') {
                this.inputOperator('*');
            } else if (e.key === '/') {
                this.inputOperator('/');
            } else if (e.key === 'Enter' || e.key === '=') {
                this.calculate();
            } else if (e.key === 'Escape') {
                this.clear();
            } else if (e.key === 'Backspace') {
                this.backspace();
            }
        });
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        // Update active button
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
        
        // Show/hide appropriate grid
        if (mode === 'scientific') {
            document.getElementById('basicGrid').classList.add('hidden');
            document.getElementById('scientificGrid').classList.remove('hidden');
        } else {
            document.getElementById('scientificGrid').classList.add('hidden');
            document.getElementById('basicGrid').classList.remove('hidden');
        }
    }

    inputNumber(num) {
        if (this.waitingForOperand) {
            this.currentInput = num;
            this.waitingForOperand = false;
        } else {
            this.currentInput = this.currentInput === '0' ? num : this.currentInput + num;
        }
        this.updateDisplay();
    }

    inputDecimal() {
        if (this.waitingForOperand) {
            this.currentInput = '0.';
            this.waitingForOperand = false;
        } else if (this.currentInput.indexOf('.') === -1) {
            this.currentInput += '.';
        }
        this.updateDisplay();
    }

    inputOperator(nextOperator) {
        const inputValue = parseFloat(this.currentInput);

        if (this.previousInput === '') {
            this.previousInput = inputValue;
        } else if (this.operator) {
            const currentValue = this.previousInput || 0;
            const newValue = this.performCalculation(currentValue, inputValue, this.operator);

            this.currentInput = String(newValue);
            this.previousInput = newValue;
        }

        this.waitingForOperand = true;
        this.operator = nextOperator;
        this.updateHistoryDisplay();
    }

    calculate() {
        const inputValue = parseFloat(this.currentInput);

        if (this.previousInput !== '' && this.operator) {
            const currentValue = this.previousInput || 0;
            const newValue = this.performCalculation(currentValue, inputValue, this.operator);
            
            // Add to history
            const expression = `${this.previousInput} ${this.getOperatorSymbol(this.operator)} ${inputValue}`;
            this.addToHistory(expression, newValue);

            this.currentInput = String(newValue);
            this.previousInput = '';
            this.operator = '';
            this.waitingForOperand = true;
            
            this.updateDisplay();
            this.clearHistoryDisplay();
            this.animateResult();
        }
    }

    performCalculation(firstOperand, secondOperand, operator) {
        try {
            switch (operator) {
                case '+':
                    return firstOperand + secondOperand;
                case '-':
                    return firstOperand - secondOperand;
                case '*':
                    return firstOperand * secondOperand;
                case '/':
                    if (secondOperand === 0) {
                        throw new Error('Division by zero');
                    }
                    return firstOperand / secondOperand;
                case '^':
                    return Math.pow(firstOperand, secondOperand);
                default:
                    return secondOperand;
            }
        } catch (error) {
            this.showError('Error');
            return 0;
        }
    }

    inputFunction(func) {
        const inputValue = parseFloat(this.currentInput);
        let result;

        try {
            switch (func) {
                case 'sqrt':
                    if (inputValue < 0) {
                        throw new Error('Invalid input');
                    }
                    result = Math.sqrt(inputValue);
                    break;
                case 'sin':
                    result = Math.sin(inputValue * Math.PI / 180);
                    break;
                case 'cos':
                    result = Math.cos(inputValue * Math.PI / 180);
                    break;
                case 'tan':
                    result = Math.tan(inputValue * Math.PI / 180);
                    break;
                case 'log':
                    if (inputValue <= 0) {
                        throw new Error('Invalid input');
                    }
                    result = Math.log10(inputValue);
                    break;
                case 'ln':
                    if (inputValue <= 0) {
                        throw new Error('Invalid input');
                    }
                    result = Math.log(inputValue);
                    break;
                case 'factorial':
                    if (inputValue < 0 || !Number.isInteger(inputValue)) {
                        throw new Error('Invalid input');
                    }
                    result = this.factorial(inputValue);
                    break;
                default:
                    result = inputValue;
            }

            const expression = `${func}(${inputValue})`;
            this.addToHistory(expression, result);
            
            this.currentInput = String(result);
            this.waitingForOperand = true;
            this.updateDisplay();
            this.animateResult();
        } catch (error) {
            this.showError('Error');
        }
    }

    inputConstant(constant) {
        let value;
        
        switch (constant) {
            case 'pi':
                value = Math.PI;
                break;
            case 'e':
                value = Math.E;
                break;
            default:
                return;
        }

        this.currentInput = String(value);
        this.waitingForOperand = true;
        this.updateDisplay();
    }

    factorial(n) {
        if (n === 0 || n === 1) return 1;
        if (n > 170) throw new Error('Number too large');
        
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    toggleSign() {
        if (this.currentInput !== '0') {
            this.currentInput = this.currentInput.charAt(0) === '-' 
                ? this.currentInput.slice(1) 
                : '-' + this.currentInput;
        }
        this.updateDisplay();
    }

    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = '';
        this.waitingForOperand = false;
        this.updateDisplay();
        this.clearHistoryDisplay();
    }

    clearEntry() {
        this.currentInput = '0';
        this.updateDisplay();
    }

    backspace() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }

    updateDisplay() {
        const display = document.getElementById('mainDisplay');
        const formattedNumber = this.formatNumber(this.currentInput);
        display.textContent = formattedNumber;
        
        // Remove error class if present
        display.classList.remove('error');
    }

    updateHistoryDisplay() {
        const historyDisplay = document.getElementById('historyDisplay');
        if (this.previousInput && this.operator) {
            historyDisplay.textContent = `${this.previousInput} ${this.getOperatorSymbol(this.operator)}`;
        }
    }

    clearHistoryDisplay() {
        document.getElementById('historyDisplay').textContent = '';
    }

    formatNumber(num) {
        if (num === 'Error') return num;
        
        const number = parseFloat(num);
        if (isNaN(number)) return '0';
        
        // Handle very large or very small numbers
        if (Math.abs(number) > 1e15 || (Math.abs(number) < 1e-6 && number !== 0)) {
            return number.toExponential(6);
        }
        
        // Format with appropriate decimal places
        return number.toString();
    }

    getOperatorSymbol(operator) {
        const symbols = {
            '+': '+',
            '-': '−',
            '*': '×',
            '/': '÷',
            '^': '^'
        };
        return symbols[operator] || operator;
    }

    addToHistory(expression, result) {
        const historyItem = {
            expression: expression,
            result: this.formatNumber(String(result)),
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.history.unshift(historyItem);
        
        // Keep only last 20 calculations
        if (this.history.length > 20) {
            this.history = this.history.slice(0, 20);
        }
        
        this.saveHistory();
        this.renderHistory();
    }

    renderHistory() {
        const historyList = document.getElementById('historyList');
        
        if (this.history.length === 0) {
            historyList.innerHTML = '<div class="history-empty">No calculations yet</div>';
            return;
        }
        
        historyList.innerHTML = this.history.map(item => `
            <div class="history-item" onclick="calculator.useHistoryResult('${item.result}')">
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">= ${item.result}</div>
            </div>
        `).join('');
    }

    useHistoryResult(result) {
        this.currentInput = result;
        this.waitingForOperand = true;
        this.updateDisplay();
    }

    clearHistory() {
        if (confirm('Clear all calculation history?')) {
            this.history = [];
            this.saveHistory();
            this.renderHistory();
        }
    }

    saveHistory() {
        localStorage.setItem('calcHistory', JSON.stringify(this.history));
    }

    showError(message) {
        const display = document.getElementById('mainDisplay');
        display.textContent = message;
        display.classList.add('error');
        
        // Shake animation
        display.classList.add('shake');
        setTimeout(() => display.classList.remove('shake'), 300);
        
        // Reset after 2 seconds
        setTimeout(() => {
            this.clear();
        }, 2000);
    }

    animateResult() {
        const display = document.getElementById('mainDisplay');
        display.classList.add('pulse');
        setTimeout(() => display.classList.remove('pulse'), 200);
    }
}

// Initialize the calculator
const calculator = new Calculator();

// Add some demo functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('CalcPro calculator initialized!');
    console.log('Features: Basic & Scientific modes, History, Keyboard support');
});