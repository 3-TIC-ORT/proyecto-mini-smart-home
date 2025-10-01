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

  