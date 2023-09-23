
document.addEventListener('DOMContentLoaded', () => {
    Mustache.setup();
})

class Mustache extends StaticComponent {
    static buttonId = 'mustache-btn';
    static numMustaches = 0;
    static setupDocumentElement() {
        this.button().onclick = this.sendMustacheToTab;
    }

    static sendMustacheToTab() {
        Code.sendCodeToTab(Mustache.mustacheFunctionCode());
        this.numMustaches ++;
    }

    static mustacheFunctionCode() {
        let body = document.body;
        let html = document.documentElement;
        let width = Math.max( body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth );
        let left = Math.floor(width * 0.5);
        let top = 120;
        let mustacheStyle = `z-index:1000000;position:absolute;background:transparent !important;left:${left}px;top:${top}px;`;
        let mustacheSrc = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAMCAYAAAAUNi9wAAAAAXNSR0IArs4c6QAAAHxJREFUOI1jDNUQ+c8AAYwMWMDqG29Q+KEaItiUMTAwMPzHIU4Vc5lwyQ42wIgUohhyBPTi0kfQTnLMHTIhysKA8CG6T8gNMUKAVHMZGRiGUIjSwqGMDITTIclgyIQoCxIbV1odKIASK0MmROGuJqPGwWkWNfXDarAhE6IAXdwWPJlFQ8AAAAAASUVORK5CYII=";
        let mustacheId = 'mustache' + this.numMustaches;

        let moveMustache = (e) => {
            if (!e.clientX && !e.clientY) {
                return;
            }
            let el = e.target;
            el.style.left = e.pageX - el.width * 0.5 + 'px';
            el.style.top = e.pageY - el.height * 0.5 + 'px';
        }

        let zoom = (e) => {
            e.preventDefault();
            let el = e.target;
            let scale = el.style.transform;
            if (!scale) {
                el.style.transform = 'scale(1)';
            } else {
                let change = e.deltaY < 0 ? 0.5 : -0.5;
                scale = scale.replaceAll('scale(', '');
                scale = scale.replaceAll(')', '');
                scale =  Number.parseFloat(scale) + change;
                if (scale < 0.5) {
                    scale = 0.5;
                }
                el.style.transform = `scale(${scale})`;
            }
        }
        return `
        let mustache = document.createElement('img');
        mustache.src = '${mustacheSrc}';
        mustache.id = '${mustacheId}';
        mustache.style = '${mustacheStyle}';
        mustache.draggable = true;
        mustache.ondrag = ${moveMustache};
        document.body.append(mustache);
        mustache.onmousewheel = ${zoom};
        `;
    }
}