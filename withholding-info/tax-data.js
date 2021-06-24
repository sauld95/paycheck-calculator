import * as validity from "../components/validity.js"
import * as stateIncomeCalc from "../state-income-tax-calculation.js"

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


// Return the value from the given ID
const getOptionsValue = (elementID) => {
    return document.getElementById(elementID).value
}

// After submit retrieve ID from the options
const wageHandler = () => {
    validity.Validation("state", "remove", /\S/)
    const {taxInfo} = appData

    taxInfo.state = getOptionsValue('state');
    taxInfo.status = getOptionsValue('status');
    taxInfo.freq = getOptionsValue('frequency')
    taxInfo.fed_allowance = parseInt(getOptionsValue('fed-allowance'))
    taxInfo.state_allowance = parseInt(getOptionsValue('state-allowance'))

    // Taxes table: Change state withholding name and amount
    document.querySelector("#state-withhold-select").textContent = taxInfo.state

    const regularRate = document.querySelector(".earning-row-title").nextElementSibling.textContent
    if (regularRate != 0) {
        document.querySelector("#state-withhold").nextElementSibling.textContent = `$ ${stateIncomeCalc.stateWH(taxInfo.state).toFixed(2)}`
    }
}

// Connect to form after submit
const connectForm = (formId, formSubmitHandler) => {
    const form = document.getElementById(formId);
    form.addEventListener('change', formSubmitHandler);
}

connectForm("tax-info-frm", wageHandler)
