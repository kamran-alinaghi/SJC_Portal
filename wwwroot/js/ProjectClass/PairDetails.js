export class PairList {
    Pairs;
    constructor() {
        this.Pairs = [new PairDetails()];
        this.Pairs.pop();
    }
}

export class PairDetails {
    Title;
    Value;
    constructor() {
        this.Title = "";
        this.Value = 0;
    }
}