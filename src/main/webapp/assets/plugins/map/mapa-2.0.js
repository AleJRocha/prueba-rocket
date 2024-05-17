var Mapa = function () {

}
Mapa.prototype = {
    isRunning: false
    , mapa: null
    , mapaProp: null
    , puntos: []
    , capas: []
    , isDibujando: false
    , dibujante: {}

    , poligonos: []
    , dibujos: []//dibujos almacenados

    , MARKER: "marker"
    , CIRCLE: "circle"
    , POLYGON: "polygon"
    , POLYLINE: "polyline"
    , RECTANGLE: "rectangle"

    , CAPA_DEFAULT: 'http://sip.finanzasoaxaca.gob.mx/mapas/divisionMunicipal.kmz'
    , mapaDefaulf: {
        latitud: 17.0605416
        , longitud: -96.7253305
        , zoom: 9
    }
    , init: function (options)
    {
        try {
            var me = this;
            me.mapaProp = {
                center: new google.maps.LatLng(me.mapaDefaulf.latitud, me.mapaDefaulf.longitud),
                zoom: this.mapaDefaulf.zoom,
                minZoom: 4,
                mapTypeId: google.maps.MapTypeId.HYBRID,
                scaleControl: true,
                overviewMapControl: true,
                mapTypeControlOptions: {
                    style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
                }
            };

            var renderTo = options.renderTo || 'mapa';

            me.mapa = new google.maps.Map(document.getElementById(renderTo), me.mapaProp);

            if (options.escucha) {
                google.maps.event.addListener(me.mapa, 'click', function (event) {
                    me.getAlt(event, options.escucha);
                });
            }
            this.isRunning = true;
        } catch (err) {
            this.showError(err);
            this.isRunning = false;
        }
    }

    , getAlt: function (event, callback)
    {
        try {
            var me = this;
            var clickedLocation = event.latLng;
            var locations = [];

            locations.push(clickedLocation);

            var positionalRequest = {
                'locations': locations
            };

            var elevator = new google.maps.ElevationService();
            elevator.getElevationForLocations(positionalRequest, function (results, status) {
                if (status == google.maps.ElevationStatus.OK) {
                    if (results[0]) {

                        var elevacion = results[0].elevation;
                        callback({
                            lat: event.latLng.lat(),
                            lng: event.latLng.lng(),
                            alt: elevacion
                        });
                    } else {
                        return 0;
                    }
                } else {
                    return 0;
                }
            });
        } catch (er) {
            console.warn(er);
        }
    }

    , resetMapa: function () {
        if (!this.isRunning) {
            return false;
        }
        try {
            this.limpiarPuntos();
            this.limpiarCapas();
            this.mapa.setCenter(new google.maps.LatLng(this.mapaDefaulf.latitud, this.mapaDefaulf.longitud));
            this.mapa.setZoom(this.mapaDefaulf.zoom);

        } catch (err) {
            this.showError(err);
        }
    }
    /* Puntos */
    , ocultarPunto: function (indice)
    {
        if (!this.isRunning) {
            return false;
        }
        try {
            var me = this;
            indice = (typeof indice == 'string') ? parseInt(indice) : indice;
            if (indice >= 0 && indice < me.puntos.length) {
                me.puntos[indice].marca.setVisible(false);
            }
        } catch (err) {
            this.showError(err);
        }
    }
    , ocultarPuntos: function (tipo)
    {
        if (!this.isRunning) {
            return false;
        }
        try {
            var me = this;
            if (me.puntos) {
                for (var p in me.puntos) {
                    if (me.puntos[p].tipo == tipo)
                        me.puntos[p].marca.setVisible(false);
                }
            }
        } catch (err) {
            this.showError(err);
        }
    }
    , mostrarPunto: function (indice)
    {
        if (!this.isRunning) {
            return false;
        }
        try {
            var me = this;
            indice = (typeof indice == 'string') ? parseInt(indice) : indice;
            if (indice >= 0 && indice < me.puntos.length) {
                me.puntos[indice].marca.setVisible(true);
            }
        } catch (err) {
            this.showError(err);
        }
    }
    /*Muestra los putnos de de tipo enviado como parametro*/
    , mostrarPuntos: function (tipo)
    {
        if (!this.isRunning) {
            return false;
        }
        try {
            var me = this;
            if (me.puntos) {
                for (var p in me.puntos) {
                    if (me.puntos[p].tipo == tipo)
                        me.puntos[p].marca.setVisible(true);
                }
            }
        } catch (err) {
            this.showError(err);
        }
    }
    , ponerPunto: function (opciones)
    {
        if (!this.isRunning) {
            return false;
        }
        try {
            var configDefault = {
                latitud: ""
                , longitud: ""
                , tooltip: ""
                , icono: ""
                , infowindow: {
                    titulo: ""
                    , contenido: ""
                    , abrir: false
                    , abrirOnClick: true
                }
                , callback: {
                    fn: function () {
                    }
                    , args: {}
                }
                , tipo: ""
                , irOnClick: true
                , movible: {
                    esmovible: false
                    , callback: {
                        fn: function () {
                        }
                        , args: {}
                    }
                }
                , zindex: 1
            };
            for (var propiedad in configDefault) {
                if (opciones[propiedad] != null && opciones[propiedad] != "undefined") {

                } else {
                    opciones[propiedad] = configDefault[propiedad];
                }
            }
            var icono = opciones.icono || 'app/images/markers/default.png';
            var mrkr = new google.maps.Marker({
                position: new google.maps.LatLng(opciones.latitud, opciones.longitud)
                , map: this.mapa
                , icon: icono
                , title: opciones.tooltip
                , draggable: opciones.movible.esmovible
                , zIndex: opciones.zindex
            });

            var infoWin = new google.maps.InfoWindow({
                content: opciones.infowindow.contenido
                        /*content : ( "<strong>" + opciones.infowindow.titulo +"</strong><span class=\"salto-linea\"></span>"+ opciones.infowindow.contenido )*/
            });

            if (opciones.infowindow.abrir) {
                infoWin.open(this.mapa, mrkr);
            }

            var punto = {
                marca: mrkr
                , info: infoWin
                , tipo: opciones.tipo
            };

            this.puntos.push(punto);
            var indexPunto = (this.puntos.length - 1);

            var obMapa = this;
            google.maps.event.addListener(mrkr, 'click', function (event) {
                if (opciones.irOnClick) {
                    obMapa.irAPunto(indexPunto, 16);
                }
                if (opciones.infowindow.abrirOnClick) {
                    obMapa.showInfoWin(indexPunto);
                }

                opciones.callback.args.evento = event;
                opciones.callback.args.mapa = obMapa.mapa;
                opciones.callback.args.marca = mrkr;
                opciones.callback.args.infowin = (infoWin) ? infoWin : null;

                opciones.callback.fn(opciones.callback.args);
            });

            if (opciones.movible.esmovible) {
                google.maps.event.addListener(mrkr, 'dragend', function (event) {
                    opciones.movible.callback.args.evento = event;
                    opciones.movible.callback.args.mapa = obMapa.mapa;
                    opciones.movible.callback.args.marca = mrkr;

                    opciones.movible.callback.fn(opciones.movible.callback.args);
                });
            }
            return indexPunto;
        } catch (err) {
            this.showError(err);
            return -1;
        }
        return -1;
    }
    , quitarTipoPunto: function (tipo) {
        if (!this.isRunning) {
            return false;
        }
        try {
            if (this.puntos) {
                for (var p in this.puntos) {
                    if (this.puntos[p].tipo == tipo)
                        this.puntos[p].marca.setMap(null);
                }
            }
        } catch (err) {
            this.showError(err);
        }
    }
    , quitarPunto: function (indice) {
        if (!this.isRunning) {
            return false;
        }
        try {
            var indiceQuitar = -1;
            indiceQuitar = (typeof indice == 'string') ? parseInt(indice) : indice;

            if ((this.puntos) && (indiceQuitar < this.puntos.length)) {
                this.puntos[indiceQuitar].marca.setMap(null);
                //this.puntos[indiceQuitar] = [];
            }
        } catch (err) {
            this.showError(err);
        }
    }
    , limpiarPuntos: function ( ) {
        if (!this.isRunning) {
            return false;
        }
        try {
            if (this.puntos) {
                for (var p in this.puntos) {
                    this.puntos[p].marca.setMap(null);
                }
                this.puntos = [];
            }
        } catch (err) {
            this.showError(err);
        }
    }
    , irAPunto: function (indice, zoom) {
        if (!this.isRunning) {
            return false;
        }
        try {
            indice = (typeof indice == 'string') ? parseInt(indice) : indice;

            this.mapa.setCenter(this.puntos[indice].marca.getPosition());

            if ((zoom) && (typeof zoom == 'number')) {
                this.mapa.setZoom(zoom);
            }
        } catch (err) {
            this.showError(err);
        }
    }
    , showInfoWin: function (indice) {
        if (!this.isRunning) {
            return false;
        }
        try {
            indice = (typeof indice == 'string') ? parseInt(indice) : indice;
            this.puntos[indice].info.open(this.mapa, this.puntos[indice].marca);

        } catch (err) {
            this.showError(err);
        }
    }
    /* Capas */
    , ponerCapa: function (opciones)
    {
        if (!this.isRunning) {
            return false;
        }
        try {
            var me = this;
            var configDefault = {
                url: ""
                , tipo: "default"

                , callback: {
                    fn: function () {
                    }
                    , args: {}
                }
            };

            for (var propiedad in configDefault) {
                if (opciones[propiedad] != null && opciones[propiedad] != undefined) {

                } else {
                    opciones[propiedad] = configDefault[propiedad];
                }
            }
            var kmlz = new google.maps.KmlLayer(opciones.url
                    , {
                        preserveViewport: false
                        , suppressInfoWindows: true
                    });
            kmlz.setMap(this.mapa);

            google.maps.event.addListener(kmlz, 'click', function (event) {
                var infoWindow = new google.maps.InfoWindow();
                infoWindow.close();
                infoWindow.setOptions(
                        {
                            content: event.featureData.infoWindowHtml,
                            position: event.latLng,
                            pixelOffset: event.pixelOffset
                        });
                infoWindow.open(me.mapa, kmlz);
            });
            var capa = {
                url: opciones.url
                , tipo: opciones.tipo
                , capa: kmlz
            };

            this.capas.push(capa);

            //return ( this.capas.length - 1 );
        } catch (err) {
            this.showError(err);
            return -1;
        }
        return -1;
    }
    , quitarTipoCapa: function (tipo) {
        if (!this.isRunning) {
            return false;
        }
        try {
            if (this.capas) {
                for (var c in this.capas) {
                    if (this.capas[c].tipo == tipo)
                        this.capas[c].capa.setMap(null);
                }
            }
        } catch (err) {
            this.showError(err);
        }
    }
    , quitarCapa: function (indice) {
        if (!this.isRunning) {
            return false;
        }
        try {
            var indiceQuitar = -1;
            indiceQuitar = (typeof indice == 'string') ? parseInt(indice) : indice;
            if ((this.capas) && (indiceQuitar < this.capas.length)) {
                this.capas[indiceQuitar].capa.setMap(null);
            }
        } catch (err) {
            this.showError(err);
        }
    }
    , limpiarCapas: function (  ) {
        if (!this.isRunning) {
            return false;
        }
        try {
            if (this.capas) {
                for (var c in this.capas) {
                    if (this.capas[c].tipo != "default")
                        this.capas[c].capa.setMap(null);
                }
                this.capas = [];
            }
        } catch (err) {
            this.showError(err);
        }
    }
    , ponerCapaCalor: function (opciones) {
        if (!this.isRunning) {
            return false;
        }
        try {
            var configDefault = {
                tipo: "calor"
                , datos: []
                , callback: {
                    fn: function () {
                    }
                    , args: {}
                }
            };

            for (var propiedad in configDefault) {
                if (opciones[propiedad] != null && opciones[propiedad] != "undefined") {

                } else {
                    opciones[propiedad] = configDefault[propiedad];
                }
            }

            var puntos = new Array();
            for (var i = 0; i < opciones.datos.length; i++) {
                if (opciones.datos[i].latitud != null && opciones.datos[i].longitud != null)
                    puntos.push(new google.maps.LatLng(opciones.datos[i].latitud, opciones.datos[i].longitud));
            }

            var kpaKlor = new google.maps.visualization.HeatmapLayer({
                data: puntos
            });
            kpaKlor.setMap(this.mapa);

            opciones.callback.args.tipo = opciones.tipo;
            opciones.callback.args.capa = kpaKlor;

            google.maps.event.addListener(kpaKlor, 'click', function (event) {

                opciones.callback.args.evento = {
                    clickEven: event
                    , lat: event.latLng.lat()
                    , lng: event.latLng.lng()
                };
                opciones.callback.fn(opciones.callback.args);
            });

            var capa = {
                url: opciones.url
                , tipo: opciones.tipo
                , capa: kpaKlor
            };

            this.capas.push(capa);

            return (this.capas.length - 1);
        } catch (err) {
            this.showError(err);
            return -1;
        }
        return -1;
    }

    /* Listeners */
    , listenerMapa: function (callback) {
        if (!this.isRunning) {
            return false;
        }
        if (!callback) {
            return false;
        }
        try {
            google.maps.event.addListener(this.mapa, 'click', function (event) {

                callback.args.evento = {
                    clickEven: event
                    , lat: event.latLng.lat()
                    , lng: event.latLng.lng()
                };
                callback.fn(callback.args);
            });
        } catch (er) {
            this.showError(err);
        }
    }
    , unlistenerMapa: function () {
        if (!this.isRunning) {
            return false;
        }

        try {
            google.maps.event.clearListeners(this.mapa, 'click', function (event) {

            });
        } catch (er) {
            console.warn(er);
        }
    }
    , listenerCapa: function (capa, callback) {
        if (!this.isRunning) {
            return false;
        }
        if (!callback) {
            return false;
        }
        try {
            var capasListener = new Array();

            if (typeof capa == 'number') {
                capasListener.push(this.capas[capa].capa);
            } else if (typeof capa == 'string') {
                for (var c in this.capas) {
                    if (this.capas[c].tipo == capa) {
                        capasListener.push(this.capas[c].capa);
                    }
                }
            } else {
                capasListener.push(capa);
            }

            for (var cl in capasListener) {
                google.maps.event.addListener(capasListener[cl], 'click', function (event) {

                    var clave = "";
                    var tipoClave = "";

                    $("<div/>", {id: "contTemp", html: event.featureData.description}).appendTo("body");
                    $("#contTemp").hide();
                    $("#contTemp").find("table").each(function () {
                        $(this).find("td").each(function () {

                            if ($(this).html() == "CVE_MUN") {
                                clave = $(this).siblings("td").html();
                                tipoClave = "Mun";
                                return false;
                            }
                        });
                    });
                    $("#contTemp").remove();

                    callback.args.evento = {
                        clickEven: event
                        , clave: clave
                        , tipoClave: tipoClave
                        , lat: event.latLng.lat()
                        , lng: event.latLng.lng()
                    };
                    callback.fn(callback.args);
                });
            }
        } catch (er) {
            this.showError(err);
        }
    }
    , clearListenerCapa: function (capa) {
        if (!this.isRunning) {
            return false;
        }

        try {
            var capasClearListener = new Array();

            if (typeof capa == 'number') {
                capasClearListener.push(this.capas[capa].capa);
            } else if (typeof capa == 'string') {
                for (var c in this.capas) {
                    if (this.capas[c].tipo == capa) {
                        capasClearListener.push(this.capas[c].capa);
                    }
                }
            } else {
                capasClearListener.push(capa);
            }

            for (var clc in capasClearListener) {
                google.maps.event.clearListeners(capasClearListener[clc], 'click', function (event) {

                });
            }
        } catch (er) {
            console.warn(er);
        }
    }
    , showError: function (err) {
        console.warn(err);
    }

    /* Modo lienzo de dibujo */
    , ponerDibujante: function (opciones) {
        if (!this.isRunning) {
            return false;
        }
        try {
            var me = this;
            if (this.isDibujando == false) {
                var tipoDibujo = opciones.tipo || this.MARKER;

                this.dibujante = new google.maps.drawing.DrawingManager({
                    drawingMode: tipoDibujo,
                    drawingControl: true,
                    drawingControlOptions: {
                        position: google.maps.ControlPosition.TOP_CENTER,
                        drawingModes: [tipoDibujo]
                    }
                    , markerOptions: {
                    }
                    , polygonOptions: {
                        strokeColor: "#FFCC00"
                    }
                    , polylineOptions: {
                        strokeColor: "#FFCC00"
                    }
                });
                google.maps.event.addListener(this.dibujante, 'overlaycomplete', function (event) {
                    if (event.type == google.maps.drawing.OverlayType.POLYLINE) {
                        if (opciones.hasOwnProperty('fn') && typeof opciones.fn == 'function') {
                            var args = opciones.args || {};

                            args.event = event;

                            args.tipo = event.type;
                            args.coordenadas = [];
                            var coordenadas_uax = event.overlay.getPath().getArray();
                            for (var i = 0; i < coordenadas_uax.length; i++) {
                                args.coordenadas.push({
                                    lat: coordenadas_uax[i].lat()
                                    , lng: coordenadas_uax[i].lng()
                                            //,alt:'0'
                                });
                            }

                            opciones.fn(args);
                        }
                    } else if (event.type == google.maps.drawing.OverlayType.POLYGON) {
                        if (opciones.hasOwnProperty('fn') && typeof opciones.fn == 'function') {
                            var args = opciones.args || {};

                            args.event = event;

                            args.tipo = event.type;
                            args.coordenadas = [];
                            var coordenadas_uax = event.overlay.getPath().getArray();
                            for (var i = 0; i < coordenadas_uax.length; i++) {
                                args.coordenadas.push({
                                    lat: coordenadas_uax[i].lat()
                                    , lng: coordenadas_uax[i].lng()
                                            //,alt:'0'
                                });
                            }
                            opciones.fn(args);
                        }
                    } else if (event.type == google.maps.drawing.OverlayType.MARKER) {
                        if (opciones.hasOwnProperty('fn') && typeof opciones.fn == 'function') {
                            var args = opciones.args || {};

                            args.event = event;

                            args.tipo = event.type;
                            args.coordenadas = [];
                            args.coordenadas.push({
                                lat: event.overlay.getPosition().lat()
                                , lng: event.overlay.getPosition().lng()
                                        //,alt:'0'
                            });
                            opciones.fn(args);
                        }
                    }
                    event.overlay.setMap(null);
                });
                this.dibujante.setMap(this.mapa);
                this.isDibujando = true;
            }
        } catch (err) {
            this.showError(err);
            return -1;
        }
        return -1;
    }
    , quitarDibujante: function ()
    {
        if (!$.isEmptyObject(this.dibujante)) {
            this.dibujante.setMap(null);
        }
        this.dibujante = {};
        this.isDibujando = false;
    }
    , ponerDibujo: function (opciones)
    {
        if (!this.isRunning) {
            return false;
        }
        if (opciones.coordenadas.length < 1) {
            return false;
        }
        try {
            var me = this;
            switch (opciones.tipo) {
                case me.MARKER:
                    {
                        var coordenadas = {
                            lat: opciones.coordenadas[0].lat,
                            lng: opciones.coordenadas[0].lng
                        };
                        var pinColor;
                        var pinImagen;
                        var numLista = opciones.coordenadas[0].punto_id;

                        var punto = new google.maps.Marker({
                            position: new google.maps.LatLng(coordenadas.lat, coordenadas.lng),
                            map: this.mapa
                        });

                        var visible = true;
                        if (opciones.hasOwnProperty('visible')) {
                            visible = opciones.visible;
                        }

                        if (opciones.coordenadas[0].color == '#FFD700') {
                            //CON DOMICILIO
                            pinColor = "FFFF00";
                            pinImagen = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + numLista + "|" + pinColor,
                                    new google.maps.Size(22, 35),
                                    new google.maps.Point(0, 0));

                            punto.setIcon(pinImagen);
                        } else if (opciones.coordenadas[0].color == '#808080') {
                            //SIN DOMICILIO
                            pinColor = "FE7569";
                            pinImagen = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + numLista + "|" + pinColor,
                                    new google.maps.Size(22, 35),
                                    new google.maps.Point(0, 0));

                            punto.setIcon(pinImagen);
                        } else {
                            //PUNTO NUEVO
                            punto.setIcon('assets/img/markers/red-dot.png');
                        }

                        punto.setVisible(visible);

                        opciones.drw = punto;
                        if (opciones.infoWindow) {
                            google.maps.event.addListener(punto, 'click', function (e) {
                                var infowindow = new google.maps.InfoWindow({
                                    content: "<div id='wrap'>" + opciones.puntosimagenes + "</div>"
                                });
                                infowindow.open(me.mapa, punto);
                            });

                        }

                        var indice = (this.dibujos.push(opciones) - 1);
                        return indice;
                    }
                    break;
                case me.POLYLINE:
                    {
                        var color = opciones.color || "#00FF00";
                        var coordenadas_aux = opciones.coordenadas || [];

                        var coordenadas = new Array();
                        var punto;
                        var pinColor;
                        var pinImagen;
                        var numLista;
                        opciones.drw2 = new Array();
                        for (var i = 0; i < coordenadas_aux.length; i++) {
                            coordenadas.push(new google.maps.LatLng(coordenadas_aux[i].lat, coordenadas_aux[i].lng));
                            numLista = opciones.coordenadas[i].punto_id;

                            punto = new google.maps.Marker({
                                position: coordenadas[i],
                                map: this.mapa
                            });

                            if (opciones.coordenadas[i].color == '#FFD700') {
                                //CON DOMICILIO
                                pinColor = "FFFF00";
                                pinImagen = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + numLista + "|" + pinColor,
                                        new google.maps.Size(22, 35),
                                        new google.maps.Point(0, 0));

                                punto.setIcon(pinImagen);
                            } else if (opciones.coordenadas[i].color == '#808080') {
                                //SIN DOMICILIO
                                pinColor = "FE7569";
                                pinImagen = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + numLista + "|" + pinColor,
                                        new google.maps.Size(22, 35),
                                        new google.maps.Point(0, 0));

                                punto.setIcon(pinImagen);
                            } else {
                                //PUNTO NUEVO
                                punto.setIcon('assets/img/markers/red-dot.png');
                            }

                            opciones.drw2.push(punto);
                        }
                        var polilinea = new google.maps.Polyline({
                            path: coordenadas,
                            strokeColor: color,
                            strokeOpacity: 1.0,
                            strokeWeight: 2
                        });
                        var visible = true;
                        if (opciones.hasOwnProperty('visible')) {
                            visible = opciones.visible;
                        }
                        polilinea.setVisible(visible);
                        polilinea.setMap(this.mapa);

                        google.maps.event.addListener(polilinea, 'click', function (e) {
                            var infowindow = new google.maps.InfoWindow({
                                content: opciones.puntosimagenes,
                                position: e.latLng
                            });
                            infowindow.open(me.mapa);
                        });

                        opciones.drw = polilinea;

                        var indice = (this.dibujos.push(opciones) - 1);
                        return indice;
                    }
                    break;
                case me.POLYGON:
                    {
                        var color = opciones.color || "#FF0000";
                        var coordenadas_aux = opciones.coordenadas || [];

                        var coordenadas = new Array();
                        var punto;
                        var pinColor;
                        var pinImagen;
                        var numLista;
                        opciones.drw2 = new Array();
                        for (var i = 0; i < coordenadas_aux.length; i++) {
                            coordenadas.push(new google.maps.LatLng(coordenadas_aux[i].lat, coordenadas_aux[i].lng));
                            numLista = opciones.coordenadas[i].punto_id;

                            punto = new google.maps.Marker({
                                position: coordenadas[i],
                                map: this.mapa
                            });

                            if (opciones.coordenadas[i].color == '#FFD700') {
                                //CON DOMICILIO
                                pinColor = "FFFF00";
                                pinImagen = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + numLista + "|" + pinColor,
                                        new google.maps.Size(22, 35),
                                        new google.maps.Point(0, 0));

                                punto.setIcon(pinImagen);
                            } else if (opciones.coordenadas[i].color == '#808080') {
                                //SIN DOMICILIO
                                pinColor = "FE7569";
                                pinImagen = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=" + numLista + "|" + pinColor,
                                        new google.maps.Size(22, 35),
                                        new google.maps.Point(0, 0));

                                punto.setIcon(pinImagen);
                            } else {
                                //PUNTO NUEVO
                                punto.setIcon('assets/img/markers/red-dot.png');
                            }

                            opciones.drw2.push(punto);
                        }
                        var poligono = new google.maps.Polygon({
                            path: coordenadas,
                            strokeColor: color,
                            strokeOpacity: 1.0,
                            strokeWeight: 2
                        });
                        var visible = true;
                        if (opciones.hasOwnProperty('visible')) {
                            visible = opciones.visible;
                        }
                        poligono.setVisible(visible);
                        poligono.setMap(this.mapa);

                        google.maps.event.addListener(poligono, 'click', function (e) {
                            var infowindow = new google.maps.InfoWindow({
                                content: opciones.puntosimagenes,
                                position: e.latLng
                            });
                            infowindow.open(me.mapa);
                        });

                        opciones.drw = poligono;

                        var indice = (this.dibujos.push(opciones) - 1);
                        return indice;
                    }
                    break;
            }
            return -1;
        } catch (err) {
            this.showError(err);
            return -1;
        }
        return -1;
    }
    , setVisibleDibujo: function (indice, visible) {
        if (!this.isRunning) {
            return false;
        }
        try {
            var me = this;
            var indice_q = (typeof indice == 'string') ? parseInt(indice) : indice;

            me.dibujos[indice_q].drw.setVisible(visible);
            if (visible) {
                var lat_pos_0 = me.dibujos[indice_q].coordenadas[0].lat;
                var lng_pos_0 = me.dibujos[indice_q].coordenadas[0].lng;
                me.centrarEn(lat_pos_0, lng_pos_0, 18);
            }

        } catch (err) {
            this.showError(err);
            return -1;
        }
    }
    , centrarEn: function (lat, lng, zoom, color)
    {
        if (!this.isRunning) {
            return false;
        }
        try {
            var me = this;
            if (lat !== null && lng !== null) {
                me.mapa.setCenter(new google.maps.LatLng(lat, lng));
                if (zoom) {
                    me.mapa.setZoom(zoom);
                }

                var markerNew = new google.maps.Marker({
                    map: me.mapa,
                    draggable: true,
                    animation: google.maps.Animation.BOUNCE,
                    position: new google.maps.LatLng(lat, lng)
                });

                if (color == '#FFD700') {
                    markerNew.setIcon('app/images/markers/yellow-dot.png');
                } else {
                    markerNew.setIcon('assets/img/markers/red-dot.png');
                }

                setTimeout(function () {
                    markerNew.setAnimation(null);
                    markerNew.setMap(null);
                }, 5000);

                /**/

            } else {

            }
        } catch (err) {
            this.showError(err);
        }
    }
    , limpiarDibujos: function ( )
    {
        if (!this.isRunning) {
            return false;
        }
        try {
            var me = this;

            if (me.dibujos) {
                for (var i in me.dibujos) {
                    if (me.dibujos[i].hasOwnProperty("drw2")) {
                        for (var j in me.dibujos[i].drw2) {
                            me.dibujos[i].drw2[j].setMap(null);
                        }
                    }

                    if (me.dibujos[i].drw != null) {
                        me.dibujos[i].drw.setMap(null);
                        me.dibujos[i] = {/* objeto vacio */};
                    }
                }
                me.dibujos = [];
            }
        } catch (err) {
            this.showError(err);
        }
    }
    , quitarDibujo: function (indice)
    {
        if (!this.isRunning) {
            return false;
        }
        try {
            var me = this;

            if (me.dibujos) {
                var indice_q = (typeof indice == 'string') ? parseInt(indice) : indice;
                if (indice_q < me.dibujos.length) {
                    me.dibujos[indice_q].drw.setMap(null);
                    me.dibujos[indice_q] = {/* objeto vacio */};
                }
            }
        } catch (err) {
            this.showError(err);
        }
    }
};