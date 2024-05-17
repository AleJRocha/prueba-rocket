<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page trimDirectiveWhitespaces="true" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/javascript" src="${controller}"></script>
<div class="container-fluid submodulo-hash" id="general">
    <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="#">Inicio</a></li>
        <li class="breadcrumb-item"><a>Tareas</a></li>
        <li class="breadcrumb-item active" aria-current="page">Alta Tareas</li>
    </ol>

    <h1 class="page-header">TAREAS</h1>

    <h4>REGISTRO DE TAREAS</h4>

    <div class="col-md-12">
    </div>

    <div class="">
        <br/>
    </div>

    <h4 class="titulo">Agregar Tarea</h4>
    <div class="row">
        <div class="col-12 col-md-6">
            <label class="control-label" for="textNombre">Nombre:</label>
            <div class="input-group">
                <input id="textNombre" name="textNombre" class="form-control width-full" placeholder="Nombre" type="text" style="text-align: center;">
            </div>
        </div> 
        <div class="col-12 col-md-6">
            <label class="control-label" for="textDescripcion">Descripción:</label>
            <div class="input-group">
                <input id="textDescripcion" name="textDescripcion" class="form-control width-full" placeholder="Descripcion" type="text" style="text-align: center;">
            </div>
        </div> 
        <div class="col-12 col-md-6">
            <label class="control-label" for="textFechaInicio">Fecha Inicio:</label>
            <div class="input-group">
                <span class="input-group-addon" style="margin-right: 9px;"><i class="fa-regular fa-2x fa-calendar"></i></span> 
                <input id="textFechaInicio" name="textFechaInicio" class="form-control width-full" placeholder="Fecha Inicio" type="text" style="text-align: center;">
            </div>
        </div> 
    </div>
    <div>
        <br/>
    </div>
</div>
