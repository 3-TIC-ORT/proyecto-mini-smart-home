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
  hola=Serial.read();
    if (hola="d"){
      digitalWrite(H1,HIGH);
      digitalWrite(H2,LOW);
      analogWrite(H3,150);
      delay(3000);
      digitalWrite(H1,LOW);
      digitalWrite(H2,LOW);
      analogWrite(H3,0);
      delay(3000);
    }
  }
}