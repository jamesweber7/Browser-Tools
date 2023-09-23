// component with local storage data attached to it
class DataComponent extends Component {

    static localStorageObject() {
        return LocalStorageObject.create(this.dataKey);
    }

    // loads data, then calls onLocalStorageLoaded
    static setup() {
        this.getData((data) => {this.onLocalStorageLoaded(data)});
    }

    // setup document element and send data to popup
    static onLocalStorageLoaded(data) {
        if (!hasData(data)) {
            return this.save(this.initialize(), () => {
                this.setup();
            });
        }
        this.setupDocumentElement(data);
    }

    static setupDocumentElement(data) {
        this.localStorageObjectToDocumentElement(data);
    }

    // blender
    // communication between document element and local storage

    // update local storage data with document element ui
    static updateDataFromPopup() {
        let data = this.documentElementToLocalStorageObject();
        this.localStorageObject().save(data);
    }

    // local storage
    static getData(callback) {
        return this.localStorageObject().get(callback);
    }

    static save(data, callback) {
        return this.localStorageObject().save(data, callback);
    }

    static list() {
        return new List(this.listId, this.listpadType, () => {
            this.updateDataFromPopup();
        });
    }

    static createListpad(uid) {
        return this.list().createListpad(uid);
    }

    static getLocalStorageObjectByUid(uid) {
        return this.listpadToObject(this.list().getListpad(uid));
    }

    static prependListpad(listpad) {
        this.list().newListpadButton().after(listpad);
    }

}