const int MotorDC=3;

void setup() {
  pinMode(MotorDC, OUTPUT);
}

void loop() {
  digitalWrite(MotorDC, LOW);
  delay(3000);
  digitalWrite(MotorDC, HIGH);
  delay(1000);
}
