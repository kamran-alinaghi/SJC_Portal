/**
 * 
 * @param {HTMLElement} element
 */
export function ToggleAnimation(element) {
    if (RemoveClass(element, "shrink-button")) {
        AddClass(element, "expand-button");
    }
    else {
        RemoveClass(element, "expand-button");
        AddClass(element, "shrink-button")
    }
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
    if (RemoveClass(element, "shrink-button")) {
        AddClass(element, "expand-button");
        ToggleRelatedBoxVisibility(document.getElementById(element.getAttribute("data-rel")));
    }
}