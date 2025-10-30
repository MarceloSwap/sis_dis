*** Settings ***
Documentation            Ações e elementos do cabeçalho do mark85

Library        String
Library        Browser

*** Keywords ***
User should be logged in
    [Arguments]        ${name}
                        
    Wait For Elements State        css=.tasks-section
    ...        visible        5

Go to task form
    Click    id=addTaskBtn