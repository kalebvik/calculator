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
		}
	}
});
