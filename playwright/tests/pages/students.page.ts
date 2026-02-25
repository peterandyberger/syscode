import { Page, Locator } from 'playwright';

export class StudentsPage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly emailError: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(private page: Page) {
    this.nameInput = page.getByTestId('student-name');
    this.emailInput = page.getByTestId('student-email');
    this.emailError = page.getByTestId('email-error');
    this.saveButton = page.getByTestId('student-save');
    this.cancelButton = page.getByTestId('student-cancel');
  }

  async fillForm(name: string, email: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
  }

  async submit() {
    await this.saveButton.click();
  }

  studentRow(name: string) {
    return this.page.locator('li').filter({ hasText: name });
  }

  editButton(name: string) {
    return this.studentRow(name).locator('[data-testid^="edit-"]');
  }

  deleteButton(name: string) {
    return this.studentRow(name).locator('[data-testid^="delete-"]');
  }

  detailsButton(name: string) {
    return this.studentRow(name).locator('[data-testid^="details-"]');
  }
}
