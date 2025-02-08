var numSelected = null;
var tileSelected = null;

var errors = 0;

// Generates a complete, valid Sudoku solution
function generateSudokuSolution() {
    let grid = Array(9).fill().map(() => Array(9).fill(0));
  
    // Backtracking algorithm to fill the grid
    function isValid(num, row, col, grid) {
        // Check the row
        for (let i = 0; i < 9; i++) {
            if (grid[row][i] === num) return false;
        }

        // Check the column
        for (let i = 0; i < 9; i++) {
            if (grid[i][col] === num) return false;
        }

        // Check the 3x3 sub-grid
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                if (grid[i][j] === num) return false;
            }
        }

        return true;
    }

    function fillGrid(grid) {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    let nums = Array.from({ length: 9 }, (_, i) => i + 1);
                    nums = shuffleArray(nums);

                    for (let num of nums) {
                        if (isValid(num, row, col, grid)) {
                            grid[row][col] = num;
                            if (fillGrid(grid)) {
                                return true;
                            }
                            grid[row][col] = 0;
                        }
                    }
                    return false;  // Backtrack if no number can be placed
                }
            }
        }
        return true; // All cells filled
    }

    // Start filling the grid
    fillGrid(grid);
    return grid;
}

// Shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Remove some numbers to create the puzzle (difficulty)
function generatePuzzle(grid, difficulty = 0.57) {
    let puzzle = grid.map(row => row.slice());
    let cellsToRemove = Math.floor(difficulty * 81); // 81 total cells in a Sudoku grid

    while (cellsToRemove > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (puzzle[row][col] !== 0) {
            puzzle[row][col] = 0;
            cellsToRemove--;
        }
    }

    return puzzle;
}

// Convert a grid to string format (with dashes for empty cells)
function convertGridToString(grid) {
    return grid.map(row => row.map(cell => (cell === 0 ? '-' : cell)).join(''));
}

// Display both the puzzle and solution in the requested format
function generatePuzzleAndSolution() {
    const solution = generateSudokuSolution();
    const puzzle = generatePuzzle(solution, 0.5 );  // 50% difficulty

    const puzzleString = convertGridToString(puzzle);
    const solutionString = convertGridToString(solution);

    // Store puzzle and solution in arrays
    const board = puzzleString; // Now this is an array of strings, no need to split
    const solvedSudoku = solutionString;

    // Debugging: Check the format of board and solvedSudoku
    console.log(board);
    console.log(solvedSudoku);

    return { puzzle: board, solution: solvedSudoku };
}

// Generate and display the puzzle and solution
const { puzzle: board, solution: solvedSudoku } = generatePuzzleAndSolution();

window.onload = function() {
    setGame();
}

function setGame() {
    // Create the number buttons
    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    // Create the board
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            let tile = document.createElement("div");
            tile.id = row.toString() + "-" + col.toString();
            if (board[row][col] !== "-") {
                tile.innerText = board[row][col];
                tile.classList.add("tile-given");
            }
            if (row === 0) {
                tile.classList.add("top-border");
            }
            if (col === 0) {
                tile.classList.add("left-border");
            }
            if (row === 2 || row === 5 || row === 8) {
                tile.classList.add("bottom-border");
            }
            if (col === 2 || col === 5 || col === 8) {
                tile.classList.add("right-border");
            }
            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }
}

function selectNumber() {
    if (numSelected !== null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile() {
    if (numSelected) {
        if (this.innerText !== "") {
            return;
        }
        if (errors > 2) {
            let disp = document.getElementById("errors");
            disp.innerText = "The game is over";
            return;
        }
        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        // Compare the selected number's value (numSelected.innerText) with the correct solution at solvedSudoku[r][c]
        if (numSelected.innerText === solvedSudoku[r][c]) {
            this.innerText = numSelected.innerText;  // Set the tile to the correct number
        } else {
            errors++;
            let disp = document.getElementById("errors");
            disp.innerText = errors + "/3";
        }
    }
}
