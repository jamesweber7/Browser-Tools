class Listpad {

    constructor(uid, type, save) {

        this.save = save;

        this.listpad = document.createElement('listpad');
        this.listpad.setAttribute('uid', uid);
        this.listpad.className = type;

        let deleteBtn = document.createElement('button');
        deleteBtn.className = 'listpad-delete symbol-btn';
        deleteBtn.innerText = '×';
        deleteBtn.onclick = this.delete;
        this.append(deleteBtn);

        this.listbox = new Listbox(type, save);
        this.append(this.listbox.element());
    }

    append(child) {
        this.listpad.append(child);
    }

    uid() {
        return this.listpad.getAttribute('uid');
    }

    type() {
        return this.listpad.getAttribute('class');
    }

    append(child) {
        return this.listpad.append(child);
    }

    remove() {
        this.listpad.remove();
    }

    delete = () => {
        this.remove();
        History.append(this.listpad);
        this.save();
    }

    element() {
        return this.listpad;
    }

}
