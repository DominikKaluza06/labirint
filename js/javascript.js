const ROWS = 62;
const COLS = 62;





const container = document.getElementById('svg_container');
container.innerHTML += LOGO_SVG;

const svgMaze1 = document.getElementById('svg_maze_1');

// Select all <line> elements
const lineElements = svgMaze1.querySelectorAll("line");

// Map the attributes into an array of objects
const mazeLines = Array.from(lineElements).map(line => ({
  x1: parseFloat(line.getAttribute("x1")),
  y1: parseFloat(line.getAttribute("y1")),
  x2: parseFloat(line.getAttribute("x2")),
  y2: parseFloat(line.getAttribute("y2"))
}));


const canvas = document.getElementById('labirint');
console.log(canvas);
const ctx = canvas.getContext('2d');

const mazeA = Array.from({ length: ROWS }, () => Array(COLS).fill(0));


const myMaze = generateEmptyMaze(ROWS, COLS);
console.log(mazeA);

function canMove(newX, newY, maze) {
    // 1. Stay inside bounds
    if (newY < 0 || newY >= maze.length || newX < 0 || newX >= maze[0].length) {
        return false;
    }
    // 2. Check if the cell is a path (0)
    return maze[newY][newX] === 0;
}

// pomembno generiranje labirinta
function generateEmptyMaze(rows, cols) {
    // Create an array of arrays filled with 1s (walls)
    let maze = Array.from({ length: rows }, () => Array(cols).fill(1));
    return maze;
}