(function () {
  'use strict';

  // ---- 「高校一覧」ドロップダウン ----
  var btn = document.querySelector('.dd-btn');
  var panel = document.getElementById('dd-panel');
  if (btn && panel) {
    var setOpen = function (open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) { panel.removeAttribute('hidden'); } else { panel.setAttribute('hidden', ''); }
    };
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(btn.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('click', function (e) {
      if (!panel.contains(e.target) && e.target !== btn) { setOpen(false); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        btn.focus();
      }
    });
  }

  // ---- 年表のしぼりこみ ----
  var filters = document.querySelector('.filters');
  var tl = document.querySelector('[data-tl]');
  if (filters && tl) {
    var buttons = filters.querySelectorAll('button');
    var items = tl.querySelectorAll('.ev');
    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-f');
        buttons.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        items.forEach(function (li) {
          var show = f === 'all' || li.getAttribute('data-tag') === f;
          if (show) { li.removeAttribute('hidden'); } else { li.setAttribute('hidden', ''); }
        });
      });
    });
  }

  // ---- ホームの「校名から探す」 ----
  var jump = document.querySelector('[data-jump]');
  if (jump) {
    jump.addEventListener('change', function () {
      if (jump.value) { window.location.href = jump.value; }
    });
  }

  // ---- お問い合わせフォーム（Formspree）----
  var form = document.getElementById('contact-form');
  if (form) {
    var msg = form.querySelector('.form-msg');
    var sendBtn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      if (!window.fetch || !window.FormData) { return; }   // 古いブラウザでは通常の送信
      e.preventDefault();
      sendBtn.disabled = true;
      msg.textContent = '送信しています…';
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          msg.textContent = '送信しました。お問い合わせありがとうございます。';
        } else if (res.status === 422) {
          msg.textContent = '入力内容をもう一度ご確認ください。';
        } else {
          form.submit();                                   // うまくいかないときは通常の送信
        }
      }).catch(function () {
        msg.textContent = '送信できませんでした。時間をおいて、もう一度お試しください。';
      }).then(function () {
        sendBtn.disabled = false;
      });
    });
  }
})();
