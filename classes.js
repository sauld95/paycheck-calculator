import * as taxData from "./withholding-info/tax-data.js"
import * as withhold from "./withholding-info/tax-withholding-data.js"

export class Earning {
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
export class CreateInput {
    constructor() {
        this.week = ''
        this.name = ''
        this.placeholder = ''
    }
    setWeek(week) {
        this.week = week
        return this
    }
    setName(name) {
        this.name = name
        return this
    }
    setPlaceholder(placeholder, filler = 'rate') {
        this.placeholder = `${placeholder} ${filler}`
        return this
    }
    static createOptionsRate() {
        document.querySelector("#rate-input").classList.add("input-group", "me-2")

        const select = document.createElement("select")
        select.classList.add("form-select")
        select.setAttribute("aria-label", "Default select example")

        select.innerHTML = `
        <option value="select" selected hidden>--Select--</option>
        <option value="everyday">Every Day</option>
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
            case "everyday":
                span.setAttribute("title", "Every Day rate")
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
        input.classList.add("form-control", "rate-group")
        input.setAttribute("data-week", this.week)
        input.setAttribute("placeholder", this.placeholder)

        // Create div
        const div = document.createElement("div")
        div.classList.add("input-group", "me-sm-2")

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
        input.classList.add("form-control", "me-sm-2")
        input.setAttribute("id", this.week)
        input.setAttribute("placeholder", this.placeholder)

        const parent = document.querySelector("#earning-frm")
        const reference = document.querySelector("#add-pay")

        parent.insertBefore(input, reference)
    }

    static deleteInput(el) {
        if (el.target.classList.contains("label-rate")) {
            // Remove input 
            el.target.parentElement.remove()
            UI.deleteEarning(el.target.nextSibling.name)

            // if weekend rate count is equal to 0, delete weekend hours
            const rateGroup = [...document.querySelectorAll(".rate-group")]

            const count = rateGroup.filter(rate => rate.dataset.week === "weekend").length
            
            if (count === 0 && document.querySelector("#weekend-hours") !== null) {
                document.querySelector("#weekend-hours").remove()
                taxData.appData.class.weekend_hours.week = ''
            }
        }
    }

}

export class LocalDisplay {
    static select(lists) {
        const select = document.createElement("select")
        select.classList.add("form-select")
        select.setAttribute("id", "local")

        lists.forEach(list => {
            const option = document.createElement("option")
            option.setAttribute("value", list)
            const text = document.createTextNode(list)
            option.appendChild(text)

            select.appendChild(option)
        })

        return select
    }
    static container(lists) {
        const label = document.createElement("label")
        label.setAttribute("for", "local")
        label.classList.add("col-form-label", "col-sm-3", "col-lg-3", "col-xl-3")

        const text = document.createTextNode("Local")
        label.appendChild(text)

        const div = document.createElement("div")
        div.classList.add("col-sm-9", "col-lg-9", "col-xl-9")
        div.appendChild(LocalDisplay.select(lists))

        const container = document.createElement("div")
        container.classList.add("row", "mb-1")
        container.setAttribute("id", "local-container")

        container.appendChild(label)
        container.appendChild(div)

        const parent = document.querySelector("#tax-info-frm")
        const reference = document.querySelector("#status-container")

        parent.insertBefore(container, reference)
    }
    static deleteContainer() {
        document.querySelector("#local-container").remove()
    }
}

export class Hours {
    constructor (name) {
        this.name = name
        this.hours = 0
    }
    setHours(hours) {
        return this.hours = hours
    }
}

// UI Functionality
export class UI {
    static createEarningList(earning) {
       const earningList = document.querySelector("#earning-tbl-list")
       const row = document.createElement("tr")

       row.innerHTML = `
        <th scope="row" class="earning-row-title">${earning.name}</th>
        <td>${earning.rate}</td>
        <td>${earning.hours}</td>
        <td class="earning-row-amount">${earning.amount}</td>
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
         <td class="earning-row-amount">${earning.amount}</td>
        `

        const firstTitle = document.querySelector(".earning-row-title").parentElement.nextElementSibling
 
        earningList.insertBefore(row, firstTitle)
     }

    static deleteEarning(name) {
        const earningList = [...document.querySelectorAll(".earning-row-title")]
        earningList.forEach(earn => {
            if (earn.textContent === name) {
                earn.parentElement.remove()
            }
        })
    }
    static preventDuplicate(name) {
        let boolean = false
        const earningList = [...document.querySelectorAll(".earning-row-title")]
        
        earningList.forEach(earn => {
            if (earn.textContent === name) {
                boolean = true
            }
        })
        return boolean
    }
    static clearFields() {
        const wageForm = document.querySelector("#earning-frm")
        const inputs = [...wageForm.querySelectorAll('input[type="text"]')]
        inputs.forEach(input => input.value = "")
    }
}

// Calculations
export class Calc {
    static getHours(week, hour1, hour2) {
        let value = 0;

        switch (week) {
            case 'main-earning':
            case 'everyday':
                value = hour1
                break;
            case 'weekday':
                value = parseFloat((hour1 - hour2).toFixed(2))
                break;
            case 'weekend':
                value = hour2
                break;
            case 'Overtime':
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
    static totalAmount(classSelector) {
        const earningList = [...document.querySelectorAll(classSelector)]
        const regex = /[0-9]+.[0-9]{1,2}/
        let amountArr = earningList.map(earn => parseFloat(earn.textContent.match(regex)[0]))
        
        return amountArr.reduce((total, sum) => {return total + sum})
    }
    static medicare() {
        // TODO: Medicare: Work on medicare function
    }
    static social(totalWage) {
        const { percent } = withhold.FICA.Social
        
        return totalWage * percent
    }
}

// Local Storage
export class Store {
    static getStorageItem(itemName) {
        if(localStorage.getItem(itemName) === null) {
            itemName = {}
        } else {
            itemName = JSON.parse(localStorage.getItem(itemName))
        }

        return itemName
    }

    static addStorageItem(itemName, property, value) {
        let item = Store.getStorageItem(itemName)

        Object.defineProperty(item, property, {
            value: value,
            writable: true,
            enumerable: true,
            configurable: true
        })
        
        localStorage.setItem(itemName, JSON.stringify(item))
    }

    static deleteItem(itemName, property) {
        let item = Store.getStorageItem(itemName)

        delete item[property]

        localStorage.setItem(itemName, JSON.stringify(item))
    }
}