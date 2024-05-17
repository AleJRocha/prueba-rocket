/* global kendo */

(function ($) {
    FormValidation.Validator.kendoComboBox = {
        /**
         * @param {FormValidation.Base} validator The validator plugin instance
         * @param {jQuery} $field The jQuery object represents the field element
         * @param {Object} options The validator options
         * @returns {Boolean}
         */
        validate: function (validator, $field, options) {
            var valorInput = $field.data().kendoComboBox.value();
            var esValido = (valorInput !== null && valorInput !== "" && typeof valorInput !== 'undefined');

            return {
                valid: esValido,
                message: 'Seleccione una opción'
            };
        }
    };
}(window.jQuery));

(function ($) {
    FormValidation.Validator.kendoDatePicker = {
        /**
         * @param {FormValidation.Base} validator The validator plugin instance
         * @param {jQuery} $field The jQuery object represents the field element
         * @param {Object} options The validator options
         * @returns {Boolean}
         */
        validate: function (validator, $field, options) {
            var valorInput = kendo.toString($field.data().kendoDatePicker.value(), "dd/MM/yyyy");
            var esValido = (valorInput !== null && valorInput !== "" && typeof valorInput !== 'undefined');
            return {
                valid: esValido,
                message: 'Fecha requerida'
            };
        }
    };
}(window.jQuery));

(function ($) {
    FormValidation.Validator.mayorQueCero = {
        /**
         * @param {FormValidation.Base} validator The validator plugin instance
         * @param {jQuery} $field The jQuery object represents the field element
         * @param {Object} options The validator options
         * @returns {Boolean}
         */
        validate: function (validator, $field, options) {
            var valorInput = $field.val().replace(new RegExp(',', 'g'), '');
            
            $.isNumeric(valorInput);

            /*
             if (valorInput !== null && valorInput !== "" && typeof valorInput !== 'undefined') {
             return {
             valid: false,
             message: 'Introduzca un valor mayor que cero(0)'
             };
             } else if (!(isNaN(valorInput))) {
             return {
             valid: false,
             message: 'Introduzca un valor mayor que cero(0)'
             };
             } else {
             return {
             valid: true
             };
             }
             
             if ("" === f)
             return !0;
             f = this._format(f);
             var g = b.getLocale(),
             h = a.isNumeric(d.value) ? d.value : b.getDynamicOption(c, d.value),
             i = this._format(h);
             return d.inclusive === !0 || void 0 === d.inclusive ? {
             valid: a.isNumeric(f) && parseFloat(f) >= i,
             message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].greaterThan["default"], h)
             } : {
             valid: a.isNumeric(f) && parseFloat(f) > i,
             message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].greaterThan.notInclusive, h)
             }
             */
        }
    };
}(window.jQuery));

