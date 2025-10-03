import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";

subscribePOSTEvent ("register", (data) => {
  let leer = JSON.parse (fs.readFileSync ("data/registro + login.json", "utf-8"));
  let objeto = {email: data.email, password: data.password};
  
  leer.push (objeto);

  let UsuarioYaExiste = leer.find (leer => data.email === leer.email & data.password === leer.password);

  if (UsuarioYaExiste) {
    return {ok: false};
  };

  fs.writeFileSync ("data/registro + login.json", JSON.stringify (leer, null, "\n"), {encoding: "utf-8"});
  return {ok:true};
});

subscribePOSTEvent ("login", (data) => {

  let leer = JSON.parse (fs.readFileSync ("data/registro + login.json", "utf-8"));

  for (let i = 0; i < leer.length; i++ ) {
    
  let encontrar = leer.find (leer => data.email === leer [i].email & data.password === leer [i].password);
  
  if (encontrar) {
    return {ok: true};
  }
  else {
    return {ok: false};
  }

}
});

//Para los modos:

subscribeGETEvent ("obtenerModos", (data) => {
  let modos = JSON.parse(fs.readFileSync("data/modos.json", "utf-8"));

  if (data && typeof data.nombre === "string" && modos.find(modo => modo.nombre === data.nombre)) {
    return { ok: false, message: "El modo ya existe" };
  }

  modos.push({ nombre: data.nombre, configuracion: data.configuracion });

    fs.writeFileSync("data/modos.json", JSON.stringify(modos, null, 2), { encoding: "utf-8" });
    return { ok: true, message: "Modo creado exitosamente" };
  }
  else {
    return { ok: false, message: "Datos inválidos o incompletos" };
  }
});


subscribeGETEvent("nuevoModo", () => {
  let modos = JSON.parse(fs.readFileSync("data/modos.json", "utf-8"));
  return { ok: true, modos };
});

startServer ();
