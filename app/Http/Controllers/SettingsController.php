<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function edit()
    {
        return Inertia::render('settings/notifications', [
            'settings' => Setting::all()->pluck('value', 'key'),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'notification_email' => 'required|email',
            'alert_template_critical_max' => 'required|string',
            'alert_template_critical_min' => 'required|string',
            'alert_template_warning_max' => 'required|string',
            'alert_template_warning_min' => 'required|string',
        ]);

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return back()->with('success', 'Paramètres mis à jour avec succès.');
    }

    public function test(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'message' => 'required|string',
            'subject' => 'required|string',
        ]);

        try {
            \Illuminate\Support\Facades\Notification::route('mail', $request->email)
                ->notify(new \App\Notifications\TestNotification($request->subject, $request->message));

            return back()->with('success', 'Notification de test envoyée.');
        } catch (\Exception $e) {
            return back()->with('error', 'Erreur lors de l\'envoi : '.$e->getMessage());
        }
    }
}
