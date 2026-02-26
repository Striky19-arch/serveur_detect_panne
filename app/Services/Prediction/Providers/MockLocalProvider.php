<?php

namespace App\Services\Prediction\Providers;

use App\Models\MedicalDevice;
use App\Services\Prediction\PredictionProviderInterface;
use Carbon\Carbon;

class MockLocalProvider implements PredictionProviderInterface
{
    public function predict(MedicalDevice $device, Carbon $start, Carbon $end, array $config): array
    {
        // Simulate analysis based on recent sensor readings (mock usage)
        $readingsCount = $device->sensors->sum(fn ($s) => $s->readings()->whereBetween('recorded_at', [$start, $end])->count());

        // Mock logic: randomly determine risk based on whether there were warnings (if we had access to that logic here)
        // For now, purely random deterministic based on device ID to keep it stable-ish
        srand($device->id + $start->timestamp);
        $prob = rand(1, 100);

        $riskLevel = match (true) {
            $prob > 80 => 'high',
            $prob > 50 => 'medium',
            default => 'low',
        };

        $sensorSummary = $device->sensors->map(fn ($s) => $s->name)->implode(', ');

        $highRiskResult = "L'analyse de {$device->name} ({$device->model}) durant la période du {$start->toDateTimeString()} au {$end->toDateTimeString()} révèle des tendances préoccupantes sur plusieurs lectures de capteurs ({$sensorSummary}).\n\n"
            ."Plusieurs capteurs affichent des valeurs qui s'écartent significativement de leurs plages de fonctionnement normales établies. Les données de tendance récentes montrent un schéma de dégradation progressive, avec des lectures se rapprochant régulièrement des seuils critiques. Des violations de seuils ont été détectées, indiquant que l'équipement fonctionne dans des conditions anormales qui pourraient accélérer l'usure des composants.\n\n"
            ."Sur la base des schémas de données observés et de l'analyse statistique, la probabilité de panne est évaluée à {$prob}%. Ce niveau de risque élevé reflète la combinaison de lectures hors plage et de la tendance à la détérioration observée sur la période d'analyse. Les données historiques pour des configurations d'équipements similaires suggèrent que ces schémas précèdent souvent des pannes mécaniques dans les 48 à 72 heures si aucune action n'est entreprise.\n\n"
            ."Une intervention de maintenance immédiate est fortement recommandée. Retarder l'action pourrait entraîner une indisponibilité de l'équipement, compromettre la sécurité des patients, ou engendrer des réparations plus coûteuses. La priorité devrait être donnée à l'inspection des composants surveillés par les capteurs montrant la plus grande déviation par rapport aux valeurs normales.";

        $normalResult = "L'analyse de {$device->name} ({$device->model}) durant la période du {$start->toDateTimeString()} au {$end->toDateTimeString()} indique que l'équipement fonctionne dans des paramètres acceptables sur l'ensemble des capteurs surveillés ({$sensorSummary}).\n\n"
            ."Toutes les lectures de capteurs sont dans leurs plages de fonctionnement normales configurées, et aucune violation de seuil n'a été détectée pendant la période d'analyse. Les données de tendance montrent des lectures stables sans dérive ni oscillation significative, suggérant des performances d'équipement cohérentes et fiables.\n\n"
            ."La probabilité de panne est évaluée à {$prob}%, reflétant le faible risque associé à des conditions de fonctionnement normales. Bien qu'aucune préoccupation immédiate ne soit identifiée, la maintenance préventive de routine devrait se poursuivre selon le calendrier établi pour garantir la fiabilité à long terme.\n\n"
            ."Il est recommandé de continuer à surveiller les données des capteurs pour toute tendance émergente et de vérifier la précision de l'étalonnage lors de la prochaine fenêtre de maintenance programmée. Aucune action urgente n'est requise pour le moment.";

        return [
            'prediction_result' => $riskLevel === 'high' ? $highRiskResult : $normalResult,
            'failure_probability' => $prob,
            'risk_level' => $riskLevel,
            'recommendations' => $riskLevel === 'high' ? [
                "Planifier une inspection immédiate de {$device->name} — les lectures des capteurs indiquent une dégradation progressive nécessitant une évaluation diagnostique sur site dans les 24 prochaines heures pour prévenir une panne potentielle.",
                "Vérifier l'étalonnage et l'état physique de tous les capteurs ({$sensorSummary}) — les lectures hors plage peuvent indiquer soit des problèmes réels de l'équipement, soit une dérive des capteurs nécessitant un recalibrage.",
                "Préparer un plan de contingence pour l'indisponibilité de l'équipement — compte tenu de la probabilité de panne élevée, s'assurer que l'équipement de secours est disponible et que le personnel est informé des procédures de repli pour maintenir la continuité des soins.",
            ] : [
                "Poursuivre la maintenance préventive de routine selon le calendrier établi — les données actuelles des capteurs confirment que l'équipement fonctionne selon les spécifications et aucune maintenance accélérée n'est nécessaire.",
                'Surveiller les données de tendance au cours des 7 prochains jours pour tout schéma émergent — bien que les lectures actuelles soient normales, la détection précoce de changements subtils peut prévenir de futurs problèmes.',
                "Vérifier l'étalonnage des capteurs lors de la prochaine fenêtre de maintenance programmée pour garantir la précision continue des mesures et la détection fiable des anomalies.",
            ],
            'confidence_score' => rand(85, 99),
        ];
    }

    public function test(array $config): bool
    {
        return true;
    }
}
