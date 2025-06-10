// calculator variables
const inputDisplay = document.getElementById("calculator-input");
const outputDisplay = document.getElementById("calculator-output");
const buttons = document.querySelectorAll("button");
const historyDisplay = document.getElementById("history-display");
const clearHistoryBtn = document.getElementById("clear-history-btn");

let currentInput = "";
let result = "";
let history = [];

// Load history from localStorage
window.onload = () => {
  const storedHistory = localStorage.getItem("calc-history");
  if (storedHistory) {
    history = JSON.parse(storedHistory);
    updateHistory();
  }
};

function updateInputDisplay() {
  inputDisplay.textContent = currentInput || "0";
}

function updateOutputDisplay() {
  outputDisplay.textContent = result || "0";
}

function updateHistory() {
  historyDisplay.innerHTML = "";
  history
    .slice()
    .reverse()
    .forEach((item) => {
      const entry = document.createElement("div");
      entry.textContent = item;
      historyDisplay.appendChild(entry);
    });
  localStorage.setItem("calc-history", JSON.stringify(history));
}

function evaluateExpression() {
  try {
    const expression = currentInput.replace(/\^/g, "**");
    const evaluated = eval(expression);
    result = evaluated;
    history.push(`${currentInput} = ${evaluated}`);
    updateHistory();
    currentInput = "";
  } catch {
    result = "Error";
  }
  updateInputDisplay();
  updateOutputDisplay();
}

// Handle button clicks
buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = btn.value;

    if (!val) return;

    if (val === "=") {
      evaluateExpression();
    } else if (btn.id === "clear-all-btn") {
      currentInput = "";
      result = "";
      updateInputDisplay();
      updateOutputDisplay();
    } else if (btn.id === "clear-btn") {
      currentInput = currentInput.slice(0, -1);
      updateInputDisplay();
    } else {
      if (currentInput === "" && result && "+-*/^".includes(val)) {
        currentInput = result.toString();
      }

      const lastChar = currentInput.slice(-1);
      if ("+-*/^".includes(val) && "+-*/^".includes(lastChar)) {
        currentInput = currentInput.slice(0, -1) + val; // Replace last operator
      } else {
        currentInput += val;
      }

      updateInputDisplay();
    }
  });
});

// Clear history
clearHistoryBtn.addEventListener("click", () => {
  history = [];
  updateHistory();
});

// Keyboard support
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if ("0123456789.+-*/()^".includes(key)) {
    if (currentInput === "" && result && "+-*/^".includes(key)) {
      currentInput = result.toString();
    }

    const lastChar = currentInput.slice(-1);
    if ("+-*/^".includes(key) && "+-*/^".includes(lastChar)) {
      currentInput = currentInput.slice(0, -1) + key;
    } else {
      currentInput += key;
    }

    updateInputDisplay();
  } else if (key === "Enter") {
    e.preventDefault();
    evaluateExpression();
  } else if (key === "Backspace") {
    currentInput = currentInput.slice(0, -1);
    updateInputDisplay();
  } else if (key === "Escape") {
    currentInput = "";
    result = "";
    updateInputDisplay();
    updateOutputDisplay();
  }
});
