"""Headless smoke test of the built app. Run `npm run preview` first, then:
    python scripts/smoke_test.py http://localhost:4173/invoicenow/ <password>
Needs Python Playwright with Chromium (pip install playwright; playwright install chromium)."""
import sys
from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:4173/invoicenow/"
PASSWORD = sys.argv[2] if len(sys.argv) > 2 else "Password123"
errors = []

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
    page.on("pageerror", lambda e: errors.append(str(e)))
    page.on("dialog", lambda d: d.accept())

    page.goto(BASE + "tour/")
    page.wait_for_selector("h1:has-text('How EasyInvoice is built')")
    concepts = page.locator("article[data-concept]").count()
    assert concepts >= 11, f"expected 11+ concept cards on the tour, got {concepts}"
    print(f"0. public tour page renders {concepts} concept cards without login")

    page.goto(BASE, wait_until="networkidle")
    assert "/login" in page.url, f"expected redirect to login, got {page.url}"
    print("1. unauthenticated visit redirected to login:", page.url)

    page.fill("#username", "john")
    page.fill("#password", "wrong-password")
    page.click("button[type=submit]")
    page.wait_for_selector("text=Incorrect username or password")
    print("2. wrong password rejected")

    page.fill("#password", PASSWORD)
    page.click("button[type=submit]")
    page.wait_for_selector("text=Peppol Access Point connected")
    page.wait_for_selector("article", timeout=10000)
    n = page.locator("article").count()
    print(f"3. logged in, dashboard shows {n} invoice cards")
    assert n == 4, "expected 4 seed invoices"

    assert page.locator(".react-hint:visible").count() == 0, "hints should start hidden"
    page.click("button:has-text('Hints')")
    page.wait_for_selector(".react-hint", state="visible")
    shown = page.locator(".react-hint:visible").count()
    assert shown >= 8, f"expected many hint labels, got {shown}"
    page.wait_for_selector("text=React hints are on")
    page.click("button:has-text('Hints on')")
    page.wait_for_selector(".react-hint", state="hidden")
    print(f"3b. hints toggle shows {shown} React labels, then hides them again")

    assert page.url.endswith("/easyinvoice/"), f"dashboard URL should end with a slash, got {page.url}"
    page.wait_for_selector("text=Live FX", timeout=10000)
    page.wait_for_selector("li:has-text('USD')", timeout=15000)
    print("4. FX rates loaded from api.frankfurter.dev:", page.inner_text("li:has-text('USD')"))

    page.click("text=Customers")
    page.wait_for_selector("h1:has-text('Buyer directory')")
    page.wait_for_selector("article", timeout=10000)
    print(f"5. customers page shows {page.locator('article').count()} buyers")
    try:
        page.wait_for_selector("img.rounded-full", timeout=15000)
        print("   contacts loaded from randomuser.me")
    except Exception:
        print("   randomuser contacts did not load (network?)")

    page.click("text=Products")
    page.wait_for_selector("h1:has-text('Product and service catalogue')")
    page.wait_for_selector("article", timeout=10000)
    assert page.locator("article").count() == 8, "expected 8 catalogue items"
    page.click("article:has-text('SVC-TRAIN') >> text=Add to new invoice")
    page.wait_for_selector("h1:has-text('Create a Peppol e-invoice')")
    assert page.input_value("input[aria-label='Item 1 description']") == "On-site Staff Training (half day)"
    assert page.input_value("input[aria-label='Item 1 unit price']") == "900"
    print("5b. products page shows 8 items; 'Add to new invoice' prefills the first line")

    page.click("text=Customers")
    page.click("text=New e-invoice for this buyer >> nth=0")
    page.wait_for_selector("h1:has-text('Create a Peppol e-invoice')")
    assert page.input_value("#buyerUEN") == "202012345E", "UEN not prefilled from customers page"
    print("6. create page prefilled from customers page")

    page.wait_for_selector("select[aria-label='Item 1 product']:not([disabled])", timeout=10000)
    page.select_option("select[aria-label='Item 1 product']", "HW-GPS")
    assert page.input_value("input[aria-label='Item 1 description']") == "Enterprise Fleet GPS Tracking Unit"
    assert page.input_value("input[aria-label='Item 1 unit price']") == "250"
    page.fill("input[aria-label='Item 1 quantity']", "2")
    page.wait_for_selector("text=Total due: $545.00 SGD")
    print("6b. product dropdown filled description and price; totals recomputed")
    page.click("button:has-text('Transmit via Peppol')")
    page.wait_for_selector("text=transmitted via the Peppol network", timeout=10000)
    page.wait_for_selector("text=INV-2026-005")
    print("7. new invoice INV-2026-005 created and transmitted; cards:", page.locator("article").count())

    page.click("article:has-text('INV-2026-005') >> button:has-text('Mark paid')")
    page.wait_for_selector("article:has-text('INV-2026-005') >> :not(.react-hint):text-is('Paid')")
    print("8. marked paid")

    page.click("article:has-text('INV-2026-005') >> button:has-text('Edit')")
    page.wait_for_selector("h1:has-text('Edit invoice INV-2026-005')")
    page.fill("#buyerName", "Edited Buyer Pte Ltd")
    page.click("button:has-text('Save changes')")
    page.wait_for_selector("article:has-text('Edited Buyer Pte Ltd')")
    print("9. edited buyer name persisted")

    page.click("article:has-text('INV-2026-005') >> button:has-text('Delete')")
    page.wait_for_selector("text=deleted")
    assert page.locator("article:has-text('INV-2026-005')").count() == 0
    print("10. deleted; cards:", page.locator("article").count())

    page.fill("input[aria-label='Search invoices']", "marina")
    assert page.locator("article").count() == 1
    page.fill("input[aria-label='Search invoices']", "")
    page.click("button:has-text('Failed')")
    assert page.locator("article").count() == 1
    print("11. search and status filter work")

    page.reload()
    page.wait_for_selector("article")
    print("12. after reload still logged in at", page.url, "cards:", page.locator("article").count())

    page.goto(BASE + "customers/")
    page.wait_for_selector("h1:has-text('Buyer directory')")
    page.goto(BASE + "edit/?id=INV-2026-002")
    page.wait_for_selector("h1:has-text('Edit invoice INV-2026-002')")
    page.goto(BASE)
    page.wait_for_selector("article")
    print("12b. deep links to /customers/ and /edit/?id= resolve")

    page.click("button:has-text('Logout')")
    page.wait_for_url("**/login**")
    print("13. logout returns to login")

    browser.close()

print("CONSOLE ERRORS:", errors if errors else "none")
print("SMOKE TEST PASSED")
