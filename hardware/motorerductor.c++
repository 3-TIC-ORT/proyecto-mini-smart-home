const int H1=9;
const int H2=10;
const int H3=11;
char HB=0;

void setup() {
  pinMode(H1,OUTPUT);
  pinMode(H2,OUTPUT);
  pinMode(H3,OUTPUT);
  Serial.begin(9600);
}

void loop() {
if (Serial.available()>0){
  HB=Serial.read();
    if (HB='d'){
      Serial.printl("Persiana prendida");
      digitalWrite(H1,HIGH);
      digitalWrite(H2,LOW);
      analogWrite(H3,150);
      delay(30000); //30 segundos
      digitalWrite(H1,LOW);
      digitalWrite(H2,LOW);
      analogWrite(H3,0);
    }
    if(HB=='a'){
      Serial.printl("Persiana prendida (nc si arriba o abajo)");
      digitalWrite(H1,LOW);
      digitalWrite(H2,HIGH);
      analogWrite(H3,150);
      delay(30000); //30 segundos
      digitalWrite(H1,LOW);
      digitalWrite(H2,LOW);
      analogWrite(H3,0);
    }
  }
}