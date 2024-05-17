if (window.FormValidation = {
    AddOn: {},
    Framework: {},
    I18n: {},
    Validator: {}
}, "undefined" == typeof jQuery)
    throw new Error("FormValidation requires jQuery");
!function (a) {
    var b = a.fn.jquery.split(" ")[0].split(".");
    if (+b[0] < 2 && +b[1] < 9 || 1 === +b[0] && 9 === +b[1] && +b[2] < 1)
        throw new Error("FormValidation requires jQuery version 1.9.1 or higher")
}(jQuery),
        function (a) {
            FormValidation.Base = function (b, c, d) {
                this.$form = a(b), this.options = a.extend({}, a.fn.formValidation.DEFAULT_OPTIONS, c), this._namespace = d || "fv", this.$invalidFields = a([]), this.$submitButton = null, this.$hiddenButton = null, this.STATUS_NOT_VALIDATED = "NOT_VALIDATED", this.STATUS_VALIDATING = "VALIDATING", this.STATUS_INVALID = "INVALID", this.STATUS_VALID = "VALID", this.STATUS_IGNORED = "IGNORED", this.DEFAULT_MESSAGE = a.fn.formValidation.DEFAULT_MESSAGE, this._ieVersion = function () {
                    for (var a = 3, b = document.createElement("div"), c = b.all || []; b.innerHTML = "<!--[if gt IE " + ++a + "]><br><![endif]-->", c[0]; )
                        ;
                    return a > 4 ? a : document.documentMode
                }();
                var e = document.createElement("div");
                this._changeEvent = 9 !== this._ieVersion && "oninput" in e ? "input" : "keyup", this._submitIfValid = null, this._cacheFields = {}, this._init()
            }, FormValidation.Base.prototype = {
                constructor: FormValidation.Base,
                _exceedThreshold: function (b) {
                    var c = this._namespace,
                            d = b.attr("data-" + c + "-field"),
                            e = this.options.fields[d].threshold || this.options.threshold;
                    if (!e)
                        return !0;
                    var f = -1 !== a.inArray(b.attr("type"), ["button", "checkbox", "file", "hidden", "image", "radio", "reset", "submit"]);
                    return f || b.val().length >= e
                },
                _init: function () {
                    var b = this,
                            c = this._namespace,
                            d = {
                                addOns: {},
                                autoFocus: this.$form.attr("data-" + c + "-autofocus"),
                                button: {
                                    selector: this.$form.attr("data-" + c + "-button-selector") || this.$form.attr("data-" + c + "-submitbuttons"),
                                    disabled: this.$form.attr("data-" + c + "-button-disabled")
                                },
                                control: {
                                    valid: this.$form.attr("data-" + c + "-control-valid"),
                                    invalid: this.$form.attr("data-" + c + "-control-invalid")
                                },
                                err: {
                                    clazz: this.$form.attr("data-" + c + "-err-clazz"),
                                    container: this.$form.attr("data-" + c + "-err-container") || this.$form.attr("data-" + c + "-container"),
                                    parent: this.$form.attr("data-" + c + "-err-parent")
                                },
                                events: {
                                    formInit: this.$form.attr("data-" + c + "-events-form-init"),
                                    formPreValidate: this.$form.attr("data-" + c + "-events-form-prevalidate"),
                                    formError: this.$form.attr("data-" + c + "-events-form-error"),
                                    formReset: this.$form.attr("data-" + c + "-events-form-reset"),
                                    formSuccess: this.$form.attr("data-" + c + "-events-form-success"),
                                    fieldAdded: this.$form.attr("data-" + c + "-events-field-added"),
                                    fieldRemoved: this.$form.attr("data-" + c + "-events-field-removed"),
                                    fieldInit: this.$form.attr("data-" + c + "-events-field-init"),
                                    fieldError: this.$form.attr("data-" + c + "-events-field-error"),
                                    fieldReset: this.$form.attr("data-" + c + "-events-field-reset"),
                                    fieldSuccess: this.$form.attr("data-" + c + "-events-field-success"),
                                    fieldStatus: this.$form.attr("data-" + c + "-events-field-status"),
                                    localeChanged: this.$form.attr("data-" + c + "-events-locale-changed"),
                                    validatorError: this.$form.attr("data-" + c + "-events-validator-error"),
                                    validatorSuccess: this.$form.attr("data-" + c + "-events-validator-success"),
                                    validatorIgnored: this.$form.attr("data-" + c + "-events-validator-ignored")
                                },
                                excluded: this.$form.attr("data-" + c + "-excluded"),
                                icon: {
                                    valid: this.$form.attr("data-" + c + "-icon-valid") || this.$form.attr("data-" + c + "-feedbackicons-valid"),
                                    invalid: this.$form.attr("data-" + c + "-icon-invalid") || this.$form.attr("data-" + c + "-feedbackicons-invalid"),
                                    validating: this.$form.attr("data-" + c + "-icon-validating") || this.$form.attr("data-" + c + "-feedbackicons-validating"),
                                    feedback: this.$form.attr("data-" + c + "-icon-feedback")
                                },
                                live: this.$form.attr("data-" + c + "-live"),
                                locale: this.$form.attr("data-" + c + "-locale"),
                                message: this.$form.attr("data-" + c + "-message"),
                                onPreValidate: this.$form.attr("data-" + c + "-onprevalidate"),
                                onError: this.$form.attr("data-" + c + "-onerror"),
                                onReset: this.$form.attr("data-" + c + "-onreset"),
                                onSuccess: this.$form.attr("data-" + c + "-onsuccess"),
                                row: {
                                    selector: this.$form.attr("data-" + c + "-row-selector") || this.$form.attr("data-" + c + "-group"),
                                    valid: this.$form.attr("data-" + c + "-row-valid"),
                                    invalid: this.$form.attr("data-" + c + "-row-invalid"),
                                    feedback: this.$form.attr("data-" + c + "-row-feedback")
                                },
                                threshold: this.$form.attr("data-" + c + "-threshold"),
                                trigger: this.$form.attr("data-" + c + "-trigger"),
                                verbose: this.$form.attr("data-" + c + "-verbose"),
                                fields: {}
                            };
                    this.$form.attr("novalidate", "novalidate").addClass(this.options.elementClass).on("submit." + c, function (a) {
                        a.preventDefault(), b.validate()
                    }).on("click." + c, this.options.button.selector, function () {
                        b.$submitButton = a(this), b._submitIfValid = !0
                    }), (this.options.declarative === !0 || "true" === this.options.declarative) && this.$form.find("[name], [data-" + c + "-field]").each(function () {
                        var e = a(this),
                                f = e.attr("name") || e.attr("data-" + c + "-field"),
                                g = b._parseOptions(e);
                        g && (e.attr("data-" + c + "-field", f), d.fields[f] = a.extend({}, g, d.fields[f]))
                    }), this.options = a.extend(!0, this.options, d), "string" == typeof this.options.err.parent && (this.options.err.parent = new RegExp(this.options.err.parent)), this.options.container && (this.options.err.container = this.options.container, delete this.options.container), this.options.feedbackIcons && (this.options.icon = a.extend(!0, this.options.icon, this.options.feedbackIcons), delete this.options.feedbackIcons), this.options.group && (this.options.row.selector = this.options.group, delete this.options.group), this.options.submitButtons && (this.options.button.selector = this.options.submitButtons, delete this.options.submitButtons), FormValidation.I18n[this.options.locale] || (this.options.locale = a.fn.formValidation.DEFAULT_OPTIONS.locale), (this.options.declarative === !0 || "true" === this.options.declarative) && (this.options = a.extend(!0, this.options, {
                        addOns: this._parseAddOnOptions()
                    })), this.$hiddenButton = a("<button/>").attr("type", "submit").prependTo(this.$form).addClass("fv-hidden-submit").css({
                        display: "none",
                        width: 0,
                        height: 0
                    }), this.$form.on("click." + this._namespace, '[type="submit"]', function (c) {
                        if (!c.isDefaultPrevented()) {
                            var d = a(c.target),
                                    e = d.is('[type="submit"]') ? d.eq(0) : d.parent('[type="submit"]').eq(0);
                            if (b.options.button.selector && !e.is(b.options.button.selector) && !e.is(b.$hiddenButton))
                                return b.$form.off("submit." + b._namespace).submit(), !1
                        }
                    });
                    for (var e in this.options.fields)
                        this._initField(e);
                    for (var f in this.options.addOns)
                        "function" == typeof FormValidation.AddOn[f].init && FormValidation.AddOn[f].init(this, this.options.addOns[f]);
                    this.$form.trigger(a.Event(this.options.events.formInit), {
                        bv: this,
                        fv: this,
                        options: this.options
                    }), this.options.onPreValidate && this.$form.on(this.options.events.formPreValidate, function (a) {
                        FormValidation.Helper.call(b.options.onPreValidate, [a])
                    }), this.options.onSuccess && this.$form.on(this.options.events.formSuccess, function (a) {
                        FormValidation.Helper.call(b.options.onSuccess, [a])
                    }), this.options.onError && this.$form.on(this.options.events.formError, function (a) {
                        FormValidation.Helper.call(b.options.onError, [a])
                    }), this.options.onReset && this.$form.on(this.options.events.formReset, function (a) {
                        FormValidation.Helper.call(b.options.onReset, [a])
                    })
                },
                _initField: function (b) {
                    var c = this._namespace,
                            d = a([]);
                    switch (typeof b) {
                        case "object":
                            d = b, b = b.attr("data-" + c + "-field");
                            break;
                        case "string":
                            d = this.getFieldElements(b), d.attr("data-" + c + "-field", b)
                    }
                    if (0 !== d.length && null !== this.options.fields[b] && null !== this.options.fields[b].validators) {
                        var e, f, g = this.options.fields[b].validators;
                        for (e in g)
                            f = g[e].alias || e, FormValidation.Validator[f] || delete this.options.fields[b].validators[e];
                        null === this.options.fields[b].enabled && (this.options.fields[b].enabled = !0);
                        for (var h = this, i = d.length, j = d.attr("type"), k = 1 === i || "radio" === j || "checkbox" === j, l = this._getFieldTrigger(d.eq(0)), m = this.options.err.clazz.split(" ").join("."), n = a.map(l, function (a) {
                            return a + ".update." + c
                        }).join(" "), o = 0; i > o; o++) {
                            var p = d.eq(o),
                                    q = this.options.fields[b].row || this.options.row.selector,
                                    r = p.closest(q),
                                    s = "function" == typeof (this.options.fields[b].container || this.options.fields[b].err || this.options.err.container) ? (this.options.fields[b].container || this.options.fields[b].err || this.options.err.container).call(this, p, this) : this.options.fields[b].container || this.options.fields[b].err || this.options.err.container,
                                    t = s && "tooltip" !== s && "popover" !== s ? a(s) : this._getMessageContainer(p, q);
                            s && "tooltip" !== s && "popover" !== s && t.addClass(this.options.err.clazz), t.find("." + m + "[data-" + c + "-validator][data-" + c + '-for="' + b + '"]').remove(), r.find("i[data-" + c + '-icon-for="' + b + '"]').remove(), p.off(n).on(n, function () {
                                h.updateStatus(a(this), h.STATUS_NOT_VALIDATED)
                            }), p.data(c + ".messages", t);
                            for (e in g)
                                p.data(c + ".result." + e, this.STATUS_NOT_VALIDATED), k && o !== i - 1 || a("<small/>").css("display", "none").addClass(this.options.err.clazz).attr("data-" + c + "-validator", e).attr("data-" + c + "-for", b).attr("data-" + c + "-result", this.STATUS_NOT_VALIDATED).html(this._getMessage(b, e)).appendTo(t), f = g[e].alias || e, "function" == typeof FormValidation.Validator[f].init && FormValidation.Validator[f].init(this, p, this.options.fields[b].validators[e], e);
                            if (this.options.fields[b].icon !== !1 && "false" !== this.options.fields[b].icon && this.options.icon && this.options.icon.valid && this.options.icon.invalid && this.options.icon.validating && (!k || o === i - 1)) {
                                r.addClass(this.options.row.feedback);
                                var u = a("<i/>").css("display", "none").addClass(this.options.icon.feedback).attr("data-" + c + "-icon-for", b).insertAfter(p);
                                (k ? d : p).data(c + ".icon", u), ("tooltip" === s || "popover" === s) && ((k ? d : p).on(this.options.events.fieldError, function () {
                                    r.addClass("fv-has-tooltip")
                                }).on(this.options.events.fieldSuccess, function () {
                                    r.removeClass("fv-has-tooltip")
                                }), p.off("focus.container." + c).on("focus.container." + c, function () {
                                    h._showTooltip(a(this), s)
                                }).off("blur.container." + c).on("blur.container." + c, function () {
                                    h._hideTooltip(a(this), s)
                                })), "string" == typeof this.options.fields[b].icon && "true" !== this.options.fields[b].icon ? u.appendTo(a(this.options.fields[b].icon)) : this._fixIcon(p, u)
                            }
                        }
                        var v = [];
                        for (e in g)
                            f = g[e].alias || e, g[e].priority = parseInt(g[e].priority || FormValidation.Validator[f].priority || 1, 10), v.push({
                                validator: e,
                                priority: g[e].priority
                            });
                        v = v.sort(function (a, b) {
                            return a.priority - b.priority
                        }), d.data(c + ".validators", v).on(this.options.events.fieldSuccess, function (a, b) {
                            var c = h.getOptions(b.field, null, "onSuccess");
                            c && FormValidation.Helper.call(c, [a, b])
                        }).on(this.options.events.fieldError, function (a, b) {
                            var c = h.getOptions(b.field, null, "onError");
                            c && FormValidation.Helper.call(c, [a, b])
                        }).on(this.options.events.fieldReset, function (a, b) {
                            var c = h.getOptions(b.field, null, "onReset");
                            c && FormValidation.Helper.call(c, [a, b])
                        }).on(this.options.events.fieldStatus, function (a, b) {
                            var c = h.getOptions(b.field, null, "onStatus");
                            c && FormValidation.Helper.call(c, [a, b])
                        }).on(this.options.events.validatorError, function (a, b) {
                            var c = h.getOptions(b.field, b.validator, "onError");
                            c && FormValidation.Helper.call(c, [a, b])
                        }).on(this.options.events.validatorIgnored, function (a, b) {
                            var c = h.getOptions(b.field, b.validator, "onIgnored");
                            c && FormValidation.Helper.call(c, [a, b])
                        }).on(this.options.events.validatorSuccess, function (a, b) {
                            var c = h.getOptions(b.field, b.validator, "onSuccess");
                            c && FormValidation.Helper.call(c, [a, b])
                        }), this.onLiveChange(d, "live", function () {
                            h._exceedThreshold(a(this)) && h.validateField(a(this))
                        }), d.trigger(a.Event(this.options.events.fieldInit), {
                            bv: this,
                            fv: this,
                            field: b,
                            element: d
                        })
                    }
                },
                _isExcluded: function (b) {
                    var c = this._namespace,
                            d = b.attr("data-" + c + "-excluded"),
                            e = b.attr("data-" + c + "-field") || b.attr("name");
                    switch (!0) {
                        case !!e && this.options.fields && this.options.fields[e] && ("true" === this.options.fields[e].excluded || this.options.fields[e].excluded === !0):
                        case "true" === d:
                        case "" === d:
                            return !0;
                        case !!e && this.options.fields && this.options.fields[e] && ("false" === this.options.fields[e].excluded || this.options.fields[e].excluded === !1):
                        case "false" === d:
                            return !1;
                        case !!e && this.options.fields && this.options.fields[e] && "function" == typeof this.options.fields[e].excluded:
                            return this.options.fields[e].excluded.call(this, b, this);
                        case !!e && this.options.fields && this.options.fields[e] && "string" == typeof this.options.fields[e].excluded:
                        case d:
                            return FormValidation.Helper.call(this.options.fields[e].excluded, [b, this]);
                        default:
                            if (this.options.excluded) {
                                "string" == typeof this.options.excluded && (this.options.excluded = a.map(this.options.excluded.split(","), function (b) {
                                    return a.trim(b)
                                }));
                                for (var f = this.options.excluded.length, g = 0; f > g; g++)
                                    if ("string" == typeof this.options.excluded[g] && b.is(this.options.excluded[g]) || "function" == typeof this.options.excluded[g] && this.options.excluded[g].call(this, b, this) === !0)
                                        return !0
                            }
                            return !1
                    }
                },
                _getFieldTrigger: function (a) {
                    var b = this._namespace,
                            c = a.data(b + ".trigger");
                    if (c)
                        return c;
                    var d = a.attr("type"),
                            e = a.attr("data-" + b + "-field"),
                            f = "radio" === d || "checkbox" === d || "file" === d || "SELECT" === a.get(0).tagName ? "change" : this._ieVersion >= 10 && a.attr("placeholder") ? "keyup" : this._changeEvent;
                    return c = ((this.options.fields[e] ? this.options.fields[e].trigger : null) || this.options.trigger || f).split(" "), a.data(b + ".trigger", c), c
                },
                _getMessage: function (a, b) {
                    if (!this.options.fields[a] || !this.options.fields[a].validators)
                        return "";
                    var c = this.options.fields[a].validators,
                            d = c[b] && c[b].alias ? c[b].alias : b;
                    if (!FormValidation.Validator[d])
                        return "";
                    switch (!0) {
                        case !!c[b].message:
                            return c[b].message;
                        case !!this.options.fields[a].message:
                            return this.options.fields[a].message;
                        case !!this.options.message:
                            return this.options.message;
                        case !!FormValidation.I18n[this.options.locale] && !!FormValidation.I18n[this.options.locale][d] && !!FormValidation.I18n[this.options.locale][d]["default"]:
                            return FormValidation.I18n[this.options.locale][d]["default"];
                        default:
                            return this.DEFAULT_MESSAGE
                    }
                },
                _getMessageContainer: function (a, b) {
                    if (!this.options.err.parent)
                        throw new Error("The err.parent option is not defined");
                    var c = a.parent();
                    if (c.is(b))
                        return c;
                    var d = c.attr("class");
                    return d && this.options.err.parent.test(d) ? c : this._getMessageContainer(c, b)
                },
                _parseAddOnOptions: function () {
                    var a = this._namespace,
                            b = this.$form.attr("data-" + a + "-addons"),
                            c = this.options.addOns || {};
                    if (b) {
                        b = b.replace(/\s/g, "").split(",");
                        for (var d = 0; d < b.length; d++)
                            c[b[d]] || (c[b[d]] = {})
                    }
                    var e, f, g, h;
                    for (e in c)
                        if (FormValidation.AddOn[e]) {
                            if (f = FormValidation.AddOn[e].html5Attributes)
                                for (g in f)
                                    h = this.$form.attr("data-" + a + "-addons-" + e.toLowerCase() + "-" + g.toLowerCase()), h && (c[e][f[g]] = h)
                        } else
                            delete c[e];
                    return c
                },
                _parseOptions: function (b) {
                    var c, d, e, f, g, h, i, j, k, l = this._namespace,
                            m = b.attr("name") || b.attr("data-" + l + "-field"),
                            n = {},
                            o = new RegExp("^data-" + l + "-([a-z]+)-alias$"),
                            p = a.extend({}, FormValidation.Validator);
                    a.each(b.get(0).attributes, function (a, b) {
                        b.value && o.test(b.name) && (d = b.name.split("-")[2], p[b.value] && (p[d] = p[b.value], p[d].alias = b.value))
                    });
                    for (d in p)
                        if (c = p[d], e = "data-" + l + "-" + d.toLowerCase(), f = b.attr(e) + "", k = "function" == typeof c.enableByHtml5 ? c.enableByHtml5(b) : null, k && "false" !== f || k !== !0 && ("" === f || "true" === f || e === f.toLowerCase())) {
                            c.html5Attributes = a.extend({}, {
                                message: "message",
                                onerror: "onError",
                                onreset: "onReset",
                                onsuccess: "onSuccess",
                                priority: "priority",
                                transformer: "transformer"
                            }, c.html5Attributes), n[d] = a.extend({}, k === !0 ? {} : k, n[d]), c.alias && (n[d].alias = c.alias);
                            for (j in c.html5Attributes)
                                g = c.html5Attributes[j], h = "data-" + l + "-" + d.toLowerCase() + "-" + j, i = b.attr(h), i && ("true" === i || h === i.toLowerCase() ? i = !0 : "false" === i && (i = !1), n[d][g] = i)
                        }
                    var q = {
                        autoFocus: b.attr("data-" + l + "-autofocus"),
                        err: b.attr("data-" + l + "-err-container") || b.attr("data-" + l + "-container"),
                        enabled: b.attr("data-" + l + "-enabled"),
                        excluded: b.attr("data-" + l + "-excluded"),
                        icon: b.attr("data-" + l + "-icon") || b.attr("data-" + l + "-feedbackicons") || (this.options.fields && this.options.fields[m] ? this.options.fields[m].feedbackIcons : null),
                        message: b.attr("data-" + l + "-message"),
                        onError: b.attr("data-" + l + "-onerror"),
                        onReset: b.attr("data-" + l + "-onreset"),
                        onStatus: b.attr("data-" + l + "-onstatus"),
                        onSuccess: b.attr("data-" + l + "-onsuccess"),
                        row: b.attr("data-" + l + "-row") || b.attr("data-" + l + "-group") || (this.options.fields && this.options.fields[m] ? this.options.fields[m].group : null),
                        selector: b.attr("data-" + l + "-selector"),
                        threshold: b.attr("data-" + l + "-threshold"),
                        transformer: b.attr("data-" + l + "-transformer"),
                        trigger: b.attr("data-" + l + "-trigger"),
                        verbose: b.attr("data-" + l + "-verbose"),
                        validators: n
                    },
                            r = a.isEmptyObject(q),
                            s = a.isEmptyObject(n);
                    return !s || !r && this.options.fields && this.options.fields[m] ? q : null
                },
                _submit: function () {
                    var b = this.isValid();
                    if (null !== b) {
                        var c = b ? this.options.events.formSuccess : this.options.events.formError,
                                d = a.Event(c);
                        this.$form.trigger(d), this.$submitButton && (b ? this._onSuccess(d) : this._onError(d))
                    }
                },
                _onError: function (b) {
                    if (!b.isDefaultPrevented()) {
                        if ("submitted" === this.options.live) {
                            this.options.live = "enabled";
                            var c = this;
                            for (var d in this.options.fields)
                                !function (b) {
                                    var d = c.getFieldElements(b);
                                    d.length && c.onLiveChange(d, "live", function () {
                                        c._exceedThreshold(a(this)) && c.validateField(a(this))
                                    })
                                }(d)
                        }
                        for (var e = this._namespace, f = 0; f < this.$invalidFields.length; f++) {
                            var g = this.$invalidFields.eq(f),
                                    h = this.isOptionEnabled(g.attr("data-" + e + "-field"), "autoFocus");
                            if (h) {
                                g.focus();
                                break
                            }
                        }
                    }
                },
                _onFieldValidated: function (b, c) {
                    var d = this._namespace,
                            e = b.attr("data-" + d + "-field"),
                            f = this.options.fields[e].validators,
                            g = {},
                            h = 0,
                            i = {
                                bv: this,
                                fv: this,
                                field: e,
                                element: b,
                                validator: c,
                                result: b.data(d + ".response." + c)
                            };
                    if (c)
                        switch (b.data(d + ".result." + c)) {
                            case this.STATUS_INVALID:
                                b.trigger(a.Event(this.options.events.validatorError), i);
                                break;
                            case this.STATUS_VALID:
                                b.trigger(a.Event(this.options.events.validatorSuccess), i);
                                break;
                            case this.STATUS_IGNORED:
                                b.trigger(a.Event(this.options.events.validatorIgnored), i)
                        }
                    g[this.STATUS_NOT_VALIDATED] = 0, g[this.STATUS_VALIDATING] = 0, g[this.STATUS_INVALID] = 0, g[this.STATUS_VALID] = 0, g[this.STATUS_IGNORED] = 0;
                    for (var j in f)
                        if (f[j].enabled !== !1) {
                            h++;
                            var k = b.data(d + ".result." + j);
                            k && g[k]++
                        }
                    g[this.STATUS_VALID] + g[this.STATUS_IGNORED] === h ? (this.$invalidFields = this.$invalidFields.not(b), b.trigger(a.Event(this.options.events.fieldSuccess), i)) : (0 === g[this.STATUS_NOT_VALIDATED] || !this.isOptionEnabled(e, "verbose")) && 0 === g[this.STATUS_VALIDATING] && g[this.STATUS_INVALID] > 0 && (this.$invalidFields = this.$invalidFields.add(b), b.trigger(a.Event(this.options.events.fieldError), i))
                },
                _onSuccess: function (a) {
                    a.isDefaultPrevented() || this.disableSubmitButtons(!0).defaultSubmit()
                },
                _fixIcon: function (a, b) {},
                _createTooltip: function (a, b, c) {},
                _destroyTooltip: function (a, b) {},
                _hideTooltip: function (a, b) {},
                _showTooltip: function (a, b) {},
                defaultSubmit: function () {
                    var b = this._namespace;
                    this.$submitButton && a("<input/>").attr({
                        type: "hidden",
                        name: this.$submitButton.attr("name")
                    }).attr("data-" + b + "-submit-hidden", "").val(this.$submitButton.val()).appendTo(this.$form), this.$form.off("submit." + b).submit()
                },
                disableSubmitButtons: function (a) {
                    return a ? "disabled" !== this.options.live && this.$form.find(this.options.button.selector).attr("disabled", "disabled").addClass(this.options.button.disabled) : this.$form.find(this.options.button.selector).removeAttr("disabled").removeClass(this.options.button.disabled), this
                },
                getFieldElements: function (b) {
                    if (!this._cacheFields[b])
                        if (this.options.fields[b] && this.options.fields[b].selector) {
                            var c = this.$form.find(this.options.fields[b].selector);
                            this._cacheFields[b] = c.length ? c : a(this.options.fields[b].selector)
                        } else
                            this._cacheFields[b] = this.$form.find('[name="' + b + '"]');
                    return this._cacheFields[b]
                },
                getFieldValue: function (a, b) {
                    var c, d = this._namespace;
                    if ("string" == typeof a) {
                        if (c = this.getFieldElements(a), 0 === c.length)
                            return null
                    } else
                        c = a, a = c.attr("data-" + d + "-field");
                    if (!a || !this.options.fields[a])
                        return c.val();
                    var e = (this.options.fields[a].validators && this.options.fields[a].validators[b] ? this.options.fields[a].validators[b].transformer : null) || this.options.fields[a].transformer;
                    return e ? FormValidation.Helper.call(e, [c, b, this]) : c.val()
                },
                getNamespace: function () {
                    return this._namespace
                },
                getOptions: function (a, b, c) {
                    var d = this._namespace;
                    if (!a)
                        return c ? this.options[c] : this.options;
                    if ("object" == typeof a && (a = a.attr("data-" + d + "-field")), !this.options.fields[a])
                        return null;
                    var e = this.options.fields[a];
                    return b ? e.validators && e.validators[b] ? c ? e.validators[b][c] : e.validators[b] : null : c ? e[c] : e
                },
                getStatus: function (a, b) {
                    var c = this._namespace;
                    switch (typeof a) {
                        case "object":
                            return a.data(c + ".result." + b);
                        case "string":
                        default:
                            return this.getFieldElements(a).eq(0).data(c + ".result." + b)
                    }
                },
                isOptionEnabled: function (a, b) {
                    return !this.options.fields[a] || "true" !== this.options.fields[a][b] && this.options.fields[a][b] !== !0 ? !this.options.fields[a] || "false" !== this.options.fields[a][b] && this.options.fields[a][b] !== !1 ? "true" === this.options[b] || this.options[b] === !0 : !1 : !0
                },
                isValid: function () {
                    for (var a in this.options.fields) {
                        var b = this.isValidField(a);
                        if (null === b)
                            return null;
                        if (b === !1)
                            return !1
                    }
                    return !0
                },
                isValidContainer: function (b) {
                    var c = this,
                            d = this._namespace,
                            e = [],
                            f = "string" == typeof b ? a(b) : b;
                    if (0 === f.length)
                        return !0;
                    f.find("[data-" + d + "-field]").each(function () {
                        var b = a(this);
                        c._isExcluded(b) || e.push(b)
                    });
                    for (var g = e.length, h = this.options.err.clazz.split(" ").join("."), i = 0; g > i; i++) {
                        var j = e[i],
                                k = j.attr("data-" + d + "-field"),
                                l = j.data(d + ".messages").find("." + h + "[data-" + d + "-validator][data-" + d + '-for="' + k + '"]');
                        if (!this.options.fields || !this.options.fields[k] || "false" !== this.options.fields[k].enabled && this.options.fields[k].enabled !== !1) {
                            if (l.filter("[data-" + d + '-result="' + this.STATUS_INVALID + '"]').length > 0)
                                return !1;
                            if (l.filter("[data-" + d + '-result="' + this.STATUS_NOT_VALIDATED + '"]').length > 0 || l.filter("[data-" + d + '-result="' + this.STATUS_VALIDATING + '"]').length > 0)
                                return null
                        }
                    }
                    return !0
                },
                isValidField: function (b) {
                    var c = this._namespace,
                            d = a([]);
                    switch (typeof b) {
                        case "object":
                            d = b, b = b.attr("data-" + c + "-field");
                            break;
                        case "string":
                            d = this.getFieldElements(b)
                    }
                    if (0 === d.length || !this.options.fields[b] || "false" === this.options.fields[b].enabled || this.options.fields[b].enabled === !1)
                        return !0;
                    for (var e, f, g, h = d.attr("type"), i = "radio" === h || "checkbox" === h ? 1 : d.length, j = 0; i > j; j++)
                        if (e = d.eq(j), !this._isExcluded(e))
                            for (f in this.options.fields[b].validators)
                                if (this.options.fields[b].validators[f].enabled !== !1) {
                                    if (g = e.data(c + ".result." + f), g === this.STATUS_VALIDATING || g === this.STATUS_NOT_VALIDATED)
                                        return null;
                                    if (g === this.STATUS_INVALID)
                                        return !1
                                }
                    return !0
                },
                offLiveChange: function (b, c) {
                    if (null === b || 0 === b.length)
                        return this;
                    var d = this._namespace,
                            e = this._getFieldTrigger(b.eq(0)),
                            f = a.map(e, function (a) {
                                return a + "." + c + "." + d
                            }).join(" ");
                    return b.off(f), this
                },
                onLiveChange: function (b, c, d) {
                    if (null === b || 0 === b.length)
                        return this;
                    var e = this._namespace,
                            f = this._getFieldTrigger(b.eq(0)),
                            g = a.map(f, function (a) {
                                return a + "." + c + "." + e
                            }).join(" ");
                    switch (this.options.live) {
                        case "submitted":
                            break;
                        case "disabled":
                            b.off(g);
                            break;
                        case "enabled":
                        default:
                            b.off(g).on(g, function (a) {
                                d.apply(this, arguments)
                            })
                    }
                    return this
                },
                updateMessage: function (b, c, d) {
                    var e = this._namespace,
                            f = a([]);
                    switch (typeof b) {
                        case "object":
                            f = b, b = b.attr("data-" + e + "-field");
                            break;
                        case "string":
                            f = this.getFieldElements(b)
                    }
                    var g = this.options.err.clazz.split(" ").join(".");
                    return f.each(function () {
                        a(this).data(e + ".messages").find("." + g + "[data-" + e + '-validator="' + c + '"][data-' + e + '-for="' + b + '"]').html(d)
                    }), this
                },
                updateStatus: function (b, c, d) {
                    var e = this._namespace,
                            f = a([]);
                    switch (typeof b) {
                        case "object":
                            f = b, b = b.attr("data-" + e + "-field");
                            break;
                        case "string":
                            f = this.getFieldElements(b)
                    }
                    if (!b || !this.options.fields[b])
                        return this;
                    c === this.STATUS_NOT_VALIDATED && (this._submitIfValid = !1);
                    for (var g = this, h = f.attr("type"), i = this.options.fields[b].row || this.options.row.selector, j = "radio" === h || "checkbox" === h ? 1 : f.length, k = this.options.err.clazz.split(" ").join("."), l = 0; j > l; l++) {
                        var m = f.eq(l);
                        if (!this._isExcluded(m)) {
                            var n, o, p = m.closest(i),
                                    q = m.data(e + ".messages"),
                                    r = q.find("." + k + "[data-" + e + "-validator][data-" + e + '-for="' + b + '"]'),
                                    s = d ? r.filter("[data-" + e + '-validator="' + d + '"]') : r,
                                    t = m.data(e + ".icon"),
                                    u = "function" == typeof (this.options.fields[b].container || this.options.fields[b].err || this.options.err.container) ? (this.options.fields[b].container || this.options.fields[b].err || this.options.err.container).call(this, m, this) : this.options.fields[b].container || this.options.fields[b].err || this.options.err.container,
                                    v = null;
                            if (d)
                                m.data(e + ".result." + d, c);
                            else
                                for (var w in this.options.fields[b].validators)
                                    m.data(e + ".result." + w, c);
                            switch (s.attr("data-" + e + "-result", c), c) {
                                case this.STATUS_VALIDATING:
                                    v = null, this.disableSubmitButtons(!0), m.removeClass(this.options.control.valid).removeClass(this.options.control.invalid), p.removeClass(this.options.row.valid).removeClass(this.options.row.invalid), t && t.removeClass(this.options.icon.valid).removeClass(this.options.icon.invalid).addClass(this.options.icon.validating).show();
                                    break;
                                case this.STATUS_INVALID:
                                    v = !1, this.disableSubmitButtons(!0), m.removeClass(this.options.control.valid).addClass(this.options.control.invalid), p.removeClass(this.options.row.valid).addClass(this.options.row.invalid), t && t.removeClass(this.options.icon.valid).removeClass(this.options.icon.validating).addClass(this.options.icon.invalid).show();
                                    break;
                                case this.STATUS_IGNORED:
                                case this.STATUS_VALID:
                                    n = r.filter("[data-" + e + '-result="' + this.STATUS_VALIDATING + '"]').length > 0, o = r.filter("[data-" + e + '-result="' + this.STATUS_NOT_VALIDATED + '"]').length > 0;
                                    var x = r.filter("[data-" + e + '-result="' + this.STATUS_IGNORED + '"]').length;
                                    v = n || o ? null : r.filter("[data-" + e + '-result="' + this.STATUS_VALID + '"]').length + x === r.length, m.removeClass(this.options.control.valid).removeClass(this.options.control.invalid), v === !0 ? (this.disableSubmitButtons(this.isValid() === !1), c === this.STATUS_VALID && m.addClass(this.options.control.valid)) : v === !1 && (this.disableSubmitButtons(!0), c === this.STATUS_VALID && m.addClass(this.options.control.invalid)), t && (t.removeClass(this.options.icon.invalid).removeClass(this.options.icon.validating).removeClass(this.options.icon.valid), (c === this.STATUS_VALID || x !== r.length) && t.addClass(n ? this.options.icon.validating : null === v ? "" : v ? this.options.icon.valid : this.options.icon.invalid).show());
                                    var y = this.isValidContainer(p);
                                    null !== y && (p.removeClass(this.options.row.valid).removeClass(this.options.row.invalid), (c === this.STATUS_VALID || x !== r.length) && p.addClass(y ? this.options.row.valid : this.options.row.invalid));
                                    break;
                                case this.STATUS_NOT_VALIDATED:
                                default:
                                    v = null, this.disableSubmitButtons(!1), m.removeClass(this.options.control.valid).removeClass(this.options.control.invalid), p.removeClass(this.options.row.valid).removeClass(this.options.row.invalid), t && t.removeClass(this.options.icon.valid).removeClass(this.options.icon.invalid).removeClass(this.options.icon.validating).hide()
                            }
                            !t || "tooltip" !== u && "popover" !== u ? c === this.STATUS_INVALID ? s.show() : s.hide() : v === !1 ? this._createTooltip(m, r.filter("[data-" + e + '-result="' + g.STATUS_INVALID + '"]').eq(0).html(), u) : this._destroyTooltip(m, u), m.trigger(a.Event(this.options.events.fieldStatus), {
                                bv: this,
                                fv: this,
                                field: b,
                                element: m,
                                status: c,
                                validator: d
                            }), this._onFieldValidated(m, d)
                        }
                    }
                    return this
                },
                validate: function () {
                    if (a.isEmptyObject(this.options.fields))
                        return this._submit(), this;
                    this.$form.trigger(a.Event(this.options.events.formPreValidate)), this.disableSubmitButtons(!0), this._submitIfValid = !1;
                    for (var b in this.options.fields)
                        this.validateField(b);
                    return this._submit(), this._submitIfValid = !0, this
                },
                validateField: function (b) {
                    var c = this._namespace,
                            d = a([]);
                    switch (typeof b) {
                        case "object":
                            d = b, b = b.attr("data-" + c + "-field");
                            break;
                        case "string":
                            d = this.getFieldElements(b)
                    }
                    if (0 === d.length || !this.options.fields[b] || "false" === this.options.fields[b].enabled || this.options.fields[b].enabled === !1)
                        return this;
                    for (var e, f, g, h = this, i = d.attr("type"), j = "radio" !== i && "checkbox" !== i || "disabled" === this.options.live ? d.length : 1, k = "radio" === i || "checkbox" === i, l = this.options.fields[b].validators, m = this.isOptionEnabled(b, "verbose"), n = 0; j > n; n++) {
                        var o = d.eq(n);
                        if (!this._isExcluded(o))
                            for (var p = !1, q = o.data(c + ".validators"), r = q.length, s = 0; r > s && (e = q[s].validator, o.data(c + ".dfs." + e) && o.data(c + ".dfs." + e).reject(), !p); s++) {
                                var t = o.data(c + ".result." + e);
                                if (t !== this.STATUS_VALID && t !== this.STATUS_INVALID)
                                    if (l[e].enabled !== !1)
                                        if (o.data(c + ".result." + e, this.STATUS_VALIDATING), f = l[e].alias || e, g = FormValidation.Validator[f].validate(this, o, l[e], e), "object" == typeof g && g.resolve)
                                            this.updateStatus(k ? b : o, this.STATUS_VALIDATING, e), o.data(c + ".dfs." + e, g), g.done(function (a, b, d) {
                                                a.removeData(c + ".dfs." + b).data(c + ".response." + b, d), d.message && h.updateMessage(a, b, d.message), h.updateStatus(k ? a.attr("data-" + c + "-field") : a, d.valid === !0 ? h.STATUS_VALID : d.valid === !1 ? h.STATUS_INVALID : h.STATUS_IGNORED, b), d.valid && h._submitIfValid === !0 ? h._submit() : d.valid !== !1 || m || (p = !0)
                                            });
                                        else if ("object" == typeof g && void 0 !== g.valid) {
                                            if (o.data(c + ".response." + e, g), g.message && this.updateMessage(k ? b : o, e, g.message), this.updateStatus(k ? b : o, g.valid === !0 ? this.STATUS_VALID : g.valid === !1 ? this.STATUS_INVALID : this.STATUS_IGNORED, e), g.valid === !1 && !m)
                                                break
                                        } else if ("boolean" == typeof g) {
                                            if (o.data(c + ".response." + e, g), this.updateStatus(k ? b : o, g ? this.STATUS_VALID : this.STATUS_INVALID, e), !g && !m)
                                                break
                                        } else
                                            null === g && (o.data(c + ".response." + e, g), this.updateStatus(k ? b : o, this.STATUS_IGNORED, e));
                                    else
                                        this.updateStatus(k ? b : o, this.STATUS_IGNORED, e);
                                else
                                    this._onFieldValidated(o, e)
                            }
                    }
                    return this
                },
                addField: function (b, c) {
                    var d = this._namespace,
                            e = a([]);
                    switch (typeof b) {
                        case "object":
                            e = b, b = b.attr("data-" + d + "-field") || b.attr("name");
                            break;
                        case "string":
                            delete this._cacheFields[b], e = this.getFieldElements(b)
                    }
                    e.attr("data-" + d + "-field", b);
                    for (var f = e.attr("type"), g = "radio" === f || "checkbox" === f ? 1 : e.length, h = 0; g > h; h++) {
                        var i = e.eq(h),
                                j = this._parseOptions(i);
                        j = null === j ? c : a.extend(!0, j, c), this.options.fields[b] = a.extend(!0, this.options.fields[b], j), this._cacheFields[b] = this._cacheFields[b] ? this._cacheFields[b].add(i) : i, this._initField("checkbox" === f || "radio" === f ? b : i)
                    }
                    return this.disableSubmitButtons(!1), this.$form.trigger(a.Event(this.options.events.fieldAdded), {
                        field: b,
                        element: e,
                        options: this.options.fields[b]
                    }), this
                },
                destroy: function () {
                    var a, b, c, d, e, f, g, h, i = this._namespace;
                    for (b in this.options.fields)
                        for (c = this.getFieldElements(b), a = 0; a < c.length; a++) {
                            d = c.eq(a);
                            for (e in this.options.fields[b].validators)
                                d.data(i + ".dfs." + e) && d.data(i + ".dfs." + e).reject(), d.removeData(i + ".result." + e).removeData(i + ".response." + e).removeData(i + ".dfs." + e), h = this.options.fields[b].validators[e].alias || e, "function" == typeof FormValidation.Validator[h].destroy && FormValidation.Validator[h].destroy(this, d, this.options.fields[b].validators[e], e)
                        }
                    var j = this.options.err.clazz.split(" ").join(".");
                    for (b in this.options.fields)
                        for (c = this.getFieldElements(b), g = this.options.fields[b].row || this.options.row.selector, a = 0; a < c.length; a++) {
                            d = c.eq(a);
                            var k = d.data(i + ".messages");
                            k && k.find("." + j + "[data-" + i + "-validator][data-" + i + '-for="' + b + '"]').remove(), d.removeData(i + ".messages").removeData(i + ".validators").closest(g).removeClass(this.options.row.valid).removeClass(this.options.row.invalid).removeClass(this.options.row.feedback).end().off("." + i).removeAttr("data-" + i + "-field");
                            var l = "function" == typeof (this.options.fields[b].container || this.options.fields[b].err || this.options.err.container) ? (this.options.fields[b].container || this.options.fields[b].err || this.options.err.container).call(this, d, this) : this.options.fields[b].container || this.options.fields[b].err || this.options.err.container;
                            ("tooltip" === l || "popover" === l) && this._destroyTooltip(d, l), f = d.data(i + ".icon"), f && f.remove(), d.removeData(i + ".icon").removeData(i + ".trigger")
                        }
                    for (var m in this.options.addOns)
                        "function" == typeof FormValidation.AddOn[m].destroy && FormValidation.AddOn[m].destroy(this, this.options.addOns[m]);
                    this.disableSubmitButtons(!1), this.$hiddenButton.remove(), this.$form.removeClass(this.options.elementClass).off("." + i).removeData("bootstrapValidator").removeData("formValidation").find("[data-" + i + "-submit-hidden]").remove().end().find('[type="submit"]').off("click." + i)
                },
                enableFieldValidators: function (a, b, c) {
                    var d = this.options.fields[a].validators;
                    if (c && d && d[c] && d[c].enabled !== b)
                        this.options.fields[a].validators[c].enabled = b, this.updateStatus(a, this.STATUS_NOT_VALIDATED, c);
                    else if (!c && this.options.fields[a].enabled !== b) {
                        this.options.fields[a].enabled = b;
                        for (var e in d)
                            this.enableFieldValidators(a, b, e)
                    }
                    return this
                },
                getDynamicOption: function (a, b) {
                    var c = "string" == typeof a ? this.getFieldElements(a) : a,
                            d = c.val();
                    if ("function" == typeof b)
                        return FormValidation.Helper.call(b, [d, this, c]);
                    if ("string" == typeof b) {
                        var e = this.getFieldElements(b);
                        return e.length ? e.val() : FormValidation.Helper.call(b, [d, this, c]) || b
                    }
                    return null
                },
                getForm: function () {
                    return this.$form
                },
                getInvalidFields: function () {
                    return this.$invalidFields
                },
                getLocale: function () {
                    return this.options.locale
                },
                getMessages: function (b, c) {
                    var d = this,
                            e = this._namespace,
                            f = [],
                            g = a([]);
                    switch (!0) {
                        case b && "object" == typeof b:
                            g = b;
                            break;
                        case b && "string" == typeof b:
                            var h = this.getFieldElements(b);
                            if (h.length > 0) {
                                var i = h.attr("type");
                                g = "radio" === i || "checkbox" === i ? h.eq(0) : h
                            }
                            break;
                        default:
                            g = this.$invalidFields
                    }
                    var j = c ? "[data-" + e + '-validator="' + c + '"]' : "",
                            k = this.options.err.clazz.split(" ").join(".");
                    return g.each(function () {
                        f = f.concat(a(this).data(e + ".messages").find("." + k + "[data-" + e + '-for="' + a(this).attr("data-" + e + "-field") + '"][data-' + e + '-result="' + d.STATUS_INVALID + '"]' + j).map(function () {
                            var b = a(this).attr("data-" + e + "-validator"),
                                    c = a(this).attr("data-" + e + "-for");
                            return d.options.fields[c].validators[b].enabled === !1 ? "" : a(this).html()
                        }).get())
                    }), f
                },
                getSubmitButton: function () {
                    return this.$submitButton
                },
                removeField: function (b) {
                    var c = this._namespace,
                            d = a([]);
                    switch (typeof b) {
                        case "object":
                            d = b, b = b.attr("data-" + c + "-field") || b.attr("name"), d.attr("data-" + c + "-field", b);
                            break;
                        case "string":
                            d = this.getFieldElements(b)
                    }
                    if (0 === d.length)
                        return this;
                    for (var e = d.attr("type"), f = "radio" === e || "checkbox" === e ? 1 : d.length, g = 0; f > g; g++) {
                        var h = d.eq(g);
                        this.$invalidFields = this.$invalidFields.not(h), this._cacheFields[b] = this._cacheFields[b].not(h)
                    }
                    return this._cacheFields[b] && 0 !== this._cacheFields[b].length || delete this.options.fields[b], ("checkbox" === e || "radio" === e) && this._initField(b), this.disableSubmitButtons(!1), this.$form.trigger(a.Event(this.options.events.fieldRemoved), {
                        field: b,
                        element: d
                    }), this
                },
                resetField: function (b, c) {
                    var d = this._namespace,
                            e = a([]);
                    switch (typeof b) {
                        case "object":
                            e = b, b = b.attr("data-" + d + "-field");
                            break;
                        case "string":
                            e = this.getFieldElements(b)
                    }
                    var f = 0,
                            g = e.length;
                    if (this.options.fields[b])
                        for (f = 0; g > f; f++)
                            for (var h in this.options.fields[b].validators)
                                e.eq(f).removeData(d + ".dfs." + h);
                    if (c) {
                        var i = e.attr("type");
                        "radio" === i || "checkbox" === i ? e.prop("checked", !1).removeAttr("selected") : e.val("")
                    }
                    for (this.updateStatus(b, this.STATUS_NOT_VALIDATED), f = 0; g > f; f++)
                        e.eq(f).trigger(a.Event(this.options.events.fieldReset), {
                            fv: this,
                            field: b,
                            element: e.eq(f),
                            resetValue: c
                        });
                    return this
                },
                resetForm: function (b) {
                    for (var c in this.options.fields)
                        this.resetField(c, b);
                    return this.$invalidFields = a([]), this.$submitButton = null, this.disableSubmitButtons(!1), this.$form.trigger(a.Event(this.options.events.formReset), {
                        fv: this,
                        resetValue: b
                    }), this
                },
                revalidateField: function (a) {
                    return this.updateStatus(a, this.STATUS_NOT_VALIDATED).validateField(a), this
                },
                setLocale: function (b) {
                    return this.options.locale = b, this.$form.trigger(a.Event(this.options.events.localeChanged), {
                        locale: b,
                        bv: this,
                        fv: this
                    }), this
                },
                updateOption: function (a, b, c, d) {
                    var e = this._namespace;
                    return "object" == typeof a && (a = a.attr("data-" + e + "-field")), this.options.fields[a] && this.options.fields[a].validators[b] && (this.options.fields[a].validators[b][c] = d, this.updateStatus(a, this.STATUS_NOT_VALIDATED, b)), this
                },
                validateContainer: function (b) {
                    var c = this,
                            d = this._namespace,
                            e = [],
                            f = "string" == typeof b ? a(b) : b;
                    if (0 === f.length)
                        return this;
                    f.find("[data-" + d + "-field]").each(function () {
                        var b = a(this);
                        c._isExcluded(b) || e.push(b)
                    });
                    for (var g = e.length, h = 0; g > h; h++)
                        this.validateField(e[h]);
                    return this
                }
            }, a.fn.formValidation = function (b) {
                var c = arguments;
                return this.each(function () {
                    var d = a(this),
                            e = d.data("formValidation"),
                            f = "object" == typeof b && b;
                    if (!e) {
                        var g = (f.framework || d.attr("data-fv-framework") || "bootstrap").toLowerCase(),
                                h = g.substr(0, 1).toUpperCase() + g.substr(1);
                        if ("undefined" == typeof FormValidation.Framework[h])
                            throw new Error("The class FormValidation.Framework." + h + " is not implemented");
                        e = new FormValidation.Framework[h](this, f), d.addClass("fv-form-" + g).data("formValidation", e)
                    }
                    "string" == typeof b && e[b].apply(e, Array.prototype.slice.call(c, 1))
                })
            }, a.fn.formValidation.Constructor = FormValidation.Base, a.fn.formValidation.DEFAULT_MESSAGE = "This value is not valid", a.fn.formValidation.DEFAULT_OPTIONS = {
                autoFocus: !0,
                declarative: !0,
                elementClass: "fv-form",
                events: {
                    formInit: "init.form.fv",
                    formPreValidate: "prevalidate.form.fv",
                    formError: "err.form.fv",
                    formReset: "rst.form.fv",
                    formSuccess: "success.form.fv",
                    fieldAdded: "added.field.fv",
                    fieldRemoved: "removed.field.fv",
                    fieldInit: "init.field.fv",
                    fieldError: "err.field.fv",
                    fieldReset: "rst.field.fv",
                    fieldSuccess: "success.field.fv",
                    fieldStatus: "status.field.fv",
                    localeChanged: "changed.locale.fv",
                    validatorError: "err.validator.fv",
                    validatorSuccess: "success.validator.fv",
                    validatorIgnored: "ignored.validator.fv"
                },
                excluded: [":disabled", ":hidden", ":not(:visible)"],
                fields: null,
                live: "enabled",
                locale: "en_US",
                message: null,
                threshold: null,
                verbose: !0,
                button: {
                    selector: '[type="submit"]:not([formnovalidate])',
                    disabled: ""
                },
                control: {
                    valid: "",
                    invalid: ""
                },
                err: {
                    clazz: "",
                    container: null,
                    parent: null
                },
                icon: {
                    valid: null,
                    invalid: null,
                    validating: null,
                    feedback: ""
                },
                row: {
                    selector: null,
                    valid: "",
                    invalid: "",
                    feedback: ""
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.Helper = {
                call: function (a, b) {
                    if ("function" == typeof a)
                        return a.apply(this, b);
                    if ("string" == typeof a) {
                        "()" === a.substring(a.length - 2) && (a = a.substring(0, a.length - 2));
                        for (var c = a.split("."), d = c.pop(), e = window, f = 0; f < c.length; f++)
                            e = e[c[f]];
                        return "undefined" == typeof e[d] ? null : e[d].apply(this, b)
                    }
                },
                date: function (a, b, c, d) {
                    if (isNaN(a) || isNaN(b) || isNaN(c))
                        return !1;
                    if (c.length > 2 || b.length > 2 || a.length > 4)
                        return !1;
                    if (c = parseInt(c, 10), b = parseInt(b, 10), a = parseInt(a, 10), 1e3 > a || a > 9999 || 0 >= b || b > 12)
                        return !1;
                    var e = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    if ((a % 400 === 0 || a % 100 !== 0 && a % 4 === 0) && (e[1] = 29), 0 >= c || c > e[b - 1])
                        return !1;
                    if (d === !0) {
                        var f = new Date,
                                g = f.getFullYear(),
                                h = f.getMonth(),
                                i = f.getDate();
                        return g > a || a === g && h > b - 1 || a === g && b - 1 === h && i > c
                    }
                    return !0
                },
                format: function (b, c) {
                    a.isArray(c) || (c = [c]);
                    for (var d in c)
                        b = b.replace("%s", c[d]);
                    return b
                },
                luhn: function (a) {
                    for (var b = a.length, c = 0, d = [
                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                        [0, 2, 4, 6, 8, 1, 3, 5, 7, 9]
                    ], e = 0; b--; )
                        e += d[c][parseInt(a.charAt(b), 10)], c ^= 1;
                    return e % 10 === 0 && e > 0
                },
                mod11And10: function (a) {
                    for (var b = 5, c = a.length, d = 0; c > d; d++)
                        b = (2 * (b || 10) % 11 + parseInt(a.charAt(d), 10)) % 10;
                    return 1 === b
                },
                mod37And36: function (a, b) {
                    b = b || "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                    for (var c = b.length, d = a.length, e = Math.floor(c / 2), f = 0; d > f; f++)
                        e = (2 * (e || c) % (c + 1) + b.indexOf(a.charAt(f))) % c;
                    return 1 === e
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    base64: {
                        "default": "Please enter a valid base 64 encoded"
                    }
                }
            }), FormValidation.Validator.base64 = {
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    return "" === e ? !0 : /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/.test(e)
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    between: {
                        "default": "Please enter a value between %s and %s",
                        notInclusive: "Please enter a value between %s and %s strictly"
                    }
                }
            }), FormValidation.Validator.between = {
                html5Attributes: {
                    message: "message",
                    min: "min",
                    max: "max",
                    inclusive: "inclusive"
                },
                enableByHtml5: function (a) {
                    return "range" === a.attr("type") ? {
                        min: a.attr("min"),
                        max: a.attr("max")
                    } : !1
                },
                validate: function (b, c, d, e) {
                    var f = b.getFieldValue(c, e);
                    if ("" === f)
                        return !0;
                    f = this._format(f);
                    var g = b.getLocale(),
                            h = a.isNumeric(d.min) ? d.min : b.getDynamicOption(c, d.min),
                            i = a.isNumeric(d.max) ? d.max : b.getDynamicOption(c, d.max),
                            j = this._format(h),
                            k = this._format(i);
                    return d.inclusive === !0 || void 0 === d.inclusive ? {
                        valid: a.isNumeric(f) && parseFloat(f) >= j && parseFloat(f) <= k,
                        message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].between["default"], [h, i])
                    } : {
                        valid: a.isNumeric(f) && parseFloat(f) > j && parseFloat(f) < k,
                        message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].between.notInclusive, [h, i])
                    }
                },
                _format: function (a) {
                    return (a + "").replace(",", ".")
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    bic: {
                        "default": "Please enter a valid BIC number"
                    }
                }
            }), FormValidation.Validator.bic = {
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    return "" === e ? !0 : /^[a-zA-Z]{6}[a-zA-Z0-9]{2}([a-zA-Z0-9]{3})?$/.test(e)
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.Validator.blank = {
                validate: function (a, b, c, d) {
                    return !0
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    callback: {
                        "default": "Please enter a valid value"
                    }
                }
            }), FormValidation.Validator.callback = {
                priority: 999,
                html5Attributes: {
                    message: "message",
                    callback: "callback"
                },
                validate: function (b, c, d, e) {
                    var f = b.getFieldValue(c, e),
                            g = new a.Deferred,
                            h = {
                                valid: !0
                            };
                    if (d.callback) {
                        var i = FormValidation.Helper.call(d.callback, [f, b, c]);
                        h = "boolean" == typeof i || null === i ? {
                            valid: i
                        } : i
                    }
                    return g.resolve(c, e, h), g
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    choice: {
                        "default": "Please enter a valid value",
                        less: "Please choose %s options at minimum",
                        more: "Please choose %s options at maximum",
                        between: "Please choose %s - %s options"
                    }
                }
            }), FormValidation.Validator.choice = {
                html5Attributes: {
                    message: "message",
                    min: "min",
                    max: "max"
                },
                validate: function (b, c, d, e) {
                    var f = b.getLocale(),
                            g = b.getNamespace(),
                            h = c.is("select") ? b.getFieldElements(c.attr("data-" + g + "-field")).find("option").filter(":selected").length : b.getFieldElements(c.attr("data-" + g + "-field")).filter(":checked").length,
                            i = d.min ? a.isNumeric(d.min) ? d.min : b.getDynamicOption(c, d.min) : null,
                            j = d.max ? a.isNumeric(d.max) ? d.max : b.getDynamicOption(c, d.max) : null,
                            k = !0,
                            l = d.message || FormValidation.I18n[f].choice["default"];
                    switch ((i && h < parseInt(i, 10) || j && h > parseInt(j, 10)) && (k = !1), !0) {
                        case !!i && !!j:
                            l = FormValidation.Helper.format(d.message || FormValidation.I18n[f].choice.between, [parseInt(i, 10), parseInt(j, 10)]);
                            break;
                        case !!i:
                            l = FormValidation.Helper.format(d.message || FormValidation.I18n[f].choice.less, parseInt(i, 10));
                            break;
                        case !!j:
                            l = FormValidation.Helper.format(d.message || FormValidation.I18n[f].choice.more, parseInt(j, 10))
                    }
                    return {
                        valid: k,
                        message: l
                    }
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    color: {
                        "default": "Please enter a valid color"
                    }
                }
            }), FormValidation.Validator.color = {
                html5Attributes: {
                    message: "message",
                    type: "type"
                },
                enableByHtml5: function (a) {
                    return "color" === a.attr("type")
                },
                SUPPORTED_TYPES: ["hex", "rgb", "rgba", "hsl", "hsla", "keyword"],
                KEYWORD_COLORS: ["aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod", "gray", "green", "greenyellow", "grey", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "red", "rosybrown", "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "transparent", "turquoise", "violet", "wheat", "white", "whitesmoke", "yellow", "yellowgreen"],
                validate: function (b, c, d, e) {
                    var f = b.getFieldValue(c, e);
                    if ("" === f)
                        return !0;
                    if (this.enableByHtml5(c))
                        return /^#[0-9A-F]{6}$/i.test(f);
                    var g = d.type || this.SUPPORTED_TYPES;
                    a.isArray(g) || (g = g.replace(/s/g, "").split(","));
                    for (var h, i, j = !1, k = 0; k < g.length; k++)
                        if (i = g[k], h = "_" + i.toLowerCase(), j = j || this[h](f))
                            return !0;
                    return !1
                },
                _hex: function (a) {
                    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(a)
                },
                _hsl: function (a) {
                    return /^hsl\((\s*(-?\d+)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*)\)$/.test(a)
                },
                _hsla: function (a) {
                    return /^hsla\((\s*(-?\d+)\s*,)(\s*(\b(0?\d{1,2}|100)\b%)\s*,){2}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/.test(a)
                },
                _keyword: function (b) {
                    return a.inArray(b, this.KEYWORD_COLORS) >= 0
                },
                _rgb: function (a) {
                    var b = /^rgb\((\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*,){2}(\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*)\)$/,
                            c = /^rgb\((\s*(\b(0?\d{1,2}|100)\b%)\s*,){2}(\s*(\b(0?\d{1,2}|100)\b%)\s*)\)$/;
                    return b.test(a) || c.test(a)
                },
                _rgba: function (a) {
                    var b = /^rgba\((\s*(\b([01]?\d{1,2}|2[0-4]\d|25[0-5])\b)\s*,){3}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/,
                            c = /^rgba\((\s*(\b(0?\d{1,2}|100)\b%)\s*,){3}(\s*(0?(\.\d+)?|1(\.0+)?)\s*)\)$/;
                    return b.test(a) || c.test(a)
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    creditCard: {
                        "default": "Please enter a valid credit card number"
                    }
                }
            }), FormValidation.Validator.creditCard = {
                validate: function (b, c, d, e) {
                    var f = b.getFieldValue(c, e);
                    if ("" === f)
                        return !0;
                    if (/[^0-9-\s]+/.test(f))
                        return !1;
                    if (f = f.replace(/\D/g, ""), !FormValidation.Helper.luhn(f))
                        return !1;
                    var g, h, i = {
                        AMERICAN_EXPRESS: {
                            length: [15],
                            prefix: ["34", "37"]
                        },
                        DANKORT: {
                            length: [16],
                            prefix: ["5019"]
                        },
                        DINERS_CLUB: {
                            length: [14],
                            prefix: ["300", "301", "302", "303", "304", "305", "36"]
                        },
                        DINERS_CLUB_US: {
                            length: [16],
                            prefix: ["54", "55"]
                        },
                        DISCOVER: {
                            length: [16],
                            prefix: ["6011", "622126", "622127", "622128", "622129", "62213", "62214", "62215", "62216", "62217", "62218", "62219", "6222", "6223", "6224", "6225", "6226", "6227", "6228", "62290", "62291", "622920", "622921", "622922", "622923", "622924", "622925", "644", "645", "646", "647", "648", "649", "65"]
                        },
                        ELO: {
                            length: [16],
                            prefix: ["4011", "4312", "4389", "4514", "4573", "4576", "5041", "5066", "5067", "509", "6277", "6362", "6363", "650", "6516", "6550"]
                        },
                        FORBRUGSFORENINGEN: {
                            length: [16],
                            prefix: ["600722"]
                        },
                        JCB: {
                            length: [16],
                            prefix: ["3528", "3529", "353", "354", "355", "356", "357", "358"]
                        },
                        LASER: {
                            length: [16, 17, 18, 19],
                            prefix: ["6304", "6706", "6771", "6709"]
                        },
                        MAESTRO: {
                            length: [12, 13, 14, 15, 16, 17, 18, 19],
                            prefix: ["5018", "5020", "5038", "5868", "6304", "6759", "6761", "6762", "6763", "6764", "6765", "6766"]
                        },
                        MASTERCARD: {
                            length: [16],
                            prefix: ["51", "52", "53", "54", "55"]
                        },
                        SOLO: {
                            length: [16, 18, 19],
                            prefix: ["6334", "6767"]
                        },
                        UNIONPAY: {
                            length: [16, 17, 18, 19],
                            prefix: ["622126", "622127", "622128", "622129", "62213", "62214", "62215", "62216", "62217", "62218", "62219", "6222", "6223", "6224", "6225", "6226", "6227", "6228", "62290", "62291", "622920", "622921", "622922", "622923", "622924", "622925"]
                        },
                        VISA_ELECTRON: {
                            length: [16],
                            prefix: ["4026", "417500", "4405", "4508", "4844", "4913", "4917"]
                        },
                        VISA: {
                            length: [16],
                            prefix: ["4"]
                        }
                    };
                    for (g in i)
                        for (h in i[g].prefix)
                            if (f.substr(0, i[g].prefix[h].length) === i[g].prefix[h] && -1 !== a.inArray(f.length, i[g].length))
                                return {
                                    valid: !0,
                                    type: g
                                };
                    return !1
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    cusip: {
                        "default": "Please enter a valid CUSIP number"
                    }
                }
            }), FormValidation.Validator.cusip = {
                validate: function (b, c, d, e) {
                    var f = b.getFieldValue(c, e);
                    if ("" === f)
                        return !0;
                    if (f = f.toUpperCase(), !/^[0-9A-Z]{9}$/.test(f))
                        return !1;
                    for (var g = a.map(f.split(""), function (a) {
                        var b = a.charCodeAt(0);
                        return b >= "A".charCodeAt(0) && b <= "Z".charCodeAt(0) ? b - "A".charCodeAt(0) + 10 : a
                    }), h = g.length, i = 0, j = 0; h - 1 > j; j++) {
                        var k = parseInt(g[j], 10);
                        j % 2 !== 0 && (k *= 2), k > 9 && (k -= 9), i += k
                    }
                    return i = (10 - i % 10) % 10, i === parseInt(g[h - 1], 10)
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    cvv: {
                        "default": "Please enter a valid CVV number"
                    }
                }
            }), FormValidation.Validator.cvv = {
                html5Attributes: {
                    message: "message",
                    ccfield: "creditCardField"
                },
                init: function (a, b, c, d) {
                    if (c.creditCardField) {
                        var e = a.getFieldElements(c.creditCardField);
                        a.onLiveChange(e, "live_" + d, function () {
                            var c = a.getStatus(b, d);
                            c !== a.STATUS_NOT_VALIDATED && a.revalidateField(b)
                        })
                    }
                },
                destroy: function (a, b, c, d) {
                    if (c.creditCardField) {
                        var e = a.getFieldElements(c.creditCardField);
                        a.offLiveChange(e, "live_" + d)
                    }
                },
                validate: function (b, c, d, e) {
                    var f = b.getFieldValue(c, e);
                    if ("" === f)
                        return !0;
                    if (!/^[0-9]{3,4}$/.test(f))
                        return !1;
                    if (!d.creditCardField)
                        return !0;
                    var g = b.getFieldValue(d.creditCardField, "creditCard");
                    if (null === g || "" === g)
                        return !0;
                    g = g.replace(/\D/g, "");
                    var h, i, j = {
                        AMERICAN_EXPRESS: {
                            length: [15],
                            prefix: ["34", "37"]
                        },
                        DANKORT: {
                            length: [16],
                            prefix: ["5019"]
                        },
                        DINERS_CLUB: {
                            length: [14],
                            prefix: ["300", "301", "302", "303", "304", "305", "36"]
                        },
                        DINERS_CLUB_US: {
                            length: [16],
                            prefix: ["54", "55"]
                        },
                        DISCOVER: {
                            length: [16],
                            prefix: ["6011", "622126", "622127", "622128", "622129", "62213", "62214", "62215", "62216", "62217", "62218", "62219", "6222", "6223", "6224", "6225", "6226", "6227", "6228", "62290", "62291", "622920", "622921", "622922", "622923", "622924", "622925", "644", "645", "646", "647", "648", "649", "65"]
                        },
                        ELO: {
                            length: [16],
                            prefix: ["4011", "4312", "4389", "4514", "4573", "4576", "5041", "5066", "5067", "509", "6277", "6362", "6363", "650", "6516", "6550"]
                        },
                        FORBRUGSFORENINGEN: {
                            length: [16],
                            prefix: ["600722"]
                        },
                        JCB: {
                            length: [16],
                            prefix: ["3528", "3529", "353", "354", "355", "356", "357", "358"]
                        },
                        LASER: {
                            length: [16, 17, 18, 19],
                            prefix: ["6304", "6706", "6771", "6709"]
                        },
                        MAESTRO: {
                            length: [12, 13, 14, 15, 16, 17, 18, 19],
                            prefix: ["5018", "5020", "5038", "5868", "6304", "6759", "6761", "6762", "6763", "6764", "6765", "6766"]
                        },
                        MASTERCARD: {
                            length: [16],
                            prefix: ["51", "52", "53", "54", "55"]
                        },
                        SOLO: {
                            length: [16, 18, 19],
                            prefix: ["6334", "6767"]
                        },
                        UNIONPAY: {
                            length: [16, 17, 18, 19],
                            prefix: ["622126", "622127", "622128", "622129", "62213", "62214", "62215", "62216", "62217", "62218", "62219", "6222", "6223", "6224", "6225", "6226", "6227", "6228", "62290", "62291", "622920", "622921", "622922", "622923", "622924", "622925"]
                        },
                        VISA_ELECTRON: {
                            length: [16],
                            prefix: ["4026", "417500", "4405", "4508", "4844", "4913", "4917"]
                        },
                        VISA: {
                            length: [16],
                            prefix: ["4"]
                        }
                    },
                            k = null;
                    for (h in j)
                        for (i in j[h].prefix)
                            if (g.substr(0, j[h].prefix[i].length) === j[h].prefix[i] && -1 !== a.inArray(g.length, j[h].length)) {
                                k = h;
                                break
                            }
                    return null === k ? !1 : "AMERICAN_EXPRESS" === k ? 4 === f.length : 3 === f.length
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    date: {
                        "default": "Please enter a valid date",
                        min: "Please enter a date after %s",
                        max: "Please enter a date before %s",
                        range: "Please enter a date in the range %s - %s"
                    }
                }
            }), FormValidation.Validator.date = {
                html5Attributes: {
                    message: "message",
                    format: "format",
                    min: "min",
                    max: "max",
                    separator: "separator"
                },
                validate: function (b, c, d, e) {
                    var f = b.getFieldValue(c, e);
                    if ("" === f)
                        return !0;
                    d.format = d.format || "MM/DD/YYYY", "date" === c.attr("type") && (d.format = "YYYY-MM-DD");
                    var g = b.getLocale(),
                            h = d.message || FormValidation.I18n[g].date["default"],
                            i = d.format.split(" "),
                            j = i[0],
                            k = i.length > 1 ? i[1] : null,
                            l = i.length > 2 ? i[2] : null,
                            m = f.split(" "),
                            n = m[0],
                            o = m.length > 1 ? m[1] : null;
                    if (i.length !== m.length)
                        return {
                            valid: !1,
                            message: h
                        };
                    var p = d.separator;
                    if (p || (p = -1 !== n.indexOf("/") ? "/" : -1 !== n.indexOf("-") ? "-" : -1 !== n.indexOf(".") ? "." : null), null === p || -1 === n.indexOf(p))
                        return {
                            valid: !1,
                            message: h
                        };
                    if (n = n.split(p), j = j.split(p), n.length !== j.length)
                        return {
                            valid: !1,
                            message: h
                        };
                    var q = n[a.inArray("YYYY", j)],
                            r = n[a.inArray("MM", j)],
                            s = n[a.inArray("DD", j)];
                    if (!q || !r || !s || 4 !== q.length)
                        return {
                            valid: !1,
                            message: h
                        };
                    var t = null,
                            u = null,
                            v = null;
                    if (k) {
                        if (k = k.split(":"), o = o.split(":"), k.length !== o.length)
                            return {
                                valid: !1,
                                message: h
                            };
                        if (u = o.length > 0 ? o[0] : null, t = o.length > 1 ? o[1] : null, v = o.length > 2 ? o[2] : null, "" === u || "" === t || "" === v)
                            return {
                                valid: !1,
                                message: h
                            };
                        if (v) {
                            if (isNaN(v) || v.length > 2)
                                return {
                                    valid: !1,
                                    message: h
                                };
                            if (v = parseInt(v, 10), 0 > v || v > 60)
                                return {
                                    valid: !1,
                                    message: h
                                }
                        }
                        if (u) {
                            if (isNaN(u) || u.length > 2)
                                return {
                                    valid: !1,
                                    message: h
                                };
                            if (u = parseInt(u, 10), 0 > u || u >= 24 || l && u > 12)
                                return {
                                    valid: !1,
                                    message: h
                                }
                        }
                        if (t) {
                            if (isNaN(t) || t.length > 2)
                                return {
                                    valid: !1,
                                    message: h
                                };
                            if (t = parseInt(t, 10), 0 > t || t > 59)
                                return {
                                    valid: !1,
                                    message: h
                                }
                        }
                    }
                    var w = FormValidation.Helper.date(q, r, s),
                            x = null,
                            y = null,
                            z = d.min,
                            A = d.max;
                    switch (z && (x = z instanceof Date ? z : this._parseDate(z, j, p) || this._parseDate(b.getDynamicOption(c, z), j, p), z = this._formatDate(x, d.format)), A && (y = A instanceof Date ? A : this._parseDate(A, j, p) || this._parseDate(b.getDynamicOption(c, A), j, p), A = this._formatDate(y, d.format)), n = new Date(q, r - 1, s, u, t, v), !0) {
                        case z && !A && w:
                            w = n.getTime() >= x.getTime(), h = d.message || FormValidation.Helper.format(FormValidation.I18n[g].date.min, z);
                            break;
                        case A && !z && w:
                            w = n.getTime() <= y.getTime(), h = d.message || FormValidation.Helper.format(FormValidation.I18n[g].date.max, A);
                            break;
                        case A && z && w:
                            w = n.getTime() <= y.getTime() && n.getTime() >= x.getTime(), h = d.message || FormValidation.Helper.format(FormValidation.I18n[g].date.range, [z, A])
                    }
                    return {
                        valid: w,
                        date: n,
                        message: h
                    }
                },
                _parseDate: function (b, c, d) {
                    if (b instanceof Date)
                        return b;
                    if ("string" != typeof b)
                        return null;
                    var e = a.inArray("YYYY", c),
                            f = a.inArray("MM", c),
                            g = a.inArray("DD", c);
                    if (-1 === e || -1 === f || -1 === g)
                        return null;
                    var h = 0,
                            i = 0,
                            j = 0,
                            k = b.split(" "),
                            l = k[0].split(d);
                    if (l.length < 3)
                        return null;
                    if (k.length > 1) {
                        var m = k[1].split(":");
                        i = m.length > 0 ? m[0] : null, h = m.length > 1 ? m[1] : null, j = m.length > 2 ? m[2] : null
                    }
                    return new Date(l[e], l[f] - 1, l[g], i, h, j)
                },
                _formatDate: function (a, b) {
                    b = b.replace(/Y/g, "y").replace(/M/g, "m").replace(/D/g, "d").replace(/:m/g, ":M").replace(/:mm/g, ":MM").replace(/:S/, ":s").replace(/:SS/, ":ss");
                    var c = {
                        d: function (a) {
                            return a.getDate()
                        },
                        dd: function (a) {
                            var b = a.getDate();
                            return 10 > b ? "0" + b : b
                        },
                        m: function (a) {
                            return a.getMonth() + 1
                        },
                        mm: function (a) {
                            var b = a.getMonth() + 1;
                            return 10 > b ? "0" + b : b
                        },
                        yy: function (a) {
                            return ("" + a.getFullYear()).substr(2)
                        },
                        yyyy: function (a) {
                            return a.getFullYear()
                        },
                        h: function (a) {
                            return a.getHours() % 12 || 12
                        },
                        hh: function (a) {
                            var b = a.getHours() % 12 || 12;
                            return 10 > b ? "0" + b : b
                        },
                        H: function (a) {
                            return a.getHours()
                        },
                        HH: function (a) {
                            var b = a.getHours();
                            return 10 > b ? "0" + b : b
                        },
                        M: function (a) {
                            return a.getMinutes()
                        },
                        MM: function (a) {
                            var b = a.getMinutes();
                            return 10 > b ? "0" + b : b
                        },
                        s: function (a) {
                            return a.getSeconds()
                        },
                        ss: function (a) {
                            var b = a.getSeconds();
                            return 10 > b ? "0" + b : b
                        }
                    };
                    return b.replace(/d{1,4}|m{1,4}|yy(?:yy)?|([HhMs])\1?|"[^"]*"|'[^']*'/g, function (b) {
                        return c[b] ? c[b](a) : b.slice(1, b.length - 1)
                    })
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    different: {
                        "default": "Please enter a different value"
                    }
                }
            }), FormValidation.Validator.different = {
                html5Attributes: {
                    message: "message",
                    field: "field"
                },
                init: function (b, c, d, e) {
                    for (var f = d.field.split(","), g = 0; g < f.length; g++) {
                        var h = b.getFieldElements(a.trim(f[g]));
                        b.onLiveChange(h, "live_" + e, function () {
                            var a = b.getStatus(c, e);
                            a !== b.STATUS_NOT_VALIDATED && b.revalidateField(c)
                        })
                    }
                },
                destroy: function (b, c, d, e) {
                    for (var f = d.field.split(","), g = 0; g < f.length; g++) {
                        var h = b.getFieldElements(a.trim(f[g]));
                        b.offLiveChange(h, "live_" + e)
                    }
                },
                validate: function (b, c, d, e) {
                    var f = b.getFieldValue(c, e);
                    if ("" === f)
                        return !0;
                    for (var g = d.field.split(","), h = !0, i = 0; i < g.length; i++) {
                        var j = b.getFieldElements(a.trim(g[i]));
                        if (null != j && 0 !== j.length) {
                            var k = b.getFieldValue(j, e);
                            f === k ? h = !1 : "" !== k && b.updateStatus(j, b.STATUS_VALID, e)
                        }
                    }
                    return h
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    digits: {
                        "default": "Please enter only digits"
                    }
                }
            }), FormValidation.Validator.digits = {
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    return "" === e ? !0 : /^\d+$/.test(e)
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    ean: {
                        "default": "Please enter a valid EAN number"
                    }
                }
            }), FormValidation.Validator.ean = {
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    if ("" === e)
                        return !0;
                    if (!/^(\d{8}|\d{12}|\d{13})$/.test(e))
                        return !1;
                    for (var f = e.length, g = 0, h = 8 === f ? [3, 1] : [1, 3], i = 0; f - 1 > i; i++)
                        g += parseInt(e.charAt(i), 10) * h[i % 2];
                    return g = (10 - g % 10) % 10, g + "" === e.charAt(f - 1)
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    ein: {
                        "default": "Please enter a valid EIN number"
                    }
                }
            }), FormValidation.Validator.ein = {
                CAMPUS: {
                    ANDOVER: ["10", "12"],
                    ATLANTA: ["60", "67"],
                    AUSTIN: ["50", "53"],
                    BROOKHAVEN: ["01", "02", "03", "04", "05", "06", "11", "13", "14", "16", "21", "22", "23", "25", "34", "51", "52", "54", "55", "56", "57", "58", "59", "65"],
                    CINCINNATI: ["30", "32", "35", "36", "37", "38", "61"],
                    FRESNO: ["15", "24"],
                    KANSAS_CITY: ["40", "44"],
                    MEMPHIS: ["94", "95"],
                    OGDEN: ["80", "90"],
                    PHILADELPHIA: ["33", "39", "41", "42", "43", "48", "62", "63", "64", "66", "68", "71", "72", "73", "74", "75", "76", "77", "81", "82", "83", "84", "85", "86", "87", "88", "91", "92", "93", "98", "99"],
                    INTERNET: ["20", "26", "27", "45", "46", "47"],
                    SMALL_BUSINESS_ADMINISTRATION: ["31"]
                },
                validate: function (b, c, d, e) {
                    var f = b.getFieldValue(c, e);
                    if ("" === f)
                        return !0;
                    if (!/^[0-9]{2}-?[0-9]{7}$/.test(f))
                        return !1;
                    var g = f.substr(0, 2) + "";
                    for (var h in this.CAMPUS)
                        if (-1 !== a.inArray(g, this.CAMPUS[h]))
                            return {
                                valid: !0,
                                campus: h
                            };
                    return !1
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    emailAddress: {
                        "default": "Please enter a valid email address"
                    }
                }
            }), FormValidation.Validator.emailAddress = {
                html5Attributes: {
                    message: "message",
                    multiple: "multiple",
                    separator: "separator"
                },
                enableByHtml5: function (a) {
                    return "email" === a.attr("type")
                },
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    if ("" === e)
                        return !0;
                    var f = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                            g = c.multiple === !0 || "true" === c.multiple;
                    if (g) {
                        for (var h = c.separator || /[,;]/, i = this._splitEmailAddresses(e, h), j = 0; j < i.length; j++)
                            if (!f.test(i[j]))
                                return !1;
                        return !0
                    }
                    return f.test(e)
                },
                _splitEmailAddresses: function (a, b) {
                    for (var c = a.split(/"/), d = c.length, e = [], f = "", g = 0; d > g; g++)
                        if (g % 2 === 0) {
                            var h = c[g].split(b),
                                    i = h.length;
                            if (1 === i)
                                f += h[0];
                            else {
                                e.push(f + h[0]);
                                for (var j = 1; i - 1 > j; j++)
                                    e.push(h[j]);
                                f = h[i - 1]
                            }
                        } else
                            f += '"' + c[g], d - 1 > g && (f += '"');
                    return e.push(f), e
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    file: {
                        "default": "Please choose a valid file"
                    }
                }
            }), FormValidation.Validator.file = {
                Error: {
                    EXTENSION: "EXTENSION",
                    MAX_FILES: "MAX_FILES",
                    MAX_SIZE: "MAX_SIZE",
                    MAX_TOTAL_SIZE: "MAX_TOTAL_SIZE",
                    MIN_FILES: "MIN_FILES",
                    MIN_SIZE: "MIN_SIZE",
                    MIN_TOTAL_SIZE: "MIN_TOTAL_SIZE",
                    TYPE: "TYPE"
                },
                html5Attributes: {
                    extension: "extension",
                    maxfiles: "maxFiles",
                    minfiles: "minFiles",
                    maxsize: "maxSize",
                    minsize: "minSize",
                    maxtotalsize: "maxTotalSize",
                    mintotalsize: "minTotalSize",
                    message: "message",
                    type: "type"
                },
                validate: function (b, c, d, e) {
                    var f = b.getFieldValue(c, e);
                    if ("" === f)
                        return !0;
                    var g, h = d.extension ? d.extension.toLowerCase().split(",") : null,
                            i = d.type ? d.type.toLowerCase().split(",") : null,
                            j = window.File && window.FileList && window.FileReader;
                    if (j) {
                        var k = c.get(0).files,
                                l = k.length,
                                m = 0;
                        if (d.maxFiles && l > parseInt(d.maxFiles, 10))
                            return {
                                valid: !1,
                                error: this.Error.MAX_FILES
                            };
                        if (d.minFiles && l < parseInt(d.minFiles, 10))
                            return {
                                valid: !1,
                                error: this.Error.MIN_FILES
                            };
                        for (var n = {}, o = 0; l > o; o++) {
                            if (m += k[o].size, g = k[o].name.substr(k[o].name.lastIndexOf(".") + 1), n = {
                                file: k[o],
                                size: k[o].size,
                                ext: g,
                                type: k[o].type
                            }, d.minSize && k[o].size < parseInt(d.minSize, 10))
                                return {
                                    valid: !1,
                                    error: this.Error.MIN_SIZE,
                                    metaData: n
                                };
                            if (d.maxSize && k[o].size > parseInt(d.maxSize, 10))
                                return {
                                    valid: !1,
                                    error: this.Error.MAX_SIZE,
                                    metaData: n
                                };
                            if (h && -1 === a.inArray(g.toLowerCase(), h))
                                return {
                                    valid: !1,
                                    error: this.Error.EXTENSION,
                                    metaData: n
                                };
                            if (k[o].type && i && -1 === a.inArray(k[o].type.toLowerCase(), i))
                                return {
                                    valid: !1,
                                    error: this.Error.TYPE,
                                    metaData: n
                                }
                        }
                        if (d.maxTotalSize && m > parseInt(d.maxTotalSize, 10))
                            return {
                                valid: !1,
                                error: this.Error.MAX_TOTAL_SIZE,
                                metaData: {
                                    totalSize: m
                                }
                            };
                        if (d.minTotalSize && m < parseInt(d.minTotalSize, 10))
                            return {
                                valid: !1,
                                error: this.Error.MIN_TOTAL_SIZE,
                                metaData: {
                                    totalSize: m
                                }
                            }
                    } else if (g = f.substr(f.lastIndexOf(".") + 1), h && -1 === a.inArray(g.toLowerCase(), h))
                        return {
                            valid: !1,
                            error: this.Error.EXTENSION,
                            metaData: {
                                ext: g
                            }
                        };
                    return !0
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    greaterThan: {
                        "default": "Please enter a value greater than or equal to %s",
                        notInclusive: "Please enter a value greater than %s"
                    }
                }
            }), FormValidation.Validator.greaterThan = {
                html5Attributes: {
                    message: "message",
                    value: "value", 
                    inclusive: "inclusive"
                },
                enableByHtml5: function (a) {
                    var b = a.attr("type"),
                            c = a.attr("min");
                    return c && "date" !== b ? {
                        value: c
                    } : !1
                },
                validate: function (b, c, d, e) {
                    var f = b.getFieldValue(c, e);
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
                },
                _format: function (a) {
                    return (a + "").replace(/,/g , "")
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    grid: {
                        "default": "Please enter a valid GRId number"
                    }
                }
            }), FormValidation.Validator.grid = {
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    return "" === e ? !0 : (e = e.toUpperCase(), /^[GRID:]*([0-9A-Z]{2})[-\s]*([0-9A-Z]{5})[-\s]*([0-9A-Z]{10})[-\s]*([0-9A-Z]{1})$/g.test(e) ? (e = e.replace(/\s/g, "").replace(/-/g, ""), "GRID:" === e.substr(0, 5) && (e = e.substr(5)), FormValidation.Helper.mod37And36(e)) : !1)
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    hex: {
                        "default": "Please enter a valid hexadecimal number"
                    }
                }
            }), FormValidation.Validator.hex = {
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    return "" === e ? !0 : /^[0-9a-fA-F]+$/.test(e)
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    iban: {
                        "default": "Please enter a valid IBAN number",
                        country: "Please enter a valid IBAN number in %s",
                        countries: {
                            AD: "Andorra",
                            AE: "United Arab Emirates",
                            AL: "Albania",
                            AO: "Angola",
                            AT: "Austria",
                            AZ: "Azerbaijan",
                            BA: "Bosnia and Herzegovina",
                            BE: "Belgium",
                            BF: "Burkina Faso",
                            BG: "Bulgaria",
                            BH: "Bahrain",
                            BI: "Burundi",
                            BJ: "Benin",
                            BR: "Brazil",
                            CH: "Switzerland",
                            CI: "Ivory Coast",
                            CM: "Cameroon",
                            CR: "Costa Rica",
                            CV: "Cape Verde",
                            CY: "Cyprus",
                            CZ: "Czech Republic",
                            DE: "Germany",
                            DK: "Denmark",
                            DO: "Dominican Republic",
                            DZ: "Algeria",
                            EE: "Estonia",
                            ES: "Spain",
                            FI: "Finland",
                            FO: "Faroe Islands",
                            FR: "France",
                            GB: "United Kingdom",
                            GE: "Georgia",
                            GI: "Gibraltar",
                            GL: "Greenland",
                            GR: "Greece",
                            GT: "Guatemala",
                            HR: "Croatia",
                            HU: "Hungary",
                            IE: "Ireland",
                            IL: "Israel",
                            IR: "Iran",
                            IS: "Iceland",
                            IT: "Italy",
                            JO: "Jordan",
                            KW: "Kuwait",
                            KZ: "Kazakhstan",
                            LB: "Lebanon",
                            LI: "Liechtenstein",
                            LT: "Lithuania",
                            LU: "Luxembourg",
                            LV: "Latvia",
                            MC: "Monaco",
                            MD: "Moldova",
                            ME: "Montenegro",
                            MG: "Madagascar",
                            MK: "Macedonia",
                            ML: "Mali",
                            MR: "Mauritania",
                            MT: "Malta",
                            MU: "Mauritius",
                            MZ: "Mozambique",
                            NL: "Netherlands",
                            NO: "Norway",
                            PK: "Pakistan",
                            PL: "Poland",
                            PS: "Palestine",
                            PT: "Portugal",
                            QA: "Qatar",
                            RO: "Romania",
                            RS: "Serbia",
                            SA: "Saudi Arabia",
                            SE: "Sweden",
                            SI: "Slovenia",
                            SK: "Slovakia",
                            SM: "San Marino",
                            SN: "Senegal",
                            TL: "East Timor",
                            TN: "Tunisia",
                            TR: "Turkey",
                            VG: "Virgin Islands, British",
                            XK: "Republic of Kosovo"
                        }
                    }
                }
            }), FormValidation.Validator.iban = {
                html5Attributes: {
                    message: "message",
                    country: "country",
                    sepa: "sepa"
                },
                REGEX: {
                    AD: "AD[0-9]{2}[0-9]{4}[0-9]{4}[A-Z0-9]{12}",
                    AE: "AE[0-9]{2}[0-9]{3}[0-9]{16}",
                    AL: "AL[0-9]{2}[0-9]{8}[A-Z0-9]{16}",
                    AO: "AO[0-9]{2}[0-9]{21}",
                    AT: "AT[0-9]{2}[0-9]{5}[0-9]{11}",
                    AZ: "AZ[0-9]{2}[A-Z]{4}[A-Z0-9]{20}",
                    BA: "BA[0-9]{2}[0-9]{3}[0-9]{3}[0-9]{8}[0-9]{2}",
                    BE: "BE[0-9]{2}[0-9]{3}[0-9]{7}[0-9]{2}",
                    BF: "BF[0-9]{2}[0-9]{23}",
                    BG: "BG[0-9]{2}[A-Z]{4}[0-9]{4}[0-9]{2}[A-Z0-9]{8}",
                    BH: "BH[0-9]{2}[A-Z]{4}[A-Z0-9]{14}",
                    BI: "BI[0-9]{2}[0-9]{12}",
                    BJ: "BJ[0-9]{2}[A-Z]{1}[0-9]{23}",
                    BR: "BR[0-9]{2}[0-9]{8}[0-9]{5}[0-9]{10}[A-Z][A-Z0-9]",
                    CH: "CH[0-9]{2}[0-9]{5}[A-Z0-9]{12}",
                    CI: "CI[0-9]{2}[A-Z]{1}[0-9]{23}",
                    CM: "CM[0-9]{2}[0-9]{23}",
                    CR: "CR[0-9]{2}[0-9]{3}[0-9]{14}",
                    CV: "CV[0-9]{2}[0-9]{21}",
                    CY: "CY[0-9]{2}[0-9]{3}[0-9]{5}[A-Z0-9]{16}",
                    CZ: "CZ[0-9]{2}[0-9]{20}",
                    DE: "DE[0-9]{2}[0-9]{8}[0-9]{10}",
                    DK: "DK[0-9]{2}[0-9]{14}",
                    DO: "DO[0-9]{2}[A-Z0-9]{4}[0-9]{20}",
                    DZ: "DZ[0-9]{2}[0-9]{20}",
                    EE: "EE[0-9]{2}[0-9]{2}[0-9]{2}[0-9]{11}[0-9]{1}",
                    ES: "ES[0-9]{2}[0-9]{4}[0-9]{4}[0-9]{1}[0-9]{1}[0-9]{10}",
                    FI: "FI[0-9]{2}[0-9]{6}[0-9]{7}[0-9]{1}",
                    FO: "FO[0-9]{2}[0-9]{4}[0-9]{9}[0-9]{1}",
                    FR: "FR[0-9]{2}[0-9]{5}[0-9]{5}[A-Z0-9]{11}[0-9]{2}",
                    GB: "GB[0-9]{2}[A-Z]{4}[0-9]{6}[0-9]{8}",
                    GE: "GE[0-9]{2}[A-Z]{2}[0-9]{16}",
                    GI: "GI[0-9]{2}[A-Z]{4}[A-Z0-9]{15}",
                    GL: "GL[0-9]{2}[0-9]{4}[0-9]{9}[0-9]{1}",
                    GR: "GR[0-9]{2}[0-9]{3}[0-9]{4}[A-Z0-9]{16}",
                    GT: "GT[0-9]{2}[A-Z0-9]{4}[A-Z0-9]{20}",
                    HR: "HR[0-9]{2}[0-9]{7}[0-9]{10}",
                    HU: "HU[0-9]{2}[0-9]{3}[0-9]{4}[0-9]{1}[0-9]{15}[0-9]{1}",
                    IE: "IE[0-9]{2}[A-Z]{4}[0-9]{6}[0-9]{8}",
                    IL: "IL[0-9]{2}[0-9]{3}[0-9]{3}[0-9]{13}",
                    IR: "IR[0-9]{2}[0-9]{22}",
                    IS: "IS[0-9]{2}[0-9]{4}[0-9]{2}[0-9]{6}[0-9]{10}",
                    IT: "IT[0-9]{2}[A-Z]{1}[0-9]{5}[0-9]{5}[A-Z0-9]{12}",
                    JO: "JO[0-9]{2}[A-Z]{4}[0-9]{4}[0]{8}[A-Z0-9]{10}",
                    KW: "KW[0-9]{2}[A-Z]{4}[0-9]{22}",
                    KZ: "KZ[0-9]{2}[0-9]{3}[A-Z0-9]{13}",
                    LB: "LB[0-9]{2}[0-9]{4}[A-Z0-9]{20}",
                    LI: "LI[0-9]{2}[0-9]{5}[A-Z0-9]{12}",
                    LT: "LT[0-9]{2}[0-9]{5}[0-9]{11}",
                    LU: "LU[0-9]{2}[0-9]{3}[A-Z0-9]{13}",
                    LV: "LV[0-9]{2}[A-Z]{4}[A-Z0-9]{13}",
                    MC: "MC[0-9]{2}[0-9]{5}[0-9]{5}[A-Z0-9]{11}[0-9]{2}",
                    MD: "MD[0-9]{2}[A-Z0-9]{20}",
                    ME: "ME[0-9]{2}[0-9]{3}[0-9]{13}[0-9]{2}",
                    MG: "MG[0-9]{2}[0-9]{23}",
                    MK: "MK[0-9]{2}[0-9]{3}[A-Z0-9]{10}[0-9]{2}",
                    ML: "ML[0-9]{2}[A-Z]{1}[0-9]{23}",
                    MR: "MR13[0-9]{5}[0-9]{5}[0-9]{11}[0-9]{2}",
                    MT: "MT[0-9]{2}[A-Z]{4}[0-9]{5}[A-Z0-9]{18}",
                    MU: "MU[0-9]{2}[A-Z]{4}[0-9]{2}[0-9]{2}[0-9]{12}[0-9]{3}[A-Z]{3}",
                    MZ: "MZ[0-9]{2}[0-9]{21}",
                    NL: "NL[0-9]{2}[A-Z]{4}[0-9]{10}",
                    NO: "NO[0-9]{2}[0-9]{4}[0-9]{6}[0-9]{1}",
                    PK: "PK[0-9]{2}[A-Z]{4}[A-Z0-9]{16}",
                    PL: "PL[0-9]{2}[0-9]{8}[0-9]{16}",
                    PS: "PS[0-9]{2}[A-Z]{4}[A-Z0-9]{21}",
                    PT: "PT[0-9]{2}[0-9]{4}[0-9]{4}[0-9]{11}[0-9]{2}",
                    QA: "QA[0-9]{2}[A-Z]{4}[A-Z0-9]{21}",
                    RO: "RO[0-9]{2}[A-Z]{4}[A-Z0-9]{16}",
                    RS: "RS[0-9]{2}[0-9]{3}[0-9]{13}[0-9]{2}",
                    SA: "SA[0-9]{2}[0-9]{2}[A-Z0-9]{18}",
                    SE: "SE[0-9]{2}[0-9]{3}[0-9]{16}[0-9]{1}",
                    SI: "SI[0-9]{2}[0-9]{5}[0-9]{8}[0-9]{2}",
                    SK: "SK[0-9]{2}[0-9]{4}[0-9]{6}[0-9]{10}",
                    SM: "SM[0-9]{2}[A-Z]{1}[0-9]{5}[0-9]{5}[A-Z0-9]{12}",
                    SN: "SN[0-9]{2}[A-Z]{1}[0-9]{23}",
                    TL: "TL38[0-9]{3}[0-9]{14}[0-9]{2}",
                    TN: "TN59[0-9]{2}[0-9]{3}[0-9]{13}[0-9]{2}",
                    TR: "TR[0-9]{2}[0-9]{5}[A-Z0-9]{1}[A-Z0-9]{16}",
                    VG: "VG[0-9]{2}[A-Z]{4}[0-9]{16}",
                    XK: "XK[0-9]{2}[0-9]{4}[0-9]{10}[0-9]{2}"
                },
                SEPA_COUNTRIES: ["AT", "BE", "BG", "CH", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GB", "GI", "GR", "HR", "HU", "IE", "IS", "IT", "LI", "LT", "LU", "LV", "MC", "MT", "NL", "NO", "PL", "PT", "RO", "SE", "SI", "SK", "SM"],
                validate: function (b, c, d, e) {
                    var f = b.getFieldValue(c, e);
                    if ("" === f)
                        return !0;
                    f = f.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
                    var g = d.country;
                    g ? "string" == typeof g && this.REGEX[g] || (g = b.getDynamicOption(c, g)) : g = f.substr(0, 2);
                    var h = b.getLocale();
                    if (!this.REGEX[g])
                        return !1;
                    if (void 0 !== typeof d.sepa) {
                        var i = -1 !== a.inArray(g, this.SEPA_COUNTRIES);
                        if (("true" === d.sepa || d.sepa === !0) && !i || ("false" === d.sepa || d.sepa === !1) && i)
                            return !1
                    }
                    if (!new RegExp("^" + this.REGEX[g] + "$").test(f))
                        return {
                            valid: !1,
                            message: FormValidation.Helper.format(d.message || FormValidation.I18n[h].iban.country, FormValidation.I18n[h].iban.countries[g])
                        };
                    f = f.substr(4) + f.substr(0, 4), f = a.map(f.split(""), function (a) {
                        var b = a.charCodeAt(0);
                        return b >= "A".charCodeAt(0) && b <= "Z".charCodeAt(0) ? b - "A".charCodeAt(0) + 10 : a
                    }), f = f.join("");
                    for (var j = parseInt(f.substr(0, 1), 10), k = f.length, l = 1; k > l; ++l)
                        j = (10 * j + parseInt(f.substr(l, 1), 10)) % 97;
                    return {
                        valid: 1 === j,
                        message: FormValidation.Helper.format(d.message || FormValidation.I18n[h].iban.country, FormValidation.I18n[h].iban.countries[g])
                    }
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    id: {
                        "default": "Please enter a valid identification number",
                        country: "Please enter a valid identification number in %s",
                        countries: {
                            BA: "Bosnia and Herzegovina",
                            BG: "Bulgaria",
                            BR: "Brazil",
                            CH: "Switzerland",
                            CL: "Chile",
                            CN: "China",
                            CZ: "Czech Republic",
                            DK: "Denmark",
                            EE: "Estonia",
                            ES: "Spain",
                            FI: "Finland",
                            HR: "Croatia",
                            IE: "Ireland",
                            IS: "Iceland",
                            LT: "Lithuania",
                            LV: "Latvia",
                            ME: "Montenegro",
                            MK: "Macedonia",
                            NL: "Netherlands",
                            PL: "Poland",
                            RO: "Romania",
                            RS: "Serbia",
                            SE: "Sweden",
                            SI: "Slovenia",
                            SK: "Slovakia",
                            SM: "San Marino",
                            TH: "Thailand",
                            TR: "Turkey",
                            ZA: "South Africa"
                        }
                    }
                }
            }), FormValidation.Validator.id = {
                html5Attributes: {
                    message: "message",
                    country: "country"
                },
                COUNTRY_CODES: ["BA", "BG", "BR", "CH", "CL", "CN", "CZ", "DK", "EE", "ES", "FI", "HR", "IE", "IS", "LT", "LV", "ME", "MK", "NL", "PL", "RO", "RS", "SE", "SI", "SK", "SM", "TH", "TR", "ZA"],
                validate: function (b, c, d, e) {
                    var f = b.getFieldValue(c, e);
                    if ("" === f)
                        return !0;
                    var g = b.getLocale(),
                            h = d.country;
                    if (h ? ("string" != typeof h || -1 === a.inArray(h.toUpperCase(), this.COUNTRY_CODES)) && (h = b.getDynamicOption(c, h)) : h = f.substr(0, 2), -1 === a.inArray(h, this.COUNTRY_CODES))
                        return !0;
                    var i = ["_", h.toLowerCase()].join(""),
                            j = this[i](f);
                    return j = j === !0 || j === !1 ? {
                        valid: j
                    } : j, j.message = FormValidation.Helper.format(d.message || FormValidation.I18n[g].id.country, FormValidation.I18n[g].id.countries[h.toUpperCase()]), j
                },
                _validateJMBG: function (a, b) {
                    if (!/^\d{13}$/.test(a))
                        return !1;
                    var c = parseInt(a.substr(0, 2), 10),
                            d = parseInt(a.substr(2, 2), 10),
                            e = (parseInt(a.substr(4, 3), 10), parseInt(a.substr(7, 2), 10)),
                            f = parseInt(a.substr(12, 1), 10);
                    if (c > 31 || d > 12)
                        return !1;
                    for (var g = 0, h = 0; 6 > h; h++)
                        g += (7 - h) * (parseInt(a.charAt(h), 10) + parseInt(a.charAt(h + 6), 10));
                    if (g = 11 - g % 11, (10 === g || 11 === g) && (g = 0), g !== f)
                        return !1;
                    switch (b.toUpperCase()) {
                        case "BA":
                            return e >= 10 && 19 >= e;
                        case "MK":
                            return e >= 41 && 49 >= e;
                        case "ME":
                            return e >= 20 && 29 >= e;
                        case "RS":
                            return e >= 70 && 99 >= e;
                        case "SI":
                            return e >= 50 && 59 >= e;
                        default:
                            return !0
                    }
                },
                _ba: function (a) {
                    return this._validateJMBG(a, "BA")
                },
                _mk: function (a) {
                    return this._validateJMBG(a, "MK")
                },
                _me: function (a) {
                    return this._validateJMBG(a, "ME")
                },
                _rs: function (a) {
                    return this._validateJMBG(a, "RS")
                },
                _si: function (a) {
                    return this._validateJMBG(a, "SI")
                },
                _bg: function (a) {
                    if (!/^\d{10}$/.test(a) && !/^\d{6}\s\d{3}\s\d{1}$/.test(a))
                        return !1;
                    a = a.replace(/\s/g, "");
                    var b = parseInt(a.substr(0, 2), 10) + 1900,
                            c = parseInt(a.substr(2, 2), 10),
                            d = parseInt(a.substr(4, 2), 10);
                    if (c > 40 ? (b += 100, c -= 40) : c > 20 && (b -= 100, c -= 20), !FormValidation.Helper.date(b, c, d))
                        return !1;
                    for (var e = 0, f = [2, 4, 8, 5, 10, 9, 7, 3, 6], g = 0; 9 > g; g++)
                        e += parseInt(a.charAt(g), 10) * f[g];
                    return e = e % 11 % 10, e + "" === a.substr(9, 1)
                },
                _br: function (a) {
                    if (a = a.replace(/\D/g, ""), !/^\d{11}$/.test(a) || /^1{11}|2{11}|3{11}|4{11}|5{11}|6{11}|7{11}|8{11}|9{11}|0{11}$/.test(a))
                        return !1;
                    for (var b = 0, c = 0; 9 > c; c++)
                        b += (10 - c) * parseInt(a.charAt(c), 10);
                    if (b = 11 - b % 11, (10 === b || 11 === b) && (b = 0), b + "" !== a.charAt(9))
                        return !1;
                    var d = 0;
                    for (c = 0; 10 > c; c++)
                        d += (11 - c) * parseInt(a.charAt(c), 10);
                    return d = 11 - d % 11, (10 === d || 11 === d) && (d = 0), d + "" === a.charAt(10)
                },
                _ch: function (a) {
                    if (!/^756[\.]{0,1}[0-9]{4}[\.]{0,1}[0-9]{4}[\.]{0,1}[0-9]{2}$/.test(a))
                        return !1;
                    a = a.replace(/\D/g, "").substr(3);
                    for (var b = a.length, c = 0, d = 8 === b ? [3, 1] : [1, 3], e = 0; b - 1 > e; e++)
                        c += parseInt(a.charAt(e), 10) * d[e % 2];
                    return c = 10 - c % 10, c + "" === a.charAt(b - 1)
                },
                _cl: function (a) {
                    if (!/^\d{7,8}[-]{0,1}[0-9K]$/i.test(a))
                        return !1;
                    for (a = a.replace(/\-/g, ""); a.length < 9; )
                        a = "0" + a;
                    for (var b = 0, c = [3, 2, 7, 6, 5, 4, 3, 2], d = 0; 8 > d; d++)
                        b += parseInt(a.charAt(d), 10) * c[d];
                    return b = 11 - b % 11, 11 === b ? b = 0 : 10 === b && (b = "K"), b + "" === a.charAt(8).toUpperCase()
                },
                _cn: function (b) {
                    if (b = b.trim(), !/^\d{15}$/.test(b) && !/^\d{17}[\dXx]{1}$/.test(b))
                        return !1;
                    var c = {
                        11: {
                            0: [0],
                            1: [
                                [0, 9],
                                [11, 17]
                            ],
                            2: [0, 28, 29]
                        },
                        12: {
                            0: [0],
                            1: [
                                [0, 16]
                            ],
                            2: [0, 21, 23, 25]
                        },
                        13: {
                            0: [0],
                            1: [
                                [0, 5], 7, 8, 21, [23, 33],
                                [81, 85]
                            ],
                            2: [
                                [0, 5],
                                [7, 9],
                                [23, 25], 27, 29, 30, 81, 83
                            ],
                            3: [
                                [0, 4],
                                [21, 24]
                            ],
                            4: [
                                [0, 4], 6, 21, [23, 35], 81
                            ],
                            5: [
                                [0, 3],
                                [21, 35], 81, 82
                            ],
                            6: [
                                [0, 4],
                                [21, 38],
                                [81, 84]
                            ],
                            7: [
                                [0, 3], 5, 6, [21, 33]
                            ],
                            8: [
                                [0, 4],
                                [21, 28]
                            ],
                            9: [
                                [0, 3],
                                [21, 30],
                                [81, 84]
                            ],
                            10: [
                                [0, 3],
                                [22, 26], 28, 81, 82
                            ],
                            11: [
                                [0, 2],
                                [21, 28], 81, 82
                            ]
                        },
                        14: {
                            0: [0],
                            1: [0, 1, [5, 10],
                                [21, 23], 81
                            ],
                            2: [
                                [0, 3], 11, 12, [21, 27]
                            ],
                            3: [
                                [0, 3], 11, 21, 22
                            ],
                            4: [
                                [0, 2], 11, 21, [23, 31], 81
                            ],
                            5: [
                                [0, 2], 21, 22, 24, 25, 81
                            ],
                            6: [
                                [0, 3],
                                [21, 24]
                            ],
                            7: [
                                [0, 2],
                                [21, 29], 81
                            ],
                            8: [
                                [0, 2],
                                [21, 30], 81, 82
                            ],
                            9: [
                                [0, 2],
                                [21, 32], 81
                            ],
                            10: [
                                [0, 2],
                                [21, 34], 81, 82
                            ],
                            11: [
                                [0, 2],
                                [21, 30], 81, 82
                            ],
                            23: [
                                [0, 3], 22, 23, [25, 30], 32, 33
                            ]
                        },
                        15: {
                            0: [0],
                            1: [
                                [0, 5],
                                [21, 25]
                            ],
                            2: [
                                [0, 7],
                                [21, 23]
                            ],
                            3: [
                                [0, 4]
                            ],
                            4: [
                                [0, 4],
                                [21, 26],
                                [28, 30]
                            ],
                            5: [
                                [0, 2],
                                [21, 26], 81
                            ],
                            6: [
                                [0, 2],
                                [21, 27]
                            ],
                            7: [
                                [0, 3],
                                [21, 27],
                                [81, 85]
                            ],
                            8: [
                                [0, 2],
                                [21, 26]
                            ],
                            9: [
                                [0, 2],
                                [21, 29], 81
                            ],
                            22: [
                                [0, 2],
                                [21, 24]
                            ],
                            25: [
                                [0, 2],
                                [22, 31]
                            ],
                            26: [
                                [0, 2],
                                [24, 27],
                                [29, 32], 34
                            ],
                            28: [0, 1, [22, 27]],
                            29: [0, [21, 23]]
                        },
                        21: {
                            0: [0],
                            1: [
                                [0, 6],
                                [11, 14],
                                [22, 24], 81
                            ],
                            2: [
                                [0, 4],
                                [11, 13], 24, [81, 83]
                            ],
                            3: [
                                [0, 4], 11, 21, 23, 81
                            ],
                            4: [
                                [0, 4], 11, [21, 23]
                            ],
                            5: [
                                [0, 5], 21, 22
                            ],
                            6: [
                                [0, 4], 24, 81, 82
                            ],
                            7: [
                                [0, 3], 11, 26, 27, 81, 82
                            ],
                            8: [
                                [0, 4], 11, 81, 82
                            ],
                            9: [
                                [0, 5], 11, 21, 22
                            ],
                            10: [
                                [0, 5], 11, 21, 81
                            ],
                            11: [
                                [0, 3], 21, 22
                            ],
                            12: [
                                [0, 2], 4, 21, 23, 24, 81, 82
                            ],
                            13: [
                                [0, 3], 21, 22, 24, 81, 82
                            ],
                            14: [
                                [0, 4], 21, 22, 81
                            ]
                        },
                        22: {
                            0: [0],
                            1: [
                                [0, 6], 12, 22, [81, 83]
                            ],
                            2: [
                                [0, 4], 11, 21, [81, 84]
                            ],
                            3: [
                                [0, 3], 22, 23, 81, 82
                            ],
                            4: [
                                [0, 3], 21, 22
                            ],
                            5: [
                                [0, 3], 21, 23, 24, 81, 82
                            ],
                            6: [
                                [0, 2], 4, 5, [21, 23], 25, 81
                            ],
                            7: [
                                [0, 2],
                                [21, 24], 81
                            ],
                            8: [
                                [0, 2], 21, 22, 81, 82
                            ],
                            24: [
                                [0, 6], 24, 26
                            ]
                        },
                        23: {
                            0: [0],
                            1: [
                                [0, 12], 21, [23, 29],
                                [81, 84]
                            ],
                            2: [
                                [0, 8], 21, [23, 25], 27, [29, 31], 81
                            ],
                            3: [
                                [0, 7], 21, 81, 82
                            ],
                            4: [
                                [0, 7], 21, 22
                            ],
                            5: [
                                [0, 3], 5, 6, [21, 24]
                            ],
                            6: [
                                [0, 6],
                                [21, 24]
                            ],
                            7: [
                                [0, 16], 22, 81
                            ],
                            8: [
                                [0, 5], 11, 22, 26, 28, 33, 81, 82
                            ],
                            9: [
                                [0, 4], 21
                            ],
                            10: [
                                [0, 5], 24, 25, 81, [83, 85]
                            ],
                            11: [
                                [0, 2], 21, 23, 24, 81, 82
                            ],
                            12: [
                                [0, 2],
                                [21, 26],
                                [81, 83]
                            ],
                            27: [
                                [0, 4],
                                [21, 23]
                            ]
                        },
                        31: {
                            0: [0],
                            1: [0, 1, [3, 10],
                                [12, 20]
                            ],
                            2: [0, 30]
                        },
                        32: {
                            0: [0],
                            1: [
                                [0, 7], 11, [13, 18], 24, 25
                            ],
                            2: [
                                [0, 6], 11, 81, 82
                            ],
                            3: [
                                [0, 5], 11, 12, [21, 24], 81, 82
                            ],
                            4: [
                                [0, 2], 4, 5, 11, 12, 81, 82
                            ],
                            5: [
                                [0, 9],
                                [81, 85]
                            ],
                            6: [
                                [0, 2], 11, 12, 21, 23, [81, 84]
                            ],
                            7: [0, 1, 3, 5, 6, [21, 24]],
                            8: [
                                [0, 4], 11, 26, [29, 31]
                            ],
                            9: [
                                [0, 3],
                                [21, 25], 28, 81, 82
                            ],
                            10: [
                                [0, 3], 11, 12, 23, 81, 84, 88
                            ],
                            11: [
                                [0, 2], 11, 12, [81, 83]
                            ],
                            12: [
                                [0, 4],
                                [81, 84]
                            ],
                            13: [
                                [0, 2], 11, [21, 24]
                            ]
                        },
                        33: {
                            0: [0],
                            1: [
                                [0, 6],
                                [8, 10], 22, 27, 82, 83, 85
                            ],
                            2: [0, 1, [3, 6], 11, 12, 25, 26, [81, 83]],
                            3: [
                                [0, 4], 22, 24, [26, 29], 81, 82
                            ],
                            4: [
                                [0, 2], 11, 21, 24, [81, 83]
                            ],
                            5: [
                                [0, 3],
                                [21, 23]
                            ],
                            6: [
                                [0, 2], 21, 24, [81, 83]
                            ],
                            7: [
                                [0, 3], 23, 26, 27, [81, 84]
                            ],
                            8: [
                                [0, 3], 22, 24, 25, 81
                            ],
                            9: [
                                [0, 3], 21, 22
                            ],
                            10: [
                                [0, 4],
                                [21, 24], 81, 82
                            ],
                            11: [
                                [0, 2],
                                [21, 27], 81
                            ]
                        },
                        34: {
                            0: [0],
                            1: [
                                [0, 4], 11, [21, 24], 81
                            ],
                            2: [
                                [0, 4], 7, 8, [21, 23], 25
                            ],
                            3: [
                                [0, 4], 11, [21, 23]
                            ],
                            4: [
                                [0, 6], 21
                            ],
                            5: [
                                [0, 4], 6, [21, 23]
                            ],
                            6: [
                                [0, 4], 21
                            ],
                            7: [
                                [0, 3], 11, 21
                            ],
                            8: [
                                [0, 3], 11, [22, 28], 81
                            ],
                            10: [
                                [0, 4],
                                [21, 24]
                            ],
                            11: [
                                [0, 3], 22, [24, 26], 81, 82
                            ],
                            12: [
                                [0, 4], 21, 22, 25, 26, 82
                            ],
                            13: [
                                [0, 2],
                                [21, 24]
                            ],
                            14: [
                                [0, 2],
                                [21, 24]
                            ],
                            15: [
                                [0, 3],
                                [21, 25]
                            ],
                            16: [
                                [0, 2],
                                [21, 23]
                            ],
                            17: [
                                [0, 2],
                                [21, 23]
                            ],
                            18: [
                                [0, 2],
                                [21, 25], 81
                            ]
                        },
                        35: {
                            0: [0],
                            1: [
                                [0, 5], 11, [21, 25], 28, 81, 82
                            ],
                            2: [
                                [0, 6],
                                [11, 13]
                            ],
                            3: [
                                [0, 5], 22
                            ],
                            4: [
                                [0, 3], 21, [23, 30], 81
                            ],
                            5: [
                                [0, 5], 21, [24, 27],
                                [81, 83]
                            ],
                            6: [
                                [0, 3],
                                [22, 29], 81
                            ],
                            7: [
                                [0, 2],
                                [21, 25],
                                [81, 84]
                            ],
                            8: [
                                [0, 2],
                                [21, 25], 81
                            ],
                            9: [
                                [0, 2],
                                [21, 26], 81, 82
                            ]
                        },
                        36: {
                            0: [0],
                            1: [
                                [0, 5], 11, [21, 24]
                            ],
                            2: [
                                [0, 3], 22, 81
                            ],
                            3: [
                                [0, 2], 13, [21, 23]
                            ],
                            4: [
                                [0, 3], 21, [23, 30], 81, 82
                            ],
                            5: [
                                [0, 2], 21
                            ],
                            6: [
                                [0, 2], 22, 81
                            ],
                            7: [
                                [0, 2],
                                [21, 35], 81, 82
                            ],
                            8: [
                                [0, 3],
                                [21, 30], 81
                            ],
                            9: [
                                [0, 2],
                                [21, 26],
                                [81, 83]
                            ],
                            10: [
                                [0, 2],
                                [21, 30]
                            ],
                            11: [
                                [0, 2],
                                [21, 30], 81
                            ]
                        },
                        37: {
                            0: [0],
                            1: [
                                [0, 5], 12, 13, [24, 26], 81
                            ],
                            2: [
                                [0, 3], 5, [11, 14],
                                [81, 85]
                            ],
                            3: [
                                [0, 6],
                                [21, 23]
                            ],
                            4: [
                                [0, 6], 81
                            ],
                            5: [
                                [0, 3],
                                [21, 23]
                            ],
                            6: [
                                [0, 2],
                                [11, 13], 34, [81, 87]
                            ],
                            7: [
                                [0, 5], 24, 25, [81, 86]
                            ],
                            8: [
                                [0, 2], 11, [26, 32],
                                [81, 83]
                            ],
                            9: [
                                [0, 3], 11, 21, 23, 82, 83
                            ],
                            10: [
                                [0, 2],
                                [81, 83]
                            ],
                            11: [
                                [0, 3], 21, 22
                            ],
                            12: [
                                [0, 3]
                            ],
                            13: [
                                [0, 2], 11, 12, [21, 29]
                            ],
                            14: [
                                [0, 2],
                                [21, 28], 81, 82
                            ],
                            15: [
                                [0, 2],
                                [21, 26], 81
                            ],
                            16: [
                                [0, 2],
                                [21, 26]
                            ],
                            17: [
                                [0, 2],
                                [21, 28]
                            ]
                        },
                        41: {
                            0: [0],
                            1: [
                                [0, 6], 8, 22, [81, 85]
                            ],
                            2: [
                                [0, 5], 11, [21, 25]
                            ],
                            3: [
                                [0, 7], 11, [22, 29], 81
                            ],
                            4: [
                                [0, 4], 11, [21, 23], 25, 81, 82
                            ],
                            5: [
                                [0, 3], 5, 6, 22, 23, 26, 27, 81
                            ],
                            6: [
                                [0, 3], 11, 21, 22
                            ],
                            7: [
                                [0, 4], 11, 21, [24, 28], 81, 82
                            ],
                            8: [
                                [0, 4], 11, [21, 23], 25, [81, 83]
                            ],
                            9: [
                                [0, 2], 22, 23, [26, 28]
                            ],
                            10: [
                                [0, 2],
                                [23, 25], 81, 82
                            ],
                            11: [
                                [0, 4],
                                [21, 23]
                            ],
                            12: [
                                [0, 2], 21, 22, 24, 81, 82
                            ],
                            13: [
                                [0, 3],
                                [21, 30], 81
                            ],
                            14: [
                                [0, 3],
                                [21, 26], 81
                            ],
                            15: [
                                [0, 3],
                                [21, 28]
                            ],
                            16: [
                                [0, 2],
                                [21, 28], 81
                            ],
                            17: [
                                [0, 2],
                                [21, 29]
                            ],
                            90: [0, 1]
                        },
                        42: {
                            0: [0],
                            1: [
                                [0, 7],
                                [11, 17]
                            ],
                            2: [
                                [0, 5], 22, 81
                            ],
                            3: [
                                [0, 3],
                                [21, 25], 81
                            ],
                            5: [
                                [0, 6],
                                [25, 29],
                                [81, 83]
                            ],
                            6: [
                                [0, 2], 6, 7, [24, 26],
                                [82, 84]
                            ],
                            7: [
                                [0, 4]
                            ],
                            8: [
                                [0, 2], 4, 21, 22, 81
                            ],
                            9: [
                                [0, 2],
                                [21, 23], 81, 82, 84
                            ],
                            10: [
                                [0, 3],
                                [22, 24], 81, 83, 87
                            ],
                            11: [
                                [0, 2],
                                [21, 27], 81, 82
                            ],
                            12: [
                                [0, 2],
                                [21, 24], 81
                            ],
                            13: [
                                [0, 3], 21, 81
                            ],
                            28: [
                                [0, 2], 22, 23, [25, 28]
                            ],
                            90: [0, [4, 6], 21]
                        },
                        43: {
                            0: [0],
                            1: [
                                [0, 5], 11, 12, 21, 22, 24, 81
                            ],
                            2: [
                                [0, 4], 11, 21, [23, 25], 81
                            ],
                            3: [
                                [0, 2], 4, 21, 81, 82
                            ],
                            4: [0, 1, [5, 8], 12, [21, 24], 26, 81, 82],
                            5: [
                                [0, 3], 11, [21, 25],
                                [27, 29], 81
                            ],
                            6: [
                                [0, 3], 11, 21, 23, 24, 26, 81, 82
                            ],
                            7: [
                                [0, 3],
                                [21, 26], 81
                            ],
                            8: [
                                [0, 2], 11, 21, 22
                            ],
                            9: [
                                [0, 3],
                                [21, 23], 81
                            ],
                            10: [
                                [0, 3],
                                [21, 28], 81
                            ],
                            11: [
                                [0, 3],
                                [21, 29]
                            ],
                            12: [
                                [0, 2],
                                [21, 30], 81
                            ],
                            13: [
                                [0, 2], 21, 22, 81, 82
                            ],
                            31: [0, 1, [22, 27], 30]
                        },
                        44: {
                            0: [0],
                            1: [
                                [0, 7],
                                [11, 16], 83, 84
                            ],
                            2: [
                                [0, 5], 21, 22, 24, 29, 32, 33, 81, 82
                            ],
                            3: [0, 1, [3, 8]],
                            4: [
                                [0, 4]
                            ],
                            5: [0, 1, [6, 15], 23, 82, 83],
                            6: [0, 1, [4, 8]],
                            7: [0, 1, [3, 5], 81, [83, 85]],
                            8: [
                                [0, 4], 11, 23, 25, [81, 83]
                            ],
                            9: [
                                [0, 3], 23, [81, 83]
                            ],
                            12: [
                                [0, 3],
                                [23, 26], 83, 84
                            ],
                            13: [
                                [0, 3],
                                [22, 24], 81
                            ],
                            14: [
                                [0, 2],
                                [21, 24], 26, 27, 81
                            ],
                            15: [
                                [0, 2], 21, 23, 81
                            ],
                            16: [
                                [0, 2],
                                [21, 25]
                            ],
                            17: [
                                [0, 2], 21, 23, 81
                            ],
                            18: [
                                [0, 3], 21, 23, [25, 27], 81, 82
                            ],
                            19: [0],
                            20: [0],
                            51: [
                                [0, 3], 21, 22
                            ],
                            52: [
                                [0, 3], 21, 22, 24, 81
                            ],
                            53: [
                                [0, 2],
                                [21, 23], 81
                            ]
                        },
                        45: {
                            0: [0],
                            1: [
                                [0, 9],
                                [21, 27]
                            ],
                            2: [
                                [0, 5],
                                [21, 26]
                            ],
                            3: [
                                [0, 5], 11, 12, [21, 32]
                            ],
                            4: [0, 1, [3, 6], 11, [21, 23], 81],
                            5: [
                                [0, 3], 12, 21
                            ],
                            6: [
                                [0, 3], 21, 81
                            ],
                            7: [
                                [0, 3], 21, 22
                            ],
                            8: [
                                [0, 4], 21, 81
                            ],
                            9: [
                                [0, 3],
                                [21, 24], 81
                            ],
                            10: [
                                [0, 2],
                                [21, 31]
                            ],
                            11: [
                                [0, 2],
                                [21, 23]
                            ],
                            12: [
                                [0, 2],
                                [21, 29], 81
                            ],
                            13: [
                                [0, 2],
                                [21, 24], 81
                            ],
                            14: [
                                [0, 2],
                                [21, 25], 81
                            ]
                        },
                        46: {
                            0: [0],
                            1: [0, 1, [5, 8]],
                            2: [0, 1],
                            3: [0, [21, 23]],
                            90: [
                                [0, 3],
                                [5, 7],
                                [21, 39]
                            ]
                        },
                        50: {
                            0: [0],
                            1: [
                                [0, 19]
                            ],
                            2: [0, [22, 38],
                                [40, 43]
                            ],
                            3: [0, [81, 84]]
                        },
                        51: {
                            0: [0],
                            1: [0, 1, [4, 8],
                                [12, 15],
                                [21, 24], 29, 31, 32, [81, 84]
                            ],
                            3: [
                                [0, 4], 11, 21, 22
                            ],
                            4: [
                                [0, 3], 11, 21, 22
                            ],
                            5: [
                                [0, 4], 21, 22, 24, 25
                            ],
                            6: [0, 1, 3, 23, 26, [81, 83]],
                            7: [0, 1, 3, 4, [22, 27], 81],
                            8: [
                                [0, 2], 11, 12, [21, 24]
                            ],
                            9: [
                                [0, 4],
                                [21, 23]
                            ],
                            10: [
                                [0, 2], 11, 24, 25, 28
                            ],
                            11: [
                                [0, 2],
                                [11, 13], 23, 24, 26, 29, 32, 33, 81
                            ],
                            13: [
                                [0, 4],
                                [21, 25], 81
                            ],
                            14: [
                                [0, 2],
                                [21, 25]
                            ],
                            15: [
                                [0, 3],
                                [21, 29]
                            ],
                            16: [
                                [0, 3],
                                [21, 23], 81
                            ],
                            17: [
                                [0, 3],
                                [21, 25], 81
                            ],
                            18: [
                                [0, 3],
                                [21, 27]
                            ],
                            19: [
                                [0, 3],
                                [21, 23]
                            ],
                            20: [
                                [0, 2], 21, 22, 81
                            ],
                            32: [0, [21, 33]],
                            33: [0, [21, 38]],
                            34: [0, 1, [22, 37]]
                        },
                        52: {
                            0: [0],
                            1: [
                                [0, 3],
                                [11, 15],
                                [21, 23], 81
                            ],
                            2: [0, 1, 3, 21, 22],
                            3: [
                                [0, 3],
                                [21, 30], 81, 82
                            ],
                            4: [
                                [0, 2],
                                [21, 25]
                            ],
                            5: [
                                [0, 2],
                                [21, 27]
                            ],
                            6: [
                                [0, 3],
                                [21, 28]
                            ],
                            22: [0, 1, [22, 30]],
                            23: [0, 1, [22, 28]],
                            24: [0, 1, [22, 28]],
                            26: [0, 1, [22, 36]],
                            27: [
                                [0, 2], 22, 23, [25, 32]
                            ]
                        },
                        53: {
                            0: [0],
                            1: [
                                [0, 3],
                                [11, 14], 21, 22, [24, 29], 81
                            ],
                            3: [
                                [0, 2],
                                [21, 26], 28, 81
                            ],
                            4: [
                                [0, 2],
                                [21, 28]
                            ],
                            5: [
                                [0, 2],
                                [21, 24]
                            ],
                            6: [
                                [0, 2],
                                [21, 30]
                            ],
                            7: [
                                [0, 2],
                                [21, 24]
                            ],
                            8: [
                                [0, 2],
                                [21, 29]
                            ],
                            9: [
                                [0, 2],
                                [21, 27]
                            ],
                            23: [0, 1, [22, 29], 31],
                            25: [
                                [0, 4],
                                [22, 32]
                            ],
                            26: [0, 1, [21, 28]],
                            27: [0, 1, [22, 30]],
                            28: [0, 1, 22, 23],
                            29: [0, 1, [22, 32]],
                            31: [0, 2, 3, [22, 24]],
                            34: [0, [21, 23]],
                            33: [0, 21, [23, 25]],
                            35: [0, [21, 28]]
                        },
                        54: {
                            0: [0],
                            1: [
                                [0, 2],
                                [21, 27]
                            ],
                            21: [0, [21, 29], 32, 33],
                            22: [0, [21, 29],
                                [31, 33]
                            ],
                            23: [0, 1, [22, 38]],
                            24: [0, [21, 31]],
                            25: [0, [21, 27]],
                            26: [0, [21, 27]]
                        },
                        61: {
                            0: [0],
                            1: [
                                [0, 4],
                                [11, 16], 22, [24, 26]
                            ],
                            2: [
                                [0, 4], 22
                            ],
                            3: [
                                [0, 4],
                                [21, 24],
                                [26, 31]
                            ],
                            4: [
                                [0, 4],
                                [22, 31], 81
                            ],
                            5: [
                                [0, 2],
                                [21, 28], 81, 82
                            ],
                            6: [
                                [0, 2],
                                [21, 32]
                            ],
                            7: [
                                [0, 2],
                                [21, 30]
                            ],
                            8: [
                                [0, 2],
                                [21, 31]
                            ],
                            9: [
                                [0, 2],
                                [21, 29]
                            ],
                            10: [
                                [0, 2],
                                [21, 26]
                            ]
                        },
                        62: {
                            0: [0],
                            1: [
                                [0, 5], 11, [21, 23]
                            ],
                            2: [0, 1],
                            3: [
                                [0, 2], 21
                            ],
                            4: [
                                [0, 3],
                                [21, 23]
                            ],
                            5: [
                                [0, 3],
                                [21, 25]
                            ],
                            6: [
                                [0, 2],
                                [21, 23]
                            ],
                            7: [
                                [0, 2],
                                [21, 25]
                            ],
                            8: [
                                [0, 2],
                                [21, 26]
                            ],
                            9: [
                                [0, 2],
                                [21, 24], 81, 82
                            ],
                            10: [
                                [0, 2],
                                [21, 27]
                            ],
                            11: [
                                [0, 2],
                                [21, 26]
                            ],
                            12: [
                                [0, 2],
                                [21, 28]
                            ],
                            24: [0, 21, [24, 29]],
                            26: [0, 21, [23, 30]],
                            29: [0, 1, [21, 27]],
                            30: [0, 1, [21, 27]]
                        },
                        63: {
                            0: [0],
                            1: [
                                [0, 5],
                                [21, 23]
                            ],
                            2: [0, 2, [21, 25]],
                            21: [0, [21, 23],
                                [26, 28]
                            ],
                            22: [0, [21, 24]],
                            23: [0, [21, 24]],
                            25: [0, [21, 25]],
                            26: [0, [21, 26]],
                            27: [0, 1, [21, 26]],
                            28: [
                                [0, 2],
                                [21, 23]
                            ]
                        },
                        64: {
                            0: [0],
                            1: [0, 1, [4, 6], 21, 22, 81],
                            2: [
                                [0, 3], 5, [21, 23]
                            ],
                            3: [
                                [0, 3],
                                [21, 24], 81
                            ],
                            4: [
                                [0, 2],
                                [21, 25]
                            ],
                            5: [
                                [0, 2], 21, 22
                            ]
                        },
                        65: {
                            0: [0],
                            1: [
                                [0, 9], 21
                            ],
                            2: [
                                [0, 5]
                            ],
                            21: [0, 1, 22, 23],
                            22: [0, 1, 22, 23],
                            23: [
                                [0, 3],
                                [23, 25], 27, 28
                            ],
                            28: [0, 1, [22, 29]],
                            29: [0, 1, [22, 29]],
                            30: [0, 1, [22, 24]],
                            31: [0, 1, [21, 31]],
                            32: [0, 1, [21, 27]],
                            40: [0, 2, 3, [21, 28]],
                            42: [
                                [0, 2], 21, [23, 26]
                            ],
                            43: [0, 1, [21, 26]],
                            90: [
                                [0, 4]
                            ],
                            27: [
                                [0, 2], 22, 23
                            ]
                        },
                        71: {
                            0: [0]
                        },
                        81: {
                            0: [0]
                        },
                        82: {
                            0: [0]
                        }
                    },
                            d = parseInt(b.substr(0, 2), 10),
                            e = parseInt(b.substr(2, 2), 10),
                            f = parseInt(b.substr(4, 2), 10);
                    if (!c[d] || !c[d][e])
                        return !1;
                    for (var g = !1, h = c[d][e], i = 0; i < h.length; i++)
                        if (a.isArray(h[i]) && h[i][0] <= f && f <= h[i][1] || !a.isArray(h[i]) && f === h[i]) {
                            g = !0;
                            break
                        }
                    if (!g)
                        return !1;
                    var j;
                    j = 18 === b.length ? b.substr(6, 8) : "19" + b.substr(6, 6);
                    var k = parseInt(j.substr(0, 4), 10),
                            l = parseInt(j.substr(4, 2), 10),
                            m = parseInt(j.substr(6, 2), 10);
                    if (!FormValidation.Helper.date(k, l, m))
                        return !1;
                    if (18 === b.length) {
                        var n = 0,
                                o = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                        for (i = 0; 17 > i; i++)
                            n += parseInt(b.charAt(i), 10) * o[i];
                        n = (12 - n % 11) % 11;
                        var p = "X" !== b.charAt(17).toUpperCase() ? parseInt(b.charAt(17), 10) : 10;
                        return p === n
                    }
                    return !0
                },
                _cz: function (a) {
                    if (!/^\d{9,10}$/.test(a))
                        return !1;
                    var b = 1900 + parseInt(a.substr(0, 2), 10),
                            c = parseInt(a.substr(2, 2), 10) % 50 % 20,
                            d = parseInt(a.substr(4, 2), 10);
                    if (9 === a.length) {
                        if (b >= 1980 && (b -= 100), b > 1953)
                            return !1
                    } else
                        1954 > b && (b += 100);
                    if (!FormValidation.Helper.date(b, c, d))
                        return !1;
                    if (10 === a.length) {
                        var e = parseInt(a.substr(0, 9), 10) % 11;
                        return 1985 > b && (e %= 10), e + "" === a.substr(9, 1)
                    }
                    return !0
                },
                _dk: function (a) {
                    if (!/^[0-9]{6}[-]{0,1}[0-9]{4}$/.test(a))
                        return !1;
                    a = a.replace(/-/g, "");
                    var b = parseInt(a.substr(0, 2), 10),
                            c = parseInt(a.substr(2, 2), 10),
                            d = parseInt(a.substr(4, 2), 10);
                    switch (!0) {
                        case - 1 !== "5678".indexOf(a.charAt(6)) && d >= 58:
                            d += 1800;
                            break;
                        case - 1 !== "0123".indexOf(a.charAt(6)):
                        case - 1 !== "49".indexOf(a.charAt(6)) && d >= 37:
                            d += 1900;
                            break;
                        default:
                            d += 2e3
                    }
                    return FormValidation.Helper.date(d, c, b)
                },
                _ee: function (a) {
                    return this._lt(a)
                },
                _es: function (a) {
                    var b = /^[0-9]{8}[-]{0,1}[A-HJ-NP-TV-Z]$/.test(a),
                            c = /^[XYZ][-]{0,1}[0-9]{7}[-]{0,1}[A-HJ-NP-TV-Z]$/.test(a),
                            d = /^[A-HNPQS][-]{0,1}[0-9]{7}[-]{0,1}[0-9A-J]$/.test(a);
                    if (!b && !c && !d)
                        return !1;
                    a = a.replace(/-/g, "");
                    var e, f, g = !0;
                    if (b || c) {
                        f = "DNI";
                        var h = "XYZ".indexOf(a.charAt(0));
                        return -1 !== h && (a = h + a.substr(1) + "", f = "NIE"), e = parseInt(a.substr(0, 8), 10), e = "TRWAGMYFPDXBNJZSQVHLCKE" [e % 23], {
                            valid: e === a.substr(8, 1),
                            type: f
                        }
                    }
                    e = a.substr(1, 7), f = "CIF";
                    for (var i = a[0], j = a.substr(-1), k = 0, l = 0; l < e.length; l++)
                        if (l % 2 !== 0)
                            k += parseInt(e[l], 10);
                        else {
                            var m = "" + 2 * parseInt(e[l], 10);
                            k += parseInt(m[0], 10), 2 === m.length && (k += parseInt(m[1], 10))
                        }
                    var n = k - 10 * Math.floor(k / 10);
                    return 0 !== n && (n = 10 - n), g = -1 !== "KQS".indexOf(i) ? j === "JABCDEFGHI" [n] : -1 !== "ABEH".indexOf(i) ? j === "" + n : j === "" + n || j === "JABCDEFGHI" [n], {
                        valid: g,
                        type: f
                    }
                },
                _fi: function (a) {
                    if (!/^[0-9]{6}[-+A][0-9]{3}[0-9ABCDEFHJKLMNPRSTUVWXY]$/.test(a))
                        return !1;
                    var b = parseInt(a.substr(0, 2), 10),
                            c = parseInt(a.substr(2, 2), 10),
                            d = parseInt(a.substr(4, 2), 10),
                            e = {
                                "+": 1800,
                                "-": 1900,
                                A: 2e3
                            };
                    if (d = e[a.charAt(6)] + d, !FormValidation.Helper.date(d, c, b))
                        return !1;
                    var f = parseInt(a.substr(7, 3), 10);
                    if (2 > f)
                        return !1;
                    var g = a.substr(0, 6) + a.substr(7, 3) + "";
                    return g = parseInt(g, 10), "0123456789ABCDEFHJKLMNPRSTUVWXY".charAt(g % 31) === a.charAt(10)
                },
                _hr: function (a) {
                    return /^[0-9]{11}$/.test(a) ? FormValidation.Helper.mod11And10(a) : !1
                },
                _ie: function (a) {
                    if (!/^\d{7}[A-W][AHWTX]?$/.test(a))
                        return !1;
                    var b = function (a) {
                        for (; a.length < 7; )
                            a = "0" + a;
                        for (var b = "WABCDEFGHIJKLMNOPQRSTUV", c = 0, d = 0; 7 > d; d++)
                            c += parseInt(a.charAt(d), 10) * (8 - d);
                        return c += 9 * b.indexOf(a.substr(7)), b[c % 23]
                    };
                    return 9 !== a.length || "A" !== a.charAt(8) && "H" !== a.charAt(8) ? a.charAt(7) === b(a.substr(0, 7)) : a.charAt(7) === b(a.substr(0, 7) + a.substr(8) + "")
                },
                _is: function (a) {
                    if (!/^[0-9]{6}[-]{0,1}[0-9]{4}$/.test(a))
                        return !1;
                    a = a.replace(/-/g, "");
                    var b = parseInt(a.substr(0, 2), 10),
                            c = parseInt(a.substr(2, 2), 10),
                            d = parseInt(a.substr(4, 2), 10),
                            e = parseInt(a.charAt(9), 10);
                    if (d = 9 === e ? 1900 + d : 100 * (20 + e) + d, !FormValidation.Helper.date(d, c, b, !0))
                        return !1;
                    for (var f = 0, g = [3, 2, 7, 6, 5, 4, 3, 2], h = 0; 8 > h; h++)
                        f += parseInt(a.charAt(h), 10) * g[h];
                    return f = 11 - f % 11, f + "" === a.charAt(8)
                },
                _lt: function (a) {
                    if (!/^[0-9]{11}$/.test(a))
                        return !1;
                    var b = parseInt(a.charAt(0), 10),
                            c = parseInt(a.substr(1, 2), 10),
                            d = parseInt(a.substr(3, 2), 10),
                            e = parseInt(a.substr(5, 2), 10),
                            f = b % 2 === 0 ? 17 + b / 2 : 17 + (b + 1) / 2;
                    if (c = 100 * f + c, !FormValidation.Helper.date(c, d, e, !0))
                        return !1;
                    for (var g = 0, h = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1], i = 0; 10 > i; i++)
                        g += parseInt(a.charAt(i), 10) * h[i];
                    if (g %= 11, 10 !== g)
                        return g + "" === a.charAt(10);
                    for (g = 0, h = [3, 4, 5, 6, 7, 8, 9, 1, 2, 3], i = 0; 10 > i; i++)
                        g += parseInt(a.charAt(i), 10) * h[i];
                    return g %= 11, 10 === g && (g = 0), g + "" === a.charAt(10)
                },
                _lv: function (a) {
                    if (!/^[0-9]{6}[-]{0,1}[0-9]{5}$/.test(a))
                        return !1;
                    a = a.replace(/\D/g, "");
                    var b = parseInt(a.substr(0, 2), 10),
                            c = parseInt(a.substr(2, 2), 10),
                            d = parseInt(a.substr(4, 2), 10);
                    if (d = d + 1800 + 100 * parseInt(a.charAt(6), 10), !FormValidation.Helper.date(d, c, b, !0))
                        return !1;
                    for (var e = 0, f = [10, 5, 8, 4, 2, 1, 6, 3, 7, 9], g = 0; 10 > g; g++)
                        e += parseInt(a.charAt(g), 10) * f[g];
                    return e = (e + 1) % 11 % 10, e + "" === a.charAt(10)
                },
                _nl: function (a) {
                    if (a.length < 8)
                        return !1;
                    if (8 === a.length && (a = "0" + a), !/^[0-9]{4}[.]{0,1}[0-9]{2}[.]{0,1}[0-9]{3}$/.test(a))
                        return !1;
                    if (a = a.replace(/\./g, ""), 0 === parseInt(a, 10))
                        return !1;
                    for (var b = 0, c = a.length, d = 0; c - 1 > d; d++)
                        b += (9 - d) * parseInt(a.charAt(d), 10);
                    return b %= 11, 10 === b && (b = 0), b + "" === a.charAt(c - 1)
                },
                _pl: function (a) {
                    if (!/^[0-9]{11}$/.test(a))
                        return !1;
                    for (var b = 0, c = a.length, d = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3, 7], e = 0; c - 1 > e; e++)
                        b += d[e] * parseInt(a.charAt(e), 10);
                    return b %= 10, 0 === b && (b = 10), b = 10 - b, b + "" === a.charAt(c - 1)
                },
                _ro: function (a) {
                    if (!/^[0-9]{13}$/.test(a))
                        return !1;
                    var b = parseInt(a.charAt(0), 10);
                    if (0 === b || 7 === b || 8 === b)
                        return !1;
                    var c = parseInt(a.substr(1, 2), 10),
                            d = parseInt(a.substr(3, 2), 10),
                            e = parseInt(a.substr(5, 2), 10),
                            f = {
                                1: 1900,
                                2: 1900,
                                3: 1800,
                                4: 1800,
                                5: 2e3,
                                6: 2e3
                            };
                    if (e > 31 && d > 12)
                        return !1;
                    if (9 !== b && (c = f[b + ""] + c, !FormValidation.Helper.date(c, d, e)))
                        return !1;
                    for (var g = 0, h = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9], i = a.length, j = 0; i - 1 > j; j++)
                        g += parseInt(a.charAt(j), 10) * h[j];
                    return g %= 11, 10 === g && (g = 1), g + "" === a.charAt(i - 1)
                },
                _se: function (a) {
                    if (!/^[0-9]{10}$/.test(a) && !/^[0-9]{6}[-|+][0-9]{4}$/.test(a))
                        return !1;
                    a = a.replace(/[^0-9]/g, "");
                    var b = parseInt(a.substr(0, 2), 10) + 1900,
                            c = parseInt(a.substr(2, 2), 10),
                            d = parseInt(a.substr(4, 2), 10);
                    return FormValidation.Helper.date(b, c, d) ? FormValidation.Helper.luhn(a) : !1
                },
                _sk: function (a) {
                    return this._cz(a)
                },
                _sm: function (a) {
                    return /^\d{5}$/.test(a)
                },
                _th: function (a) {
                    if (13 !== a.length)
                        return !1;
                    for (var b = 0, c = 0; 12 > c; c++)
                        b += parseInt(a.charAt(c), 10) * (13 - c);
                    return (11 - b % 11) % 10 === parseInt(a.charAt(12), 10)
                },
                _tr: function (a) {
                    if (11 !== a.length)
                        return !1;
                    for (var b = 0, c = 0; 10 > c; c++)
                        b += parseInt(a.charAt(c), 10);
                    return b % 10 === parseInt(a.charAt(10), 10)
                },
                _za: function (a) {
                    if (!/^[0-9]{10}[0|1][8|9][0-9]$/.test(a))
                        return !1;
                    var b = parseInt(a.substr(0, 2), 10),
                            c = (new Date).getFullYear() % 100,
                            d = parseInt(a.substr(2, 2), 10),
                            e = parseInt(a.substr(4, 2), 10);
                    return b = b >= c ? b + 1900 : b + 2e3, FormValidation.Helper.date(b, d, e) ? FormValidation.Helper.luhn(a) : !1
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    identical: {
                        "default": "Please enter the same value"
                    }
                }
            }), FormValidation.Validator.identical = {
                html5Attributes: {
                    message: "message",
                    field: "field"
                },
                init: function (a, b, c, d) {
                    var e = a.getFieldElements(c.field);
                    a.onLiveChange(e, "live_" + d, function () {
                        var c = a.getStatus(b, d);
                        c !== a.STATUS_NOT_VALIDATED && a.revalidateField(b)
                    })
                },
                destroy: function (a, b, c, d) {
                    var e = a.getFieldElements(c.field);
                    a.offLiveChange(e, "live_" + d)
                },
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d),
                            f = a.getFieldElements(c.field);
                    if (null === f || 0 === f.length)
                        return !0;
                    var g = a.getFieldValue(f, d);
                    return e === g ? (a.updateStatus(f, a.STATUS_VALID, d), !0) : !1
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    imei: {
                        "default": "Please enter a valid IMEI number"
                    }
                }
            }), FormValidation.Validator.imei = {
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    if ("" === e)
                        return !0;
                    switch (!0) {
                        case / ^ \d{15}$ / .test(e):
                        case / ^ \d{2} - \d{6} - \d{6} - \d{1}$ / .test(e):
                        case / ^ \d{2}\s\d{6}\s\d{6}\s\d{1}$ / .test(e):
                            return e = e.replace(/[^0-9]/g, ""), FormValidation.Helper.luhn(e);
                        case / ^ \d{14}$ / .test(e):
                        case / ^ \d{16}$ / .test(e):
                        case / ^ \d{2} - \d{6} - \d{6}( | - \d{2})$ / .test(e):
                        case / ^ \d{2}\s\d{6}\s\d{6}( | \s\d{2})$ / .test(e):
                            return !0;
                        default:
                            return !1
                    }
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    imo: {
                        "default": "Please enter a valid IMO number"
                    }
                }
            }), FormValidation.Validator.imo = {
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    if ("" === e)
                        return !0;
                    if (!/^IMO \d{7}$/i.test(e))
                        return !1;
                    for (var f = 0, g = e.replace(/^.*(\d{7})$/, "$1"), h = 6; h >= 1; h--)
                        f += g.slice(6 - h, -h) * (h + 1);
                    return f % 10 === parseInt(g.charAt(6), 10)
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    integer: {
                        "default": "Please enter a valid number"
                    }
                }
            }), FormValidation.Validator.integer = {
                html5Attributes: {
                    message: "message",
                    thousandsseparator: "thousandsSeparator",
                    decimalseparator: "decimalSeparator"
                },
                enableByHtml5: function (a) {
                    return "number" === a.attr("type") && (void 0 === a.attr("step") || a.attr("step") % 1 === 0)
                },
                validate: function (a, b, c, d) {
                    if (this.enableByHtml5(b) && b.get(0).validity && b.get(0).validity.badInput === !0)
                        return !1;
                    var e = a.getFieldValue(b, d);
                    if ("" === e)
                        return !0;
                    var f = c.decimalSeparator || ".",
                            g = c.thousandsSeparator || "";
                    f = "." === f ? "\\." : f, g = "." === g ? "\\." : g;
                    var h = new RegExp("^-?[0-9]{1,3}(" + g + "[0-9]{3})*(" + f + "[0-9]+)?$"),
                            i = new RegExp(g, "g");
                    return h.test(e) ? (g && (e = e.replace(i, "")), f && (e = e.replace(f, ".")), isNaN(e) || !isFinite(e) ? !1 : (e = parseFloat(e), Math.floor(e) === e)) : !1
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    ip: {
                        "default": "Please enter a valid IP address",
                        ipv4: "Please enter a valid IPv4 address",
                        ipv6: "Please enter a valid IPv6 address"
                    }
                }
            }), FormValidation.Validator.ip = {
                html5Attributes: {
                    message: "message",
                    ipv4: "ipv4",
                    ipv6: "ipv6"
                },
                validate: function (b, c, d, e) {
                    var f = b.getFieldValue(c, e);
                    if ("" === f)
                        return !0;
                    d = a.extend({}, {
                        ipv4: !0,
                        ipv6: !0
                    }, d);
                    var g, h = b.getLocale(),
                            i = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/([0-9]|[1-2][0-9]|3[0-2]))?$/,
                            j = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*(\/(\d|\d\d|1[0-1]\d|12[0-8]))?$/,
                            k = !1;
                    switch (!0) {
                        case d.ipv4 && !d.ipv6:
                            k = i.test(f), g = d.message || FormValidation.I18n[h].ip.ipv4;
                            break;
                        case !d.ipv4 && d.ipv6:
                            k = j.test(f), g = d.message || FormValidation.I18n[h].ip.ipv6;
                            break;
                        case d.ipv4 && d.ipv6:
                        default:
                            k = i.test(f) || j.test(f), g = d.message || FormValidation.I18n[h].ip["default"]
                    }
                    return {
                        valid: k,
                        message: g
                    }
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    isbn: {
                        "default": "Please enter a valid ISBN number"
                    }
                }
            }), FormValidation.Validator.isbn = {
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    if ("" === e)
                        return !0;
                    var f;
                    switch (!0) {
                        case / ^ \d{9}[\dX]$ / .test(e):
                        case 13 === e.length && /^(\d+)-(\d+)-(\d+)-([\dX])$/.test(e):
                        case 13 === e.length && /^(\d+)\s(\d+)\s(\d+)\s([\dX])$/.test(e):
                            f = "ISBN10";
                            break;
                        case / ^ (978 | 979)\d{9}[\dX]$ / .test(e):
                        case 17 === e.length && /^(978|979)-(\d+)-(\d+)-(\d+)-([\dX])$/.test(e):
                        case 17 === e.length && /^(978|979)\s(\d+)\s(\d+)\s(\d+)\s([\dX])$/.test(e):
                            f = "ISBN13";
                            break;
                        default:
                            return !1
                    }
                    e = e.replace(/[^0-9X]/gi, "");
                    var g, h, i = e.split(""),
                            j = i.length,
                            k = 0;
                    switch (f) {
                        case "ISBN10":
                            for (k = 0, g = 0; j - 1 > g; g++)
                                k += parseInt(i[g], 10) * (10 - g);
                            return h = 11 - k % 11, 11 === h ? h = 0 : 10 === h && (h = "X"), {
                                type: f,
                                valid: h + "" === i[j - 1]
                            };
                        case "ISBN13":
                            for (k = 0, g = 0; j - 1 > g; g++)
                                k += g % 2 === 0 ? parseInt(i[g], 10) : 3 * parseInt(i[g], 10);
                            return h = 10 - k % 10, 10 === h && (h = "0"), {
                                type: f,
                                valid: h + "" === i[j - 1]
                            };
                        default:
                            return !1
                    }
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    isin: {
                        "default": "Please enter a valid ISIN number"
                    }
                }
            }), FormValidation.Validator.isin = {
                COUNTRY_CODES: "AF|AX|AL|DZ|AS|AD|AO|AI|AQ|AG|AR|AM|AW|AU|AT|AZ|BS|BH|BD|BB|BY|BE|BZ|BJ|BM|BT|BO|BQ|BA|BW|BV|BR|IO|BN|BG|BF|BI|KH|CM|CA|CV|KY|CF|TD|CL|CN|CX|CC|CO|KM|CG|CD|CK|CR|CI|HR|CU|CW|CY|CZ|DK|DJ|DM|DO|EC|EG|SV|GQ|ER|EE|ET|FK|FO|FJ|FI|FR|GF|PF|TF|GA|GM|GE|DE|GH|GI|GR|GL|GD|GP|GU|GT|GG|GN|GW|GY|HT|HM|VA|HN|HK|HU|IS|IN|ID|IR|IQ|IE|IM|IL|IT|JM|JP|JE|JO|KZ|KE|KI|KP|KR|KW|KG|LA|LV|LB|LS|LR|LY|LI|LT|LU|MO|MK|MG|MW|MY|MV|ML|MT|MH|MQ|MR|MU|YT|MX|FM|MD|MC|MN|ME|MS|MA|MZ|MM|NA|NR|NP|NL|NC|NZ|NI|NE|NG|NU|NF|MP|NO|OM|PK|PW|PS|PA|PG|PY|PE|PH|PN|PL|PT|PR|QA|RE|RO|RU|RW|BL|SH|KN|LC|MF|PM|VC|WS|SM|ST|SA|SN|RS|SC|SL|SG|SX|SK|SI|SB|SO|ZA|GS|SS|ES|LK|SD|SR|SJ|SZ|SE|CH|SY|TW|TJ|TZ|TH|TL|TG|TK|TO|TT|TN|TR|TM|TC|TV|UG|UA|AE|GB|US|UM|UY|UZ|VU|VE|VN|VG|VI|WF|EH|YE|ZM|ZW",
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    if ("" === e)
                        return !0;
                    e = e.toUpperCase();
                    var f = new RegExp("^(" + this.COUNTRY_CODES + ")[0-9A-Z]{10}$");
                    if (!f.test(e))
                        return !1;
                    for (var g = "", h = e.length, i = 0; h - 1 > i; i++) {
                        var j = e.charCodeAt(i);
                        g += j > 57 ? (j - 55).toString() : e.charAt(i)
                    }
                    var k = "",
                            l = g.length,
                            m = l % 2 !== 0 ? 0 : 1;
                    for (i = 0; l > i; i++)
                        k += parseInt(g[i], 10) * (i % 2 === m ? 2 : 1) + "";
                    var n = 0;
                    for (i = 0; i < k.length; i++)
                        n += parseInt(k.charAt(i), 10);
                    return n = (10 - n % 10) % 10, n + "" === e.charAt(h - 1)
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    ismn: {
                        "default": "Please enter a valid ISMN number"
                    }
                }
            }), FormValidation.Validator.ismn = {
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    if ("" === e)
                        return !0;
                    var f;
                    switch (!0) {
                        case / ^ M\d{9}$ / .test(e):
                        case / ^ M - \d{4} - \d{4} - \d{1}$ / .test(e):
                        case / ^ M\s\d{4}\s\d{4}\s\d{1}$ / .test(e):
                            f = "ISMN10";
                            break;
                        case / ^ 9790\d{9}$ / .test(e):
                        case / ^ 979 - 0 - \d{4} - \d{4} - \d{1}$ / .test(e):
                        case / ^ 979\s0\s\d{4}\s\d{4}\s\d{1}$ / .test(e):
                            f = "ISMN13";
                            break;
                        default:
                            return !1
                    }
                    "ISMN10" === f && (e = "9790" + e.substr(1)), e = e.replace(/[^0-9]/gi, "");
                    for (var g = e.length, h = 0, i = [1, 3], j = 0; g - 1 > j; j++)
                        h += parseInt(e.charAt(j), 10) * i[j % 2];
                    return h = 10 - h % 10, {
                        type: f,
                        valid: h + "" === e.charAt(g - 1)
                    }
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    issn: {
                        "default": "Please enter a valid ISSN number"
                    }
                }
            }), FormValidation.Validator.issn = {
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    if ("" === e)
                        return !0;
                    if (!/^\d{4}\-\d{3}[\dX]$/.test(e))
                        return !1;
                    e = e.replace(/[^0-9X]/gi, "");
                    var f = e.split(""),
                            g = f.length,
                            h = 0;
                    "X" === f[7] && (f[7] = 10);
                    for (var i = 0; g > i; i++)
                        h += parseInt(f[i], 10) * (8 - i);
                    return h % 11 === 0
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    lessThan: {
                        "default": "Please enter a value less than or equal to %s",
                        notInclusive: "Please enter a value less than %s"
                    }
                }
            }), FormValidation.Validator.lessThan = {
                html5Attributes: {
                    message: "message",
                    value: "value",
                    inclusive: "inclusive"
                },
                enableByHtml5: function (a) {
                    var b = a.attr("type"),
                            c = a.attr("max");
                    return c && "date" !== b ? {
                        value: c
                    } : !1
                },
                validate: function (b, c, d, e) {
                    var f = b.getFieldValue(c, e);
                    if ("" === f)
                        return !0;
                    f = this._format(f);
                    var g = b.getLocale(),
                            h = a.isNumeric(d.value) ? d.value : b.getDynamicOption(c, d.value),
                            i = this._format(h);
                    return d.inclusive === !0 || void 0 === d.inclusive ? {
                        valid: a.isNumeric(f) && parseFloat(f) <= i,
                        message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].lessThan["default"], h)
                    } : {
                        valid: a.isNumeric(f) && parseFloat(f) < i,
                        message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].lessThan.notInclusive, h)
                    }
                },
                _format: function (a) {
                    return (a + "").replace(",", ".")
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    mac: {
                        "default": "Please enter a valid MAC address"
                    }
                }
            }), FormValidation.Validator.mac = {
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    return "" === e ? !0 : /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(e) || /^([0-9A-Fa-f]{4}\.){2}([0-9A-Fa-f]{4})$/.test(e)
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    notEmpty: {
                        "default": "Please enter a value"
                    }
                }
            }), FormValidation.Validator.notEmpty = {
                enableByHtml5: function (a) {
                    var b = a.attr("required") + "";
                    return "required" === b || "true" === b
                },
                validate: function (b, c, d, e) {
                    var f = c.attr("type");
                    if ("radio" === f || "checkbox" === f) {
                        var g = b.getNamespace();
                        return b.getFieldElements(c.attr("data-" + g + "-field")).filter(":checked").length > 0
                    }
                    if ("number" === f && c.get(0).validity && c.get(0).validity.badInput === !0)
                        return !0;
                    var h = b.getFieldValue(c, e);
                    return "" !== a.trim(h)
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    numeric: {
                        "default": "Please enter a valid float number"
                    }
                }
            }), FormValidation.Validator.numeric = {
                html5Attributes: {
                    message: "message",
                    separator: "separator",
                    thousandsseparator: "thousandsSeparator",
                    decimalseparator: "decimalSeparator"
                },
                enableByHtml5: function (a) {
                    return "number" === a.attr("type") && void 0 !== a.attr("step") && a.attr("step") % 1 !== 0
                },
                validate: function (a, b, c, d) {
                    if (this.enableByHtml5(b) && b.get(0).validity && b.get(0).validity.badInput === !0)
                        return !1;
                    var e = a.getFieldValue(b, d);
                    if ("" === e)
                        return !0;
                    var f = c.separator || c.decimalSeparator || ".",
                            g = c.thousandsSeparator || "";
                    e.substr(0, 1) === f ? e = "0" + f + e.substr(1) : e.substr(0, 2) === "-" + f && (e = "-0" + f + e.substr(2)), f = "." === f ? "\\." : f, g = "." === g ? "\\." : g;
                    var h = new RegExp("^-?[0-9]{1,3}(" + g + "[0-9]{3})*(" + f + "[0-9]+)?$"),
                            i = new RegExp(g, "g");
                    return h.test(e) ? (g && (e = e.replace(i, "")), f && (e = e.replace(f, ".")), !isNaN(parseFloat(e)) && isFinite(e)) : !1
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    phone: {
                        "default": "Please enter a valid phone number",
                        country: "Please enter a valid phone number in %s",
                        countries: {
                            AE: "United Arab Emirates",
                            BG: "Bulgaria",
                            BR: "Brazil",
                            CN: "China",
                            CZ: "Czech Republic",
                            DE: "Germany",
                            DK: "Denmark",
                            ES: "Spain",
                            FR: "France",
                            GB: "United Kingdom",
                            IN: "India",
                            MA: "Morocco",
                            NL: "Netherlands",
                            PK: "Pakistan",
                            RO: "Romania",
                            RU: "Russia",
                            SK: "Slovakia",
                            TH: "Thailand",
                            US: "USA",
                            VE: "Venezuela"
                        }
                    }
                }
            }), FormValidation.Validator.phone = {
                html5Attributes: {
                    message: "message",
                    country: "country"
                },
                COUNTRY_CODES: ["AE", "BG", "BR", "CN", "CZ", "DE", "DK", "ES", "FR", "GB", "IN", "MA", "NL", "PK", "RO", "RU", "SK", "TH", "US", "VE"],
                validate: function (b, c, d, e) {
                    var f = b.getFieldValue(c, e);
                    if ("" === f)
                        return !0;
                    var g = b.getLocale(),
                            h = d.country;
                    if (("string" != typeof h || -1 === a.inArray(h, this.COUNTRY_CODES)) && (h = b.getDynamicOption(c, h)), !h || -1 === a.inArray(h.toUpperCase(), this.COUNTRY_CODES))
                        return !0;
                    var i = !0;
                    switch (h.toUpperCase()) {
                        case "AE":
                            f = a.trim(f), i = /^(((\+|00)?971[\s\.-]?(\(0\)[\s\.-]?)?|0)(\(5(0|2|5|6)\)|5(0|2|5|6)|2|3|4|6|7|9)|60)([\s\.-]?[0-9]){7}$/.test(f);
                            break;
                        case "BG":
                            f = f.replace(/\+|\s|-|\/|\(|\)/gi, ""), i = /^(0|359|00)(((700|900)[0-9]{5}|((800)[0-9]{5}|(800)[0-9]{4}))|(87|88|89)([0-9]{7})|((2[0-9]{7})|(([3-9][0-9])(([0-9]{6})|([0-9]{5})))))$/.test(f);
                            break;
                        case "BR":
                            f = a.trim(f), i = /^(([\d]{4}[-.\s]{1}[\d]{2,3}[-.\s]{1}[\d]{2}[-.\s]{1}[\d]{2})|([\d]{4}[-.\s]{1}[\d]{3}[-.\s]{1}[\d]{4})|((\(?\+?[0-9]{2}\)?\s?)?(\(?\d{2}\)?\s?)?\d{4,5}[-.\s]?\d{4}))$/.test(f);
                            break;
                        case "CN":
                            f = a.trim(f), i = /^((00|\+)?(86(?:-| )))?((\d{11})|(\d{3}[- ]{1}\d{4}[- ]{1}\d{4})|((\d{2,4}[- ]){1}(\d{7,8}|(\d{3,4}[- ]{1}\d{4}))([- ]{1}\d{1,4})?))$/.test(f);
                            break;
                        case "CZ":
                            i = /^(((00)([- ]?)|\+)(420)([- ]?))?((\d{3})([- ]?)){2}(\d{3})$/.test(f);
                            break;
                        case "DE":
                            f = a.trim(f), i = /^(((((((00|\+)49[ \-/]?)|0)[1-9][0-9]{1,4})[ \-/]?)|((((00|\+)49\()|\(0)[1-9][0-9]{1,4}\)[ \-/]?))[0-9]{1,7}([ \-/]?[0-9]{1,5})?)$/.test(f);
                            break;
                        case "DK":
                            f = a.trim(f), i = /^(\+45|0045|\(45\))?\s?[2-9](\s?\d){7}$/.test(f);
                            break;
                        case "ES":
                            f = a.trim(f), i = /^(?:(?:(?:\+|00)34\D?))?(?:5|6|7|8|9)(?:\d\D?){8}$/.test(f);
                            break;
                        case "FR":
                            f = a.trim(f), i = /^(?:(?:(?:\+|00)33[ ]?(?:\(0\)[ ]?)?)|0){1}[1-9]{1}([ .-]?)(?:\d{2}\1?){3}\d{2}$/.test(f);
                            break;
                        case "GB":
                            f = a.trim(f), i = /^\(?(?:(?:0(?:0|11)\)?[\s-]?\(?|\+)44\)?[\s-]?\(?(?:0\)?[\s-]?\(?)?|0)(?:\d{2}\)?[\s-]?\d{4}[\s-]?\d{4}|\d{3}\)?[\s-]?\d{3}[\s-]?\d{3,4}|\d{4}\)?[\s-]?(?:\d{5}|\d{3}[\s-]?\d{3})|\d{5}\)?[\s-]?\d{4,5}|8(?:00[\s-]?11[\s-]?11|45[\s-]?46[\s-]?4\d))(?:(?:[\s-]?(?:x|ext\.?\s?|\#)\d+)?)$/.test(f);
                            break;
                        case "IN":
                            f = a.trim(f), i = /((\+?)((0[ -]+)*|(91 )*)(\d{12}|\d{10}))|\d{5}([- ]*)\d{6}/.test(f);
                            break;
                        case "MA":
                            f = a.trim(f), i = /^(?:(?:(?:\+|00)212[\s]?(?:[\s]?\(0\)[\s]?)?)|0){1}(?:5[\s.-]?[2-3]|6[\s.-]?[13-9]){1}[0-9]{1}(?:[\s.-]?\d{2}){3}$/.test(f);
                            break;
                        case "NL":
                            f = a.trim(f), i = /^((\+|00(\s|\s?\-\s?)?)31(\s|\s?\-\s?)?(\(0\)[\-\s]?)?|0)[1-9]((\s|\s?\-\s?)?[0-9])((\s|\s?-\s?)?[0-9])((\s|\s?-\s?)?[0-9])\s?[0-9]\s?[0-9]\s?[0-9]\s?[0-9]\s?[0-9]$/gm.test(f);
                            break;
                        case "PK":
                            f = a.trim(f), i = /^0?3[0-9]{2}[0-9]{7}$/.test(f);
                            break;
                        case "RO":
                            i = /^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$/g.test(f);
                            break;
                        case "RU":
                            i = /^((8|\+7|007)[\-\.\/ ]?)?([\(\/\.]?\d{3}[\)\/\.]?[\-\.\/ ]?)?[\d\-\.\/ ]{7,10}$/g.test(f);
                            break;
                        case "SK":
                            i = /^(((00)([- ]?)|\+)(421)([- ]?))?((\d{3})([- ]?)){2}(\d{3})$/.test(f);
                            break;
                        case "TH":
                            i = /^0\(?([6|8-9]{2})*-([0-9]{3})*-([0-9]{4})$/.test(f);
                            break;
                        case "VE":
                            f = a.trim(f), i = /^0(?:2(?:12|4[0-9]|5[1-9]|6[0-9]|7[0-8]|8[1-35-8]|9[1-5]|3[45789])|4(?:1[246]|2[46]))\d{7}$/.test(f);
                            break;
                        case "US":
                        default:
                            i = /^(?:(1\-?)|(\+1 ?))?\(?\d{3}\)?[\-\.\s]?\d{3}[\-\.\s]?\d{4}$/.test(f)
                    }
                    return {
                        valid: i,
                        message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].phone.country, FormValidation.I18n[g].phone.countries[h])
                    }
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    promise: {
                        "default": "Please enter a valid value"
                    }
                }
            }), FormValidation.Validator.promise = {
                priority: 999,
                html5Attributes: {
                    message: "message",
                    promise: "promise"
                },
                validate: function (b, c, d, e) {
                    var f = b.getFieldValue(c, e),
                            g = new a.Deferred,
                            h = FormValidation.Helper.call(d.promise, [f, b, c]);
                    return h.done(function (a) {
                        g.resolve(c, e, a)
                    }).fail(function (a) {
                        a = a || {}, a.valid = !1, g.resolve(c, e, a)
                    }), g
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    regexp: {
                        "default": "Please enter a value matching the pattern"
                    }
                }
            }), FormValidation.Validator.regexp = {
                html5Attributes: {
                    message: "message",
                    flags: "flags",
                    regexp: "regexp"
                },
                enableByHtml5: function (a) {
                    var b = a.attr("pattern");
                    return b ? {
                        regexp: b
                    } : !1
                },
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    if ("" === e)
                        return !0;
                    var f = "string" == typeof c.regexp ? c.flags ? new RegExp(c.regexp, c.flags) : new RegExp(c.regexp) : c.regexp;
                    return f.test(e)
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    remote: {
                        "default": "Please enter a valid value"
                    }
                }
            }), FormValidation.Validator.remote = {
                priority: 1e3,
                html5Attributes: {
                    async: "async",
                    crossdomain: "crossDomain",
                    data: "data",
                    datatype: "dataType",
                    delay: "delay",
                    message: "message",
                    name: "name",
                    type: "type",
                    url: "url",
                    validkey: "validKey"
                },
                destroy: function (a, b, c, d) {
                    var e = a.getNamespace(),
                            f = b.data(e + "." + d + ".timer");
                    f && (clearTimeout(f), b.removeData(e + "." + d + ".timer"))
                },
                validate: function (b, c, d, e) {
                    function f() {
                        var b = a.ajax(n);
                        return b.success(function (a) {
                            a.valid = a[m] === !0 || "true" === a[m] ? !0 : a[m] === !1 || "false" === a[m] ? !1 : null, i.resolve(c, e, a)
                        }).error(function (a) {
                            i.resolve(c, e, {
                                valid: !1
                            })
                        }), i.fail(function () {
                            b.abort()
                        }), i
                    }
                    var g = b.getNamespace(),
                            h = b.getFieldValue(c, e),
                            i = new a.Deferred;
                    if ("" === h)
                        return i.resolve(c, e, {
                            valid: !0
                        }), i;
                    var j = c.attr("data-" + g + "-field"),
                            k = d.data || {},
                            l = d.url,
                            m = d.validKey || "valid";
                    "function" == typeof k && (k = k.call(this, b, c, h)), "string" == typeof k && (k = JSON.parse(k)), "function" == typeof l && (l = l.call(this, b, c, h)), k[d.name || j] = h;
                    var n = {
                        async: null === d.async || d.async === !0 || "true" === d.async,
                        data: k,
                        dataType: d.dataType || "json",
                        headers: d.headers || {},
                        type: d.type || "GET",
                        url: l
                    };
                    return null !== d.crossDomain && (n.crossDomain = d.crossDomain === !0 || "true" === d.crossDomain), d.delay ? (c.data(g + "." + e + ".timer") && clearTimeout(c.data(g + "." + e + ".timer")), c.data(g + "." + e + ".timer", setTimeout(f, d.delay)), i) : f()
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    rtn: {
                        "default": "Please enter a valid RTN number"
                    }
                }
            }), FormValidation.Validator.rtn = {
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    if ("" === e)
                        return !0;
                    if (!/^\d{9}$/.test(e))
                        return !1;
                    for (var f = 0, g = 0; g < e.length; g += 3)
                        f += 3 * parseInt(e.charAt(g), 10) + 7 * parseInt(e.charAt(g + 1), 10) + parseInt(e.charAt(g + 2), 10);
                    return 0 !== f && f % 10 === 0
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    sedol: {
                        "default": "Please enter a valid SEDOL number"
                    }
                }
            }), FormValidation.Validator.sedol = {
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    if ("" === e)
                        return !0;
                    if (e = e.toUpperCase(), !/^[0-9A-Z]{7}$/.test(e))
                        return !1;
                    for (var f = 0, g = [1, 3, 1, 7, 3, 9, 1], h = e.length, i = 0; h - 1 > i; i++)
                        f += g[i] * parseInt(e.charAt(i), 36);
                    return f = (10 - f % 10) % 10, f + "" === e.charAt(h - 1)
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    siren: {
                        "default": "Please enter a valid SIREN number"
                    }
                }
            }), FormValidation.Validator.siren = {
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    return "" === e ? !0 : /^\d{9}$/.test(e) ? FormValidation.Helper.luhn(e) : !1
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    siret: {
                        "default": "Please enter a valid SIRET number"
                    }
                }
            }), FormValidation.Validator.siret = {
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    if ("" === e)
                        return !0;
                    for (var f, g = 0, h = e.length, i = 0; h > i; i++)
                        f = parseInt(e.charAt(i), 10), i % 2 === 0 && (f = 2 * f, f > 9 && (f -= 9)), g += f;
                    return g % 10 === 0
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    step: {
                        "default": "Please enter a valid step of %s"
                    }
                }
            }), FormValidation.Validator.step = {
                html5Attributes: {
                    message: "message",
                    base: "baseValue",
                    step: "step"
                },
                validate: function (b, c, d, e) {
                    var f = b.getFieldValue(c, e);
                    if ("" === f)
                        return !0;
                    if (d = a.extend({}, {
                        baseValue: 0,
                        step: 1
                    }, d), f = parseFloat(f), !a.isNumeric(f))
                        return !1;
                    var g = function (a, b) {
                        var c = Math.pow(10, b);
                        a *= c;
                        var d = a > 0 | -(0 > a),
                                e = a % 1 === .5 * d;
                        return e ? (Math.floor(a) + (d > 0)) / c : Math.round(a) / c
                    },
                            h = function (a, b) {
                                if (0 === b)
                                    return 1;
                                var c = (a + "").split("."),
                                        d = (b + "").split("."),
                                        e = (1 === c.length ? 0 : c[1].length) + (1 === d.length ? 0 : d[1].length);
                                return g(a - b * Math.floor(a / b), e)
                            },
                            i = b.getLocale(),
                            j = h(f - d.baseValue, d.step);
                    return {
                        valid: 0 === j || j === d.step,
                        message: FormValidation.Helper.format(d.message || FormValidation.I18n[i].step["default"], [d.step])
                    }
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    stringCase: {
                        "default": "Please enter only lowercase characters",
                        upper: "Please enter only uppercase characters"
                    }
                }
            }), FormValidation.Validator.stringCase = {
                html5Attributes: {
                    message: "message",
                    "case": "case"
                },
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    if ("" === e)
                        return !0;
                    var f = a.getLocale(),
                            g = (c["case"] || "lower").toLowerCase();
                    return {
                        valid: "upper" === g ? e === e.toUpperCase() : e === e.toLowerCase(),
                        message: c.message || ("upper" === g ? FormValidation.I18n[f].stringCase.upper : FormValidation.I18n[f].stringCase["default"])
                    }
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    stringLength: {
                        "default": "Please enter a value with valid length",
                        less: "Please enter less than %s characters",
                        more: "Please enter more than %s characters",
                        between: "Please enter value between %s and %s characters long"
                    }
                }
            }), FormValidation.Validator.stringLength = {
                html5Attributes: {
                    message: "message",
                    min: "min",
                    max: "max",
                    trim: "trim",
                    utf8bytes: "utf8Bytes"
                },
                enableByHtml5: function (b) {
                    var c = {},
                            d = b.attr("maxlength"),
                            e = b.attr("minlength");
                    return d && (c.max = parseInt(d, 10)), e && (c.min = parseInt(e, 10)), a.isEmptyObject(c) ? !1 : c
                },
                validate: function (b, c, d, e) {
                    var f = b.getFieldValue(c, e);
                    if ((d.trim === !0 || "true" === d.trim) && (f = a.trim(f)), "" === f)
                        return !0;
                    var g = b.getLocale(),
                            h = a.isNumeric(d.min) ? d.min : b.getDynamicOption(c, d.min),
                            i = a.isNumeric(d.max) ? d.max : b.getDynamicOption(c, d.max),
                            j = function (a) {
                                for (var b = a.length, c = a.length - 1; c >= 0; c--) {
                                    var d = a.charCodeAt(c);
                                    d > 127 && 2047 >= d ? b++ : d > 2047 && 65535 >= d && (b += 2), d >= 56320 && 57343 >= d && c--
                                }
                                return b
                            },
                            k = d.utf8Bytes ? j(f) : f.length,
                            l = !0,
                            m = d.message || FormValidation.I18n[g].stringLength["default"];
                    switch ((h && k < parseInt(h, 10) || i && k > parseInt(i, 10)) && (l = !1), !0) {
                        case !!h && !!i:
                            m = FormValidation.Helper.format(d.message || FormValidation.I18n[g].stringLength.between, [parseInt(h, 10), parseInt(i, 10)]);
                            break;
                        case !!h:
                            m = FormValidation.Helper.format(d.message || FormValidation.I18n[g].stringLength.more, parseInt(h, 10) - 1);
                            break;
                        case !!i:
                            m = FormValidation.Helper.format(d.message || FormValidation.I18n[g].stringLength.less, parseInt(i, 10) + 1)
                    }
                    return {
                        valid: l,
                        message: m
                    }
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    uri: {
                        "default": "Please enter a valid URI"
                    }
                }
            }), FormValidation.Validator.uri = {
                html5Attributes: {
                    message: "message",
                    allowlocal: "allowLocal",
                    allowemptyprotocol: "allowEmptyProtocol",
                    protocol: "protocol"
                },
                enableByHtml5: function (a) {
                    return "url" === a.attr("type")
                },
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    if ("" === e)
                        return !0;
                    var f = c.allowLocal === !0 || "true" === c.allowLocal,
                            g = c.allowEmptyProtocol === !0 || "true" === c.allowEmptyProtocol,
                            h = (c.protocol || "http, https, ftp").split(",").join("|").replace(/\s/g, ""),
                            i = new RegExp("^(?:(?:" + h + ")://)" + (g ? "?" : "") + "(?:\\S+(?::\\S*)?@)?(?:" + (f ? "" : "(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})") + "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-?)*[a-z\\u00a1-\\uffff0-9])*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" + (f ? "?" : "") + ")(?::\\d{2,5})?(?:/[^\\s]*)?$", "i");
                    return i.test(e)
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    uuid: {
                        "default": "Please enter a valid UUID number",
                        version: "Please enter a valid UUID version %s number"
                    }
                }
            }), FormValidation.Validator.uuid = {
                html5Attributes: {
                    message: "message",
                    version: "version"
                },
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    if ("" === e)
                        return !0;
                    var f = a.getLocale(),
                            g = {
                                3: /^[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i,
                                4: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
                                5: /^[0-9A-F]{8}-[0-9A-F]{4}-5[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i,
                                all: /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i
                            },
                            h = c.version ? c.version + "" : "all";
                    return {
                        valid: null === g[h] ? !0 : g[h].test(e),
                        message: c.version ? FormValidation.Helper.format(c.message || FormValidation.I18n[f].uuid.version, c.version) : c.message || FormValidation.I18n[f].uuid["default"]
                    }
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    vat: {
                        "default": "Please enter a valid VAT number",
                        country: "Please enter a valid VAT number in %s",
                        countries: {
                            AT: "Austria",
                            BE: "Belgium",
                            BG: "Bulgaria",
                            BR: "Brazil",
                            CH: "Switzerland",
                            CY: "Cyprus",
                            CZ: "Czech Republic",
                            DE: "Germany",
                            DK: "Denmark",
                            EE: "Estonia",
                            ES: "Spain",
                            FI: "Finland",
                            FR: "France",
                            GB: "United Kingdom",
                            GR: "Greek",
                            EL: "Greek",
                            HU: "Hungary",
                            HR: "Croatia",
                            IE: "Ireland",
                            IS: "Iceland",
                            IT: "Italy",
                            LT: "Lithuania",
                            LU: "Luxembourg",
                            LV: "Latvia",
                            MT: "Malta",
                            NL: "Netherlands",
                            NO: "Norway",
                            PL: "Poland",
                            PT: "Portugal",
                            RO: "Romania",
                            RU: "Russia",
                            RS: "Serbia",
                            SE: "Sweden",
                            SI: "Slovenia",
                            SK: "Slovakia",
                            VE: "Venezuela",
                            ZA: "South Africa"
                        }
                    }
                }
            }), FormValidation.Validator.vat = {
                html5Attributes: {
                    message: "message",
                    country: "country"
                },
                COUNTRY_CODES: ["AT", "BE", "BG", "BR", "CH", "CY", "CZ", "DE", "DK", "EE", "EL", "ES", "FI", "FR", "GB", "GR", "HR", "HU", "IE", "IS", "IT", "LT", "LU", "LV", "MT", "NL", "NO", "PL", "PT", "RO", "RU", "RS", "SE", "SK", "SI", "VE", "ZA"],
                validate: function (b, c, d, e) {
                    var f = b.getFieldValue(c, e);
                    if ("" === f)
                        return !0;
                    var g = b.getLocale(),
                            h = d.country;
                    if (h ? ("string" != typeof h || -1 === a.inArray(h.toUpperCase(), this.COUNTRY_CODES)) && (h = b.getDynamicOption(c, h)) : h = f.substr(0, 2), -1 === a.inArray(h, this.COUNTRY_CODES))
                        return !0;
                    var i = ["_", h.toLowerCase()].join(""),
                            j = this[i](f);
                    return j = j === !0 || j === !1 ? {
                        valid: j
                    } : j, j.message = FormValidation.Helper.format(d.message || FormValidation.I18n[g].vat.country, FormValidation.I18n[g].vat.countries[h.toUpperCase()]), j
                },
                _at: function (a) {
                    if (/^ATU[0-9]{8}$/.test(a) && (a = a.substr(2)), !/^U[0-9]{8}$/.test(a))
                        return !1;
                    a = a.substr(1);
                    for (var b = 0, c = [1, 2, 1, 2, 1, 2, 1], d = 0, e = 0; 7 > e; e++)
                        d = parseInt(a.charAt(e), 10) * c[e], d > 9 && (d = Math.floor(d / 10) + d % 10), b += d;
                    return b = 10 - (b + 4) % 10, 10 === b && (b = 0), b + "" === a.substr(7, 1)
                },
                _be: function (a) {
                    if (/^BE[0]{0,1}[0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[0]{0,1}[0-9]{9}$/.test(a))
                        return !1;
                    if (9 === a.length && (a = "0" + a), "0" === a.substr(1, 1))
                        return !1;
                    var b = parseInt(a.substr(0, 8), 10) + parseInt(a.substr(8, 2), 10);
                    return b % 97 === 0
                },
                _bg: function (a) {
                    if (/^BG[0-9]{9,10}$/.test(a) && (a = a.substr(2)), !/^[0-9]{9,10}$/.test(a))
                        return !1;
                    var b = 0,
                            c = 0;
                    if (9 === a.length) {
                        for (c = 0; 8 > c; c++)
                            b += parseInt(a.charAt(c), 10) * (c + 1);
                        if (b %= 11, 10 === b)
                            for (b = 0, c = 0; 8 > c; c++)
                                b += parseInt(a.charAt(c), 10) * (c + 3);
                        return b %= 10, b + "" === a.substr(8)
                    }
                    if (10 === a.length) {
                        var d = function (a) {
                            var b = parseInt(a.substr(0, 2), 10) + 1900,
                                    c = parseInt(a.substr(2, 2), 10),
                                    d = parseInt(a.substr(4, 2), 10);
                            if (c > 40 ? (b += 100, c -= 40) : c > 20 && (b -= 100, c -= 20), !FormValidation.Helper.date(b, c, d))
                                return !1;
                            for (var e = 0, f = [2, 4, 8, 5, 10, 9, 7, 3, 6], g = 0; 9 > g; g++)
                                e += parseInt(a.charAt(g), 10) * f[g];
                            return e = e % 11 % 10, e + "" === a.substr(9, 1)
                        },
                                e = function (a) {
                                    for (var b = 0, c = [21, 19, 17, 13, 11, 9, 7, 3, 1], d = 0; 9 > d; d++)
                                        b += parseInt(a.charAt(d), 10) * c[d];
                                    return b %= 10, b + "" === a.substr(9, 1)
                                },
                                f = function (a) {
                                    for (var b = 0, c = [4, 3, 2, 7, 6, 5, 4, 3, 2], d = 0; 9 > d; d++)
                                        b += parseInt(a.charAt(d), 10) * c[d];
                                    return b = 11 - b % 11, 10 === b ? !1 : (11 === b && (b = 0), b + "" === a.substr(9, 1))
                                };
                        return d(a) || e(a) || f(a)
                    }
                    return !1
                },
                _br: function (a) {
                    if ("" === a)
                        return !0;
                    var b = a.replace(/[^\d]+/g, "");
                    if ("" === b || 14 !== b.length)
                        return !1;
                    if ("00000000000000" === b || "11111111111111" === b || "22222222222222" === b || "33333333333333" === b || "44444444444444" === b || "55555555555555" === b || "66666666666666" === b || "77777777777777" === b || "88888888888888" === b || "99999999999999" === b)
                        return !1;
                    for (var c = b.length - 2, d = b.substring(0, c), e = b.substring(c), f = 0, g = c - 7, h = c; h >= 1; h--)
                        f += parseInt(d.charAt(c - h), 10) * g--, 2 > g && (g = 9);
                    var i = 2 > f % 11 ? 0 : 11 - f % 11;
                    if (i !== parseInt(e.charAt(0), 10))
                        return !1;
                    for (c += 1, d = b.substring(0, c), f = 0, g = c - 7, h = c; h >= 1; h--)
                        f += parseInt(d.charAt(c - h), 10) * g--, 2 > g && (g = 9);
                    return i = 2 > f % 11 ? 0 : 11 - f % 11, i === parseInt(e.charAt(1), 10)
                },
                _ch: function (a) {
                    if (/^CHE[0-9]{9}(MWST)?$/.test(a) && (a = a.substr(2)), !/^E[0-9]{9}(MWST)?$/.test(a))
                        return !1;
                    a = a.substr(1);
                    for (var b = 0, c = [5, 4, 3, 2, 7, 6, 5, 4], d = 0; 8 > d; d++)
                        b += parseInt(a.charAt(d), 10) * c[d];
                    return b = 11 - b % 11, 10 === b ? !1 : (11 === b && (b = 0), b + "" === a.substr(8, 1))
                },
                _cy: function (a) {
                    if (/^CY[0-5|9]{1}[0-9]{7}[A-Z]{1}$/.test(a) && (a = a.substr(2)), !/^[0-5|9]{1}[0-9]{7}[A-Z]{1}$/.test(a))
                        return !1;
                    if ("12" === a.substr(0, 2))
                        return !1;
                    for (var b = 0, c = {
                        0: 1,
                        1: 0,
                        2: 5,
                        3: 7,
                        4: 9,
                        5: 13,
                        6: 15,
                        7: 17,
                        8: 19,
                        9: 21
                    }, d = 0; 8 > d; d++) {
                        var e = parseInt(a.charAt(d), 10);
                        d % 2 === 0 && (e = c[e + ""]), b += e
                    }
                    return b = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" [b % 26], b + "" === a.substr(8, 1)
                },
                _cz: function (a) {
                    if (/^CZ[0-9]{8,10}$/.test(a) && (a = a.substr(2)), !/^[0-9]{8,10}$/.test(a))
                        return !1;
                    var b = 0,
                            c = 0;
                    if (8 === a.length) {
                        if (a.charAt(0) + "" == "9")
                            return !1;
                        for (b = 0, c = 0; 7 > c; c++)
                            b += parseInt(a.charAt(c), 10) * (8 - c);
                        return b = 11 - b % 11, 10 === b && (b = 0), 11 === b && (b = 1), b + "" === a.substr(7, 1)
                    }
                    if (9 === a.length && a.charAt(0) + "" == "6") {
                        for (b = 0, c = 0; 7 > c; c++)
                            b += parseInt(a.charAt(c + 1), 10) * (8 - c);
                        return b = 11 - b % 11, 10 === b && (b = 0), 11 === b && (b = 1), b = [8, 7, 6, 5, 4, 3, 2, 1, 0, 9, 10][b - 1], b + "" === a.substr(8, 1)
                    }
                    if (9 === a.length || 10 === a.length) {
                        var d = 1900 + parseInt(a.substr(0, 2), 10),
                                e = parseInt(a.substr(2, 2), 10) % 50 % 20,
                                f = parseInt(a.substr(4, 2), 10);
                        if (9 === a.length) {
                            if (d >= 1980 && (d -= 100), d > 1953)
                                return !1
                        } else
                            1954 > d && (d += 100);
                        if (!FormValidation.Helper.date(d, e, f))
                            return !1;
                        if (10 === a.length) {
                            var g = parseInt(a.substr(0, 9), 10) % 11;
                            return 1985 > d && (g %= 10), g + "" === a.substr(9, 1)
                        }
                        return !0
                    }
                    return !1
                },
                _de: function (a) {
                    return /^DE[0-9]{9}$/.test(a) && (a = a.substr(2)), /^[0-9]{9}$/.test(a) ? FormValidation.Helper.mod11And10(a) : !1
                },
                _dk: function (a) {
                    if (/^DK[0-9]{8}$/.test(a) && (a = a.substr(2)), !/^[0-9]{8}$/.test(a))
                        return !1;
                    for (var b = 0, c = [2, 7, 6, 5, 4, 3, 2, 1], d = 0; 8 > d; d++)
                        b += parseInt(a.charAt(d), 10) * c[d];
                    return b % 11 === 0
                },
                _ee: function (a) {
                    if (/^EE[0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[0-9]{9}$/.test(a))
                        return !1;
                    for (var b = 0, c = [3, 7, 1, 3, 7, 1, 3, 7, 1], d = 0; 9 > d; d++)
                        b += parseInt(a.charAt(d), 10) * c[d];
                    return b % 10 === 0
                },
                _es: function (a) {
                    if (/^ES[0-9A-Z][0-9]{7}[0-9A-Z]$/.test(a) && (a = a.substr(2)), !/^[0-9A-Z][0-9]{7}[0-9A-Z]$/.test(a))
                        return !1;
                    var b = function (a) {
                        var b = parseInt(a.substr(0, 8), 10);
                        return b = "TRWAGMYFPDXBNJZSQVHLCKE" [b % 23], b + "" === a.substr(8, 1)
                    },
                            c = function (a) {
                                var b = ["XYZ".indexOf(a.charAt(0)), a.substr(1)].join("");
                                return b = parseInt(b, 10), b = "TRWAGMYFPDXBNJZSQVHLCKE" [b % 23], b + "" === a.substr(8, 1)
                            },
                            d = function (a) {
                                var b, c = a.charAt(0);
                                if (-1 !== "KLM".indexOf(c))
                                    return b = parseInt(a.substr(1, 8), 10), b = "TRWAGMYFPDXBNJZSQVHLCKE" [b % 23], b + "" === a.substr(8, 1);
                                if (-1 !== "ABCDEFGHJNPQRSUVW".indexOf(c)) {
                                    for (var d = 0, e = [2, 1, 2, 1, 2, 1, 2], f = 0, g = 0; 7 > g; g++)
                                        f = parseInt(a.charAt(g + 1), 10) * e[g], f > 9 && (f = Math.floor(f / 10) + f % 10), d += f;
                                    return d = 10 - d % 10, 10 === d && (d = 0), d + "" === a.substr(8, 1) || "JABCDEFGHI" [d] === a.substr(8, 1)
                                }
                                return !1
                            },
                            e = a.charAt(0);
                    return /^[0-9]$/.test(e) ? {
                        valid: b(a),
                        type: "DNI"
                    } : /^[XYZ]$/.test(e) ? {
                        valid: c(a),
                        type: "NIE"
                    } : {
                        valid: d(a),
                        type: "CIF"
                    }
                },
                _fi: function (a) {
                    if (/^FI[0-9]{8}$/.test(a) && (a = a.substr(2)), !/^[0-9]{8}$/.test(a))
                        return !1;
                    for (var b = 0, c = [7, 9, 10, 5, 8, 4, 2, 1], d = 0; 8 > d; d++)
                        b += parseInt(a.charAt(d), 10) * c[d];
                    return b % 11 === 0
                },
                _fr: function (a) {
                    if (/^FR[0-9A-Z]{2}[0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[0-9A-Z]{2}[0-9]{9}$/.test(a))
                        return !1;
                    if (!FormValidation.Helper.luhn(a.substr(2)))
                        return !1;
                    if (/^[0-9]{2}$/.test(a.substr(0, 2)))
                        return a.substr(0, 2) === parseInt(a.substr(2) + "12", 10) % 97 + "";
                    var b, c = "0123456789ABCDEFGHJKLMNPQRSTUVWXYZ";
                    return b = /^[0-9]{1}$/.test(a.charAt(0)) ? 24 * c.indexOf(a.charAt(0)) + c.indexOf(a.charAt(1)) - 10 : 34 * c.indexOf(a.charAt(0)) + c.indexOf(a.charAt(1)) - 100, (parseInt(a.substr(2), 10) + 1 + Math.floor(b / 11)) % 11 === b % 11
                },
                _gb: function (a) {
                    if ((/^GB[0-9]{9}$/.test(a) || /^GB[0-9]{12}$/.test(a) || /^GBGD[0-9]{3}$/.test(a) || /^GBHA[0-9]{3}$/.test(a) || /^GB(GD|HA)8888[0-9]{5}$/.test(a)) && (a = a.substr(2)), !(/^[0-9]{9}$/.test(a) || /^[0-9]{12}$/.test(a) || /^GD[0-9]{3}$/.test(a) || /^HA[0-9]{3}$/.test(a) || /^(GD|HA)8888[0-9]{5}$/.test(a)))
                        return !1;
                    var b = a.length;
                    if (5 === b) {
                        var c = a.substr(0, 2),
                                d = parseInt(a.substr(2), 10);
                        return "GD" === c && 500 > d || "HA" === c && d >= 500
                    }
                    if (11 === b && ("GD8888" === a.substr(0, 6) || "HA8888" === a.substr(0, 6)))
                        return "GD" === a.substr(0, 2) && parseInt(a.substr(6, 3), 10) >= 500 || "HA" === a.substr(0, 2) && parseInt(a.substr(6, 3), 10) < 500 ? !1 : parseInt(a.substr(6, 3), 10) % 97 === parseInt(a.substr(9, 2), 10);
                    if (9 === b || 12 === b) {
                        for (var e = 0, f = [8, 7, 6, 5, 4, 3, 2, 10, 1], g = 0; 9 > g; g++)
                            e += parseInt(a.charAt(g), 10) * f[g];
                        return e %= 97, parseInt(a.substr(0, 3), 10) >= 100 ? 0 === e || 42 === e || 55 === e : 0 === e
                    }
                    return !0
                },
                _gr: function (a) {
                    if (/^(GR|EL)[0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[0-9]{9}$/.test(a))
                        return !1;
                    8 === a.length && (a = "0" + a);
                    for (var b = 0, c = [256, 128, 64, 32, 16, 8, 4, 2], d = 0; 8 > d; d++)
                        b += parseInt(a.charAt(d), 10) * c[d];
                    return b = b % 11 % 10, b + "" === a.substr(8, 1)
                },
                _el: function (a) {
                    return this._gr(a)
                },
                _hu: function (a) {
                    if (/^HU[0-9]{8}$/.test(a) && (a = a.substr(2)), !/^[0-9]{8}$/.test(a))
                        return !1;
                    for (var b = 0, c = [9, 7, 3, 1, 9, 7, 3, 1], d = 0; 8 > d; d++)
                        b += parseInt(a.charAt(d), 10) * c[d];
                    return b % 10 === 0
                },
                _hr: function (a) {
                    return /^HR[0-9]{11}$/.test(a) && (a = a.substr(2)), /^[0-9]{11}$/.test(a) ? FormValidation.Helper.mod11And10(a) : !1
                },
                _ie: function (a) {
                    if (/^IE[0-9]{1}[0-9A-Z\*\+]{1}[0-9]{5}[A-Z]{1,2}$/.test(a) && (a = a.substr(2)), !/^[0-9]{1}[0-9A-Z\*\+]{1}[0-9]{5}[A-Z]{1,2}$/.test(a))
                        return !1;
                    var b = function (a) {
                        for (; a.length < 7; )
                            a = "0" + a;
                        for (var b = "WABCDEFGHIJKLMNOPQRSTUV", c = 0, d = 0; 7 > d; d++)
                            c += parseInt(a.charAt(d), 10) * (8 - d);
                        return c += 9 * b.indexOf(a.substr(7)), b[c % 23]
                    };
                    return /^[0-9]+$/.test(a.substr(0, 7)) ? a.charAt(7) === b(a.substr(0, 7) + a.substr(8) + "") : -1 !== "ABCDEFGHIJKLMNOPQRSTUVWXYZ+*".indexOf(a.charAt(1)) ? a.charAt(7) === b(a.substr(2, 5) + a.substr(0, 1) + "") : !0
                },
                _is: function (a) {
                    return /^IS[0-9]{5,6}$/.test(a) && (a = a.substr(2)), /^[0-9]{5,6}$/.test(a)
                },
                _it: function (a) {
                    if (/^IT[0-9]{11}$/.test(a) && (a = a.substr(2)), !/^[0-9]{11}$/.test(a))
                        return !1;
                    if (0 === parseInt(a.substr(0, 7), 10))
                        return !1;
                    var b = parseInt(a.substr(7, 3), 10);
                    return 1 > b || b > 201 && 999 !== b && 888 !== b ? !1 : FormValidation.Helper.luhn(a)
                },
                _lt: function (a) {
                    if (/^LT([0-9]{7}1[0-9]{1}|[0-9]{10}1[0-9]{1})$/.test(a) && (a = a.substr(2)), !/^([0-9]{7}1[0-9]{1}|[0-9]{10}1[0-9]{1})$/.test(a))
                        return !1;
                    var b, c = a.length,
                            d = 0;
                    for (b = 0; c - 1 > b; b++)
                        d += parseInt(a.charAt(b), 10) * (1 + b % 9);
                    var e = d % 11;
                    if (10 === e)
                        for (d = 0, b = 0; c - 1 > b; b++)
                            d += parseInt(a.charAt(b), 10) * (1 + (b + 2) % 9);
                    return e = e % 11 % 10, e + "" === a.charAt(c - 1)
                },
                _lu: function (a) {
                    return /^LU[0-9]{8}$/.test(a) && (a = a.substr(2)), /^[0-9]{8}$/.test(a) ? parseInt(a.substr(0, 6), 10) % 89 + "" === a.substr(6, 2) : !1
                },
                _lv: function (a) {
                    if (/^LV[0-9]{11}$/.test(a) && (a = a.substr(2)), !/^[0-9]{11}$/.test(a))
                        return !1;
                    var b, c = parseInt(a.charAt(0), 10),
                            d = 0,
                            e = [],
                            f = a.length;
                    if (c > 3) {
                        for (d = 0, e = [9, 1, 4, 8, 3, 10, 2, 5, 7, 6, 1], b = 0; f > b; b++)
                            d += parseInt(a.charAt(b), 10) * e[b];
                        return d %= 11, 3 === d
                    }
                    var g = parseInt(a.substr(0, 2), 10),
                            h = parseInt(a.substr(2, 2), 10),
                            i = parseInt(a.substr(4, 2), 10);
                    if (i = i + 1800 + 100 * parseInt(a.charAt(6), 10), !FormValidation.Helper.date(i, h, g))
                        return !1;
                    for (d = 0, e = [10, 5, 8, 4, 2, 1, 6, 3, 7, 9], b = 0; f - 1 > b; b++)
                        d += parseInt(a.charAt(b), 10) * e[b];
                    return d = (d + 1) % 11 % 10, d + "" === a.charAt(f - 1)
                },
                _mt: function (a) {
                    if (/^MT[0-9]{8}$/.test(a) && (a = a.substr(2)), !/^[0-9]{8}$/.test(a))
                        return !1;
                    for (var b = 0, c = [3, 4, 6, 7, 8, 9, 10, 1], d = 0; 8 > d; d++)
                        b += parseInt(a.charAt(d), 10) * c[d];
                    return b % 37 === 0
                },
                _nl: function (a) {
                    if (/^NL[0-9]{9}B[0-9]{2}$/.test(a) && (a = a.substr(2)), !/^[0-9]{9}B[0-9]{2}$/.test(a))
                        return !1;
                    for (var b = 0, c = [9, 8, 7, 6, 5, 4, 3, 2], d = 0; 8 > d; d++)
                        b += parseInt(a.charAt(d), 10) * c[d];
                    return b %= 11, b > 9 && (b = 0), b + "" === a.substr(8, 1)
                },
                _no: function (a) {
                    if (/^NO[0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[0-9]{9}$/.test(a))
                        return !1;
                    for (var b = 0, c = [3, 2, 7, 6, 5, 4, 3, 2], d = 0; 8 > d; d++)
                        b += parseInt(a.charAt(d), 10) * c[d];
                    return b = 11 - b % 11, 11 === b && (b = 0), b + "" === a.substr(8, 1)
                },
                _pl: function (a) {
                    if (/^PL[0-9]{10}$/.test(a) && (a = a.substr(2)), !/^[0-9]{10}$/.test(a))
                        return !1;
                    for (var b = 0, c = [6, 5, 7, 2, 3, 4, 5, 6, 7, -1], d = 0; 10 > d; d++)
                        b += parseInt(a.charAt(d), 10) * c[d];
                    return b % 11 === 0
                },
                _pt: function (a) {
                    if (/^PT[0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[0-9]{9}$/.test(a))
                        return !1;
                    for (var b = 0, c = [9, 8, 7, 6, 5, 4, 3, 2], d = 0; 8 > d; d++)
                        b += parseInt(a.charAt(d), 10) * c[d];
                    return b = 11 - b % 11, b > 9 && (b = 0), b + "" === a.substr(8, 1)
                },
                _ro: function (a) {
                    if (/^RO[1-9][0-9]{1,9}$/.test(a) && (a = a.substr(2)), !/^[1-9][0-9]{1,9}$/.test(a))
                        return !1;
                    for (var b = a.length, c = [7, 5, 3, 2, 1, 7, 5, 3, 2].slice(10 - b), d = 0, e = 0; b - 1 > e; e++)
                        d += parseInt(a.charAt(e), 10) * c[e];
                    return d = 10 * d % 11 % 10, d + "" === a.substr(b - 1, 1)
                },
                _ru: function (a) {
                    if (/^RU([0-9]{10}|[0-9]{12})$/.test(a) && (a = a.substr(2)), !/^([0-9]{10}|[0-9]{12})$/.test(a))
                        return !1;
                    var b = 0;
                    if (10 === a.length) {
                        var c = 0,
                                d = [2, 4, 10, 3, 5, 9, 4, 6, 8, 0];
                        for (b = 0; 10 > b; b++)
                            c += parseInt(a.charAt(b), 10) * d[b];
                        return c %= 11, c > 9 && (c %= 10), c + "" === a.substr(9, 1)
                    }
                    if (12 === a.length) {
                        var e = 0,
                                f = [7, 2, 4, 10, 3, 5, 9, 4, 6, 8, 0],
                                g = 0,
                                h = [3, 7, 2, 4, 10, 3, 5, 9, 4, 6, 8, 0];
                        for (b = 0; 11 > b; b++)
                            e += parseInt(a.charAt(b), 10) * f[b], g += parseInt(a.charAt(b), 10) * h[b];
                        return e %= 11, e > 9 && (e %= 10), g %= 11, g > 9 && (g %= 10), e + "" === a.substr(10, 1) && g + "" === a.substr(11, 1)
                    }
                    return !1
                },
                _rs: function (a) {
                    if (/^RS[0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[0-9]{9}$/.test(a))
                        return !1;
                    for (var b = 10, c = 0, d = 0; 8 > d; d++)
                        c = (parseInt(a.charAt(d), 10) + b) % 10, 0 === c && (c = 10), b = 2 * c % 11;
                    return (b + parseInt(a.substr(8, 1), 10)) % 10 === 1
                },
                _se: function (a) {
                    return /^SE[0-9]{10}01$/.test(a) && (a = a.substr(2)), /^[0-9]{10}01$/.test(a) ? (a = a.substr(0, 10), FormValidation.Helper.luhn(a)) : !1
                },
                _si: function (a) {
                    var b = a.match(/^(SI)?([1-9][0-9]{7})$/);
                    if (!b)
                        return !1;
                    b[1] && (a = a.substr(2));
                    for (var c = 0, d = [8, 7, 6, 5, 4, 3, 2], e = 0; 7 > e; e++)
                        c += parseInt(a.charAt(e), 10) * d[e];
                    return c = 11 - c % 11, 10 === c && (c = 0), c + "" === a.substr(7, 1)
                },
                _sk: function (a) {
                    return /^SK[1-9][0-9][(2-4)|(6-9)][0-9]{7}$/.test(a) && (a = a.substr(2)), /^[1-9][0-9][(2-4)|(6-9)][0-9]{7}$/.test(a) ? parseInt(a, 10) % 11 === 0 : !1
                },
                _ve: function (a) {
                    if (/^VE[VEJPG][0-9]{9}$/.test(a) && (a = a.substr(2)), !/^[VEJPG][0-9]{9}$/.test(a))
                        return !1;
                    for (var b = {
                        V: 4,
                        E: 8,
                        J: 12,
                        P: 16,
                        G: 20
                    }, c = b[a.charAt(0)], d = [3, 2, 7, 6, 5, 4, 3, 2], e = 0; 8 > e; e++)
                        c += parseInt(a.charAt(e + 1), 10) * d[e];
                    return c = 11 - c % 11, (11 === c || 10 === c) && (c = 0), c + "" === a.substr(9, 1)
                },
                _za: function (a) {
                    return /^ZA4[0-9]{9}$/.test(a) && (a = a.substr(2)), /^4[0-9]{9}$/.test(a)
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    vin: {
                        "default": "Please enter a valid VIN number"
                    }
                }
            }), FormValidation.Validator.vin = {
                validate: function (a, b, c, d) {
                    var e = a.getFieldValue(b, d);
                    if ("" === e)
                        return !0;
                    if (!/^[a-hj-npr-z0-9]{8}[0-9xX][a-hj-npr-z0-9]{8}$/i.test(e))
                        return !1;
                    e = e.toUpperCase();
                    for (var f = {
                        A: 1,
                        B: 2,
                        C: 3,
                        D: 4,
                        E: 5,
                        F: 6,
                        G: 7,
                        H: 8,
                        J: 1,
                        K: 2,
                        L: 3,
                        M: 4,
                        N: 5,
                        P: 7,
                        R: 9,
                        S: 2,
                        T: 3,
                        U: 4,
                        V: 5,
                        W: 6,
                        X: 7,
                        Y: 8,
                        Z: 9,
                        1: 1,
                        2: 2,
                        3: 3,
                        4: 4,
                        5: 5,
                        6: 6,
                        7: 7,
                        8: 8,
                        9: 9,
                        0: 0
                    }, g = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2], h = 0, i = e.length, j = 0; i > j; j++)
                        h += f[e.charAt(j) + ""] * g[j];
                    var k = h % 11;
                    return 10 === k && (k = "X"), k + "" === e.charAt(8)
                }
            }
        }(jQuery),
        function (a) {
            FormValidation.I18n = a.extend(!0, FormValidation.I18n || {}, {
                en_US: {
                    zipCode: {
                        "default": "Please enter a valid postal code",
                        country: "Please enter a valid postal code in %s",
                        countries: {
                            AT: "Austria",
                            BG: "Bulgaria",
                            BR: "Brazil",
                            CA: "Canada",
                            CH: "Switzerland",
                            CZ: "Czech Republic",
                            DE: "Germany",
                            DK: "Denmark",
                            ES: "Spain",
                            FR: "France",
                            GB: "United Kingdom",
                            IE: "Ireland",
                            IN: "India",
                            IT: "Italy",
                            MA: "Morocco",
                            NL: "Netherlands",
                            PL: "Poland",
                            PT: "Portugal",
                            RO: "Romania",
                            RU: "Russia",
                            SE: "Sweden",
                            SG: "Singapore",
                            SK: "Slovakia",
                            US: "USA"
                        }
                    }
                }
            }), FormValidation.Validator.zipCode = {
                html5Attributes: {
                    message: "message",
                    country: "country"
                },
                COUNTRY_CODES: ["AT", "BG", "BR", "CA", "CH", "CZ", "DE", "DK", "ES", "FR", "GB", "IE", "IN", "IT", "MA", "NL", "PL", "PT", "RO", "RU", "SE", "SG", "SK", "US"],
                validate: function (b, c, d, e) {
                    var f = b.getFieldValue(c, e);
                    if ("" === f || !d.country)
                        return !0;
                    var g = b.getLocale(),
                            h = d.country;
                    if (("string" != typeof h || -1 === a.inArray(h, this.COUNTRY_CODES)) && (h = b.getDynamicOption(c, h)), !h || -1 === a.inArray(h.toUpperCase(), this.COUNTRY_CODES))
                        return !0;
                    var i = !1;
                    switch (h = h.toUpperCase()) {
                        case "AT":
                            i = /^([1-9]{1})(\d{3})$/.test(f);
                            break;
                        case "BG":
                            i = /^([1-9]{1}[0-9]{3})$/.test(a.trim(f));
                            break;
                        case "BR":
                            i = /^(\d{2})([\.]?)(\d{3})([\-]?)(\d{3})$/.test(f);
                            break;
                        case "CA":
                            i = /^(?:A|B|C|E|G|H|J|K|L|M|N|P|R|S|T|V|X|Y){1}[0-9]{1}(?:A|B|C|E|G|H|J|K|L|M|N|P|R|S|T|V|W|X|Y|Z){1}\s?[0-9]{1}(?:A|B|C|E|G|H|J|K|L|M|N|P|R|S|T|V|W|X|Y|Z){1}[0-9]{1}$/i.test(f);
                            break;
                        case "CH":
                            i = /^([1-9]{1})(\d{3})$/.test(f);
                            break;
                        case "CZ":
                            i = /^(\d{3})([ ]?)(\d{2})$/.test(f);
                            break;
                        case "DE":
                            i = /^(?!01000|99999)(0[1-9]\d{3}|[1-9]\d{4})$/.test(f);
                            break;
                        case "DK":
                            i = /^(DK(-|\s)?)?\d{4}$/i.test(f);
                            break;
                        case "ES":
                            i = /^(?:0[1-9]|[1-4][0-9]|5[0-2])\d{3}$/.test(f);
                            break;
                        case "FR":
                            i = /^[0-9]{5}$/i.test(f);
                            break;
                        case "GB":
                            i = this._gb(f);
                            break;
                        case "IN":
                            i = /^\d{3}\s?\d{3}$/.test(f);
                            break;
                        case "IE":
                            i = /^(D6W|[ACDEFHKNPRTVWXY]\d{2})\s[0-9ACDEFHKNPRTVWXY]{4}$/.test(f);
                            break;
                        case "IT":
                            i = /^(I-|IT-)?\d{5}$/i.test(f);
                            break;
                        case "MA":
                            i = /^[1-9][0-9]{4}$/i.test(f);
                            break;
                        case "NL":
                            i = /^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-z]{2}$/i.test(f);
                            break;
                        case "PL":
                            i = /^[0-9]{2}\-[0-9]{3}$/.test(f);
                            break;
                        case "PT":
                            i = /^[1-9]\d{3}-\d{3}$/.test(f);
                            break;
                        case "RO":
                            i = /^(0[1-8]{1}|[1-9]{1}[0-5]{1})?[0-9]{4}$/i.test(f);
                            break;
                        case "RU":
                            i = /^[0-9]{6}$/i.test(f);
                            break;
                        case "SE":
                            i = /^(S-)?\d{3}\s?\d{2}$/i.test(f);
                            break;
                        case "SG":
                            i = /^([0][1-9]|[1-6][0-9]|[7]([0-3]|[5-9])|[8][0-2])(\d{4})$/i.test(f);
                            break;
                        case "SK":
                            i = /^(\d{3})([ ]?)(\d{2})$/.test(f);
                            break;
                        case "US":
                        default:
                            i = /^\d{4,5}([\-]?\d{4})?$/.test(f)
                    }
                    return {
                        valid: i,
                        message: FormValidation.Helper.format(d.message || FormValidation.I18n[g].zipCode.country, FormValidation.I18n[g].zipCode.countries[h])
                    }
                },
                _gb: function (a) {
                    for (var b = "[ABCDEFGHIJKLMNOPRSTUWYZ]", c = "[ABCDEFGHKLMNOPQRSTUVWXY]", d = "[ABCDEFGHJKPMNRSTUVWXY]", e = "[ABEHMNPRVWXY]", f = "[ABDEFGHJLNPQRSTUWXYZ]", g = [new RegExp("^(" + b + "{1}" + c + "?[0-9]{1,2})(\\s*)([0-9]{1}" + f + "{2})$", "i"), new RegExp("^(" + b + "{1}[0-9]{1}" + d + "{1})(\\s*)([0-9]{1}" + f + "{2})$", "i"), new RegExp("^(" + b + "{1}" + c + "{1}?[0-9]{1}" + e + "{1})(\\s*)([0-9]{1}" + f + "{2})$", "i"), new RegExp("^(BF1)(\\s*)([0-6]{1}[ABDEFGHJLNPQRST]{1}[ABDEFGHJLNPQRSTUWZYZ]{1})$", "i"), /^(GIR)(\s*)(0AA)$/i, /^(BFPO)(\s*)([0-9]{1,4})$/i, /^(BFPO)(\s*)(c\/o\s*[0-9]{1,3})$/i, /^([A-Z]{4})(\s*)(1ZZ)$/i, /^(AI-2640)$/i], h = 0; h < g.length; h++)
                        if (g[h].test(a))
                            return !0;
                    return !1
                }
            }
        }(jQuery);