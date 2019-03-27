Feature: Partner listing

  LVConnect should provide a way to display a list of partners with possibility to
  add, edit and delete them.

  Scenario: Access list as tech partner
    Given I'm using fresh database
    And I'm logged as "benjamin.delamarre@link-value.fr"

    When I visit the "partner list" page
    Then page should contain "3" "partner list row"
    And I should read "DELAMARREBenjamin" in "partner list row" number "2"
    And page should contain "0" "partner add button"

    When I type "Van" in "partner list search"
    Then page should contain "1" "partner list row"
    And I should read "ROYVanessa" in "partner list row" number "1"

  Scenario: Add partner minimal
    Given I'm using fresh database
    And I'm logged as "vanessa.roy@link-value.fr"

    When I visit the "partner list" page
    And I click the "partner add button"
    Then I should be on "partner add" page

    When I type "Mathieu" in "partner first name input"
    And I type "Tudisco" in "partner last name input"
    And I type "mathieu.tudisco@link-value.fr" in "partner email input"
    And I click the "partner add submit"
    Then I should be on "partner list" page
    And page should contain "4" "partner list row"
    And I should read "TUDISCOMathieu" in "partner list row" number "4"

  Scenario: Add partner full informations
    Given I'm using fresh database
    And I'm logged as "vanessa.roy@link-value.fr"

    When I visit the "partner list" page
    And I click the "partner add button"
    Then I should be on "partner add" page

    When I type "Admin" in "partner first name input"
    And I type "Admin" in "partner last name input"
    And I type "admin@link-value.fr" in "partner email input"
    And I click "partner role checkbox" number "1"
    And I click "partner role checkbox" number "2"
    And I click "partner role checkbox" number "4"
    And I click "partner role checkbox" number "5"
    And I click "partner role checkbox" number "6"
    And I click "partner role checkbox" number "7"
    And I click "partner role checkbox" number "8"
    And I click "partner city radio" number "3"
    And I select "front" in "partner job select"
    And I type "10 Rue Laurencin" in "partner address input"
    And I type "69300" in "partner zip code input"
    And I type "Lyon" in "partner city input"
    And I type "2018-01-01" in "partner hired at input"
    And I type "2019-01-01" in "partner left at input"
    And I type "1992-01-01" in "partner birth date input"
    And I type "1234567890" in "partner registration number input"
    And I type "Lorem ipsum dolor sit amet" in "partner description input"
    And I click the "partner add submit"
    Then I should be on "partner list" page
    And page should contain "4" "partner list row"
    And I should read "ADMINAdminParisFrontendTech, Executif" in "partner list row" number "1"
    And "partner list row" number "1" should have CSS property "opacity" with value "0.5"

  Scenario: Edit partner
    Given I'm using fresh database
    And I'm logged as "vanessa.roy@link-value.fr"

    When I visit the "partner list" page
    Then I should read "DELAMARREBenjaminLyonTech" in "partner list row" number "2"
    And I click on "partner list row" number "2"
    Then I should be on "partner edit" page
    And "partner email input" should be disabled

    When I select "front" in "partner job select"
    And I click the "partner edit submit"
    Then I should be on "partner list" page
    Then I should read "DELAMARREBenjaminLyonFrontendTech" in "partner list row" number "2"

  Scenario: Delete partner
    Given I'm using fresh database
    And I'm logged as "vanessa.roy@link-value.fr"

    When I visit the "partner list" page
    Then page should contain "3" "partner list row"

    When I click on "partner list row" number "2"
    And I click the "partner delete button"
    Then I should see "partner delete dialog"

    When I click the "partner delete submit"
    Then I should be on "partner list" page
    And page should contain "2" "partner list row"

  Scenario: Edit without permissions
    Given I'm using fresh database
    And I'm logged as "benjamin.delamarre@link-value.fr"

    When I visit the "partner list" page
    And I click on "partner list row" number "1"
    Then I should be on "partner list" page

    When I visit the "partner edit" page
    And I select "front" in "partner job select"
    And I click on "partner edit submit"
    Then I should be on "partner edit" page

    When I visit the "partner list" page
    Then I should read "DELAMARREBenjaminLyonTech" in "partner list row" number "2"
