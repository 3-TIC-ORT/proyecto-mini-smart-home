let form = document.getElementById("formregistro")
let usuario = document.getElementById("dondevaelmail");
let contraseña = document.getElementById("dondevalacontra");
let cumpleaños = document.getElementById("cumple");
let genero = document.getElementById("genero");
let boton = document.getElementById("registrate");
let mensaje = document.getElementById("mensaje");
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

connect2Server();

function registrar(){

  let mail = usuario.value.trim();
  let contra = contraseña.value.trim();
  let cumple = cumpleaños.value;

  if(mail==="" || contra === ""){
    mensaje.textContent = "Completar ambos campos";
    mensaje.style.color = "red";
    return;
  }

  postEvent("register", { email: nombre, password: contra, fecha: cumple, genero: genero}, function (data){ 

  if (data.exists) {
    mensaje.textContent = "Este usuario ya existe";
    mensaje.style.color = "red";
    return;
  }

  else{ 

    let fecha = new Date().toLocaleDateString();

    usuarios.push({
      mail,
      contra, 
      cumple, 
      fecha
    });

    mensaje.textContent = "¡Registro existoso!"
    mensaje.style.color = "green"
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
});
}

form.addEventListener("submit", function(e) {
  e.preventDefault();
  registrar();
});

let inicio = document.getElementById("inicio");

inicio.addEventListener("click", () => {
  window.location.href = "../inicio de sesion/main.html";
});