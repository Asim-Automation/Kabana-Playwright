import test, { Locator, Page } from "@playwright/test"

export function extractDigitsFromString(inputString: string) {
  // Use a regular expression to find all occurrences of one or more digits
  const matches = inputString.match(/\d+/g);
  // Convert the found string digits to integers
  return matches ? matches.map(Number) : [];
}

export function extractTextWithRegex(inputString) {
  const match = inputString.match(/^[A-Za-z\s]+/);
  return match ? match[0].trim() : '';
}

export const waitforLocatorVisibility = async (
  page: Page,
  locator: Locator,
) => {
  let i = 0;
  let checkLocator = false;
  while (i < 6) {
    if (await locator.isVisible()) {
      checkLocator = true;
      break;
    } else {
      checkLocator = false;
      i++;
    }
    await page.waitForTimeout(500);
  }
  return checkLocator;
}