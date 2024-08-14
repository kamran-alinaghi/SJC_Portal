import { PairList } from "./PairDetails.js";
export class FramingInvoice {
    InvoiceNumber;
    InvoiceDate;
    Buildings;
    ToBeInvoiced;
    InvoiceCharge;
    CraneCharge;

    constructor() {
        this.InvoiceNumber = "";
        this.InvoiceDate = "";
        this.Buildings = [new PairList()];
        this.Buildings.pop();
        this.ToBeInvoiced = [new PairList()];
        this.ToBeInvoiced.pop();
        this.InvoiceCharge = 0;
        this.CraneCharge = 0;
    }
}