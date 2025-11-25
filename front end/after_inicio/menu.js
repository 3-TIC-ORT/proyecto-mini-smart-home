connect2Server();

let tabs = document.querySelectorAll('.tab');
let contents = document.querySelectorAll('.tab-content');
let form = document.getElementById("modoform");
let lista = document.getElementById("modos");
let condicion = document.getElementById("condicion");
let condicionesExtra = document.getElementById("extrastuff");

// perfil

let containerPerfilView = document.getElementById("perfilView");
let containerPerfilEdit = document.getElementById("perfilEdit");

let botonEditar = document.getElementById("btnEditar");
let botonGuardar = document.getElementById("guardarPerfil");
let botonCancelar = document.getElementById("cancelarEditar");

let inputNombre = document.getElementById("inputNombre");
let inputCumple = document.getElementById("inputCumple");
let inputSobre = document.getElementById("inputSobre");

let usuarioLogueado = localStorage.getItem("usuarioLogueado");

 if (!usuarioLogueado) {
  location.href = "../inicio_de_sesion/main.html";
} else {
  let usuario = JSON.parse(usuarioLogueado);


 postEvent("obtenerUsuario", usuario, function(data) {
   let saludo = document.getElementById("saludo");
   let nombreUsuario = document.getElementById("nombreusuario");
   let nacimiento = document.getElementById("nacimiento");
   let sobre = document.getElementById("sobre");


   if (data.nombre) {
     saludo.textContent = "¡Hola, " + data.nombre + "!";
     nombreUsuario.textContent = data.nombre;
   } else {
     saludo.textContent = "¡Hola!";
     nombreUsuario.textContent = "Sin nombre";
   }

   // cumple
   if (data.cumple) {
     nacimiento.textContent = data.cumple;
   } else {
     nacimiento.textContent = "No disponible";
   }

   // sobre
   if (data.sobre) {
     sobre.textContent = data.sobre;
   } else {
     sobre.textContent = "Sin descripción";
   }

   // editar
   botonEditar.addEventListener("click", function () {
    
     if (data.nombre) {
       inputNombre.value = data.nombre;
     } else {
       inputNombre.value = "";
     }

     if (data.cumple) {
       inputCumple.value = data.cumple;
     } else {
       inputCumple.value = "";
     }

     if (data.sobre) {
       inputSobre.value = data.sobre;
     } else {
       inputSobre.value = "";
     }

     if (containerPerfilView) {
       containerPerfilView.style.display = "none";
     }
     if (containerPerfilEdit) {
       containerPerfilEdit.style.display = "block";
     }
   });

   botonCancelar.addEventListener("click", function () {
     if (containerPerfilEdit) {
       containerPerfilEdit.style.display = "none";
     }
     if (containerPerfilView) {
       containerPerfilView.style.display = "flex";
     }
   });

   //guardar
   botonGuardar.addEventListener("click", function () {
     let nuevoNombre = inputNombre.value.trim();
     let nuevoCumple = inputCumple.value;
     let nuevoSobre = inputSobre.value.trim();

     let datosActualizados = {
       nombre: nuevoNombre,
       cumple: nuevoCumple,
       sobre: nuevoSobre
     };

     postEvent("actualizarUsuario", datosActualizados, function (data) {
       let actualizado = null;
       if (data && typeof data === "object") {
         actualizado = data;
       } else {
         actualizado = datosActualizados;
       }


       if (actualizado.nombre) {
         document.getElementById("nombreusuario").textContent = actualizado.nombre;
         document.getElementById("saludo").textContent = "¡Hola, " + actualizado.nombre + "!";
       } else {
         document.getElementById("nombreusuario").textContent = "Sin nombre";
         document.getElementById("saludo").textContent = "¡Hola!";
       }


       if (actualizado.cumple) {
         document.getElementById("nacimiento").textContent = actualizado.cumple;
       } else {
         document.getElementById("nacimiento").textContent = "No disponible";
       }


       if (actualizado.sobre) {
         document.getElementById("sobre").textContent = actualizado.sobre;
       } else {
         document.getElementById("sobre").textContent = "Sin descripción";
       }


       // guardar en localStorage
       data.nombre = actualizado.nombre;
       data.cumple = actualizado.cumple;
       data.sobre = actualizado.sobre;
       localStorage.setItem("usuarioLogueado", JSON.stringify(data));


       if (containerPerfilEdit) {
         containerPerfilEdit.style.display = "none";
       }
       if (containerPerfilView) {
         containerPerfilView.style.display = "flex";
       }
     });
   });


 });
}

tabs.forEach(tab => {
 tab.addEventListener('click', () => {
   tabs.forEach(t => t.classList.remove('active'));
   tab.classList.add('active');


   contents.forEach(c => c.classList.remove('active'));
   let tabId = tab.getAttribute('data-tab');
   document.getElementById(tabId).classList.add('active');
 });
});

// el coso este desplegable

let conf = document.querySelector(".settings");
let iconMenu = document.querySelector(".icon-menu");
let casita = document.getElementById("casita");
let modooscuro = document.getElementById("modooscuro");
let logout = document.getElementById("logout");

conf.addEventListener("click", () => {
 iconMenu.classList.toggle("active");
});


casita.addEventListener("click", () => {
 location.href = "../pantalla_principal/princi.html"
});

modooscuro.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

 let btnImg = modooscuro.querySelector("img");

  document.querySelectorAll("img[data-dark]").forEach(img => {
    if (!img.dataset.light) img.dataset.light = img.src;

    if (document.body.classList.contains("dark-mode")) {
      img.src = img.dataset.dark;
    } else {
      img.src = img.dataset.light;
    }
  });
});

logout.addEventListener("click", () => {
 localStorage.removeItem("usuarioLogueado");
 location.href = "../inicio_de_sesion/main.html";
});

function actualizarReloj() {
 let ahora = new Date();
  let opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: true };
 let opcionesFecha = { day: '2-digit', month: '2-digit', year: 'numeric' };


 let hora = ahora.toLocaleTimeString('es-AR', opcionesHora);
 let fecha = ahora.toLocaleDateString('es-AR', opcionesFecha);


 document.getElementById("fecha").innerText = fecha;
 document.getElementById("hora").innerText = hora;
}

setInterval(actualizarReloj, 1000);
actualizarReloj();

// los modosssss

let modosGuardados = [];
let modoActualIndex = 0;
let slideIndex = 0;

let modoActualDiv = document.getElementById("modoActual");
let vistaCrear = document.getElementById("vistaCrear");
let prevBtn = document.getElementById("prevModo");
let nextBtn = document.getElementById("nextModo");
let formExistente = document.getElementById("modoform");

getEvent("obtenerModos", function(modos) {
    if (typeof modos === "string") {
        try { modos = JSON.parse(modos); } catch(e) { modos = []; }
    }
    if (!Array.isArray(modos)) modos = [];
    let usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

    // FILTRAR SOLO MODOS DE ESTE USUARIO
    modosGuardados = modos.filter(m => m.owner === usuario.nombre);
    showSlideIndex();
});

function cargarModos() {
  let usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

  getEvent("obtenerModos", function(modos) {

      if (typeof modos === "string") {
          modos = JSON.parse(modos);
      }

      if (!Array.isArray(modos)) {
          modos = [];
      }

      modosGuardados = modos.filter(m => m.owner === usuario.nombre);

      showSlideIndex();
  });
}

function mostrarModos() {
    if (!modosGuardados || modosGuardados.length === 0) return;

    if (modoActualIndex < 0) modoActualIndex = 0;
    if (modoActualIndex >= modosGuardados.length) modoActualIndex = modosGuardados.length - 1;

    let modo = modosGuardados[modoActualIndex];
    if (!modo) return;

    let a = modo.acciones || {};

    let nombreTexto = modo.nombre || "Modo sin nombre";
    document.getElementById("modoNombre").textContent = nombreTexto;

    document.getElementById("accPersiana").textContent = a.persiana || "nada";
    document.getElementById("accVentilador").textContent = a.ventilador || "nada";
    document.getElementById("accRojas").textContent = a.lucesrojas || "nada";
    document.getElementById("accAzules").textContent = (a.lucesazules !== undefined && a.lucesazules !== null) ? a.lucesazules : "nada";
}

function showSlideIndex() {
    modoActualDiv.style.display = "none";
    vistaCrear.style.display = "none";

    if (slideIndex < modosGuardados.length) {
        modoActualDiv.style.display = "block";
        modoActualIndex = slideIndex;
        mostrarModos();
    } else {
        vistaCrear.style.display = "block";
        if (vistaCrear) {
            let primerElemento = vistaCrear.querySelector("input, select, textarea, button");
            if (primerElemento) primerElemento.focus();
        }
    }
}

prevBtn.addEventListener("click", function() {
    if (slideIndex > 0) {
        slideIndex--;
    } else {
        slideIndex = modosGuardados.length;
    }
    showSlideIndex();
});

nextBtn.addEventListener("click", function() {
    slideIndex++;
    if (slideIndex > modosGuardados.length) slideIndex = 0;
    showSlideIndex();
});

document.getElementById("btnSeleccionar").addEventListener("click", function() {
    if (slideIndex >= modosGuardados.length) return;
    let modo = modosGuardados[modoActualIndex];
    if (modo) activarModo(modo);
});

function activarModo(modo) {
    if (!modo || !modo.acciones) return;
    let a = modo.acciones;

    if (a.persiana === "abrir") actualizarPersiana(1);
    else if (a.persiana === "cerrar") actualizarPersiana(0);

    if (a.ventilador === "prender") actualizarVentilador(1);
    else if (a.ventilador === "apagar") actualizarVentilador(0);

    if (a.lucesrojas === "prender") actualizarLuces(1,1);
    else if (a.lucesrojas === "apagar") actualizarLuces(1,0);

    if (typeof a.lucesazules === "number") {
        actualizarLuces(2, a.lucesazules);
        potter.value = a.lucesazules;
    }

    let accionesBackend = {
        persiana: a.persiana === "abrir" ? 1 : a.persiana === "cerrar" ? 0 : null,
        ventilador: a.ventilador === "prender" ? 1 : a.ventilador === "apagar" ? 0 : null,
        lucesrojas: a.lucesrojas === "prender" ? 1 : a.lucesrojas === "apagar" ? 0 : null,
        lucesazules: a.lucesazules
    };

    postEvent("ejecutarModo", accionesBackend, function(data) {
        console.log("Modo activado:", modo.nombre, accionesBackend);
    });
}

condicion.addEventListener("change", function() {
    condicionesExtra.innerHTML = "";
    if (condicion.value === "hora") {
        condicionesExtra.innerHTML = `
            <input type="time" id="desdeHora"><label> - </label>
            <input type="time" id="hastaHora">
        `;
    } else if (condicion.value === "dia") {
        condicionesExtra.innerHTML = `
            <label>Día: <input type="number" id="dia" min="1" max="7"></label>
        `;
    }
});

formExistente.addEventListener("submit", function(e) {
  e.preventDefault();

  let nombre = document.getElementById("nombre").value;
  let tipo = condicion.value;

  crearModo(nombre, tipo);
});

function crearModo(nombre, tipo) {
  let condiciones = {};

  if (tipo === "hora") {
    condiciones = {
      tipo: "hora",
      desde: document.getElementById("desdeHora").value,
      hasta: document.getElementById("hastaHora").value
    };
  } else if (tipo === "dia") {
    condiciones = {
      tipo: "dia",
      dia: document.getElementById("dia").value
    };
  }

  let acciones = {
    persiana: document.getElementById("percy").value,
    ventilador: document.getElementById("venti").value,
    lucesrojas: document.getElementById("rojo").value,
    lucesazules: parseInt(document.getElementById("azul").value)
  };

  let usuario = JSON.parse(localStorage.getItem("usuarioLogueado"));

  let nuevoModo = {
    nombre,
    condiciones,
    acciones,
    owner: usuario.nombre
  };

  console.log("Se envía al backend:", nuevoModo);

  postEvent("crearModo", nuevoModo, (respuesta) => {
    console.log("Modo guardado:", respuesta);
    cargarModos();
  });
}


//musica

let audio = document.getElementById("audio");
let titulo = document.getElementById("titulo");


let botonplay = document.getElementById("btnplay");
let botonanterior = document.getElementById("btnanterior");
let botonsaltear = document.getElementById("btnsaltear");
let repeatBtn = document.getElementById("repeat");
let repeatIcon = document.getElementById("repeatIcon");
let muteBtn = document.getElementById("mute");
let shuffleBtn = document.getElementById("shuffle");
let shuffleIcon = document.getElementById("shuffleIcon");


let progreso = document.getElementById("progreso");
let progresoThumb = document.getElementById("progresoThumb");


let current = 0;


let songs = [
 { titulo: "Song 1", file: "../musica/track1.mp3" },
 { titulo: "Song 2", file: "../musica/track2.mp3" },
 { titulo: "Song 3", file: "../musica/track3.mp3" }
];


function cargarCancion(index) {
 let song = songs[index];
 titulo.textContent = song.titulo;
 audio.src = song.file;
 audio.currentTime = 0;
}


function updatePlayIcon() {
 if (audio.paused) {
   botonplay.src = "../imagenes/playicono.png";
 } else {
   botonplay.src = "../imagenes/pausa.png";
 }
}


botonplay.addEventListener("click", () => {
 if (audio.paused) {
   audio.play();
 } else {
   audio.pause();
 }
 updatePlayIcon();
});


botonanterior.addEventListener("click", () => {
 if (repeat === true) {
   // si está repeat, reinicia la misma canción
   audio.currentTime = 0;
   audio.play();
 } else {
 current = (current - 1 + songs.length) % songs.length;
 cargarCancion(current);
 audio.play();
 updatePlayIcon();
 }
});




let repeat = false;


repeatBtn.addEventListener("click", () => {
 repeat = !repeat;


 if (audio.loop) {
   audio.loop = false;
 } else {
   audio.loop = true;
 }
});


muteBtn.addEventListener("click", () => {
 audio.muted = !audio.muted;
 if (audio.muted) {
   audio.volume = volumen.value;
 }
});


let shuffle = false;


shuffleBtn.addEventListener("click", function () {
 if (shuffle === false) {
   shuffle = true;
 } else {
   shuffle = false;
 }
});


audio.addEventListener("timeupdate", () => {
 let porcentaje = (audio.currentTime / audio.duration) * 100;
 progreso.style.width = porcentaje + "%";
 progresoThumb.style.left = porcentaje + "%";
});


function nextSong() {
 if (shuffle) {
   // canción aleatoria distinta a la actual
   let newIndex;


   // evitar repetir la misma canción
   if (songs.length > 1) {
     do {
       newIndex = Math.floor(Math.random() * songs.length);
     } while (newIndex === current);
     current = newIndex;
   }
 } else {
   current = (current + 1) % songs.length;
 }


 cargarCancion(current);
 audio.play();
}


botonsaltear.addEventListener("click", () => {
  if (repeat === true) {
   audio.currentTime = 0;
   audio.play();
 } else {
 nextSong();
 updatePlayIcon();
 };
});




audio.addEventListener("ended", () => {
 if (repeat === true) {
   setTimeout(() => {
     audio.currentTime = 0;
     audio.play();
   }, 50);
 } else {
   nextSong();
 }
});


cargarCancion(current);


//CONTROLLLLLLLL


if (usuarioLogueado) {
 let usuario = JSON.parse(usuarioLogueado);


 postEvent("obtenerUsuario", usuario, function(data) {


   let saludo = document.getElementById("salut");
   let nombreUsuario = document.getElementById("nombreusuario");


   if (data.nombre) {
     saludo.textContent = "¡Hola, " + data.nombre + "!";
     nombreUsuario.textContent = data.nombre;
   } else {
     saludo.textContent = "¡Hola!";
     nombreUsuario.textContent = "Sin nombre";
   }
 })
}


// percy-anna(entienden el chiste?)


let botonAbrirPersiana = document.getElementById("abrir");
let botonCerrarPersiana = document.getElementById("cerrar");
let persiana = document.getElementById("persiana");


function actualizarPersiana(estado) {
 if (estado > 0) {
   persiana.src = "../imagenes/openpercy.png";
 } else {
   persiana.src = "../imagenes/persianacerrada.png";
 }
}


botonAbrirPersiana.addEventListener("click", () => {
 actualizarPersiana(1);
 postEvent("controlPersiana", { estado: 1 }, function (res) {
   console.log("Backend respondió (persiana abrir):", res);
 });
});


botonCerrarPersiana.addEventListener("click", () => {
 actualizarPersiana(0);
 postEvent("controlPersiana", { estado: 0 }, function (res) {
   console.log("Backend respondió (persiana cerrar):", res);
 });
});


actualizarPersiana(0);


// ventilador


let botonPrenderVentilador = document.getElementById("helicopterhelicopter");
let botonApagarVentilador = document.getElementById("nogira");
let ventilador = document.getElementById("ventilador");


function actualizarVentilador(estado) {
 if (estado > 0) {
   ventilador.classList.add("girando");
 } else {
   ventilador.classList.remove("girando");
 }
}


botonPrenderVentilador.addEventListener("click", () => {
 actualizarVentilador(1);
 postEvent("controlVentilador", { estado: 1 }, function (res) {
   console.log("Backend respondió (ventilador prender):", res);
 });
});


botonApagarVentilador.addEventListener("click", () => {
 actualizarVentilador(0);
 postEvent("controlVentilador", { estado: 0 }, function (res) {
   console.log("Backend respondió (ventilador apagar):", res);
 });
});


actualizarVentilador(0);


//  luces
// fila 1
let botonPrender = document.getElementById("prender");
let botonApagar = document.getElementById("apagar");
let potter = document.getElementById("intensidad2");
let luces = document.querySelectorAll(".luces");




function actualizarLuces(fila, intensidad) {
 luces.forEach((luz, i) => {
   let bomb = luz.querySelector("img")
   if (fila === 1 && i < 4) {
     if (intensidad > 0) {
       bomb.src = "../imagenes/rojoprendido.png";
       luz.classList.add("prendidas-rojas");
     } else {
       bomb.src = "../imagenes/rojoapagado.png";
       luz.classList.remove("prendidas-rojas");
     }
   }
   if (fila === 2 && i >= 4) {
     if (intensidad > 0) {
       bomb.src = "../imagenes/azulprendido.png";
       luz.classList.add("prendidas-azules");
     } else {
       bomb.src = "../imagenes/azulapagado.png";
       luz.classList.remove("prendidas-azules");
     }
   }
 });
}


botonPrender.addEventListener('click', () => {
 actualizarLuces(1, 1); // mostrar como prendidas
 postEvent('controlLucesLEDr', { fila: 1, intensidad: 1 }, (res) => {
   console.log('Backend respondió fila1 (prender):', res);
 });
});


botonApagar.addEventListener('click', () => {
 actualizarLuces(1, 0); // mostrar como apagadas
 postEvent('controlLucesLEDr', { fila: 1, intensidad: 0 }, (res) => {
   console.log('Backend respondió fila1 (apagar):', res);
 });
});


potter.addEventListener('input', () => {
 let valor = parseInt(potter.value);
 actualizarLuces(2, valor);
 postEvent('controlLucesLEDa', { fila: 2, intensidad: valor }, (res) => {
   console.log('Backend respondió fila2:', res);
 });
});


actualizarLuces(1, 0);
actualizarLuces(2, parseInt(potter.value));


let estado = document.getElementById("estado");


subscribeRealTimeEvent("estado", (data) => {
  console.log("Actualización desde hardware:", data);

  if (data.persiana !== undefined) {
    actualizarPersiana(data.persiana);
  }

  if (data.ventilador !== undefined) {
    actualizarVentilador(data.ventilador);
  }

  if (data.lucesrojas !== undefined) {
    actualizarLuces(1, data.lucesrojas);
  }

  if (data.lucesazules !== undefined) {
    actualizarLuces(2, data.lucesazules);
    potter.value = data.lucesazules;
  }

  if (data.encendido !== undefined) {
    if (data.encendido === true) {
      estado.innerText = "prendido";
    } else {
      estado.innerText = "apagado";
    }
  }
});


//el sensor de temperaturaaa

let temp = document.getElementById("temperatura");


subscribeRealTimeEvent("temperatura", (data) => {
 console.log("Temperatura:", data);
 temp.innerText = `${data.valor}°C`;
});