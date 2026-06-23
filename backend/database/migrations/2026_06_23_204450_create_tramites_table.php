<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tramites', function (Blueprint $table) {
            $table->id();

            $table->string('cliente')->nullable();
            $table->string('producto')->nullable();
            $table->string('proveedor')->nullable();
            $table->string('tipo')->nullable();
            $table->string('riesgo')->nullable();
            $table->string('tipo_tramite')->nullable();
            $table->string('nombre_registro_sanitario')->nullable();
            $table->string('tarifa')->nullable();
            $table->string('valor')->nullable();
            $table->string('estado_id_reenvio')->nullable();

            $table->date('fecha_estimada_radicado')->nullable();
            $table->date('fecha_radicado')->nullable();
            $table->string('radicado_no')->nullable();
            $table->string('llave_clave')->nullable();

            $table->date('fecha_auto')->nullable();
            $table->string('auto_no')->nullable();
            $table->date('fecha_limite')->nullable();
            $table->date('fecha')->nullable();
            $table->string('radicado_no_2')->nullable();

            $table->date('fecha_estimada_obtencion_resolucion')->nullable();
            $table->date('fecha_obtencion_resolucion')->nullable();
            $table->string('resolucion')->nullable();
            $table->string('registro_sanitario_obtenido_no')->nullable();
            $table->string('expediente')->nullable();
            $table->date('fecha_radicado_2')->nullable();
            $table->string('radicado_no_3')->nullable();
            $table->string('llave')->nullable();

            $table->date('fecha_estimada_resolucion')->nullable();
            $table->date('fecha_resolucion')->nullable();
            $table->string('resolucion_obtenida')->nullable();

            $table->string('nombre_generico')->nullable();
            $table->string('codigo')->nullable();
            $table->text('descripcion')->nullable();
            $table->text('definicion')->nullable();

            $table->string('udi1')->nullable();
            $table->string('udi2')->nullable();

            $table->date('fecha_cargue')->nullable();
            $table->string('radicado')->nullable();

            $table->text('observaciones')->nullable();

            $table->date('programado')->nullable();
            $table->date('real')->nullable();
            $table->date('f2_programado')->nullable();
            $table->date('f2_real')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tramites');
    }
};
