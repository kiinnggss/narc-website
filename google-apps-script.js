/**
 * Google Apps Script — Nigerian Action Rangers Corps registration handler
 *
 * Setup:
 * 1. Create a Google Sheet for NARC registrations.
 * 2. Open Extensions -> Apps Script.
 * 3. Paste this entire file into Code.gs and save.
 * 4. Click Deploy -> New deployment -> Web app.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web app URL and paste it into CONFIG.googleSheetWebhookUrl
 *    at the top of script.js.
 */

const SHEET_NAME = "Registrations";
const HEADERS = [
  "Submitted At",
  "Full Name",
  "Phone",
  "State",
  "Next of Kin Name",
  "Next of Kin Phone",
];

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function sanitizeCell(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  // Prevent formula execution while preserving +234 phone numbers as plain text.
  if (/^[=+\-@]/.test(text)) {
    return "'" + text;
  }
  return text;
}

function parsePayload(e) {
  if (e && e.parameter && Object.keys(e.parameter).length > 0) {
    return e.parameter;
  }
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (_err) {
      return {};
    }
  }
  return {};
}

function doPost(e) {
  try {
    const data = parsePayload(e);
    const fullName = sanitizeCell(data.fullName);
    const phone = sanitizeCell(data.phone);
    const state = sanitizeCell(data.state);
    const nextOfKinName = sanitizeCell(data.nextOfKinName);
    const nextOfKinPhone = sanitizeCell(data.nextOfKinPhone);

    if (!fullName || !phone || !state) {
      return jsonResponse({ ok: false, error: "Missing required fields." });
    }

    const sheet = getOrCreateSheet();
    const submittedAt = Utilities.formatDate(
      new Date(),
      "Africa/Lagos",
      "yyyy-MM-dd HH:mm:ss"
    );

    const nextRow = sheet.getLastRow() + 1;
    // Format phone columns as plain text so leading zeros like 080... are never dropped.
    sheet.getRange(nextRow, 3).setNumberFormat("@");
    sheet.getRange(nextRow, 6).setNumberFormat("@");

    sheet
      .getRange(nextRow, 1, 1, HEADERS.length)
      .setValues([
        [submittedAt, fullName, phone, state, nextOfKinName, nextOfKinPhone],
      ]);

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function doGet() {
  return jsonResponse({
    ok: true,
    service: "NARC Registration Sheet Endpoint",
  });
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}
