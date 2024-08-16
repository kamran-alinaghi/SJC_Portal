//Imports
import { SJC_Project } from "./ProjectClass/SJC_Project.js";
import { BarChart } from "./Elements/BarChart.js";
import { PairDetails } from "./ProjectClass/PairDetails.js";
import * as Funcs from "./ActionFunctions.js";

//Elements
const summaryDetailsContainer = document.getElementById("summary-details-container");
let projectButtons = document.getElementsByClassName("project-button");

//Variables
let selectedProject = new SJC_Project();
const barChartObj = [new BarChart()];
barChartObj.pop();

//APIs
GetProject();
function GetProject() {
    $.post("/apis/GetProjectById", "",
        function (data, status) {
            if (status == "success") {
                selectedProject = JSON.parse(data);
                InitializePage();
            }
        });
}


//Functions
function InitializePage() {
    ShowData();
    AddEvents();
}
function ShowData() {
    for (let i = 0; i < selectedProject.FormingTitles.length; i++) {
        barChartObj.push(new BarChart(i));
        barChartObj[i].ButtonDetails.Title = selectedProject.FormingTitles[i];
        barChartObj[i].ButtonDetails.Percent = GetFramingItemPercentage(i);
        for (let j = 0; j < selectedProject.FramingTitles.length; j++) {
            barChartObj[i].BarList.push(new PairDetails());
            barChartObj[i].BarList[j].Title = selectedProject.FramingTitles[j];
            barChartObj[i].BarList[j].Percent = GetFramingItemPercentage(i, j);
            barChartObj[i].BarList[j].SecondValue = selectedProject.FramingInvoiceList[0].Buildings[i].Pairs[j].Value;
            barChartObj[i].BarList[j].Value = barChartObj[i].BarList[j].Percent * barChartObj[i].BarList[j].SecondValue / 100;
        }
        barChartObj[i].BarList.push(new PairDetails());
        barChartObj[i].BarList[barChartObj[i].BarList.length - 1].Title = "Foundation Completion";
        barChartObj[i].BarList[barChartObj[i].BarList.length - 1].Percent = GetFormingItemPercentage(i);
        barChartObj[i].BarList[barChartObj[i].BarList.length - 1].SecondValue = selectedProject.FormingInvoiceList[0].Buildings.Pairs[i].Value;
        barChartObj[i].BarList[barChartObj[i].BarList.length - 1].Value = barChartObj[i].BarList[barChartObj[i].BarList.length - 1].Percent * barChartObj[i].BarList[barChartObj[i].BarList.length - 1].SecondValue / 100;
    }
    summaryDetailsContainer.innerHTML = "";
    for (let i = 0; i < barChartObj.length; i++) {
        summaryDetailsContainer.innerHTML += barChartObj[i].ToHtmlObject();
    }
}
function AddEvents() {
    projectButtons = document.getElementsByClassName("project-button");
    for (let i = 0; i < projectButtons.length; i++) {
        projectButtons[i].onclick = function (e) { return ProjectButtonsOnClick(e.target); };
        projectButtons[i].style.backgroundImage = 'linear-gradient(90deg, rgb(173, 255, 47) 0%, rgb(173, 255, 47) ' + barChartObj[i].ButtonDetails.Percent.toString() +
            '%, rgb(100, 200, 255) ' + (barChartObj[i].ButtonDetails.Percent + 0.01).toString() + '%)';
        projectButtons[i].onmouseenter = function () {
            projectButtons[i].style.backgroundImage = 'linear-gradient(90deg, rgb(150, 220, 40) 0%, rgb(150, 220, 40) ' + barChartObj[i].ButtonDetails.Percent.toString() +
                '%, rgb(80, 170, 245) ' + (barChartObj[i].ButtonDetails.Percent + 0.01).toString() + '%)';
        };
        projectButtons[i].onmouseleave = function () {
            projectButtons[i].style.backgroundImage = 'linear-gradient(90deg, rgb(173, 255, 47) 0%, rgb(173, 255, 47) ' + barChartObj[i].ButtonDetails.Percent.toString() +
                '%, rgb(100, 200, 255) ' + (barChartObj[i].ButtonDetails.Percent + 0.01).toString() + '%)';
        };
        projectButtons[i].onmouseup = function () {
            projectButtons[i].style.backgroundImage = 'linear-gradient(90deg, rgb(173, 255, 47) 0%, rgb(173, 255, 47) ' + barChartObj[i].ButtonDetails.Percent.toString() +
                '%, rgb(100, 200, 255) ' + (barChartObj[i].ButtonDetails.Percent + 0.01).toString() + '%)';
        };
        projectButtons[i].onmousedown = function () {
            projectButtons[i].style.backgroundImage = 'linear-gradient(90deg, rgb(140, 180, 70) 0%, rgb(140, 180, 70) ' + barChartObj[i].ButtonDetails.Percent.toString() +
                '%, rgb(70, 130, 255) ' + (barChartObj[i].ButtonDetails.Percent + 0.01).toString() + '%)';
        };
    }
}


/**
 * 
 * @param {number} buildingIndex
 * @param {number} itemIndex
 * @returns
 */
function GetFramingItemPercentage(buildingIndex, itemIndex = null) {
    let result = 0;
    if (itemIndex != null) {
        for (let i = 1; i < selectedProject.FramingInvoiceList.length; i++) {
            result += selectedProject.FramingInvoiceList[i].Buildings[buildingIndex].Pairs[itemIndex].Percent;
        }
    }
    else {
        let accumulated = 0;
        for (let i = 1; i < selectedProject.FramingInvoiceList.length; i++) {
            let row = 0;
            for (let j = 0; j < selectedProject.FramingInvoiceList[i].Buildings[buildingIndex].Pairs.length; j++) {
                row += selectedProject.FramingInvoiceList[i].Buildings[buildingIndex].Pairs[j].Percent;
            }
            accumulated += row / selectedProject.FramingInvoiceList.length;
        }
        result = accumulated / selectedProject.FramingTitles.length;
    }
    return result;
}

function GetFormingItemPercentage(buildingIndex) {
    let result = 0;
    for (let i = 1; i < selectedProject.FormingInvoiceList.length; i++) {
        result += selectedProject.FormingInvoiceList[i].Buildings.Pairs[buildingIndex].Percent;
    }
    return result;
}

/**
 * 
 * @param {HTMLElement} element
 */
function ProjectButtonsOnClick(element) {
    const container = document.getElementById(element.getAttribute("data-rel"));
    Funcs.ToggleClass(container, ["expand-chart"], ["hide-chart"]);
}