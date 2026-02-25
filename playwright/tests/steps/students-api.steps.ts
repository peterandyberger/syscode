import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import type { TestWorld } from '../support/world';

Given('a student {string} with email {string} exists via API', async function (this: TestWorld, name: string, email: string) {
  const res = await this.api.post('/students', { data: { name, email } });
  const student = await res.json();
  this.lastStudentId = student.id;
  this.createdStudentIds.push(student.id);
});

When('I GET {string}', async function (this: TestWorld, path: string) {
  this.lastResponse = await this.api.get(path);
});

When('I POST {string} with name {string} and email {string}', async function (this: TestWorld, path: string, name: string, email: string) {
  this.lastResponse = await this.api.post(path, { data: { name, email } });
  if (this.lastResponse.ok()) {
    const body = await this.lastResponse.json();
    if (body?.id) this.createdStudentIds.push(body.id);
  }
});

When('I PUT the student with name {string} and email {string}', async function (this: TestWorld, name: string, email: string) {
  this.lastResponse = await this.api.put(`/students/${this.lastStudentId}`, { data: { name, email } });
});

When('I DELETE the student', async function (this: TestWorld) {
  this.lastResponse = await this.api.delete(`/students/${this.lastStudentId}`);
  this.createdStudentIds = this.createdStudentIds.filter(id => id !== this.lastStudentId);
});

When('I GET the student with address', async function (this: TestWorld) {
  this.lastResponse = await this.api.get(`/students/${this.lastStudentId}/with-address`);
});

Then('the response is {int}', async function (this: TestWorld, status: number) {
  expect(this.lastResponse!.status()).toBe(status);
});

Then('the body is an array', async function (this: TestWorld) {
  const body = await this.lastResponse!.json();
  expect(Array.isArray(body)).toBeTruthy();
});

Then('the body has an {string} field', async function (this: TestWorld, field: string) {
  const body = await this.lastResponse!.json();
  expect(body).toHaveProperty(field);
});
