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
        return this.week = week
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
            const rateGroup = Array.from(document.querySelectorAll(".rate-group"))

            const count = rateGroup.filter(rate => rate.dataset.week === "weekend").length
            
            if (count === 0 && document.querySelector("#weekend-hours") !== null) {
                document.querySelector("#weekend-hours").remove()
                taxData.appData.class.weekend_hours.week = ''
            }
        }
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
        const earningList = Array.from(document.querySelectorAll(classSelector))
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
}