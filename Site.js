
document.addEventListener('DOMContentLoaded', () => {
    Site.setup();
});

class Site extends DataComponent {

    static documentElementId = 'sites-mb';
    static listId = 'sites-mb';
    static listpadType = 'sitepad';
    static dataKey = 'siteData';

    static AUTOMATIC = 'Automatic';
    static MANUAL = 'Manual';

    static setup() {
        this.requestUrl();
        super.setup();
    }

    static documentElementToLocalStorageObject() {
        let sites = [];
        [...document.getElementsByClassName(this.listpadType)].forEach(listpad => {
            sites.push({
                title: listpad.getElementsByClassName('sitepad-title')[0].value,
                url: listpad.getElementsByClassName('sitepad-url')[0].value,
                instructions: listpad.getElementsByClassName('sitepad-instructions')[0].value,
                active: listpad.getElementsByClassName('sitepad-active')[0].innerText == this.AUTOMATIC,
                uid: listpad.getAttribute('uid')
            });
        });
        let data = this.initialize();
        data.siteData.sites = sites;
        return data;
    }

    static localStorageObjectToDocumentElement(data) {
        this.list().createNewListpadButton('New Site', () => {
            this.prependSiteToPopup(this.createBlankSiteObject());
            this.updateDataFromPopup();
        });
        let sites = data.siteData.sites;
        sites.forEach(site => {
            this.documentElement().append(this.createSite(site));
        });
        return this.documentElement();
    }

    static prependSiteToPopup(site) {
        this.prependListpad(this.createSite(site));
    }

    static addSiteToPopup(site) {
        this.documentElement().append(this.createSite(site));
    }

    static createSite(site) {
        let listpad = this.createListpad(site.uid);
        let listbox = listpad.listbox;

        let title = listbox.createElement('input', 'title');
        title.placeholder = 'description';
        title.value = site.title;
        
        let url = listbox.createElement('input', 'url');
        url.placeholder = 'site';
        url.value = site.url;

        let instructions = listbox.createElement('textarea', 'instructions');
        instructions.className += ' code faux-console';
        instructions.placeholder = 'Site instructions';
        instructions.value = site.instructions;
        instructions.spellcheck = false;

        let reloadBtn = listbox.createElement('button', 'reload', [{'noUpdate':true}]);
        reloadBtn.innerText = 'Reload';
        reloadBtn.onclick = (() => {
            this.runInstructions(instructions.value);
        });
    
        let activeBtn = listbox.createElement('button', 'active');
        activeBtn.innerText = site.active ? this.AUTOMATIC : this.MANUAL;
        activeBtn.addEventListener('click', (() => {
            activeBtn.innerText = activeBtn.innerText === this.AUTOMATIC ? this.MANUAL : this.AUTOMATIC;
        }));

        return listpad.element();
    }
    
    static initialize() {
        return {
            siteData: {
                sites: [

                ]
            }
        };
    }

    static createBlankSiteObject() {
        return {
            title: '',
            url: this.getSimpleUrl(),
            instructions: '',
            active: false,
            uid: createUid()
        }
    }

    static requestUrl() {
        Popup.sendMessageToTab({
            title: 'SEND_URL'
        });
    }

    static setUrl(url) {
        this.prependMatching(url);

        let simpleUrl = this.simplifyUrl(url);

        this.list().getListpads().forEach(listpad => {
            let urlInput = listpad.getElementsByClassName('sitepad-url')[0];
            urlInput.setAttribute('placeholder', simpleUrl);
            if (!urlInput.value) {
                urlInput.value = simpleUrl;
            }
        });
        this.list().newListpadButton().setAttribute('current-site', url);
    }

    static getUrl() {
        return this.list().newListpadButton().getAttribute('current-site');
    }

    static getSimpleUrl() {
        return this.simplifyUrl(this.getUrl());
    }

    static simplifyUrl(url) {
        if (!url) {
            return '';
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

    static runInstructions(instructions) {
        Code.sendCodeToTab(instructions);
    }

    static prependMatching(url) {
        this.getData((data) => {
            let sites = data.siteData.sites;
            sites.forEach(site => {
                if (this.urlMatches(site.url, url)) {
                    this.prependListpad(this.list().getListpad(site.uid));
                }
            })
        });
    }

    // copy+pasted form Tab.js
    static urlMatches(savedUrl, currentUrl) {
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

    static sendInstructionsMatchingUrl(url) {
        url = this.simplifyUrl(url);
        this.getData((data) => {
            let sites = data.siteData.sites;
            sites.forEach(site => {
                if (site.url == url) {
                    if (site.active) {
                        this.runInstructions(site.instructions);
                    }
                }
            })
        });
    }

}