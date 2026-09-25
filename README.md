# Easyvo Invoice Generator

Easyvo Invoice Generator is a lightweight, browser-based invoice app for freelancers, small businesses, service providers, and entrepreneurs. Create a professional invoice, preview it as you work, and print or download it without installing a backend or accounting platform.

## Features

- Landing page that explains the Easyvo workflow and benefits
- Invoice form for:
  - Business and customer details
  - Invoice number, issue date, and due date
  - Multiple line items with quantity and price
  - Tax, discount, shipping, and notes
  - Optional company logo upload
- Live invoice preview with automatic subtotal and total calculations
- Currency options for GHS, GBP, EUR, USD, CNY, and NGN
- Light and dark themes with saved theme preference
- Responsive layout for desktop, tablet, and mobile screens
- Print-ready invoices on desktop
- Client-side PDF download on mobile and tablet

## Getting started

This is a static HTML, CSS, and JavaScript project. No build step or package installation is required.

### Option 1: VS Code Live Server

1. Open the project folder in VS Code.
2. Install the **Live Server** extension if it is not already installed.
3. Open [`index.html`](./index.html).
4. Click **Go Live** in the VS Code status bar.
5. Select **Create an Invoice** to open the invoice generator.

The repository includes a Live Server configuration that uses port `5501`.

### Option 2: Any static web server

Serve the project directory with any local static web server and open `index.html` in a browser. For example, with Python installed:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000>.

Opening the HTML files directly from the file system may work for basic browsing, but a local server is recommended for consistent browser behavior.

## Using the invoice generator

1. Enter your business details and optional logo.
2. Add the customer's details.
3. Set the invoice number, dates, and currency.
4. Add each product or service as a line item.
5. Apply tax, discount, shipping, or notes if needed.
6. Review the live preview.
7. Print the invoice or download it as a PDF, depending on the device.

Uploaded logos and the selected color theme are stored in the browser's local storage for convenience.

## Project structure

```text
.
├── index.html             # Easyvo landing page
├── invoice.html           # Invoice form and preview
├── landing-page.js        # Landing page navigation and theme behavior
├── invoice.js             # Invoice calculations, preview, print, and PDF logic
├── landing-page.css       # Landing page styles
├── invoice.css            # Invoice page styles
├── responsive.css         # Responsive layout rules
├── images/                # Logos and product mockups
├── icon/                  # Theme icons
└── .vscode/
    └── settings.json      # Local Live Server configuration
```

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- [html2canvas](https://github.com/niklasvh/html2canvas) and [jsPDF](https://github.com/parallax/jsPDF) for client-side PDF generation
- Google Fonts

The PDF and font libraries are loaded from CDNs by [`invoice.html`](./invoice.html). PDF downloads therefore require an internet connection unless those assets are hosted locally.

## Browser support

Use a modern browser with JavaScript enabled. The logo upload, local storage, print, and PDF features depend on standard browser APIs.

## License

No license has been specified for this project yet.
