# Replaceable image slots

Public website images are separated by company:

- `public/images/daycare`
- `public/images/eduhub`

Each folder contains that brand's logo, page imagery, and team portraits.

Examples:

- `daycare.hero.jpg`
- `daycare.gallery.classroom.jpg`
- `eduhub.hero.jpg`
- `eduhub.about.team.jpg`

Replace a file while keeping its filename, then rebuild the site. Shared founders have
a portrait inside each company's `team` folder so either brand can be updated independently.
Static page imagery always uses these local files and never depends on Supabase.

Teacher, testimonial, and alumni portraits are dynamic-profile slots. They may use a
profile URL supplied by the CMS, but retain the local file as an offline fallback.

Run `npm run images:sync` to verify the local manifest and slot files remain aligned.
