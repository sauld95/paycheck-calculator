import * as taxCalc from "./withholding-info/tax-calc.js"
import * as withhold from "./withholding-info/tax-withholding-data.js"

export function stateWH(state) {
    let { status, freq } = taxCalc.appData.taxInfo
    const { earning_total } = taxCalc.appData.table
    const freqNum = withhold.PayPeriod[freq]
    const annualGross = earning_total * freqNum

    switch (state) {
        // https://www.revenue.wi.gov/DOR%20Publications/pb166.pdf
        case "WI":
            const { taxRate, deductions } = withhold.States.WI
            let deductionAmt

            function calcDeduction(deductionMax, percent, grossEarning) {
                return deductionMax - (percent * (annualGross - grossEarning))
            }

            // Get deduction Amount 
            switch (status) {
                case 'single':
                case 'marriedS':
                case 'hoh':    
                case 'widower':
                    // refer to tax-withholding-data.js => States.WI.deductions
                    if (annualGross < deductions.single[1][0]) {
                        deductionAmt = deductions.single[2][0]
                    }
                    if (annualGross > deductions.single[1][1]) {
                        deductionAmt = deductions.single[2][1]
                    } else {
                        deductionAmt = calcDeduction(deductions.single[2][0], deductions.single[0], deductions.single[1][0])
                    }
                    break;
                case 'marriedJ':
                    if (annualGross < deductions.marriedJ[1][0]) {
                        deductionAmt = deductions.marriedJ[2][0]
                    }
                    if (annualGross > deductions.marriedJ[1][1]) {
                        deductionAmt = deductions.marriedJ[2][1]
                    } else {
                        deductionAmt = calcDeduction(deductions.marriedJ[2][0], deductions.marriedJ[0], deductions.marriedJ[1][0])
                    }
                    break;
            }

            let netWage = parseFloat((annualGross - deductionAmt).toFixed(2))

            // The withhold.taxRate.tax array indexes from the right going left
            // The withhold.taxRate.annual_net indexes from the left going right
            let newNetArray = taxRate.annual_net.filter(item => netWage > item).reverse()

            // Add the net wage to the array and remove the 0
            newNetArray.shift()
            newNetArray.push(netWage)

            let computedTax = 0
            for (let i = 0; i < newNetArray.length; i++) {
                if (newNetArray[i - 1] === undefined) {
                    computedTax += newNetArray[i] * taxRate.tax[taxRate.tax.length - 1 - i]
                } else {
                    computedTax += (newNetArray[i] - newNetArray[i - 1]) * taxRate.tax[taxRate.tax.length - 1 - i]
                }
            }

            return computedTax / freqNum

        // https://www2.illinois.gov/rev/forms/withholding/Documents/currentyear/IL-700-T.pdf
        case "IL":
            
            return 0
    
        default:
            break;
    }
}