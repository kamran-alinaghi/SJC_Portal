import * as Styles from "./Elements/StyleData.js";
import * as DataFormat from "./Elements/DataFormat.js";
import { Table } from "./Elements/TableElement.js";
import { SJC_Project } from "./ProjectClass/SJC_Project.js";
import { PairList } from "./ProjectClass/PairDetails.js";
import { PairDetails } from "./ProjectClass/PairDetails.js";
import { FramingInvoice } from "./ProjectClass/FramingInvoice.js";
import { FormingInvoice } from "./ProjectClass/FormingInvoice.js";

//Elements
const summaryBtn = document.getElementById("invoce-summary-btn");
const saveBtn = document.getElementById("invoce-save-btn");
const addBtn = document.getElementById("add-invoice-btn");
const delBtn = document.getElementById("remove-invoice-btn");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");
const projectNameHolder = document.getElementById("project-name-holder");
const invoiceNumberHolder = document.getElementById("invoice-number-holder");
const root = document.getElementById("root");
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

//Variables
let TableType = "";
let selectedProject = new SJC_Project();
let currentPageIndex = 0;
const tableData = [new DataFormat.TableDataSet()];
tableData.pop();
const elem = [new Table("", new DataFormat.TableDataSet())];
elem.pop();
let idList = [""];
idList.pop();



GetTableName();
//APIs

function GetTableName() {
    $.post("/apis/GetTableName", "",
        function (data, status) {
            if (status == "success") {
                TableType = data;
                GetInvoiceList();
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
    FormIdList();
    CorrectFormatting();
    AddEvents();
}

function ValidateProjectData() {
    let needsUpdate = false;
    if (selectedProject.FramingTitles.length < 1) {
        selectedProject.FramingTitles = ["Basement Walls", "Main Floor", "Main Walls", "Upper Floor", "Upper Walls", "Roof", "Stairs", "Seismic", "Windows", "Backframe", "Decks", "Drops"];
        needsUpdate = true;
    }
    if (selectedProject.FramingInvoiceList.length < 1) {
        selectedProject.FramingInvoiceList.push(new FramingInvoice());
        for (let i = 0; i < selectedProject.BuildingQty; i++) {
            selectedProject.FramingInvoiceList[0].Buildings.push(new PairList());
            selectedProject.FramingInvoiceList[0].ToBeInvoiced.push(new PairList());
            for (let j = 0; j < selectedProject.FramingTitles.length; j++) {
                selectedProject.FramingInvoiceList[0].Buildings[i].Pairs.push(new PairDetails());
                selectedProject.FramingInvoiceList[0].Buildings[i].Pairs[j].Title = selectedProject.FramingTitles[j];
                selectedProject.FramingInvoiceList[0].ToBeInvoiced[i].Pairs.push(new PairDetails());
                selectedProject.FramingInvoiceList[0].ToBeInvoiced[i].Pairs[j].Title = selectedProject.FramingTitles[j];
            }
        }
        needsUpdate = true;
    }
    if (selectedProject.FormingInvoiceList.length < 1) {
        selectedProject.FormingInvoiceList.push(new FormingInvoice());
        for (let i = 0; i < selectedProject.BuildingQty; i++) {
            selectedProject.FormingInvoiceList[0].Buildings.Pairs.push(new PairDetails());
            selectedProject.FormingInvoiceList[0].Buildings.Pairs[i].Title = "Building " + (i + 1).toString();
            selectedProject.FormingInvoiceList[0].ToBeInvoiced.Pairs.push(new PairDetails());
            selectedProject.FormingInvoiceList[0].ToBeInvoiced.Pairs[i].Title = "Building " + (i + 1).toString();
        }
        needsUpdate = true;
    }
    if (needsUpdate) {
        root.innerHTML = JSON.stringify(selectedProject);
        UpdateProjectInvoices(selectedProject);
    }
}

function ShowProjectDetailsOnPage() {
    projectNameHolder.innerHTML = selectedProject.Title + " (" + TableType + ")";
    let dateStr = "";
    if (TableType == "Forming") { dateStr = selectedProject.FormingInvoiceList[currentPageIndex].InvoiceDate; }
    else { dateStr = selectedProject.FramingInvoiceList[currentPageIndex].InvoiceDate; }
    if (currentPageIndex > 0) { invoiceNumberHolder.innerHTML = "Invoice #" + currentPageIndex + "(" + dateStr + ")"; }
    else { invoiceNumberHolder.innerHTML = "Initial Values"; }
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
    }
    else {
        DrawInvoices();
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
    }
}

function AddEvents() {
    for (let i = 0; i < idList.length; i++) {
        const el = document.getElementById(idList[i]);
        if (currentPageIndex == 0) { el.onchange = function (e) { return ChangeEachCellInitialValues(e.target, 1, 2); }; }
        else {
            el.onchange = function (e) { return ChangeEachCell(e.target); }
        }
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
        if (TableType=="Framing" && currentPageIndex < selectedProject.FramingInvoiceList.length - 1) {
            currentPageIndex++;
            InitializePage();
        }
        else if(TableType == "Forming" && currentPageIndex < selectedProject.FormingInvoiceList.length - 1){
            currentPageIndex++;
            InitializePage();
        }
    }
}









function DrawInitialValuesTable() {
    tableData.length = 0;
    if (TableType == "Framing") {
        for (let i = 0; i < selectedProject.FramingInvoiceList[0].Buildings.length; i++) {
            tableData.push(new DataFormat.TableDataSet(i));
            tableData[i].AddRow([selectedProject.FormingTitles[i], "% of total budget", "SJC Subtotal", "Sub Contract Total"]);
            for (let j = 0; j < selectedProject.FramingInvoiceList[0].Buildings[i].Pairs.length; j++) {
                const rowToAdd = [
                    selectedProject.FramingInvoiceList[0].Buildings[i].Pairs[j].Title,
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
                selectedProject.FormingInvoiceList[0].Buildings.Pairs[i].Title,
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

        }
        else {

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
                        selectedProject.FramingInvoiceList[1].Buildings[i].Pairs[j].Title,
                        val * 100 / selectedProject.FramingBudget,
                        selectedProject.FramingInvoiceList[1].Buildings[i].Pairs[j].Percent,
                        val,
                        val * 0.1,
                        val * 0.045, // 0.9 * 0.05
                        val * 0.945
                    ]);
                }
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
                    selectedProject.FormingInvoiceList[1].Buildings.Pairs[i].Title,
                    val * 100 / selectedProject.FramingBudget,
                    selectedProject.FormingInvoiceList[1].Buildings.Pairs[i].Percent,
                    val,
                    val * 0.1,
                    val * 0.045, // 0.9 * 0.05
                    val * 0.945
                ]);
            }
            tableData[0].ColumnType = ["text", "percent", "percent", "price", "price", "price", "price"];
            tableData[0].ColumnEditable = [true, false, true, false, false, false, false];
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
    if (tableData[b].ColumnType[c] == "text") {
        midValue = element.value;
    }
    else {
        midValue = parseFloat(element.value);
        if (isNaN(midValue)) { midValue = 0; }
    }
    
    if (tableData[b].ColumnEditable[c]) {
        if (c == percentColumnIndex) {
            SetValueOfCell(b, r, priceColumnIndex, (midValue * selectedProject.FramingBudget / 100), true);
            SetValueOfCell(b, r, percentColumnIndex, midValue, true);
        }
        else if (c == priceColumnIndex) {
            SetValueOfCell(b, r, percentColumnIndex, (100 * midValue / selectedProject.FramingBudget), true);
            SetValueOfCell(b, r, priceColumnIndex, midValue, true);
        }
        else {
            SetValueOfCell(b, r, c, midValue, true);
        }
    }

    if (TableType == "Forming" && c == 0) {
        selectedProject.FormingTitles[r] = element.value;
    }
}

function ChangeEachCell(element) {
    const b = GetIndexFromString(element.id, "b");
    const r = GetIndexFromString(element.id, "r");
    const c = GetIndexFromString(element.id, "c");
    let midValue;
    if (tableData[b].ColumnType[c] == "text") {
        midValue = element.value;
    }
    else {
        midValue = parseFloat(element.value);
        if (isNaN(midValue)) { midValue = 0; }
    }
    const tableLength = tableData[0].Row[0].Column.length;
    if (c == tableLength - 5) {
        const val = (midValue * selectedProject.FramingInvoiceList[0].Buildings[b].Pairs[r].Value / 100);
        SetValueOfCell(b, r, tableLength - 4, val, true);
        SetValueOfCell(b, r, tableLength - 5, midValue, true);

        SetValueOfCell(b, r, tableLength - 3, (val * 0.1), true);
        SetValueOfCell(b, r, tableLength - 2, (val * 0.045), true);
        SetValueOfCell(b, r, tableLength - 1, (val * 0.945), true);
    }
    else if (c == tableLength - 4) {
        SetValueOfCell(b, r, tableLength - 5, (100 * midValue / selectedProject.FramingBudget), true);
        SetValueOfCell(b, r, tableLength - 4, midValue, true);

        SetValueOfCell(b, r, tableLength - 3, (midValue * 0.1), true);
        SetValueOfCell(b, r, tableLength - 2, (midValue * 0.045), true);
        SetValueOfCell(b, r, tableLength - 1, (midValue * 0.945), true);
    }
    else {
        SetValueOfCell(b, r, c, midValue, true);
    }

    if (TableType == "Forming" && c == 0) {
        selectedProject.FormingTitles[r] = element.value;
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
        else if (currentPageIndex == 1) {
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
    if (tableData[tableIndex].ColumnEditable[columnIndex]) { document.getElementById(idStr).value = showValue; }
    else { document.getElementById(idStr).innerHTML = showValue; }
    if (shouldSave) {
        EditProjectDetails(tableIndex, rowIndex, columnIndex, tosaveData);
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

