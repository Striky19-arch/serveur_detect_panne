<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMedicalDeviceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|unique:medical_devices',
            'model' => 'required|string',
            'manufacturer' => 'required|string',
            'serial_number' => 'required|string|unique:medical_devices',
            'installation_date' => 'required|date',
            'location' => 'required|string',
            'status' => 'required|in:active,inactive,maintenance,faulty',
            'description' => 'nullable|string',
            'esp32_device_id' => 'nullable|string|unique:medical_devices',
            'sensors' => 'nullable|array',
            'sensors.*.name' => 'required|string',
            'sensors.*.type' => 'required|string',
            'sensors.*.unit' => 'required|string',
            'sensors.*.pin_number' => 'nullable|integer',
            'sensors.*.min_normal_value' => 'nullable|numeric',
            'sensors.*.max_normal_value' => 'nullable|numeric',
        ];
    }
}
