# Documentation API : Envoyer des données ESP32 via Postman

Voici comment configurer Postman pour envoyer des relevés de capteurs à votre application Laravel.

## 1. Créer une nouvelle requête

*   Ouvrez Postman.
*   Cliquez sur **+** ou **New Request**.
*   Sélectionnez la méthode **POST**.
*   Entrez l'URL : `http://127.0.0.1:8000/api/esp32/readings`
    *   *Note : Si vous testez depuis un vrai ESP32, remplacez `127.0.0.1` par l'IP locale de votre PC (ex: `192.168.1.15`).*

## 2. Configurer les En-têtes (Headers)

Allez dans l'onglet **Headers** et ajoutez les clés suivantes :

| Key | Value |
| :--- | :--- |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

## 3. Configurer le Corps de la requête (Body)

Allez dans l'onglet **Body**, sélectionnez **raw**, et choisissez **JSON** dans la liste déroulante (à droite).

Collez le JSON suivant (en utilisant l'UUID de votre appareil) :

```json
{
    "device_uuid": "0996fd8b-a22d-4a70-bfb1-bf3712803e7f",
    "readings": [
        {
            "sensor_type": "temperature",
            "sensor_index": 0,
            "value": 42.5,
            "status": "warning",
            "recorded_at": "2024-03-24 14:30:00"
        },
        {
            "sensor_type": "vibration",
            "sensor_index": 0,
            "value": 0.12,
            "status": "normal",
            "recorded_at": "2024-03-24 14:30:00"
        }
    ]
}
```

## 4. Envoyer et Vérifier

*   Cliquez sur **Send**.
*   Vous devriez recevoir un statut **201 Created**.
*   Le corps de la réponse contiendra les données enregistrées.

## À propos des champs

*   `device_uuid` : L'identifiant unique de votre `MedicalDevice` (obligatoire).
*   `sensor_type` : Le type de capteur (doit correspondre à la colonne `type` dans la table `sensors`, ex: 'temperature', 'vibration', 'voltage').
*   `sensor_index` : (Optionnel, défaut 0) Si vous avez plusieurs capteurs du même type (ex: 2 températures), utilisez 0 pour le premier, 1 pour le second.
*   `status` : 'normal', 'warning', ou 'critical'.
