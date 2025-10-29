import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";


subscribePOSTEvent ("register", (data) => {
  let leer = JSON.parse (fs.readFileSync ("data/registro + login.json", "utf-8"));
  let objeto = {nombre: data.email, password: data.password, fecha: data.fecha, genero: data.genero};
  let encontrar = leer.find (leer => data.nombre === leer.nombre || data.password === leer.password || data.fecha === leer.fecha || data.genero === leer.genero);
  
  //Si el usuario ya existe, el retorno de la función es un objeto {ok:false}:
  if (encontrar) {
    return {ok: false};
  }

  leer.push (objeto);

  fs.writeFileSync ("data/registro + login.json", JSON.stringify (leer, null, "\n"), {encoding: "utf-8"});

  return {ok: true};
});

subscribePOSTEvent ("login", (data) => {

  let leer = JSON.parse (fs.readFileSync ("data/registro + login.json", "utf-8"));

  for (let i = 0; i < leer.length; i++ ) {
    
  let encontrar = leer.find (leer => data.nombre === leer.nombre && data.password === leer.password);
  
  if (encontrar) {
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
    condiciones: data.condiciones
  }
  modos.push (objeto);

  fs.writeFileSync ("data/modos.json", JSON.stringify (modos, null, 2), {encoding: "utf-8"});
  return (respuesta, {ok: true});
});

subscribeGETEvent ("obtenerModos", () => {
  let modos = fs.readFileSync ("data/modos.json", "utf-8");
  return modos;
});

//Comunicación con hardware: usando Node SerialPort


startServer ();