class LocalStorageObject {

    constructor(dataKey) {
        this.dataKey = dataKey;
    }

    static create(dataKey) {
        return new this(dataKey);
    }

    get(callback) {
        LocalStorage.getData(this.dataKey, callback);
    }

    save(data, callback) {
        LocalStorage.setData(data, callback);
    }

    static createUid() {
        return Math.floor(Math.random()*Number.MAX_SAFE_INTEGER);
    }

}
