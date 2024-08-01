import { BuildingDetails } from "./BuildingDetails.js";
export class Invoice {
    InvoiceNumber;
    InvoiceDate;
    Buildings;
    ToBeInvoiced;
    InvoiceCharge;
    CraneCharge;

    constructor() {
        this.InvoiceNumber = "";
        this.InvoiceDate = "";
        this.Buildings = [new BuildingDetails()];
        this.Buildings.pop();
        this.ToBeInvoiced = new BuildingDetails();
        this.InvoiceCharge = 0;
        this.CraneCharge = 0;
    }
}