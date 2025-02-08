const DISPLAY = document.querySelector(".display");
const VALUES = document.querySelectorAll("button:not([class])");
const OPERATORS = document.querySelectorAll(".operator");
const ACTIONS = document.querySelectorAll(".action");

const ACTION_KEYS = {
    'c': 'C', 'Backspace': 'Backspace', 'Enter': '=', '=': '='
}

const VALUE_KEYS = {
    '0': '0', '1': '1', '2': '2', '3': '3', '4': '4',
    '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '.': '.'
}

const OPERATOR_KEYS = {
    '+': '+', '-': '-', '*': '*', '/': '/',
    '%': '%', 'n': 'Negate'
}

const MAX_CHARACTERS = 10;

document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (Object.keys(ACTION_KEYS).includes(key)) {
        e.preventDefault();
        handleActionButton(ACTION_KEYS[key]);
    }
    else if (Object.keys(OPERATOR_KEYS).includes(key)) {
        e.preventDefault();
        handleOperatorButton(OPERATOR_KEYS[key]);
    }
    else if (Object.keys(VALUE_KEYS).includes(key)) {
        e.preventDefault();
        handleValueButton(VALUE_KEYS[key]);
    }
});

const add = (a, b) => a + b;
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b
const negate = (a) => a * -1;

const modulo = (a, b) => {
    if (b === 0) {
        return 'CANNOT';
    }
    return a % b;
}

const divide = (a, b) => {
    if (b === 0) {
        return 'CANNOT';
    }
    return a / b;
}

const operate = (op, a, b) => {
    a = Number(a);
    b = Number(b);
    switch (op) {
        case '+': return add(a, b);
        case '-': return subtract(a, b);
        case '*': return multiply(a, b);
        case '/': return divide(a, b);
        case '%': return modulo(a, b);
    }
}

const display = function (value) {
    if (("" + value).includes('.')) {
        let decimalCount = ("" + value).split('.')[1].length;
        value = decimalCount > 2 ? value.toFixed(2) : value;
    }

    let stringValue = `${value}`;
    if (stringValue.length > MAX_CHARACTERS)
        stringValue = 'TOO LONG';

    DISPLAY.innerHTML = stringValue;
};

const subscribeToEvents = function () {
    VALUES.forEach((element) => {
        element.addEventListener('click', (e) => handleValueButton(e.target.value));
    });

    OPERATORS.forEach((element) => {
        element.addEventListener('click', (e) => handleOperatorButton(e.target.value));
    });

    ACTIONS.forEach((element) => {
        element.addEventListener('click', (e) => handleActionButton(e.target.value));
    });
}

const handleValueButton = function (value) {
    let index = array.length < 2 ? 0 : 2;
    let existingValue = `${array[index]}`;

    if (existingValue.length === MAX_CHARACTERS)
        return;

    if (value === '0' && array[index] == 0)
        return;

    if (array[index] === undefined || array[index] == 0 || newNumber) {
        if (value === '.' && !existingValue.includes('.'))
            array[index] = `0${value}`;
        else
            array[index] = value;
    }
    else {
        if (value !== '.' || (value === '.' && !existingValue.includes('.')))
            array[index] += value;
    }

    newNumber = false;
    removeHighlight();
    display(array[index]);
}

const handleOperatorButton = function (value) {
    removeHighlight();
    highlightButton(value);

    switch (value) {
        case 'Negate':
            if (array.length > 0) {
                let index = array.length - 1 < 2 ? 0 : 2;
                array[index] = negate(array[index]);
                display(array[index]);
            }
            break;
        default:
            if (array.length == 0) {
                array[0] = 0;
            }
            else if (array.length == 3) {
                array[0] = operate(array[1], array[0], array[2]);
                array.splice(-1, 1);
            }

            array[1] = value;

            display(array[0]);
            break;
    }
}

const handleActionButton = function (value) {
    switch (value) {
        case "C":
            clearScreen();
            break;
        case "=":
            handleEqualsOperator();
            break;
        case "Backspace":
            handleBackSpace();
            break;
    }
}

const handleEqualsOperator = function () {
    let secondNumber = null;

    if (array.length < 3)
        return;

    secondNumber = array[2];
    array.splice(0, 3, operate(array[1], array[0], secondNumber));

    display(array[0]);
    newNumber = true;
    removeHighlight();
}

const handleBackSpace = () => {
    let index = array.length <= 2 ? 0 : 2;
    if (array[index] === undefined)
        return;

    let value = `${array[index]}`;
    if (value.length < 2) {
        array[index] = 0;
        newNumber = true;
    }
    else
        array[index] = value.substring(0, value.length - 1);

    display(array[index]);
}

const clearScreen = function () {
    array.splice(0);
    display(0);
    removeHighlight();
    newNumber = true;
}

const highlightButton = (value) => {
    OPERATORS.forEach((item) => {
        if (item.value == value) {
            highlightedOperatorButton = item;
            item.classList.add('highlight');
        }
    });
}

const removeHighlight = () => {
    if (highlightedOperatorButton) {
        highlightedOperatorButton.classList.remove('highlight');
        highlightedOperatorButton = null;
    }
}

let array = [];
let highlightedOperatorButton = null;
let newNumber = false;

subscribeToEvents();
