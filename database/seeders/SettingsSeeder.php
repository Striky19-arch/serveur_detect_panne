<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $settings = [
            'notification_email' => 'admin@example.com',
            'alert_template_critical_max' => "🛑 ALERTE CRITIQUE : {equipment}\n\nLe capteur {sensor} a détecté une valeur ANORMALE ÉLEVÉE.\n\nValeur : {value} {unit}\nSeuil Critique : {threshold}\nHeure : {time}\n\n⚠️ INTERVENTION REQUISE IMMÉDIATEMENT",
            'alert_template_critical_min' => "🛑 ALERTE CRITIQUE : {equipment}\n\nLe capteur {sensor} a détecté une valeur ANORMALE BASSE.\n\nValeur : {value} {unit}\nSeuil Critique : {threshold}\nHeure : {time}\n\n⚠️ INTERVENTION REQUISE IMMÉDIATEMENT",
            'alert_template_warning_max' => "⚠️ AVERTISSEMENT : {equipment}\n\nNiveau élevé détecté sur {sensor}.\n\nValeur : {value} {unit}\nSeuil Normal : {threshold}\nHeure : {time}\n\nMerci de vérifier l'équipement.",
            'alert_template_warning_min' => "⚠️ AVERTISSEMENT : {equipment}\n\nNiveau bas détecté sur {sensor}.\n\nValeur : {value} {unit}\nSeuil Normal : {threshold}\nHeure : {time}\n\nMerci de vérifier l'équipement.",
        ];

        foreach ($settings as $key => $value) {
            \App\Models\Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }
    }
}
