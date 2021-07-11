import { States } from "./tax-withholding-data.js"
import { appData } from "./tax-data.js"
import { Store } from "../classes.js"

const updateLocalChanges = new Date(2021, 6, 6)
const itemName = 'localities'

const modifiedAllowance = {
    IL: {
        line_1_allowance: 0,
        line_2_allowance: 0,
        addl_allowance: 0
    }
}

// Create a local storage for localities
document.addEventListener('DOMContentLoaded', () => {
    // Check if item exist
    if (!localStorage.getItem(itemName)) {
        Store.addStorageItem(itemName, 'lastUpdate', updateLocalChanges.toDateString())

        Object.keys(States).forEach(state => {
            Object.prototype.hasOwnProperty.call(States[state], itemName) && Store.addStorageItem(itemName, state, Object.keys(States[state].localities))
        })
    }

    // Check for Updates
    if (JSON.parse(localStorage.getItem(itemName)).lastUpdate !== updateLocalChanges.toDateString()) {
        Store.addStorageItem(itemName, 'lastUpdate', updateLocalChanges.toDateString())

        Object.keys(States).forEach(state => {
            Object.prototype.hasOwnProperty.call(States[state], itemName) && Store.addStorageItem(itemName, state, Object.keys(States[state].localities))

            // Check if State's hasOwnProperty is false in file tax-withholding-data and if localStorage 'localities' hasOwnProperty is true 
            if (!Object.prototype.hasOwnProperty.call(States[state], itemName) && JSON.parse(localStorage.getItem('localities')).hasOwnProperty(state)) {
                Store.deleteItem(itemName, state)
            }
        })
    }
})

// Check modified state allowance. Retrieve localilty and display