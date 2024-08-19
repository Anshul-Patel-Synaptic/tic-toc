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
let currValue = "X";
const winnerEle = document.getElementById("winner").firstElementChild;
winnerEle.textContent = `Next player is: ${currValue}`;
const containerEle = document.getElementById("container");
const squaresEle = containerEle.querySelectorAll(".square");
let isSquareFilledArr = Array.from({ length: 9 });
const elementsFuncRefs = Array.from({ length: 9 });
const historyArray = [isSquareFilledArr];

const historyButtons = document
  .getElementById("history")
  .querySelectorAll("button");

historyButtons[0].addEventListener("click", () => {
  currValue = "X";
  winnerEle.textContent = `Next player is: ${currValue}`;
  historyArray[0].forEach((value, idx) => {
    const h1Ele = squaresEle[idx].firstElementChild;

    if (value) {
      const { onMouseOut, onMouseOver, onSquareClick } = elementsFuncRefs[idx];
      squaresEle[idx].removeEventListener("mouseover", onMouseOver);
      squaresEle[idx].removeEventListener("mouseout", onMouseOut);
      squaresEle[idx].removeEventListener("click", onSquareClick);

      h1Ele.innerText = value;
      h1Ele.className = "";
      return;
    }

    const onMouseOver = () => {
      h1Ele.innerText = currValue;
      h1Ele.className = "hover";
    };

    const onMouseOut = () => {
      h1Ele.innerText = "";
      h1Ele.className = "";
    };
  });
});

//functions
const setNextValue = () => {
  if (currValue === "X") {
    currValue = "O";
  } else {
    currValue = "X";
  }
  winnerEle.textContent = `Next player is: ${currValue}`;
};

const isWinnerAnnounced = () => {
  let isWinner = false;
  winnerLines.some((line) => {
    const [i, j, k] = line;

    if (!isSquareFilledArr[i]) return false;

    if (
      isSquareFilledArr[i] === isSquareFilledArr[j] &&
      isSquareFilledArr[i] === isSquareFilledArr[k]
    ) {
      isWinner = true;
      return true;
    }
  });

  if (isWinner) {
    containerEle.className = containerEle.className + " disabled";
    winnerEle.textContent = `👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑\n👑  Buyaaah! Winner is "${currValue}" !  👑\n👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑 👑`;

    squaresEle.forEach((squareEle, idx) => {
      const { onMouseOut, onMouseOver, onSquareClick } = elementsFuncRefs[idx];

      squareEle.removeEventListener("mouseover", onMouseOver);
      squareEle.removeEventListener("mouseout", onMouseOut);
      squareEle.removeEventListener("click", onSquareClick);
    });
  }

  return isWinner;
};

const addListenersToSquares = () =>
  squaresEle.forEach((squareEle, idx) => {
    const h1Ele = squareEle.firstElementChild;

    const onMouseOver = () => {
      h1Ele.innerText = currValue;
      h1Ele.className = "hover";
    };

    const onMouseOut = () => {
      h1Ele.innerText = "";
      h1Ele.className = "";
    };

    const onSquareClick = () => {
      if (isSquareFilledArr[idx]) return;

      h1Ele.innerText = currValue;
      h1Ele.className = "";

      isSquareFilledArr[idx] = currValue;

      squareEle.removeEventListener("mouseover", onMouseOver);
      squareEle.removeEventListener("mouseout", onMouseOut);

      const isWinner = isWinnerAnnounced();
      !isWinner && setNextValue();
    };

    squareEle.addEventListener("mouseover", onMouseOver);
    squareEle.addEventListener("mouseout", onMouseOut);
    squareEle.addEventListener("click", onSquareClick);

    elementsFuncRefs[idx] = {
      onMouseOut,
      onMouseOver,
      onSquareClick,
    };
  });
