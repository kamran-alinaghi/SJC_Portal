import { BaseElement } from "./BaseElement.js";
import { PairDetails, PairList } from "../ProjectClass/PairDetails.js";

export class BarChart extends BaseElement {
    BarList;
    ButtonDetails;
    #formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    constructor(id = 0) {
        super();
        this.BarList = [new PairDetails()];
        this.BarList.pop();
        this.Id = id;
        this.ButtonDetails = new PairDetails();
    }

    ToHtmlObject() {
        let result = '<div class="each-section"><button id="button-';
        result += this.Id;
        result += '" class="project-button" style="" data-rel="hiding-' + this.Id + '">';
        result += this.ButtonDetails.Title + ' (' + this.ButtonDetails.Percent.toFixed(2).toString() + '%)</button><div id="';
        result += 'hiding-' + this.Id + '" class="two-column hidden-section">';
        for (let i = 0; i < this.BarList.length; i++) {
            result += '<span class="bar-label">';
            result += this.BarList[i].Title;
            result += '</span><div class="bar-wrap"><div class="gray-bar">';
            result += '<span class="item-details"><b>';
            result += parseFloat(this.BarList[i].Percent).toFixed(2) + '%</b> <em>(<b style="color:blue;">' +
                this.#formatter.format(this.BarList[i].Value) + '</b> / <b style="color:green;">' +
                this.#formatter.format(this.BarList[i].SecondValue) + '</b>)</em>';
            result += '</span>';
            result+='</div><div class="green-bar" style="width:';
            result += parseFloat(this.BarList[i].Percent).toFixed(2).toString();
            result += '%;">';
            
            result+='</div></div>';
        }
        result += '<div></div>';
        return result;
    }

    /**
     * 
     * @param {string} color
     * @returns
     */
    GetProjectGuide(color) {
        let result = '<div style="background-color:' + color + '; margin:5px;text-align:center;">' + this.ButtonDetails.Title + '</div>';
        return result;
    }

    
}

