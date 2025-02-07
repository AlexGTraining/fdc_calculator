const DISPLAY = document.querySelector(".display_content");
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

const MAX_CHARACTERS = 10;

document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (KEYS[key]) {
        e.preventDefault();
        if (key === 'Enter' || key === '=') {
            operate(array[1], array[0], DISPLAY.innerHTML);
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
const subtract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const modulo = (a, b) => a % b
const negate = (a) => a * -1;

const divide = (a, b) => {
    if (b === 0) {
        return 'Cannot divide by zero';
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

    DISPLAY.innerHTML = value;
};

const subscribeToEvents = function () {
    VALUES.forEach((element) => {
        element.addEventListener('click', (e) => handleValueButton(e));
    });

    OPERATORS.forEach((element) => {
        element.addEventListener('click', (e) => handleOperatorButton(e));
    });

    ACTIONS.forEach((element) => {
        element.addEventListener('click', (e) => handleActionButton(e));
    });
}

const handleValueButton = function (e) {
    let index = array.length < 2 ? 0 : 2;
    let existingValue = `${array[index]}`;

    if (existingValue.length === MAX_CHARACTERS)
        return;

    if (e.target.value === '0' && array[index] == undefined)
        return;

    if (array[index] === undefined || newNumber) {
        if (e.target.value === '.' && !existingValue.includes('.'))
            array[index] = `0${e.target.value}`;
        else
            array[index] = e.target.value;
    }
    else {
        if (e.target.value !== '.' || (e.target.value === '.' && !existingValue.includes('.')))
            array[index] += e.target.value;
    }

    newNumber = false;
    removeHighlight();
    display(array[index]);
}

const handleOperatorButton = function (e) {
    removeHighlight();
    highlightButton(e.target);

    switch (e.target.value) {
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

            array[1] = e.target.value;

            display(array[0]);
            break;
    }
}

const handleActionButton = function (e) {
    switch (e.target.value) {
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

    if (array.length == 3)
        secondNumber = array[2];
    else if (array.length == 2)
        secondNumber = DISPLAY.innerHTML;

    if (secondNumber !== null) {
        array.splice(0, 3, operate(array[1], array[0], secondNumber));

        display(array[0]);
        newNumber = true;
        removeHighlight();
    }
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

const highlightButton = (button) => {
    button.classList.add('highlight');
    highlightedOperatorButton = button;
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
