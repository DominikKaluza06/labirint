const ROWS = 30;
const COLS = 30;


function generateEmptyMaze(rows, cols) {
    // Create an array of arrays filled with 1s (walls)
    let maze = Array.from({ length: rows }, () => Array(cols).fill(1));
    return maze;
}

const canvas = document.getElementById('labirint');
const ctx = canvas.getContext('2d');

// 1 = Wall, 0 = Path
const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const tileSize = canvas.width / maze[0].length;

function drawMaze() {
    for (let row = 0; row < maze.length; row++) {
        for (let col = 0; col < maze[row].length; col++) {
            if (maze[row][col] === 1) {
                ctx.fillStyle = '#2c3e50'; // Wall color
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            } else {
                ctx.fillStyle = '#ecf0f1'; // Path color
                ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
            }
        }
    }
}

drawMaze();

const myMaze = generateEmptyMaze(ROWS, COLS);


function canMove(newX, newY, maze) {
    // 1. Stay inside bounds
    if (newY < 0 || newY >= maze.length || newX < 0 || newX >= maze[0].length) {
        return false;
    }
    // 2. Check if the cell is a path (0)
    return maze[newY][newX] === 0;
}