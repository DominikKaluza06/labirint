window.addEventListener('load', function() {
    console.log("Stran naložena. Zaganjam igro...");

    const container = document.getElementById('svg_container');
    const canvas = document.getElementById('labirint');

    // --- 1. IZBIRA LABIRINTA ---
    var izbira = 0; // Privzeto naložimo prvi labirint (indeks 0)

    // Če imamo v spominu listek "ponovenPoskus", izžrebamo naključnega
    if (sessionStorage.getItem("ponovenPoskus") === "da") {
        izbira = Math.floor(Math.random() * vsiLabirinti.length);
        console.log("Ponoven poskus! Naložen labirint številka:", izbira + 1);
    }

    container.innerHTML = vsiLabirinti[izbira];

    // --- 2. POIŠČEMO SVG IN PREBEREMO ČARTE ---
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
    sled.push({ x: player.x, y: player.y });

    const slikaCopica = new Image();
    slikaCopica.src = 'player.png'; 

    // Ko se slika naloži, ponovno nariše sceno, da se čopič takoj prikaže
    slikaCopica.onload = function() {
        drawScene();
    };

function drawScene() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const padding = 1; 
        const zamikX = -1; 
        const zamikY = -1; 

        // --- 1. NARIŠE NEPREKINJENO SLED ---
        if (sled.length > 0) {
            ctx.beginPath();
            ctx.strokeStyle = "lightblue"; 
            ctx.lineWidth = (cellW / 2);   
            ctx.lineCap = "round";         
            ctx.lineJoin = "round";        

            for (var i = 0; i < sled.length; i++) {
                var center_X = (sled[i].x * cellW) + (cellW / 2) + zamikX;
                var center_Y = (sled[i].y * cellH) + (cellH / 2) + zamikY;

                if (i === 0) {
                    ctx.moveTo(center_X, center_Y); 
                } else {
                    ctx.lineTo(center_X, center_Y); 
                }
            }
            ctx.stroke(); 
        }

        // --- 2. NARIŠE GLAVNEGA IGRALCA
        
        var faktorPovecave = 2; 
        

        var igralecSirina = cellW * faktorPovecave;
        var igralecVisina = cellH * faktorPovecave;

        // Izračunamo sredino trenutne celice, kjer stoji igralec
        var centerCeliceX = (player.x * cellW) + (cellW / 2) + zamikX;
        var centerCeliceY = (player.y * cellH) + (cellH / 2) + zamikY;

        // Zamakne sliko da bo centrirana glede na njeno novo velikost
        var igralecX = centerCeliceX - (igralecSirina / 2);
        var igralecY = centerCeliceY - (igralecVisina / 2);

        ctx.drawImage(slikaCopica, igralecX, igralecY, igralecSirina, igralecVisina);

    }

    var preostaliPremiki = 800;
    var igraAktivna = true; 

    const htmlPoteze = document.getElementById('poteze_stevilka');
    if (htmlPoteze) {
        htmlPoteze.innerText = preostaliPremiki;
    }

    window.addEventListener('keydown', function(e) {
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
                    
                    // 1. Preverimo, če smo na tem polju že bili
                    var zeObiskano = sled.some(polje => polje.x === nextX && polje.y === nextY);

                    // 2. Igralca fizično premaknemo
                    player.x = nextX;
                    player.y = nextY;
                    
                    // Tako bo črta vedno narisana zvezno po stopinjah in ne bo poševnic.
                    sled.push({ x: player.x, y: player.y });

                    drawScene(); 

                    // --- PREVERI, ČE JE IGRALEC NA CILJU ---
                    if (player.x === 29 && player.y === (ROWS - 1)) {
                        igraAktivna = false; 
                        zmaga();             
                        return; 
                    }

                    // --- POTEZE ODŠTEJEMO SAMO, ČE POLJE ŠE NI BILO OBISKANO ---
                    if (!zeObiskano) {
                        preostaliPremiki--;

                        if (htmlPoteze) {
                            htmlPoteze.innerText = preostaliPremiki;
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
    console.log("Labirint in igralec uspešno izrisana!");
});