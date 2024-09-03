import { Page, expect } from "@playwright/test";
import "dotenv/config";
import { testLocators } from "../../../Locators/Locators";
import {
  extractDigitsFromString,
  extractTextWithRegex,
  waitforLocatorVisibility,
} from "../../../Utils/testUtils";

/**
 * Navigates to the base URL specified in the environment variables.
 * @param {Page} page - The Playwright Page object.
 */
export const navigateToBaseUrl = async (page: Page) => {
  await page.goto(process.env.BASE_URL || "");
};

/**
 * Verifies the main page elements' visibility, including the header, add task button, and heading.
 */
export const observeMainPage = async (page: Page) => {
  const header = page.locator("header");
  await expect(header).toBeVisible();

  // Check for the presence of the "Add New Task" button.
  const addNewTaskBtn = page
    .getByRole("button")
    .filter({
      has: page.getByText(testLocators.textLocators.addNewTask, {
        exact: true,
      }),
    })
    .first();
  await expect(addNewTaskBtn).toBeVisible();

  // Verify the main heading's visibility.
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
};

/**
 * Deletes the first Kanban card and returns its title.
 */
export const deleteKanbanCard = async (page: Page) => {
  // Select and click on the first card to delete.
  const selectCardToDelete = page
    .locator(testLocators.fragileLocators.selectSecondColumn)
    .first();
  const isCardAvailable = await waitforLocatorVisibility(
    page,
    selectCardToDelete
  );
  if (isCardAvailable) {
    await expect(selectCardToDelete).toBeVisible();
    await selectCardToDelete.click();
    // Open the card to observe its details.
    const observeOpenendCard = page
      .locator("div")
      .filter({ has: page.getByRole("heading", { level: 4 }).first() })
      .filter({ has: page.locator("svg").first() })
      .last();
    await expect(observeOpenendCard).toBeVisible();

    // Extract the card title.
    const cardTitle = observeOpenendCard
      .getByRole("heading", { level: 4 })
      .first();
    const cardTitleTxt = await cardTitle.innerText();

    // Click on the menu button and select delete option.
    const clickOnMenuBtn = observeOpenendCard.locator("svg").first();
    await expect(clickOnMenuBtn).toBeVisible();
    await clickOnMenuBtn.click();

    // Confirm the deletion action.
    await page
      .getByRole("paragraph")
      .filter({ hasText: testLocators.textLocators.deleteTxt })
      .click();
    await page
      .getByRole("button")
      .filter({ hasText: testLocators.textLocators.deleteTxt })
      .click();

    return cardTitleTxt;
  } else {
    return "";
  }
};

/**
 * Observes that a card with a specified title has been deleted.
 */
export const observeCardDelete = async (page: Page, cardTitle: string) => {
  const deletedCard = page.getByRole("article").filter({
    has: page.getByRole("heading", { name: cardTitle }).first(),
  });
  await expect(deletedCard).not.toBeVisible();
};

/**
 * Counts and returns the total number of Kanban cards.
 */
export const totatlCardsCount = async (page: Page) => {
  const totalCards = page
    .locator(testLocators.fragileLocators.columnTwo)
    .getByRole("heading", { level: 2 })
    .first();

  await expect(totalCards).toBeVisible();
  return extractDigitsFromString(await totalCards.innerText());
};

/**
 * Chooses a card to edit based on its subtask completion status.
 */
export const chooseCardToEdit = async (page: Page) => {
  const verifyKanbanCards = page.locator(
    testLocators.fragileLocators.selectSecondColumn
  );
  const paragraphDigitsExtractor = await verifyKanbanCards
    .getByRole("paragraph")
    .all();

  // Iterate through each paragraph to find a card with incomplete tasks.
  for (let paragraph of paragraphDigitsExtractor) {
    const paragraphText = await paragraph.innerText();
    const [completed, total] = extractDigitsFromString(paragraphText)?.map(
      Number
    ) || [0, 0];
    if (completed !== total) {
      await paragraph.click();
      return true;
    }
  }
};

/**
 * Toggles the dark mode setting on the page.
 */
export const toggleDarkMode = async (page: Page) => {
  const darkModeBtn = page.locator("label").first();
  await expect(darkModeBtn).toBeVisible();
  await darkModeBtn.click();
};

/**
 * Verifies that dark mode is enabled, then toggles it off and verifies again.
 */
export const verifyDarkModeEnabled = async (page: Page) => {
  await page.reload();
  const darkModeEnabled = page
    .locator(testLocators.classLocators.darkClass)
    .first();
  await expect(darkModeEnabled).toBeVisible();

  await toggleDarkMode(page);
  await page.reload();
  await expect(darkModeEnabled).not.toBeVisible();
};

/**
 * Updates an opened Kanban card's subtasks and verifies the change.
 */
export const updateOpenedKanbanCard = async (page: Page) => {
  const observeOpenendCard = page
    .locator("div")
    .filter({ has: page.getByRole("heading", { level: 4 }).first() })
    .filter({ has: page.locator("label").first() })
    .last();
  const isCardAvailable = await waitforLocatorVisibility(
    page,
    observeOpenendCard
  );
  if (isCardAvailable) {
    await expect(observeOpenendCard).toBeVisible();

    const subTasksAssigned = await observeOpenendCard
      .getByRole("paragraph")
      .filter({ hasText: testLocators.textLocators.subTaskTxt })
      .last()
      .innerText();
    const subTaskAssignedCount = extractDigitsFromString(subTasksAssigned);

    // Check for any unchecked subtasks and mark them as completed.
    const completeSubTask = await observeOpenendCard.locator("label").all();
    for (const task of completeSubTask) {
      if (!(await task.isChecked())) {
        await task.click();
        await expect(task.locator("span").first()).toHaveClass(/line-through/);
        return true;
      }
    }

    // Ensure the subtasks count is updated.
    const subtaskCountAfterAssigned = extractDigitsFromString(subTasksAssigned);
    expect(subTaskAssignedCount).not.toEqual(subtaskCountAfterAssigned);
  }
};

/**
 * Moves a card to the first column and observes the column count change.
 */
export const moveCardToFirstColumnAndObserve = async (page: Page) => {
  let columnCountAndName = await observeFirstColumnCardsCount(page);
  let columnCount = await extractDigitsFromString(columnCountAndName);
  let firstColumnName =
    (await extractTextWithRegex(columnCountAndName).charAt(0).toUpperCase()) +
    extractTextWithRegex(columnCountAndName).slice(1).toLowerCase();

  // Change the card's status to match the first column's status.
  const clickOnColumnStatus = page
    .locator("div")
    .filter({
      has: page.getByRole("paragraph").first().filter({
        hasText: testLocators.textLocators.currentStatusTxt,
      }),
    })
    .last();
  if (await waitforLocatorVisibility(page, clickOnColumnStatus)) {
    await expect(clickOnColumnStatus).toBeVisible();
    await clickOnColumnStatus.click();
    await page.getByText(firstColumnName).last().click();
    //   random click to close popup
    await page.mouse.click(500, 100);
    await page.waitForTimeout(3000);
    // Verify the column count increment.
    let columnCountAfterIncremented = extractDigitsFromString(
      await observeFirstColumnCardsCount(page)
    );
    expect(Number(columnCountAfterIncremented)).toBeGreaterThan(
      Number(columnCount)
    );
  }
};

/**
 * Observes and returns the card count and column name for the first column.
 */
export const observeFirstColumnCardsCount = async (page: Page) => {
  const observeColumnName = page
    .locator(testLocators.fragileLocators.sectionSelector)
    .first()
    .getByRole("heading", { level: 2 })
    .first();
  await expect(observeColumnName).toBeVisible();
  const columnCountAndName = await observeColumnName.innerText();
  return columnCountAndName;
};
