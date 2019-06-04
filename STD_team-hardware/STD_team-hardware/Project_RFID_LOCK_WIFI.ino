#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <Wire.h> 
#include <LiquidCrystal_I2C.h>



#define SS_PIN 2  // D4
#define RST_PIN 0 // D3

// Create MFRC522 instance
MFRC522 mfrc522(SS_PIN, RST_PIN);

// Create LiquidCrystal_I2C instance
LiquidCrystal_I2C lcd(0x3F, 20, 4);

// Declare an object of the class HTTPClient
HTTPClient http; 

// WiFi name and password
String _ssid = "HOME24";
String _password = "14241424";

// getLinks
String _getLink1 = "http://dry-wildwood-48050.herokuapp.com/std/auth";
String _getLink2 = "http://dry-wildwood-48050.herokuapp.com/std/exit";


void setup() {
  // initializing the LCD
  lcd.init(); 

  // Enable or Turn On the backlight 
  lcd.backlight();

  // Start Print text to Line 1
  lcd.setCursor(0,0);
  lcd.print("Waiting Card....");;

  // Initiate rele and button
  pinMode(D0, OUTPUT);  
  digitalWrite(D0, HIGH);
  pinMode(D8, INPUT);

  // Initiate a serial communication
  Serial.begin(115200);
  Serial.println("Waiting...");

  // Initiate  SPI bus
  SPI.begin();

  // Initiate MFRC522
  mfrc522.PCD_Init();

  // Initiate WiFi
  Wifiinit(); 
}


void loop() {
  // Initiate Button function
  Button();
  // Look for new cards
  if ( ! mfrc522.PICC_IsNewCardPresent()) 
  {
    return;
  }
  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) 
  {
    return;
  }
  //Show UID on serial monitor
  unsigned long uidDec, uidDecTemp;
  for(byte i = 0; i < mfrc522.uid.size; i++) {
      uidDecTemp = mfrc522.uid.uidByte[i];
      uidDec = uidDec * 256 +uidDecTemp; 
    }  
  Serial.println(uidDec);

  // If wifi connected do Metod(POST)      
     // _getLink1 "/std/auth" Methods("POST")
     http.begin(_getLink1);       
     int httpCode = http.POST("{\"card_key\": " + String(uidDec) + "}");
     Serial.println(httpCode);
     
     // End http request 
     http.end();
     
     // If status 200 open lock    
     if(httpCode == 200) {
        lcd.clear();
        lcd.setCursor(1,0);
        lcd.print("Access Granted");
        delay(1000);
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("Waiting Card....");
        Serial.println("Access Granted");
        Rele();
      
    }

    // If status 403 show you are block
    if(httpCode == 403) {
        Serial.println("User is blocked");
        lcd.clear();
        lcd.setCursor(1,0);
        lcd.print("Access Denied");
        delay(1000);
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("Waiting Card....");
        
    } 
     
    // If status 404 show you are not found
    if(httpCode == 404) {
        Serial.println("User is not found");
        lcd.clear();
        lcd.setCursor(1,0);
        lcd.print("Access Denied");
        delay(1000);
        lcd.clear();
        lcd.setCursor(0,0);
        lcd.print("Waiting Card....");
    }

  // If wifi not connected, use one hard card_key
  if(WiFi.status()!= WL_CONNECTED) {
     lcd.setCursor(6,0);
      lcd.print("WiFi not");
      lcd.setCursor(6,0);
      lcd.print("connected");
      lcd.clear();
    if(uidDec == 2251334587) {
      Serial.println(" Access Granted ");
      lcd.clear();
      lcd.setCursor(1,0);
      lcd.print("Access Granted");
      Rele();
      delay(1000);
      lcd.clear();
      lcd.setCursor(0,0);
      lcd.print("Waiting Card....");     
    }
  }  
}


// Wifi connecting
void Wifiinit() {
  WiFi.mode(WIFI_STA);
  byte tries = 11;
  WiFi.begin(_ssid.c_str(), _password.c_str());
  while(tries-- && WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(1000);
  
  }
  // If wifi not connected 
  if(WiFi.status() != WL_CONNECTED) {
    Serial.println("");
    Serial.println("WiFi not connected");
  }
  // If wifi connected
  else {
     Serial.println("");
     Serial.println("Wifi connected");
     Serial.println("IP address: ");
     Serial.println(WiFi.localIP()); 
  }
}


//function for button
void Button() {                          
 if(digitalRead(D8)) { 
   // _getLink2 "/std/exit" Methods("POST")
   http.begin(_getLink2);
   int httpCode = http.POST("");
   
   // end http request
   http.end();
   Serial.println(httpCode);
   Serial.println(" Access Granted ");
   
   // Switching rele
   Rele();
 }  
}
void Rele() {
   digitalWrite(D0, LOW);
   delay(1000);
   digitalWrite(D0, HIGH);
}


