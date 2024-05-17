<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page trimDirectiveWhitespaces="true" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<script type="text/javascript" src="${controller}"></script>
<div class="container-fluid submodulo-hash">
    <ol class="breadcrumb pull-right">
        <li class="breadcrumb-item"><a href="javascript:;">Inicio</a></li>
        <li class="breadcrumb-item active">Perfil del Usuario</li>
    </ol>
    <h1 class="page-header">Perfil del Usuario</h1>

    <form name="formUsuario" id="formUsuario" class="form-horizontal" onsubmit="javascript: return false;" autocomplete="off">
        <div class="form-group" style="position: relative;margin: 0;height: 1px;">
            <div id="inputs-falsos" >
                <input style="visibility: hidden" type="text" name="fakeusernameremembered"/>
                <input style="visibility: hidden" type="password" name="fakepasswordremembered"/>
            </div>
        </div>

        <div class="form-group">
            <div class="col-md-6">
                <label class="control-label" for="textUnidadResponsable">Unidad Responsable</label>  
                <input id="textUnidadResponsable" name="textUnidadResponsable" type="text" 
                       placeholder="Unidad Responsable" class="form-control text-uppercase" readonly="" 
                       value="${datosUsuario.unidadResponsable}" />
            </div>

            <div class="col-md-6">
                <label class="control-label" for="textUnidadEjecutora">Unidad Ejecutora</label>  
                <input id="textUnidadEjecutora" name="textUnidadEjecutora" type="text" 
                       placeholder="Unidad Ejecutora" class="form-control text-uppercase" readonly="" 
                       value="${datosUsuario.unidadEjecutora}" />
            </div>
        </div>

        <div class="form-group">
            <div class="col-md-6">
                <label class="control-label" for="textNombreCompleto">Nombre</label>  
                <input id="textNombreCompleto" name="textNombreCompleto" type="text" 
                       placeholder="Nombre" class="form-control  text-uppercase" readonly="" 
                       value="${datosUsuario.nombreUsuario}"/>
            </div>
        </div>

        <div class="form-group">
            <div class="col-md-3">
                <label class="control-label" for="textUsuario">Usuario</label>  
                <input id="textUsuario" name="textUsuario" type="text" placeholder="Usuario" 
                       class="form-control text-uppercase" autocomplete="off" readonly="" 
                       value="${datosUsuario.cuenta}" />
            </div>
        </div>

        <div class="form-group">
            <div class="col-md-3">
                <label class="control-label" for="inputPasswordActual">Password Actual</label>  
                <input id="inputPasswordActual" name="inputPasswordActual" type="password" placeholder="Usuario" 
                       class="form-control text-uppercase" autocomplete="off" />
            </div>

            <div class="col-md-3">
                <label class="control-label" for="inputPassword">Password Nuevo</label>  
                <div class="input-group">
                    <span class="input-group-btn">
                        <button class="btn btn-info" type="button" name="buttonGenerarPassword" id="buttonGenerarPassword"><i class="fa fa-key"></i></button>
                    </span>
                    <input type="password" id="inputPasswordNuevo" name="inputPasswordNuevo" class="form-control" placeholder="Password" autocomplete="off" />
                    <span class="input-group-btn">
                        <button class="btn btn-inverse" type="button" name="buttonMostrarPassword" id="buttonMostrarPassword"><i class="fa fa-eye"></i></button>
                    </span>
                </div>

            </div>
        </div>

        <div class="form-group">
            <div class="col-md-6 text-right">
                <button id="buttonActualizarPerfil" name="buttonActualizarPerfil" class="btn btn-primary"><i class="fa fa-save" aria-hidden="true"></i> Actualizar Perfil</button>
            </div>
        </div>

    </form>
</div>