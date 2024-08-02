//Imports
import * as Elems from "./Elements/ButtonBox.js";
import * as Funcs from "./ActionFunctions.js";
import { SJC_Project } from "./ProjectClass/SJC_Project.js";

//Elements
const projectButtonList = document.getElementsByClassName("project-button");
const mainContainer = document.getElementById("main-container");
const smallButtonsList = document.getElementsByClassName("small-button");
let projectDetailsContainer = document.getElementById("project-details-container");
let saveEditProjectButton = document.getElementById("save-edit-project-button");

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
let CompeletedProjectList = [new SJC_Project()];
CompeletedProjectList.pop();


//Implementations
ShowProjectButtons();

function ShowProjectButtons() {
    mainContainer.innerHTML = "";
    CompeletedProjectList = [];
    for (let i = 0; i < SJC_ProjectList.length; i++) {
        if (!SJC_ProjectList[i].IsCompelete) {
            const tempBtn = new Elems.ButtonBox(SJC_ProjectList[i]);
            mainContainer.innerHTML += tempBtn.CreateButtonBox();
        }
        else {
            CompeletedProjectList.push(SJC_ProjectList[i]);
        }
    }
    mainContainer.innerHTML += Elems.CreateAddButton();
    mainContainer.innerHTML += Elems.MoreProjectsButton(CompeletedProjectList.length);
    if (CompeletedProjectList.length > 0) {
        mainContainer.innerHTML += Elems.CreateHiddenButtons(CompeletedProjectList);
    }

    ImpelimentEvents();
}


//Events
function ImpelimentEvents() {
    const addNewProjectButton = document.getElementById("add-new-project-button");
    projectDetailsContainer = document.getElementById("project-details-container");
    const closeButton = document.getElementById("colse-button");
    const cancleEditProjectButton = document.getElementById("cancle-edit-project-button");
    saveEditProjectButton = document.getElementById("save-edit-project-button");
    const editButtons = document.getElementsByClassName("edit-button");
    const moveToCompleteButtons = document.getElementsByClassName("compelete-button");
    const moveToCurrenButtons = document.getElementsByClassName("uncompelete-button");
    const pastProjectsButton = document.getElementById("past-projects");

    for (let i = 0; i < projectButtonList.length; i++) {
        projectButtonList[i].onclick = function (e) { return ProjectBtnClick(e.target); };
    }
    for (let i = 0; i < smallButtonsList.length; i++) {
        smallButtonsList[i].onclick = function (e) { return RedirectToTable(e); };
    }
    for (let i = 0; i < editButtons.length; i++) {
        editButtons[i].onclick = function (e) {
            const index = parseInt(e.target.getAttribute("data-index"));
            return OpenProjectDetails(index);
        };
    }
    for (let i = 0; i < moveToCompleteButtons.length; i++) {
        moveToCompleteButtons[i].onclick = function (e) { return ChangeCompeleteStatus(e.target, true); };
    }
    for (let i = 0; i < moveToCurrenButtons.length; i++) {
        moveToCurrenButtons[i].onclick = function (e) { return ChangeCompeleteStatus(e.target, false); };
    }
    addNewProjectButton.onclick = function (e) { return OpenProjectDetails(null); };
    closeButton.onclick = function (e) { return CloseProjectDetails(e); };
    cancleEditProjectButton.onclick = function (e) { return CloseProjectDetails(e); };
    saveEditProjectButton.onclick = function (e) { return SaveProjectDetails(e); };
    pastProjectsButton.onclick = function (e) { return Funcs.ToggleBigBoxVisibility(e.target); }
}


//Functions
/**
 * 
 * @param {HTMLElement} element
 */
function ProjectBtnClick(element) {
    for (let i = 0; i < projectButtonList.length; i++) {
        if (projectButtonList[i].id == element.id) {
            Funcs.ToggleBigButtonSize(element);
            Funcs.ToggleRelatedBoxVisibility(document.getElementById(element.getAttribute("data-rel")));
        }
        else {
            Funcs.ResetButtonStatus(projectButtonList[i]);
        }
    }
}


//temporary -------------------------------------------------
function RedirectToTable(event) {
    window.location.href = "/Projects";
}
//temporary -------------------------------------------------

/**
 * 
 * @param {number} index
 */
function OpenProjectDetails(index) {
    saveEditProjectButton.setAttribute("data-index", index);
    let tempProject = new SJC_Project();
    if (index != null) { tempProject = SJC_ProjectList[index]; }
    titleInput.value = tempProject.Title;
    contractDateInput.value = tempProject.ContractDate;
    totalBudgetInput.value = tempProject.TotalBudget;
    framingBudgetInput.value = tempProject.FramingBudget;
    buildingQtyInput.value = tempProject.BuildingQty;
    framingContractNo.value = tempProject.FramingContractNo;
    formingContractNo.value = tempProject.FormingContractNo;

    projectDetailsContainer.style.visibility = "visible";
}

function CloseProjectDetails(event) {
    projectDetailsContainer.style.visibility = "hidden";
}

function SaveProjectDetails(event) {
    if (saveEditProjectButton.getAttribute("data-index") == "null") {
        const res = new SJC_Project();
        res.Id = Funcs.GetLastId(SJC_ProjectList) + 1;
        res.Title = titleInput.value;
        res.ContractDate = contractDateInput.value;
        res.TotalBudget = totalBudgetInput.value;
        res.FramingBudget = framingBudgetInput.value;
        res.BuildingQty = buildingQtyInput.value;
        res.FramingContractNo = framingContractNo.value;
        res.FormingContractNo = formingContractNo.value;
        SJC_ProjectList.push(res);
    }
    else {
        const index = parseInt(saveEditProjectButton.getAttribute("data-index"));
        SJC_ProjectList[index].Title = titleInput.value;
        SJC_ProjectList[index].ContractDate = contractDateInput.value;
        SJC_ProjectList[index].TotalBudget = totalBudgetInput.value;
        SJC_ProjectList[index].FramingBudget = framingBudgetInput.value;
        SJC_ProjectList[index].BuildingQty = buildingQtyInput.value;
        SJC_ProjectList[index].FramingContractNo = framingContractNo.value;
        SJC_ProjectList[index].FormingContractNo = formingContractNo.value;
    }

    ShowProjectButtons();

    projectDetailsContainer.style.visibility = "hidden";
}
/**
 * 
 * @param {HTMLElement} element
 * @param {boolean} isCompelete
 */
function ChangeCompeleteStatus(element, isCompelete) {
    const index = parseInt(element.getAttribute("data-index"));
    let word = isCompelete ? "compeleted" : "current";
    let answer = window.confirm("Are you sure you want to move " +
        Funcs.toUnicodeVariant(SJC_ProjectList[index].Title, 'bold sans', 'bold') +
        " to " + Funcs.toUnicodeVariant(word, 'bold sans', 'bold') + " projects list?");
    if (answer) {
        SJC_ProjectList[index].IsCompelete = isCompelete;
        ShowProjectButtons();
    }
}

