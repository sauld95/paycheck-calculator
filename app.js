import * as validity from "./components/validity.js"
import * as taxCalc from "./withholding-info/tax-calc.js"
import * as withhold from "./withholding-info/tax-withholding-data.js"
import * as stateIncomeCalc from "./state-income-tax-calculation.js"

class Earning {
    constructor (name, week) {
        this.name = name
        this.week = week
        this.rate = 0
        this.hours = 0
        this.amount = 0
    }
    setRate(rate) {
        return this.rate = `$ ${rate.toFixed(2)}`
    }
    setHours(hours) {
        return this.hours = hours
    }
    setAmount(amount) {
        return this.amount = `$ ${amount.toFixed(2)}`
    }
}

// Used for rates and new weekend hour
class CreateInput {
    constructor(week) {
        this.week = week
        this.name = ''
        this.classArray = ["form-control", "me-sm-2"]
        this.placeholder = ''
    }
    setName(name) {
        return this.name = name
    }
    setPlaceholder(placeholder) {
        return this.placeholder = `${placeholder} rate`
    }
    static createOptionsRate() {
        document.querySelector("#rate-input").classList.add("input-group", "me-2")

        const select = document.createElement("select")
        select.classList.add("form-select")
        select.setAttribute("aria-label", "Default select example")

        select.innerHTML = `
        <option value="select" selected>--Select Rate--</option>
        <option value="allday">All Day</option>
        <option value="weekday">Weekday</option>
        <option value="weekend">Weekend</option>
        `

        document.querySelector("#rate-input").appendChild(select)
    }
    static createNameInput() {
        document.querySelector("#name-input").classList.add("input-group", "me-2")
        // Create input
        const input = document.createElement("input")
        input.setAttribute("type", "text")
        input.classList.add("form-control")
        input.setAttribute("placeholder", "Name the rate")
        input.setAttribute("id", "new-name")
        input.setAttribute("aria-label", "Name the rate")
        input.setAttribute("aria-describedby", "enter-name")

        // Create button
        const btn = document.createElement("button")
        const txt = document.createTextNode("Enter")

        btn.appendChild(txt)

        btn.classList.add("btn", "btn-secondary")
        btn.setAttribute("type", "button")
        btn.setAttribute("id", "enter-name")

        // Append
        document.querySelector("#name-input").appendChild(input)
        document.querySelector("#name-input").appendChild(btn)
    }

    finalizeNewRate(week) {
        // Creat span
        const span = document.createElement("span")
        span.classList.add("label-rate")
        switch (week) {
            case "allday":
                span.setAttribute("title", "All day rate")
                span.classList.add("A")
                break;
            case "weekday":
                span.setAttribute("title", "Weekday rate")
                span.classList.add("D")
                break;
            case "weekend":
                span.setAttribute("title", "Weekend rate")
                span.classList.add("E")
                break;
        }

        span.classList.add("input-group-text")

        const input = document.createElement("input")
        input.setAttribute("type", "text")
        input.setAttribute("name", this.name)
        input.classList.add(...this.classArray, "rate-group")
        input.setAttribute("data-week", this.week)
        input.setAttribute("placeholder", this.placeholder)

        // Create div
        const div = document.createElement("div")
        div.classList.add("input-group")

        div.appendChild(span)
        div.appendChild(input)

        const parent = document.querySelector("#earning-frm")
        const reference = document.querySelector("#rate-input")

        parent.insertBefore(div, reference)
    }

    createWeekendHours() {
        const input = document.createElement("input")

        input.setAttribute("type", "text")
        input.setAttribute("name", this.name)
        input.classList.add(...this.classArray)
        input.setAttribute("id", this.week)
        input.setAttribute("placeholder", this.placeholder)

        const parent = document.querySelector("#earning-frm")
        const reference = document.querySelector("#calculate")

        parent.insertBefore(input, reference)
    }

    static deleteInput(el) {
        if (el.target.classList.contains("label-rate")) {
            // Remove input 
            el.target.parentElement.remove()
            UI.deleteEarning(el.target.nextSibling.name)

            // if weekend rate count is equal to 0, delete weekend hours
            const rateGroup = Array.from(document.querySelectorAll(".rate-group"))

            const count = rateGroup.filter(rate => rate.dataset.week === "weekend").length
            
            if (count === 0 && document.querySelector("#weekend-hours") !== null) {
                document.querySelector("#weekend-hours").remove()
                weekendHours = null
            }
        }
    }

}

class Hours {
    constructor (name) {
        this.name = name
        this.hours = 0
    }
    setHours(hours) {
        return this.hours = hours
    }
}

// UI Functionality
class UI {
   static createEarningList(earning) {
       const earningList = document.querySelector("#earning-tbl-list")
       const row = document.createElement("tr")

       row.innerHTML = `
        <th scope="row" class="earning-row-title">${earning.name}</th>
        <td>${earning.rate}</td>
        <td>${earning.hours}</td>
        <td>${earning.amount}</td>
       `

       earningList.appendChild(row)
    }
    static createOvertimeList(earning) {
        const earningList = document.querySelector("#earning-tbl-list")
        const row = document.createElement("tr")
 
        row.innerHTML = `
         <th scope="row" class="earning-row-title">${earning.name}</th>
         <td>${earning.rate}</td>
         <td>${earning.hours}</td>
         <td>${earning.amount}</td>
        `

        const firstTitle = document.querySelector(".earning-row-title").parentElement.nextElementSibling
 
        earningList.insertBefore(row, firstTitle)
     }

   static deleteEarning(name) {
        const earningList = Array.from(document.querySelectorAll(".earning-row-title"))
        earningList.forEach(earn => {
            if (earn.textContent === name) {
                earn.parentElement.remove()
            }
        })
    }
    static preventDuplicate(name) {
        let boolean = false
        const earningList = Array.from(document.querySelectorAll(".earning-row-title"))
            earningList.forEach(earn => {
                if (earn.textContent === name) {
                    boolean = true
                }
        })
        return boolean
    }
    static clearFields() {
        const wageForm = document.querySelector("#earning-frm")
        const inputs = Array.from(wageForm.querySelectorAll('input[type="text"]'))
        inputs.forEach(input => input.value = "")
    }

    // https://getbootstrap.com/docs/5.0/forms/input-group/#button-addons
}

// Calculations
class Calc {
    static getHours(week, hour1, hour2) {
        let value = 0;

        switch (week) {
            case 'main-earning':
            case 'allday':
                value = hour1
                break;
            case 'weekday':
                value = parseFloat((hour1 - hour2).toFixed(2))
                break;
            case 'weekend':
                value = hour2
                break;
            case 'overtime':
                value = parseFloat((hour1 - 40).toFixed(2))
                break;
        }
        return value
    }
    static overtimeRate(amount, hours) {
        return (amount / hours) * 0.5
    }
    static getAmount(rate, hours, object) {
        return object.setAmount((rate * hours))
    }
    static totalAmount() {
        const earningList = Array.from(document.querySelectorAll(".earning-row-title"))
        const regex = /[0-9]+.[0-9]{1,2}/
        let amountArr = earningList.map(earn => parseFloat(earn.parentElement.lastElementChild.textContent.match(regex)[0]))
        
        return parseFloat((amountArr.reduce((total, sum) => {return total + sum})).toFixed(2))
    }
    static federal(frequency, totalWage, status) {
        const period = withhold.Federal[frequency]
        let lessThanWageAmt = 0
        let taxPercent = 0
        let tentativeAmt = 0

        period[status][0].forEach((amount, i) => {
            if (amount > totalWage) {
                return
            } else {
                lessThanWageAmt = amount
                taxPercent = withhold.Federal.taxBracket[i]
                tentativeAmt = period[status][1][i]
            }
        })

        return ((totalWage - lessThanWageAmt) * taxPercent) + tentativeAmt
    }
    static medicare() {

    }
    static social(totalWage) {
        let { social } = taxCalc.appData.withholding
        const { percent } = withhold.FICA.Social
        
        return social = totalWage * percent
    }
}

//================//
// Event Listener //
//================//

// On load, create initial row for Earning Table
document.addEventListener("DOMContentLoaded", () => {
    const mainRate = document.querySelector("#main-earning")
    
    const name = mainRate.name
    const week = mainRate.dataset.week
        
    const earning = new Earning(name, week)
    UI.createEarningList(earning)
})

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
    const stateInput = document.querySelector("#state")
    if (mainEarning.classList.contains("is-invalid") || weekHours.classList.contains("is-invalid") || stateInput.classList.contains("is-invalid")) {return}

    const wageForm = document.querySelector("#earning-frm")
    const inputs = Array.from(wageForm.querySelectorAll('input[type="text"]'))

    inputs.forEach(input => {
        // Set values to zero if value is empty or value is not numerical
        (!input.value || /[^0-9.]+/gi.test(input.value)) && (input.value = 0)
    })

    // Set Hours
    const hour1 = new Hours(weekHours.name)
    hour1.setHours(parseFloat(weekHours.value))

    let weekendHours = undefined
    let hour2 = new Hours("weekend-hours")

    try {
        weekendHours = document.querySelector("#weekend-hours")
        hour2 = new Hours(weekendHours.name)
        hour2.setHours(parseFloat(weekendHours.value))
    } catch (err) {
        // continue running the code after the error
    }


    // Update values for the Earnings Table
    const rateGroup = Array.from(document.querySelectorAll(".rate-group"))

    rateGroup.forEach(pay => {
        const name = pay.name
        const week = pay.dataset.week
        const rate = parseFloat(pay.value)

        UI.deleteEarning(name)

        const earning = new Earning(name, week)
        earning.setRate(rate)
        const hours = earning.setHours(Calc.getHours(week, hour1.hours, hour2.hours))

        Calc.getAmount(rate, hours, earning)

        UI.createEarningList(earning)
    })
    

    // Check if hours exceed 40 hours and set or delete overtime
    if (hour1.hours > 40) {
        let preAmount = Calc.totalAmount()

        UI.deleteEarning('overtime')

        const overtime = new Earning('overtime', 'ot-days')
        const rate = Calc.overtimeRate(preAmount, hour1.hours)
        const hours = overtime.setHours(Calc.getHours('overtime', hour1.hours, hour2.hours))

        overtime.setRate(rate)
        Calc.getAmount(rate, hours, overtime)

        UI.createOvertimeList(overtime)
    } else {
        UI.deleteEarning('overtime')
    }

    /* 
    Get final total amount for the earning table
    Set total amount in tax-calc.js and the Total in the earning table
    */
    let finalAmount = Calc.totalAmount()

    taxCalc.appData.table.earning_total = finalAmount
    document.querySelector("#earning-tbl-total").nextElementSibling.textContent = `$ ${finalAmount.toFixed(2)}`

    //===================//
    // Tax Table Section //
    //===================//
    const {table, taxInfo, withholding} = taxCalc.appData
    const {threshold, percent} = withhold.FICA.Medicare
    
    // Update FICA Social Security table
    let socialAmt = Calc.social(finalAmount)
    document.querySelector("#fica-social").nextElementSibling.textContent = `$ ${socialAmt.toFixed(2)}`

    // Update FICA Medicare table
    if (withholding.medicare.addSurtax) {
        // Useless code for now. Add dates for end of year pay period total
        const addlAmount = table.earning_total - threshold[taxInfo.status]
        // finish later
    }

    withholding.medicare.amount = table.earning_total * percent.regular
    document.querySelector("#fica-medicare").nextElementSibling.textContent = `$ ${withholding.medicare.amount.toFixed(2)}`

    // Update State Withholding
    // Go to tax-calc.js for state withhold amount on the event listener 'change' instead of 'submit'
    document.querySelector("#state-withhold").nextElementSibling.textContent = `$ ${stateIncomeCalc.stateWH(taxInfo.state).toFixed(2)}`

    //Update Federal Withholding
    let federalWH = Calc.federal(taxInfo.freq, finalAmount, taxInfo.status)
    document.querySelector("#fed-withhold").nextElementSibling.textContent = `$ ${federalWH.toFixed(2)}`
    
    UI.clearFields()
})

// Remove "is-invalid" class after correct value is typed
document.querySelector("#earning-frm").addEventListener("input", () => {
    validity.Validation("main-earning", "remove", /^[0-9]+\.?[0-9]?[0-9]?/g)
    validity.Validation("week-hours", "remove", /^[0-9]+\.?[0-9]?[0-9]?/g)
})

// Begin creating a new rate 
document.querySelector("#add-pay").addEventListener("click", () => {
    CreateInput.createOptionsRate()

    document.querySelector("#add-pay").disabled = true
    document.querySelector("#calculate").disabled = true

})

let createInput
let weekendHours = null
document.querySelector("#rate-input").addEventListener("change", () => {
    const option = document.querySelector("#rate-input").firstElementChild

    // Initialize CreateInput class
    switch (option.value) {
        case "select":
            return
        case "allday":
        case "weekday":
            createInput = new CreateInput(option.value)
            break;
        case "weekend":
            createInput = new CreateInput(option.value)
            // Check if weekend hours does not exist and create weekend hours
            if (weekendHours === null) {
                weekendHours = new CreateInput("weekend-hours")
                weekendHours.setName("hours")
                weekendHours.placeholder = "Weekend Hours"

                weekendHours.createWeekendHours()
            }
            break;
    }

    // remove elements within the div #rate-input and switch to div #name-input
    option.remove()
    document.querySelector("#rate-input").classList.remove("input-group", "me-2")
    CreateInput.createNameInput()
})

document.querySelector("#name-input").addEventListener("click", e => {
    if (e.target.id !== "enter-name") {return}

    // Check for entered value. Return if value is invalid
    const newName = document.querySelector("#new-name")
    newName.addEventListener("input", () => validity.Validation("new-name", "remove", /\w/))
    validity.Validation("new-name", "add", "")
    if (!newName.value) {return}

    let letterCase = newName.value.charAt(0).toUpperCase() + newName.value.slice(1).toLowerCase();

    // Prevent named duplicates 
    if (UI.preventDuplicate(letterCase)) {return}

    // Value entered
    createInput.setName(letterCase)
    createInput.setPlaceholder(letterCase)

    // remove elements within the div #name-input after clicking enter
    const nameInput = document.querySelector("#name-input")
    Array.from(nameInput.children).forEach(child => child.remove())
    nameInput.classList.remove("input-group", "me-2")

    // Create the new rate and add it to the table
    createInput.finalizeNewRate(createInput.week)

    const earning = new Earning(createInput.name, createInput.week)
    UI.createEarningList(earning)

    document.querySelector("#add-pay").disabled = false
    document.querySelector("#calculate").disabled = false
})

// Delete Rate
document.querySelector("#earning-frm").addEventListener("click", e => {
    CreateInput.deleteInput(e)
    // update total after input is deleted 
})