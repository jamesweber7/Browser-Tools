document.addEventListener('DOMContentLoaded', () => {
    DataTab.setup();
});

class DataTab extends StaticComponent {
    static documentElementId = 'datatab-mb';

    static copyButtonId = 'datatab-copy';
    static importButtonId = 'datatab-import';
    static hiddenInputId = 'import-clipboard-data-input';
    
    static setupDocumentElement() {
        DataTab.copyDataButton().addEventListener('click', () => {DataTab.copyData();});
        DataTab.importDataButton().onclick = DataTab.importDataButtonClicked;
        DataTab.hiddenInput().oninput = () => {
            let val = DataTab.hiddenInput().value;
            DataTab.hiddenInput().value = "";
            if (!this.importDataButton().classList.contains("on-confirm"))
                return;
            try {
                DataTab.importData(DataTab.textToData(val));
                DataTab.unconfirmImportData();
            } catch {
                DataTab.invalidImportData();
            }
        }
    }

    static copyData() {
        DataTab.getAllData((data) => {
            copy(JSON.stringify(data));
        });
    }

    static importData(allData) {
        const data_components = [
            Site,
            Note,
            Scraper,
        ];
        let num_saved = 0;
        data_components.forEach(component => {
            component.getData((existingData) => {
                let importData = allData[component.dataKey];
                let newData = DataTab.recursiveDataAdd(existingData, importData);
                component.save(newData, () => {
                    num_saved++;
                    if (num_saved == data_components.length) {
                        setTimeout(() => {
                            location.reload();
                        }, 1000);
                    }
                });
            });
        });
    }

    static getAllData(callback) {
        const data_components = [
            Site,
            Note,
            Scraper,
        ];
        let allData = {
            "keys": []
        };
        let i = 0;
        data_components.forEach(component => {
            component.getData((data) => {
                allData[component.dataKey] = data;
                i++;
                if (i == data_components.length)
                    callback(allData);
            })
        });
        
    }

    static recursiveDataAdd(existingData, importData) {
        // terminal cases
        if (DataTab.recursiveDataEquals(existingData, importData))
            return existingData;
        if (existingData == undefined || existingData == null)
            return importData;
        if (importData == undefined || importData == null)
            return existingData;
        if (!Object.keys(existingData).length)
            return importData;
        if (typeof existingData == 'string' || typeof importData == 'string')
            return importData;

        // recursive case

        // Array
        let cumulativeData;
        if (Array.isArray(existingData)) {
            if (!Array.isArray(importData))
                return importData;
            cumulativeData = importData;
            for (let i = 0; i < existingData.length; i++) {
                for (let j = 0; j < cumulativeData.length; j++) {
                    while (i < existingData.length && DataTab.recursiveDataEquals(existingData[i], cumulativeData[j])) {
                        existingData.splice(i, 1);
                        j = 0;
                    }
                }
                if (i < existingData.length)
                    cumulativeData.push(existingData[i]);
            }
            return cumulativeData;
        }

        // Object
        cumulativeData = existingData
        let sharedKeys = [];
        let existingOnlyKeys = [...Object.keys(existingData)];
        let importOnlyKeys = [...Object.keys(importData)];
        for (let i = 0; i < existingOnlyKeys.length; i++) {
            for (let j = 0; j < importOnlyKeys.length; j++) {
                while (i < existingOnlyKeys.length && existingOnlyKeys[i] == importOnlyKeys[j]) {
                    sharedKeys.push(existingOnlyKeys.splice(i, 1));
                    importOnlyKeys.splice(j, 1);
                    j = 0;
                }
            }
        }

        // import only
        importOnlyKeys.forEach(key => {
            cumulativeData[key] = importData[key];
        });
        // shared
        sharedKeys.forEach(key => {
            cumulativeData[key] = DataTab.recursiveDataAdd(existingData[key], importData[key]);
        });
        return cumulativeData;
    }

    static recursiveDataEquals(data1, data2) {
        if (data1 == undefined || data1 == null)
            return data1 == data2;
        if (data2 == undefined || data2 == null)
            return false;
        if (!Object.keys(data1).length && !Object.keys(data2).length)
            return data1 == data2;
        if (!Object.keys(data1).length ^ !Object.keys(data2).length)
            return false;
        if (typeof data1 == 'string')
            return data1 == data2;

        let keys = [...Object.keys(data1)].concat([...Object.keys(data2)])
        const tested_keys = [];
        for (let key of keys) {
            if (!tested_keys.includes(key)) {
                tested_keys.push(key);
                if (!DataTab.recursiveDataEquals(data1[key], data2[key]))
                    return false;
            }
        }
        return true;
    }

    static importDataButtonClicked() {
        if (!DataTab.importDataButton().classList.contains('on-confirm')) {
            DataTab.confirmImportData();
        }
        DataTab.prepareForHiddenInput();
    }

    static textToData(text) {
        return JSON.parse(text.trim());
    }

    static confirmImportData() {
        const seconds_to_confirm = 1;
        if (!DataTab.importDataButton().classList.contains('shift-right'))
            DataTab.importDataButton().classList.add('shift-right');
        setTimeout(() => {
            if (!DataTab.importDataButton().classList.contains('on-confirm'))
                DataTab.importDataButton().classList.add('on-confirm');
        }, seconds_to_confirm*1000);
        setTimeout(() => {
            DataTab.importDataButton().innerText = 'Paste Data';
        }, ( seconds_to_confirm/2 )*1000);

        // warning div
        if (document.getElementById('confirm-warning'))
            return;
        let warningDiv = document.createElement('div');
        warningDiv.id = 'confirm-warning';
        warningDiv.style = 'position: absolute; left: 20px; cursor: pointer;';
        warningDiv.innerText = '↩ Warning: this may mess up your data';
        warningDiv.className = 'opacity-0';
        warningDiv.title = 'Go back to safety';
        warningDiv.onclick = () => {DataTab.unconfirmImportData();}
        DataTab.importDataButton().before(warningDiv);
        setTimeout(() => {
            warningDiv.className = 'opacity-100';
        }, 0);
    }

    static unconfirmImportData() {
        DataTab.importDataButton().innerText = 'Import Data';
        document.getElementById('confirm-warning').remove();
        while (DataTab.importDataButton().classList.contains('shift-right'))
            DataTab.importDataButton().classList.remove('shift-right');
        while (DataTab.importDataButton().classList.contains('on-confirm'))
            DataTab.importDataButton().classList.remove('on-confirm');
    }

    static invalidImportData() {
        document.getElementById('confirm-warning').innerText = "Invalid import format";
    }

    static copyDataButton() {
        return document.getElementById(DataTab.copyButtonId);
    }
    static importDataButton() {
        return document.getElementById(DataTab.importButtonId);
    }
    static hiddenInput() {
        return document.getElementById(DataTab.hiddenInputId);
    }
    static prepareForHiddenInput() {
        DataTab.hiddenInput().value = "";
        DataTab.hiddenInput().focus();
    }
}