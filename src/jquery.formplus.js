/*
 * 作者: kingsimon 2016-09-09
 * 说明:form表单操作，依赖jquery
 *
 * 方法名:formData
 * 方法说明:获取表单值或给表单赋值
 * 调用:
 * $('#formid').formData()
 * 参数说明:
 * @param 赋予的值
 *
 *
 * 方法名:formDisable
 * 方法说明:禁用或启用表单
 * 调用:
 * $('#formid').formDisable()
 * $('#formid').formDisable(true)
 * 参数说明:
 * @param true为禁用表单,其他值为启用表单
 *
 *
 * 方法名:selectValue
 * 方法说明:获取选择控件的值
 * 调用:
 * $('#selectid').selectValue()
 *
 *
 * 方法名:selectText
 * 方法说明:获取选择控件的文本值
 * 调用:
 * $('#selectid').selectText()
 *
 */
;
(function ($) {

    function isArray(v) {
        return Object.prototype.toString.call(v) === '[object Array]';
    }

    function isObject(v) {
        return Object.prototype.toString.call(v) === '[object Object]';
    }

    function isNum(s) {
        if (s != null && s != '') {
            return !isNaN(s);
        }
        return false;
    }

    function isInteger(obj) {
        if (isNum(obj)) {
            return obj % 1 === 0;
        }
        return false;
    }

    function isString(v) {
        return Object.prototype.toString.call(v) === '[object String]';
    }

    var setValue = function (target, value) {
        var $target = $(target);
        var tagName = target.tagName;
        var type = $target.attr('type');
        if (tagName == 'INPUT') {
            if (type == 'radio') {
                $target.attr('checked', $target.val() == value + '');
            } else if (type == 'checkbox') {
                if ($target.val() == value + '') {
                    $target.attr('checked', true);
                }
            } else {
                $target.val(value);
            }
        } else if (tagName == 'SELECT') {
            //兼容select2 触发change事件
            $target.val(value).trigger('change');
        } else if (tagName == 'TEXTAREA') {
            $target.val(value);
        }
    };


    $.fn.formData = function (data, option) {
        var $form = $(this);
        if (typeof data == 'undefined') {
            var serializeObj = {};
            var array = this.serializeArray();
            var str = this.serialize();
            $(array).each(function () {
                if (serializeObj[this.name]) {
                    if (isArray(serializeObj[this.name])) {
                        serializeObj[this.name].push(this.value);
                    } else {
                        serializeObj[this.name] = [serializeObj[this.name], this.value];
                    }
                } else {
                    var key = this.name;
                    var $target = $form.find('[name="' + key + '"],[name="' + key + '[]"]');
                    var tagName = $target[0].tagName;
                    var multiple = $target.prop('multiple');
                    if(!(multiple && tagName == 'SELECT')){
                        serializeObj[this.name] = this.value;
                    }else {
                        serializeObj[this.name] = [this.value];
                    }
                }
            });
            return serializeObj;
        } else {
            $.each(data, function (key, value) {
                var $target = $form.find('[name="' + key + '"],[name="' + key + '[]"]');
                if ($target.length == 0) return;
                var tagName = $target[0].tagName;
                var multiple = $target.prop('multiple');
                if (isNum(value) || isString(value)) {
                    $.each($target, function (key, target) {
                        setValue(target, value);
                    });
                } else if (isArray(value)) {
                    if (!(multiple && tagName == 'SELECT') && value.length == $target.length) {
                        $.each($target, function (key, target) {
                            setValue(target, value[key]);
                        });
                    } else {
                        setValue($target[0], value);
                    }
                } else if (isObject(value)) {

                }
            })
        }
    };

    $.fn.formDisable = function (isDisabled) {
        var $form = $(this);
        if (isDisabled) {
            var attr = 'disable';
            $form.data('formStatus', attr);
            $form.find(':text').attr('disabled', 'true');
            $form.find('textarea').attr('disabled', 'true');
            $form.find('select').attr('disabled', 'true').trigger('attr.update');
            $form.find(':radio').attr('disabled', 'true');
            $form.find(':checkbox').attr('disabled', 'true');
        } else {
            attr = 'enable';
            $form.data('formStatus', attr);
            $form.find(':text').removeAttr('disabled');
            $form.find('textarea').removeAttr('disabled');
            $form.find('select').removeAttr('disabled').trigger('attr.update');
            $form.find(':radio').removeAttr('disabled');
            $form.find(':checkbox').removeAttr('disabled');
        }
    };

    $.fn.selectValue = function () {
        return $(this).find('option:selected').attr('value');
    };

    $.fn.selectText = function () {
        var elem = $(this).find('option:selected');
        var str = (elem.attr('value') || '') == '' ? '' : elem.text();
        return str;
    };

})(jQuery);
