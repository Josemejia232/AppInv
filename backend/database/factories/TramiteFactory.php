<?php

namespace Database\Factories;

use App\Models\Tramite;
use Illuminate\Database\Eloquent\Factories\Factory;

class TramiteFactory extends Factory
{
    protected $model = Tramite::class;

    public function definition(): array
    {
        $productos = [
            'LUMINIDERM WHITE',
            'DERMABRIGHT PRO',
            'RADIANCE PLUS',
            'CLEAR SKIN LASER',
            'BEAUTY GLOW DEVICE',
        ];

        $proveedores = [
            'Shanghai Cenmade Laser Technology Co. Ltd',
            'Shenzhen Beautylife Electronics Co.',
            'Guangzhou SkinTech Medical',
            'Seoul Derma Solutions Inc.',
            'Miami Aesthetic Imports LLC',
        ];

        $tramites = ['Registro Sanitario', 'Certificado de Cumplimiento', 'Renovación', 'Modificación'];
        $tipos = ['NA', 'Clase I', 'Clase IIa', 'Clase IIb', 'Clase III'];
        $riesgos = ['I', 'IIa', 'IIb', 'III'];

        return [
            'cliente' => 'Cliente A',
            'producto' => $this->faker->randomElement($productos),
            'proveedor' => $this->faker->randomElement($proveedores),
            'tipo' => $this->faker->randomElement($tipos),
            'riesgo' => $this->faker->randomElement($riesgos),
            'tipo_tramite' => $this->faker->randomElement($tramites),
            'nombre_registro_sanitario' => $this->faker->word() . ' LED',
            'tarifa' => (string) $this->faker->numberBetween(10000, 50000),
            'valor' => (string) $this->faker->numberBetween(1000000, 5000000),
            'estado_id_reenvio' => 'Intención de trámite enviada',
            'fecha_estimada_radicado' => $this->faker->date(),
            'fecha_radicado' => $this->faker->date(),
            'radicado_no' => 'RAD-' . $this->faker->unique()->numberBetween(1000, 9999),
            'llave_clave' => $this->faker->bothify('??-####'),
            'fecha_auto' => $this->faker->date(),
            'auto_no' => 'AUTO-' . $this->faker->numberBetween(100, 999),
            'fecha_limite' => $this->faker->date(),
            'fecha' => $this->faker->date(),
            'radicado_no_2' => 'RAD-' . $this->faker->numberBetween(1000, 9999),
            'fecha_estimada_obtencion_resolucion' => $this->faker->date(),
            'fecha_obtencion_resolucion' => $this->faker->date(),
            'resolucion' => 'RES-' . $this->faker->numberBetween(100, 999),
            'registro_sanitario_obtenido_no' => 'RS-' . $this->faker->numberBetween(10000, 99999),
            'expediente' => 'EXP-' . $this->faker->numberBetween(1000, 9999),
            'fecha_radicado_2' => $this->faker->date(),
            'radicado_no_3' => 'RAD-' . $this->faker->numberBetween(1000, 9999),
            'llave' => $this->faker->bothify('??-####'),
            'fecha_estimada_resolucion' => $this->faker->date(),
            'fecha_resolucion' => $this->faker->date(),
            'resolucion_obtenida' => 'RES-' . $this->faker->numberBetween(100, 999),
            'nombre_generico' => $this->faker->word(),
            'codigo' => strtoupper($this->faker->bothify('???####')),
            'descripcion' => $this->faker->sentence(),
            'definicion' => $this->faker->paragraph(),
            'udi1' => $this->faker->ean13(),
            'udi2' => $this->faker->ean13(),
            'fecha_cargue' => $this->faker->date(),
            'radicado' => 'RAD-' . $this->faker->numberBetween(1000, 9999),
            'observaciones' => $this->faker->optional()->sentence(),
            'programado' => $this->faker->date(),
            'real' => $this->faker->date(),
            'f2_programado' => $this->faker->optional()->date(),
            'f2_real' => $this->faker->optional()->date(),
        ];
    }

    public function withRealisticData(): static
    {
        return $this->state([
            'producto' => 'LUMINIDERM WHITE',
            'proveedor' => 'Shanghai Cenmade Laser Technology Co. Ltd',
            'tipo' => 'NA',
            'riesgo' => 'I',
            'tipo_tramite' => 'Registro Sanitario',
            'nombre_registro_sanitario' => 'LUMINIDERM WHITE LED',
            'tarifa' => '40,233',
            'valor' => '4,500,000',
            'estado_id_reenvio' => 'Intención de trámite enviada',
            'cliente' => 'Cliente A',
            'programado' => '2026-01-01',
            'real' => '2026-01-21',
        ]);
    }
}
