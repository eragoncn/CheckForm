/*
说明： 
mustinput    例：class="validate[mustinput,maxSize[2]]"         
mustselect   例：class="validate[mustselect]"         
mustchecked  例：class="validate[mustchecked]"        
custom       例：class="validate[custom[mobile]]"      
maxSize      例：class="validate[maxSize[2]]"  
min          例：class="validate[min[100]]"
max          例：class="validate[max[10000]]"
maxCheckbox  例：class="validate[maxCheckbox[2]]"
minCheckbox  例：class="validate[minCheckbox[1]]"
equals       例：class="validate[equals[namebtx]]"
fun         例：class="validate[fun[chechname]]"
maxDate      例：class="validate[maxDate[2012-09-01]]"
minDate      例：class="validate[minDate[2010-09-01]]"   
*/


(function ($) {
    $.CheckForm = {
        _errTxtList: null, //错误信息集合
        _errObj: null, //错误对象集合
        _isAutoCheck: false, //是否自动检查
        _isCheckAll: true, //是否检查所有（显示所有的错误信息，还是遇到错误信息即停止检查，并返回false）
        _changeFourDecimal_f: function (x) {
            if ($.trim(x) == "") {
                return 0;
            }
            var f_x = parseFloat(x);
            if (isNaN(f_x)) {
                return 0;
            }
            f_x = Math.round(x * 10000) / 10000;
            var s_x = f_x.toString();
            var pos_decimal = s_x.indexOf('.');
            if (pos_decimal < 0) {
                pos_decimal = s_x.length;
                return parseFloat(f_x);
            }
            while (s_x.length <= pos_decimal + 2) {
                s_x += '0';
            }
            return parseFloat(s_x); //postHideDiv
        },
        checkForm: function (objectForm) {
            this._errTxtList = new Array();
            this._errObj = new Array();
            if (typeof (objectForm) == "object") {
                return this._checkForm($(objectForm));
            }
            else if ((typeof (objectForm) == "string") && $(objectForm).size() > 0) {
                return this._checkForm($(objectForm));
            }
            else if ((typeof (objectForm) == "string") && $("#" + objectForm).size() > 0) {
                return this._checkForm($("#" + objectForm));
            }
            return false;
        },
        _checkForm: function (objectObj) {
            var tempbln = false;
            var checkVlaue = true;
            if ($(objectObj).is("[class*=validate]:visible")) {
                tempbln = jQuery.CheckForm._check($(objectObj));
                if (!tempbln) {
                    checkVlaue = false;
                    return false;
                }
            }
            else if ($(objectObj).find("[class*=validate]:visible").size() > 0) {
                var objBase = this;
                $(objectObj).find("[class*=validate]:visible").each(function () {
                    if (!objBase._check(this)) {
                        checkVlaue = false;
                        if (!objBase._isCheckAll) {
                            return false;
                        }
                    }
                });
            }
            if (checkVlaue) {
                jQuery.CheckForm.lastSuccess();
            }
            else {
                jQuery.CheckForm.lastfailed();
            }
            this._errTxtList = null;
            this._errObj = null;
            return checkVlaue;

        },
        _check: function (tthis) {
            var getRules = /validate\[(.*)\]/.exec($(tthis).attr("class"));
            var rules = getRules[1].split(/\[|,|\]/);
            if (rules.length < 0) {
                return true;
            }
            return this._checkByRules($(tthis), rules);
        },
        _checkByRules: function (tthis, rules) {
            for (var i = 0; i < rules.length; i++) {
                switch (tthis.attr("type")) {
                    case "text":
                    case "password":
                    case "textarea":
                        if (this._checkNullByText(tthis, rules)) {
                            if ($.trim($(tthis).val()) == "") {
                                return true;
                            }
                            if (!this._checkByType(tthis, tthis.val(), rules[i], i, rules)) {
                                return false;
                            }
                        } else {
                            return false;
                        }
                        break;
                    case "file":
                    case "select-one":
                    case "select-multiple":
                        if (this._checkNullBySelect(tthis, rules)) {
                            if (!this._checkByType(tthis, tthis.val(), rules[i], i, rules)) {
                                return false;
                            }
                        } else {
                            return false;
                        }
                        break;
                    case "radio":
                    case "checkbox":
                        if (this._checkNullByBox(tthis, rules)) {
                            if (!this._checkByType(tthis, tthis.val(), rules[i], i, rules)) {
                                return false;
                            }
                        } else {
                            return false;
                        }
                        break;
                    default:
                        break;
                }
            }
            return true;
        },
        _addErrToList: function (tthis, rule, errVlaue) {
            this._errObj.push(tthis);
            if ($(tthis).is("[alt]")) {
                this._errTxtList.push(($(tthis).attr("alt") + $.CheckForm.aUsagesTxt[rule]));
            } else {
                this._errTxtList.push(($.CheckForm.aUsagesTxt[rule]).replace("{0}", errVlaue));
            }
        },
        _checkNullByText: function (tthis, rules) {//检查是否不能为空 
            var strValue = $.trim($(tthis).val());
            for (var i = 0; i < rules.length; i++) {
                if (rules[i] == "mustinput") {
                    if (strValue == null || strValue == "") {
                        this._addErrToList(tthis, rules[i], "");
                        return false;
                    }
                }
            }
            return true;
        },
        _checkNullBySelect: function (tthis, rules) {//检查是否不能为空
            if ($(tthis).find("option").size() < 1) {
                return false;
            }
            var strValue = $.trim($(tthis).val());
            for (var i = 0; i < rules.length; i++) {
                if (rules[i] == "mustselect") {
                    if (strValue == null || strValue == "" || strValue == "-1") {
                        this._addErrToList(tthis, rules[i], "");
                        return false;
                    }
                }
            }
            return true;
        },
        _checkNullByBox: function (tthis, rules) {//检查是否不能为空 
            var strValue = $.trim($(tthis).val());
            for (var i = 0; i < rules.length; i++) {
                if (rules[i] == "mustchecked") {
                    if ($.find("[name='" + $(tthis).attr("name") + "']:checked").size() < 1) {
                        this._addErrToList(tthis, rules[i], "");
                        return false;
                    }
                }
            }
            return true;
        },
        _checkByType: function (tthis, strValue, strType, i, rules) {
            strValue = $.trim(strValue);
            var tempValue ;
            switch (strType) {
                case "custom":
                    var reg = new RegExp(this.aUsages[rules[(i + 1)]], "i");
                    if (!reg.test(strValue)) {
                        this._addErrToList(tthis, rules[(i + 1)], "");
                        return false;
                    }

                    break;
                case "minSize":
                    {
                        tempValue = strValue.length;
                        if (tempValue < parseInt(rules[(i + 1)])) {
                            this._addErrToList(tthis, "minSize", String(rules[(i + 1)]));
                            return false;
                        }
                        break;
                    }
                case "maxSize":
                    {
                        tempValue = strValue.length;
                        if (tempValue > parseInt(rules[(i + 1)])) {
                            this._addErrToList(tthis, "maxSize", String(rules[(i + 1)]));
                            return false;
                        }
                        break;
                    }
                case "min":
                    {
                        tempValue = this._changeFourDecimal_f(strValue);
                        var consultValuemin = this._changeFourDecimal_f(rules[(i + 1)]);
                        if (tempValue < consultValuemin) {
                            this._addErrToList(tthis, "min", String(rules[(i + 1)]));
                            return false;
                        }
                        break;
                    }
                case "max":
                    {
                        tempValue = this._changeFourDecimal_f(strValue);
                        var consultValuemax = this._changeFourDecimal_f(rules[(i + 1)]);
                        if (tempValue > consultValuemax) {
                            this._addErrToList(tthis, "max", String(rules[(i + 1)]));
                            return false;
                        }
                        break;
                    }
                case "maxCheckbox":
                    {
                        tempValue = this._changeFourDecimal_f(rules[(i + 1)]);
                        if ($("body").find("[name='" + tthis.attr("name") + "']:checked").size() > tempValue) {
                            this._addErrToList(tthis, "maxCheckbox", String(rules[(i + 1)]));
                            return false;
                        }
                        break;
                    }
                case "minCheckbox":
                    {
                        tempValue = this._changeFourDecimal_f(rules[(i + 1)]);
                        if ($("body").find("[name='" + tthis.attr("name") + "']:checked").size() < tempValue) {
                            this._addErrToList(tthis, "minCheckbox", String(rules[(i + 1)]));
                            return false;
                        }
                        break;
                    }
                case "equals":
                    {
                        tempValue = $("#" + rules[(i + 1)]).val();
                        var elmName = "";
                        if ($("#" + rules[(i + 1)]).is("[alt]")) {
                            elmName = $("#" + rules[(i + 1)]).attr("alt");
                        }
                        if (strValue != $.trim(tempValue)) {
                            this._addErrToList(tthis, "equals", elmName);
                            return false;
                        }
                        break;
                    }
                case "fun":
                    {
                        tempValue = rules[(i + 1)];
                        if (!eval("" + tempValue + "()")) {
                            this._addErrToList(tthis, "fun", "");
                        }
                        break;
                    }
                case "maxDate":
                    {
                        tempValue = rules[(i + 1)];
                        if (!this._isDate(strValue) || !this._isDate(tempValue)) {
                            this._addErrToList(tthis, "maxDate", String(rules[(i + 1)]));
                            return false;
                        }
                        if (!this._dateCompare(strValue, tempValue)) {
                            this._addErrToList(tthis, "maxDate", String(rules[(i + 1)]));
                            return false;
                        }
                    }
                case "minDate":
                    {
                        tempValue = rules[(i + 1)];
                        if (!this._isDate(strValue) || !this._isDate(tempValue)) {
                            this._addErrToList(tthis, "minDate", String(rules[(i + 1)]));
                            return false;
                        }
                        if (!this._dateCompare(tempValue, strValue)) {
                            this._addErrToList(tthis, "minDate", String(rules[(i + 1)]));
                            return false;
                        }
                    }
            }
            return true;
        },
        _isDateTime: function (value) {
            var dateTimeRegEx = new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1}$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^((1[012]|0?[1-9]){1}\/(0?[1-9]|[12][0-9]|3[01]){1}\/\d{2,4}\s+(1[012]|0?[1-9]){1}:(0?[1-5]|[0-6][0-9]){1}:(0?[0-6]|[0-6][0-9]){1}\s+(am|pm|AM|PM){1})$/);
            return dateTimeRegEx.test(value);
        },
        _isDate: function (value) {
            var dateRegEx = new RegExp(/^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$|^(?:(?:(?:0?[13578]|1[02])(\/|-)31)|(?:(?:0?[1,3-9]|1[0-2])(\/|-)(?:29|30)))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(?:(?:0?[1-9]|1[0-2])(\/|-)(?:0?[1-9]|1\d|2[0-8]))(\/|-)(?:[1-9]\d\d\d|\d[1-9]\d\d|\d\d[1-9]\d|\d\d\d[1-9])$|^(0?2(\/|-)29)(\/|-)(?:(?:0[48]00|[13579][26]00|[2468][048]00)|(?:\d\d)?(?:0[48]|[2468][048]|[13579][26]))$/);
            return dateRegEx.test(value);
        },
        _dateCompare: function (start, end) {
            if (start.indexOf('-') > 0) {
                var datelist_ = start.split('-');
                var datelist = end.split('-');
                var date_ = new Date(datelist_[0], datelist_[1], datelist_[2]);
                var date = new Date(datelist[0], datelist[1], datelist[2]);
                return (date_ <= date);
            }
            return (new Date(start.toString()) <= new Date(end.toString()));
        },
        lastSuccess: function () {

        },
        lastfailed: function () {
            alert($(this._errObj[0]).attr("id") + "|" + this._errTxtList);
        }
    };

})(jQuery);
 
