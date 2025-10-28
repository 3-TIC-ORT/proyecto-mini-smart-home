import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

subscribePOSTEvent ("register", (data) => {
  let leer = JSON.parse (fs.readFileSync ("data/registro + login.json", "utf-8"));
  let objeto = {email: data.email, password: data.password};

  leer.push (objeto);

  fs.writeFileSync ("data/registro + login.json", JSON.stringify (leer, null, "\n"), {encoding: "utf-8"});

  return {ok: true};
});

subscribePOSTEvent ("login", (data) => {

  let leer = JSON.parse (fs.readFileSync ("data/registro + login.json", "utf-8"));

  for (let i = 0; i < leer.length; i++ ) {
    
  let encontrar = leer.find (leer => data.email === leer.email && data.password === leer.password);
  
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

//Crea un nuevo puerto (vía por la que se envían los datos):
let port = new SerialPort ({
  path: "COM5",
  baudRate: 9600
});

//Crea un nuevo ReadlineParser, que es 
let parser = port.pipe (new ReadlineParser ({delimeter: "\n"}));

parser.on ('data', console.log);

subscribePOSTEvent ("controlLuces", (data) => {
  let caracter = 'j';
  port.write (caracter, (err) => {
    if (err) {
      return console.error ('Error al escribir por el puerto', err.message);
    }
  return ('Se escribió en el puerto: ', caracter);
  });
});


startServer ();




