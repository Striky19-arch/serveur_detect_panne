<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use Illuminate\Http\Request;

class AlertController extends Controller
{
    public function index()
    {
        $alerts = Alert::query()
            ->when(request('status'), function ($query, $status) {
                if ($status === 'unread') {
                    $query->where('is_read', false);
                }
            })
            ->when(request('severity'), function ($query, $severity) {
                $query->where('severity', $severity);
            })
            ->with(['device'])
            ->latest()
            ->paginate(20);

        return response()->json($alerts);
    }

    public function markAsRead($id)
    {
        $alert = Alert::findOrFail($id);
        $alert->update(['is_read' => true]);

        return response()->json($alert);
    }

    public function acknowledge(Request $request, $id)
    {
        $alert = Alert::findOrFail($id);

        // Assume auth user is acknowledging
        $userId = $request->user() ? $request->user()->id : null;

        $alert->update([
            'is_read' => true,
            'acknowledged_at' => now(),
            'acknowledged_by' => $userId,
        ]);

        return response()->json($alert);
    }

    public function dismiss($id)
    {
        $alert = Alert::findOrFail($id);
        // Maybe soft delete or just mark read? For now delete.
        $alert->delete();

        return response()->json(null, 204);
    }
}
