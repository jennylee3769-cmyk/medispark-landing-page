(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = [...document.querySelectorAll('[role="tabpanel"]')];
  const form = document.getElementById('consult-form');
  const status = document.getElementById('form-status');
  const interest = form?.elements.namedItem('interest');
  const phoneDialog = document.getElementById('phone-dialog');
  const dialogClose = phoneDialog?.querySelector('.dialog-close');
  let previouslyFocused = null;

  function setMenu(open) {
    if (!menuButton || !mainNav) return;
    menuButton.setAttribute('aria-expanded', String(open));
    mainNav.classList.toggle('is-open', open);
  }

  menuButton?.addEventListener('click', () => {
    setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  });

  mainNav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  function closeCallDialog() {
    if (!phoneDialog?.classList.contains('is-open')) return;
    phoneDialog.classList.remove('is-open');
    phoneDialog.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    previouslyFocused?.focus();
  }

  document.querySelectorAll('[data-open-call-modal]').forEach((button) => {
    button.addEventListener('click', () => {
      previouslyFocused = button;
      phoneDialog.classList.add('is-open');
      phoneDialog.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      dialogClose?.focus();
    });
  });
  phoneDialog?.querySelectorAll('[data-close-call-modal]').forEach((button) => {
    button.addEventListener('click', closeCallDialog);
  });

  function activateTab(tab, moveFocus = false) {
    const name = tab.dataset.unit;
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== name;
    });
    if (interest && ['84A', '84B', '101'].includes(name.toUpperCase())) {
      interest.value = name.toUpperCase();
    }
    if (moveFocus) tab.focus();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', (event) => {
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      activateTab(tabs[next], true);
    });
  });

  document.querySelectorAll('[data-interest]').forEach((link) => {
    link.addEventListener('click', () => {
      const type = link.dataset.interest;
      if (interest && ['84A', '84B', '101'].includes(type)) interest.value = type;
    });
  });

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    status.textContent = '';
    if (!form.reportValidity()) return;
    const phoneField = form.elements.namedItem('phone');
    const phone = String(phoneField.value).replace(/\D/g, '');
    if (phone.length < 10) {
      status.textContent = '연락처를 다시 확인해 주세요. 실습 페이지에서는 상담 접수가 전송되지 않습니다.';
      phoneField.focus();
      return;
    }
    status.textContent = '입력 동작을 확인했습니다. 실습용 페이지이므로 상담 신청은 전송·저장되지 않았습니다.';
    form.reset();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenu(false);
      closeCallDialog();
    }
    if (event.key === 'Tab' && phoneDialog?.classList.contains('is-open')) {
      const focusable = [...phoneDialog.querySelectorAll('button:not(:disabled), a[href]')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
  });
})();
