window.addEventListener('load', function () {
    const container = document.getElementById('svg_container');
    const canvas = document.getElementById('labirint');

    // Izbira labirinta
    if (sessionStorage.getItem("ponovenPoskus") === "da") {
        izbira = Math.floor(Math.random() * vsiLabirinti.length);
        console.log("Ponoven poskus! Naložen labirint številka:", izbira + 1);
        sessionStorage.removeItem("ponovenPoskus"); // Počistimo, da ne bo vsak refresh nov labirint
    }

    container.innerHTML = vsiLabirinti[izbira];

    const svgMaze = container.querySelector('svg');
    const ROWS = 61;
    const COLS = 61;
    const SVG_OFFSET = 2;
    const SVG_STEP = 16;

    const lineElements = svgMaze.querySelectorAll("line");
    const mazeLines = Array.from(lineElements).map(line => ({
        x1: parseFloat(line.getAttribute("x1")),
        y1: parseFloat(line.getAttribute("y1")),
        x2: parseFloat(line.getAttribute("x2")),
        y2: parseFloat(line.getAttribute("y2"))
    }));

    const ctx = canvas.getContext('2d');
    canvas.width = 700;
    canvas.height = 700;

    var mazeA = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

    function svgToGridIndex(coordinate) {
        return Math.round((coordinate - SVG_OFFSET) / SVG_STEP) * 2;
    }

    mazeLines.forEach(line => {
        const x1 = svgToGridIndex(line.x1);
        const y1 = svgToGridIndex(line.y1);
        const x2 = svgToGridIndex(line.x2);
        const y2 = svgToGridIndex(line.y2);

        if (x1 === x2) {
            const startY = Math.min(y1, y2);
            const endY = Math.max(y1, y2);
            for (var y = startY; y <= endY; y++) {
                if (y < ROWS && x1 < COLS) mazeA[y][x1] = 1;
            }
        } else if (y1 === y2) {
            const startX = Math.min(x1, x2);
            const endX = Math.max(x1, x2);
            for (var x = startX; x <= endX; x++) {
                if (y1 < ROWS && x < COLS) mazeA[y1][x] = 1;
            }
        }
    });

    const cellW = canvas.width / COLS;
    const cellH = canvas.height / ROWS;

    var player = { x: 29, y: 0 };
    var sled = [];
    sled.push({ x: player.x, y: player.y, barva: window.trenutnaBarva });

    const slikaCopica = new Image();
    slikaCopica.src = 'slike/player.png';

    slikaCopica.onload = function () {
        drawScene();
    };

    function drawScene() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const zamikX = -1;
        const zamikY = -1;

        // 1. NARIŠE SLED
        if (sled.length > 1) {
            ctx.lineWidth = cellW / 2;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";

            for (var i = 1; i < sled.length; i++) {
                ctx.beginPath();
                ctx.strokeStyle = sled[i].barva;

                var prevX = (sled[i - 1].x * cellW) + (cellW / 2) + zamikX;
                var prevY = (sled[i - 1].y * cellH) + (cellH / 2) + zamikY;
                ctx.moveTo(prevX, prevY);

                var currX = (sled[i].x * cellW) + (cellW / 2) + zamikX;
                var currY = (sled[i].y * cellH) + (cellH / 2) + zamikY;
                ctx.lineTo(currX, currY);

                ctx.stroke();
            }
        }

        // 2. NARIŠE IGRALCA
        var faktorPovecave = 5;
        var igralecSirina = cellW * faktorPovecave;
        var igralecVisina = cellH * faktorPovecave;

        var centerCeliceX = (player.x * cellW) + (cellW / 2) + zamikX;
        var centerCeliceY = (player.y * cellH) + (cellH / 2) + zamikY;

        var premikLevoDesno = -5;
        var premikGorDol = 5;

        var igralecX = centerCeliceX + premikLevoDesno;
        var igralecY = (centerCeliceY - igralecVisina) + premikGorDol;

        if (slikaCopica.complete) {
            ctx.drawImage(slikaCopica, igralecX, igralecY, igralecSirina, igralecVisina);
        }
    }

    var preostaliPremiki = 800;
    var igraAktivna = true;

    const htmlPoteze = document.getElementById('poteze_stevilka');
    if (htmlPoteze) {
        htmlPoteze.innerText = preostaliPremiki;
    }

    window.addEventListener('keydown', function (e) {
        if (!igraAktivna) return;

        var nextX = player.x;
        var nextY = player.y;

        if (e.key === "ArrowUp" || e.key === "w") { nextY--; e.preventDefault(); }
        else if (e.key === "ArrowDown" || e.key === "s") { nextY++; e.preventDefault(); }
        else if (e.key === "ArrowLeft" || e.key === "a") { nextX--; e.preventDefault(); }
        else if (e.key === "ArrowRight" || e.key === "d") { nextX++; e.preventDefault(); }
        else { return; }

        if (nextX >= 0 && nextX < COLS && nextY >= 0 && nextY < ROWS) {
            if (mazeA[nextY][nextX] === 0) {
                if (player.x !== nextX || player.y !== nextY) {
                    var zeObiskano = sled.some(polje => polje.x === nextX && polje.y === nextY);

                    player.x = nextX;
                    player.y = nextY;

                    sled.push({ x: player.x, y: player.y, barva: window.trenutnaBarva });

                    drawScene();

                    if (player.x === 31 && player.y === (ROWS - 1)) {
                        igraAktivna = false;
                        zmaga();
                        return;
                    }

                    if (!zeObiskano) {
                        preostaliPremiki--;
                        if (htmlPoteze) htmlPoteze.innerText = preostaliPremiki;

                        // Izračun porabljenih (izhajamo iz 800, ker si tako nastavil spremenljivko)
                        var porabljene = 800 - preostaliPremiki;
                        console.log("Porabljene poteze: " + porabljene); // Debugging

                        const div1 = document.getElementById('obmocje-slika-1');
                        const div2 = document.getElementById('obmocje-slika-2');

                        if (div1 && porabljene >= 100) {
                            div1.style.opacity = "1";
                            console.log("Prikazujem sliko 1");
                        }
                        if (div2 && porabljene >= 200) {
                            div2.style.opacity = "1";
                            console.log("Prikazujem sliko 2");
                        }

                        // Preverimo poraz
                        if (preostaliPremiki <= 0) {
                            igraAktivna = false;
                            konecIgre();
                        }
                    }
                }
            }
        }
    });

    drawScene();
});