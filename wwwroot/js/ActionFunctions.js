/**
 * 
 * @param {HTMLElement} element
 */
export function ToggleBigButtonSize(element) {
    const editBtn = document.getElementById(element.getAttribute("data-editButton"));
    if (RemoveClass(element, "shrink-button")) {
        RemoveClass(editBtn, "edit-button-expand");
        AddClass(element, "expand-button");
        AddClass(editBtn, "edit-button-shrink");
    }
    else {
        RemoveClass(element, "expand-button");
        RemoveClass(editBtn,"edit-button-shrink")
        AddClass(element, "shrink-button");
        AddClass(editBtn, "edit-button-expand");
    }
}

export function ToggleEditButtonSize(element) {
    AddClass(element, "edit-button-shrink");
}

/**
 * 
 * @param {HTMLElement} element
 * @param {string} className
 */
export function AddClass(element, className) {
    if (!element.classList.contains(className)) {
        element.classList.add(className);
        return true;
    }
    return false;
}
/**
 * 
 * @param {HTMLElement} element
 * @param {string} className
 * @returns
 */
export function RemoveClass(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className);
        return true;
    }
    return false;
}


/**
 * 
 * @param {HTMLElement} element
 */
export function ToggleRelatedBoxVisibility(element) {
    if (RemoveClass(element, "shrink-div")) {
        AddClass(element, "expand-div");
    }
    else {
        RemoveClass(element, "expand-div");
        AddClass(element, "shrink-div");
    }
}


/**
 * 
 * @param {HTMLElement} element
 */
export function ResetButtonStatus(element) {
    const editBtn = document.getElementById(element.getAttribute("data-editButton"));
    if (RemoveClass(element, "shrink-button")) {
        AddClass(element, "expand-button");
        AddClass(editBtn, "edit-button-shrink");
        ToggleRelatedBoxVisibility(document.getElementById(element.getAttribute("data-rel")));
    }
}