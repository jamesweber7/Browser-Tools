
let draggedListpad = null;
class List {

    constructor(listId, listpadType, save) {
        this.list = document.getElementById(listId);
        this.listpadType = listpadType;
        this.save = save;
    }

    newListpadButton() {
        const className = 'new-listpad-btn';
        return this.list.getElementsByClassName(className)[0];
    }

    createNewListpadButton(title, onclick) {
        const className = 'new-listpad-btn'
        if (this.list.getElementsByClassName(className)[0]) {
            return;
        }
        let newBtn = document.createElement('button');
        newBtn.className = className;
        newBtn.innerText = title;
        newBtn.onclick = onclick;
        this.list.prepend(newBtn);
    }

    createListpad(uid) {
        let listpad = new Listpad(uid, this.listpadType, this.save);
        this.addDragFunctionality(listpad.element());
        return listpad;
    }

    getListpad(uid) {
        let listpads = this.getListpads();
        for (let i = 0; i < listpads.length; i++) {
            if (listpads[i].getAttribute('uid') == uid) {
                return listpads[i];
            }
        }
    }

    getListpads() {
        return [...document.getElementsByClassName(this.listpadType)];
    }

    addDragFunctionality(listpad) {

        listpad.setAttribute('draggable', true);

        let save = this.save;
        let listpadType = this.listpadType;
    
        listpad.addEventListener('dragstart', dragStart);
        listpad.addEventListener('dragenter', dragEnter);
        listpad.addEventListener('dragend', dragEnd);
    
        function dragStart(e) {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                draggedListpad = null;
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            draggedListpad = listpad;
        }
    
        function dragEnter() {
            let listpads = [...document.getElementsByClassName(listpadType)];

            if (!draggedListpad) {
                return;
            }
            if (draggedListpad.className != listpadType) {
                return;
            }
    
            if (listpads.indexOf(draggedListpad) < listpads.indexOf(listpad)) {
                listpad.after(draggedListpad);
            } else {
                listpad.before(draggedListpad);
            }
        }
    
        function dragEnd() {     
            if (!draggedListpad) {
                return;
            }
    
            save();
            setTimeout(setDraggedNull, 0.05);
    
            function setDraggedNull() {
                draggedListpad = null;
            }
    
        }
    }

}
