
setTimeout(() => {
    Tab.setup();
}, 1);

class Tab {

    static setup() {
        // Establish communication with popup
        chrome.runtime.onMessage.addListener((message) => {
            this.receivedMessage(message)
        });
        // sites -> run site specific instructions
        this.runSiteSpecificInstructions();
    }

    /*
     * Tab-Popup communication
     */

    static receivedMessage(message) {
        switch (message.title) {
            case 'SEND_URL':
                this.sendUrl();
                break;
            case 'COOL_STYLE' :
                this.coolStyle();
                break;
            case 'RUN_CODE' :
                this.runCode(message.code);
                break;
            case 'MustachE' :
                this.createMustache(message.code);
                break;
            case 'SET_COLOR' :
                this.setColor(message.color);
                break;
            case 'SET_BACKGROUND' :
                this.setBackgroundColor(message.color);
                break;
        }
    }
      
    static sendMessageToPopup(message) {
        chrome.runtime.sendMessage(message);
    }

    /*
     * Site
     */

    // send url to popup
    static sendUrl() {
        this.sendMessageToPopup({
            title: 'URL',
            url: this.getUrl()
        });
    }

    // get tabs' url
    static getUrl() {
        return window.location.href;
    }

    // remove clutter from base url
    static simplifyUrl(url) {
        if (!url) {
            url = '';
        }
        let ignoreStarts = ['https://', 'http://', 'www.'];
        for (let i = 0; i < ignoreStarts.length; i++) {
          let ignoreStart = ignoreStarts[i];
          if (url.includes(ignoreStart)) {
            url = url.substr(url.indexOf(ignoreStart) + ignoreStart.length);
          }
        }
      
        let ignoreEnds = ['/', '?', '#', '&'];
        for (let i = 0; i < ignoreEnds.length; i++) {
          let ignoreEnd = ignoreEnds[i];
          if (url.includes(ignoreEnd)) {
            url = url.substr(0, url.indexOf(ignoreEnd));
          }
        }
        url = url.toLowerCase();
        
        return url;
    }

    static runSiteSpecificInstructions() {
        let url = this.getUrl();

        chrome.storage.local.get(['siteData'], data => {
            data.siteData.sites.forEach(site => {
                if (this.urlMatches(site.url, url) && site.active) {
                    this.runCode(site.instructions);
                } 
            });
        });
    }

    static urlMatches(savedUrl, currentUrl) {
        if (!currentUrl) {
            return false;
        }
        // multiple strings
        let seperateUrls = savedUrl.split(',');
        if (seperateUrls.length > 1) {
            for (let i = 0; i < seperateUrls.length; i++) {
                if (this.urlMatches(seperateUrls[i].trim(), currentUrl)) {
                    return true;
                }
            }
            return;
        }
        // exact string
        if (savedUrl.includes('"')) {
            return currentUrl == savedUrl.replaceAll('"', '');
        }
        // includes string
        let splitUrlSections = savedUrl.split('*');
        for (let i = 0; i < splitUrlSections.length; i++) {
            if (!currentUrl.includes(splitUrlSections[i])) {
                return;
            }
            currentUrl = currentUrl.substring(currentUrl.indexOf(splitUrlSections[i]) + splitUrlSections[i].length);
        }
        return true;
    }

    
    /*
     * Code
     */
    
    static runCode(code) {
        try {
            new Function('', code)();
        } catch (e) {
            console.error('Nope error XD');
            console.error(e);
        }
    }
    
    /*
     * Cool Style
     */
    
    static setColor(color) {
        let style = this.getStyle('color');
        style.innerText = `
            * {
                color: ${color} !important;
            }
        `;
    }
    
    static setBackgroundColor(color) {
        let style = this.getStyle('bg-color');
        style.innerText = `
            * {
                background-color: ${color} !important;
            }
        `;
    }
    
    static coolStyle() {
        this.neatCss();
    }
    
    static neatCss() {
        let style = this.getStyle('neat-css');
        style.innerText = `
            * {
                background-color: ${this.getRandomRGB()} !important;
                color: ${this.getRandomRGB()} !important;
                font-family: ${this.getRandomCoolFont()};
            }
        `;
    }
    
    static getChildren(element) {
        return [...element.children];
    }
    
    static getRandomRGB() {
        return `rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)})`;
    }
    
    static getRandomCoolFont() {
        const fontFamilies = [
            'Consolas',
            'Comic Sans Ms',
            'Verdana',
            'Lucidia Console',
            'CopperPlate',
            'Papyrus',
            'Brush Script MT'
        ];
        return this.getRandomArrayElement(fontFamilies);
    }
    
    static getRandomArrayElement(array) {
        return array[Math.floor(Math.random()*array.length)];
    }

    /*
     * Mustache
     */
    static createMustache(mustacheCode) {
        this.runCode(mustacheCode);
    }

    /* 
     * Popup Scripts
     */

    static getScript(src) {
        let script = document.createElement('script');
        script.src = chrome.runtime.getURL(src);
        document.head.append(script);
        return script;
    }

    static getScripts(scripts, onload) {
        let script = scripts.splice(0, 1)[0];
        if (scripts.length < 1) {
            return this.getScript(script).onload = onload;
        }
        this.getScript(script).onload = () => {
            this.getScripts(scripts, onload);
        }
    }

    // run script on tab
    // helps with using popup scripts
    static createScript(body) {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.innerText = body;
        document.head.append(script);
    }

    // create style element on tab, will reuse existing if one with id exists
    static getStyle(id='toolkit-extension-style') {
        let style = document.getElementById(id);
        if (!style) {
            style = document.createElement('style');
            style.id = id;
        }
        // make sure style is last thing in head
        document.head.append(style);
        return style;
    }
}