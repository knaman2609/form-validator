;(function($) {

  function checkLength($node, $tooltip) {
    var val = $node.val().length;

    if (val < 3) {
      $tooltip.addClass('danger');
      return 'Poor';
    } else if (val < 6) {
      $tooltip.addClass('warning');
      return 'Ok';
    } else {
      $tooltip.addClass('success');
      return 'Great';
    }
  }

  var formValidator = new FormValidator({
    field: $('.form'),
    optionals: ['last-name'],
    validateAgainst: {
      'last-name': 'numberReg',
    },
    regObj: {
      numberReg: /^[0-9]*$/,
    },
    invalidMsg: {
      'last-name': 'This is not a number',
    },
    tooltip: {
      'pswd': checkLength,
      'description': 'Please fill the address as street </br> no./locality/city/state/.',
    },
    isSame: [
      {'pswd': 'pswd-again', 'message': 'Passwords not same'},
    ],
  });

  $('.button').click(function() {
    formValidator.run(function(data) {
      console.log(data);
    });
  });


})(jQuery);
