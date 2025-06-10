// JavaScript fix for existing dropdown
(function() {
  'use strict';
  
  function initDropdownFix() {
    const loginButton = document.querySelector('.jsx-4e7b5b7668eab305.login-btn');
    const dropdown = document.querySelector('.jsx-4e7b5b7668eab305.login-dropdown-menu');
    
    if (!loginButton || !dropdown) {
      console.log('Login button or dropdown not found, retrying...');
      setTimeout(initDropdownFix, 500);
      return;
    }
    
    console.log('Initializing dropdown fix...');
    
    let isOpen = false;
    let hoverTimeout;
    
    // Remove existing event listeners by cloning elements
    const newButton = loginButton.cloneNode(true);
    const newDropdown = dropdown.cloneNode(true);
    
    loginButton.parentNode.replaceChild(newButton, loginButton);
    dropdown.parentNode.replaceChild(newDropdown, dropdown);
    
    // Add click handler
    newButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      isOpen = !isOpen;
      
      if (isOpen) {
        newDropdown.classList.add('show');
        newDropdown.style.display = 'block';
      } else {
        newDropdown.classList.remove('show');
        setTimeout(() => {
          if (!newDropdown.classList.contains('show')) {
            newDropdown.style.display = 'none';
          }
        }, 200);
      }
    });
    
    // Add hover handlers
    newButton.addEventListener('mouseenter', function() {
      clearTimeout(hoverTimeout);
      isOpen = true;
      newDropdown.classList.add('show');
      newDropdown.style.display = 'block';
    });
    
    newDropdown.addEventListener('mouseenter', function() {
      clearTimeout(hoverTimeout);
      isOpen = true;
      newDropdown.classList.add('show');
      newDropdown.style.display = 'block';
    });
    
    // Add mouse leave handlers with delay
    function handleMouseLeave() {
      hoverTimeout = setTimeout(() => {
        if (!newButton.matches(':hover') && !newDropdown.matches(':hover')) {
          isOpen = false;
          newDropdown.classList.remove('show');
          setTimeout(() => {
            if (!newDropdown.classList.contains('show')) {
              newDropdown.style.display = 'none';
            }
          }, 200);
        }
      }, 100);
    }
    
    newButton.addEventListener('mouseleave', handleMouseLeave);
    newDropdown.addEventListener('mouseleave', handleMouseLeave);
    
    // Close when clicking outside
    document.addEventListener('click', function(e) {
      if (!newButton.contains(e.target) && !newDropdown.contains(e.target)) {
        isOpen = false;
        newDropdown.classList.remove('show');
        setTimeout(() => {
          if (!newDropdown.classList.contains('show')) {
            newDropdown.style.display = 'none';
          }
        }, 200);
      }
    });
    
    console.log('Dropdown fix initialized successfully!');
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDropdownFix);
  } else {
    initDropdownFix();
  }
  
  // Also try to initialize after a short delay in case of dynamic content
  setTimeout(initDropdownFix, 1000);
})();

