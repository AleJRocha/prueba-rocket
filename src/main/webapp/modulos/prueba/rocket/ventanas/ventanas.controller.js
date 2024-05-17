Mousetrap.bind('r r', function () {
    $(window).trigger("hashchange");
});

jashs = [
    {hash: "#!/principal/",
        onSet: function (parametros) {
            $(".submodulo-hash").each(function () {
                $(this)[ ($(this).attr("id") === "general") ? "show" : "hide" ]();
            });
            setTimeout(function () {
                /* Asignar los datos a los combos */
                $("#comboTipoReporte").data("kendoComboBox").dataSource.read();
                $("#comboTipoInversion").data("kendoComboBox").dataSource.read();
                $("#comboConcatenarFiltroEspecial").data("kendoComboBox").dataSource.read();
                $("#comboOperadorFiltroEspecial").data("kendoComboBox").dataSource.read();
                $("#comboEjercicio").data("kendoComboBox").dataSource.read();

                /* Mostrar sección principal al iniciar */
                $("#seccion-reporte").show();
                $("#seccion-agrupaciones").hide();
                $("#seccion-estructura-financiera").hide();
                $("#seccion-filtros").hide();
                $("#seccion-generar-reporte").hide();
                comboTipoInversion.value(1);
                comboTipoInversion.readonly();
            }, 100);
        }}
];

var global = {
    models: [
        {field: "reporte_id", selector: "#comboTipoReporte", tipo: bonito.mvc.TYPES.combobox},
        {field: "tinversion_id", selector: "#comboTipoInversion", tipo: bonito.mvc.TYPES.combobox}
    ]
};

var seccion_default = 0;

$(function () {
    try {
        /* Petición para rellenar los combos */
        $(".combobox-autobuild").each(function (i, input4Combo) {
            bonito.combos.build($(input4Combo), {url: "catalogo/obtenerCatalogo.data"});
        });

        /* Inicializar combos */
        comboTipoReporte = $("#comboTipoReporte").data().kendoComboBox;
        comboTipoInversion = $("#comboTipoInversion").data().kendoComboBox;
        comboConcatenarFiltroEspecial = $("#comboConcatenarFiltroEspecial").data().kendoComboBox;
        comboOperadorFiltroEspecial = $("#comboOperadorFiltroEspecial").data().kendoComboBox;
        comboEjercicio = $("#comboEjercicio").data().kendoComboBox;

        ////////////////////// SELECCIÓN CHECKS //////////////////////
        /* Validar solamente la selección de un solo checkbox Contenedor */
        $("#checkInforme").on("click", function () {
            try {
                $("#checkSi").prop("checked", false);
            } catch (er) {
                console.error(er);
            }
        });

        $("#checkSi").on("click", function () {
            try {
                $("#checkInforme").prop("checked", false);
            } catch (er) {
                console.error(er);
            }
        });

        /* Validar solamente la selección de un solo checkbox Presentación */
        $("#checkDetalle").on("click", function () {
            try {
                $("#checkResumen").prop("checked", false);
            } catch (er) {
                console.error(er);
            }
        });

        $("#checkResumen").on("click", function () {
            try {
                $("#checkDetalle").prop("checked", false);
            } catch (er) {
                console.error(er);
            }
        });

        ////////////////////// FUNCIONALIDAD BOTONES SIGUIENTE/ANTERIOR //////////////////////
        buttonAtras = $("#buttonAtras").on("click", function (event) {
            try {
                if (seccion_default > 0) {
                    seccion_default -= 1;
                    console.log(seccion_default);
                    var secciones = ["#seccion-reporte", "#seccion-agrupaciones",
                        "#seccion-estructura-financiera", "#seccion-filtros", "#seccion-generar-reporte"];
                    for (var i = 0; i < secciones.length; i++) {
                        (seccion_default === i) ? $(secciones[i]).show() : $(secciones[i]).hide();
                    }
                }
            } catch (er) {
                console.error(er);
            }
        });

        buttonSiguiente = $("#buttonSiguiente").on("click", function (event) {
            try {
                if (seccion_default < 4) {
                    seccion_default += 1;
                    console.log("seccion_default", seccion_default);
                    var secciones = ["#seccion-reporte", "#seccion-agrupaciones",
                        "#seccion-estructura-financiera", "#seccion-filtros", "#seccion-generar-reporte"];
                    for (var i = 0; i < secciones.length; i++) {
                        (seccion_default === i) ? $(secciones[i]).show() : $(secciones[i]).hide();
//                    if (seccion_default === (secciones.length - 1)) {
//                        $("#buttonSiguiente").hide();
//                    }
                    }
                }
            } catch (er) {
                console.error(er);
            }
        });

        ////////////////////// FUNCIONALIDAD DEL BOTÓN PARA DESCARGAR LOS REPORTES //////////////////////
        buttonDescargar = $("#buttonDescargar").on("click", function (event) {
            try {
                let reporte_id = parseInt(comboTipoReporte.value(), 10);
                let ejercicio = parseInt(comboEjercicio.value(), 10);
                let check_informe = $("#checkInforme").is(':checked');
                let check_si = $("#checkSi").is(':checked');
                let check_resumen = $("#checkResumen").is(':checked');
                let check_detalle = $("#checkDetalle").is(':checked');
                if (reporte_id < 1 || isNaN(reporte_id)) {
                    Swal.fire({
                        icon: 'error',
                        text: 'Seleccione un reporte para descargar.'
                    });
                    return;
                }
                if (ejercicio < 1 || isNaN(ejercicio)) {
                    Swal.fire({
                        icon: 'error',
                        text: 'Seleccione un ejercicio para generar el reporte.'
                    });
                    return;
                }
                if (!check_informe && !check_si) {
                    Swal.fire({
                        icon: 'error',
                        text: 'Seleccione una opción de contenedor.'
                    });
                    return;
                }
                if (!check_resumen && !check_detalle) {
                    Swal.fire({
                        icon: 'error',
                        text: 'Seleccione una presentación.'
                    });
                    return;
                }
                var url = "reporte/obtenerReporte.data?aliasReporte=reporteTecnico";
                window.location.href = url;
            } catch (er) {
                console.error(er);
            }
        });

        ////////////////////// OCULTAR O MOSTRAR SECCIONES //////////////////////
        buttonReporte = $("#buttonReporte").on("click", function (event) {
            try {
                $("#seccion-reporte").show();
                $("#seccion-agrupaciones").hide();
                $("#seccion-estructura-financiera").hide();
                $("#seccion-filtros").hide();
                $("#seccion-generar-reporte").hide();
            } catch (er) {
                console.error(er);
            }
        });

        buttonAgrupacion = $("#buttonAgrupacion").on("click", function (event) {
            try {
                $("#seccion-reporte").hide();
                $("#seccion-agrupaciones").show();
                $("#seccion-estructura-financiera").hide();
                $("#seccion-filtros").hide();
                $("#seccion-generar-reporte").hide();
            } catch (er) {
                console.error(er);
            }
        });
        buttonEstructura = $("#buttonEstructura").on("click", function (event) {
            try {
                $("#seccion-reporte").hide();
                $("#seccion-agrupaciones").hide();
                $("#seccion-estructura-financiera").show();
                $("#seccion-filtros").hide();
                $("#seccion-generar-reporte").hide();
            } catch (er) {
                console.error(er);
            }
        });
        buttonFiltros = $("#buttonFiltros").on("click", function (event) {
            try {
                $("#seccion-reporte").hide();
                $("#seccion-agrupaciones").hide();
                $("#seccion-estructura-financiera").hide();
                $("#seccion-filtros").show();
                $("#seccion-generar-reporte").hide();
            } catch (er) {
                console.error(er);
            }
        });
        buttonSalida = $("#buttonSalida").on("click", function (event) {
            try {
                $("#seccion-reporte").hide();
                $("#seccion-agrupaciones").hide();
                $("#seccion-estructura-financiera").hide();
                $("#seccion-filtros").hide();
                $("#seccion-generar-reporte").show();
            } catch (er) {
                console.error(er);
            }
        });

        // esta linea debe ir siempre al final
        (!(window.location.hash.substring(0, 3) === "#!/")) ? window.location.hash = "#!/principal/" : "";
    } catch (er) {
        console.error(er);
    }
});
