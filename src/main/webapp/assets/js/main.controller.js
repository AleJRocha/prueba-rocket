/* global bootbox, bonito */

function getBootstrapDeviceSize() {
    return $('#users-device-size').find('div:visible').first().attr('id');
}

var jashsparams = {};
var jashs = [];

$(function () {

    $.ajaxSetup({
        type: "POST"
        , async: true
        , dataType: "json"
        , contentType: "application/x-www-form-urlencoded"
        , timeout: 300000
        , error: function ( ) {
        }
        , beforeSend: function ( ) {
        }
    });
    
    bootbox.setDefaults({locale: "es"});

    $(document.body).on('hide.bs.modal', function () {
        $('body').css('padding-right', 0);
    }).on('hidden.bs.modal', function () {
        $('body').css('padding-right', 0);
    });

    $(document.body).on('show.bs.modal', function () {
        $('body').css('padding-right', 0);
    }).on('shown.bs.modal', function () {
        $('body').css('padding-right', 0);
    });

    $('body').on("click", 'a[href^="#!/"]', function (event) {
        event.preventDefault();
        try {
            var link = $(this);
            window.location.hash = link.attr("href");
        } catch (er) {
            console.warn(er);
        }
    });


    $(window).on('hashchange', function () {
        var hash = window.location.hash;
        var moduloBuscado = hash.substring(0, hash.indexOf("/", 3) + 1);
        for (var itJash = 0, numJashs = jashs.length; itJash < numJashs; itJash++) {

            var hashIt = jashs[itJash].hash;
            var moduloIt = hashIt.substring(0, hashIt.indexOf("/", 3) + 1);
            if (moduloBuscado === moduloIt) {
                var parametros = {};

                var modulo = moduloBuscado.replace("#!/", "").replace("/", "");
                parametros.modulo = modulo;
                // verificar si tiene :param
                var subpartParametros = hashIt;

                if (subpartParametros.length > 0) {
                    var nombres = [];
                    var match = "";
                    var re = /(?:^|\W):(\w+)(?!\w)/g, match, nombres = [];
                    while (match = re.exec(subpartParametros)) {
                        nombres.push(match[1]);
                    }

                    var valores = hash.replace(moduloIt, "");
                    // quitar ultima diagonal (si tiene)
                    if (valores.charAt(valores.length - 1) === "/") {
                        valores = valores.substring(0, (valores.length - 1));
                    }
                    valores = valores.split("/");
                    for (var itNom = 0, numNoms = nombres.length; itNom < numNoms; itNom++) {
                        parametros[nombres[itNom]] = valores[itNom];
                    }
                }
                jashsparams = parametros;
                jashs[itJash].onSet(parametros);
                break;
            }
        }
    });
    
    if ((window.location.hash.substring(0, 3) === "#!/")) {
        $(window).trigger("hashchange");
    }
});

var app = angular.module('app', []);