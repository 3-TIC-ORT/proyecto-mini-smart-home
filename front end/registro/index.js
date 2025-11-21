let form = document.getElementById("formregistro")
let usuario = document.getElementById("dondevaelmail");
let contraseña = document.getElementById("dondevalacontra");
let dia = document.getElementById("dia");
let mes = document.getElementById("mes");
let año = document.getElementById("año");
let boton = document.getElementById("registrate");
let mensaje = document.getElementById("mensaje");
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

connect2Server();

for (let d = 1; d <= 31; d++) {
  let opt = document.createElement("option");
  opt.value = d;
  opt.textContent = d;
  dia.appendChild(opt);
}

for (let m = 1; m <= 12; m++) {
  let opt = document.createElement("option");
  opt.value = m;
  opt.textContent = m;
  mes.appendChild(opt);
}

let añoActual = new Date().getFullYear();
for (let a = añoActual; a >= 1970; a--) {
  let opt = document.createElement("option");
  opt.value = a;
  opt.textContent = a;
  año.appendChild(opt);
}

function registrar(){

  let nombre = usuario.value.trim();
  let contra = contraseña.value.trim();
  let cumple = `${año.value}-${mes.value}-${dia.value}`;
  let fecha = new Date().toLocaleDateString();

  let generoInputs = document.querySelectorAll('input[name="genero"]');
  let genre = "";
for (let i = 0; i < generoInputs.length; i++) {
  if (generoInputs[i].checked) {
    genre = generoInputs[i].value;
    break;
  }
}

  if(nombre==="" || contra === "" ||  dia.value === "" || mes.value === "" || año.value === ""){
    mensaje.textContent = "Completar todos los campos";
    mensaje.style.color = "red";
    return;
  }
  
  postEvent("register", 
    { nombre: nombre, password: contra, cumple: cumple, genero: genre, registro: fecha }, 
    function (data){ 

      if (!data.ok) {
        mensaje.textContent = "Este usuario ya existe";
        mensaje.style.color = "red";

        return;
      }else{
        mensaje.textContent = "¡Registro existoso!"
        mensaje.style.color = "green"
        localStorage.setItem("usuarios", JSON.stringify(usuarios));
        localStorage.setItem("usuarioLogueado", JSON.stringify({
          nombre: nombre,
          cumple: cumple,
          genero: genre,
          registro: fecha
        }));
        location.href = "../after_inicio/menu.html"
      }
    }
  );

}

form.addEventListener("submit", function(e) {
  e.preventDefault();
  registrar();
});

let inicio = document.getElementById("inicio");

inicio.addEventListener("click", () => {
  window.location.href = "../inicio_de_sesion/main.html";
});