<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page trimDirectiveWhitespaces="true" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@page import="java.util.ArrayList"%>
<%@page import="java.io.File"%>
<%@page import="java.util.List"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>
<%
    HttpSession httpSession = request.getSession(true);
    prueba.rocket.utils.SesionManager sesionManager = new prueba.rocket.utils.SesionManager(httpSession);

    java.util.Map<String, Object> datosUsuario = sesionManager.extraerDatosUsuario();
    java.util.List<java.util.Map<String, Object>> sistemasUsuario = sesionManager.extraerMenuUsuario();
    request.setAttribute("datosUsuario", datosUsuario);
    request.setAttribute("sistemasUsuario", sistemasUsuario);

    String sistema = request.getParameter("sistema") != null ? request.getParameter("sistema") : "";
    String proceso = request.getParameter("proceso") != null ? request.getParameter("proceso") : "inicio";
    String modulo = request.getParameter("modulo") != null ? request.getParameter("modulo") : "dashboard";
    String submodulo = request.getParameter("submodulo") != null ? request.getParameter("submodulo") : "";

    java.util.Map<String, Object> sistemaSeleccionado = sesionManager.extraerSistemaPorAlias(sistema);
    request.setAttribute("sistemaSeleccionado", sistemaSeleccionado);

    if ((!(modulo.equals("perfil") || modulo.equals("notificaciones"))) && sistema.isEmpty()) {
        sistema = sistemaSeleccionado.get("alias").toString();
    }

    String urlModulo = "", urlModuloCompleta = "",
            viewModulo = "", controllerModulo = "", controllerWriteModulo = "";

    urlModulo = proceso + "/" + modulo + "/" + (submodulo.isEmpty() ? "" : submodulo + "/");
    urlModuloCompleta = "modulos/" + (sistema.isEmpty() ? "" : (sistema + "/")) + proceso + "/" + modulo + "/" + (submodulo.isEmpty() ? "" : submodulo + "/");
    viewModulo = urlModuloCompleta + (submodulo.isEmpty() ? modulo : submodulo) + ".view.jsp";
    controllerModulo = urlModuloCompleta + (submodulo.isEmpty() ? modulo : submodulo) + ".controller.js";
    controllerWriteModulo = urlModuloCompleta + (submodulo.isEmpty() ? modulo : submodulo) + ".write.controller.js";

    request.setAttribute("sistema", sistema);
    request.setAttribute("proceso", proceso);
    request.setAttribute("modulo", modulo);
    request.setAttribute("submodulo", submodulo);

    System.out.println(request.getParameter("sistema"));
    boolean permitirAcceso = sesionManager.permitirAcceso(urlModulo);
    if (permitirAcceso) {
        File archivo = new File(getServletContext().getRealPath("/" + viewModulo));
        if (!archivo.exists()) {
            viewModulo = "error-pages/modulo-noencontrado.jsp";
        }

        java.util.Map<String, Object> infoModulo = sesionManager.extraerInformacionOpcion(urlModulo);
        request.setAttribute("infoModulo", infoModulo);
    } else if (!viewModulo.endsWith("dashboard.view.jsp")) {
        viewModulo = "error-pages/modulo-denegado.jsp";
    }

    request.setAttribute("urlModulo", urlModulo);
    request.setAttribute("urlModuloCompleta", urlModuloCompleta);
    request.setAttribute("viewModulo", viewModulo);
    request.setAttribute("controller", controllerModulo);
    request.setAttribute("controllerWrite", controllerWriteModulo);

    if (request.getParameter("sistema") == null && !viewModulo.endsWith("perfil/perfil.view.jsp")) {
        viewModulo = "menuPrincipal.jsp";
        sistemaSeleccionado = new HashMap<String, Object>();
        request.setAttribute("sistemaSeleccionado", sistemaSeleccionado);
        request.setAttribute("viewModulo", viewModulo);
        System.out.println(sistema);
    }

%>
<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="utf-8" />
        <title>Prueba Rocket</title>
        <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport" />
        <meta content="" name="description" />
        <meta content="" name="author" />
        <link rel="icon" type="image/png" href="assets/img/favicon.png" />

        <base href="${pageContext.request.scheme}://${pageContext.request.serverName}:${pageContext.request.serverPort}${pageContext.request.contextPath}/">

        <!-- ================== BEGIN BASE CSS STYLE ================== -->
        <link href="assets/plugins/jquery-ui/jquery-ui.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="assets/plugins/fontawesome/6.5.2/css/all.css">
        <link rel="stylesheet" href="assets/css/bootstrap.min.css">
        <link rel="stylesheet" href="assets/css/style_prueba.min.css ">
        <!-- ================== END BASE CSS STYLE ================== -->

        <!-- ================== BEGIN BASE JS ================== -->
        <script src="assets/plugins/jquery/jquery-3.5.1.min.js"></script>
        <script src="assets/plugins/jquery/jquery-migrate-3.3.0.min.js"></script>
        <script src="assets/plugins/jquery-ui/jquery-ui.min.js"></script>
        <script src="assets/plugins/bootstrap/js/bootstrap.min.js"></script>
        <script src="assets/plugins/jquery-cookie/jquery.cookie.js"></script>
        <!-- ================== END BASE JS ================== -->

        <link href="assets/plugins/kendoui/styles/kendo.common-bootstrap.min.css" rel="stylesheet" />
        <link href="assets/plugins/kendoui/styles/kendo.bootstrap.min.css" rel="stylesheet" />
        <link href="assets/plugins/kendoui/styles/kendo.bootstrap.mobile.min.css" rel="stylesheet" />
        <link href="assets/plugins/kendoui/styles/kendo.mobile.all.min.css" rel="stylesheet" />

        <script src="assets/plugins/kendoui/js/kendo.web.min.js"></script>
        <script src="assets/plugins/kendoui/js/messages/kendo.messages.es-MX.min.js"></script>
        <script src="assets/plugins/kendoui/js/cultures/kendo.culture.es-MX.min.js"></script>
        <script type="text/javascript">kendo.culture("es-MX");</script>
        <script type="text/javascript" src="assets/plugins/kendoui/js/jszip.min.js"></script>

        <link href="assets/plugins/formvalidation/css/formValidation.min.css" rel="stylesheet" />
        <script src="assets/plugins/formvalidation/js/formValidation.js"></script>
        <script src="assets/plugins/formvalidation/js/framework/bootstrap.min.js"></script>
        <script src="assets/plugins/formvalidation/js/formValidation.validadores.js"></script>
        <script src="assets/plugins/formvalidation/js/language/es_ES.js"></script>

        <script src="assets/plugins/underscore.js"></script>
        <script src="assets/plugins/moment/moment.min.js"></script>
        <script src="assets/plugins/numeraljs/numeral.js"></script>
        <script src="assets/plugins/mousetrap.js"></script>
        <script src="assets/plugins/bootbox.min.js"></script>
        <script src="assets/plugins/autosize.js"></script>
        <script src="assets/plugins/bootstrap-sweetalert/sweetalert2.all.min.js"></script>

        <script src="assets/plugins/angular-1.8.0/angular.min.js"></script>

        <script type="text/javascript" src="assets/js/main.controller.js"></script>
        <script src="assets/plugins/bootstrap/5.3.3/js/bootstrap.bundle.min.js"></script>
    </head>

    <nav class="navbar fixed-top navbar">
        <div class="container-fluid">
            <div class="d-flex">
                <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar"
                        aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
                    <i class="fa-solid fa-bars"></i>
                </button>
            </div>
        </div>
        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div class="offcanvas-header">
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">Inicio</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Menú
                        </a>
                        <ul class="dropdown-menu">
                            <c:forEach items="${sistemasUsuario}" var="sistema">
                                <c:forEach items="${sistema.menus}" var="menu">
                                    <c:forEach items="${menu.opciones}" var="opcion">
                                        <li><a href="${sistema.alias}/${opcion.opc_url}">${opcion.opc_titulo}</a></li>
                                        </c:forEach>
                                    </c:forEach>
                                </c:forEach>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <main>
        <div class="container">
            <div id="content" ng-app="app" class="content ${sistemaSeleccionado.alias}" >
                <jsp:include page="${viewModulo}"></jsp:include>
            </div>
        </div>
    </main>

    <footer>
        <div class="footer">
            <div>
                <p><span class="texto-md">Rocket</span> Prueba<br>
            </div>
        </div>
    </footer>
</body>
</html>