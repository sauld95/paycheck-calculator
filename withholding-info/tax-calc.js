import * as validity from "../components/validity.js"

export const appData = {
    hours: {
        week_hours: 0,
        weekend_hours: 0,
        weekday_hours: 0,
        overtime_hours: 0
    },
    table: {
        earning_total: 0,
        tax_total: 0,
        net_total: 0,
        week_hours: 0,
        weekend_hours: 0
    },
    taxInfo: {
        state: '',
        status: '',
        freq: '',
        fed_allowance: 0,
        state_allowance: 0
    },
    withholding: {
        federalWH: {

        },
        stateWH: {

        },
        social: 0,
        medicare: {
            amount: 0,
            addSurtax: false,
        }
    }
}


// Get any ID from the <option> tag
const getOptionsValue = (elementID) => {
    return document.getElementById(elementID).value
}

// After submit retrieve ID from the options
const wageHandler = () => {
    validity.Validation("state", "remove", /\S/)
    const D = appData.taxInfo

    D.state = getOptionsValue('state');
    D.status = getOptionsValue('status');
    D.freq = getOptionsValue('frequency')
    D.fed_allowance = parseInt(getOptionsValue('fed-allowance'))
    D.state_allowance = parseInt(getOptionsValue('state-allowance'))

    document.querySelector("#state-withhold-select").textContent = D.state

}

// Connect to form after submit
const connectForm = (formId, formSubmitHandler) => {
    const form = document.getElementById(formId);
    form.addEventListener('change', formSubmitHandler);
}

connectForm("tax-info-frm", wageHandler)
