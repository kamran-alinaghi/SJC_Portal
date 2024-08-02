import { Invoice } from "./Invoice.js";
export class SJC_Project {
    Id;
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
        this.Id = 0;
        this.Title = "";
        this.IsCompelete = false;
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