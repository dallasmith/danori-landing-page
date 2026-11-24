// Markup calculator on /templates/construction-estimate-template.
// Runs in the browser only. Nothing is saved or sent anywhere.
(function () {
  var calc = document.getElementById('markup-calc');
  if (!calc) return;

  var mode = document.getElementById('calc-mode');
  var cost = document.getElementById('calc-cost');
  var rate = document.getElementById('calc-rate');
  var rateLabel = document.getElementById('calc-rate-label');
  var note = document.getElementById('calc-note');
  var out = {
    markupNeed: document.getElementById('calc-markup-need'),
    price: document.getElementById('calc-price'),
    profit: document.getElementById('calc-profit'),
    marginMake: document.getElementById('calc-margin-make')
  };

  function readNumber(input) {
    var text = input.value.replace(/[$,%\s]/g, '');
    if (text === '' || isNaN(Number(text))) return null;
    return Number(text);
  }

  function money(n) {
    var rounded = Math.round(n);
    var sign = rounded < 0 ? '-' : '';
    return sign + '$' + Math.abs(rounded).toLocaleString('en-US');
  }

  function percent(n) {
    return (n * 100).toFixed(1) + '%';
  }

  function clear() {
    out.markupNeed.textContent = '';
    out.price.textContent = '';
    out.profit.textContent = '';
    out.marginMake.textContent = '';
  }

  function update() {
    var fromMargin = mode.checked;
    rateLabel.textContent = fromMargin ? 'Margin you want' : 'Markup';
    calc.querySelectorAll('.markup-calc-row[data-mode]').forEach(function (row) {
      row.hidden = row.getAttribute('data-mode') !== (fromMargin ? 'margin' : 'markup');
    });

    note.hidden = true;
    clear();

    var c = readNumber(cost);
    var r = readNumber(rate);
    if (c === null || r === null) return;
    r = r / 100;

    if (fromMargin) {
      if (r >= 1) {
        note.hidden = false;
        return;
      }
      var price = c / (1 - r);
      out.markupNeed.textContent = percent(r / (1 - r));
      out.price.textContent = money(price);
      out.profit.textContent = money(price - c);
    } else {
      var p = c * (1 + r);
      out.price.textContent = money(p);
      out.profit.textContent = money(p - c);
      if (p !== 0) out.marginMake.textContent = percent((p - c) / p);
    }
  }

  mode.addEventListener('change', update);
  cost.addEventListener('input', update);
  rate.addEventListener('input', update);
  update();
})();
