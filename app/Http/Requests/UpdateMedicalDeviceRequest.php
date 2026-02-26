<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMedicalDeviceRequest extends FormRequest
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
        $id = $this->route('medical_device');

        return [
            'name' => 'sometimes|string|unique:medical_devices,name,'.$id->id,
            'model' => 'sometimes|string',
            'manufacturer' => 'sometimes|string',
            'serial_number' => 'sometimes|string|unique:medical_devices,serial_number,'.$id->id,
            'installation_date' => 'sometimes|date',
            'location' => 'sometimes|string',
            'status' => 'sometimes|in:active,inactive,maintenance,faulty',
            'description' => 'nullable|string',
            'esp32_device_id' => 'nullable|string|unique:medical_devices,esp32_device_id,'.$id->id,
            'sensors' => 'nullable|array',
            'sensors.*.id' => 'nullable|integer|exists:sensors,id',
            'sensors.*.name' => 'required|string',
            'sensors.*.type' => 'required|string',
            'sensors.*.unit' => 'required|string',
            'sensors.*.pin_number' => 'nullable|integer',
            'sensors.*.min_normal_value' => 'nullable|numeric',
            'sensors.*.max_normal_value' => 'nullable|numeric',
        ];
    }
}
