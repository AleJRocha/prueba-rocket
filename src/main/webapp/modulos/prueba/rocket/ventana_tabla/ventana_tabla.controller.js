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
                gridTareasRegistradas.dataSource.read();
                gridTareasRegistradas.dataSource.sort({field: "id", dir: "desc"});
            }, 100);
        }}
];

$(function () {
    try {
        
        /*Tabla con los registros de las tareas que se van agregando.*/
        gridTareasRegistradas = $("gridTareasRegistradas").kendoGrid({
            dataSource: {
                type: "json"
                , transport: {
                    read: {
                        url: "grid/obtenerPaginaRegistros.data"
                        , data: function () {
                            bonito.dialogs.showLoading({message: "Cargando datos, por favor espere..."});
                            var filter = gridTareasRegistradas.dataSource.filter();
                            var filters = filter !== undefined ? filter.filters : [];
                            if (filters.length) {
                                $.each(filters, function (index, value) {
                                    if (value.field == 'fecha_inicio') {
                                        var fecha = new Date(value.value),
                                                yr = fecha.getFullYear(),
                                                month = (fecha.getMonth() + 1) < 10 ? '0' + (fecha.getMonth() + 1) : (fecha.getMonth() + 1),
                                                day = fecha.getDate() < 10 ? '0' + fecha.getDate() : fecha.getDate();
                                        //newDate = yr + '/' + month + '/' + day;
                                        value.value = yr + '/' + month + '/' + day;
                                    }
                                })
                            }
                            filters = JSON.stringify(filters);
                            var sorts = JSON.stringify(gridTareasRegistradas.dataSource.sort());

                            return {jsorts: sorts, jfilters: filters, claveGrid: "tareasRegistradas"};
                        }, complete: function () {
                            bonito.dialogs.hideLoading();
                        }
                    }
                }
                , schema: {data: "registros", total: "total", model: {fields: {fecha_alta: {type: "date"}}}}
                , pageSize: 15
                , serverPaging: true
                , serverFiltering: true
                , serverSorting: true
            }
            , sortable: true
            , resizable: true
            , scrollable: true
            , autoBind: false
            , selectable: true
            , pageable: {input: true, numeric: false, refresh: true, pageSizes: [15, 50, 100, 500, 1000, "all"], buttonCount: 5}
            , filterable: {mode: "row", extra: false}
            , columns: [
                {title: "Nombre", width: "100px", field: "nombre", filterable: {cell: {enabled: true, delay: 3000000, extra: false, showOperators: false, operator: "contains"}}}
                , {title: "Cantidad", width: "100px", field: "cantidad", filterable: {cell: {enabled: true, delay: 30000, extra: false, showOperators: false, operator: "contains"}}}
                , {title: "Fecha Inicio", width: 125, format: "{0:dd-MM-yyyy}", field: "fecha_inicio", filterable: {cell: {template: betweenFilter}}, attributes: {style: "text-align: right;"}}
            ]
        }).data().kendoGrid;
        
        function betweenFilter(args) {
            var filterCell = args.element.parents(".k-filtercell");
            filterCell.empty();
            filterCell.html('<span style="display:contents; justify-content:center;"><span></span><input  class="start-date"/><span></span><input  class="end-date"/></span>');
            $(".start-date", filterCell).kendoDatePicker({
                max: new Date(),
                change: function (e) {
                    var startDate = e.sender.value(),
                            endDate = $("input.end-date", filterCell).data("kendoDatePicker").value(),
                            dataSource = gridTareasRegistradas.dataSource;
                    $("input.end-date", filterCell).data("kendoDatePicker").setOptions({min: startDate});
                    if (startDate & endDate) {
                        var filter = {logic: "and", filters: []};
                        filter.filters.push({field: "fecha_inicio", operator: "gte", value: startDate, tipo: "date"});
                        filter.filters.push({field: "fecha_inicio", operator: "lte", value: endDate, tipo: "date"});
                        dataSource.filter(filter);
                        if (!dataSource.sort()) {
                            var sort = [];
                            sort.push({field: "fecha_inicio", dir: "asc"});
                            dataSource.sort(sort);
                        }
                    }
                }
            });
            $(".end-date", filterCell).kendoDatePicker({
                max: new Date(),
                change: function (e) {
                    var startDate = $("input.start-date", filterCell).data("kendoDatePicker").value(),
                            endDate = e.sender.value(),
                            dataSource = gridTareasRegistradas.dataSource;
                    $("input.start-date", filterCell).data("kendoDatePicker").setOptions({max: endDate});

                    if (startDate & endDate) {
                        var filter = {logic: "and", filters: []};
                        filter.filters.push({field: "fecha_inicio", operator: "gte", value: startDate, tipo: "date"});
                        filter.filters.push({field: "fecha_inicio", operator: "lte", value: endDate, tipo: "date"});
                        dataSource.filter(filter);
                        if (!dataSource.sort()) {
                            var sort = [];
                            sort.push({field: "fecha_inicio", dir: "asc"});
                            dataSource.sort(sort);
                        }
                    }
                }
            });
            $("input.start-date").attr("placeholder", "Desde:");
            $("input.start-date").on('click', function (e) {
                $(this).parent().find('[unselectable="on"]').click();
            });
            $("input.end-date").attr("placeholder", "Hasta:");
            $("input.end-date").on('click', function (e) {
                $(this).parent().find('[unselectable="on"]').click();
            });
        }
        
        (!(window.location.hash.substring(0, 3) === "#!/")) ? window.location.hash = "#!/principal/" : "";
    } catch (er) {
        console.error(er);
    }
});
