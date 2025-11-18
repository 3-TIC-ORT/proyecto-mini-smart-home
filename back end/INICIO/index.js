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
  let leer = JSON.parse (fs.readFileSync ("data/registro_login.json", "utf-8"));
  let usuario = data.nombre;
  let encontrar = leer.find (u => u.nombre === usuario);

  if (!encontrar) {
    return {};
  };

  return {
    nombre: encontrar.nombre,
    cumple: encontrar.cumple,
    sobre: encontrar.sobre
  };

});

subscribePOSTEvent ("actualizarUsuario", (data) => {
  let objeto = {nombre: data.nombre, cumple: data.cumple, sobre: data.sobre};
  return objeto;
});


//Comunicación front-back-hardware: usando Node SerialPort




let port = new SerialPort ({
  path: 'COM6',
  baudRate: 9600
});




let parser = port.pipe (new ReadlineParser ({delimiter: "\n"}));




//Código que ejecuta el modo con respecto a los electrodomésticos, le llega un objeto con la data del estado de los dispositivos de hardware y le escribe al puerto para que prenda o apague los mismos:
subscribePOSTEvent ("ejecutarModo", (data) => {
  let objeto = {
    persiana: data.persiana,
    ventilador: data.ventilador,
    lucesrojas: data.lucesrojas,
    lucesazules: data.lucesazules
  };




  if (objeto.persiana === 1) {
    port.write ('d', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 'd';
    console.log (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }




  else if (objeto.persiana === 0) {
    port.write ('a', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err,message);
      }
    });
    let caracter = 'a';
    console.log (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }




  else if (objeto.ventilador === 1) {
    port.write ('b', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 'r';
    console.log (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }




  else if (objeto.ventilador === 0) {
    port.write ('u', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 'm';
    console.log (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }




  else if (objeto.lucesrojas === 1) {
    port.write ('j', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 'j';
    console.log (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }




  else if (objeto.lucesrojas === 0) {
    port.write ('t', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 't';
    console.log (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }


  if (objeto.lucesazules === 0) {
    port.write ('q', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 'q';
    console.log (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }


  else if (objeto.lucesazules === 1) {
    port.write ('w', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 'w';
    console.log (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }


  else if (objeto.lucesazules === 2) {
    port.write ('e', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 'e';
    console.log (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }


  else if (objeto.lucesazules === 3) {
    port.write ('y', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 'y';
    console.log (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }


  else if (objeto.lucesazules === 4) {
    port.write ('p', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 'p';
    console.log (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }


  else if (objeto.lucesazules === 5) {
    port.write ('i', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 'i';
    console.log (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }


});




//Control de electrodomésticos:




//Control LEDs rojos (j significa prender, t significa apagar): Le escribo al puerto serie y lo recibe con serial.read
subscribePOSTEvent("controlLucesLEDr", (data) => {
  let objeto = { fila: data.fila, intensidad: data.intensidad };


  if (objeto.fila === 1 && objeto.intensidad === 1) {
    port.write('j', (err) => {
      if (err) {
        return console.error('Error al escribir en el puerto ', err.message);
      }
    });
    let caracter = 'j';
    return (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }
 
  else if (objeto.fila === 1 && objeto.intensidad === 0) {
    port.write('t', (err) => {
      if (err) {
        return console.error('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 't';
    return (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }
});








//Control LEDs azules (o significa prenderlas, sino se apagan):
subscribePOSTEvent ("controlLucesLEDa", (data) => {
  let objeto = {fila: data.fila, intensidad: data.intensidad};
 
  if (objeto.intensidad === 0) {
    port.write ('q', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 'q';
    return (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }


  if (objeto.intensidad === 1) {
    port.write ('w', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 'w';
    return (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }


  if (objeto.intensidad === 2) {
    port.write ('e', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 'e';
    return (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }


  if (objeto.intensidad === 3) {
    port.write ('y', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 'y';
    return (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }


  if (objeto.intensidad === 4) {
    port.write ('p', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 'p';
    return (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }


  if (objeto.intensidad === 5) {
    port.write ('i', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 'i';
    return (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }


});




//Control ventilador (r significa prendido, m significa apagado): Le escribo al puerto serie y lo recibe con serial.read
subscribePOSTEvent ("controlVentilador", (data) => {
  let objeto = {estado: data.estado};




  if (objeto.estado === 1) {
    port.write ('b', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 'r';
    return (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }




  else if (objeto.estado === 0) {
    port.write ('u', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 'm';
    return (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }




});




//Control persiana (d significa abajo, a significa arriba): Le escribo al puerto serie y lo recibe con serial.read
subscribePOSTEvent ("controlPersiana", (data) => {
  let objeto = {estado: data.estado};




  if (objeto.estado === 1) {
    port.write ('d', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
   });
   let caracter = 'd';
   return (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }




  else if (objeto.estado === 0) {
    port.write ('a', (err) => {
      if (err) {
        return console.error ('Error al escribir por el puerto: ', err.message);
      }
    });
    let caracter = 'a';
    return (`Caracter escrito exitosamente por el puerto: ${caracter}`);
  }


});


//realTimeEvent al front end: El arduino le envía data a la computadora y se encarga de convertirla en un número (en °C):
parser.on("data", (data) => {
  let texto = data.toString().trim();
  console.log("LLEGO:", JSON.stringify(texto));

  realTimeEvent("temperatura", { valor: texto });
});

realTimeEvent("estado", (data) => {

  let estadoPersiana = 0;
  let estadoVentilador = 0;
  let lucesRojas = 0;
  let lucesAzules = 0;
});



startServer ();

