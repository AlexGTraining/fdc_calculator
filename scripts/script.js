let firstNumber = '';
let operator = '';
let newNumber = '';

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

// This function clears all the values
function clearScreen() {
    document.getElementById("result").value = "";
}
 
// This function displays the values
function display(value) {
    document.getElementById("result").value += value;
}
 
// This function evaluates the expression and returns the result
function calculate() {
    var p = document.getElementById("result").value;
    var q = eval(p);
    document.getElementById("result").value = q;
}