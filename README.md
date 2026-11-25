# Nigerian Action Rangers Corps Website

Static informational and free registration site for the Nigerian Action Rangers Corps.

## Files

- `index.html` - Full landing page, photo gallery, and registration form.
- `styles.css` - Ceremonial green, gold, and crimson styling derived from the NARC emblem.
- `script.js` - Form validation, Nigerian states list, lightbox viewer, and Google Sheets submission.
- `google-apps-script.js` - Apps Script endpoint that appends each registration row into Google Sheets.
- `assets/` - Emblem and placeholder gallery photos.

## Connect registration to Google Sheets

1. Open [Google Sheets](https://sheets.new) and create a blank spreadsheet.
2. Click **Extensions -> Apps Script**.
3. Delete the starter code and paste the full contents of `google-apps-script.js`.
4. Save, then click **Deploy -> New deployment**.
5. Choose **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Authorize the script and copy the Web app URL.
7. Open `script.js` and paste the URL into `CONFIG.googleSheetWebhookUrl`.

Every registration automatically adds a row to a `Registrations` tab with columns:

`Submitted At | Full Name | Phone | State | Next of Kin Name | Next of Kin Phone`

Phone columns are formatted as text so leading zeros like `0803...` stay intact.

## Swap in real photos later

Replace the four placeholder files in `assets/` with real corps photos using the same filenames, or update the `<img>` tags in `index.html`:

- `assets/hero-parade.jpg`
- `assets/gallery-community.jpg`
- `assets/gallery-drill.jpg`
- `assets/gallery-briefing.jpg`
- `assets/narc-emblem.jpg`

## Hosting on GitHub Pages

This site runs directly on GitHub Pages with no external host or build step. Pushing to `main` triggers `.github/workflows/deploy-pages.yml` and publishes to:

`https://kiinnggss.github.io/narc-website/`
