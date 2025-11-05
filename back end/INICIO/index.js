import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

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


//Comunicación front-back-hardware: usando Node SerialPort

let port = new SerialPort ({
  path: 'COM5',
  baudRate: 9600
});

let parser = port.pipe (new ReadlineParser ({delimiter: "\n"}));

//Código que hace que reciba los datos que manda el arduino, y hace que no se muestre un loop infinito de mensajes:
parser.on('data', (line) => {
  if (line.trim() !== "Distancia detectada: 0 cm") {
    console.log('Arduino respondió con:', line);
  }
});

subscribePOSTEvent ("controlLucesLEDr", (data) => {
  let objeto = {fila: data.fila, intensidad: data.intensidad};
  
  if (objeto.fila === 1 && objeto.intensidad >= 1) {
    port.write ('j', (err) => {
      if (err) {
      console.error ('Error al escribir en el puerto ', err.message);
      return ('Error al escribir en el puerto');
    }
  });
  }
  else {
    return (`LEDr apagado`);
  }
  let caracter = 'j';
  return (`Caracter escrito exitosamente por el puerto: ${caracter}`);
});

subscribePOSTEvent ("controlLucesLEDa", (data) => {
  let objeto = {fila: data.fila, intensidad: data.intensidad};
  if (objeto.fila === 2 && objeto.intensidad >= 1) {
    port.write ('o', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 'o';
    return (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }
  else {
    return (`LEDa apagado`);
  }
});

startServer ();