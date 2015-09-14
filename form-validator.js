;(function(root, factory) {
  'use strict';

  if (typeof exports === 'object') {

    // CommonJS module
    // Load jQuery as a dependency
    var jQuery;
    try {jQuery = require('jquery'); } catch (e) {}

    module.exports = factory(jQuery);
  } else {
    root.FormValidator = factory(root.jQuery);
  }
}

(this, function($) {

  'use strict';

  // Validate.prototype.getSelectFields = function() {
  //   var select = [];

  //   this.$element.find('select').each(function() {
  //     select.push($(this));
  //   });

  //   this.fields.select = select;
  // };

  /**
   * creates invalid div
   * @param  {object} $parentNode - parent div el
   * @param  {string} message     - message to be added inside div
   * @param  {string} fieldName   - name of the field to apply class for
   */
  var createInvalidDiv = function($parentNode, message, fieldName) {
    var el = '<div class="invalid invalid-' + fieldName + '">' + message + '</div>';

    $parentNode.find('.invalid').remove();
    $parentNode.append(el);
  };

  /**
   * validate required el
   * @param  {string} val         - value to be validated
   * @param  {object} $parentNode - jquery parent  el
   */
  var checkRequired = function(val, $parentNode) {
    if (!val) {
      $parentNode.removeClass('is-valid');
      $parentNode.addClass('is-empty');
      this.isValid = false;
      return true;
    }

    return false;
  };

  var checkProper = function(val, $parentNode, fieldName) {
    var isProper = true;
    var regObj = this.options.regObj;
    var validateAgainst = this.options.validateAgainst;

    if (!val)
    return;

    if (validateAgainst.hasOwnProperty(fieldName)) {
      isProper = (regObj[validateAgainst[fieldName]].test(val)) ? true : false;
    }

    if (!isProper) {
      $parentNode.removeClass('is-valid');
      $parentNode.addClass('is-empty');
      createInvalidDiv($parentNode, this.options.invalidMsg[fieldName], fieldName);
      this.isValid = false;
    } else {
      $parentNode.removeClass('is-empty');
      $parentNode.addClass('is-valid');
    }
  };

  /**
   * validates  a field value
   * @param  {string} val          - vlue to be validated
   * @param  {object} $parentNode  - jquery parent el
   */
  var validateThis = function(val, $parentNode) {
    var fieldName = $parentNode.attr('field-name');
    var isRequired = true;
    var isEmpty = false;
    var optionals = this.options.optionals;

    isRequired = (optionals.indexOf(fieldName) === -1) ? true : false;

    if (isRequired)
    isEmpty = checkRequired.call(this, val, $parentNode);

    if (!isEmpty)
    checkProper.call(this, val,  $parentNode, fieldName);

    this.result[fieldName] = val;
  };

  var comparePairs = function(l1, l2, message) {
    var res = getSameFields.call(this, l1, l2);
    var f0 = (res[0].find('input').length && res[0].find('input')) || res[0].find('textarea');
    var f1 = (res[1].find('input').length && res[1].find('input')) || res[1].find('textarea');

    if (f0.val() !== f1.val()) {
      res[1].removeClass('is-valid');
      res[1].addClass('is-empty');
      createInvalidDiv(res[1], message);
      this.isValid = false;
    }
  };

  var checkSame = function() {
    var isSame = this.options.isSame;
    var _this = this;

    $.each(isSame, function(i, pair) {
      var key = Object.keys(pair)[0];
      comparePairs.call(_this, key, pair[key], pair.message);
    });
  };

  var createToolTip = function($node, fn) {
    var $parentNode = $node.parent();
    var fieldName = $parentNode.attr('field-name');
    var $existingTip =  $parentNode.find('.tip-' +  fieldName);
    var $newTip = $('<div class="tooltip tip-' + fieldName + '"></div>');
    var $tip = $existingTip;
    var message;

    if (!$existingTip.length) {
      $parentNode.append($newTip);
      $newTip.hide().fadeIn(100);
      $tip = $newTip;
    }

    $tip.attr('class', 'tooltip tip-' + fieldName);
    if (typeof fn === 'function')
    message = fn.call(this, $node, $tip);
    else
    message = fn;

    $tip.html(message);
  };

  var onFocus = function(node) {
    var $node = $(node);
    var $parentNode = $node.parent();
    var fieldName = $parentNode.attr('field-name');
    var $otherNode;

    if (typeof $parentNode.data('isSame') !== 'undefined') {
      fieldName = $parentNode.data('isSame').l2;
      $otherNode = this.$element.find('[field-name=' + fieldName + ']');
      $otherNode.find('.invalid').remove();
      $otherNode.removeClass('is-empty is-valid');
    }

    $parentNode.removeClass('is-empty is-valid');
    $parentNode.find('.invalid').remove();
  };

  /**
   * validate the field on focus out
   * @param  {object} node - element to be validated
   */
  var onFocusOut = function(node) {
    var $node  = $(node);
    var $parentNode = $node.parent();
    var isSame = $parentNode.data('isSame');
    var tooltip = $parentNode.data('tooltip');
    var $tip;

    validateThis.call(this, $node.val(), $parentNode);

    if (typeof isSame !== 'undefined') {
      if (isSame.validate)
      comparePairs.call(this, isSame.l1, isSame.l2, isSame.message);
    }

    if (typeof tooltip !== 'undefined') {
      $tip = $parentNode.find('.tooltip');
      $tip.fadeOut(100, function() {
        $tip.remove();
      });
    }
  };

  /**
   * handle keyup event for tooltip
   * @param  {object}   $node - element to be showed tooltip to
   * @param  {Function} fn     - function to be used for value
   */
  var onKeyUp = function($node, fn) {
    var message;

    createToolTip($node, fn);
  };

  /**
   * returns the  jquery elements for same field
   * @param  {string} l1 - first label
   * @param  {string} l2  - second label
   * @return {array} - array of jquery elements
   */
  var getSameFields = function(l1, l2) {
    var $f1 = this.$element.find('[field-name=' + l1 + ']');
    var $f2 = this.$element.find('[field-name=' + l2 + ']');

    return [$f1, $f2];
  };

  /**
   * get all the input fields and textarea
   */
  var getInputFields = function() {
    var inputs = [];
    var _this = this;
    var tooltip = this.options.tooltip;

    // push all the input $el to the inputs arr
    this.$element.find('input').not('input[type="radio"], input[type="checkbox"]').each(function() {
      inputs.push($(this));

      $(this).on('focus', onFocus.bind(_this, this));
      $(this).on('focusout', onFocusOut.bind(_this, this));
    });

    // push all the textarea to inputs
    this.$element.find('textarea').each(function() {
      inputs.push($(this));

      $(this).on('focus', onFocus.bind(_this, this));
      $(this).on('focusout', onFocusOut.bind(_this, this));
    });

    // check for tooltips
    $.each(tooltip, function(value, key) {
      _this.$element
        .find('[field-name="' + value + '"] input, [field-name="' + value + '"] textarea')
        .on('keyup', function() {

          $(this).parent().data('tooltip', true);
          onKeyUp($(this), key);

        });
    });

    // check for sameFields
    $.each(this.options.isSame, function(i, pair) {
      var key = Object.keys(pair)[0];
      var res =  getSameFields.call(_this, key, pair[key]);

      res[0].data('isSame', {l1: key, l2: pair[key], message: pair.message, validate: false});
      res[1].data('isSame', {l1: key, l2: pair[key], message: pair.message, validate: true});
    });

    this.fields.inputs = inputs;
  };

  /**
   * get all the type of fields
   * currenty supports only textarea and input
   */
  var getFields = function() {
    getInputFields.call(this);

    //this.getSelectFields();
    //this.getRadioFields();
    //this.getCheckBoxFields();
  };

  /**
   * constructor function
   * @param {object} options - user options
   */
  var FormValidator = function(options) {
    this.$element = options.field;
    this.options = $.extend({}, DEFAULTS, options);

    this.fields = {};
    this.result = {};

    getFields.call(this);
  };

  FormValidator.prototype.empty = function() {
    $.each(this.fields.inputs, function(i, $field) {
      $field.val('');
    });
  };

  FormValidator.prototype.run = function(cb) {
    var _this = this;

    this.isValid = true;

    $.each(this.fields.inputs, function(i, $field) {
      validateThis.call(_this, $field.val(), $field.parent());
    });

    checkSame.call(this);
    cb({isValid: _this.isValid, result: _this.result});
  };

  //  defaults
  var DEFAULTS = {
    optionals: [],
    isSame: [],
    validateAgainst: {},
    tooltip: {},
    regObj: {},
    invalidMsg: {},
  };

  return FormValidator;
}));
