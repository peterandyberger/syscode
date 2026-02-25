import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import type { TestWorld } from "../support/world";
import { StudentsPage } from "../pages/students.page";

Given(
  "a student {string} with email {string} exists",
  async function (this: TestWorld, name: string, email: string) {
    const res = await this.api.post("/students", { data: { name, email } });
    const student = await res.json();
    this.createdStudentIds.push(student.id);
    await this.page.reload();
    const ui = new StudentsPage(this.page);
    await expect(ui.studentRow(name)).toBeVisible();
  }
);

When(
  "I fill in {string} and email {string}",
  async function (this: TestWorld, name: string, email: string) {
    const ui = new StudentsPage(this.page);
    await ui.fillForm(name, email);
  }
);

When("I submit the form", async function (this: TestWorld) {
  const ui = new StudentsPage(this.page);
  await ui.submit();
});

When(
  "I click Edit for {string}",
  async function (this: TestWorld, name: string) {
    const ui = new StudentsPage(this.page);
    await ui.editButton(name).click();
  }
);

When(
  "I click Delete for {string}",
  async function (this: TestWorld, name: string) {
    const ui = new StudentsPage(this.page);
    await ui.deleteButton(name).click();
  }
);

When(
  "I click Details for {string}",
  async function (this: TestWorld, name: string) {
    const ui = new StudentsPage(this.page);
    await ui.detailsButton(name).click();
  }
);

When("I click Cancel", async function (this: TestWorld) {
  const ui = new StudentsPage(this.page);
  await ui.cancelButton.click();
});

Then(
  "{string} appears in the student list",
  async function (this: TestWorld, name: string) {
    const ui = new StudentsPage(this.page);
    await expect(ui.studentRow(name)).toBeVisible();
    // Track for cleanup — pick up the ID the server assigned
    const res = await this.api.get("/students");
    const students = await res.json();
    const student = students.find(
      (s: { name: string; id: string }) => s.name === name
    );
    if (student && !this.createdStudentIds.includes(student.id)) {
      this.createdStudentIds.push(student.id);
    }
  }
);

Given("I open the app", async function (this: TestWorld) {
  await this.page.goto("/");
});

Then(
  "{string} is no longer in the student list",
  async function (this: TestWorld, name: string) {
    const ui = new StudentsPage(this.page);
    await expect(ui.studentRow(name)).not.toBeVisible();
  }
);

Then("the Cancel button is visible", async function (this: TestWorld) {
  const ui = new StudentsPage(this.page);
  await expect(ui.cancelButton).toBeVisible();
});

Then("the Cancel button is not visible", async function (this: TestWorld) {
  const ui = new StudentsPage(this.page);
  await expect(ui.cancelButton).not.toBeVisible();
});

When("I click the email field", async function (this: TestWorld) {
  const ui = new StudentsPage(this.page);
  await ui.emailInput.click();
});

Then("I see an email error", async function (this: TestWorld) {
  const ui = new StudentsPage(this.page);
  await expect(ui.emailError).toBeVisible();
});

Then("I do not see an email error", async function (this: TestWorld) {
  const ui = new StudentsPage(this.page);
  await expect(ui.emailError).not.toBeVisible();
});

Then(
  "the address section for {string} loads",
  async function (this: TestWorld, name: string) {
    const ui = new StudentsPage(this.page);
    await expect(ui.studentRow(name).getByText("Loading...")).toBeHidden({
      timeout: 10000,
    });
  }
);
