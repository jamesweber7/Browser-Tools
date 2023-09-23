
document.addEventListener('DOMContentLoaded', () => {
    Note.setup();
});

class Note extends DataComponent {

    static documentElementId = 'notes-mb';
    static listId = 'notes-mb';
    static listpadType = 'notepad';
    static dataKey = 'noteData';

    // decode data from document element and return local storage object
    static documentElementToLocalStorageObject() {
        let notes = [];
        [...document.getElementsByClassName(this.listpadType)].forEach(listpad => {
            notes.push({
                title: listpad.getElementsByClassName('notepad-title')[0].value,
                memo: listpad.getElementsByClassName('notepad-memo')[0].value,
                uid: listpad.getAttribute('uid')
            });
        });
        let data = this.initialize();
        data.noteData.notes = notes;
        return data;
    }

    // update document element with retreived local storage data
    static localStorageObjectToDocumentElement(data) {
        this.list().createNewListpadButton('New Note', () => {
            this.prependNoteToPopup(this.createBlankNoteObject());
            this.updateDataFromPopup();
        });
        let notes = data.noteData.notes;
        notes.forEach(note => {
            this.documentElement().append(this.createNote(note));
        });
        return this.documentElement();
    }

    static addNoteToPopup(note) {
        this.documentElement().append(this.createNote(note));
    }

    static prependNoteToPopup(note) {
        this.list().newListpadButton().after(this.createNote(note));
    }

    static createNote(note) {
        let listpad = this.createListpad(note.uid);
        let listbox = listpad.listbox;

        let title = listbox.createElement('input', 'title');
        title.placeholder = 'New Note';
        title.value = note.title;

        let memo = listbox.createElement('textarea', 'memo');
        memo.placeholder = 'This is my note';
        memo.value = note.memo;
        memo.spellcheck = false;

        return listpad.element();
    }
    
    static initialize() {
        return {
            noteData: {
                notes: [

                ]
            }
        };
    }

    static createBlankNoteObject() {
        return {
            uid: createUid(),
            title: '',
            memo: ''
        }
    }

}
