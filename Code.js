
class Code {
    static sendCodeToTab(code) {
        Popup.sendMessageToTab({
            title : 'RUN_CODE',
            code : code
        });
    }
}