import { SJC_Project } from "../ProjectClass/SJC_Project.js";
export function CreateAddButton() {
    return '<div class="center-element vertical-margin"><button id="add-new-project-button" type="button" class="center-element large-button main-button">+</button></div>';
}
/**
 * 
 * @param {number} count
 * @returns
 */
export function MoreProjectsButton(count) {
    return '<div class="center-element vertical-margin"><button id="past-projects" type="button" class="large-button compelete-main-button" data-rel="past-projects-container" ' + (count < 1 ? 'disabled' : '') + '>Past Projects (' + count + ')</button></div>';
}

export class ButtonBox {
    Project;
    #ProjectBtnClasses;
    #EditBtnClasses;
    #CompeleteButtonClasses;
    #CompeleteBtnText;
    /**
     * 
     * @param {SJC_Project} SJC_Project
     */
    constructor(SJC_Project) {
        this.Project = SJC_Project;
        if (SJC_Project.IsCompelete) {
            this.#ProjectBtnClasses = ['compelete-main-button', 'large-button', 'project-button'];
            this.#EditBtnClasses = ['edit-button', 'compelete-main-button'];
            this.#CompeleteButtonClasses = ['uncompelete-button', 'sub-button'];
            this.#CompeleteBtnText = "Current";
        }
        else {
            this.#ProjectBtnClasses = ['main-button', 'large-button', 'project-button'];
            this.#EditBtnClasses = ['edit-button', 'main-button'];
            this.#CompeleteButtonClasses = ['compelete-button', 'sub-button'];
            this.#CompeleteBtnText = "Compelete";
        }

    }

    CreateButtonBox() {
        let res = '<div class="center-element one-column vertical-margin">';
        res += '<div class="flex-container">';
        res += '<button id="btn-' + this.Project.Id +'" type="button" class="project-button large-button ' + this.GetClasses(this.#ProjectBtnClasses) + '" data-rel="' + this.Project.Id + '-section" data-editButton="' + this.Project.Id + '-editbutton">' + this.Project.Title + '</button>';
        res += '<button id="' + this.Project.Id + '-editbutton" type="button" class="' + this.GetClasses(this.#EditBtnClasses) + '" data-index="' + this.Project.Id + '">Edit</button>';
        res += '</div>';

        res += '<div id="' + this.Project.Id + '-section" class="hidden-block two-column">';
        res += '<button type="button" class="' + this.GetClasses(this.#CompeleteButtonClasses) + '" data-model-name="' + this.Project.Id + '-compelete" data-index="' + this.Project.Id + '">Move To ' + this.#CompeleteBtnText + '</button>';
        res += '<div>';
        res += '<button type="button" class="small-button sub-button float-right" data-model-name="' + this.Project.Id + '-forming">Forming</button>';
        res += '<button type="button" class="small-button sub-button float-right" data-model-name="' + this.Project.Id + '-framing">Framing</button>';
        res += '<button type="button" class="small-button sub-button float-right" data-model-name="' + this.Project.Id + '-summary">Summary</button>';
        res += '</div>';

        res += '</div>';
        res += '</div>';
        return res;
    }
    /**
     * 
     * @param {string[]} classList
     */
    GetClasses(classList) {
        let res = "";
        for (let i = 0; i < classList.length; i++) {
            res += classList[i] + " ";
        }
        return res;
    }
}

/**
 * 
 * @param {SJC_Project[]} projectList
 * @returns
 */
export function CreateHiddenButtons(projectList) {
    let res = '';
    res += '<div id="past-projects-container" class="center-element hidden-projects-container">';
    for (let i = 0; i < projectList.length; i++) {
        const tempBtn = new ButtonBox(projectList[i]);
        res += tempBtn.CreateButtonBox();
    }
    res += '</div>';

    return res;
}