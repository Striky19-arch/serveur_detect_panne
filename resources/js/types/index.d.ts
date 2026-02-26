import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface Notification {
    id: string;
    type: string;
    data: {
        title: string;
        message: string;
        severity: 'critical' | 'warning' | 'normal';
        alert_id?: number;
    };
    created_at: string;
    read_at: string | null;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    locale: string;
    notifications: Notification[];
    unreadNotificationCount: number;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface MedicalDevice {
    id: number;
    name: string;
    model: string;
    manufacturer: string;
    serial_number: string;
    installation_date: string;
    location: string;
    status: 'active' | 'inactive' | 'maintenance' | 'faulty';
    description?: string;
    esp32_device_id?: string;
    sensors?: Sensor[];
    last_sync_at?: string;
    predictions?: Prediction[];
    alerts?: Alert[];
    created_at: string;
    updated_at: string;
}

export interface DashboardDevice {
    id: number;
    name: string;
    model: string;
    location: string;
    status: 'active' | 'inactive' | 'maintenance' | 'faulty';
    serial_number: string;
    esp32_device_id?: string;
    sensors_count: number;
    last_sync_at?: string;
    is_connected: boolean;
}

export interface Sensor {
    id: number;
    medical_device_id: number;
    name: string;
    type: string;
    unit: string;
    min_normal_value?: number;
    max_normal_value?: number;
    critical_min_value?: number;
    critical_max_value?: number;
    is_active: boolean;
    pin_number: number;
    polling_interval: number;
    readings?: SensorReading[];
    created_at: string;
    updated_at: string;
}

export interface SensorReading {
    id: number;
    sensor_id: number;
    value: number;
    status: 'normal' | 'warning' | 'critical';
    recorded_at: string;
    created_at: string;
    updated_at: string;
}

export interface Alert {
    id: number;
    medical_device_id: number;
    sensor_id?: number;
    prediction_id?: number;
    type: string;
    severity: 'info' | 'warning' | 'critical';
    title: string;
    message: string;
    is_read: boolean;
    acknowledged_by?: number;
    acknowledged_at?: string;
    created_at: string;
    updated_at: string;
}

export interface Prediction {
    id: number;
    medical_device_id: number;
    provider_id: number;
    prediction_result: string; // JSON string in DB usually, but maybe parsed here? Use 'any' if processed.
    failure_probability: number;
    risk_level: 'low' | 'medium' | 'high' | 'critical';
    predicted_failure_date?: string;
    recommendations?: any;
    confidence_score: number;
    provider?: PredictionProvider;
    medicalDevice?: MedicalDevice;
    created_at: string;
}

export interface PredictionProvider {
    id: number;
    name: string;
    type: 'cloud_api' | 'local_llm' | 'python_model';
    provider: string; // 'openrouter', 'huggingface', etc.
    is_active: boolean;
    is_default: boolean;
    priority: number;
    config?: Record<string, any>;
    last_tested_at?: string;
    last_test_status?: 'success' | 'failed' | null;
    last_test_response_time?: number;
    created_at: string;
    updated_at: string;
}
