const DISPLAY = document.querySelector(".display");
const VALUES = document.querySelectorAll("button:not([class])");
const OPERATORS = document.querySelectorAll(".operator");
const ACTIONS = document.querySelectorAll(".action");

const KEYS = {
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
    '5': '5', '6': '6', '7': '7', '8': '8', '9': '9',
    '+': '+', '-': '-', '*': '*', '/': '/',
    'Enter': '=', '=': '=',
    'c': 'C', '.': '.',
    'Backspace': 'Backspace'
}

const array = [];

document.addEventListener('keydown', (e) => {
    const key = e.key

    if (KEYS[key]) {
        e.preventDefault();
        if (key === 'Enter' || key === '=') {
            operate(operator, firstNumber, DISPLAY.value);
        } else if (key === 'c') {
            clearScreen();

        } else if (key === 'Backspace') {
            handleBackSpace();
        } else {
            display(KEYS[key]);
        }
    }
});

const add = (a, b) => a + b;
const substract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const modulo = (a, b) => a % b
const negate = (a) => a * -1;

const divide = (a, b) => {
    if (b === 0) {
        return 'Cannot divide by zero';
    }
    return a / b;
}

const handleBackSpace = () => {
    if (array.length > 0 && array.length != 2)
        array[array.length - 1] = 0;

    changeNumber = true;

    display(array[array.length - 1]);
}

const operate = (op, a, b) => {
    a = Number(a);
    b = Number(b);
    switch (op) {
        case '+': return add(a, b);
        case '-': return substract(a, b);
        case '*': return multiply(a, b);
        case '/': return divide(a, b);
        case '%': return modulo(a, b);
    }
}

const clearScreen = function () {
    DISPLAY.value = '';
    array.splice(0);
}

const display = function (value) {
    if (("" + value).includes('.')) {
        let decimalCount = ("" + value).split('.')[1].length;
        value = decimalCount > 2 ? value.toFixed(2) : value;
    }

    DISPLAY.value = value;
};

const subscribeToEvents = function () {
    VALUES.forEach((element) => {
        element.addEventListener('click', (e) => {
            let index = (array.length < 2 || newNumber) ? 0 : 2;

            if (array[index] === undefined || newNumber || changeNumber) {
                array[index] = e.target.value;
            }
            else {
                if (e.target.value !== '.' || (e.target.value === '.' && !array[index].includes('.')))
                    array[index] += e.target.value;
            }

            newNumber = false;

            display(array[index]);
        });
    });

    OPERATORS.forEach((element) => {
        element.addEventListener('click', (e) => {

            if (e.target.value == 'Negate') {
                if (array.length > 0) {
                    let index = array.length - 1 < 2 ? 0 : 2;
                    array[index] = negate(array[index]);
                    display(array[index]);
                    changeNumber = true;
                }

                return;
            }

            if (array.length == 0) {
                array[0] = 0;
            }
            else if (array.length == 3) {
                array[0] = operate(array[1], array[0], array[2]);
                array.splice(-1, 1);
            }

            array[1] = e.target.value;

            display(array[0]);
        });
    });

    ACTIONS.forEach((element) => {
        element.addEventListener('click', (e) => {
            switch (e.target.value) {
                case "C":
                    clearScreen();
                    break;
                case "=":
                    if (array.length == 3) {
                        array.splice(0, 3, operate(array[1], array[0], array[2]));

                        display(array[0]);
                        newNumber = true;
                    }
                    else if (array.length == 2) {
                        array.splice(0, 3, operate(array[1], array[0], DISPLAY.value));

                        display(array[0]);
                        newNumber = true;
                    }
                    break;
                case "Backspace":
                    handleBackSpace();
                    break;
            }
        });
    });
}

let newNumber = false;
let changeNumber = false;

subscribeToEvents();
