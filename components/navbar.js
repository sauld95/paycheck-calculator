// FIXME: Change filename to adjust-media-query.js

export const mediaQuery = window.matchMedia('(max-width: 767px)')
const earningForm = document.querySelector("#earning-frm")
const summaryTbl = document.querySelector("#summary-tbl")
const navSupport = document.querySelector("#navbarSupportedContent")

// Tax Info Form
const state = document.querySelector("#state")
const status = document.querySelector("#status")
const freq = document.querySelector("#frequency")
const fedAllow = document.querySelector("#fed-allowance")
const stateAllow = document.querySelector("#state-allowance")

const infoArr = [state, status, freq, fedAllow, stateAllow]

function convertMobile() {
    // Navbar
    earningForm.classList.remove("d-flex")
    earningForm.classList.add("container-sm")
    navSupport.classList.add("mx-5")
    // Table
    summaryTbl.classList.add("table-sm", "table-bordered")

    // Tax Info Form
    state.classList.add("form-select-sm")
    status.classList.add("form-select-sm")
    freq.classList.add("form-select-sm")
    fedAllow.classList.add("form-control-sm")
    stateAllow.classList.add("form-control-sm")

    infoArr.forEach(info => {
        info.parentElement.previousElementSibling.classList.remove("col-form-label")
        info.parentElement.previousElementSibling.classList.add("col-form-label-sm")
    })

}

function convertDesk() {
    // Navbar
    earningForm.classList.remove("container-sm")
    earningForm.classList.add("d-flex")
    navSupport.classList.remove("mx-5")

    // Table
    summaryTbl.classList.remove("table-sm", "table-bordered")

    // Tax Info Form
    state.classList.remove("form-select-sm")
    status.classList.remove("form-select-sm")
    freq.classList.remove("form-select-sm")
    fedAllow.classList.remove("form-control-sm")
    stateAllow.classList.remove("form-control-sm")

    infoArr.forEach(info => {
        info.parentElement.previousElementSibling.classList.remove("col-form-label-sm")
        info.parentElement.previousElementSibling.classList.add("col-form-label")
    })
    
}

// Check for smaller screen size to change bootstrap classes right away
if (mediaQuery.matches) {
    convertMobile()
}

// Toggle between bootstrap classes when size changes
mediaQuery.addEventListener('change', e => {
  if (e.matches) {
    convertMobile()
  } else {
    convertDesk()
  }
})