// C++ code
int L1a4= 4;
int L5a8= 5;
int BT=digitalRead(6);
char HB=0;

void setup()
{
  pinMode(L1a4,OUTPUT);
  pinMode(L5a8,OUTPUT);
  Serial.begin(9600);
}

void loop()
{
  if (Serial.available()>0|| BT==LOW){
  HB=Serial.read();
    if (HB="j"){
      //Leds arriba
      Serial.printl("Leds azules prendidos");
     digitalWrite(L1a4,HIGH);
    }
  }
      //Leds abajo
  if (Serial.available()>0 || ){
    if (HB="o"){
      Serial.printl("Leds rojos prendidos");
     digitalWrite(L5a8,HIGH);
     delay(3000);
    }
  }
}