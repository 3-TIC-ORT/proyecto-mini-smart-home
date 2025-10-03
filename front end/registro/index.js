let form = document.getElementById("formregistro")
let usuario = document.getElementById("dondevaelmail");
let contraseña = document.getElementById("dondevalacontra");
let boton = document.getElementById("registrate");
let mensaje = document.getElementById("mensaje");
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

connect2Server();

function registrar(){

  const mail = usuario.value.trim();
  const contra = contraseña.value.trim();

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
    usuarios.push({mail,contra});
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
