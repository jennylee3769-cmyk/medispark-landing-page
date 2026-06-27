const SHEET_NAME = 'leads';
const DEFAULT_DEVELOPER_NAME = '이정임';
const ALLOWED_LEAD_TYPES = ['phone_call', 'visit_reservation', 'info_request', 'modelhouse_view'];

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const normalized = normalizeLead_(payload);
    validateLead_(normalized);

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error('Sheet not found: ' + SHEET_NAME);
    }

    sheet.appendRow([
      timestamp_(),
      normalized.name,
      normalized.phone,
      normalized.lead_type,
      normalized.interest_type,
      normalized.visit_datetime,
      normalized.developer_name,
      normalized.page_name,
      normalized.page_url,
      normalized.device_type,
      normalized.utm_source,
      normalized.utm_medium,
      normalized.utm_campaign,
      normalized.referrer,
      normalized.privacy_agreed ? 'TRUE' : 'FALSE'
    ]);

    return jsonResponse_({
      ok: true,
      message: 'Lead saved',
      row: sheet.getLastRow()
    });
  } catch (error) {
    return jsonResponse_({
      ok: false,
      message: String(error && error.message ? error.message : error)
    });
  }
}

function doGet() {
  return jsonResponse_({
    ok: true,
    message: 'Apps Script endpoint is running'
  });
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error('Empty request body');
  }

  const type = String(e.postData.type || '').toLowerCase();
  if (type.includes('application/json')) {
    return JSON.parse(e.postData.contents);
  }

  const params = e.parameter || {};
  return {
    name: params.name,
    phone: params.phone,
    lead_type: params.lead_type,
    interest_type: params.interest_type,
    visit_datetime: params.visit_datetime,
    developer_name: params.developer_name,
    page_name: params.page_name,
    page_url: params.page_url,
    device_type: params.device_type,
    utm_source: params.utm_source,
    utm_medium: params.utm_medium,
    utm_campaign: params.utm_campaign,
    referrer: params.referrer,
    privacy_agreed: params.privacy_agreed
  };
}

function normalizeLead_(payload) {
  const data = payload || {};

  return {
    name: cleanString_(data.name),
    phone: digitsOnly_(data.phone),
    lead_type: cleanString_(data.lead_type) || 'info_request',
    interest_type: cleanString_(data.interest_type),
    visit_datetime: cleanString_(data.visit_datetime),
    developer_name: cleanString_(data.developer_name) || DEFAULT_DEVELOPER_NAME,
    page_name: cleanString_(data.page_name) || '메디스파크 분양 홍보 랜딩',
    page_url: cleanString_(data.page_url),
    device_type: cleanString_(data.device_type),
    utm_source: cleanString_(data.utm_source),
    utm_medium: cleanString_(data.utm_medium),
    utm_campaign: cleanString_(data.utm_campaign),
    referrer: cleanString_(data.referrer),
    privacy_agreed: normalizeBoolean_(data.privacy_agreed)
  };
}

function validateLead_(lead) {
  if (!lead.name) {
    throw new Error('Missing required field: name');
  }

  if (!lead.phone || lead.phone.length < 10) {
    throw new Error('Invalid phone');
  }

  if (!ALLOWED_LEAD_TYPES.includes(lead.lead_type)) {
    throw new Error('Invalid lead_type');
  }

  if (!lead.privacy_agreed) {
    throw new Error('Privacy agreement is required');
  }
}

function cleanString_(value) {
  return String(value || '').trim();
}

function digitsOnly_(value) {
  return String(value || '').replace(/\D/g, '');
}

function normalizeBoolean_(value) {
  const normalized = String(value || '').toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'on';
}

function timestamp_() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
}

function jsonResponse_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
