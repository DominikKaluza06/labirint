const defaultSwalConfig = {
  color: 'white',
  background: '#1e1f20', 
};

// Privzeta barva čopiča
    window.trenutnaBarva = "lightblue"; 

    window.izberiBarvo = function(novaBarva) {
        window.trenutnaBarva = novaBarva;
    };

// Funkcija kpo zgubvis 
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