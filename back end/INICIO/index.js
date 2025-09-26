import fs from "fs";
import { subscribeGETEvent, subscribePOSTEvent, realTimeEvent, startServer } from "soquetic";

subscribePOSTEvent ("register", (data) => {
  let leer = JSON.parse (fs.readFileSync ("data/registro + login.json", "utf-8"));
  let objeto = {email: data.email, password: data.password};
  
  if (data.email & data.password !== leer) {
    leer.push (objeto);
  }
  else if (data.email & data.password === leer) {
    data.mensaje = 'Usuario ya está';
  }


  fs.writeFileSync ("data/registro + login.json", JSON.stringify (leer, null, "\n"), {encoding: "utf-8"});
})

subscribePOSTEvent ("login", (data) => {
  let leer = JSON.parse (fs.readFileSync ("data/registro + login.json", "utf-8"));
  let encontrar = leer.find (leer => data.email === leer.email & data.password === leer.password);
  
  if (encontrar) {
    return {ok: true};
  }
  else {
    return {ok: false};
  }

});
startServer ();
