import { States } from "./tax-withholding-data.js"
import { appData } from "./tax-data.js"
import { Store, LocalDisplay } from "../classes.js"

const config = {
    updateLocalChanges: new Date(2021, 6, 6),
    itemName: 'localities',
    storeKey: function (item) {
        return JSON.parse(localStorage.getItem(item))
    }
}

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
    if (!localStorage.getItem(config.itemName)) {
        Store.addStorageItem(config.itemName, 'lastUpdate', config.updateLocalChanges.toDateString())

        Object.keys(States).forEach(state => {
            Object.prototype.hasOwnProperty.call(States[state], config.itemName) && Store.addStorageItem(config.itemName, state, Object.keys(States[state].localities))
        })
    }

    // Check for Updates
    if (config.storeKey(config.itemName).lastUpdate !== config.updateLocalChanges.toDateString()) {
        Store.addStorageItem(config.itemName, 'lastUpdate', config.updateLocalChanges.toDateString())

        Object.keys(States).forEach(state => {
            Object.prototype.hasOwnProperty.call(States[state], config.itemName) && Store.addStorageItem(config.itemName, state, Object.keys(States[state].localities))

            // Delete if State's hasOwnProperty is false in file tax-withholding-data and if localStorage 'localities' hasOwnProperty is true 
            if (!Object.prototype.hasOwnProperty.call(States[state], config.itemName) && Object.prototype.hasOwnProperty.call(config.storeKey(config.itemName), state)) {
                Store.deleteItem(config.itemName, state)
            }
        })
    }
})

// Check modified state allowance. Retrieve localilty and display
document.querySelector("#tax-info-frm").addEventListener("change", e => {
    if (e.target.id !== "state") {return}
    const {state} = appData.taxInfo

    const localArr = Object.prototype.hasOwnProperty.call(config.storeKey(config.itemName), state) ? config.storeKey(config.itemName)[state] : undefined
    
    if (!localArr) {
        try {
            LocalDisplay.deleteContainer()
        } catch {}
        return
    }

    LocalDisplay.container(localArr)

})