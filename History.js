
class History extends LocalStorageObject {

    constructor() {
        super('historyData');
    }

    static append(deleted) {
        let obj = new this();
        obj.get((data) => {
            if (deleted.outerHTML) {
                data.historyData.push(deleted.outerHTML);
            } else {
                data.historyData.push(deleted);
            }
            obj.save(data);
        });
    }

    static print() {
        new this().get((data) => {
            console.log(data.historyData);
        });
    }

    static clear() {
        let obj = new this();
        obj.get((data) => {
            data.historyData = [];
            obj.save(data);
        });
    }

}