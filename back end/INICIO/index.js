import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";





subscribePOSTEvent ("register", (data) => {
  let leer = JSON.parse (fs.readFileSync ("data/registro_login.json", "utf-8"));
  let objeto = {nombre: data.nombre, password: data.password, cumple: data.cumple, genero: data.genero, registro: data.registro};
  let encontrar = leer.find (leer => data.nombre === leer.nombre && data.password === leer.password && data.cumple === leer.cumple && data.genero === leer.genero && data.registro === leer.registro);


  //Si el usuario ya existe, el retorno de la función es un objeto {ok:false}:
  if (encontrar) {
    return {ok: false};
  }




  leer.push (objeto);




  fs.writeFileSync ("data/registro_login.json", JSON.stringify (leer, null, 2), {encoding: "utf-8"});




  return {ok: true};
});




subscribePOSTEvent ("login", (data) => {




  let leer = JSON.parse (fs.readFileSync ("data/registro_login.json", "utf-8"));




  for (let i = 0; i < leer.length; i++ ) {


  let encontrar = leer.find (leer => data.email === leer.nombre && data.password === leer.password);


  if (encontrar) {
    let objeto = {email: data.email, password: data.password};
    leer.push (objeto);




    fs.writeFileSync ("data/registro_login.json", JSON.stringify (leer, null, 2), {encoding: "utf-8"});
    return {ok: true};
  }
  else {
    return {ok: false};
  }
}
});




//Para los modos:




subscribePOSTEvent ("crearModo", (data, respuesta) => {
  let modos = JSON.parse (fs.readFileSync ("data/modos.json", "utf-8"));
  let objeto = {
    nombre: data.nombre,
    condiciones: data.condiciones,
    acciones: data.acciones
  }




  modos.push (objeto);




  fs.writeFileSync ("data/modos.json", JSON.stringify (modos, null, 2), {encoding: "utf-8"});
 
  return (respuesta, {ok: true});
});




subscribeGETEvent ("obtenerModos", () => {
  let modos = fs.readFileSync ("data/modos.json", "utf-8");
  return modos;
});




//Para mostrar el nombre de usuario:
subscribePOSTEvent("obtenerUsuario", (data) => {
  let objeto = {usuariologueado: data.usuarioLogueado};
 
  return objeto;
});






startServer ();

