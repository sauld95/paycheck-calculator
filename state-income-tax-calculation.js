import * as taxData from "./withholding-info/tax-data.js"
import * as withhold from "./withholding-info/tax-withholding-data.js"

// Standard calculation used by the federal and various states
export function standard(frequency, totalWage, status, withholdDataLoc) {
    const period = withholdDataLoc[frequency]
    
    let lessThanWageAmt = 0
    let taxPercent = 0
    let tentativeAmt = 0

    period[status][0].forEach((amount, i) => {
        if (amount > totalWage) {
            return
        } else {
            lessThanWageAmt = amount
            taxPercent = withholdDataLoc.taxBracket[i]
            tentativeAmt = period[status][1][i]
        }
    })

    return ((totalWage - lessThanWageAmt) * taxPercent) + tentativeAmt
}

class WithholdingCalc {
    static wi(deductionMax, percent, grossEarning, annualEarning) {
        return deductionMax - (percent * (annualEarning - grossEarning))
    }
    static il(totalWage, allowance1, allowance2, payPeriod) {
        const {IL} = withhold.States
        return IL.taxRate * (totalWage - (((allowance1 * IL.allowanceLine1) + (allowance2 * IL.allowanceLine2)) / payPeriod))
    }
}

export function stateWH(state) {
    let {status, freq} = taxData.appData.taxInfo
    const {earning_total} = taxData.appData.table
    const freqNum = withhold.PayPeriod[freq]
    const annualGross = earning_total * freqNum

    switch (state) {
        // Link for the provided methods used to calculate withholding
        // https://www.revenue.wi.gov/DOR%20Publications/pb166.pdf
        case "WI":
            const { taxRate, deductions } = withhold.States.WI
            let deductionAmt

            // Get deduction Amount 
            switch (status) {
                case 'single':
                case 'marriedS':
                case 'hoh':
                    // refer to tax-withholding-data.js => States.WI.deductions
                    if (annualGross < deductions.single[1][0]) {
                        deductionAmt = deductions.single[2][0]
                    }
                    if (annualGross > deductions.single[1][1]) {
                        deductionAmt = deductions.single[2][1]
                    } else {
                        deductionAmt = WithholdingCalc.wi(deductions.single[2][0], deductions.single[0], deductions.single[1][0], annualGross)
                    }
                    break;
                case 'marriedJ':    
                case 'widower':
                    if (annualGross < deductions.marriedJ[1][0]) {
                        deductionAmt = deductions.marriedJ[2][0]
                    }
                    if (annualGross > deductions.marriedJ[1][1]) {
                        deductionAmt = deductions.marriedJ[2][1]
                    } else {
                        deductionAmt = WithholdingCalc.wi(deductions.marriedJ[2][0], deductions.marriedJ[0], deductions.marriedJ[1][0], annualGross)
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

        // Link for the provided methods used to calculate withholding
        // https://www2.illinois.gov/rev/forms/withholding/Documents/currentyear/IL-700-T.pdf
        case "IL":
            return WithholdingCalc.il(earning_total, 0, 0, freqNum)
        
        case "NY":
            return standard(freq, earning_total, status, withhold.States.NY)
    
        default:
            break;
    }
}