//Imports
import * as Elems from "./Elements/ButtonBox.js";
import * as Funcs from "./ActionFunctions.js";

//Elements
const projectButtonList = document.getElementsByClassName("project-button");
const mainContainer = document.getElementById("main-container");
const smallButtonsList = document.getElementsByClassName("small-button");
const Buttons = [new Elems.ButtonBox("Project 1"), new Elems.ButtonBox("Project 2"), new Elems.ButtonBox("Project 3")];

//Variables

//Implementations
for (let i = 0; i < Buttons.length; i++) {
    mainContainer.innerHTML += Buttons[i].CreateButtonBox();
}
mainContainer.innerHTML += Elems.CreateAddButton();

//Events
for (let i = 0; i < projectButtonList.length; i++) {
    projectButtonList[i].onclick = function (e) { return ProjectBtnClick(e.target); };
}
for (let i = 0; i < smallButtonsList.length; i++) {
    smallButtonsList[i].onclick = function (e) { return RedirectToTable(e); };
}

//Functions
/**
 * 
 * @param {HTMLElement} element
 */
function ProjectBtnClick(element) {
    for (let i = 0; i < projectButtonList.length; i++) {
        if (projectButtonList[i].innerHTML == element.innerHTML) {
            Funcs.ToggleAnimation(element);
            Funcs.ToggleRelatedBoxVisibility(document.getElementById(element.getAttribute("data-rel")));
        }
        else {
            Funcs.ResetButtonStatus(projectButtonList[i]);
        }
    }
}

function RedirectToTable(event) {
    window.location.href="/Projects";
}