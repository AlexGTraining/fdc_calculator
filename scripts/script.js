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

let array = [];
let highlightedOperatorButton = null; // Track the highlighted operator

// Adjust font size based on display content length
const adjustDisplayFontSize = () => {
    const maxLength = 10; // Max character length before font reduction starts
    const minFontSize = 1.5; // Minimum font size in rem
    const initialFontSize = 3.5; // Base font size in rem
    const scaleFactor = 0.2; // Amount to reduce font size for each additional character

    const length = DISPLAY.value.length;

    // Calculate new font size
    if (length > maxLength) {
        const newFontSize = Math.max(minFontSize, initialFontSize - (length - maxLength) * scaleFactor);
        DISPLAY.style.fontSize = `${newFontSize}rem`; // Set font size
    } else {
        DISPLAY.style.fontSize = `${initialFontSize}rem`; // Reset to default size
    }
};

document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (KEYS[key]) {
        e.preventDefault();
        if (key === 'Enter' || key === '=') {
            operate(array[1], array[0], DISPLAY.value);
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
        case '-': return subtract(a, b);
        case '*': return multiply(a, b);
        case '/': return divide(a, b);
        case '%': return modulo(a, b);
    }
}

const clearScreen = function () {
    DISPLAY.value = '';
    array.splice(0);
    removeHighlight(); // Clear highlight
}

const display = function (value) {
    if (("" + value).includes('.')) {
        let decimalCount = ("" + value).split('.')[1].length;
        value = decimalCount > 2 ? value.toFixed(2) : value;
    }
    
    DISPLAY.value = value;
    adjustDisplayFontSize(); // Adjust font size every time display is updated
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
            // Remove highlight from previously highlighted button, if any
            removeHighlight();
            
            // Highlight the current operator button
            highlightButton(e.target);

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

const highlightButton = (button) => {
    button.classList.add('highlight');
    highlightedOperatorButton = button; // Store the highlighted button
}

const removeHighlight = () => {
    if (highlightedOperatorButton) {
        highlightedOperatorButton.classList.remove('highlight');
        highlightedOperatorButton = null; // Reset the variable
    }
}

let newNumber = false;
let changeNumber = false;

subscribeToEvents();
