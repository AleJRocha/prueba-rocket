/* global bonito */ 

$(function () {
    try {
        $formUsuario = $("#formUsuario").formValidation({
            framework: "bootstrap", locale: "es_ES", excluded: [':disabled'],
            fields: {
                inputPasswordActual: {validators: {notEmpty: {}}},
                inputPasswordNuevo: {validators: {notEmpty: {}, stringLength: {min: 8}}}
            }
        }).on("err.field.fv", function (e, data) {
            data.fv.disableSubmitButtons(false);
        }).on("success.field.fv", function (e, data) {
            data.fv.disableSubmitButtons(false);
        }).data().formValidation;

        $("#buttonGenerarPassword").on("click", function (event) {
            event.preventDefault();
            try {
                var longitud = 12;
                var randomText = "";
                var caracteresPosibles = "$&.ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
                for (var i = 0; i < longitud; i++) {
                    randomText += caracteresPosibles.charAt(Math.floor(Math.random() * caracteresPosibles.length));
                }

                $("#inputPasswordNuevo").val(randomText);
            } catch (er) {
                console.error(er);
            }
        });

        $("#buttonMostrarPassword").on("click", function (event) {
            event.preventDefault();
            try {
                if ($("#inputPasswordNuevo").is(":text")) {
                    $("#inputPasswordNuevo").attr("type", "password");
                } else {
                    $("#inputPasswordNuevo").attr("type", "text");
                }
            } catch (er) {
                console.error(er);
            }
        });

        $("#buttonActualizarPerfil").on("click", function (event) {
            event.preventDefault();
            try {
                $formUsuario.resetForm(false);
                $formUsuario.validate();
                if (!$formUsuario.isValid()) {
                    return;
                }

                var passwordNuevo = $("#inputPasswordNuevo").val();
                var passwordActual = $("#inputPasswordActual").val();

                bonito.server.request("perfil/cambiarContrasena.data", {
                    passwordNuevo: passwordNuevo,
                    passwordActual: passwordActual
                }, {
                    success: function (respuesta) {

                        if (respuesta.status2) {
                            bootbox.alert({title: "Mensaje", message: respuesta.message});

                            terminarSesion();

                        } else {
                            bootbox.alert({title: "Aviso", message: respuesta.message});
                        }
                    }
                });
            } catch (er) {
                console.error(er);
            }
        });

    } catch (er) {
        console.error(er);
    }
});