
document.addEventListener('DOMContentLoaded', () => {
    Graph.setup();
})

class Graph extends StaticComponent {
    static documentElementId = 'graph';
    static buttonId = 'graph-calculator-wand';

    static setupDocumentElement() {
        this.button().addEventListener('click', () => {
            this.documentElement().src = 'https://elaborate-pegasus-3533db.netlify.app/';
        }, {once:true});        
    }
}