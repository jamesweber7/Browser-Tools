
// Set Up
document.addEventListener('DOMContentLoaded', () => {
    Popup.setup();
});

class Popup {
    static setup() {
        // Message Reception For Tab Communication
        chrome.runtime.onMessage.addListener(this.receivedMessage);

        // Event Listeners
        this.assignEventListeners();

    }
    static assignEventListeners() {
        // text areas
        this.addAutoResizeToTextareas();
        this.overrideTabKeyInput();
        this.overrideEnterInput();

        // Wands
        this.assignWandMagic();
    }

    static addAutoResizeToTextareas() {
        [...document.getElementsByTagName('textarea')].forEach(textarea => {
            this.addAutoResize(textarea);
        });
    }
 
    static addAutoResize(textarea) {
        textarea.setAttribute("style", "height:" + (textarea.scrollHeight) + "px;overflow-y:hidden;");
        textarea.addEventListener("input", this.expandTextarea);
        textarea.addEventListener("focus", this.expandTextarea);
        textarea.addEventListener("focusout", this.collapseTextarea);
    }

    static expandTextarea() {
        let y = window.scrollY;
        this.style.height = "auto";
        this.style.height = (this.scrollHeight) + "px";
        window.scrollTo(0, y);
    }

    static collapseTextarea() {
        this.style.height = "auto";
    }

    static overrideTabKeyInput() {
        document.addEventListener('keydown', checkInput);
        function checkInput(e) {
            if (document.activeElement.tagName === 'TEXTAREA' && e.key === 'Tab') {
                e.preventDefault();
                const TAB_STRING = '  ';
                let tabIndex = document.activeElement.selectionStart;
                let value = document.activeElement.value;
                value = value.substring(0, tabIndex) + TAB_STRING + value.substring(tabIndex);
                document.activeElement.value = value;
                document.activeElement.selectionStart = tabIndex + TAB_STRING.length;
                document.activeElement.selectionEnd = tabIndex + TAB_STRING.length;
            }
        }
    }
    static overrideEnterInput() {
        document.addEventListener('keydown', checkInput);
        function checkInput(e) {
            if (e.key !== 'Enter') {
                return;
            }
            if (document.activeElement.tagName === 'INPUT') {
                let submitBtnId = document.activeElement.getAttribute('submitbtn');
                if (submitBtnId) {
                    document.getElementById(submitBtnId).click();
                }
            } else if (e.ctrlKey && document.activeElement.tagName === 'TEXTAREA') {
                let submitBtnId = document.activeElement.getAttribute('submitbtn');
                if (submitBtnId) {
                    document.getElementById(submitBtnId).click();
                }
            }
        }
    }

    static assignWandMagic() {
        [...document.getElementsByClassName('wand')].forEach(wand => {
            let magicBox = document.getElementById(`${wand.getAttribute('mb')}-mb`);

            wand.onclick = () => {
                this.toggleMagicBox(magicBox)
            };
        });
    }

    static openMagicBox(magicBox) {
        magicBox.className = 'open';
    }
    
    static closeMagicBox(magicBox) {
        magicBox.className = 'closed';
    }
    
    static magicBoxIsOpen(magicBox) {
        return magicBox.className === 'open';
    }
    
    static toggleMagicBox(magicBox) {
        if (!this.magicBoxIsOpen(magicBox)) {
            this.openMagicBox(magicBox);
        } else {
            this.closeMagicBox(magicBox);
        }
    }

    static receivedMessage(message) {
        switch (message.title) {
            case 'URL': 
                Site.setUrl(message.url);
                break;
        }
    }

    static sendMessageToTab(message) {
        let tabParameters = {
            active: true,
            currentWindow: true
        };
        chrome.tabs.query(tabParameters, onTabReception);
    
        function onTabReception(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, message);
        }
    }

}
