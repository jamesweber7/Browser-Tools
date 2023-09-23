
/*
 * Scrapers
 */

document.addEventListener('DOMContentLoaded', () => {
    Scraper.setup();
});

class Scraper extends DataComponent {
    static documentElementId = 'scrapers-mb';
    static listId = 'scrapers-mb';
    static listpadType = 'scraperpad';
    static dataKey = 'scraperData';
    static buttonId ='scrapers-wand';

    static ACTIVE = 'Active';
    static INACTIVE = 'Inactive';
    static TEXTBOX_LOADING = 'Loading...';
    static TEXTBOX_NO_DATA = 'no data XP';

    static setupDocumentElement(data) {
        super.setupDocumentElement(data);
        this.button().addEventListener('click', () => {
            this.useScrapers();
        }, {once:true});
    }

    // decode data from document element and return local storage object
    static documentElementToLocalStorageObject() {
        let scrapers = [];
        this.list().getListpads().forEach(scraperpad => {
            scrapers.push(this.listpadToObject(scraperpad));
        });
        let data = this.initialize();
        data.scraperData.scrapers = scrapers;
        return data;
    }

    // update document element with retreived local storage data
    static localStorageObjectToDocumentElement(data) {
        this.list().createNewListpadButton('New Scraper', () => {
            this.prependScraperToPopup(this.createBlankScraperObject());
            this.updateDataFromPopup();
        });
        let scrapers = data.scraperData.scrapers;
        scrapers.forEach(scraper => {
            this.documentElement().append(this.createScraper(scraper));
        });
        return this.documentElement();
    }


    static addScraperToPopup(scraper) {
        this.documentElement().append(this.createScraper(scraper));
    }

    static prependScraperToPopup(scraper) {
        this.list().newListpadButton().after(this.createScraper(scraper));
    }

    static createScraper(scraper) {
        let listpad = this.createListpad(scraper.uid);
        let listbox = listpad.listbox;

        let displaybox = listbox.createElement('displaybox', 'displaybox');
        let textbox = document.createElement('textbox');
        textbox.innerText = this.TEXTBOX_NO_DATA;
        displaybox.append(textbox);
        let htmlbox = document.createElement('htmlbox');
        displaybox.append(htmlbox);
        
        let title = listbox.createElement('input', 'title');
        title.value = scraper.title;
        title.placeholder = 'New Scraper';
    
        let url = listbox.createElement('input', 'url');
        url.value = scraper.url;
        url.placeholder = 'Url';
    
        let instructions = listbox.createElement('textarea', 'instructions');
        instructions.className += ' code faux-console';
        instructions.value = scraper.instructions;
        instructions.placeholder = 'How to run scraper';
        instructions.spellcheck = false;
    
        let featuresMagicBox = listbox.createElement('magicbox', 'features-magicbox');
        featuresMagicBox.className = 'closed';
    
        let inputFeatureBtn = document.createElement('button');
        inputFeatureBtn.innerText = 'Inputs';
        let historyFeatureBtn = document.createElement('button');
        historyFeatureBtn.innerText = 'History';
    
        featuresMagicBox.append('Features Coming Soon');
        featuresMagicBox.append(inputFeatureBtn);
        featuresMagicBox.append(historyFeatureBtn);
    
        let reloadBtn = listbox.createElement('button', 'reload', [{'noUpdate':true}]);
        reloadBtn.innerText = 'Reload Data';
        reloadBtn.onclick = (() => {
            textbox.innerText = this.TEXTBOX_LOADING;
            htmlbox.innerHTML = '';
            this.scrapeData(this.listpadToObject(listpad.element()));
        });
    
        let activeBtn = listbox.createElement('button', 'active');
        activeBtn.innerText = scraper.active ? this.ACTIVE : this.INACTIVE;
        activeBtn.addEventListener('click', (() => {
            activeBtn.innerText = activeBtn.innerText === this.ACTIVE ? this.INACTIVE : this.ACTIVE;
        }));
    
        let featuresBtn = listbox.createElement('button', 'features', [{'noUpdate' : true}]);
        featuresBtn.innerText = 'Features';
        featuresBtn.onclick = (() => {
            Popup.toggleMagicBox(featuresMagicBox);
        });
    
        return listpad.element();
    
    }

    static listpadToObject(listpad) {
        return {
            title : listpad.getElementsByClassName('scraperpad-title')[0].value,
            url : listpad.getElementsByClassName('scraperpad-url')[0].value,
            instructions : listpad.getElementsByClassName('scraperpad-instructions')[0].value,
            active : listpad.getElementsByClassName('scraperpad-active')[0].innerText === this.ACTIVE,
            uid : listpad.getAttribute('uid')
        };
    }

    static initialize() {
        return {
            scraperData: {
                scrapers: [

                ]
            }
        };
    }

    static createBlankScraperObject() {
        return {
            title : '',
            url : '',
            instructions : '',
            active : false,
            uid : createUid()
        };
    }

    static useScrapers() {
        this.getData(data => {
            let scrapers = data.scraperData.scrapers;
            scrapers.forEach(scraper => {
                if (scraper.active) {
                    this.scrapeData(scraper);
                }
            });
        });
    }

    static scrapeData(scraper) {

        let instructions = scraper.instructions;
    
        instructions = instructions.replaceAll('display(', `Scraper.display(${scraper.uid},`);
        instructions = instructions.replaceAll('displayHTML(', `Scraper.displayHTML(${scraper.uid},`);
        instructions = instructions.replaceAll('styleDisplay(', `Scraper.styleDisplay(${scraper.uid},`);
        instructions = instructions.replaceAll('setUrl(', `Scraper.setScraperUrl(${scraper.uid},`);
        instructions = instructions.replaceAll('getDisplay()', `Scraper.getDisplaybox(${scraper.uid})`);
        instructions = instructions.replaceAll('getHtml()', `Scraper.getHtmlbox(${scraper.uid})`);
        instructions = instructions.replaceAll('getText()', `Scraper.getTextbox(${scraper.uid})`);
        instructions = instructions.replaceAll('getUrl()', `Scraper.getScraperUrl(${scraper.uid})`);
        instructions = instructions.replaceAll('getScraper()', `Scraper.list().getListpad(${scraper.uid})`);
        instructions = instructions.replaceAll('wipeDisplay()', `Scraper.wipeDisplay(${scraper.uid})`);
    
        let xhrFunction = getScraperFunction('xhr');
    
        if (instructions.trim()) {
            new Function('', instructions)();
        }
        scraperXHR();
    
        function getScraperFunction(tag) {
            tag = '.' + tag;
            const FUNCTION_START_STRING = '{{';
            const FUNCTION_END_STRING = '}}';
            if (!instructions.includes(tag)) {
                return;
            }
    
            let tagIndex = instructions.indexOf(tag);
            let scraperFunction = instructions.substring(tagIndex);
    
            let functionStartIndex = scraperFunction.indexOf(FUNCTION_START_STRING);
            scraperFunction = scraperFunction.substring(functionStartIndex + FUNCTION_START_STRING.length);
    
            let functionEndIndex = scraperFunction.indexOf(FUNCTION_END_STRING);
            scraperFunction = scraperFunction.substring(0, functionEndIndex);
    
            let newInstructions1 = tagIndex > 0 ? instructions.substring(0, tagIndex - 1) : '';
            let newInstructions2 = instructions.substring(tagIndex + functionStartIndex + FUNCTION_START_STRING.length + functionEndIndex + FUNCTION_END_STRING.length);
            instructions = newInstructions1 + newInstructions2;
    
            return scraperFunction;
        }
        
        function scraperXHR() {
            if (!xhrFunction) {
                return;
            }
    
            let xhr = new XMLHttpRequest();
            xhr.open("GET", scraper.url);
            xhr.onload = () => {
                if (xhr.readyState == 4) {
                    new Function('xhr', xhrFunction)(xhr);
                }
            };
            xhr.send();
        }
    }   
    
        
    static display(scraperUid, displayText) {
        this.list().getListpad(scraperUid).getElementsByTagName('textbox')[0].innerText = displayText;
    }

    static displayHTML(scraperUid, displayHTML) {
        this.list().getListpad(scraperUid).getElementsByTagName('htmlbox')[0].innerHTML = displayHTML;
        let textbox = this.list().getListpad(scraperUid).getElementsByTagName('textbox')[0];
        if (textbox.innerText === this.TEXTBOX_LOADING || textbox.innerText === this.TEXTBOX_NO_DATA) {
            this.display(scraperUid, '');
        }
    }

    static styleDisplay(scraperUid, style) {
        this.list().getListpad(scraperUid).getElementsByTagName('displaybox')[0].style += style;
    }

    static getDisplaybox(scraperUid) {
        return this.list().getListpad(scraperUid).getElementsByTagName('displaybox')[0];
    }

    static getHtmlbox(scraperUid) {
        return this.list().getListpad(scraperUid).getElementsByTagName('htmlbox')[0];
    }

    static getTextbox(scraperUid) {
        return this.list().getListpad(scraperUid).getElementsByTagName('textbox')[0];
    }

    static setScraperUrl(scraperUid, url) {
        this.list().getListpad(scraperUid).getElementsByClassName('scraperpad-url')[0].value = url;
    }

    static getScraperUrl(scraperUid) {
        return this.list().getListpad(scraperUid).getElementsByClassName('scraperpad-url')[0].value;
    }

    static wipeDisplay(scraperUid) {
        clearAllChildren(this.getHtmlbox(scraperUid));
        clearAllChildren(this.getTextbox(scraperUid));
    }

    /*
    * Listpad Elements
    */
    // static exposeScrapers(scrapers) {
    //     scrapers.forEach(scraper => {
    //         scrapersMagicBox.append(createScraper(scraper));
    //     });
    // }

    // static createScraper(scraper) {
    //     let listpad = Listpad.create(scraper.uid, 'scraperpad', saveScrapers);
    //     let listbox = listpad.listbox;
        
    //     let title = listbox.createElement('input', 'title');
    //     title.placeholder = 'New Note';
    //     title.value = scraper.title;
    //     title.placeholder = 'New Scraper';

    //     let url = listbox.createElement('input', 'url');
    //     url.value = scraper.url;
    //     url.placeholder = 'Url';

    //     let instructions = listbox.createElement('textarea', 'instructions');
    //     instructions.className += ' code faux-console';
    //     instructions.value = scraper.instructions;
    //     instructions.placeholder = 'How to run scraper';
    //     instructions.spellcheck = false;

    //     let featuresMagicBox = listbox.createElement('magicbox', 'features-magicbox');
    //     featuresMagicBox.className = 'open';

    //     let inputFeatureBtn = document.createElement('button');
    //     inputFeatureBtn.innerText = 'Inputs';
    //     let historyFeatureBtn = document.createElement('button');
    //     historyFeatureBtn.innerText = 'History';

    //     featuresMagicBox.append(inputFeatureBtn);
    //     featuresMagicBox.append(historyFeatureBtn);

    //     let reloadBtn = listbox.createElement('button', 'reload', [{'noUpdate':true}]);
    //     reloadBtn.innerText = 'Reload Data';
    //     reloadBtn.onclick = (() => {
    //         textbox.innerText = TEXTBOX_LOADING;
    //         htmlbox.innerHTML = '';
    //         scrapeData(getScraperObject(listpad.element()));
    //     });

    //     let activeBtn = listbox.createElement('button', 'active');
    //     activeBtn.innerText = scraper.active ? SCRAPER_ACTIVE : SCRAPER_INACTIVE;
    //     activeBtn.addEventListener('click', (() => {
    //         activeBtn.innerText = activeBtn.innerText === SCRAPER_ACTIVE ? SCRAPER_INACTIVE : SCRAPER_ACTIVE;
    //     }));

    //     let featuresBtn = listbox.createElement('button', 'features', [{'noUpdate':true}]);
    //     featuresBtn.innerText = 'Features';
    //     featuresBtn.onclick = (() => {
    //         if (featuresMagicBox.className === 'open') {
    //             instructions.after(featuresMagicBox);
    //         } else {
    //             featuresMagicBox.remove();
    //         }
    //         featuresMagicBox.className = featuresMagicBox.className === 'open' ? 'closed' : 'open';
    //     });

    //     return listpad.element();

    // }

    // static createScraperOld(scraper) {

    //     let scraperpad = document.createElement('listpad');
    //     scraperpad.className = 'scraperpad'
    //     scraperpad.setAttribute('uid', scraper.uid);

    //     let deleteBtn = document.createElement('button');
    //     deleteBtn.className = 'listpad-delete symbol-btn';
    //     deleteBtn.innerText = '×';
    //     deleteBtn.onclick = (() => {
    //         deleteScraper(scraperpad);
    //     });

    //     let scraperbox = document.createElement('listbox');

    //     let displaybox = document.createElement('displaybox');
    //     let textbox = document.createElement('textbox');
    //     displaybox.append(textbox);
    //     let htmlbox = document.createElement('htmlbox');
    //     displaybox.append(htmlbox);
    //     textbox.innerText = TEXTBOX_NO_DATA;


    //     let title = document.createElement('input');
    //     title.className = 'scraper-title';
    //     title.value = scraper.title;
    //     title.placeholder = 'New Scraper';
    //     title.addEventListener('input', saveScrapers);

    //     let url = document.createElement('input');
    //     url.className = 'scraper-url';
    //     url.value = scraper.url;
    //     url.placeholder = 'Url';
    //     url.addEventListener('input', saveScrapers);

    //     let instructions = document.createElement('textarea');
    //     instructions.className = 'scraper-instructions code faux-console';
    //     instructions.value = scraper.instructions;
    //     instructions.placeholder = 'How to run scraper';
    //     instructions.spellcheck = false;
    //     instructions.addEventListener('input', saveScrapers);
    //     addAutoResize(instructions);

    //     let featuresMagicBox = document.createElement('magicbox');
    //     featuresMagicBox.className = 'open';

    //     let inputFeatureBtn = document.createElement('button');
    //     inputFeatureBtn.innerText = 'Inputs';
    //     let historyFeatureBtn = document.createElement('button');
    //     historyFeatureBtn.innerText = 'History';


    //     featuresMagicBox.append(inputFeatureBtn);
    //     featuresMagicBox.append(historyFeatureBtn);

    //     let reloadBtn = document.createElement('button');
    //     reloadBtn.innerText = 'Reload Data';
    //     reloadBtn.onclick = (() => {
    //         textbox.innerText = TEXTBOX_LOADING;
    //         htmlbox.innerHTML = '';
    //         scrapeData(getScraperObject(scraperpad));
    //     });

    //     let activeBtn = document.createElement('button');
    //     activeBtn.className = 'scraper-active';
    //     activeBtn.innerText = scraper.active ? SCRAPER_ACTIVE : SCRAPER_INACTIVE;
    //     activeBtn.onclick = (() => {
    //         activeBtn.innerText = activeBtn.innerText === SCRAPER_ACTIVE ? SCRAPER_INACTIVE : SCRAPER_ACTIVE;
    //         saveScrapers();
    //     });

    //     let featuresBtn = document.createElement('button');
    //     featuresBtn.className = 'scraper-features';
    //     featuresBtn.innerText = 'Features';
    //     featuresBtn.onclick = (() => {
    //         if (featuresMagicBox.className === 'open') {
    //             instructions.after(featuresMagicBox);
    //         } else {
    //             featuresMagicBox.remove();
    //         }
    //         featuresMagicBox.className = featuresMagicBox.className === 'open' ? 'closed' : 'open';
    //     });

    //     scraperbox.append(displaybox);
    //     scraperbox.append(title);
    //     scraperbox.append(url);
    //     scraperbox.append(instructions);

    //     scraperbox.append(reloadBtn);
    //     scraperbox.append(activeBtn);
    //     scraperbox.append(featuresBtn);

    //     scraperpad.append(deleteBtn);
    //     scraperpad.append(scraperbox);
        
    //     addScraperRearrangeFunctionality(scraperpad);

    //     scrapersMagicBox.append(scraperpad);
    // }

    // static saveScrapers() {
    //     getScraperData(updateScrapersData);
    // }

    // static updateScrapersData(data) {
    //     let scrapers = [];
    //     [...document.getElementsByClassName('scraperpad')].forEach(scraperpad => {
    //         scrapers.push(getScraperObject(scraperpad));
    //     });
    //     data.scraperData.scrapers = scrapers;
    //     setData(data);
    // }

    // static getScraperObject(scraperpad) {
    //     return {
    //         title : scraperpad.getElementsByClassName('scraperpad-title')[0].value,
    //         url : scraperpad.getElementsByClassName('scraperpad-url')[0].value,
    //         instructions : scraperpad.getElementsByClassName('scraperpad-instructions')[0].value,
    //         active : scraperpad.getElementsByClassName('scraperpad-active')[0].innerText === SCRAPER_ACTIVE,
    //         uid : scraperpad.getAttribute('uid')
    //     };
    // }



}

// function useScrapers() {
//     getScraperData(data => {
//         let scrapers = data.scraperData.scrapers;
//         scrapers.forEach(scraper => {
//             if (scraper.active) {
//                 scrapeData(scraper);
//             }
//         });
//     });
// }

// function scrapeData(scraper) {

//     let instructions = scraper.instructions;

//     instructions = instructions.replaceAll('display(', `display(${scraper.uid},`);
//     instructions = instructions.replaceAll('displayHTML(', `displayHTML(${scraper.uid},`);
//     instructions = instructions.replaceAll('styleDisplay(', `styleDisplay(${scraper.uid},`);
//     instructions = instructions.replaceAll('setUrl(', `setScraperUrl(${scraper.uid},`);
//     instructions = instructions.replaceAll('getDisplay()', `getDisplaybox(${scraper.uid})`);
//     instructions = instructions.replaceAll('getHtml()', `getHtmlbox(${scraper.uid})`);
//     instructions = instructions.replaceAll('getText()', `getTextbox(${scraper.uid})`);
//     instructions = instructions.replaceAll('getUrl()', `getScraperUrl(${scraper.uid})`);
//     instructions = instructions.replaceAll('getScraper()', `getScraperOnPopup(${scraper.uid})`);
//     instructions = instructions.replaceAll('wipeDisplay()', `wipeDisplay(${scraper.uid})`);

//     let xhrFunction = getScraperFunction('xhr');

//     if (instructions.trim()) {
//         new Function('', instructions)();
//     }
//     scraperXHR();

//     function getScraperFunction(tag) {
//         tag = '.' + tag;
//         const FUNCTION_START_STRING = '{{';
//         const FUNCTION_END_STRING = '}}';
//         if (!instructions.includes(tag)) {
//             return;
//         }

//         let tagIndex = instructions.indexOf(tag);
//         let scraperFunction = instructions.substring(tagIndex);

//         let functionStartIndex = scraperFunction.indexOf(FUNCTION_START_STRING);
//         scraperFunction = scraperFunction.substring(functionStartIndex + FUNCTION_START_STRING.length);

//         let functionEndIndex = scraperFunction.indexOf(FUNCTION_END_STRING);
//         scraperFunction = scraperFunction.substring(0, functionEndIndex);

//         let newInstructions1 = tagIndex > 0 ? instructions.substring(0, tagIndex - 1) : '';
//         let newInstructions2 = instructions.substring(tagIndex + functionStartIndex + FUNCTION_START_STRING.length + functionEndIndex + FUNCTION_END_STRING.length);
//         instructions = newInstructions1 + newInstructions2;

//         return scraperFunction;
//     }
    
//     function scraperXHR() {
//         if (!xhrFunction) {
//             return;
//         }

//         let xhr = new XMLHttpRequest();
//         xhr.open("GET", scraper.url);
//         xhr.onload = () => {
//             if (xhr.readyState == 4) {
//                 new Function('xhr', xhrFunction)(xhr);
//             }
//         };
//         xhr.send();
//     }
// }

// function display(scraperUid, displayText) {
//     getScraperOnPopup(scraperUid).getElementsByTagName('textbox')[0].innerText = displayText;
// }

// function displayHTML(scraperUid, displayHTML) {
//     getScraperOnPopup(scraperUid).getElementsByTagName('htmlbox')[0].innerHTML = displayHTML;
//     let textbox = getScraperOnPopup(scraperUid).getElementsByTagName('textbox')[0];
//     if (textbox.innerText === TEXTBOX_LOADING || textbox.innerText === TEXTBOX_NO_DATA) {
//         display(scraperUid, '');
//     }
// }

// function styleDisplay(scraperUid, style) {
//     getScraperOnPopup(scraperUid).getElementsByTagName('displaybox')[0].style += style;
// }

// function getDisplaybox(scraperUid) {
//     return getScraperOnPopup(scraperUid).getElementsByTagName('displaybox')[0];
// }

// function getHtmlbox(scraperUid) {
//     return getScraperOnPopup(scraperUid).getElementsByTagName('htmlbox')[0];
// }

// function getTextbox(scraperUid) {
//     return getScraperOnPopup(scraperUid).getElementsByTagName('textbox')[0];
// }

// function setScraperUrl(scraperUid, url) {
//     getScraperOnPopup(scraperUid).getElementsByClassName('scraper-url')[0].value = url;
// }

// function getScraperUrl(scraperUid) {
//     return getScraperOnPopup(scraperUid).getElementsByClassName('scraper-url')[0].value;
// }

// function wipeDisplay(scraperUid) {
//     clearAllChildren(getHtmlbox(scraperUid));
//     clearAllChildren(getTextbox(scraperUid));
// }

// /*
//  * Listpad Elements
//  */
// function exposeScrapers(scrapers) {
//     scrapers.forEach(scraper => {
//         scrapersMagicBox.append(createScraper(scraper));
//     });
// }

// function createScraper(scraper) {
//     let listpad = Listpad.create(scraper.uid, 'scraperpad', saveScrapers);
//     let listbox = listpad.listbox;
    
//     let title = listbox.createElement('input', 'title');
//     title.placeholder = 'New Note';
//     title.value = scraper.title;
//     title.placeholder = 'New Scraper';

//     let url = listbox.createElement('input', 'url');
//     url.value = scraper.url;
//     url.placeholder = 'Url';

//     let instructions = listbox.createElement('textarea', 'instructions');
//     instructions.className += ' code faux-console';
//     instructions.value = scraper.instructions;
//     instructions.placeholder = 'How to run scraper';
//     instructions.spellcheck = false;

//     let featuresMagicBox = listbox.createElement('magicbox', 'features-magicbox');
//     featuresMagicBox.className = 'open';

//     let inputFeatureBtn = document.createElement('button');
//     inputFeatureBtn.innerText = 'Inputs';
//     let historyFeatureBtn = document.createElement('button');
//     historyFeatureBtn.innerText = 'History';

//     featuresMagicBox.append(inputFeatureBtn);
//     featuresMagicBox.append(historyFeatureBtn);

//     let reloadBtn = listbox.createElement('button', 'reload', [{'noUpdate':true}]);
//     reloadBtn.innerText = 'Reload Data';
//     reloadBtn.onclick = (() => {
//         textbox.innerText = TEXTBOX_LOADING;
//         htmlbox.innerHTML = '';
//         scrapeData(getScraperObject(listpad.element()));
//     });

//     let activeBtn = listbox.createElement('button', 'active');
//     activeBtn.innerText = scraper.active ? SCRAPER_ACTIVE : SCRAPER_INACTIVE;
//     activeBtn.addEventListener('click', (() => {
//         activeBtn.innerText = activeBtn.innerText === SCRAPER_ACTIVE ? SCRAPER_INACTIVE : SCRAPER_ACTIVE;
//     }));

//     let featuresBtn = listbox.createElement('button', 'features', [{'noUpdate':true}]);
//     featuresBtn.innerText = 'Features';
//     featuresBtn.onclick = (() => {
//         if (featuresMagicBox.className === 'open') {
//             instructions.after(featuresMagicBox);
//         } else {
//             featuresMagicBox.remove();
//         }
//         featuresMagicBox.className = featuresMagicBox.className === 'open' ? 'closed' : 'open';
//     });

//     return listpad.element();

// }

// function createScraperOld(scraper) {

//     let scraperpad = document.createElement('listpad');
//     scraperpad.className = 'scraperpad'
//     scraperpad.setAttribute('uid', scraper.uid);

//     let deleteBtn = document.createElement('button');
//     deleteBtn.className = 'listpad-delete symbol-btn';
//     deleteBtn.innerText = '×';
//     deleteBtn.onclick = (() => {
//         deleteScraper(scraperpad);
//     });

//     let scraperbox = document.createElement('listbox');

//     let displaybox = document.createElement('displaybox');
//     let textbox = document.createElement('textbox');
//     displaybox.append(textbox);
//     let htmlbox = document.createElement('htmlbox');
//     displaybox.append(htmlbox);
//     textbox.innerText = TEXTBOX_NO_DATA;


//     let title = document.createElement('input');
//     title.className = 'scraper-title';
//     title.value = scraper.title;
//     title.placeholder = 'New Scraper';
//     title.addEventListener('input', saveScrapers);

//     let url = document.createElement('input');
//     url.className = 'scraper-url';
//     url.value = scraper.url;
//     url.placeholder = 'Url';
//     url.addEventListener('input', saveScrapers);

//     let instructions = document.createElement('textarea');
//     instructions.className = 'scraper-instructions code faux-console';
//     instructions.value = scraper.instructions;
//     instructions.placeholder = 'How to run scraper';
//     instructions.spellcheck = false;
//     instructions.addEventListener('input', saveScrapers);
//     addAutoResize(instructions);

//     let featuresMagicBox = document.createElement('magicbox');
//     featuresMagicBox.className = 'open';

//     let inputFeatureBtn = document.createElement('button');
//     inputFeatureBtn.innerText = 'Inputs';
//     let historyFeatureBtn = document.createElement('button');
//     historyFeatureBtn.innerText = 'History';


//     featuresMagicBox.append(inputFeatureBtn);
//     featuresMagicBox.append(historyFeatureBtn);

//     let reloadBtn = document.createElement('button');
//     reloadBtn.innerText = 'Reload Data';
//     reloadBtn.onclick = (() => {
//         textbox.innerText = TEXTBOX_LOADING;
//         htmlbox.innerHTML = '';
//         scrapeData(getScraperObject(scraperpad));
//     });

//     let activeBtn = document.createElement('button');
//     activeBtn.className = 'scraper-active';
//     activeBtn.innerText = scraper.active ? SCRAPER_ACTIVE : SCRAPER_INACTIVE;
//     activeBtn.onclick = (() => {
//         activeBtn.innerText = activeBtn.innerText === SCRAPER_ACTIVE ? SCRAPER_INACTIVE : SCRAPER_ACTIVE;
//         saveScrapers();
//     });

//     let featuresBtn = document.createElement('button');
//     featuresBtn.className = 'scraper-features';
//     featuresBtn.innerText = 'Features';
//     featuresBtn.onclick = (() => {
//         if (featuresMagicBox.className === 'open') {
//             instructions.after(featuresMagicBox);
//         } else {
//             featuresMagicBox.remove();
//         }
//         featuresMagicBox.className = featuresMagicBox.className === 'open' ? 'closed' : 'open';
//     });

//     scraperbox.append(displaybox);
//     scraperbox.append(title);
//     scraperbox.append(url);
//     scraperbox.append(instructions);

//     scraperbox.append(reloadBtn);
//     scraperbox.append(activeBtn);
//     scraperbox.append(featuresBtn);

//     scraperpad.append(deleteBtn);
//     scraperpad.append(scraperbox);
    
//     addScraperRearrangeFunctionality(scraperpad);

//     scrapersMagicBox.append(scraperpad);
// }

// function saveScrapers() {
//     getScraperData(updateScrapersData);
// }

// function updateScrapersData(data) {
//     let scrapers = [];
//     [...document.getElementsByClassName('scraperpad')].forEach(scraperpad => {
//         scrapers.push(getScraperObject(scraperpad));
//     });
//     data.scraperData.scrapers = scrapers;
//     setData(data);
// }

// function getScraperObject(scraperpad) {
//     return {
//         title : scraperpad.getElementsByClassName('scraperpad-title')[0].value,
//         url : scraperpad.getElementsByClassName('scraperpad-url')[0].value,
//         instructions : scraperpad.getElementsByClassName('scraperpad-instructions')[0].value,
//         active : scraperpad.getElementsByClassName('scraperpad-active')[0].innerText === SCRAPER_ACTIVE,
//         uid : scraperpad.getAttribute('uid')
//     };
// }
