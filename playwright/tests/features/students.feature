Feature: Students

  Background:
    Given I open the app

  @ui
  Scenario: Create a new student
    When I fill in "UI Student" and email "ui@test.com"
    And I submit the form
    Then "UI Student" appears in the student list

  @ui
  Scenario: Edit a student
    Given a student "Edit Me" with email "editme@test.com" exists
    When I click Edit for "Edit Me"
    And I fill in "Edited Name" and email "edited@test.com"
    And I submit the form
    Then "Edited Name" appears in the student list

  @ui
  Scenario: Delete a student
    Given a student "Delete Me" with email "deleteme@test.com" exists
    When I click Delete for "Delete Me"
    Then "Delete Me" is no longer in the student list

  @ui
  Scenario: Cancel editing
    Given a student "Cancel Test" with email "cancel@test.com" exists
    When I click Edit for "Cancel Test"
    Then the Cancel button is visible
    When I click Cancel
    Then the Cancel button is not visible

  @ui
  Scenario: View student address details
    Given a student "Detail Test" with email "detail@test.com" exists
    When I click Details for "Detail Test"
    Then the address section for "Detail Test" loads
