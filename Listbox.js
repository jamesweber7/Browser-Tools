
class Listbox {

    constructor(type, save) {
        this.save = save;
        this.type = type;
        this.listbox = document.createElement('listbox');
    }

    createElement(tag, title, options=[]) {
        let child = document.createElement(tag);
        child.className = `${this.type}-${title}`;
        if (!option('noUpdate')) {
            switch (tag) {
                case 'textarea':
                case 'input':
                    child.addEventListener('input', this.save);
                    break;
                case 'button':
                    child.addEventListener('click', () => {
                        setInterval(this.save, 5);
                    });
                    break;
            }
        }
        switch (tag) {
            case 'textarea':
                Popup.addAutoResize(child);
                break;
        }
        this.listbox.append(child);
        return child;

        function option(title) {
            for (let i = 0; i < options.length; i++) {
                if (options[i].title == title) {
                    return options[i].value;
                } 
            }
        }
    }

    element() {
        return this.listbox;
    }

}
