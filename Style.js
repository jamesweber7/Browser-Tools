
document.addEventListener('DOMContentLoaded', () => {
    Style.setup();
})

class Style extends StaticComponent {
    static buttonId = 'cool-style-btn';
    static documentElementId = 'cool-style-mb';
    static wand = document.getElementById('cool-style-wand');
    static colorSlider = document.getElementById('color-slider');
    static bgSlider = document.getElementById('bg-slider');
    static colorValue = document.getElementById('color-value');
    static bgValue = document.getElementById('bg-value');

    static setupDocumentElement() {
        this.button().addEventListener('click', this.coolStyle);
        this.wand.addEventListener('click', this.togglePlusMinus);
        this.colorSlider.oninput = this.selectColor;
        this.bgSlider.oninput = this.selectBackgroundColor;
    }

    static togglePlusMinus() {
        this.innerText = 
        this.innerText === '+' ?
            '-' :
            '+';
    }

    static coolStyle() {
        Popup.sendMessageToTab({
            title: 'COOL_STYLE'
        });
    }

    static selectColor() {
        let color = Style.getHexColor(this.value);

        Style.colorValue.innerText = color;

        Style.sendColorToTab(color);
    }


    static selectBackgroundColor() {
        let color = Style.getHexColor(this.value);

        Style.bgValue.innerText = color;

        Style.sendBackgroundColorToTab(color);
    }

    static getHexColor(value) {
        const f = n => {
            const k = (n + value / 30) % 12;
            const color = 0.5 - 0.5 * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`;
    }

    static sendColorToTab(color) {
        Popup.sendMessageToTab({
            title : 'SET_COLOR',
            color : color
        });
    }

    static sendBackgroundColorToTab(color) {
        Popup.sendMessageToTab({
            title : 'SET_BACKGROUND',
            color : color
        });
    }


}