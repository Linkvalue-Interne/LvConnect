(function() {
  var form = document.querySelector('form');
  var button = form.querySelector('button[type=submit]');
  var inputs = form.querySelectorAll('input[required]');

  MaterialTextfield.prototype.checkValidity = function() {
    if (!this.input_.pristine && this.input_.validity) {
      if (this.input_.validity.valid) {
        this.element_.classList.remove(this.CssClasses_.IS_INVALID);
      } else {
        this.element_.classList.add(this.CssClasses_.IS_INVALID);
      }
    }
  };
  MaterialTextfield.prototype['checkValidity'] = MaterialTextfield.prototype.checkValidity;

  [].forEach.call(inputs, function(input) { input.pristine = true; });
  [].forEach.call(inputs, function(input) {
    input.addEventListener('focus', function() {
      unPristine(input);
    })
  });

  button.addEventListener('click', function() {
    [].forEach.call(inputs, unPristine);
  });

  function unPristine(input) {
    input.pristine = false;
    input.dispatchEvent(new Event('input', { 'bubbles': true }));
  }
}());
