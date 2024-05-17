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

    <h4 class="titulo">Tareas Registradas</h4>
    <div class="row">
        <div class="col-md-12">                            
            <div id="gridTareasRegistradas"></div>
        </div>
    </div>
    <div>
        <br/>
    </div>
</div>
