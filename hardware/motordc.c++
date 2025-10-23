const int relayPin1=3;
char HB=0;

void setup() {
  pinMode(relayPin1, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  //Relé
if (Serial.available()>0){
  HB=Serial.read();
  if (HB="r"){
    Serial.printl("ventilador prendida");
    digitalWrite(relayPin1, HIGH);
    delay(3000);
    digitalWrite(relayPin1, LOW);
    delay(3000);
        }
    }
}