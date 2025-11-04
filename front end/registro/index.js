let form = document.getElementById("formregistro")
let usuario = document.getElementById("dondevaelmail");
let contraseña = document.getElementById("dondevalacontra");
let cumpleaños = document.getElementById("cumple");
let genero = document.getElementsByClassName("genero");
let boton = document.getElementById("registrate");
let mensaje = document.getElementById("mensaje");
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

connect2Server();

function registrar(){

  let nombre = usuario.value.trim();
  let contra = contraseña.value.trim();
  let cumple = cumpleaños.value;
  let fecha = new Date().toLocaleDateString();

 let generoInputs = document.getElementsByClassName("genero");
  let genre = "";
  for (let i = 0; i < generoInputs.length; i++) {
    if (generoInputs[i].checked) {
      genre = generoInputs[i].value;
      break;
    }
  }

  if(nombre==="" || contra === "" || cumple === ""){
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
  window.location.href = "../inicio de sesion/main.html";
});