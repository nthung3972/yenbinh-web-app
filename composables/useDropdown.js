import { ref, onMounted, onUnmounted, watch } from 'vue'

export const useDropdown = () => {
  const activeDropdown = ref(null)

  /**
   * Toggle dropdown visibility
   * @param event The click event
   */
  const toggleDropdown = (event) => {
    const target = event.currentTarget
    const dropdown = target.closest('.action-dropdown')
    
    if (!dropdown) return
    
    const dropdownMenu = dropdown.querySelector('.dropdown-menu')
    
    // If clicking on the already open dropdown, close it
    if (activeDropdown.value === dropdownMenu) {
      closeAllDropdowns()
      return
    }
    
    // Close any open dropdowns
    closeAllDropdowns()
    
    // Open the clicked dropdown
    if (dropdownMenu) {
      dropdownMenu.classList.add('show')
      activeDropdown.value = dropdownMenu
    }
  }

  /**
   * Close all open dropdowns
   */
  const closeAllDropdowns = () => {
    console.log('closeAllDropdowns')
    document.querySelectorAll('.action-dropdown .dropdown-menu.show').forEach(dropdown => {
      dropdown.classList.remove('show')
    })
    activeDropdown.value = null
  }

  /**
   * Close dropdowns when clicking outside
   * @param event The click event
   */
  const handleOutsideClick = (event) => {
    const target = event.target
    if (!target.closest('.action-dropdown')) {
      closeAllDropdowns()
    }
  }

  /**
   * Close dropdowns when pressing Escape key
   * @param event The keyboard event
   */
  const handleEscapeKey = (event) => {
    if (event.key === 'Escape') {
      closeAllDropdowns()
    }
  }

  onMounted(() => {
    document.addEventListener('click', handleOutsideClick)
    document.addEventListener('keydown', handleEscapeKey)
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleOutsideClick)
    document.removeEventListener('keydown', handleEscapeKey)
  })

  return {
    toggleDropdown,
    closeAllDropdowns
  }
}

export default useDropdown