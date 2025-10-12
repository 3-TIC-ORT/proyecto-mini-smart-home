connect2Server()

const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    // remover active de todos los tabs
    tabs.forEach(t => t.classList.remove('active'));
    // agregar active al tab clickeado
    tab.classList.add('active');

    // ocultar todos los contenidos
    contents.forEach(c => c.classList.remove('active'));
    // mostrar contenido correspondiente
    const tabId = tab.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});

function actualizarReloj() {
    const ahora = new Date();
    const opciones = { hour: '2-digit', minute: '2-digit', hour12: true };
    const opcionesFecha = { day: '2-digit', month: '2-digit', year: 'numeric' };
  
    const hora = ahora.toLocaleTimeString('es-AR', opciones);
    const fecha = ahora.toLocaleDateString('es-AR', opcionesFecha);
  
    document.getElementById("reloj").innerText = `${fecha} - ${hora}`;
  }
  
  setInterval(actualizarReloj, 10000);
  actualizarReloj();

  const form = document.getElementById("modoform");
  const lista = document.getElementById("modos");
  const condiciones = document.getElementById("condicion");
  const condicionesExtra = document.getElementById("extrastuff");
    
  condicion.addEventListener("change", () => {
    condicionesExtra.innerHTML = "";
    if (condicion.value === "hora") {
      condicionesExtra.innerHTML = `
      <label>Desde: <input type="time" id="horaDesde"></label>
      <label>Hasta: <input type="time" id="horaHasta"></label>
    `;
      } else if (condicion.value === "dia") {
        condicionesExtra.innerHTML = `
          <label>Día:
            <select id="diaSemana">
              <option value="1">Lunes</option>
              <option value="2">Martes</option>
              <option value="3">Miércoles</option>
              <option value="4">Jueves</option>
              <option value="5">Viernes</option>
              <option value="6">Sábado</option>
              <option value="0">Domingo</option>
            </select>
          </label>
        `;
      } else if (condicion.value === "luz") {
        condicionesExtra.innerHTML = `
          <label>
            Nivel de luz:
            <select id="nivelLuz">
              <option value="oscuro">Oscuro</option>
              <option value="claro">Claro</option>
            </select>
          </label>
        `;
      }
    });
    
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById("nombreModo").value;
    const tipo = condicion.value;
    
    let condiciones = {};

    function crearModo() {
      if (tipo === "hora") {
        condiciones = {
          tipo: "hora",
          desde: document.getElementById("horaDesde").value,
          hasta: document.getElementById("horaHasta").value
        };
      } else if (tipo === "dia") {
        condiciones = {
          tipo: "dia",
          dia: document.getElementById("diaSemana").value
        };
      } else if (tipo === "luz") {
        condiciones = {
          tipo: "luz",
          nivel: document.getElementById("nivelLuz").value
        };
      }
    
      postEvent("nuevoModo", { nombre, condiciones }, (respuesta) => {
        console.log("Modo guardado:", respuesta);
        cargarModos();
      });

      // Resetea el formulario y limpia los campos extra
      form.reset();
      condicionesExtra.innerHTML = "";

      // Opcional: Retorna un mensaje o el objeto creado
      return { nombre, condiciones };
    }

    // Llama a la función crearModo
    crearModo();
    });

    function botonApretado(status){
      if(status.on){
        estado.innerText = "prendido";
      }else{
        receive("boton",botonApretado)
      }
    }