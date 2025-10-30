*** Settings ***
Documentation            Ações e elementos da página de listagem de tarefas

Library        Browser

*** Keywords ***
Task should be registered
    [Arguments]        ${task_name}

    Wait For Elements State     css=.task-title >> text=${task_name}
    ...        visible        5

Task should be complete
    [Arguments]        ${task_name}

    Wait For Elements State     css=.task-item.completed >> text=${task_name}
    ...        visible        5

Mark task as completed
    [Arguments]        ${task_name}

    Click        css=button >> text=Concluir

Request removal
    [Arguments]        ${task_name}

    Click        css=button >> text=Excluir
    # Confirmar exclusão se houver dialog
    Sleep    1s

Task should not exist
    [Arguments]        ${task_name}

    Sleep    2s
    ${count}    Get Element Count    css=.task-title >> text=${task_name}
    Should Be Equal As Numbers    ${count}    0