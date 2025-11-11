let cs = document.getElementById("coming");
let inicio = document.getElementById("inicio");
let reggie = document.getElementById("reggie");
let overlay = document.getElementById("itsneverover");

cs.addEventListener('click', () => {
  overlay.style.display = 'flex';
});

overlay.addEventListener('click', (e) => {
  if (e.target === overlay) {
    overlay.style.display = 'none';
}
});

inicio.addEventListener("click", () => {
  location.href = "../inicio_de_sesion/main.html"
})

reggie.addEventListener("click", () => {
  location.href = "../registro/main.html"
})