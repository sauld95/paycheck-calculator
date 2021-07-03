import * as validity from "./components/validity.js"
import * as taxData from "./withholding-info/tax-data.js"
import * as withhold from "./withholding-info/tax-withholding-data.js"
import * as stateIncomeCalc from "./state-income-tax-calculation.js"
import * as classes from "./classes.js"

// On load, create initial row for Earning Table
document.addEventListener("DOMContentLoaded", () => {
    const mainRate = document.querySelector("#main-earning")
    
    const name = mainRate.name
    const week = mainRate.dataset.week

    const earning = new classes.Earning(name, week)
    classes.UI.createEarningList(earning)
})

//=========================================//
// On Submit for Table Update #earning-frm //
//=========================================//

// Submit new values to the Earning table
document.querySelector("#earning-frm").addEventListener("submit", e => {
    e.preventDefault()
    
    /* 
    Add "is-invalid" class if a state is not selected 
    or if main input (main-earning, main hours) is left empty or no integer is typed
    */
    validity.Validation("state", "add", "")
    validity.Validation("main-earning", "add", "", /[^0-9.]+/gi)
    validity.Validation("week-hours", "add", "", /[^0-9.]+/gi)

    // If class contains 'is-invalid', return 
    let mainEarning = document.querySelector("#main-earning")
    const weekHours = document.querySelector("#Week-hours")
    const state = document.querySelector("#state")
    if (mainEarning.classList.contains("is-invalid") || weekHours.classList.contains("is-invalid") || state.classList.contains("is-invalid")) {return}

    const wageForm = document.querySelector("#earning-frm")
    const inputs = Array.from(wageForm.querySelectorAll('input[type="text"]'))

    inputs.forEach(input => {
        // Set values to zero if value is empty or value is not numerical
        (!input.value || /[^0-9.]+/gi.test(input.value)) && (input.value = 0)
    })

    // Set Hours
    const hour1 = new classes.Hours(weekHours.name)
    hour1.setHours(parseFloat(weekHours.value))

    let weekendHours = undefined
    let hour2 = new classes.Hours("weekend-hours")

    try {
        weekendHours = document.querySelector("#weekend-hours")
        hour2 = new classes.Hours(weekendHours.name)
        hour2.setHours(parseFloat(weekendHours.value))
    } catch (err) {
        // ignore error
    }


    // Update values for the Earnings Table
    const rateGroup = Array.from(document.querySelectorAll(".rate-group"))

    rateGroup.forEach(pay => {
        const name = pay.name
        const week = pay.dataset.week
        const rate = parseFloat(pay.value)

        classes.UI.deleteEarning(name)

        const earning = new classes.Earning(name, week)
        earning.setRate(rate)
        const hours = earning.setHours(classes.Calc.getHours(week, hour1.hours, hour2.hours))

        classes.Calc.getAmount(rate, hours, earning)

        classes.UI.createEarningList(earning)
    })

    const {table, taxInfo, withholding} = taxData.appData
    const {threshold, percent} = withhold.FICA.Medicare
    

    //=================================//
    // Overtime Sub-Section for weekly //
    //=================================//

    // Check if hours exceed 40 hours and set or delete overtime
    if (hour1.hours > 40 && taxInfo.freq === "weekly") {
        classes.UI.deleteEarning('Overtime')
        
        let preAmount = classes.Calc.totalAmount(".earning-row-amount")

        const overtime = new classes.Earning('Overtime', 'ot-days')
        const rate = classes.Calc.overtimeRate(preAmount, hour1.hours)
        const hours = overtime.setHours(classes.Calc.getHours('Overtime', hour1.hours, hour2.hours))

        overtime.setRate(rate)
        classes.Calc.getAmount(rate, hours, overtime)

        classes.UI.createOvertimeList(overtime)
    } else {
        classes.UI.deleteEarning('Overtime')
    }

    /* 
    Get final total amount for the earning table
    Set total amount in tax-data.js and the Total in the earning table
    */

    table.earning_total = classes.Calc.totalAmount(".earning-row-amount")
    document.querySelector("#earning-tbl-total").nextElementSibling.textContent = `$ ${table.earning_total.toFixed(2)}`

    //=======================//
    // Tax Table Sub-Section //
    //=======================//
    
    // Update FICA Social Security table
    withholding.social = classes.Calc.social(table.earning_total)
    document.querySelector("#fica-social").nextElementSibling.textContent = `$ ${withholding.social.toFixed(2)}`

    // Update FICA Medicare table
    // TODO: Medicare: Move code to Calc.medicare function
    if (withholding.medicare.addSurtax) {
        // Useless code for now. Add dates for end of year pay period total
        const addlAmount = table.earning_total - threshold[taxInfo.status]
        // finish later
    }

    withholding.medicare.amount = table.earning_total * percent.regular
    document.querySelector("#fica-medicare").nextElementSibling.textContent = `$ ${withholding.medicare.amount.toFixed(2)}`

    // Update State Withholding
    withholding.stateWH = stateIncomeCalc.stateWH(taxInfo.state)
    document.querySelector("#state-withhold").nextElementSibling.textContent = `$ ${withholding.stateWH.toFixed(2)}`

    //Update Federal Withholding
    withholding.federalWH = stateIncomeCalc.fedWH(taxInfo.freq, table.earning_total, taxInfo.status)
    document.querySelector("#fed-withhold").nextElementSibling.textContent = `$ ${withholding.federalWH.toFixed(2)}`

    /* 
    Get final total amount for the tax table
    Set total amount in tax-data.js and the Total in the tax table
    */
    table.tax_total = classes.Calc.totalAmount(".tax-row-amount")
    document.querySelector("#tax-tbl-total").nextElementSibling.textContent = `$ ${table.tax_total.toFixed(2)}`
    
    //===========================//
    // Summary Table Sub-Section //
    //===========================//

    let gross = document.querySelector("#gross")
    let taxable = document.querySelector("#taxable")
    let taxes = document.querySelector("#taxes")
    let net = document.querySelector("#net")

    gross.textContent = `$ ${table.earning_total.toFixed(2)}`
    taxable.textContent = `$ ${table.earning_total.toFixed(2)}`
    taxes.textContent = `$ ${table.tax_total}`
    table.net_total = table.earning_total - table.tax_total
    net.textContent = `$ ${table.net_total.toFixed(2)}`

    classes.UI.clearFields()
    console.log(taxData.appData)
})

// Remove "is-invalid" class after correct value is typed
document.querySelector("#earning-frm").addEventListener("input", () => {
    validity.Validation("main-earning", "remove", /^[0-9]+\.?[0-9]?[0-9]?/g)
    validity.Validation("week-hours", "remove", /^[0-9]+\.?[0-9]?[0-9]?/g)
})

//==========================================//
// On Change for Table Update #tax-info-frm //
//==========================================//

document.querySelector("#tax-info-frm").addEventListener("change", () => {
    const getOptionsValue = (elementID) => {
        return document.getElementById(elementID).value
    }

    validity.Validation("state", "remove", /\S/)
    const {taxInfo, table} = taxData.appData

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
        document.querySelector("#fed-withhold").nextElementSibling.textContent = `$ ${stateIncomeCalc.fedWH(taxInfo.freq, table.earning_total, taxInfo.status).toFixed(2)}`
    
        /* 
        Get final total amount for the tax table
        Set total amount in tax-data.js and the Total in the tax table
        */
        table.tax_total = classes.Calc.totalAmount(".tax-row-amount")

        document.querySelector("#tax-tbl-total").nextElementSibling.textContent = `$ ${table.tax_total.toFixed(2)}`
    
        let taxes = document.querySelector("#taxes")
        let net = document.querySelector("#net")

        taxes.textContent = `$ ${table.tax_total}`
        net.textContent = `$ ${(table.earning_total - table.tax_total).toFixed(2)}`
    }

    //=============================//
    // Manual Overtime Sub-Section //
    //=============================//

    // Include overtime hours input for pay periods that are not weekly
    if (taxInfo.freq !== "weekly" || taxInfo.freq !== "daily") {
        // TODO: Set a manual overtime input for other pay paeriods besids weekly
        // TODO: first move all class from app.js to it's own file for easier access
    }
})

//===============//
// Init New Rate //
//===============//

// Begin creating a new rate 
document.querySelector("#add-pay").addEventListener("click", () => {
    classes.CreateInput.createOptionsRate()

    document.querySelector("#add-pay").disabled = true
    document.querySelector("#calculate").disabled = true

})

//==========//
// 1st Step //
//==========//

document.querySelector("#rate-input").addEventListener("change", () => {
    const option = document.querySelector("#rate-input").firstElementChild
    let {create_input} = taxData.appData.class
    
    // Initialize CreateInput class
    switch (option.value) {
        case "everyday":
        case "weekday":
            create_input.setWeek(option.value)
            break;
        case "weekend":
            create_input.setWeek(option.value)
            let {weekend_hours} = taxData.appData.class
            // Check if weekend hours does not exist and create weekend hours
            if (!weekend_hours.week) {
                weekend_hours.setWeek("weekend-hours")
                weekend_hours.setName("hours")
                weekend_hours.placeholder = "Weekend Hours"

                weekend_hours.createWeekendHours()
            }
            break;
    }

    // remove elements within the div #rate-input and switch to div #name-input
    option.remove()
    document.querySelector("#rate-input").classList.remove("input-group", "me-2")
    classes.CreateInput.createNameInput()
    
})

//==========//
// 2nd Step //
//==========//

document.querySelector("#name-input").addEventListener("click", e => {
    if (e.target.id !== "enter-name") {return}

    // Check for entered value. Return if value is invalid
    const newName = document.querySelector("#new-name")
    newName.addEventListener("input", () => validity.Validation("new-name", "remove", /\w/))
    validity.Validation("new-name", "add", "")
    if (!newName.value) {return}

    let letterCase = newName.value.charAt(0).toUpperCase() + newName.value.slice(1).toLowerCase();

    // Prevent named duplicates 
    if (classes.UI.preventDuplicate(letterCase)) {return}

    let {create_input} = taxData.appData.class

    // Value entered
    create_input.setName(letterCase)
    create_input.setPlaceholder(letterCase)

    // remove elements within the div #name-input after clicking enter
    const nameInput = document.querySelector("#name-input")
    Array.from(nameInput.children).forEach(child => child.remove())
    nameInput.classList.remove("input-group", "me-2")

    // Create the new rate and add it to the table
    create_input.finalizeNewRate(create_input.week)

    const earning = new classes.Earning(create_input.name, create_input.week)
    classes.UI.createEarningList(earning)

    document.querySelector("#add-pay").disabled = false
    document.querySelector("#calculate").disabled = false
})

// Delete Rate
document.querySelector("#earning-frm").addEventListener("click", e => {
    classes.CreateInput.deleteInput(e)
    // TODO: update total after input is deleted 
})