export const PayPeriod = {
    quarterly: 4,
    monthly: 12,
    semimonthly: 24,
    biweekly: 26,
    weekly: 52,
    daily: 260
}

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
// Using the Percentage Method Tables for Manual Payroll Systems With Forms W-4 From 2020 or Later
export const Federal = {
    taxBracket: [0, .1, .12, .22, .24, .32, .35, .37],
    // Below is the STANDARD withholding rate schedule
    weekly: {
        marriedJ: [
            [0, 483, 865, 2041, 3805, 6826, 8538, 12565],
            [0, 0, 38.2, 179.32, 567.4, 1292.44, 1840.28, 3249.73]
        ],
        single: [
            [0, 241, 433, 1021, 1902, 3413, 4269, 10311],
            [0, 0, 19.2, 89.76, 283.58, 646.22, 920.14, 3034.84]
        ],
        hoh: [
            [0, 362, 635, 1404, 2022, 3533, 4388, 10431],
            [0, 0, 27.3, 119.58, 255.54, 618.18, 891.78, 3006.83]
        ]
    },
    // TODO: Finish updating schedule bracket
    biweekly: {
        marriedJ: [
            [0, 965, 1731, 4083, 7610, 13652, 17075, 25131],
            [0, 0, 76.6, 358.84, 1134.78, 2584.86, 3680.22, 6499.82]
        ],
        single: [
            [0, 483, 865, 2041, 3805, 6826, 8538, 20621],
            [0, 0, 38.2, 179.32, 567.4, 1292.44, 1840.28, 6069.33]
        ],
        hoh: [
            [0, 723, 1269, 2808, 4044, 7065, 8777, 20862],
            [0, 0, 54.6, 239.28, 511.2, 1236.24, 1784.08, 6013.83]
        ]
    },
    semimonthly: {
        marriedJ: [
            [],
            []
        ],
        single: [
            [],
            []
        ],
        hoh: [
            [],
            []
        ]
    },
    monthly: {
        marriedJ: [
            [],
            []
        ],
        single: [
            [],
            []
        ],
        hoh: [
            [],
            []
        ]
    },
    daily: {
        marriedJ: [
            [],
            []
        ],
        single: [
            [],
            []
        ],
        hoh: [
            [],
            []
        ]
    }
}



export const States = {
    // https://www.revenue.wi.gov/DOR%20Publications/pb166.pdf
    WI: {
        taxRate: {
            annual_net: [240190, 21820, 10910, 0],
            tax: [.0765, .0627, .0584, .04]
        },
        deductions: {
            single: [
                .12, // Percent for annual gross earnings in excess
                [15200, 62950], // Gross Earnings
                [5730, 0] // MinMax Deduction
            ],
            marriedJ: [
                .2, // Percent for annual gross earnings in excess
                [21400, 60750], // Gross Earnings
                [7870, 0] // MinMax Deduction
            ]
        }
    },
    IL: {
        // Allowance: https://www2.illinois.gov/rev/forms/withholding/Documents/currentyear/il-w-4.pdf
        // TODO: Change state allowance for IL to two different allowances
        allowanceLine1: 2375,
        allowanceLine2: 1000,
        taxRate: .0495
    }
}