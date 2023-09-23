
document.addEventListener('DOMContentLoaded', () => {
    Graph.setup();
})

class Graph extends StaticComponent {
    static documentElementId = 'graph';
    static buttonId = 'graph-calculator-wand';

    static setupDocumentElement() {
        this.button().addEventListener('click', () => {
            this.documentElement().src = 'https://weber-84.herokuapp.com/';
        }, {once:true});        
    }
}