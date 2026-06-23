<?php

namespace App\Http\Controllers;

use App\Models\Tramite;
use Illuminate\Http\Request;

class TramiteController extends Controller
{
    public function index()
    {
        return response()->json(Tramite::orderBy('id')->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'cliente' => 'nullable|string|max:255',
            'producto' => 'nullable|string|max:255',
            'proveedor' => 'nullable|string|max:255',
            'tipo' => 'nullable|string|max:255',
            'riesgo' => 'nullable|string|max:10',
            'tipo_tramite' => 'nullable|string|max:255',
            'nombre_registro_sanitario' => 'nullable|string|max:255',
            'tarifa' => 'nullable|string|max:255',
            'valor' => 'nullable|string|max:255',
            'estado_id_reenvio' => 'nullable|string|max:255',
            'fecha_estimada_radicado' => 'nullable|date',
            'fecha_radicado' => 'nullable|date',
            'radicado_no' => 'nullable|string|max:255',
            'llave_clave' => 'nullable|string|max:255',
            'fecha_auto' => 'nullable|date',
            'auto_no' => 'nullable|string|max:255',
            'fecha_limite' => 'nullable|date',
            'fecha' => 'nullable|date',
            'radicado_no_2' => 'nullable|string|max:255',
            'fecha_estimada_obtencion_resolucion' => 'nullable|date',
            'fecha_obtencion_resolucion' => 'nullable|date',
            'resolucion' => 'nullable|string|max:255',
            'registro_sanitario_obtenido_no' => 'nullable|string|max:255',
            'expediente' => 'nullable|string|max:255',
            'fecha_radicado_2' => 'nullable|date',
            'radicado_no_3' => 'nullable|string|max:255',
            'llave' => 'nullable|string|max:255',
            'fecha_estimada_resolucion' => 'nullable|date',
            'fecha_resolucion' => 'nullable|date',
            'resolucion_obtenida' => 'nullable|string|max:255',
            'nombre_generico' => 'nullable|string|max:255',
            'codigo' => 'nullable|string|max:255',
            'descripcion' => 'nullable|string',
            'definicion' => 'nullable|string',
            'udi1' => 'nullable|string|max:255',
            'udi2' => 'nullable|string|max:255',
            'fecha_cargue' => 'nullable|date',
            'radicado' => 'nullable|string|max:255',
            'observaciones' => 'nullable|string',
            'programado' => 'nullable|date',
            'real' => 'nullable|date',
            'f2_programado' => 'nullable|date',
            'f2_real' => 'nullable|date',
        ]);

        $tramite = Tramite::create($data);

        return response()->json($tramite, 201);
    }

    public function show(Tramite $tramite)
    {
        return response()->json($tramite);
    }

    public function update(Request $request, Tramite $tramite)
    {
        $data = $request->validate([
            'cliente' => 'nullable|string|max:255',
            'producto' => 'nullable|string|max:255',
            'proveedor' => 'nullable|string|max:255',
            'tipo' => 'nullable|string|max:255',
            'riesgo' => 'nullable|string|max:10',
            'tipo_tramite' => 'nullable|string|max:255',
            'nombre_registro_sanitario' => 'nullable|string|max:255',
            'tarifa' => 'nullable|string|max:255',
            'valor' => 'nullable|string|max:255',
            'estado_id_reenvio' => 'nullable|string|max:255',
            'fecha_estimada_radicado' => 'nullable|date',
            'fecha_radicado' => 'nullable|date',
            'radicado_no' => 'nullable|string|max:255',
            'llave_clave' => 'nullable|string|max:255',
            'fecha_auto' => 'nullable|date',
            'auto_no' => 'nullable|string|max:255',
            'fecha_limite' => 'nullable|date',
            'fecha' => 'nullable|date',
            'radicado_no_2' => 'nullable|string|max:255',
            'fecha_estimada_obtencion_resolucion' => 'nullable|date',
            'fecha_obtencion_resolucion' => 'nullable|date',
            'resolucion' => 'nullable|string|max:255',
            'registro_sanitario_obtenido_no' => 'nullable|string|max:255',
            'expediente' => 'nullable|string|max:255',
            'fecha_radicado_2' => 'nullable|date',
            'radicado_no_3' => 'nullable|string|max:255',
            'llave' => 'nullable|string|max:255',
            'fecha_estimada_resolucion' => 'nullable|date',
            'fecha_resolucion' => 'nullable|date',
            'resolucion_obtenida' => 'nullable|string|max:255',
            'nombre_generico' => 'nullable|string|max:255',
            'codigo' => 'nullable|string|max:255',
            'descripcion' => 'nullable|string',
            'definicion' => 'nullable|string',
            'udi1' => 'nullable|string|max:255',
            'udi2' => 'nullable|string|max:255',
            'fecha_cargue' => 'nullable|date',
            'radicado' => 'nullable|string|max:255',
            'observaciones' => 'nullable|string',
            'programado' => 'nullable|date',
            'real' => 'nullable|date',
            'f2_programado' => 'nullable|date',
            'f2_real' => 'nullable|date',
        ]);

        $tramite->update($data);

        return response()->json($tramite);
    }

    public function destroy(Tramite $tramite)
    {
        $tramite->delete();

        return response()->json(null, 204);
    }
}
