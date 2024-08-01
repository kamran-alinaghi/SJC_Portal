export function CreateAddButton() {
    return '<div class="center-element one-column vertical-margin"><button id="add-new-project-button" type = "button" class="center-element large-button main-button">+</button ></div >';
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
        let res = '<div class="center-element one-column vertical-margin">';
        res += '<div class="flex-container">';
        res += '<button type="button" class="project-button large-button main-button" data-rel="' + this.#noSpaceTitle + '-section" data-editButton="' + this.#noSpaceTitle + '-editbutton">' + this.Title + '</button>';
        res += '<button id="' + this.#noSpaceTitle + '-editbutton" type="button" class="main-button edit-button">Edit</button>';
        res += '</div>';

        res += '<div id="' + this.#noSpaceTitle + '-section" class="hidden-block two-column">';
        res += '<button type="button" class="compelete-button main-button" data-model-name="' + this.#noSpaceTitle + '-compelete">Move To Compelete</button>';
        res += '<div>';
        res += '<button type="button" class="small-button main-button float-right" data-model-name="' + this.#noSpaceTitle + '-summary">Summary</button>';
        res += '<button type="button" class="small-button main-button float-right" data-model-name="' + this.#noSpaceTitle + '-framing">Framing</button>';
        res += '<button type="button" class="small-button main-button float-right" data-model-name="' + this.#noSpaceTitle + '-forming">Forming</button>';
        res += '</div>';

        res += '</div>';
        res += '</div>';
        return res;
    }
}