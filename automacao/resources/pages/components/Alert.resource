*** Settings ***
Documentation            Ações e elementos do componente de mensagens de alertas

Library        Browser

*** Keywords ***
Alert should be
    [Arguments]        ${expected_text}

    Wait For Elements State    css=.toast.error >> text=${expected_text}
    ...        visible        5