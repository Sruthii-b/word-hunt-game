const LEVELS = [
  ["PYTHON", "MODEL", "DATA", "GITHUB", "CODE", "LOGIC"],
  ["TENSOR", "KERAS", "PANDAS", "NUMPY", "LOSS", "LAYER"],
  ["SCIKIT", "EPOCH", "VECTOR", "BIAS", "GRADIENT"],
];
const SIZE = 10;

let level = 0;
let WORDS = LEVELS[level];
let grid = [];
let start = null;      // first clicked cell [row, col]
let found = new Set(); // words found so far

const board = document.getElementById("board");
const wordList = document.getElementById("word-list");
const message = document.getElementById("message");
const nextBtn = document.getElementById("next-level");

// 1. Build the grid: place each word horizontally or vertically
function buildGrid() {
  grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(""));

  WORDS.forEach((word) => {
    let placed = false;
    while (!placed) {
      const horizontal = Math.random() < 0.5;
      const row = Math.floor(Math.random() * (horizontal ? SIZE : SIZE - word.length + 1));
      const col = Math.floor(Math.random() * (horizontal ? SIZE - word.length + 1 : SIZE));

      // check the word fits without clashing with other letters
      let fits = true;
      for (let i = 0; i < word.length; i++) {
        const r = horizontal ? row : row + i;
        const c = horizontal ? col + i : col;
        if (grid[r][c] && grid[r][c] !== word[i]) fits = false;
      }

      if (fits) {
        for (let i = 0; i < word.length; i++) {
          const r = horizontal ? row : row + i;
          const c = horizontal ? col + i : col;
          grid[r][c] = word[i];
        }
        placed = true;
      }
    }
  });

  // fill empty cells with random letters
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (!grid[r][c]) grid[r][c] = letters[Math.floor(Math.random() * 26)];
    }
  }
}

// 2. Show the grid and the word list on the page
function render() {
  board.innerHTML = "";
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = grid[r][c];
      cell.addEventListener("click", () => handleClick(r, c));
      board.appendChild(cell);
    }
  }

  wordList.innerHTML = "";
  WORDS.forEach((word) => {
    const li = document.createElement("li");
    li.id = "word-" + word;
    li.textContent = word;
    wordList.appendChild(li);
  });
}

function getCell(r, c) {
  return board.children[r * SIZE + c];
}

// 3. Handle clicks: first click = start, second click = end
function handleClick(r, c) {
  if (!start) {
    start = [r, c];
    getCell(r, c).classList.add("selected");
    return;
  }

  const [r1, c1] = start;
  getCell(r1, c1).classList.remove("selected");
  start = null;

  // only straight lines (same row or same column) are allowed
  if (r1 !== r && c1 !== c) return;

  const cells = [];
  const dr = Math.sign(r - r1);
  const dc = Math.sign(c - c1);
  let cr = r1, cc = c1;
  while (true) {
    cells.push([cr, cc]);
    if (cr === r && cc === c) break;
    cr += dr;
    cc += dc;
  }

  const text = cells.map(([a, b]) => grid[a][b]).join("");
  const reversed = text.split("").reverse().join("");
  const match = WORDS.find((w) => w === text || w === reversed);

  if (match && !found.has(match)) {
    found.add(match);
    cells.forEach(([a, b]) => getCell(a, b).classList.add("found"));
    document.getElementById("word-" + match).classList.add("found");

    if (found.size === WORDS.length) {
      if (level < LEVELS.length - 1) {
        message.textContent = "Level complete! 🎉";
        nextBtn.classList.remove("hidden");
      } else {
        message.textContent = "You finished all levels! 🏆";
      }
    }
  }
}

// 4. Start / restart the current level
function newGame() {
  WORDS = LEVELS[level];
  found = new Set();
  start = null;
  nextBtn.classList.add("hidden");
  message.textContent = "Level " + (level + 1) + " of " + LEVELS.length;
  buildGrid();
  render();
}

document.getElementById("new-game").addEventListener("click", newGame);

nextBtn.addEventListener("click", () => {
  level++;
  newGame();
});

newGame();