<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tramite extends Model
{
    use HasFactory;
    protected $fillable = [
        'cliente',
        'producto',
        'proveedor',
        'tipo',
        'riesgo',
        'tipo_tramite',
        'nombre_registro_sanitario',
        'tarifa',
        'valor',
        'estado_id_reenvio',
        'fecha_estimada_radicado',
        'fecha_radicado',
        'radicado_no',
        'llave_clave',
        'fecha_auto',
        'auto_no',
        'fecha_limite',
        'fecha',
        'radicado_no_2',
        'fecha_estimada_obtencion_resolucion',
        'fecha_obtencion_resolucion',
        'resolucion',
        'registro_sanitario_obtenido_no',
        'expediente',
        'fecha_radicado_2',
        'radicado_no_3',
        'llave',
        'fecha_estimada_resolucion',
        'fecha_resolucion',
        'resolucion_obtenida',
        'nombre_generico',
        'codigo',
        'descripcion',
        'definicion',
        'udi1',
        'udi2',
        'fecha_cargue',
        'radicado',
        'observaciones',
        'programado',
        'real',
        'f2_programado',
        'f2_real',
    ];

    protected function casts(): array
    {
        return [
            'fecha_estimada_radicado' => 'date',
            'fecha_radicado' => 'date',
            'fecha_auto' => 'date',
            'fecha_limite' => 'date',
            'fecha' => 'date',
            'fecha_estimada_obtencion_resolucion' => 'date',
            'fecha_obtencion_resolucion' => 'date',
            'fecha_radicado_2' => 'date',
            'fecha_estimada_resolucion' => 'date',
            'fecha_resolucion' => 'date',
            'fecha_cargue' => 'date',
            'programado' => 'date',
            'real' => 'date',
            'f2_programado' => 'date',
            'f2_real' => 'date',
        ];
    }
}
