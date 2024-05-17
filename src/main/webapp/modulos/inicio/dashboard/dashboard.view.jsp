<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page trimDirectiveWhitespaces="true" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!-- begin breadcrumb -->
<ol class="breadcrumb pull-right">
    <li class="breadcrumb-item"><a href="javascript:;">Inicio</a></li>
    <li class="breadcrumb-item"><a href="javascript:;">Menu</a></li>
    <li class="breadcrumb-item active">Opción</li>
</ol>
<!-- end breadcrumb -->
<!-- begin page-header -->
<h1 class="page-header">Nombre del modulo <small>${urlModulo}</small></h1>
<!-- end page-header -->

<!-- begin panel -->
<div class="panel panel-inverse">
    <div class="panel-body">
        <button type="button" class="btn btn-default">Default</button>
        <button type="button" class="btn btn-grey">Grey</button>
        <button type="button" class="btn btn-purple">Purple</button>
        <button type="button" class="btn btn-indigo">Indigo</button>
        <button type="button" class="btn btn-primary">Primary</button>
        <button type="button" class="btn btn-info">Info</button>
        <button type="button" class="btn btn-yellow">Yellow</button>
        <button type="button" class="btn btn-warning">Warning</button>
        <button type="button" class="btn btn-pink">Pink</button>
        <button type="button" class="btn btn-danger">Danger</button>
        <button type="button" class="btn btn-success">Success</button>
        <button type="button" class="btn btn-green">Green</button>
        <button type="button" class="btn btn-lime">Lime</button>
        <button type="button" class="btn btn-inverse">Inverse</button>
        <button type="button" class="btn btn-link">Link</button>
    </div>
</div>
<!-- end panel -->