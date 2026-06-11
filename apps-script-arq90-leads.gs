/**
 * ARQ90 - Lead Capture Web App
 * Recebe os dados do formulario diagnostico-arq90 e grava na planilha.
 *
 * Planilha:
 * https://docs.google.com/spreadsheets/d/1Argne9mIrWI0CdJdcZeWegtEwm41lLOjsdlcvQWDNt0/edit
 *
 * Implantacao recomendada:
 * - Tipo: App da Web
 * - Executar como: Eu
 * - Quem tem acesso: Qualquer pessoa
 */

const SPREADSHEET_ID = '1Argne9mIrWI0CdJdcZeWegtEwm41lLOjsdlcvQWDNt0';
const SHEET_NAME = 'Leads ARQ90';

const HEADERS = [
  'timestamp',
  'nome',
  'whatsapp',
  'email',
  'empresa',
  'segmento',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
  'fbclid',
  'referrer',
  'landing_page'
];

function doPost(e) {
  try {
    const sheet = getOrCreateSheet_();
    const data = e && e.parameter ? e.parameter : {};

    const row = HEADERS.map(function (key) {
      if (key === 'timestamp') return new Date();
      return data[key] || '';
    });

    sheet.appendRow(row);

    return jsonResponse_({ status: 'success' });
  } catch (err) {
    return jsonResponse_({ status: 'error', message: err.toString() });
  }
}

function doGet() {
  return jsonResponse_({
    status: 'ok',
    message: 'ARQ90 lead endpoint ativo'
  });
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#111214')
      .setFontColor('#F2F0EC');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
