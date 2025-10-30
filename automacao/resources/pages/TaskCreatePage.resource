*** Settings ***
Documentation            Ações e elementos da página de cadastro de tarefas

Library        Browser

*** Keywords ***
Submit task form
    [Arguments]        ${task}

    Fill Text    id=taskTitle           ${task}[title]
    Fill Text    id=taskDescription     ${task}[description]
    Select Options By    id=taskPriority    value    ${task}[priority]

    Click    css=button[type=submit] >> text=Salvar Tarefa

    