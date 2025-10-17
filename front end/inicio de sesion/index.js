let usuario = document.getElementById("dondevaelmail");
let contraseña = document.getElementById("dondevalacontra");
let boton = document.getElementById("iniciar");
let mensaje = document.getElementById("mensaje");
let form = document.getElementById("loginform")

connect2Server();

function iniciosesion(event) {
  event.preventDefault();

  let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  let contraseñas = JSON.parse(localStorage.getItem("contraseñas")) || [];

  let mail = usuario.value.trim();
  let contra = contraseña.value.trim();

   if (mail === "" || contra === "") {
     mensaje.textContent = "Completá ambos campos";
     mensaje.style.color = "red";
     return;
   }
 
    postEvent("login", { email: mail, password: contra }, function (data) {

      if (!data.exists) { 
        mensaje.textContent = "El usuario no existe";
        mensaje.style.color = "red";
        return;
      }
 
    if (!data.contraseñacorrecta) {
     mensaje.textContent = "Contraseña incorrecta";
     mensaje.style.color = "red";
     return;
   }
 
   else if(data.exists && data.contraseñacorrecta){
    mensaje.textContent = "¡Inicio de sesión exitoso!";
    mensaje.style.color = "green";
    localStorage.setItem("usuarioLogueado", mail);
   } 
  });
}
form.addEventListener("submit",iniciosesion);

