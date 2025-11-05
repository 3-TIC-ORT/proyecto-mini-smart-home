//General
char HB=0; //H= Hardware y B= Backend
//Motorreductor
const int H1=9;   //IN3
const int H2=10;  //IN4
const int H3=11;  //enable
//Relay
const int relayPin1=3;
//Leds potenciometro y boton
int L1a4 = 4; //Rojos
int L5a8 = 5; //Azzules
int BT = 6;  
int ultBT = 1;  
int elr = 0;
int PT = A1;      
int VPT;
//sensor
#include "DHT.h"
#define DHTPIN 8
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);
int humedad = 0;
int temperatura = 0;
unsigned long tiempoAnterior = 0;
unsigned long intervalo = 900000; //15 minutos


void setup() {
  //Leds potenciometro y boton
  pinMode(L1a4, OUTPUT);
  pinMode(L5a8, OUTPUT);
  pinMode(BT, INPUT_PULLUP);
  //general
  Serial.begin(9600);
  //Motor DC
  pinMode(relayPin1, OUTPUT);
  //Motorreductor
  pinMode(H1,OUTPUT);
  pinMode(H2,OUTPUT);
  pinMode(H3,OUTPUT);
  //sensor
  dht.begin();
}


void loop() {
  //leo si llega algo por consola
  if (Serial.available() > 0) {
    HB = Serial.read();
  }


  //Leds rojos
  int bt = digitalRead(BT);


  if (bt == LOW && ultBT == HIGH) {
    if (elr == 0) {
      elr = 1;
      Serial.println("Leds rojos prendidos por boton");
    } else {
      elr = 0;
      Serial.println("Leds rojos apagados por boton");
    }
  }
  ultBT = bt;


  if (HB == 'j') {
    elr = 1;
    Serial.println("Leds rojos prendidos por consola");
  }
  if (HB == 't') {
    elr = 0;
    Serial.println("Leds rojos apagados por consola");
  }


  if (elr == 1) {
    digitalWrite(L1a4, HIGH);
  } else {
    digitalWrite(L1a4, LOW);
  }


  //Leds azules
  VPT = analogRead(PT);
  int br = VPT / 4;
  analogWrite(L5a8, br);


  if (HB == 'o') {
    Serial.println("Leds azules prendidos");
    analogWrite(L5a8, br);
  }


  //Motor DC
  if (HB == 'r'){
    Serial.println("ventilador prendida");
    digitalWrite(relayPin1, HIGH);
  }
  if (HB == 'm'){
    Serial.println("ventilador apagado");
    digitalWrite(relayPin1,LOW);
  }


  //Motorreductor
  if (HB == 'd'){
    Serial.println("Persiana bajando");
    digitalWrite(H1,HIGH);
    digitalWrite(H2,LOW);
    analogWrite(H3,150);
    delay(30000);
    digitalWrite(H1,LOW);
    digitalWrite(H2,LOW);
    analogWrite(H3,0);
  }
  if (HB == 'a'){
    Serial.println("Persiana subiendo");
    digitalWrite(H1,LOW);
    digitalWrite(H2,HIGH);
    analogWrite(H3,200);
    delay(30000);
    digitalWrite(H1,LOW);
    digitalWrite(H2,LOW);
    analogWrite(H3,0);
  }


  //Sensor cada 15 minutos
  unsigned long tiempoActual = millis();
  if (tiempoActual - tiempoAnterior >= intervalo) {
    tiempoAnterior = tiempoActual;


    humedad = (int)dht.readHumidity();
    temperatura = (int)dht.readTemperature();


    Serial.print("Humedad: ");
    Serial.print(humedad);
    Serial.println(" %");


    Serial.print("Temperatura: ");
    Serial.print(temperatura);
    Serial.println(" °C");
  }
}


