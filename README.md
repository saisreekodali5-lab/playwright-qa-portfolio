# Playwright QA Portfolio

End-to-end UI and API test automation written in **TypeScript** with **Playwright**, run automatically on every push with **GitHub Actions**.

![Playwright Tests](https://github.com/saisreekodali5-lab/playwright-qa-portfolio/actions/workflows/playwright.yml/badge.svg)

## What is tested

| Suite | Application under test | Coverage |
| --- | --- | --- |
| UI – Login | [Sauce Demo](https://www.saucedemo.com) (practice e-commerce site) | Valid login, locked-out user, data-driven validation errors, protected-page redirect |
| UI – Products & cart | Sauce Demo | Sorting by price and name, add/remove items, cart badge, cart persistence after reload |
| UI – Checkout | Sauce Demo | Full purchase flow, subtotal calculation, required-field validation |
| API – Bookings | [Restful Booker](https://restful-booker.herokuapp.com) (practice REST API) | Token auth, full CRUD lifecycle, negative auth cases, query filtering |

UI tests run in **Chromium and Firefox** (cross-browser).

## Framework design

- **Page Object Model** – each page's locators and actions live in `pages/`, so tests read like user stories.
- **Custom fixtures** – `fixtures/test-fixtures.ts` injects page objects and a ready-logged-in session (`loggedIn`) into tests.
- **Stable locators** – elements are found by `data-test` attributes, not by CSS classes that change with styling.
- **Data-driven tests** – validation cases are defined as data and generate one test each.
- **Separate test data** – accounts and customer details live in `test-data/`.
- **Debugging on failure** – screenshots, videos and traces are kept for failed tests; retries run in CI.
- **CI/CD** – GitHub Actions type-checks the code, runs all tests and publishes the HTML report.

```
├── .github/workflows/playwright.yml   # CI pipeline
├── fixtures/test-fixtures.ts          # Custom fixtures
├── pages/                             # Page objects
├── test-data/                         # Test accounts and input data
├── tests/
│   ├── ui/                            # Browser tests
│   └── api/                           # API tests
└── playwright.config.ts               # Projects: chromium, firefox, api
```

## Run it locally

Requires Node.js 18 or newer.

```bash
npm install
npx playwright install chromium firefox

npm test              # everything
npm run test:ui       # UI tests in Chromium and Firefox
npm run test:api      # API tests only
npm run test:headed   # watch the browser run
npm run report        # open the HTML report
```

## Author

**Sai Sree Kodali** – Software Test Engineer
