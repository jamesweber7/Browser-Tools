
/*
 * Local Storage
 */

// Setup

class LocalStorage {

    static getData(key, callback) {
        chrome.storage.local.get([key], (data) => {
            if (callback) {
                callback(data);
            }
        }); 
    }

    static setData(data, callback) {
        chrome.storage.local.set(data, (data) => {
            if (callback) {
                callback(data);
            }
        });
    }
}

function setupData() {
    setupNoteData();
    setupStyleData();
    setupCodeData();
    setupScraperData();
    setupScheduleData();
}

function setupNoteData() {
    getNoteData(data => {
        if (!hasData(data)) {
            return createNoteData(setupNoteData);
        }
        exposeNotes(data.noteData.notes);
    });
}

function setupStyleData() {
    getStyleData(data => {
        if (!hasData(data)) {
            return createStyleData(setupStyleData);
        }
    });
}

function setupCodeData() {
    getCodeData(data => {
        if (!hasData(data)) {
            return createCodeData(setupCodeData);
        }
    });
}

function setupScraperData() {
    getScraperData(data => {
        if (!hasData(data)) {
            return createScraperData(setupScraperData);
        }
        exposeScrapers(data.scraperData.scrapers);
    });
}

function setupScheduleData() {
    getScheduleData(data => {
        if (!hasData(data)) {
            return createScheduleData(setupScheduleData);
        }
        exposeSchedule(data.scheduleData.upcoming);
    });
}

function getData(key, callback) {
    chrome.storage.local.get([key], (data) => {
        if (callback) {
            callback(data);
        }
    });
}

function setData(data, callback) {
    chrome.storage.local.set(data, (data) => {
        if (callback) {
            callback(data);
        }
    });
}

function getNoteData(callback) {
    getData('noteData', callback);
}

function getStyleData(callback) {
    getData('styleData', callback);
}

function getCodeData(callback) {
    getData('codeData', callback);
}

function getScraperData(callback) {
    getData('scraperData', callback);
}

function getScheduleData(callback) {
    getData('scheduleData', callback);
}

function hasData(data) {
    return !!Object.keys(data).length;
}

function createData() {
    createNoteData();
    createStyleData();
    createCodeData();
    createScraperData();
    createScheduleData();
    setTimeout(setupData, 100);
}

function createNoteData(callback) {
    let noteData = {
        notes : [
            getNewNoteObject()
        ]
    };
    setData({noteData:noteData}, callback);
}

function createStyleData(callback) {
    let styleData = {
        styles : [

        ]
    };
    setData({styleData:styleData}, callback);
}

function createCodeData(callback) {
    let codeData = {
        recent : [

        ]
    }
    setData({codeData:codeData}, callback);
}

function createScraperData(callback) {
    let scraperData = {
        scrapers : [
            getNewScraperObject()
        ]
    };
    setData({scraperData:scraperData}, callback);
}

function createScheduleData(callback) {
    let scheduleData = {
        upcoming : [
            getNewScheduleObject()
        ]
    };
    setData({scheduleData:scheduleData}, callback);
}

function printAllData() {
    getNoteData(data => {
        consolePrint(data);
    });
    getStyleData(data => {
        consolePrint(data);
    });
    getCodeData(data => {
        consolePrint(data);
    });
    getScheduleData(data => {
        consolePrint(data);
    });
    getScraperData(data => {
        consolePrint(data);
    });
}