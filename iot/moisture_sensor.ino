#include <WiFi.h>

#define soil_moisture_pin 4
#define LED_PIN 2

const char *ssid = "Ishaan";
const char *password = "12341234";

WiFiServer server(80);

IPAddress local_IP(192, 168, 21, 172);
IPAddress gateway(192, 168, 21, 1);
IPAddress subnet(255, 255, 255, 0);

void setup()
{

    pinMode(LED_PIN, OUTPUT);
    digitalWrite(LED_PIN, LOW);

    Serial.begin(9600);

    WiFi.config(local_IP, gateway, subnet);
    WiFi.begin(ssid, password);
    Serial.print("Connecting to WiFi...");

    while (WiFi.status() != WL_CONNECTED)
    {
        digitalWrite(LED_PIN, HIGH);
        delay(250);
        digitalWrite(LED_PIN, LOW);
        delay(250);

        Serial.print(".");
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

    server.begin();
}

void loop()
{

    WiFiClient client = server.available();

    if (client)
    {
        Serial.println("New Client.");
        digitalWrite(LED_PIN, HIGH);
        String currentLine = "";
        while (client.connected())
        {
            if (client.available())
            {
                char c = client.read();
                currentLine += c;

                if (c == '\n')
                {
                    client.println("HTTP/1.1 200 OK");
                    client.println("Content-type: application/json");
                    client.println("Access-Control-Allow-Origin: *");
                    client.println("Connection: close");
                    client.println();

                    int sensorValue = analogRead(soil_moisture_pin);
                    int moisturePercent = map(sensorValue, 0, 4095, 100, 0);
                    // if (moisturePercent < 0) moisturePercent = 0;
                    // if (moisturePercent > 100) moisturePercent = 100;
                    moisturePercent = constrain(moisturePercent, 0, 100);

                    client.print("{\"moisture\": ");
                    client.print(moisturePercent);
                    client.println("}");

                    // Serial.print("Soil Moisture: ");
                    // Serial.print(moisturePercent);
                    // Serial.println("%");

                    // Serial.println(sensorValue);
                    break;
                }
            }
        }
        delay(1);
        client.stop();
        digitalWrite(LED_PIN, LOW);
        Serial.println("Client Disconnected.");
    }
}