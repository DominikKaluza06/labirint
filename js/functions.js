const defaultSwalConfig = {
  color: 'white',
  background: '#1e1f20', 
};

// Privzeta barva čopiča
    window.trenutnaBarva = "#0051ff"; 

    window.izberiBarvo = function(novaBarva) {
        window.trenutnaBarva = novaBarva;
    };

//labirint reset
window.onload = function() {
  nastaviRandomLabirint();
};

//pokazi skrij resitev 
window.showSol = function() {
    const container = document.getElementById("svg_container");
    if (container.style.backgroundImage === "" || container.style.backgroundImage === "none") {       
        const potDoSlike = `solutions/lab${izbira+1}_sol.svg`;
        container.style.backgroundImage = `url('${potDoSlike}')`;
        
        console.log("Prikazujem rešitev: " + potDoSlike);
    } else {
        // Če slika že obstaja, jo skrijemo z 'none'
        container.style.backgroundImage = "none";
        console.log("Rešitev skrita.");
    }
  };

// Funkcija ko zgubvis 
function konecIgre() { 
    Swal.fire({
      ...defaultSwalConfig,
      icon: "error",
      iconColor: "#c51313ff",
      title: "Zmanjkalo ti je potez",
      confirmButtonColor: "#185abc",
      allowOutsideClick: false,
      confirmButtonText: "Poskusi znova",
    }).then((result) => {
        if (result.isConfirmed) {
            sessionStorage.setItem("ponovenPoskus", "da"); 
            location.reload(); 
        }
    });
}

// --- FUNKCIJA ZA ZMAGO ---
function zmaga() { 
    Swal.fire({
      ...defaultSwalConfig,
      icon: "success",        
      iconColor: "#28a745",   
      title: "Čestitke, zmagal si!",
      confirmButtonColor: "#185abc",
      allowOutsideClick: false,
      confirmButtonText: "Igraj znova", 
    }).then((result) => {
        if (result.isConfirmed) {
            sessionStorage.setItem("ponovenPoskus", "da"); 
            location.reload(); 
        }
    });
}
