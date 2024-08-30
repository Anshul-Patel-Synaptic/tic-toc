//constants
const winnerLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

//vars
let nextValue = "X";

const winnerEle = document.getElementById("winner").firstElementChild;
winnerEle.textContent = `Next player is: ${nextValue}`;
const containerEle = document.getElementById("container");

let currFilledValues = Array.from({ length: 9 });

let currentHistoryClicked = null;

const allSquareEle = containerEle.querySelectorAll(".square");
const allSquareEleListenerRefs = Array.from({ length: 9 });
const historyArray = [[...currFilledValues]];

const historyListEle = document.getElementById("history");

//functions
const setNextValue = () => {
  if (nextValue === "X") {
    nextValue = "O";
  } else {
    nextValue = "X";
  }
  winnerEle.textContent = `Next player is: ${nextValue}`;
};

const isWinnerAnnounced = () => {
  let isWinner = false;
  winnerLines.some((line) => {
    const [i, j, k] = line;

    if (!currFilledValues[i]) return false;

    if (
      currFilledValues[i] === currFilledValues[j] &&
      currFilledValues[i] === currFilledValues[k]
    ) {
      isWinner = true;
      return true;
    }
  });

  if (isWinner) {
    containerEle.className = containerEle.className + " disabled";
    winnerEle.textContent = `👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑\n👑  Buyaaah! Winner is "${nextValue}" !  👑\n👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑`;

    // this below is just cleanup of event listeners
    allSquareEle.forEach(squareBoxListenerRemover);
  }

  return isWinner;
};

const squareBoxListenerRemover = (squareEle, idx) => {
  const { onMouseOut, onMouseOver, onSquareClick } =
    allSquareEleListenerRefs[idx];

  squareEle.removeEventListener("mouseover", onMouseOver);
  squareEle.removeEventListener("mouseout", onMouseOut);
  squareEle.removeEventListener("click", onSquareClick);
};

const getNewButton = (currHistoryArray, filledValue) => {
  const liEle = document.createElement("li");
  const button = document.createElement("button");
  const move = currHistoryArray.length - 1;
  button.innerText = `Go to move #${move}`;

  const onHistoryBtnClick = getHistoryClickHandler(
    currHistoryArray,
    filledValue
  );

  button.addEventListener("click", onHistoryBtnClick);

  liEle.appendChild(button);
  return liEle;
};

const addListenersToSquares = (squareEle, idx) => {
  const h1Ele = squareEle.firstElementChild;

  const onMouseOver = () => {
    h1Ele.innerText = nextValue;
    h1Ele.className = "hover";
  };

  const onMouseOut = () => {
    h1Ele.innerText = "";
    h1Ele.className = "";
  };

  const onSquareClick = () => {
    if (currFilledValues[idx]) return;

    h1Ele.innerText = nextValue;
    h1Ele.className = "";
    currFilledValues[idx] = nextValue;

    // if history clicked, remove all history buttons after this clicked history button
    if (currentHistoryClicked !== null) {
      const removeExtra = historyArray.length - currentHistoryClicked;
      for (let i = 0; i < removeExtra; i++) {
        historyListEle.removeChild(historyListEle.lastElementChild);
        historyArray.pop();
      }
      currentHistoryClicked = null;
    }

    squareEle.removeEventListener("mouseover", onMouseOver);
    squareEle.removeEventListener("mouseout", onMouseOut);

    const isWinner = isWinnerAnnounced();
    if (isWinner) return;

    // hitoryy Array and next value
    setNextValue();
    historyArray.push([...currFilledValues]);
    const filledValue = nextValue;
    historyListEle.appendChild(getNewButton([...historyArray], filledValue));
  };

  squareEle.addEventListener("mouseover", onMouseOver);
  squareEle.addEventListener("mouseout", onMouseOut);
  squareEle.addEventListener("click", onSquareClick);

  allSquareEleListenerRefs[idx] = {
    onMouseOut,
    onMouseOver,
    onSquareClick,
  };
};

const getHistoryClickHandler = (currHistoryArray, filledValue) => {
  return () => {
    const currHistoryCount = currHistoryArray.length;
    currentHistoryClicked = currHistoryCount; // preserving so that we can remove extra history buttons later

    containerEle.className = containerEle.className.replace("disabled", "");

    nextValue = filledValue;
    winnerEle.textContent = `Next player is: ${nextValue}`;

    currHistoryArray[currHistoryCount - 1].forEach((value, idx) => {
      const h1Ele = allSquareEle[idx].firstElementChild;

      // remove listeners
      squareBoxListenerRemover(allSquareEle[idx], idx);

      if (value) {
        h1Ele.innerText = value;
        h1Ele.className = "";
        currFilledValues[idx] = value;
      } else {
        h1Ele.innerText = "";
        h1Ele.className = "";
        currFilledValues[idx] = "";

        addListenersToSquares(allSquareEle[idx], idx);
      }
    });
  };
};

const addOnClickHandlerToStartBtn = () => {
  const gameStartBtn = historyListEle.querySelectorAll("button")[0];
  const onHistoryClick = getHistoryClickHandler([...historyArray], "X");

  gameStartBtn.addEventListener("click", onHistoryClick);
};

// on start
allSquareEle.forEach(addListenersToSquares);
addOnClickHandlerToStartBtn();
