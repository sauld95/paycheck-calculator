import { CreateInput } from "../classes.js"

export const appData = {
    class: {
        weekend_hours: new CreateInput(),
        create_input: new CreateInput()
    },
    hours: {
        week_hours: 0,
        weekend_hours: 0,
        weekday_hours: 0,
        overtime_hours: 0
    },
    table: {
        earning_total: 0,
        tax_total: 0,
        net_total: 0,
        week_hours: 0,
        weekend_hours: 0
    },
    taxInfo: {
        state: '',
        status: '',
        freq: '',
        fed_allowance: 0,
        state_allowance: 0
    },
    withholding: {
        federalWH: {

        },
        stateWH: {

        },
        social: 0,
        medicare: {
            amount: 0,
            addSurtax: false,
        }
    }
}
