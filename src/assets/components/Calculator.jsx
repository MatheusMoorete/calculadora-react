import React, { useState } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [currentValue, setCurrentValue] = useState('0');
  const [pendingOperation, setPendingOperation] = useState(null);
  const [pendingValue, setPendingValue] = useState(null);
  const [completeOperation, setCompleteOperation] = useState('');
  const [openParentheses, setOpenParentheses] = useState(0);

  const keypadNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const operations = ['+', '-', '*', '/', '^', '√', 'log'];

  const handleClick = (val) => {
    setCurrentValue((prevValue) => {
      if (prevValue === '0') {
        return val;
      } else {
        return prevValue + val;
      }
    });
    setCompleteOperation((prevOperation) => prevOperation + val);
  };

  const handleOperation = (operation) => {
    if (operation === '^' || operation === 'log') {
      setCompleteOperation(currentValue + ' ' + operation);
      setPendingOperation(operation);
      setPendingValue(currentValue);
      setCurrentValue('0');
    } else if (operation === '√') {
      const num = parseFloat(currentValue);
      if (num >= 0) {
        const result = Math.sqrt(num);
        setCompleteOperation('√(' + currentValue + ') = ' + result);
        setCurrentValue(result.toString());
      } else {
        setCurrentValue('Erro: Não é possível calcular a raiz quadrada de um número negativo');
        setCompleteOperation('Error');
      }
    } else {
      setCompleteOperation(currentValue + ' ' + operation);
      setPendingOperation(operation);
      setPendingValue(currentValue);
      setCurrentValue('0');
    }
  };

  const handleParenthesis = (parenthesis) => {
    if (parenthesis === '(') {
      setCompleteOperation((prevOperation) => prevOperation + parenthesis);
      setOpenParentheses(openParentheses + 1);
    } else if (parenthesis === ')' && openParentheses > 0) {
      setCompleteOperation((prevOperation) => prevOperation + parenthesis);
      setOpenParentheses(openParentheses - 1);
    }
  };

  const handleClear = () => {
    setCurrentValue('0');
    setPendingOperation(null);
    setPendingValue(null);
    setCompleteOperation('');
    setOpenParentheses(0);
  };

  const handleCalculate = () => {
    if (!pendingOperation || !pendingValue || openParentheses !== 0) {
      return;
    }

    const num1 = parseFloat(pendingValue);
    const num2 = parseFloat(currentValue);

    let result;
    switch (pendingOperation) {
      case '+':
        result = num1 + num2;
        break;
      case '-':
        result = num1 - num2;
        break;
      case '*':
        result = num1 * num2;
        break;
      case '/':
        if (num2 !== 0) {
          result = num1 / num2;
        } else {
          setCurrentValue('Nenhum número pode ser dividido por zero');
          setCompleteOperation('Error');
          setPendingOperation(null);
          setPendingValue(null);
          return;
        }
        break;
      case '^':
        result = Math.pow(num1, num2);
        break;
      case 'log':
        if (num1 > 0 && num2 > 0 && num2 !== 1) {
          result = Math.log(num2) / Math.log(num1);
        } else {
          setCurrentValue('Erro: Logaritmo indefinido');
          setCompleteOperation('Error');
          setPendingOperation(null);
          setPendingValue(null);
          return;
        }
        break;
      default:
        break;
    }

    setCompleteOperation(
      pendingValue + ' ' + pendingOperation + ' ' + currentValue + ' = ' + result
    );

    setCurrentValue(result.toString());
    setPendingOperation(null);
    setPendingValue(null);
  };

  return (
    <div className="calculator">
      <div className="complete-operation">{completeOperation}</div>
      <div className="display">{currentValue}</div>
      <div className="buttons">
        <button onClick={handleClear}>AC</button>
        {keypadNumbers.map((num) => (
          <button key={num} onClick={() => handleClick(num)}>
            {num}
          </button>
        ))}
        {operations.map((operation) => (
          <button key={operation} onClick={() => handleOperation(operation)}>
            {operation}
          </button>
        ))}
        <button onClick={() => handleParenthesis('(')}>(</button>
        <button onClick={() => handleParenthesis(')')}>)</button>
        <button onClick={handleCalculate}>=</button>
      </div>
    </div>
  );
};

export default Calculator;
