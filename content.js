function createCustomPopup(messageObj) {
    // Create popup container
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 0;
        border-radius: 8px;
        box-shadow: 0 0 0 1px rgba(0,0,0,.15), 0 12px 18px 1px rgba(0,0,0,.2);
        z-index: 9999;
        max-width: 744px;
        width: 90%;
        font-family: -apple-system,system-ui,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Fira Sans,Ubuntu,Oxygen,Oxygen Sans,Cantarell,Droid Sans,Apple Color Emoji,Segoe UI Emoji,Segoe UI Emoji,Segoe UI Symbol,Lucida Grande,Helvetica,Arial,sans-serif;
    `;

    // Create header
    const header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 24px;
        border-bottom: 1px solid rgba(0,0,0,.15);
    `;

    const title = document.createElement('h2');
    title.textContent = 'Reminder to Self';
    title.style.cssText = `
        margin: 0;
        font-size: 20px;
        line-height: 28px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.9);
    `;

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.cssText = `
        border: none;
        background: none;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        margin: -8px;
    `;
    closeButton.onmouseover = () => {
        closeButton.style.backgroundColor = 'rgba(0,0,0,.08)';
    };
    closeButton.onmouseout = () => {
        closeButton.style.backgroundColor = 'transparent';
    };

    header.appendChild(title);
    header.appendChild(closeButton);

    // Create message content
    const content = document.createElement('div');
    content.style.cssText = `
        padding: 24px;
        font-size: 16px;
        line-height: 1.5;
        color: rgba(0, 0, 0, 0.9);
    `;
    content.textContent = messageObj.message;

    // Create footer with button
    const footer = document.createElement('div');
    footer.style.cssText = `
        padding: 16px 24px;
        display: flex;
        justify-content: flex-end;
        border-top: 1px solid rgba(0,0,0,.15);
        background: white;
        border-radius: 0 0 8px 8px;
    `;

    const dismissButton = document.createElement('button');
    dismissButton.textContent = messageObj.buttonText;
    dismissButton.style.cssText = `
        background-color: #0a66c2;
        border: none;
        border-radius: 16px;
        color: #ffffff;
        cursor: pointer;
        font-size: 16px;
        font-weight: 600;
        padding: 6px 16px;
        font-family: inherit;
        min-height: 32px;
        transition: background-color 167ms;
    `;
    dismissButton.onmouseover = () => {
        dismissButton.style.backgroundColor = '#004182';
    };
    dismissButton.onmouseout = () => {
        dismissButton.style.backgroundColor = '#0a66c2';
    };

    const closePopup = () => {
        popup.remove();
        overlay.remove();
    };

    closeButton.onclick = closePopup;
    dismissButton.onclick = closePopup;

    footer.appendChild(dismissButton);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        z-index: 9998;
    `;
    overlay.onclick = closePopup;

    // Assemble popup
    popup.appendChild(header);
    popup.appendChild(content);
    popup.appendChild(footer);

    // Add to document
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
}

function getRandomMessage() {
    return window.funnyMessages[Math.floor(Math.random() * window.funnyMessages.length)];
}

function interceptApplyButtons() {
    // Select both types of apply buttons
    const applyButtons = document.querySelectorAll('.jobs-apply-button');

    applyButtons.forEach(button => {
        if (!button.dataset.intercepted) {
            button.dataset.intercepted = 'true';

            // Remove all existing click listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            // Add our interceptor
            newButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                createCustomPopup(getRandomMessage());
                return false;
            }, true);

            // Also prevent the default on mousedown/mouseup to be extra safe
            newButton.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            }, true);

            newButton.addEventListener('mouseup', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            }, true);

            // Remove href and onclick attributes
            newButton.removeAttribute('href');
            newButton.removeAttribute('onclick');
            newButton.removeAttribute('role');
        }
    });
}

function removeJobsNav() {
    const jobsLink = document.querySelector('a[href="https://www.linkedin.com/jobs/?"]');
    if (jobsLink) {
        const navItem = jobsLink.closest('.global-nav__primary-item');
        if (navItem) {
            navItem.remove();
        }
    }
}

// Run initially
removeJobsNav();
interceptApplyButtons();

// Create an observer to handle dynamic content loading
const observer = new MutationObserver(() => {
    removeJobsNav();
    interceptApplyButtons();
});

// Start observing the document for changes
observer.observe(document.body, {
    childList: true,
    subtree: true
}); 