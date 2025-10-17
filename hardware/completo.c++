const int H1=9;
const int H2= 10;
const int H3= 11;
const int relayPin1=3;
int L1a4= 4;
int L5a8= 5;

void setup()
{
  pinMode(relayPin1, OUTPUT);
  pinMode(H1,OUTPUT);
  pinMode(H2,OUTPUT);
  pinMode(H3,OUTPUT);
  pinMode(L1a4,OUTPUT);
  pinMode(L5a8,OUTPUT);

 }

void loop()
{
   //Relé
  digitalWrite(relayPin1, HIGH);
  //Puente h
  digitalWrite(H1,HIGH);
  digitalWrite(H2,LOW);
  analogWrite(H3,150);
  //Ambos
  delay(3000);
  //rele
  digitalWrite(relayPin1, LOW);
  //Puente h
  digitalWrite(H1,LOW);
  digitalWrite(H2,LOW);
  analogWrite(H3,0);
  //Ambos
  delay(3000);
  //leds
  digitalWrite(L1a4,HIGH);
  digitalWrite(L5a8,HIGH);
  delay(3000);
  digitalWrite(L1a4,LOW);
  digitalWrite(L5a8,LOW);
  delay(3000);
}