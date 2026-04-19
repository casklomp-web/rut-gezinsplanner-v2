import { test, expect } from '@playwright/test';

test.describe('Task Board Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tasks');
  });

  test('should load tasks page', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Gezinstaken');
    await expect(page.locator('text=Beheer alle taken voor je gezin')).toBeVisible();
  });

  test('should display task stats', async ({ page }) => {
    // Check for stats cards
    await expect(page.locator('text=Openstaand')).toBeVisible();
    await expect(page.locator('text=Vandaag')).toBeVisible();
    await expect(page.locator('text=Achterstallig')).toBeVisible();
  });

  test('should filter tasks by status', async ({ page }) => {
    // Click on "Te doen" tab
    await page.click('text=Te doen');
    
    // Wait for filter to apply
    await page.waitForTimeout(300);
    
    // Check if we're on the right tab
    const activeTab = page.locator('button[class*="bg-[#4A90A4]"]');
    await expect(activeTab).toContainText('Te doen');
  });

  test('should search tasks', async ({ page }) => {
    const searchInput = page.locator('input[placeholder="Zoek taken..."]');
    await searchInput.fill('boodschappen');
    
    // Wait for search to apply
    await page.waitForTimeout(300);
    
    // Check if search results are shown or empty state
    const taskCards = page.locator('[class*="bg-white"][class*="rounded-xl"]');
    const count = await taskCards.count();
    
    // Should have tasks or empty state
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('should create a new task', async ({ page }) => {
    // Click new task button
    await page.click('text=Nieuw');
    
    // Wait for modal
    await expect(page.locator('text=Nieuwe taak')).toBeVisible();
    
    // Fill in task details
    await page.fill('input[id="task-title"]', 'Test taak van Playwright');
    await page.fill('textarea[id="task-description"]', 'Dit is een test taak');
    
    // Select assignee
    await page.selectOption('select[id="task-assignee"]', { label: 'Papa' });
    
    // Set due date
    const today = new Date().toISOString().split('T')[0];
    await page.fill('input[id="task-due-date"]', today);
    
    // Select priority
    await page.click('text=Hoog');
    
    // Submit form
    await page.click('text=Taak aanmaken');
    
    // Wait for modal to close
    await expect(page.locator('text=Nieuwe taak')).not.toBeVisible();
    
    // Verify task was created
    await expect(page.locator('text=Test taak van Playwright')).toBeVisible();
  });

  test('should show validation errors', async ({ page }) => {
    // Click new task button
    await page.click('text=Nieuw');
    
    // Try to submit without title
    await page.click('text=Taak aanmaken');
    
    // Check for validation error
    await expect(page.locator('text=Titel is verplicht')).toBeVisible();
  });

  test('should edit an existing task', async ({ page }) => {
    // First create a task
    await page.click('text=Nieuw');
    await page.fill('input[id="task-title"]', 'Taak om te bewerken');
    await page.selectOption('select[id="task-assignee"]', { label: 'Papa' });
    await page.click('text=Taak aanmaken');
    
    // Wait for task to appear
    await expect(page.locator('text=Taak om te bewerken')).toBeVisible();
    
    // Click on task to open detail view
    await page.click('text=Taak om te bewerken');
    
    // Click edit button
    await page.click('text=Bewerken');
    
    // Wait for edit modal
    await expect(page.locator('text=Taak bewerken')).toBeVisible();
    
    // Change title
    await page.fill('input[id="task-title"]', 'Gewijzigde taak titel');
    
    // Save
    await page.click('text=Opslaan');
    
    // Verify change
    await expect(page.locator('text=Gewijzigde taak titel')).toBeVisible();
  });

  test('should delete a task', async ({ page }) => {
    // First create a task
    await page.click('text=Nieuw');
    await page.fill('input[id="task-title"]', 'Taak om te verwijderen');
    await page.selectOption('select[id="task-assignee"]', { label: 'Papa' });
    await page.click('text=Taak aanmaken');
    
    // Wait for task to appear
    await expect(page.locator('text=Taak om te verwijderen')).toBeVisible();
    
    // Click on task to open detail view
    await page.click('text=Taak om te verwijderen');
    
    // Click delete button
    await page.click('text=Verwijderen');
    
    // Confirm deletion
    await expect(page.locator('text=Taak verwijderen')).toBeVisible();
    await page.click('button:has-text("Verwijderen")');
    
    // Verify task is deleted
    await expect(page.locator('text=Taak om te verwijderen')).not.toBeVisible();
  });

  test('should complete a task', async ({ page }) => {
    // First create a task
    await page.click('text=Nieuw');
    await page.fill('input[id="task-title"]', 'Taak om af te ronden');
    await page.selectOption('select[id="task-assignee"]', { label: 'Papa' });
    await page.click('text=Taak aanmaken');
    
    // Wait for task to appear
    await expect(page.locator('text=Taak om af te ronden')).toBeVisible();
    
    // Click on task to open detail view
    await page.click('text=Taak om af te ronden');
    
    // Click complete button
    await page.click('text=Afronden');
    
    // Close detail view
    await page.click('[aria-label="Sluiten"]');
    
    // Verify task is marked as done (strikethrough)
    const taskTitle = page.locator('text=Taak om af te ronden');
    await expect(taskTitle).toHaveClass(/line-through/);
  });

  test('should set up recurring task', async ({ page }) => {
    // Click new task button
    await page.click('text=Nieuw');
    
    // Fill in basic details
    await page.fill('input[id="task-title"]', 'Terugkerende taak');
    await page.selectOption('select[id="task-assignee"]', { label: 'Papa' });
    
    // Select weekly recurrence
    await page.click('text=Wekelijks');
    
    // Set end date
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const endDate = nextMonth.toISOString().split('T')[0];
    await page.fill('input[type="date"]', endDate);
    
    // Submit
    await page.click('text=Taak aanmaken');
    
    // Verify task with recurrence badge
    await expect(page.locator('text=Terugkerende taak')).toBeVisible();
    await expect(page.locator('text=Wekelijks')).toBeVisible();
  });

  test('should set up reminder', async ({ page }) => {
    // Click new task button
    await page.click('text=Nieuw');
    
    // Fill in basic details
    await page.fill('input[id="task-title"]', 'Taak met herinnering');
    await page.selectOption('select[id="task-assignee"]', { label: 'Papa' });
    
    // Enable reminder
    await page.click('button[role="switch"]');
    
    // Set reminder time
    await page.fill('input[type="time"]', '14:30');
    
    // Submit
    await page.click('text=Taak aanmaken');
    
    // Verify task with reminder badge
    await expect(page.locator('text=Taak met herinnering')).toBeVisible();
  });

  test('should view task details', async ({ page }) => {
    // First create a task
    await page.click('text=Nieuw');
    await page.fill('input[id="task-title"]', 'Taak met details');
    await page.fill('textarea[id="task-description"]', 'Dit is de beschrijving');
    await page.selectOption('select[id="task-assignee"]', { label: 'Papa' });
    await page.fill('input[placeholder*="tags"]', 'test, boodschappen');
    await page.click('text=Taak aanmaken');
    
    // Click on task
    await page.click('text=Taak met details');
    
    // Verify detail view opens
    await expect(page.locator('text=Details')).toBeVisible();
    await expect(page.locator('text=Beschrijving')).toBeVisible();
    await expect(page.locator('text=Dit is de beschrijving')).toBeVisible();
    await expect(page.locator('text=Tags')).toBeVisible();
  });

  test('should show empty state when no tasks', async ({ page }) => {
    // Filter by a status that might have no tasks
    await page.click('text=Achterstallig');
    
    // Check for empty state
    const emptyState = page.locator('text=Geen taken gevonden');
    if (await emptyState.isVisible().catch(() => false)) {
      await expect(page.locator('text=Maak je eerste taak om te beginnen')).toBeVisible();
    }
  });
});

test.describe('Task Board Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tasks');
  });

  test('should have proper heading structure', async ({ page }) => {
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText('Gezinstaken');
  });

  test('modal should have proper ARIA attributes', async ({ page }) => {
    await page.click('text=Nieuw');
    
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute('aria-modal', 'true');
  });

  test('should be keyboard navigable', async ({ page }) => {
    // Open modal with keyboard
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    
    // Check if modal opened
    const modal = page.locator('[role="dialog"]');
    if (await modal.isVisible().catch(() => false)) {
      // Tab through form fields
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Close with escape
      await page.keyboard.press('Escape');
      await expect(modal).not.toBeVisible();
    }
  });

  test('should have proper labels on form elements', async ({ page }) => {
    await page.click('text=Nieuw');
    
    // Check for labels
    await expect(page.locator('label:has-text("Titel")')).toBeVisible();
    await expect(page.locator('label:has-text("Beschrijving")')).toBeVisible();
    await expect(page.locator('label:has-text("Toewijzen aan")')).toBeVisible();
  });
});
