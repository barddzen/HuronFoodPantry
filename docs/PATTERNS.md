# HuronFoodPantry - Code Patterns

Community food pantry website hosted on AWS S3 + CloudFront.

---

## Project Structure

```
HuronFoodPantry/
├── site/                      # Deploy target (synced to S3)
│   ├── index.html             # Home page
│   ├── about.html             # About the pantry
│   ├── events.html            # Events calendar
│   ├── receiving-goods.html   # How to receive assistance
│   ├── ways-to-give-*.html    # Donation pages (monetary, guidelines, current needs)
│   ├── get-involved-*.html    # Volunteer pages (volunteers, projects, newsletter)
│   ├── css/style.css          # Shared design system
│   ├── js/main.js             # Nav/footer injection, dropdowns, mobile toggle
│   └── images/                # Logos (webp + originals)
├── website/                   # OLD Squarespace code-block snippets (archived)
├── docs/                      # Planning documents
├── *.pdf                      # Marketing materials
└── CLAUDE.md                  # Project docs for Claude Code
```

## Page Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title | Huron Helping Hands Food Pantry</title>
  <meta name="description" content="...">
  <link rel="icon" type="image/webp" href="images/hhh-logo.webp">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <main id="main-content" class="page-content">
    <!-- Page content — nav/footer injected by main.js -->
  </main>
  <script src="js/main.js"></script>
</body>
</html>
```

## Rules

- Static HTML only — no build system, no frameworks
- All deployable pages in `site/` directory
- Nav and footer live in `js/main.js` — single source of truth
- Styles in `css/style.css` using CSS variables — no `!important`
- Keep language accessible — this serves community members seeking assistance
- Deploy: `aws s3 sync site/ s3://www.huronhelpinghands.org/ --delete --region us-east-2`
