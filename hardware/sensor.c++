#include "DHT.h"

#define DHTPIN 8
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

int humedad = 0;
int temperatura = 0;

void setup() {
  Serial.begin(9600);
  dht.begin(); // Inicia el sensor
}

void loop() {

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