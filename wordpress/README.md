# HIT WordPress enquiries

`hit-enquiries` is the WordPress companion plugin for the prototype’s **Study Cost Model**.

## What it adds

- A private **Enquiries** section in WordPress.
- Secure `POST /wp-json/hit/v1/estimate` handling with validation and rate limiting.
- Server-side recalculation using the published HIT tuition values instead of trusting browser totals.
- A branded PDF emailed to the applicant.
- An admissions notification email.
- Readable enquiry detail pages, delivery status, and an Excel-compatible CSV export.
- WordPress privacy export/erase support and configurable record retention.

## Installation

1. Zip the `hit-enquiries` folder or use the packaged file in `dist`.
2. In WordPress, open **Plugins → Add New → Upload Plugin**.
3. Activate **HIT Enquiries**.
4. Open **Enquiries → Settings** and set the Admissions email address.
5. Configure authenticated SMTP or the host’s transactional mail service, then send the test email.

The plugin exposes `window.HIT_ESTIMATE_ENDPOINT` and `window.HIT_ESTIMATE_NONCE` automatically. The prototype’s existing cost-model script detects those values and switches from local PDF download to WordPress email delivery.

Before launch, review the public privacy notice, retention period, email wording, and admissions workflow with Helvetic Tech’s responsible legal and operations teams.

