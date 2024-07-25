//Imports
import { CreateButtonBox, CreateAddButton } from "./Elements/ButtonBox.js";


//Elements
const projectButtonList = document.getElementsByClassName("project-button");
const mainContainer = document.getElementById("main-container");

//Variables


//Implementations
mainContainer.innerHTML = CreateButtonBox("Project 1");
mainContainer.innerHTML += CreateButtonBox("Project 2");
mainContainer.innerHTML += CreateButtonBox("Project 3");
mainContainer.innerHTML += CreateAddButton();
for (let i = 0; i < projectButtonList.length; i++) {
    projectButtonList[i].onclick = function (e) { return ProjectBtnClick(e.target); };
}

//Functions
/**
 * 
 * @param {HTMLElement} element
 */
function ProjectBtnClick(element) {
    for (let i = 0; i < projectButtonList.length; i++) {
        if (projectButtonList[i].innerHTML == element.innerHTML) {
            ToggleAnimation(element);
            ToggleRelatedBoxVisibility(document.getElementById(element.getAttribute("data-rel")));
        }
        else {
            ResetButtonStatus(projectButtonList[i]);
        }
    }
    
}
/**
 * 
 * @param {HTMLElement} element
 * @param {string} className
 */
function AddClass(element, className) {
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
function RemoveClass(element, className) {
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
function ToggleAnimation(element) {
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
 */
function ResetButtonStatus(element) {
    if (RemoveClass(element, "shrink-button")) {
        AddClass(element, "expand-button");
        ToggleRelatedBoxVisibility(document.getElementById(element.getAttribute("data-rel")));
    }
}
/**
 * 
 * @param {HTMLElement} element
 */
function ToggleRelatedBoxVisibility(element) {
    if (RemoveClass(element, "shrink-div")) {
        AddClass(element, "expand-div");
    }
    else {
        RemoveClass(element, "expand-div");
        AddClass(element, "shrink-div");
    }
}