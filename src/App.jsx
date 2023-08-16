import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTION = {
  CHOOSE_OPERATION: "choose-operation",
  DELETE: "delete",
  CLEAR: "clear",
  EVALUATE: "evaluate",
  ADD_DIGIT: "add-digit",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTION.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (state.currentOperand === "0" && payload.digit === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand == null) {
        return {
          ...state,
          currentOperand: "0" + payload.digit,
        };
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case ACTION.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          previousOperand: state.currentOperand,
          operation: payload.operation,
          currentOperand: null,
        };
      }
      if (state.previousOperand) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        currentOperand: null,
        operation: payload.operation,
      };

    case ACTION.EVALUATE:
      if (
        state.currentOperand == null ||
        state.previousOperand == null ||
        state.operation == null
      ) {
        return state;
      }
      return {
        ...state,
        currentOperand: evaluate(state),
        previousOperand: null,
        operation: null,
        overwrite: true,
      };

    case ACTION.DELETE:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false,
        };
      }
      if (state.currentOperand == null) {
        return state;
      }
      if (state.currentOperand.length == 1) {
        return {
          ...state,
          currentOperand: null,
        };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTION.CLEAR:
      return {};
  }
}

// const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
//   maximumFractionDigits: 0,
// });
// function formatOperand(operand) {
//   if (operand == null) return;
//   const [integer, decimal] = operand.split(".");
//   if (decimal == null) {
//     return INTEGER_FORMATTER.format(integer);
//   }
//   return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
// }

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const pre = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(pre) || isNaN(curr)) {
    return "";
  }
  let computation = "";
  switch (operation) {
    case "+":
      computation = pre + curr;
      break;
    case "-":
      computation = pre - curr;
      break;
    case "*":
      computation = pre * curr;
      break;
    case "÷":
      computation = pre / curr;
      break;
  }
  return computation.toString();
}

const App = () => {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operands">
          {formatOperand(previousOperand)}
          {operation}
        </div>
        <div className="current-operands">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTION.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTION.DELETE })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />

      <DigitButton digit="1" dispatch={dispatch}></DigitButton>
      <DigitButton digit="2" dispatch={dispatch}></DigitButton>
      <DigitButton digit="3" dispatch={dispatch}></DigitButton>
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch}></DigitButton>
      <DigitButton digit="5" dispatch={dispatch}></DigitButton>
      <DigitButton digit="6" dispatch={dispatch}></DigitButton>
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch}></DigitButton>
      <DigitButton digit="8" dispatch={dispatch}></DigitButton>
      <DigitButton digit="9" dispatch={dispatch}></DigitButton>
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch}></DigitButton>
      <DigitButton digit="0" dispatch={dispatch}></DigitButton>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTION.EVALUATE })}
      >
        =
      </button>
    </div>
  );
};

export default App;
