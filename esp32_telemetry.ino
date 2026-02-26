#include <WiFi.h>
#include <HTTPClient.h>
#include <time.h>

// --- CONFIGURATION ---
const char* ssid = "VOTRE_WIFI_SSID";
const char* password = "VOTRE_WIFI_PWD";
// Remplacez par l'IP de votre PC (ex: 192.168.1.x), pas localhost !
const char* serverUrl = "http://192.168.1.15:8000/api/esp32/readings"; 

// --- DÉFINITION DES CAPTEURS ---
// Stockage des capteurs connectés à cet ESP32
struct Sensor {
  int id;       // ID du capteur dans la base MySQL
  int pin;      // Pin GPIO de l'ESP32
  float minVal; // Pour simulation
  float maxVal; // Pour simulation
};

// Liste des capteurs (À ADAPTER SELON VOS BRANCHEMENTS)
Sensor sensors[] = {
  {1, 34, 20.0, 30.0}, // Ex: ID 1 (Température), Pin 34
  {2, 35, 100.0, 240.0}, // Ex: ID 2 (Voltage), Pin 35
  {3, 32, 0.0, 10.0}   // Ex: ID 3 (Vibration), Pin 32
};
const int sensorsCount = sizeof(sensors) / sizeof(sensors[0]);

// ---------------------

const char* ntpServer = "pool.ntp.org";
const long  gmtOffset_sec = 3600; // Paris (UTC+1)
const int   daylightOffset_sec = 3600; // Heure d'été

unsigned long lastTime = 0;
unsigned long timerDelay = 5000; // Envoi toutes les 5 secondes

void setup() {
  Serial.begin(115200);

  // Connexion WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connexion au WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnecté au WiFi ! IP: " + WiFi.localIP().toString());

  // Configurer l'heure
  configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
}

void loop() {
  if ((millis() - lastTime) > timerDelay) {
    if(WiFi.status() == WL_CONNECTED){
      
      // Récupération de l'heure
      struct tm timeinfo;
      if(!getLocalTime(&timeinfo)){
        Serial.println("Erreur de récupération d'heure");
        return;
      }
      char timeString[30];
      strftime(timeString, sizeof(timeString), "%Y-%m-%dT%H:%M:%S", &timeinfo);

      // Construction du JSON (Tableau de lectures)
      String json = "{\"readings\": [";
      
      for(int i = 0; i < sensorsCount; i++) {
        // 1. Simulation de lecture (remplacer par analogRead(sensors[i].pin))
        // float raw = analogRead(sensors[i].pin);
        float value = sensors[i].minVal + ((rand() % 100) / 100.0) * (sensors[i].maxVal - sensors[i].minVal);
        
        // 2. Définition du Statut simple (À adapter selon type capteur)
        String status = "normal";
        if (value > sensors[i].maxVal * 0.9) status = "warning";
        
        json += "{";
        json += "\"sensor_id\": " + String(sensors[i].id) + ",";
        json += "\"value\": " + String(value) + ",";
        json += "\"status\": \"" + status + "\",";
        json += "\"recorded_at\": \"" + String(timeString) + "\"";
        json += "}";

        if (i < sensorsCount - 1) json += ",";
      }

      json += "]}";

      // Envoi de la requête
      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");
      http.addHeader("Accept", "application/json"); 
      
      Serial.println("Envoi Batch : " + json);
      int httpResponseCode = http.POST(json);

      if (httpResponseCode > 0) {
        String response = http.getString();
        Serial.println("Réponse " + String(httpResponseCode) + ": " + response);
      } else {
        Serial.print("Erreur d'envoi: ");
        Serial.println(httpResponseCode);
      }
      http.end();
      
    } else {
      Serial.println("WiFi déconnecté");
    }
    lastTime = millis();
  }
}
