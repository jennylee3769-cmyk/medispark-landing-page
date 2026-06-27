const APP_CONFIG = window.APP_CONFIG || {};
const APPS_SCRIPT_URL = APP_CONFIG.APPS_SCRIPT_URL || 'PASTE_YOUR_APPS_SCRIPT_WEBAPP_URL_HERE';
const DEFAULT_DEVELOPER_NAME = APP_CONFIG.DEVELOPER_NAME || '이정임';
const PAGE_NAME = APP_CONFIG.PAGE_NAME || '메디스파크 분양 홍보 랜딩';
const PHONE_TARGET = APP_CONFIG.PHONE_TARGET || '01066892348';
const ALLOWED_LEAD_TYPES = ['phone_call', 'visit_reservation', 'info_request', 'modelhouse_view'];

const consultModal = document.getElementById('consult-modal');
const modalLeadType = document.getElementById('modal-lead-type');
const modalCallLink = document.getElementById('modal-call-link');
const modalFormStatus = document.getElementById('modal-form-status');
const quickFormStatus = document.getElementById('quick-form-status');
const quickCallLink = document.getElementById('quick-call-link');
const mainFormStatus = document.getElementById('main-form-status');

document.querySelectorAll('[data-open-consult]').forEach((button) => {
  button.addEventListener('click', () => {
    openConsultModal(button.dataset.openConsult || 'phone_call', button.dataset.interest || '');
  });
});

document.querySelectorAll('[data-close-modal]').forEach((node) => {
  node.addEventListener('click', closeConsultModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && consultModal.classList.contains('is-open')) {
    closeConsultModal();
  }
});

document.querySelectorAll('.unit-tab').forEach((tab) => {
  tab.addEventListener('click', () => setActiveUnit(tab.dataset.unit));
});

document.querySelectorAll('.faq-question').forEach((button) => {
  button.addEventListener('click', () => {
    button.parentElement.classList.toggle('is-open');
  });
});

document.querySelectorAll('.option-chips').forEach((group) => {
  group.querySelectorAll('.option-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const inputId = group.dataset.chipGroup;
      const hiddenInput = document.getElementById(inputId);
      if (!hiddenInput) return;

      hiddenInput.value = chip.dataset.chipValue || '';
      group.querySelectorAll('.option-chip').forEach((item) => {
        item.classList.toggle('is-active', item === chip);
      });
    });
  });
});

document.getElementById('modal-lead-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = buildPayload({
    prefix: 'modal',
    fallbackLeadType: modalLeadType.value || 'phone_call'
  });

  await submitLead({
    payload,
    statusElement: modalFormStatus,
    onSuccess: () => {
      modalCallLink.classList.remove('is-hidden');
      modalCallLink.href = `tel:${PHONE_TARGET}`;
      modalCallLink.focus();
    },
    onFailure: () => {
      modalCallLink.classList.remove('is-hidden');
      modalCallLink.href = `tel:${PHONE_TARGET}`;
    },
    successMessage: '접수가 완료되었습니다. 아래 버튼으로 바로 전화 연결하실 수 있습니다.',
    failureSuffix: '저장에 실패해도 아래 버튼으로 전화 연결은 가능합니다.'
  });
});

document.getElementById('quick-lead-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = buildPayload({
    prefix: 'quick',
    fallbackLeadType: 'phone_call'
  });

  await submitLead({
    payload,
    statusElement: quickFormStatus,
    onSuccess: () => {
      quickCallLink.classList.remove('is-hidden');
      quickCallLink.href = `tel:${PHONE_TARGET}`;
      quickCallLink.focus();
    },
    onFailure: () => {
      quickCallLink.classList.remove('is-hidden');
      quickCallLink.href = `tel:${PHONE_TARGET}`;
    },
    successMessage: '접수가 완료되었습니다. 아래 번호로 바로 전화 연결하실 수 있습니다.',
    failureSuffix: '저장에 실패해도 아래 번호로 전화 연결은 가능합니다.'
  });
});

document.getElementById('main-lead-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = buildPayload({
    prefix: 'main',
    fallbackLeadType: 'visit_reservation'
  });

  await submitLead({
    payload,
    statusElement: mainFormStatus,
    successMessage: '방문예약이 접수되었습니다. 담당자가 순차적으로 연락드립니다.'
  });
});

function openConsultModal(leadType, interestType, seed = {}) {
  modalLeadType.value = normalizeLeadType(leadType);
  modalCallLink.classList.add('is-hidden');
  modalFormStatus.textContent = '';

  if (interestType) {
    const hiddenInput = document.getElementById('modal-interest-type');
    hiddenInput.value = interestType;
    syncChipGroup('modal-interest-type', interestType);
  }

  if (seed.name) {
    document.getElementById('modal-name').value = seed.name;
  }

  if (seed.phone) {
    document.getElementById('modal-phone').value = seed.phone;
  }

  if (typeof seed.privacyAgreed === 'boolean') {
    document.getElementById('modal-privacy').checked = seed.privacyAgreed;
  }

  consultModal.classList.add('is-open');
  consultModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function syncChipGroup(inputId, value) {
  const group = document.querySelector(`[data-chip-group="${inputId}"]`);
  if (!group) return;

  group.querySelectorAll('.option-chip').forEach((chip) => {
    chip.classList.toggle('is-active', (chip.dataset.chipValue || '') === value);
  });
}

function closeConsultModal() {
  consultModal.classList.remove('is-open');
  consultModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function setActiveUnit(unit) {
  document.querySelectorAll('.unit-tab').forEach((tab) => {
    tab.classList.toggle('is-active', tab.dataset.unit === unit);
  });

  document.querySelectorAll('.unit-panel').forEach((panel) => {
    panel.classList.toggle('is-active', panel.dataset.unitPanel === unit);
  });
}

function normalizeLeadType(value) {
  return ALLOWED_LEAD_TYPES.includes(value) ? value : 'info_request';
}

function buildPayload({ prefix, fallbackLeadType }) {
  const url = new URL(window.location.href);
  const leadTypeField = document.getElementById(`${prefix}-lead-type`);
  const visitField = document.getElementById(`${prefix}-visit-datetime`);
  const visitDateField = document.getElementById(`${prefix}-visit-date`);
  const visitTimeField = document.getElementById(`${prefix}-visit-time`);
  const privacyField = document.getElementById(`${prefix}-privacy`);
  const interestField = document.getElementById(`${prefix}-interest-type`);

  return {
    name: getValue(`${prefix}-name`),
    phone: digitsOnly(getValue(`${prefix}-phone`)),
    lead_type: normalizeLeadType(leadTypeField ? leadTypeField.value : fallbackLeadType),
    interest_type: interestField ? interestField.value : '',
    visit_datetime: buildVisitDateTime(visitField, visitDateField, visitTimeField),
    developer_name: DEFAULT_DEVELOPER_NAME,
    page_name: PAGE_NAME,
    page_url: window.location.href,
    device_type: window.innerWidth <= 768 ? 'mobile' : 'desktop',
    utm_source: url.searchParams.get('utm_source') || '',
    utm_medium: url.searchParams.get('utm_medium') || '',
    utm_campaign: url.searchParams.get('utm_campaign') || '',
    referrer: document.referrer || '',
    privacy_agreed: privacyField ? privacyField.checked : false
  };
}

function buildVisitDateTime(visitField, visitDateField, visitTimeField) {
  if (visitField) {
    return visitField.value || '';
  }

  const visitDate = visitDateField ? visitDateField.value : '';
  const visitTime = visitTimeField ? visitTimeField.value : '';

  if (visitDate && visitTime) {
    return `${visitDate} ${visitTime}`;
  }

  if (visitDate) {
    return visitDate;
  }

  return '';
}

function getValue(id) {
  const field = document.getElementById(id);
  return field ? field.value.trim() : '';
}

function digitsOnly(value) {
  return String(value || '').replace(/\D/g, '');
}

function validatePayload(payload) {
  if (!payload.name) {
    return '이름을 입력해주세요.';
  }

  if (!payload.phone || payload.phone.length < 10) {
    return '연락처를 정확히 입력해주세요.';
  }

  if (!payload.privacy_agreed) {
    return '개인정보 수집 및 상담 연락 동의가 필요합니다.';
  }

  return '';
}

async function submitLead({
  payload,
  statusElement,
  onSuccess,
  onFailure,
  successMessage = '접수가 완료되었습니다. 담당자가 순차적으로 연락드립니다.',
  failureSuffix = '잠시 후 다시 시도해주세요.'
}) {
  const error = validatePayload(payload);
  if (error) {
    statusElement.textContent = error;
    return;
  }

  statusElement.textContent = '정보를 접수하고 있습니다.';

  try {
    if (APPS_SCRIPT_URL.includes('PASTE_YOUR_APPS_SCRIPT_WEBAPP_URL_HERE')) {
      throw new Error('Apps Script URL이 아직 설정되지 않았습니다.');
    }

    await submitLeadByHiddenForm(payload);

    statusElement.textContent = successMessage;
    if (onSuccess) {
      onSuccess();
    }
  } catch (error) {
    statusElement.textContent = `${error.message} ${failureSuffix}`;
    if (onFailure) {
      onFailure();
    }
  }
}

function buildFormBody(payload) {
  const form = new URLSearchParams();
  Object.entries(payload).forEach(([key, value]) => {
    form.append(key, String(value ?? ''));
  });
  return form.toString();
}

function submitLeadByHiddenForm(payload) {
  return new Promise((resolve, reject) => {
    try {
      const iframeName = 'lead-submit-frame';
      let iframe = document.querySelector(`iframe[name="${iframeName}"]`);
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.name = iframeName;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      }

      const form = document.createElement('form');
      form.method = 'POST';
      form.action = APPS_SCRIPT_URL;
      form.target = iframeName;
      form.style.display = 'none';

      Object.entries(payload).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = String(value ?? '');
        form.appendChild(input);
      });

      document.body.appendChild(form);

      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        form.remove();
        resolve();
      };

      const fail = (error) => {
        if (settled) return;
        settled = true;
        form.remove();
        reject(error);
      };

      iframe.addEventListener('load', finish, { once: true });

      try {
        form.submit();
      } catch (error) {
        fail(error);
        return;
      }

      window.setTimeout(finish, 1200);
    } catch (error) {
      reject(error);
    }
  });
}
