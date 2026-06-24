<?php

namespace Database\Seeders;

use App\Models\Tramite;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'cliente' => 'Cliente A',
                'producto' => 'LUMINIDERM WHITE',
                'proveedor' => 'Shanghai Cenmade Laser Technology Co. Ltd',
                'tipo' => 'NA',
                'riesgo' => 'I',
                'tipo_tramite' => 'Registro Sanitario',
                'nombre_registro_sanitario' => 'LUMINIDERM WHITE LED',
                'tarifa' => '40,233',
                'valor' => '4,500,000',
                'estado_id_reenvio' => 'Intención de trámite enviada',
                'programado' => '2026-01-01',
                'real' => '2026-01-21',
            ],
            [
                'cliente' => 'Cliente B',
                'producto' => 'DERMABRIGHT PRO',
                'proveedor' => 'Shenzhen Beautylife Electronics Co.',
                'tipo' => 'Clase IIa',
                'riesgo' => 'IIa',
                'tipo_tramite' => 'Certificado de Cumplimiento',
                'nombre_registro_sanitario' => 'DERMABRIGHT PRO 2000',
                'tarifa' => '55,100',
                'valor' => '8,200,000',
                'estado_id_reenvio' => 'En proceso',
                'programado' => '2026-03-15',
                'real' => '2026-04-01',
            ],
            [
                'cliente' => 'Cliente A',
                'producto' => 'RADIANCE PLUS',
                'proveedor' => 'Guangzhou SkinTech Medical',
                'tipo' => 'Clase IIb',
                'riesgo' => 'IIb',
                'tipo_tramite' => 'Renovación',
                'nombre_registro_sanitario' => 'RADIANCE PLUS X',
                'tarifa' => '62,400',
                'valor' => '12,000,000',
                'estado_id_reenvio' => 'Completado',
                'programado' => '2026-08-01',
                'real' => '2026-09-15',
            ],
            [
                'cliente' => 'Cliente C',
                'producto' => 'CLEAR SKIN LASER',
                'proveedor' => 'Seoul Derma Solutions Inc.',
                'tipo' => 'Clase III',
                'riesgo' => 'III',
                'tipo_tramite' => 'Registro Sanitario',
                'nombre_registro_sanitario' => 'CLEAR SKIN LASER Q-SWITCH',
                'tarifa' => '98,000',
                'valor' => '22,500,000',
                'estado_id_reenvio' => 'Intención de trámite enviada',
                'programado' => '2026-06-01',
                'real' => null,
            ],
            [
                'cliente' => 'Cliente B',
                'producto' => 'BEAUTY GLOW DEVICE',
                'proveedor' => 'Miami Aesthetic Imports LLC',
                'tipo' => 'NA',
                'riesgo' => 'I',
                'tipo_tramite' => 'Modificación',
                'nombre_registro_sanitario' => 'BEAUTY GLOW 3000',
                'tarifa' => '18,500',
                'valor' => '3,100,000',
                'estado_id_reenvio' => 'En proceso',
                'programado' => '2026-02-10',
                'real' => '2026-03-05',
            ],
        ];

        foreach ($items as $item) {
            Tramite::create($item);
        }
    }
}
