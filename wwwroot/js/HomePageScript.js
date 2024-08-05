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
let delProject = document.getElementById("del-edit-project-button");
let editButtons = document.getElementsByClassName("edit-button");

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
GetProjectsList();
//ShowProjectButtons();

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

//APIs
function GetProjectsList() {
    $.post("./apis/ProjectsList",
        "",
        function (data, status) {
            SJC_ProjectList = JSON.parse(data);
            ShowProjectButtons();
        });
}


/**
 * 
 * @param {SJC_Project} inputData
 */
function SaveProjectToDB(inputData) {
    $.post("./apis/SaveProject",
        JSON.stringify(inputData),
        function (data, status) {
            if (status == "success") {
                CloseProjectDetails();
                GetProjectsList();
            }
        });
}

function UpdateDB(project) {
    $.post("./apis/UpdateProject",
        JSON.stringify(project),
        function (data, status) {
            if (status == "success") {
                CloseProjectDetails();
                GetProjectsList();
            }
        });
}

function DeleteProjectFromDB(project) {
    $.post("./apis/DeleteProject",
        JSON.stringify(project),
        function (data, status) {
            if (status == "success") {
                CloseProjectDetails();
                GetProjectsList();
            }
        });
}


//Events
function ImpelimentEvents() {
    const addNewProjectButton = document.getElementById("add-new-project-button");
    projectDetailsContainer = document.getElementById("project-details-container");
    const closeButton = document.getElementById("colse-button");
    const cancleEditProjectButton = document.getElementById("cancle-edit-project-button");
    editButtons = document.getElementsByClassName("edit-button");
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
            //const index = Funcs.FindIndex(SJC_ProjectList, parseInt(e.target.getAttribute("data-index")));
            return OpenProjectDetails(e.target.getAttribute("data-index"));
        };
    }
    for (let i = 0; i < moveToCompleteButtons.length; i++) {
        moveToCompleteButtons[i].onclick = function (e) { return ChangeCompeleteStatus(e.target, true); };
    }
    for (let i = 0; i < moveToCurrenButtons.length; i++) {
        moveToCurrenButtons[i].onclick = function (e) { return ChangeCompeleteStatus(e.target, false); };
    }
    addNewProjectButton.onclick = function (e) { return OpenProjectDetails(null); };
    closeButton.onclick = function () { return CloseProjectDetails(); };
    cancleEditProjectButton.onclick = function (e) { return CloseProjectDetails(e); };
    saveEditProjectButton.onclick = function () { return SaveProjectDetails(); };

    delProject.onclick = function (e) { return DeleteProject(e.target); };
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
 * @param {string} _idStr
 */
function OpenProjectDetails(_idStr) {
    saveEditProjectButton.setAttribute("data-index", _idStr);
    delProject.setAttribute("data-index", _idStr);
    let index = Funcs.FindIndex(SJC_ProjectList, _idStr);
    let tempProject = new SJC_Project();
    if (index > -1) { tempProject = SJC_ProjectList[index]; }
    titleInput.value = tempProject.Title;
    contractDateInput.value = tempProject.ContractDate;
    totalBudgetInput.value = tempProject.TotalBudget;
    framingBudgetInput.value = tempProject.FramingBudget;
    buildingQtyInput.value = tempProject.BuildingQty;
    framingContractNo.value = tempProject.FramingContractNo;
    formingContractNo.value = tempProject.FormingContractNo;

    projectDetailsContainer.style.visibility = "visible";
}

function CloseProjectDetails() {
    projectDetailsContainer.style.visibility = "hidden";
}

function SaveProjectDetails() {
    if (saveEditProjectButton.getAttribute("data-index") == "null") {
        const res = new SJC_Project();
        res._id = null;
        res.Title = titleInput.value;
        res.ContractDate = contractDateInput.value;
        res.TotalBudget = totalBudgetInput.value;
        res.FramingBudget = framingBudgetInput.value;
        res.BuildingQty = buildingQtyInput.value;
        res.FramingContractNo = framingContractNo.value;
        res.FormingContractNo = formingContractNo.value;
        SaveProjectToDB(res);
    }
    else {
        const id = saveEditProjectButton.getAttribute("data-index");
        const index = Funcs.FindIndex(SJC_ProjectList, id);

        SJC_ProjectList[index].Title = titleInput.value;
        SJC_ProjectList[index].ContractDate = contractDateInput.value;
        SJC_ProjectList[index].TotalBudget = totalBudgetInput.value;
        SJC_ProjectList[index].FramingBudget = framingBudgetInput.value;
        SJC_ProjectList[index].BuildingQty = buildingQtyInput.value;
        SJC_ProjectList[index].FramingContractNo = framingContractNo.value;
        SJC_ProjectList[index].FormingContractNo = formingContractNo.value;
        UpdateDB(SJC_ProjectList[index]);
    }
}
/**
 * 
 * @param {HTMLElement} element
 * @param {boolean} isCompelete
 */
function ChangeCompeleteStatus(element, isCompelete) {
    const index = Funcs.FindIndex(SJC_ProjectList, element.getAttribute("data-index"));
    //alert(index);
    let word = isCompelete ? "compeleted" : "current";
    let answer = window.confirm("Are you sure you want to move " +
        Funcs.toUnicodeVariant(SJC_ProjectList[index].Title, 'bold sans', 'bold') +
        " to " + Funcs.toUnicodeVariant(word, 'bold sans', 'bold') + " projects list?");
    if (answer) {
        if (isCompelete) {
            SJC_ProjectList[index].IsCompelete = true;
        }
        else {
            SJC_ProjectList[index].IsCompelete = false;
        }
        UpdateDB(SJC_ProjectList[index]);
    }
}
/**
 * 
 * @param {HTMLElement} element
 */
function DeleteProject(element) {
    const indexStr = element.getAttribute("data-index");
    if (indexStr != "null" && indexStr != null) {
        const index = Funcs.FindIndex(SJC_ProjectList, indexStr);
        let answer1 = window.confirm("Do you want to remove " +
            Funcs.toUnicodeVariant(SJC_ProjectList[index].Title, 'bold sans', 'bold') + "?");
        if (answer1) {
            let answer2 = window.confirm("Are you sure about removing " +
                Funcs.toUnicodeVariant(SJC_ProjectList[index].Title, 'bold sans', 'bold') +
                "?\nYou won't have access to its data anymore!");
            if (answer2) {
                DeleteProjectFromDB(SJC_ProjectList[index]);
            }
        }
    }
    else {

    }
}

