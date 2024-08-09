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

//Variables
let TableType = "";
let selectedProject = new SJC_Project();



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
                ValidateProjectData();
                ShowProjectDetailsOnPage();
            }
        });
}

function UpdateProjectInvoices(proj) {
    $.post("/apis/UpdateProjectInvoices",
        JSON.stringify(proj),
        function (data, status) {
            alert(status);
        });
}


//functions

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
    //invoiceNumberHolder.innerHTML=
}

//const tableD = new DataFormat.TableDataSet();
//tableD.AddRow(["Invoice #1", "% of total budget", "% Invoiced Previously", "% on this invoice", "Cost on this invoice", "10% Holdback", "GST", "Invoice"]);
//tableD.AddRow(["Basement Walls", "", "", "", "", "", "", ""]);
//tableD.AddRow(["Main Floor", "", "", "", "", "", "", ""]);
//tableD.AddRow(["Main Walls", "", "", "", "", "", "", ""]);
//tableD.AddRow(["Upper Floor", "", "", "", "", "", "", ""]);
//tableD.AddRow(["Upper Walls", "", "", "", "", "", "", ""]);
//tableD.AddRow(["Roof", "", "", "", "", "", "", ""]);
//tableD.AddRow(["Stairs", "", "", "", "", "", "", ""]);
//tableD.AddRow(["Seismic", "", "", "", "", "", "", ""]);
//tableD.AddRow(["Windows", "", "", "", "", "", "", ""]);
//tableD.AddRow(["Backframe", "", "", "", "", "", "", ""]);
//tableD.AddRow(["Decks", "", "", "", "", "", "", ""]);
//tableD.AddRow(["Drops", "", "", "", "", "", "", ""]);

//const tableD2 = new DataFormat.TableDataSet();
//tableD2.AddRow(["Invoice #2", "% of total budget", "% Invoiced Previously", "% on this invoice", "Cost on this invoice", "10% Holdback", "GST", "Invoice"]);
//tableD2.AddRow(["Basement Walls", "", "", "", "", "", "", ""]);
//tableD2.AddRow(["Main Floor", "", "", "", "", "", "", ""]);
//tableD2.AddRow(["Main Walls", "", "", "", "", "", "", ""]);
//tableD2.AddRow(["Upper Floor", "", "", "", "", "", "", ""]);
//tableD2.AddRow(["Upper Walls", "", "", "", "", "", "", ""]);
//tableD2.AddRow(["Roof", "", "", "", "", "", "", ""]);
//tableD2.AddRow(["Stairs", "", "", "", "", "", "", ""]);
//tableD2.AddRow(["Seismic", "", "", "", "", "", "", ""]);
//tableD2.AddRow(["Windows", "", "", "", "", "", "", ""]);
//tableD2.AddRow(["Backframe", "", "", "", "", "", "", ""]);
//tableD2.AddRow(["Decks", "", "", "", "", "", "", ""]);
//tableD2.AddRow(["Drops", "", "", "", "", "", "", ""]);

//const elem = new Table("", tableD);

//const el = elem.ToHtmlObject();
//root.innerHTML = el+el+el;