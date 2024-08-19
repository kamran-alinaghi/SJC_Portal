//Imports
import { SJC_Project } from "./ProjectClass/SJC_Project.js";
import { BarChart } from "./Elements/BarChart.js";
import { PairDetails } from "./ProjectClass/PairDetails.js";
import * as Funcs from "./ActionFunctions.js";
import { colorList } from "./Elements/Colors.js";

//Elements
const summaryDetailsContainer = document.getElementById("summary-details-container");
const chartGuide = document.getElementById("chart-guide");
const canvas = document.getElementById("canvas-graph");
const chartBudgets = document.getElementById("chart-budgets");
const ctx = canvas.getContext("2d");
let projectButtons = document.getElementsByClassName("project-button");

//Variables
let totalInvoiced = 0;
let selectedProject = new SJC_Project();
let selectedColors = [""];
selectedColors.pop();

const barChartObj = [new BarChart()];
barChartObj.pop();

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

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
    DrawChartGuide();
    DrawCircleChart();
    DrawBudgets();
}
function ShowData() {
    totalInvoiced = 0;
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
            totalInvoiced += barChartObj[i].BarList[j].Value;
        }
        barChartObj[i].BarList.push(new PairDetails());
        barChartObj[i].BarList[barChartObj[i].BarList.length - 1].Title = "Foundation Completion";
        barChartObj[i].BarList[barChartObj[i].BarList.length - 1].Percent = GetFormingItemPercentage(i);
        barChartObj[i].BarList[barChartObj[i].BarList.length - 1].SecondValue = selectedProject.FormingInvoiceList[0].Buildings.Pairs[i].Value;
        barChartObj[i].BarList[barChartObj[i].BarList.length - 1].Value = barChartObj[i].BarList[barChartObj[i].BarList.length - 1].Percent * barChartObj[i].BarList[barChartObj[i].BarList.length - 1].SecondValue / 100;
        totalInvoiced += barChartObj[i].BarList[barChartObj[i].BarList.length - 1].Value;
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
 * @param {number} buildingIndex
 * @param {number} itemIndex
 * @returns
 */
function GetFramingItemPercentage(buildingIndex, itemIndex = null) {
    let count = 0;
    let result = 0;
    if (itemIndex != null) {
        for (let i = 1; i < selectedProject.FramingInvoiceList.length; i++) {
            result += selectedProject.FramingInvoiceList[i].Buildings[buildingIndex].Pairs[itemIndex].Percent;
        }
    }
    else {
        const buildingBudget = GetBuildingBudget(buildingIndex);
        let accumulated = 0;

        for (let i = 0; i < selectedProject.FramingTitles.length; i++) {
            let row = 0;
            for (let j = 1; j < selectedProject.FramingInvoiceList.length; j++) {
                row += selectedProject.FramingInvoiceList[j].Buildings[buildingIndex].Pairs[i].Percent;
            }
            const val = row * selectedProject.FramingInvoiceList[0].Buildings[buildingIndex].Pairs[i].Value / buildingBudget;
            accumulated += val;
            count++;
        }
        let row2 = 0;
        for (let i = 1; i < selectedProject.FormingInvoiceList.length; i++) {
            row2 += selectedProject.FormingInvoiceList[i].Buildings.Pairs[buildingIndex].Percent;
        }
        const val2 = row2 * selectedProject.FormingInvoiceList[0].Buildings.Pairs[buildingIndex].Value / buildingBudget;
        accumulated += val2;
        count++;
        result = accumulated;
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
 * @param {HTMLElement} element
 */
function ProjectButtonsOnClick(element) {
    const container = document.getElementById(element.getAttribute("data-rel"));
    Funcs.ToggleClass(container, ["expand-chart"], ["hide-chart"]);
}

function DrawChartGuide() {
    chartGuide.innerHTML = '';
    for (let i = 0; i < barChartObj.length; i++) {
        selectedColors.push(GetRandomColor(i))
        chartGuide.innerHTML += barChartObj[i].GetProjectGuide(selectedColors[i], GetBuildingBudget(i) * 100 / selectedProject.TotalBudget);
    }
}

function GetRandomColor(index) {
    const intVal = parseInt(index / 7);
    const mod = index % 7;
    return colorList[mod].ColorList[intVal + 1];
}

function DrawCircleChart() {
    let tempArray = [];
    for (let i = 0; i < barChartObj.length; i++) {
        tempArray.push(barChartObj[i].ButtonDetails.Percent);
    }
    DrawCanvasArc(tempArray);
}

/**
 * 
 * @param {any} context
 * @param {number[]} percent
 */
function DrawCanvasArc(percent) {
    const canvasWidth = canvas.clientWidth / 2;
    const offset = (Math.PI / 2) + (0.1 * Math.PI);
    const lastPoint = 1.9 * Math.PI + (Math.PI / 2);
    let totalPercent = 0;
    let nextStart = 0 + offset;
    let ends = 0;
    for (let i = 0; i < percent.length; i++) {
        ctx.beginPath();
        ends = (percent[i] / percent.length) * 0.018 * Math.PI + nextStart;
        ctx.arc(canvasWidth, canvasWidth, canvasWidth - 40, nextStart, ends);
        ctx.strokeStyle = selectedColors[i];
        ctx.lineWidth = 40;
        ctx.stroke();
        nextStart = ends;
        totalPercent += percent[i] / percent.length;
    }
    ctx.beginPath();
    ctx.arc(canvasWidth, canvasWidth, canvasWidth - 40, nextStart, lastPoint);
    ctx.strokeStyle = "gray";
    ctx.lineWidth = 40;
    ctx.stroke();
    ctx.font = "20px Arial";
    let text = totalPercent.toFixed(2).toString();
    ctx.fillText(text + "%", canvasWidth - 20, canvasWidth, text.length * 10);
}

function DrawBudgets() {
    chartBudgets.innerHTML = "";
    chartBudgets.innerHTML = '<div><b>Total Invoiced: </b><b style="color:blue;">' + formatter.format(totalInvoiced) + '</b></div><div><b>Out of:  </b><b style="color:green;">' + formatter.format(selectedProject.TotalBudget) + '</b></div>';
}

/**
 * 
 * @param {number} buildingIndex
 * @returns
 */
function GetBuildingBudget(buildingIndex) {
    let res = 0;
    for (let i = 0; i < selectedProject.FramingInvoiceList[0].Buildings[buildingIndex].Pairs.length; i++) {
        res += selectedProject.FramingInvoiceList[0].Buildings[buildingIndex].Pairs[i].Value;
    }
    res += selectedProject.FormingInvoiceList[0].Buildings.Pairs[buildingIndex].Value;
    return res;
}





