import { States } from "./tax-withholding-data.js"
import { appData } from "./tax-data.js"
import { Store } from "../classes.js"

const updateLocalChanges = new Date(2021, 6, 6)

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
    if (!localStorage.getItem('localities')) {
        Store.addStorageItem('localities', 'lastUpdate', updateLocalChanges.toDateString())

        Object.keys(States).forEach(state => {
            States[state].hasOwnProperty('localities') && Store.addStorageItem('localities', state, Object.keys(States[state].localities))
        })
    }

    // Check for Updates
    if (JSON.parse(localStorage.getItem('localities')).lastUpdate !== updateLocalChanges.toDateString()) {
        Store.addStorageItem('localities', 'lastUpdate', updateLocalChanges.toDateString())

        Object.keys(States).forEach(state => {
            States[state].hasOwnProperty('localities') && Store.addStorageItem('localities', state, Object.keys(States[state].localities))
        })
    }
})