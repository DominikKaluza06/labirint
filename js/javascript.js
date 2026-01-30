/**
 * Pretvori SVG labirint v 2D matriko
 * @param {string} svgId - ID vašega SVG elementa
 * @param {number} rows - Število vrstic v labirintu
 * @param {number} cols - Število stolpcev v labirintu
 * @returns {Array[]} 2D tabela (0 = pot, 1 = stena)
 */
function parseMazeToTable(svgId, rows, cols) {
  const svg = document.getElementById(svgId);
  if (!svg) {
    console.error("SVG elementa nisem našel!");
    return [];
  }

  // Inicializacija prazne matrike z ničlami (poti)
  let mazeTable = Array.from({ length: rows }, () => Array(cols).fill(0));

  // Pridobimo vse pravokotnike (stene) znotraj SVG
  const walls = svg.querySelectorAll("rect");

  // Izračunamo širino/višino ene celice glede na SVG viewBox ali dimenzije
  const cellWidth = svg.viewBox.baseVal.width / cols;
  const cellHeight = svg.viewBox.baseVal.height / rows;

  walls.forEach((wall) => {
    const x = wall.x.baseVal.value;
    const y = wall.y.baseVal.value;

    // Izračunamo indeks v tabeli
    const col = Math.floor(x / cellWidth);
    const row = Math.floor(y / cellHeight);

    // Preverimo, da ne gremo izven meja in označimo steno
    if (row < rows && col < cols) {
      mazeTable[row][col] = 1;
    }
  });

  return mazeTable;
}

// Primer uporabe:
const mazeData = parseMazeToTable("moj-labirint-svg", 10, 10);
console.table(mazeData);
