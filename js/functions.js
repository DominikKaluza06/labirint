const defaultSwalConfig = {
  color: 'white',
  background: '#1e1f20', 
};

function konecIgre(event){
Swal.fire({
    ...defaultSwalConfig,
    icon: "error",
    
    iconColor: "#c51313ff",
    title: "zmanjkalo ti je potez",
    confirmButtonColor: "#185abc",
    allowOutsideClick: false,
    confirmButtonText: "Poskusi znova",
    }).then(() => {
        
      });
}