<?php

namespace App\Services\Prediction;

use App\Models\MedicalDevice;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class PredictionPromptBuilder
{
    public function build(MedicalDevice $device, Carbon $start, Carbon $end): string
    {
        Log::info("Building prediction prompt for device: {$device->name} ({$device->id}) from {$start} to {$end}");

        $sensorData = $device->sensors->map(function ($sensor) use ($start, $end) {
            $readings = $sensor->readings()
                ->whereBetween('recorded_at', [$start, $end]);

            $readingsTrend = clone $readings;
            $lastReadings = $readingsTrend->latest('recorded_at')->take(5)->get()->map(fn ($r) => $r->value)->toArray();

            $violationCount = $readings->where(function ($query) use ($sensor) {
                if ($sensor->min_normal_value && $sensor->max_normal_value) {
                    $query->where('value', '<', $sensor->min_normal_value)
                        ->orWhere('value', '>', $sensor->max_normal_value);
                }
            })->count();

            return [
                'name' => $sensor->name,
                'type' => $sensor->type,
                'range_min' => $sensor->min_normal_value,
                'range_max' => $sensor->max_normal_value,
                'stats' => [
                    'avg' => round($readings->avg('value'), 2),
                    'min' => $readings->min('value'),
                    'max' => $readings->max('value'),
                    'count' => $readings->count(),
                    'last_value' => $readings->latest('recorded_at')->first()?->value,
                    'recent_trend' => array_reverse($lastReadings),
                    'threshold_violations' => $violationCount,
                ],
            ];
        });

        // Basic info
        $prompt = "Tu es un expert en maintenance prédictive pour les équipements médicaux. Réponds TOUJOURS en français.\n\n";
        $prompt .= "Équipement : {$device->name} ({$device->model})\n";
        $prompt .= "Période d'analyse : {$start->toDateTimeString()} à {$end->toDateTimeString()}\n\n";

        $prompt .= "Résumé des données capteurs :\n";
        $prompt .= json_encode($sensorData, JSON_PRETTY_PRINT)."\n\n";

        $prompt .= "Tâche : Analyse ces données en profondeur et fournis :\n";
        $prompt .= "1. Probabilité de panne (0-100%)\n";
        $prompt .= "2. Niveau de risque (low/medium/high/critical)\n";
        $prompt .= "3. Au moins 3 recommandations détaillées et actionnables en français, expliquant quelles actions de maintenance entreprendre et pourquoi\n";
        $prompt .= "4. Score de confiance\n";
        $prompt .= "5. Une analyse prédictive détaillée EN FRANÇAIS (au moins 3-4 paragraphes) qui explique :\n";
        $prompt .= "   - L'état actuel de chaque capteur et si ses valeurs sont dans la plage de fonctionnement normale\n";
        $prompt .= "   - Les anomalies, tendances ou violations de seuils détectées et leurs causes potentielles\n";
        $prompt .= "   - Le raisonnement derrière la probabilité de panne et l'évaluation du niveau de risque\n";
        $prompt .= "   - L'urgence des actions de maintenance et les conséquences potentielles si rien n'est fait\n\n";

        $prompt .= "RÈGLES CRITIQUES :\n";
        $prompt .= "- Si 'threshold_violations' > 0, le niveau de risque DOIT être au minimum 'medium'.\n";
        $prompt .= "- Si 'last_value' est en dehors de range_min/range_max, le niveau de risque DOIT être 'high' ou 'critical'.\n";
        $prompt .= "- Si la 'trend' montre une augmentation/diminution rapide vers les limites, augmenter la probabilité.\n\n";

        $prompt .= "Retourne UNIQUEMENT du JSON valide avec cette structure (les valeurs textuelles DOIVENT être en français) :\n";
        $prompt .= "{\n";
        $prompt .= '  "failure_probability": number,'."\n";
        $prompt .= '  "risk_level": "low|medium|high|critical",'."\n";
        $prompt .= '  "recommendations": ["recommandation détaillée 1 en français", "recommandation détaillée 2 en français", "recommandation détaillée 3 en français"],'."\n";
        $prompt .= '  "confidence_score": number,'."\n";
        $prompt .= '  "prediction_result": "Une analyse détaillée en français de plusieurs paragraphes (minimum 150 mots) expliquant les lectures des capteurs, les anomalies détectées, le raisonnement de l\'évaluation des risques et l\'urgence de la maintenance"'."\n";
        $prompt .= '}';

        Log::debug("Generated Prompt:\n".$prompt);

        return $prompt;
    }
}
