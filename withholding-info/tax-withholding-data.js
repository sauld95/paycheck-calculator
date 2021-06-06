export const FICA = {
    Social: {
        percent: .062,
        threshold: {
            single: 132900,
            hoh: 132900,
            marriedJ: 132900,
            widower: 132900,
            marriedS: 132900,
            trust: 132900,
            estate: 132900
        }
    },
    Medicare: {
        percent: {
            regular: .0145, 
            surtax: .009
        },
        threshold: {
            single: 200000,
            hoh: 200000,
            marriedJ: 250000,
            widower: 250000,
            marriedS: 125000,
            trust: 12500,
            estate: 12500
        }
    }
}

// https://www.irs.gov/pub/irs-pdf/p15t.pdf
const Federal = {
    // Step 1 annualWage = Taxable wage * pay period
    PayPeriod: {
        quarterly: 4,
        monthly: 12,
        semimonthly: 24,
        biweekly: 26,
        weekly: 52,
        daily: 260,
    },

    /* 
    Step 2.1 adjusted = annualWage - Arr[0][0-7]
    Step 2.2 percAmt = adjusted * PMT.taxBracket[0-7]
    Step 2.3 withhold = Arr[1][0-7] + percAmt
    Step 2.4 withhold / pay period
    */ 
    PMT: {
        taxBracket: [0, .1, .12, .22, .24, .32, .35, .37],
        marriedJ: [
            [0, 12200, 32100, 93250, 184950, 342050, 431050, 640500], // Annual Wage Amount
            [0, 0, 1990, 9328, 29502, 67206, 95686, 168993.5], // Tentative Amount to Withhold
        ],
        single: [
            [0, 3950, 13900, 44475, 90325, 168875, 213375, 527550], // Annual Wage Amount
            [0, 0, 995, 4664, 14751, 33603, 47843, 157804.25], // Tentative Amount to Withhold
        ],
        hoh: [
            [0, 10200, 24400, 64400, 96550, 175100, 219600, 533800], // Annual Wage Amount
            [0, 0, 1420, 6220, 13293, 32145, 46385, 156355], // Tentative Amount to Withhold
        ]
    }
}



export const States = {
    // https://www.revenue.wi.gov/DOR%20Publications/pb166.pdf
    WI: {
        taxRate: [
            [10910, 21820, 240190],
            [.04, .0584, .0627, .0765]
        ],
        deductions: {
            single: [
                .12, // Percent for annual gross earnings in excess
                [15200, 62950], // Gross Earnings
                [5730, 0] // MinMax Deduction
            ],
            married: [
                .2, // Percent for annual gross earnings in excess
                [21400, 60750], // Gross Earnings
                [7870, 0] // MinMax Deduction
            ]
        }
    },
    IL: {

    }
}