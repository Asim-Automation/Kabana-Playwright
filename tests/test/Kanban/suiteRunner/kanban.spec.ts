 import { expect, test } from "@playwright/test";

import {
  chooseCardToEdit,
  deleteKanbanCard,
  moveCardToFirstColumnAndObserve,
  navigateToBaseUrl,
  observeCardDelete,
  observeMainPage,
  toggleDarkMode,
  totatlCardsCount,
  updateOpenedKanbanCard,
  verifyDarkModeEnabled,
} from "../commonSteps/commonSteps";
test.describe(`Page - Kanban Subtasks`, () => {
  test.afterEach(async ({ page }) => {
    await page.close();
  });
  test("Test 1:- Edit a Kanban Card", async ({ page }) => {
    await test.step("Navigate to the Kanban app and observe the page", async () => {
      await navigateToBaseUrl(page);
      await observeMainPage(page)
    }); 
    await test.step("Choose a card with subtasks that are not completed and that is not in the first column", async () => {
      await chooseCardToEdit(page)
    });

    await test.step("Complete one subtask and observe subtasks count updated", async () => {
      await updateOpenedKanbanCard(page)
    });
 
    await test.step("Verify that the card moved to the correct column", async () => {
      await moveCardToFirstColumnAndObserve(page)
    });
  });

  test("Test 2:- Delete a Kanban card", async ({ page }) => {
    await test.step("Navigate to the Kanban app", async () => {
      await navigateToBaseUrl(page);
      await observeMainPage(page);
    });
    let deletedCard: string;
    const cardsCountBeforeDelete = await totatlCardsCount(page);
    await test.step("Delete a Kanban card", async () => {
      deletedCard = await deleteKanbanCard(page);
    });
    const cardsCountAfterDelete = await totatlCardsCount(page);
    await test.step("Verify that the card is no longer present", async () => {
      await observeCardDelete(page, deletedCard);
    });

    await test.step("Verify that the number of cards in the relevant column is updated", async () => {
      expect(cardsCountAfterDelete).not.toEqual(cardsCountBeforeDelete);
    });
  });

  test("Test 3:- Delete a Kanban card", async ({ page }) => {
    await test.step("Navigate to the Kanban app", async () => {
      await navigateToBaseUrl(page);
      await observeMainPage(page);
    });
    await test.step("Toggle dark mode", async () => {
      await  toggleDarkMode(page)
    });

    await test.step("Verify that the dark mode has changed", async () => {
      await verifyDarkModeEnabled(page)
    });
  });
});
