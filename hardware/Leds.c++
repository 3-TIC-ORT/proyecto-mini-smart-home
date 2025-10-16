// C++ code
int L1a4= 4;
int L5a8= 5;

void setup()
{
  pinMode(L1a4,OUTPUT);
  pinMode(L5a8,OUTPUT);
}

void loop()
{
  digitalWrite(L1a4,HIGH);
  digitalWrite(L5a8,HIGH);
  delay(3000);
  digitalWrite(L1a4,LOW);
  digitalWrite(L5a8,LOW);
  delay(3000);
}