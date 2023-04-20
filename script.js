//Calculator

//function to perform calculations
const calculate = function (n1, operator, n2) {
  //converts n1 & n2 strings to floats(nums w/decimals)
  const firstNum = parseFloat(n1)
  const secondNum = parseFloat(n2)
    //switch statement helps determine which operator to use in the calculation. if parameter doesn't match any of the statements then the function will not run
    switch (operator) {
      case 'add': return firstNum + secondNum;
      case 'subtract': return firstNum - secondNum;
      case 'multiply': return firstNum * secondNum;
      case 'divide': return firstNum / secondNum;
    }   
}

//takes in the key that was pressed and returns whether the key is a number, operator or special action
const getKeyType = key => {
  //extracts and assigns the value of the data-action from the key element
  const { action } = key.dataset 
  //if key pressed is not an action then its a number key 
  if (!action) return 'number'
  //if key pressed is an action then it checks if it's one of the four operator actions below. if true, then it returns the operator string
  if (
    action === 'add' ||
    action === 'subtract' ||
    action === 'multiply' ||
    action === 'divide'
  ) return 'operator'
  return action //if action is undefined or not one of the above, then it's assumed to be a special action and returns action
} 

const createResultString = (key, displayedNum, state) => {
  const keyContent = key.textContent //stores text content of key pressed
  const keyType = getKeyType(key) //this checks what key is pressed
  //this extracts values below from the state object and helsp determine how the result should be constructed based on the user input
  //destructuring assignment allows you to extract multiple values from an object or array and assign then to individual variables
  const {
    firstValue,
    operator, 
    modValue,
    previousKeyType,
  } = state
    
    if (keyType === 'number') {
      return displayedNum === '0' || 
          previousKeyType === 'operator' || 
          previousKeyType === 'calculate'
          ? keyContent
          : displayedNum + keyContent
  }

  if (keyType === 'decimal') {
        if (previousKeyType === 'operator' || previousKeyType === 'calculate') return '0.'
        if (!displayedNum.includes('.')) return displayedNum + '.'    
        return displayedNum 
    }

  if (keyType === 'operator') {
    return firstValue && 
      operator && 
      previousKeyType !== 'operator' &&       
      previousKeyType !== 'calculate'
      ? calculate(firstValue, operator, displayedNum)
      : displayedNum      
  } 

  if (keyType === 'clear') return 0

  if (keyType === 'calculate') {     
  return firstValue     
    ? previousKeyType === 'calculate'          
      ? calculate(displayedNum, operator, modValue)
      : calculate(firstValue, operator, displayedNum)
    : displayedNum
    }
}

const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {

    const keyType = getKeyType(key)
    const {
      firstValue,
      operator,
      modValue,
      previousKeyType
    } = calculator.dataset

    calculator.dataset.previousKeyType = keyType

  if (keyType === 'operator') {
    calculator.dataset.operator = key.dataset.action
    calculator.dataset.firstValue = firstValue && 
      operator && 
      previousKeyType !== 'operator' && 
      previousKeyType !== 'calculate'
      ? calculatedValue
      : displayedNum  
  }

  if (keyType === 'calculate') {
    calculator.dataset.modValue = firstValue && previousKeyType === 'calculate'
        ? modValue
        : displayedNum
  }

  if (keyType === 'clear' && key.textContent === 'AC') {
        calculator.dataset.firstValue = ''
        calculator.dataset.operator = ''
        calculator.dataset.modValue = ''
        calculator.dataset.previousKeyType = ''
      } 
} 

const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key)
  Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))

  if (keyType === 'operator') key.classList.add('is-depressed')

  if (keyType === 'clear' && key.textContent !== 'AC') key.textContent = 'AC'

  if (keyType !== 'clear') {
    const clearButton = calculator.querySelector('[data-action=clear]')  
    clearButton.textContent = 'CE'
  }
}

const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator__keys');
const display = document.querySelector('.calculator__display');

keys.addEventListener('click', e => {
  if (!e.target.matches('button')) return
    const key = e.target
    const displayedNum = display.textContent;
    const resultString = createResultString(key, displayedNum, calculator.dataset)

  display.textContent = resultString 
  updateCalculatorState(key, calculator, resultString, displayedNum)
  updateVisualState(key, calculator)
    
})
  