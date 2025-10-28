let form = document.getElementById("formregistro")
let usuario = document.getElementById("dondevaelmail");
let contraseña = document.getElementById("dondevalacontra");
let diacumple = document.getElementById("dia");
let mescumple = document.getElementById("mes");
let añocumple = document.getElementById("año");
let genero = document.getElementById("genero");
let boton = document.getElementById("registrate");
let mensaje = document.getElementById("mensaje");
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

connect2Server();

function registrar(){

  let mail = usuario.value.trim();
  let contra = contraseña.value.trim();

  if(mail==="" || contra === ""){
    mensaje.textContent = "Completar ambos campos";
    mensaje.style.color = "red";
    return;
  }

  postEvent("register", { email: mail, password: contra}, function (data){ 

  if (data.exists) {
    mensaje.textContent = "Este usuario ya existe";
    mensaje.style.color = "red";
    return;
  }

  else{ 

    let fecha = new Date().toLocaleDateString;

    usuarios.push({mail,contra, fecha});
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
