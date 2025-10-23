//Leds potenciometro y boton
int L1a4 = 4; 
int L5a8 = 5;    
int BT = 6;  
int ultBT = 1;   
int elr = 0; 
int PT = A1;      
int VPT;          
char HB = 0;

void setup() {
  pinMode(L1a4, OUTPUT);
  pinMode(L5a8, OUTPUT);
  pinMode(BT, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
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
}
