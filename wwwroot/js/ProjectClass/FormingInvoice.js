import { PairList } from "./PairDetails.js";
export class FormingInvoice {
    InvoiceNumber;
    InvoiceDate;
    Buildings;
    ToBeInvoiced;
    InvoiceCharge;

    constructor() {
        this.InvoiceNumber = 0;
        this.InvoiceDate = "";
        this.Buildings = new PairList();
        this.ToBeInvoiced = new PairList();
        this.InvoiceCharge = 0;
    }
}