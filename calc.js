const calc = document.querySelector('.calc');
const keys = document.querySelector('.num-pad');
const userInput = document.querySelector('.user-input');
const result = document.querySelector('.result');

let isEqaulsPressed = false;
let equation = 0; // backend calculation
let decimalCheck = ''; // store numbers and check if decimal is pressed

keys.addEventListener('click', (event) => {
	// check if click is on button, not the container
	if (!event.target.closest('button')) return;

	const key = event.target;
	const keyValue = key.textContent;
	let inputDisplay = userInput.textContent;
	const { type } = key.dataset;
	const { prevKeyType } = calc.dataset;

	// if any number is pressed
	if (type === 'number' && !isEqaulsPressed) {
		/* 
        1. set inital screen value to 0
        2. replace initial display with user input if a number is pressed
        3. otherwise concat with operator
        4. if display shows anything other than a number concat the display
        */

		if (inputDisplay === '0') {
			userInput.textContent =
				prevKeyType === 'operator' ? inputDisplay + keyValue : keyValue;
			equation =
				prevKeyType === 'operator' ? equation + key.value : key.value;
			decimalCheck = decimalCheck + keyValue;
		} else {
			// check length so numbers stay within box
			// otherwise replace with an exponent
			if (decimalCheck.length >= 19) {
				let replaceNumber = decimalCheck;
				decimalCheck = Number(decimalCheck).toExponential(2);
				userInput.textContent = inputDisplay.replace(
					replaceNumber,
					decimalCheck
				);
			} else {
				// check for infinity or NaN
				userInput.textContent = userInput.textContent.includes('N')
					? 'NaN'
					: userInput.textContent.includes('I')
					? 'Infinity'
					: inputDisplay + keyValue;
				equation = equation + key.value;
				decimalCheck = decimalCheck + key.value;
			}
		}
	}
	/*
    1. check if operator is pressed and (=) is not yet pressed
    2. and display does not include infinity
    3. replace decimalCheck with blank to store next number
    */
	if (
		type === 'operator' &&
		prevKeyType !== 'operator' &&
		!isEqaulsPressed &&
		!inputDisplay.includes('Infinity')
	) {
		decimalCheck = '';
		userInput.textContent = inputDisplay + ' ' + keyValue + ' ';
		equation = equation + ' ' + key.value + ' ';
	}
	/*
    1. check if decimal is pressed and (=) is not yet pressed
    2. and was a previously pressed button, a number, or output zero
    3. #2 so if user presses decimal after operator it won't be displayed
    4. check if the number already contains a decimal
    */
	if (
		type === 'decimal' &&
		(prevKeyType === 'number' || inputDisplay === '0') &&
		!isEqaulsPressed &&
		!inputDisplay.includes('Infinity')
	) {
		if (!decimalCheck.includes('.')) {
			userInput.textContent = inputDisplay + keyValue;
			equation = equation + key.value;
			decimalCheck = decimalCheck + keyValue;
		}
	}

	if ((type === 'backspace' || type === 'reset') && inputDisplay !== '0') {
		if (type === 'backspace' && !isEqaulsPressed) {
			userInput.textContent = inputDisplay.substring(
				0,
				inputDisplay.length - 1
			);
			equation = equation.substring(0, equation.length - 1);
			decimalCheck = decimalCheck.substring(0, decimalCheck.length - 1);
		} else {
			inputDisplay = '0';
			userInput.textContent = inputDisplay;
			result.innerHTML = '&nbsp;';
			isEqaulsPressed = false;
			equation = '';
			decimalCheck = '';
		}
	}

	// send equation for calculation after (=) is pressed
	if (type === 'equals') {
		// perform a calculation
		isEqaulsPressed = true;
		const finalResult = handleEquation(equation);

		if (finalResult || finalResult === 0) {
			result.textContent = !Number.isInteger(finalResult)
				? finalResult.toFixed(2)
				: finalResult.toString().length >= 16
				? finalResult.toExponential(2)
				: finalResult;
		} else {
			result.textContent = 'Math Error';
		}
	}

	calc.dataset.prevKeyType = type;
});

// function to calculate result based on each operator
function calculate(firstNumber, operator, secondNumber) {
	firstNumber = Number(firstNumber);
	secondNumber = Number(secondNumber);

	if (operator === 'plus' || operator === '+')
		return firstNumber + secondNumber;
	if (operator === 'minus' || operator === '-')
		return firstNumber - secondNumber;
	if (operator === 'multiply' || operator === 'x')
		return firstNumber * secondNumber;
	if (operator === 'divide' || operator === '/')
		return firstNumber / secondNumber;
	if (operator === 'remainder' || operator === '%')
		return firstNumber % secondNumber;
}

function handleEquation(equation) {
	equation = equation.split(' ');
	const operators = ['+', '-', 'x', '/', '%'];
	let firstNumber;
	let secondNumber;
	let operator;
	let operatorIndex;
	let result;

	/*
    1. perform calculations
    2. use operators array
    3. after calculation of first numbers replace them with result
    4. use splice method
    */
	for (var i = 0; i < operators.length; i++) {
		while (equation.includes(operators[i])) {
			operatorIndex = equation.findIndex((item) => item === operators[i]);
			firstNumber = equation[operatorIndex - 1];
			operator = equation[operatorIndex];
			secondNumber = equation[operatorIndex + 1];
			result = calculate(firstNumber, operator, secondNumber);
			equation.splice(operatorIndex - 1, 3, result);
		}
	}
	return result;
}

// event listener for button press
document.addEventListener('keydown', (event) => {
	let getOperators = {
		'+': 'add',
		'-': 'subtract',
		'*': 'multiply',
		x: 'multiply',
		'/': 'divide',
		'%': 'remainder',
	};

	if (!isNaN(event.key) && event.key !== ' ') {
		document.getElementById(`num-${event.key}`).click();
	}
	if (['+', '-', '*', '/', '%'].includes(event.key)) {
		document.getElementById(getOperators[event.key]).click();
	}
	if (event.key === 'backspace' || event.key === 'c' || event.key === 'C') {
		document.getElementById('clear').click();
	}
	if (event.key === '=' || event.key === 'enter') {
		document.getElementById('equals').click();
	}
	if (event.key === '.') {
		document.getElementById('decimal').click();
	}
});
