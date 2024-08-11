import { FramingInvoice } from "./FramingInvoice.js";
import { FormingInvoice } from "./FormingInvoice.js";
export class SJC_Project {
    _id;
    Title;
    IsCompelete;
    ContractDate;
    TotalBudget;
    FramingBudget;
    BuildingQty;
    PercentBase;
    FramingContractNo;
    FormingContractNo;
    FramingTitles;
    FramingInvoiceList;
    FormingInvoiceList;

    constructor() {
        this._id = "";
        this.Title = "";
        this.IsCompelete = false;
        this.ContractDate = "";
        this.TotalBudget = 0;
        this.FramingBudget = 0;
        this.BuildingQty = 0;
        this.PercentBase = false;
        this.FramingContractNo = "";
        this.FormingContractNo = "";
        this.FramingTitles = [""];
        this.FramingTitles.pop();
        this.FormingTitles = [""];
        this.FormingTitles.pop();
        this.FramingInvoiceList = [new FramingInvoice()];
        this.FramingInvoiceList.pop();
        this.FormingInvoiceList = [new FormingInvoice()];
        this.FormingInvoiceList.pop();
    }
}