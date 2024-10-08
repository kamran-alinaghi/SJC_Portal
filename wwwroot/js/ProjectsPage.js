﻿import * as DataFormat from "./Elements/DataFormat.js";
import { Table } from "./Elements/TableElement.js";
import { SJC_Project } from "./ProjectClass/SJC_Project.js";
import { PairList } from "./ProjectClass/PairDetails.js";
import { PairDetails } from "./ProjectClass/PairDetails.js";
import { FramingInvoice } from "./ProjectClass/FramingInvoice.js";
import { FormingInvoice } from "./ProjectClass/FormingInvoice.js";
import { tableStyle } from "./Elements/StyleData.js";

//Elements
const summaryBtn = document.getElementById("invoce-summary-btn");
const saveBtn = document.getElementById("invoce-save-btn");
const addBtn = document.getElementById("add-invoice-btn");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");
const projectNameHolder = document.getElementById("project-name-holder");
const invoiceNumberHolder = document.getElementById("invoice-number-holder");
const root = document.getElementById("root");
const invoiceLabel = document.getElementById("invoice-label");
const dateInput = document.getElementById("date-input");
const summaryContainer = document.getElementById("summary-container");
const summaryTable = document.getElementById("summary-table");
const closeBtn = document.getElementById("summary-close-button");



//Variables
let TableType = "";
let selectedProject = new SJC_Project();
let currentPageIndex = 0;
const tableData = [new DataFormat.TableDataSet()];
tableData.pop();
const summaryTableData = new DataFormat.TableDataSet();
const elem = [new Table("", new DataFormat.TableDataSet())];
elem.pop();
let idList = [""];
idList.pop();
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});
let sumArray = [0];
sumArray.pop();


GetTableName();
//APIs

function GetTableName() {
    $.post("/apis/GetTableName", "",
        function (data, status) {
            if (status == "success") {

                TableType = data;
                GetInvoiceList();
            }
            else {
                window.location.href = "/user/index";
            }
        });
}

function GetInvoiceList() {
    $.post("/apis/GetProjectById", "",
        function (data, status) {
            if (status == "success") {
                selectedProject = JSON.parse(data);
                currentPageIndex = GetCurrentPageIndex();
                InitializePage();
            }
        });
}

function UpdateProjectInvoices(proj) {
    $.post("/apis/UpdateProjectInvoices",
        JSON.stringify(proj),
        function (data, status) {
            //alert(status);
        });
}


//functions

function InitializePage() {
    ShowProjectDetailsOnPage();
    DrawTable();
    DrawSummaryTable();
    FormIdList();
    CorrectFormatting();
    AddEvents();
}


function ShowProjectDetailsOnPage() {
    projectNameHolder.innerHTML = selectedProject.Title + " (" + TableType + ")";
    let dateStr = "";
    let invoiceNumberStr = "";
    if (TableType == "Forming") {
        dateStr = selectedProject.FormingInvoiceList[currentPageIndex].InvoiceDate;
        invoiceNumberStr = selectedProject.FormingInvoiceList[currentPageIndex].InvoiceNumber;
    }
    else {
        dateStr = selectedProject.FramingInvoiceList[currentPageIndex].InvoiceDate;
        invoiceNumberStr = selectedProject.FramingInvoiceList[currentPageIndex].InvoiceNumber;
    }

    dateInput.disabled = false;
    dateInput.value = dateStr;
    if (currentPageIndex == 0) {
        dateInput.value = selectedProject.ContractDate;
        dateInput.disabled = true;
    }


    invoiceNumberHolder.style.display = "block";
    invoiceLabel.innerHTML = "Invoice #";
    if (currentPageIndex == 0) {
        invoiceNumberHolder.style.display = "none";
        invoiceLabel.innerHTML = "Initial Values";
    }
    else if (invoiceNumberStr.length > 0 && currentPageIndex > 0) {
        invoiceNumberHolder.value = invoiceNumberStr;
    }
    else if (currentPageIndex > 0 && invoiceNumberStr.length < 1) {
        invoiceNumberHolder.value = currentPageIndex;
    }
}

function GetCurrentPageIndex() {
    let index = -1;
    if (TableType == "Forming") {
        index = selectedProject.FormingInvoiceList.length - 1;
    }
    else {
        index = selectedProject.FramingInvoiceList.length - 1;
    }
    return index;
}

function DrawTable() {
    if (currentPageIndex == 0) {
        DrawInitialValuesTable();
        summaryBtn.disabled = true;
    }
    else {
        DrawInvoices();
        if (TableType == "Framing") { summaryBtn.disabled = false; }
        else { summaryBtn.disabled = true; }
    }
}

function DrawSummaryTable() {
    if (currentPageIndex > 0 && TableType == "Framing") {
        sumArray.length = 0;
        for (let i = 0; i < selectedProject.FormingTitles.length; i++) {
            sumArray.push(GetSumValue(currentPageIndex, i));
        }
        let totalCharge = 0;
        const summaryTableDataSet = new DataFormat.TableDataSet(1000);
        summaryTableDataSet.AddRow(["Building Name", "Amount", "10% Holdback", "GST", "Invoice"]);
        for (let i = 0; i < sumArray.length; i++) {
            summaryTableDataSet.AddRow([selectedProject.FormingTitles[i], formatter.format(sumArray[i]), formatter.format(sumArray[i] * 0.1),
            formatter.format(sumArray[i] * 0.045), formatter.format(sumArray[i] * 0.945)]);
            totalCharge += sumArray[i];
        }
        summaryTableDataSet.AddLastRow(["Sum", formatter.format(totalCharge), formatter.format(totalCharge * 0.1),
            formatter.format(totalCharge * 0.045), formatter.format(totalCharge * 0.945)]);
        const summaryTableElement = new Table("Summary", summaryTableDataSet);
        summaryTable.innerHTML = summaryTableElement.ToHtmlObject();
    }
}

function FormIdList() {
    idList.length = 0;
    for (let i = 0; i < tableData.length; i++) {
        for (let j = 0; j < tableData[i].Row.length - 1; j++) {
            for (let k = 0; k < tableData[i].Row[j].Column.length; k++) {
                const idStr = 'b' + i + '-r' + j + '-c' + k + '-';
                idList.push(idStr);
            }
        }
    }
}

function CorrectFormatting() {
    for (let i = 0; i < tableData.length; i++) {
        for (let j = 0; j < tableData[i].Row.length - 1; j++) {
            for (let k = 0; k < tableData[i].Row[j].Column.length; k++) {
                SetValueOfCell(i, j, k, tableData[i].Row[j + 1].Column[k], false);
            }
        }
        for (let h = 0; h < tableData[i].LastRow.Column.length; h++) {
            SetValueOfCell(i, tableData[i].Row.length - 1, h, tableData[i].LastRow.Column[h], false);
        }
    }
}

function AddEvents() {
    for (let i = 0; i < idList.length; i++) {
        const el = document.getElementById(idList[i]);
        if (currentPageIndex == 0) { el.onchange = function (e) { return ChangeEachCellInitialValues(e.target, 1, 2); }; }
        else {
            el.onchange = function (e) { return ChangeEachCell(e.target); }
        }
        el.onclick = function () { el.select(); };
    }
    saveBtn.onclick = function () { return UpdateProjectInvoices(selectedProject); };
    addBtn.onclick = function () { return AddInvoice(); };
    leftBtn.onclick = function () {
        if (currentPageIndex > 0) {
            currentPageIndex--;
            InitializePage();
        }
    };

    rightBtn.onclick = function () {
        if (TableType == "Framing" && currentPageIndex < selectedProject.FramingInvoiceList.length - 1) {
            currentPageIndex++;
            InitializePage();
        }
        else if (TableType == "Forming" && currentPageIndex < selectedProject.FormingInvoiceList.length - 1) {
            currentPageIndex++;
            InitializePage();
        }
    }

    invoiceNumberHolder.onchange = function () {
        if (invoiceNumberHolder.value.length > 0) {
            if (TableType == "Framing") { selectedProject.FramingInvoiceList[currentPageIndex].InvoiceNumber = invoiceNumberHolder.value; }
            else { selectedProject.FormingInvoiceList[currentPageIndex].InvoiceNumber = invoiceNumberHolder.value; }
        }
    }
    dateInput.onchange = function () {
        if (TableType == "Framing") { selectedProject.FramingInvoiceList[currentPageIndex].InvoiceDate = dateInput.value; }
        else { selectedProject.FormingInvoiceList[currentPageIndex].InvoiceDate = dateInput.value; }
    }

    summaryBtn.onclick = function () { return ShowSummary(); };
    closeBtn.onclick = function () { summaryContainer.style.visibility = "hidden"; };
}









function DrawInitialValuesTable() {
    tableData.length = 0;
    if (TableType == "Framing") {
        for (let i = 0; i < selectedProject.FramingInvoiceList[0].Buildings.length; i++) {
            tableData.push(new DataFormat.TableDataSet(i));
            tableData[i].AddRow([selectedProject.FormingTitles[i], "% of total budget", "SJC Subtotal", "Sub Contract Total"]);
            for (let j = 0; j < selectedProject.FramingInvoiceList[0].Buildings[i].Pairs.length; j++) {
                const rowToAdd = [
                    selectedProject.FramingTitles[j],
                    selectedProject.FramingInvoiceList[0].Buildings[i].Pairs[j].Percent,
                    selectedProject.FramingInvoiceList[0].Buildings[i].Pairs[j].Value,
                    selectedProject.FramingInvoiceList[0].Buildings[i].Pairs[j].SecondValue
                ];
                tableData[i].AddRow(rowToAdd);
            }
            tableData[i].ColumnType = ["text", "percent", "price", "price"];
            tableData[i].ColumnEditable = [true, true, true, true];
        }
    }
    else {
        tableData.push(new DataFormat.TableDataSet(0));
        tableData[0].AddRow(["Foundation Completion", "% of total budget", "SJC Subtotal", "Sub Contract Total"]);
        for (let i = 0; i < selectedProject.FormingInvoiceList[0].Buildings.Pairs.length; i++) {
            tableData[0].AddRow([
                selectedProject.FormingTitles[i],
                selectedProject.FormingInvoiceList[0].Buildings.Pairs[i].Percent,
                selectedProject.FormingInvoiceList[0].Buildings.Pairs[i].Value,
                selectedProject.FormingInvoiceList[0].Buildings.Pairs[i].SecondValue
            ]);
        }
        tableData[0].ColumnType = ["text", "percent", "price", "price"];
        tableData[0].ColumnEditable = [true, true, true, true];
    }
    elem.length = 0;
    for (let i = 0; i < tableData.length; i++) {
        elem.push(new Table("", tableData[i]));
    }
    root.innerHTML = "";
    for (let i = 0; i < elem.length; i++) {
        root.innerHTML += elem[i].ToHtmlObject();
    }
}

function DrawInvoices() {
    tableData.length = 0;
    if (currentPageIndex > 1) {
        if (TableType == "Framing") {
            for (let i = 0; i < selectedProject.FramingInvoiceList[currentPageIndex].Buildings.length; i++) {
                tableData.push(new DataFormat.TableDataSet(i));
                tableData[i].AddRow([selectedProject.FormingTitles[i], "% of total budget", "% Invoiced Previously", "% on this invoice", "Amount", "10% Holdback", "GST", "Invoice"]);
                for (let j = 0; j < selectedProject.FramingInvoiceList[currentPageIndex].Buildings[i].Pairs.length; j++) {
                    let val = selectedProject.FramingInvoiceList[0].Buildings[i].Pairs[j].Value * selectedProject.FramingInvoiceList[currentPageIndex].Buildings[i].Pairs[j].Percent / 100;
                    let prevVal = 0;
                    for (let k = 1; k < currentPageIndex; k++) {
                        prevVal += parseFloat(selectedProject.FramingInvoiceList[k].Buildings[i].Pairs[j].Percent);
                    }
                    tableData[i].AddRow([
                        selectedProject.FramingTitles[j],
                        val * 100 / selectedProject.FramingBudget,
                        prevVal,
                        selectedProject.FramingInvoiceList[currentPageIndex].Buildings[i].Pairs[j].Percent,
                        val,
                        val * 0.1,
                        val * 0.045, // 0.9 * 0.05
                        val * 0.945
                    ]);
                }
                let sumValue = GetSumValue(currentPageIndex, i);
                tableData[i].AddLastRow([
                    "Sum",
                    " ",
                    " ",
                    " ",
                    sumValue,
                    sumValue * 0.1,
                    sumValue * 0.045, // 0.9 * 0.05
                    sumValue * 0.945
                ]);
                tableData[i].ColumnType = ["text", "percent", "percent", "percent", "price", "price", "price", "price"];
                tableData[i].ColumnEditable = [true, false, false, true, false, false, false, false];
            }
        }
        else {
            tableData.push(new DataFormat.TableDataSet(0));
            tableData[0].AddRow(["Foundation Completion", "% of total budget", "% Invoiced Previously", "% on this invoice", "Amount", "10% Holdback", "GST", "Invoice"]);
            for (let i = 0; i < selectedProject.FormingInvoiceList[currentPageIndex].Buildings.Pairs.length; i++) {
                let val = selectedProject.FormingInvoiceList[0].Buildings.Pairs[i].Value * selectedProject.FormingInvoiceList[currentPageIndex].Buildings.Pairs[i].Percent / 100;
                let prevVal = 0;
                for (let k = 1; k < currentPageIndex; k++) {
                    prevVal += parseFloat(selectedProject.FormingInvoiceList[k].Buildings.Pairs[i].Percent);
                }
                tableData[0].AddRow([
                    selectedProject.FormingTitles[i],
                    val * 100 / (selectedProject.TotalBudget - selectedProject.FramingBudget),
                    prevVal,
                    selectedProject.FormingInvoiceList[currentPageIndex].Buildings.Pairs[i].Percent,
                    val,
                    val * 0.1,
                    val * 0.045, // 0.9 * 0.05
                    val * 0.945
                ]);
            }
            let sumValue = GetSumValue(currentPageIndex, 0);
            tableData[0].AddLastRow([
                "Sum",
                " ",
                " ",
                " ",
                sumValue,
                sumValue * 0.1,
                sumValue * 0.045, // 0.9 * 0.05
                sumValue * 0.945
            ]);
            tableData[0].ColumnType = ["text", "percent", "percent", "percent", "price", "price", "price", "price"];
            tableData[0].ColumnEditable = [true, false, false, true, false, false, false, false];
        }
    }
    else {
        if (TableType == "Framing") {
            for (let i = 0; i < selectedProject.FramingInvoiceList[1].Buildings.length; i++) {
                tableData.push(new DataFormat.TableDataSet(i));
                tableData[i].AddRow([selectedProject.FormingTitles[i], "% of total budget", "% on this invoice", "Amount", "10% Holdback", "GST", "Invoice"]);
                for (let j = 0; j < selectedProject.FramingInvoiceList[1].Buildings[i].Pairs.length; j++) {
                    let val = selectedProject.FramingInvoiceList[0].Buildings[i].Pairs[j].Value * selectedProject.FramingInvoiceList[1].Buildings[i].Pairs[j].Percent / 100;
                    tableData[i].AddRow([
                        selectedProject.FramingTitles[j],
                        val * 100 / selectedProject.FramingBudget,
                        selectedProject.FramingInvoiceList[1].Buildings[i].Pairs[j].Percent,
                        val,
                        val * 0.1,
                        val * 0.045, // 0.9 * 0.05
                        val * 0.945
                    ]);
                }

                let sumValue = GetSumValue(1, i);
                tableData[i].AddLastRow([
                    "Sum",
                    " ",
                    " ",
                    sumValue,
                    sumValue * 0.1,
                    sumValue * 0.045, // 0.9 * 0.05
                    sumValue * 0.945
                ]);
                tableData[i].ColumnType = ["text", "percent", "percent", "price", "price", "price", "price"];
                tableData[i].ColumnEditable = [true, false, true, false, false, false, false];
            }
        }
        else {
            tableData.push(new DataFormat.TableDataSet(0));
            tableData[0].AddRow(["Foundation Completion", "% of total budget", "% on this invoice", "Amount", "10% Holdback", "GST", "Invoice"]);
            for (let i = 0; i < selectedProject.FormingInvoiceList[1].Buildings.Pairs.length; i++) {
                let val = selectedProject.FormingInvoiceList[0].Buildings.Pairs[i].Value * selectedProject.FormingInvoiceList[1].Buildings.Pairs[i].Percent / 100;
                tableData[0].AddRow([
                    selectedProject.FormingTitles[i],
                    val * 100 / (selectedProject.TotalBudget - selectedProject.FramingBudget),
                    selectedProject.FormingInvoiceList[1].Buildings.Pairs[i].Percent,
                    val,
                    val * 0.1,
                    val * 0.045, // 0.9 * 0.05
                    val * 0.945
                ]);
            }
            let sumValue = GetSumValue(1, 0);
            tableData[0].AddLastRow([
                "Sum",
                " ",
                " ",
                sumValue,
                sumValue * 0.1,
                sumValue * 0.045, // 0.9 * 0.05
                sumValue * 0.945
            ]);
            tableData[0].ColumnType = ["text", "percent", "percent", "price", "price", "price", "price"];
            tableData[0].ColumnEditable = [true, false, true, false, false, false, false];
        }
    }
    elem.length = 0;
    for (let i = 0; i < tableData.length; i++) {
        elem.push(new Table("", tableData[i]));
    }
    root.innerHTML = "";
    for (let i = 0; i < elem.length; i++) {
        root.innerHTML += elem[i].ToHtmlObject();
    }
}

/**
 * 
 * @param {HTMLElement} element
 * @param {number} percent
 * @param {number} price
 * @param {number[]} otherColumns
 */
function ChangeEachCellInitialValues(element, percentColumnIndex, priceColumnIndex) {
    const b = GetIndexFromString(element.id, "b");
    const r = GetIndexFromString(element.id, "r");
    const c = GetIndexFromString(element.id, "c");
    let midValue;
    let tempBudget = 0;
    if (tableData[b].ColumnType[c] == "text") {
        midValue = element.value;
    }
    else {
        midValue = parseFloat(element.value);
        if (isNaN(midValue)) { midValue = 0; }
    }
    if (TableType == "Framing") {
        tempBudget = selectedProject.FramingBudget;
    }
    else {
        tempBudget = selectedProject.TotalBudget - selectedProject.FramingBudget;
    }

    if (tableData[b].ColumnEditable[c]) {
        if (c == percentColumnIndex) {
            SetValueOfCell(b, r, priceColumnIndex, (midValue * tempBudget / 100), true);
            SetValueOfCell(b, r, percentColumnIndex, midValue, true);
        }
        else if (c == priceColumnIndex) {
            SetValueOfCell(b, r, percentColumnIndex, (100 * midValue / tempBudget), true);
            SetValueOfCell(b, r, priceColumnIndex, midValue, true);
        }
        else {
            SetValueOfCell(b, r, c, midValue, true);
        }
    }

    if (TableType == "Forming" && c == 0) {
        selectedProject.FormingTitles[r] = element.value;
    }
    if (TableType == "Framing" && c == 0) {
        selectedProject.FramingTitles[r] = element.value;
    }
}

function ChangeEachCell(element) {
    const b = GetIndexFromString(element.id, "b");
    const r = GetIndexFromString(element.id, "r");
    const c = GetIndexFromString(element.id, "c");
    let midValue;
    let refVal = 0;
    let tempBudget = 0;

    if (tableData[b].ColumnType[c] == "text") {
        midValue = element.value;
    }
    else {
        midValue = parseFloat(element.value);
        if (isNaN(midValue) || midValue < 0) { midValue = 0; }
        if (currentPageIndex > 1) {
            let preVal = GetPreviosValue(b, r, c);
            if (midValue > (100 - preVal)) { midValue = 100 - preVal; }
        }
        else { if (midValue > 100) { midValue = 100; } }
    }
    const tableLength = tableData[0].Row[0].Column.length;
    const tableRows = tableData[0].Row.length - 1;
    if (c == tableLength - 5) {
        if (TableType == "Framing") {
            refVal = selectedProject.FramingInvoiceList[0].Buildings[b].Pairs[r].Value;
            tempBudget = selectedProject.FramingBudget;
        }
        else {
            refVal = selectedProject.FormingInvoiceList[0].Buildings.Pairs[r].Value;
            tempBudget = selectedProject.TotalBudget - selectedProject.FramingBudget;
        }
        const dollarVal = (midValue * refVal / 100);
        SetValueOfCell(b, r, tableLength - 4, dollarVal, true);
        SetValueOfCell(b, r, tableLength - 5, midValue, true);

        SetValueOfCell(b, r, tableLength - 3, (dollarVal * 0.1), true);
        SetValueOfCell(b, r, tableLength - 2, (dollarVal * 0.045), true);
        SetValueOfCell(b, r, tableLength - 1, (dollarVal * 0.945), true);
        SetValueOfCell(b, r, 1, (dollarVal * 100 / tempBudget), true);

        const sumVal = GetSumValue(currentPageIndex, b);
        SetValueOfCell(b, tableRows, tableLength - 4, sumVal, false);
        SetValueOfCell(b, tableRows, tableLength - 3, sumVal * 0.1, false);
        SetValueOfCell(b, tableRows, tableLength - 2, sumVal * 0.045, false);
        SetValueOfCell(b, tableRows, tableLength - 1, sumVal * 0.945, false);
    }
    else {
        SetValueOfCell(b, r, c, midValue, true);
    }

    if (TableType == "Forming" && c == 0) {
        selectedProject.FormingTitles[r] = element.value;
    }

    if (TableType == "Framing" && c == 0) {
        selectedProject.FramingTitles[r] = element.value;
    }
}

/**
 * 
 * @param {string} str
 * @param {string} indexer
 */
function GetIndexFromString(str, indexer) {
    let res = "";
    let found = false;
    for (let i = 0; i < str.length; i++) {
        if (str[i] == indexer) {
            for (let j = i + 1; j < str.length; j++) {
                if (str[j] != "-") { res += str[j]; }
                else { break; }
            }
            found = true;
        }
        if (found) { break; }
    }
    return parseInt(res);
}

/**
 * 
 * @param {number} tableIndex
 * @param {number} rowIndex
 * @param {number} columnIndex
 * @returns
 */
function GetPreviosValue(tableIndex, rowIndex, columnIndex) {
    const idStr = "b" + tableIndex + "-r" + rowIndex + "-c" + (columnIndex - 1).toString() + "-";
    const el = document.getElementById(idStr);
    return parseFloat(el.innerHTML);
}

/**
 * 
 * @param {number} buildingIndex
 * @param {number} rowIndex
 * @param {number} columnIndex
 * @param {any} value
 */
function EditProjectDetails(buildingIndex, rowIndex, columnIndex, value) {
    if (TableType == "Framing") {
        if (currentPageIndex == 0) {
            switch (columnIndex) {
                case 0:
                    selectedProject.FramingInvoiceList[0].Buildings[buildingIndex].Pairs[rowIndex].Title = value;
                    break;
                case 1:
                    selectedProject.FramingInvoiceList[0].Buildings[buildingIndex].Pairs[rowIndex].Percent = value;
                    break;
                case 2:
                    selectedProject.FramingInvoiceList[0].Buildings[buildingIndex].Pairs[rowIndex].Value = value;
                    break;
                case 3:
                    selectedProject.FramingInvoiceList[0].Buildings[buildingIndex].Pairs[rowIndex].SecondValue = value;
                    break;
            }
        }
        else if (currentPageIndex < 2) {
            switch (columnIndex) {
                case 0:
                    selectedProject.FramingInvoiceList[1].Buildings[buildingIndex].Pairs[rowIndex].Title = value;
                    break;
                case 2:
                    selectedProject.FramingInvoiceList[1].Buildings[buildingIndex].Pairs[rowIndex].Percent = value;
                    break;
                default:
                    break;
            }
        }
        else {
            switch (columnIndex) {
                case 0:
                    selectedProject.FramingInvoiceList[currentPageIndex].Buildings[buildingIndex].Pairs[rowIndex].Title = value;
                    break;
                case 3:
                    selectedProject.FramingInvoiceList[currentPageIndex].Buildings[buildingIndex].Pairs[rowIndex].Percent = value;
                    break;
                default:
                    break;
            }
        }
    }
    else {
        if (currentPageIndex == 0) {
            switch (columnIndex) {
                case 0:
                    selectedProject.FormingInvoiceList[0].Buildings.Pairs[rowIndex].Title = value;
                    break;
                case 1:
                    selectedProject.FormingInvoiceList[0].Buildings.Pairs[rowIndex].Percent = value;
                    break;
                case 2:
                    selectedProject.FormingInvoiceList[0].Buildings.Pairs[rowIndex].Value = value;
                    break;
                case 3:
                    selectedProject.FormingInvoiceList[0].Buildings.Pairs[rowIndex].SecondValue = value;
                    break;
            }
        }
        else if (currentPageIndex == 1) {
            switch (columnIndex) {
                case 0:
                    selectedProject.FormingInvoiceList[1].Buildings.Pairs[rowIndex].Title = value;
                    break;
                case 2:
                    selectedProject.FormingInvoiceList[1].Buildings.Pairs[rowIndex].Percent = value;
                    break;
                default:
                    break;
            }
        }
        else {
            switch (columnIndex) {
                case 0:
                    selectedProject.FormingInvoiceList[currentPageIndex].Buildings.Pairs[rowIndex].Title = value;
                    break;
                case 3:
                    selectedProject.FormingInvoiceList[currentPageIndex].Buildings.Pairs[rowIndex].Percent = value;
                    break;
                default:
                    break;
            }
        }
    }
}
/**
 * 
 * @param {number} tableIndex
 * @param {number} rowIndex
 * @param {number} columnIndex
 * @param {any} value
 */
function SetValueOfCell(tableIndex, rowIndex, columnIndex, value, shouldSave = false) {
    const idStr = 'b' + tableIndex + '-r' + rowIndex + '-c' + columnIndex + '-';
    const selectedElement = document.getElementById(idStr);
    if (selectedElement.getAttribute("data-can-style") != "false") {
        let correctedValue = parseFloat(value);
        if (isNaN(correctedValue)) { correctedValue = 0; }
        let showValue;
        let tosaveData;
        switch (tableData[tableIndex].ColumnType[columnIndex]) {
            case "price":
                showValue = formatter.format(correctedValue);
                tosaveData = parseFloat(correctedValue);
                break;
            case "percent":
                showValue = parseFloat(correctedValue).toFixed(2).toString() + " %";
                tosaveData = parseFloat(correctedValue).toFixed(2);
                break;
            default:
                showValue = value;
                tosaveData = value;
                break;
        }
        if (tableData[tableIndex].ColumnEditable[columnIndex]) { selectedElement.value = showValue; }
        else { selectedElement.innerHTML = showValue; }
        if (shouldSave) {
            EditProjectDetails(tableIndex, rowIndex, columnIndex, tosaveData);
        }
    }
}

function AddInvoice() {
    let index = 0;
    if (TableType == "Framing") {
        selectedProject.FramingInvoiceList.push(new FramingInvoice());
        index = selectedProject.FramingInvoiceList.length - 1;
        for (let i = 0; i < selectedProject.BuildingQty; i++) {
            selectedProject.FramingInvoiceList[index].Buildings.push(new PairList());
            selectedProject.FramingInvoiceList[index].ToBeInvoiced.push(new PairList());
            for (let j = 0; j < selectedProject.FramingTitles.length; j++) {
                selectedProject.FramingInvoiceList[index].Buildings[i].Pairs.push(new PairDetails());
                selectedProject.FramingInvoiceList[index].Buildings[i].Pairs[j].Title = selectedProject.FramingTitles[j];
                selectedProject.FramingInvoiceList[index].ToBeInvoiced[i].Pairs.push(new PairDetails());
                selectedProject.FramingInvoiceList[index].ToBeInvoiced[i].Pairs[j].Title = selectedProject.FramingTitles[j];
            }
        }
    }
    else {
        selectedProject.FormingInvoiceList.push(new FormingInvoice());
        index = selectedProject.FormingInvoiceList.length - 1;
        for (let i = 0; i < selectedProject.BuildingQty; i++) {
            selectedProject.FormingInvoiceList[index].Buildings.Pairs.push(new PairDetails());
            selectedProject.FormingInvoiceList[index].Buildings.Pairs[i].Title = selectedProject.FormingTitles[i];
            selectedProject.FormingInvoiceList[index].ToBeInvoiced.Pairs.push(new PairDetails());
            selectedProject.FormingInvoiceList[index].ToBeInvoiced.Pairs[i].Title = selectedProject.FormingTitles[i];
        }
    }
    currentPageIndex = GetCurrentPageIndex();
    InitializePage();
}

/**
 * 
 * @param {number} invoiceIndex
 * @param {number} tableIndex
 * @returns
 */
function GetSumValue(invoiceIndex, tableIndex) {
    let res = 0;
    if (TableType == "Framing") {
        for (let i = 0; i < selectedProject.FramingInvoiceList[invoiceIndex].Buildings[tableIndex].Pairs.length; i++) {
            res += selectedProject.FramingInvoiceList[invoiceIndex].Buildings[tableIndex].Pairs[i].Percent * selectedProject.FramingInvoiceList[0].Buildings[tableIndex].Pairs[i].Value / 100;
        }
    }
    else {
        for (let i = 0; i < selectedProject.FormingInvoiceList[invoiceIndex].Buildings.Pairs.length; i++) {
            res += selectedProject.FormingInvoiceList[invoiceIndex].Buildings.Pairs[i].Percent * selectedProject.FormingInvoiceList[0].Buildings.Pairs[i].Value / 100;
        }
    }
    return res;
}

function ShowSummary() {
    DrawSummaryTable();
    summaryContainer.style.visibility = "visible";
}




