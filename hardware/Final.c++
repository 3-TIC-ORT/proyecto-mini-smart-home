//General
char HB=0; //H= Hardware y B= Backend
//Motorreductor
const int H1=9;   //IN3
const int H2= 10; //IN4
const int H3= 11; //enable
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
  //Leds potenciometro y boton
  //leds rojos
  int bt = digitalRead(BT);
  if (Serial.available() > 0) {
    HB = Serial.read();
  }
  if (bt == LOW && ultBT == HIGH) {
    if (elr == 0) {
      elr = 1;
      Serial.println("Leds rojos prendidos");
    } else {
      elr = 0;
      Serial.println("Leds rojos apagados");
    }
  }
  ultBT=bt;
  //prender
  if (elr == 1 || HB == 'j') {
    digitalWrite(L1a4, HIGH);
  } else {
    digitalWrite(L1a4, LOW);
  }
  //leds azules
  VPT = analogRead(PT);
  int br = VPT / 4;
  analogWrite(L5a8, br);

  if (HB == 'o') {
    Serial.println("Leds azules prendidos");
    analogWrite(L5a8, br);
  }

//Motor DC
if (Serial.available()>0){
  HB=Serial.read();
  if (HB=='r'){
    Serial.println("ventilador prendida");
    digitalWrite(relayPin1, HIGH);
        }
  if (HB=='m'){
    Serial.println("ventilador apagado");
    digitalWrite(relayPin1,LOW);
      }
    }


//Motorreductor
if (Serial.available()>0){
  HB=Serial.read();
    if (HB=='d'){
      Serial.println("Persiana prendida");
      digitalWrite(H1,HIGH);
      digitalWrite(H2,LOW);
      analogWrite(H3,150);
      delay(30000); //30 segundos
      digitalWrite(H1,LOW);
      digitalWrite(H2,LOW);
      analogWrite(H3,0);
    }
    if(HB=='a'){
      Serial.println("Persiana prendida (nc si arriba o abajo)");
      digitalWrite(H1,LOW);
      digitalWrite(H2,HIGH);
      analogWrite(H3,150);
      delay(30000); //30 segundos
      digitalWrite(H1,LOW);
      digitalWrite(H2,LOW);
      analogWrite(H3,0);
    }
  }

//sensor
humedad = (int)dht.readHumidity();
  temperatura = (int)dht.readTemperature();

  Serial.print("Humedad: ");
  Serial.print(humedad);
  Serial.println(" %");

  Serial.print("Temperatura: ");
  Serial.print(temperatura);
  Serial.println(" °C");
 delay(900000); //15 minutos= 900.000 segundos
}