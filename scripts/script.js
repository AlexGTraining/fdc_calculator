let firstNumber = '';
let operator = '';
let newNumber = true;

const keys = {
    '0' : '0', '1' : '1', '2' : '2', '3' : '3', '4' : '4',
    '5' : '5', '6' : '6', '7' : '7', '8' : '8', '9' : '9',
    '+' : '+', '-' : '-', '*' : '*', '/' : '/',
    'Enter' : '=', '=' : '=',
    'c' : 'C','.' : '.',
    'Backspace' : 'Backspace'
}

document.addEventListener('keydown' , (e) => {
    const key = e.key

    if(keys[key]) {
        e.preventDefault();
        if(key === 'Enter' || key === '=') {
            calculate();
        } else if (key === 'c') {
            clearScreen();
            
        } else if(key === 'Backspace'){
            handleBackSpace();
        }else {
        display(keys[key]);
    }
}})

const add = (a, b) => {
    return a+b;
}

const substract = (a, b) => {
    return a-b;
}

const multiply = (a, b) => {
    return a*b;
}

const divide = (a, b) => {
    if(b === 0) {
        return 'Cannot divide by zero';
    }
    return a/b;
}

const handleBackSpace = () => {
    const display = document.getElementById('result');
    if(display.value.length > 0) {
        display.value = display.value.slice(0, -1);
    
    if(display.value.length === 0) {
        newNumber = true;
    }
  }
}

const operate = (op, a, b) => {
    a = Number(a);
    b = Number(b);
    switch(op) {
        case '+' : return add(a, b);
        case '-' : return substract(a, b);
        case '*' : return multiply(a, b);
        case '/' : return divide(a, b);
    }
}

// This function clears all the values
function clearScreen() {
    document.getElementById("result").value = '';
    firstNumber = '';
    operator = '';
    newNumber = true;
}
 
// This function displays the values
function display(value) {
    const display = document.getElementById("result");
   
   if (['+', '-', '*', '/'].includes(value)) {
       operator = value;
       firstNumber = display.value;
       newNumber = true;
       return;
   }
   if (newNumber) {
       display.value = value;
       newNumber = false;
   } else {
       display.value += value;
   }
}
 
// This function evaluates the expression and returns the result
function calculate() {
    if (!operator || !firstNumber) return;
    
    const secondNumber = document.getElementById("result").value;
    const result = operate(operator, firstNumber, secondNumber);
    
    if (typeof result === 'number') {
        document.getElementById("result").value = Math.round(result * 1000) / 1000;
    } else {
        document.getElementById("result").value = result;
    }
    
    firstNumber = '';
    operator = '';
 }