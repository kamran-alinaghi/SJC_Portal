export const val = "kam";
/**
 * 
 * @param {string} title
 * @returns
 */
export function CreateButtonBox(title) {
    let res = "";
    const noSpaceTitle = title.replace(/\s/g, '');
    res = '<div class="center-element one-column vertical-margin">'
    res += '<button type="button" class="project-button large-button main-button" data-rel="' + noSpaceTitle + '-section">' + title + '</button>'
    res += '<div id="' + noSpaceTitle + '-section" class="float-right hidden-block">';

    res += '<button type="button" class="small-button main-button">Framing</button>';
    res += '<button type="button" class="small-button main-button">Forming</button>';

    res += '</div>';
    res += '</div>';
    return res;
}

export function CreateAddButton() {
    return '<div class="center-element one-column vertical-margin"><button type = "button" class="center-element large-button main-button">+</button ></div >';
}