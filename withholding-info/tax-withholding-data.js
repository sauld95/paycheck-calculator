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
            [0, 1046, 1875, 4423, 8244, 14790, 18498, 27225],
            [0, 0, 82.9, 388.66, 1229.28, 2800.32, 3986.88, 7041.33]
        ],
        single: [
            [0, 523, 938, 2211, 4122, 7395, 9249, 22340],
            [0, 0, 41.5, 194.26, 614.68, 1400.2, 1993.48, 6575.33]
        ],
        hoh: [
            [0, 783, 1375, 3042, 4381, 7654, 9508, 22600],
            [0, 0, 59.2, 259.24, 553.82, 1339.34, 1932.62, 6514.82]
        ]
    },
    monthly: {
        marriedJ: [
            [0, 2092, 3750, 8846, 16488, 29579, 36996, 54450],
            [0, 0, 165.8, 777.32, 2458.56, 5600.4, 7973.84, 14082.74]
        ],
        single: [
            [0, 1046, 1875, 4423, 8244, 14790, 18498, 44679],
            [0, 0, 82.9, 388.66, 1229.28, 2800.32, 3986.88, 13150.23]
        ],
        hoh: [
            [0, 1567, 2750, 6083, 8763, 15308, 19017, 45200],
            [0, 0, 118.3, 518.26, 1107.86, 2678.66, 3865.54, 13029.59]
        ]
    },
    daily: {
        marriedJ: [
            [0, 96.5, 173.1, 408.3, 761, 1365.2, 1707.5, 2513.1],
            [0, 0, 7.66, 35.88, 113.48, 258.49, 368.02, 649.98]
        ],
        single: [
            [0, 48.3, 86.5, 204.1, 380.5, 682.6, 853.8, 2062.1],
            [0, 0, 3.82, 17.93, 56.74, 129.24, 184.03, 606.93]
        ],
        hoh: [
            [0, 72.3, 126.9, 280.8, 404.4, 706.5, 877.7, 2086.2],
            [0, 0, 5.46, 23.93, 51.12, 123.62, 178.41, 601.38]
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