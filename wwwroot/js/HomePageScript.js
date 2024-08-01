//Imports
import * as Elems from "./Elements/ButtonBox.js";
import * as Funcs from "./ActionFunctions.js";
import { SJC_Project } from "./ProjectClass/SJC_Project.js";

//Elements
const projectButtonList = document.getElementsByClassName("project-button");
const mainContainer = document.getElementById("main-container");
const smallButtonsList = document.getElementsByClassName("small-button");
const Buttons = [new Elems.ButtonBox("Project 1")];
Buttons.pop();

//Inputs
const titleInput = document.getElementById("Title-input");
const contractDateInput = document.getElementById("ContractDate-input");
const totalBudgetInput = document.getElementById("TotalBudget-input");
const framingBudgetInput = document.getElementById("FramingBudget-input");
const buildingQtyInput = document.getElementById("BuildingQty-input");
const framingContractNo = document.getElementById("FramingContractNo-input");
const formingContractNo = document.getElementById("FormingContractNo-input");


//Variables
let SJC_ProjectList = [new SJC_Project()];
SJC_ProjectList.pop();


//Implementations

for (let i = 0; i < SJC_ProjectList.length; i++) {
    Buttons.push(new Elems.ButtonBox(SJC_ProjectList[i].Title));
}
for (let i = 0; i < Buttons.length; i++) {
    mainContainer.innerHTML += Buttons[i].CreateButtonBox();
}
mainContainer.innerHTML += Elems.CreateAddButton();

//Events

const addNewProjectButton = document.getElementById("add-new-project-button");
const projectDetailsContainer = document.getElementById("project-details-container");
const closeButton = document.getElementById("colse-button");
const cancleEditProjectButton = document.getElementById("cancle-edit-project-button");
const saveEditProjectButton = document.getElementById("save-edit-project-button");

for (let i = 0; i < projectButtonList.length; i++) {
    projectButtonList[i].onclick = function (e) { return ProjectBtnClick(e.target); };
}
for (let i = 0; i < smallButtonsList.length; i++) {
    smallButtonsList[i].onclick = function (e) { return RedirectToTable(e); };
}
addNewProjectButton.onclick = function (e) { return OpenProjectDetails(e); };
closeButton.onclick = function (e) { return CloseProjectDetails(e); };
cancleEditProjectButton.onclick = function (e) { return CloseProjectDetails(e); };
saveEditProjectButton.onclick = function (e) { return SaveProjectDetails(e); };

//Functions
/**
 * 
 * @param {HTMLElement} element
 */
function ProjectBtnClick(element) {
    for (let i = 0; i < projectButtonList.length; i++) {
        if (projectButtonList[i].innerHTML == element.innerHTML) {
            Funcs.ToggleBigButtonSize(element);
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

function OpenProjectDetails(event) {
    projectDetailsContainer.style.visibility = "visible";
}

function CloseProjectDetails(event) {
    projectDetailsContainer.style.visibility = "hidden";
}

function SaveProjectDetails(event) {
    const res = new SJC_Project();
    res.Title = titleInput.value;
    res.ContractDate = contractDateInput.value;
    res.TotalBudget = totalBudgetInput.value;
    res.FramingBudget = framingBudgetInput.value;
    res.BuildingQty = buildingQtyInput.value;
    res.FramingContractNo = framingContractNo.value;
    res.FormingContractNo = formingContractNo.value;
    SJC_ProjectList.push(res);
    
    projectDetailsContainer.style.visibility = "hidden";
}