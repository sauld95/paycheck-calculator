const mediaQuery = window.matchMedia('(max-width: 767px)')

// Check for smaller screen size to change bootstrap classes right away
if (mediaQuery.matches) {
    
}

// Toggle between bootstrap classes when size changes
mediaQuery.addEventListener('change', e => {
  if (e.matches) {
    
  } else {
    
  }
})