import { Invoice } from "./Invoice.js";
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
    InvoiceList;

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
        this.InvoiceList = [new Invoice()];
        this.InvoiceList.pop();
    }
}