class Component {
    
    static documentElement() {
        return document.getElementById(this.documentElementId);
    }
    
    static button() {
        return document.getElementById(this.buttonId);
    }
}
