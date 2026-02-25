Feature: Students API

  @api
  Scenario: List students
    When I GET "/students"
    Then the response is 200
    And the body is an array

  @api
  Scenario: Create a student
    When I POST "/students" with name "API New" and email "apinew@test.com"
    Then the response is 201

  @api
  Scenario: Update a student
    Given a student "API Edit" with email "apiedit@test.com" exists via API
    When I PUT the student with name "API Edited" and email "apiedited@test.com"
    Then the response is 200

  @api
  Scenario: Delete a student
    Given a student "API Delete" with email "apidelete@test.com" exists via API
    When I DELETE the student
    Then the response is 200

  @api
  Scenario: Get student with address
    Given a student "API Address" with email "apiaddress@test.com" exists via API
    When I GET the student with address
    Then the response is 200
    And the body has an "address" field
