#### Form Validator

##### install
    npm install form-validatorjs

##### use

    var FormValidator = require('form-validatorjs');

if not using browerify/webpack simply copy form-validator.js and form-validator.css.

See the examples in `example` folder.

##### expected html
```html
<div class="form">
    <div field-name='first-name'>
        <input type="text" placeholder="First Name">
    </div>
    <div  field-name='last-name'>
      <input type="text" placeholder="Last Name">
    </div>
    <div field-name='pswd'>
      <input type="text" placeholder="Password">
    </div>
    <div field-name='description'>
        textarea
    </div>
</div>
```

for the validator to work the add  `field-name` to the parent of `input`  fields, preferably the key you want to send to the server on successfull validation.

##### apply (Supports only input and textarea fields now)

```javascript
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
      'last-name': 'This is not a number', // error message to display if invalid
    }
});

$('.button').click(function() {
    // use this function to handle user submit
    formValidator.run(function(data) {
        console.log(data); 
        // {isValid: false, result: [first-name: 'a', last-name:'b', pswd: 'c']};
    });
});
```

`isValid`  will be returned `true` or `false` depending upon validation.`result` will contain key-value pair of fields.

Fields are validated `onFocusout` and reset when `focused`.

##### Options
- `field` - the wrapper element that contains all the inputs.
- `optionals` - fields in this array wont be tracked for empty field. But validation rules can still be applied.
- `validateAgainst`  - specify the fields to be validated as key-value pairs, with key as the `field-name` and value as one of the `regexTypes` from `regObj`.
- `regObj` - specify the `regexTypes` for validation.
- `invalidMsg` - specify the 'error' message if invalid.

eg: if you want to validate `email-val` field

```html
<div field-name='email-val'>
    <input type="email" placeholder='Please enter your email'>
</div>
```

```javascript
validateAgainst : {
    'email-val': 'emailReg'  // specifies to validate email-val against emailReg.
},
regObj: {
    emailReg: /some regex string/, // uses this string for email-val validation.
},
invalidMsg: {
    'email-val': 'Invalid Email'. // inserts this error message if invalid.
}
```

if the field is invalid, 
```html
<div class="invalid invalid-email-val">Invalid Email.</div>;
```

will be added inside the `field='email-val'` div.

##### Css

Copy the css from `form-validator.css` file for reference.

- `is-empty` - class is applied if the field is empty. Optionals wont be affected.
- `is-valid` - class is applied if the field is non-empty and does not break any validation rules.


#### isSame and tooltip Options

##### isSame
```javascript
// formValidator options
isSame: [
  {'pswd': 'pswd-again', 'message': 'Passwords not same'},
  {'pri-addr': 'sec-addr','message': 'Address not same'}
],
```

isSame option matches the first two fields (eg. `pswd`  and `pswd-again`) and if they dont match inserts 

```html
<div class="invalid">Passwords not same</div>;
```

inside the second field option div. 

In the above case if the passwords dont match the div will be inserted inside the `field-name=pswd-again` div.

##### toolTip

```javascript
// formValidator options
tooltip: {
  'pswd': 'The password should be atleast 6 digit long.',
},
```

This will show a tooltip alongside `pswd` field when you start typing.

For dynamic text inside tooltip, pass value as a function and return the `message` to be displayed. eg.

```javascript
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

// formValidator options
tooltip: {
  'pswd': checkLength
}
```

###### Api
    formValidator.empty() // empty all the fields




