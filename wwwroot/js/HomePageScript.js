//Imports
import * as Elems from "./Elements/ButtonBox.js";
import * as Funcs from "./ActionFunctions.js";
import { SJC_Project } from "./ProjectClass/SJC_Project.js";
import { FramingInvoice } from "./ProjectClass/FramingInvoice.js";
import { FormingInvoice } from "./ProjectClass/FormingInvoice.js";
import { PairList, PairDetails } from "./ProjectClass/PairDetails.js";

//Elements
const projectButtonList = document.getElementsByClassName("project-button");
const mainContainer = document.getElementById("main-container");
let smallButtonsList = document.getElementsByClassName("small-button");
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
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});


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

function SaveTableName(name, id) {
    const param = {
        _id: id,
        Name: name
    }
    $.post("/apis/SaveTableTitle",
        JSON.stringify(param),
        function (data, status) {

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
    smallButtonsList = document.getElementsByClassName("small-button");

    for (let i = 0; i < projectButtonList.length; i++) {
        projectButtonList[i].onclick = function (e) { return ProjectBtnClick(e.target); };
    }
    for (let i = 0; i < smallButtonsList.length; i++) {
        smallButtonsList[i].onclick = function (e) { return RedirectToTable(e.target); };
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
    totalBudgetInput.onchange = function (e) { return SetFormatting(totalBudgetInput, totalBudgetInput.value); };
    framingBudgetInput.onchange = function (e) { return SetFormatting(framingBudgetInput, framingBudgetInput.value); };
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
/**
 * 
 * @param {HTMLElement} element
 */
function RedirectToTable(element) {
    SaveTableName(element.innerHTML, element.getAttribute("data-model-name"));
    if (element.innerHTML == "Framing" || element.innerHTML == "Forming") {
        window.location.href = "/projects/index";
    }
    else if (element.innerHTML == "Summary") {
        window.location.href = "/projects/InvoiceSummary";
    }
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
    SetFormatting(totalBudgetInput, tempProject.TotalBudget);
    //totalBudgetInput.value = tempProject.TotalBudget;
    //framingBudgetInput.value = tempProject.FramingBudget;
    SetFormatting(framingBudgetInput, tempProject.FramingBudget);
    buildingQtyInput.value = tempProject.BuildingQty < 1 ? 1 : tempProject.BuildingQty;
    framingContractNo.value = tempProject.FramingContractNo;
    formingContractNo.value = tempProject.FormingContractNo;

    projectDetailsContainer.style.visibility = "visible";
}
/**
 * 
 * @param {HTMLElement} element
 * @param {number} value
 */
function SetFormatting(element, value) {
    let tempVal = parseFloat(value);
    if (isNaN(tempVal)) { tempVal = 0; }
    element.value = formatter.format(tempVal);
}

function CloseProjectDetails() {
    projectDetailsContainer.style.visibility = "hidden";
}

function SaveProjectDetails() {
    let n = 0;
    if (saveEditProjectButton.getAttribute("data-index") == "null") {
        const res = new SJC_Project();
        res._id = null;
        res.Title = titleInput.value;
        res.ContractDate = contractDateInput.value;
        res.TotalBudget = CurrencyToNumber(totalBudgetInput.value);
        res.FramingBudget = CurrencyToNumber(framingBudgetInput.value);
        res.FramingTitles = ["Basement Walls", "Main Floor", "Main Walls", "Upper Floor", "Upper Walls", "Roof", "Stairs", "Seismic", "Windows", "Backframe", "Decks", "Drops"];
        n = parseInt(buildingQtyInput.value);
        res.BuildingQty = n < 1 ? 1 : n;

        res.FramingInvoiceList.push(new FramingInvoice());
        for (let i = 0; i < res.BuildingQty; i++) {
            res.FramingInvoiceList[0].Buildings.push(new PairList());
            res.FramingInvoiceList[0].ToBeInvoiced.push(new PairList());
            for (let j = 0; j < res.FramingTitles.length; j++) {
                res.FramingInvoiceList[0].Buildings[i].Pairs.push(new PairDetails());
                res.FramingInvoiceList[0].Buildings[i].Pairs[j].Title = res.FramingTitles[j];
                res.FramingInvoiceList[0].ToBeInvoiced[i].Pairs.push(new PairDetails());
                res.FramingInvoiceList[0].ToBeInvoiced[i].Pairs[j].Title = res.FramingTitles[j];
            }
        }
        for (let i = 0; i < res.BuildingQty; i++) { res.FormingTitles.push("Building " + (i + 1).toString()); }

        res.FormingInvoiceList.push(new FormingInvoice());
        for (let i = 0; i < res.BuildingQty; i++) {
            res.FormingInvoiceList[0].Buildings.Pairs.push(new PairDetails());
            res.FormingInvoiceList[0].Buildings.Pairs[i].Title = res.FormingTitles[i];
            res.FormingInvoiceList[0].ToBeInvoiced.Pairs.push(new PairDetails());
            res.FormingInvoiceList[0].ToBeInvoiced.Pairs[i].Title = res.FormingTitles[i];
        }

        res.FramingContractNo = framingContractNo.value;
        res.FormingContractNo = formingContractNo.value;
        SaveProjectToDB(res);
    }
    else {
        const id = saveEditProjectButton.getAttribute("data-index");
        const index = Funcs.FindIndex(SJC_ProjectList, id);
        SJC_ProjectList[index].Title = titleInput.value;
        SJC_ProjectList[index].ContractDate = contractDateInput.value;
        SJC_ProjectList[index].TotalBudget = CurrencyToNumber(totalBudgetInput.value);
        SJC_ProjectList[index].FramingBudget = CurrencyToNumber(framingBudgetInput.value);
        n = parseInt(buildingQtyInput.value);
        if (n < 1) { n = 1; }
        if (SJC_ProjectList[index].BuildingQty > n) {
            let answer = window.confirm('You may loose some data because of reduction in the "Buildings" number. Do you wish to continue?');
            if (answer) {
                let answer2 = window.confirm("Are you sure about loosing those data?");
                if (answer2) {
                    for (let i = 0; i < SJC_ProjectList[index].FramingInvoiceList.length; i++) {
                        SJC_ProjectList[index].FramingInvoiceList[i].Buildings.splice(n, (SJC_ProjectList[index].BuildingQty - n));
                        SJC_ProjectList[index].FramingInvoiceList[i].ToBeInvoiced.splice(n, (SJC_ProjectList[index].BuildingQty - n));
                    }
                    for (let i = 0; i < SJC_ProjectList[index].FormingInvoiceList.length; i++) {
                        SJC_ProjectList[index].FormingInvoiceList[i].Buildings.Pairs.splice(n, (SJC_ProjectList[index].BuildingQty - n));
                        SJC_ProjectList[index].FormingInvoiceList[i].ToBeInvoiced.Pairs.splice(n, (SJC_ProjectList[index].BuildingQty - n));
                    }
                    SJC_ProjectList[index].FormingTitles.splice(n, (SJC_ProjectList[index].BuildingQty - n));
                    SJC_ProjectList[index].BuildingQty = n;
                }
            }
        }
        else if (SJC_ProjectList[index].BuildingQty < n) {
            for (let i = SJC_ProjectList[index].FormingTitles.length; i < n; i++) {
                SJC_ProjectList[index].FormingTitles.push("Building " + (i + 1).toString());
            }
            for (let i = 0; i < SJC_ProjectList[index].FramingInvoiceList.length; i++) {
                for (let j = SJC_ProjectList[index].BuildingQty; j < n; j++) {
                    SJC_ProjectList[index].FramingInvoiceList[i].Buildings.push(new PairList());
                    SJC_ProjectList[index].FramingInvoiceList[i].ToBeInvoiced.push(new PairList());
                    for (let k = 0; k < SJC_ProjectList[index].FramingTitles.length; k++) {
                        SJC_ProjectList[index].FramingInvoiceList[i].Buildings[j].Pairs.push(new PairDetails());
                        SJC_ProjectList[index].FramingInvoiceList[i].Buildings[j].Pairs[k].Title = SJC_ProjectList[index].FramingTitles[k];
                        SJC_ProjectList[index].FramingInvoiceList[i].ToBeInvoiced[j].Pairs.push(new PairDetails());
                        SJC_ProjectList[index].FramingInvoiceList[i].ToBeInvoiced[j].Pairs[k].Title = SJC_ProjectList[index].FramingTitles[k];
                    }
                }
            }
            for (let i = 0; i < SJC_ProjectList[index].FormingInvoiceList.length; i++) {
                for (let j = SJC_ProjectList[index].BuildingQty; j < n; j++) {
                    SJC_ProjectList[index].FormingInvoiceList[i].Buildings.Pairs.push(new PairDetails());
                    SJC_ProjectList[index].FormingInvoiceList[i].Buildings.Pairs[j].Title = SJC_ProjectList[index].FormingTitles[j];
                    SJC_ProjectList[index].FormingInvoiceList[i].ToBeInvoiced.Pairs.push(new PairDetails());
                    SJC_ProjectList[index].FormingInvoiceList[i].ToBeInvoiced.Pairs[j].Title = SJC_ProjectList[index].FormingTitles[j];
                }
            }
            SJC_ProjectList[index].BuildingQty = n;
        }

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
/**
 * 
 * @param {string} stringValue
 */
function CurrencyToNumber(stringValue) {
    let tempStr = "";
    for (let i = 0; i < stringValue.length; i++) {
        if (stringValue[i] !== '$' && stringValue[i] !== ',') { tempStr += stringValue[i]; }
    }
    return parseFloat(tempStr);
}
