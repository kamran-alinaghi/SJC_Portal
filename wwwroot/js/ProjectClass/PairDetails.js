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
    Percent;
    SecondValue;
    constructor() {
        this.Title = "";
        this.Value = 0;
        this.Percent = 0;
        this.SecondValue = 0;
    }
}