window.addEventListener('load', function() {
    console.log("Stran naložena. Iščem elemente...");

    // 1. Poberemo elemente iz HTML
    const container = document.getElementById('svg_container');
    const canvas = document.getElementById('labirint');

    if (!container || !canvas) {
        console.error("NAPAKA: Ne najdem 'svg_container' ali 'labirint' v HTML.");
        return;
    }

    // 2. Preverimo in vstavimo SVG (če še ni)
    if (typeof LOGO_SVG === 'undefined') {
        console.error("NAPAKA: LOGO_SVG ni definiran. Preveri js/javascript.js!");
        return;
    }

    if (container.innerHTML.trim() === "") {
        container.innerHTML = LOGO_SVG;
    }

    // 3. Zdaj ko je SVG vstavljen, ga poiščemo
    const svgMaze1 = document.getElementById('svg_maze_1');
    if (!svgMaze1) {
        console.error("NAPAKA: SVG elementa ni. Preveri sintakso v LOGO_SVG (tisti '>' znak!).");
        return;
    }

    // --- LOGIKA ZA LABIRINT ---
    const ROWS = 61;
    const COLS = 61;
    const SVG_OFFSET = 2;
    const SVG_STEP = 16;

    const lineElements = svgMaze1.querySelectorAll("line");

    const mazeLines = Array.from(lineElements).map(line => ({
        x1: parseFloat(line.getAttribute("x1")),
        y1: parseFloat(line.getAttribute("y1")),
        x2: parseFloat(line.getAttribute("x2")),
        y2: parseFloat(line.getAttribute("y2"))
    }));

    const ctx = canvas.getContext('2d');
    canvas.width = 700;
    canvas.height = 700;

    let mazeA = Array.from({ length: ROWS }, () => Array(COLS).fill(0));

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
            for (let y = startY; y <= endY; y++) {
                if (y < ROWS && x1 < COLS) mazeA[y][x1] = 1;
            }
        } else if (y1 === y2) {
            const startX = Math.min(x1, x2);
            const endX = Math.max(x1, x2);
            for (let x = startX; x <= endX; x++) {
                if (y1 < ROWS && x < COLS) mazeA[y1][x] = 1;
            }
        }
    });

    // --- SKUPNE SPREMENLJIVKE ZA RISANJE ---
    const cellW = canvas.width / COLS;
    const cellH = canvas.height / ROWS;

    // --- NASTAVITVE IGRALCA ---
    let player = { 
        x: 29, 
        y: 0 
    };

    // --- FUNKCIJE ZA RISANJE ---
    function drawScene() {
        // 1. Pobrišemo celoten canvas preden nariše nov premik
        ctx.clearRect(0, 0, canvas.width, canvas.height);


        // 3. Narišemo igralca (MODRA KOCKA)
        ctx.fillStyle = "blue";
        const padding = 1; // Da je kocka malo manjša
        const nudgeX = -1; 
        const nudgeY = -1; 

        ctx.fillRect(
            (player.x * cellW) + padding + nudgeX, 
            (player.y * cellH) + padding + nudgeY, 
            cellW - (padding * 2), 
            cellH - (padding * 2)
        );
    }

// --- NASTAVITVE IGRE IN PREMIKOV ---
    let preostaliPremiki = 10;
    let igraAktivna = true; // Stikalo, ki omogoča ali onemogoča premikanje

    // --- PREMIKANJE IGRALCA (KONTROLE) ---
    window.addEventListener('keydown', function(e) {
        // 1. Če smo porabili vse premike, funkcija takoj zaključi 
        if (!igraAktivna) return;

        let nextX = player.x;
        let nextY = player.y;

        // Katera tipka je bila pritisnjena?
        if (e.key === "ArrowUp" || e.key === "w") {
            nextY--;
            e.preventDefault(); 
        } else if (e.key === "ArrowDown" || e.key === "s") {
            nextY++;
            e.preventDefault();
        } else if (e.key === "ArrowLeft" || e.key === "a") {
            nextX--;
            e.preventDefault(); 
        } else if (e.key === "ArrowRight" || e.key === "d") {
            nextX++;
            e.preventDefault(); 
        } else {
            return; 
        }

        // --- PREVERJANJE ZIDOV IN LOGIKA ODŠTEVANJA ---
        if (nextX >= 0 && nextX < COLS && nextY >= 0 && nextY < ROWS) {
            if (mazeA[nextY][nextX] === 0) { // Če je pot prosta
                
                // Da se izognemo odštevanju, če se zabijamo v zid
                if (player.x !== nextX || player.y !== nextY) {
                    
                    // Premik
                    player.x = nextX;
                    player.y = nextY;
                    drawScene(); 

                    // Logika števca
                    preostaliPremiki--;
                    console.log("Preostali premiki:", preostaliPremiki); // Začasno spremljamo v konzoli

                    // Preverimo, če smo porabili vse
                    if (preostaliPremiki <= 0) {
                        igraAktivna = false; // Zaklene igro
                        konecIgre();
                    }
                }
            }
        }
    });

    // Prvi izris takoj, ko se stran naloži
    drawScene();
    console.log("Labirint in igralec uspešno izrisana!");
});