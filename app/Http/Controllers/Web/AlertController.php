<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Alert;
use Inertia\Inertia;

class AlertController extends Controller
{
    public function index()
    {
        $alerts = Alert::query()
            ->latest()
            ->paginate(20);

        return Inertia::render('alerts/index', [
            'alerts' => $alerts,
            'filters' => request()->all(),
        ]);
    }
}
