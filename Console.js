
document.addEventListener('DOMContentLoaded', () => {
    Console.setup();
})

class Console extends StaticComponent {

    static buttonId = 'console-execute-btn';
    static locationToggle = document.getElementById('console-location-toggle');
    static input = document.getElementById('console-input');
    static output = document.getElementById('console-output');
    static magicbox = document.getElementById('console-mb');
    static setupDocumentElement() {
        this.button().onclick = this.runCode;
        this.locationToggle.onclick = this.toggleConsoleLocation;
    }

    static runCode() {
        Console.output.innerText = '';
        if (Console.locationToggle.innerText === 'tab') {
            Console.runOnTab();
        } else {
            Console.runOnPopup();
        }
    }

    static runOnTab() {
        let code = Console.code();
        Code.sendCodeToTab(code);
    }

    static runOnPopup() {
        let code = Console.code();
        code = code.replaceAll('console.log(', 'consolePrint(');
        code = code.replaceAll('"', '\"');
        try {
            new Function('consolePrint',code)(consolePrint);
        } catch(e) {
            consoleErr(e);
        }
        function consolePrint(msg) {
            Popup.openMagicBox(Console.magicbox);
            Console.output.innerText += msg + '\n'; 
            console.log(msg); 
        }
        function consoleErr(errorMsg) {
            let err = document.createElement('err');
            err.innerText = errorMsg;
            Console.output.append(err);
            console.error(errorMsg); 
        }
    }

    static toggleConsoleLocation() {
        if (this.innerText === 'tab') {
            this.innerText = 'popup'
        } else {
            this.innerText = 'tab'
        }
    }

    static code() {
        return this.input.value;
    }
}