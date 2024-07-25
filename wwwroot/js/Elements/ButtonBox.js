export function CreateAddButton() {
    return '<div class="center-element one-column vertical-margin"><button type = "button" class="center-element large-button main-button">+</button ></div >';
}

export class ButtonBox {
    Title;
    #noSpaceTitle;
    /**
     * 
     * @param {string} title
     */
    constructor(title) {
        this.Title = title;
        this.#noSpaceTitle = title.replace(/\s/g, '');
    }

    CreateButtonBox() {
        let res = '<div class="center-element one-column vertical-margin">'
        res += '<button type="button" class="project-button large-button main-button" data-rel="' + this.#noSpaceTitle + '-section">' + this.Title + '</button>'
        res += '<div id="' + this.#noSpaceTitle + '-section" class="float-right hidden-block">';

        res += '<button type="button" class="small-button main-button" data-model-name="' + this.#noSpaceTitle + '-framing">Framing</button>';
        res += '<button type="button" class="small-button main-button" data-model-name="' + this.#noSpaceTitle + '-forming">Forming</button>';

        res += '</div>';
        res += '</div>';
        return res;
    }
}