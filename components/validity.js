export function Validation(id, behavior, ...valueErrors) {
    const getID = document.getElementById(id)

    switch (behavior) {
        case "add":
            valueErrors.forEach(v => {
                if (v instanceof RegExp) {
                    (v.test(getID.value)) && getID.classList.add("is-invalid")
                }
                if (getID.value === v) {
                    getID.classList.add("is-invalid")
                }
            })
            break;
        case "remove":
            valueErrors.forEach(v => {
                if (v instanceof RegExp) {
                    (v.test(getID.value)) && getID.classList.remove("is-invalid")
                }
                if (getID.value === v) {
                    getID.classList.add("is-invalid")
                }
            })
            break;
    
        default:
            return
    }
    
}