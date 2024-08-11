import { BaseElement } from "./BaseElement.js";

export class Input extends BaseElement {
    Type;
    isPercent;
    constructor(type="text") {
        super();
        this.Type = type;
    }

    ToHtmlObject(content = "") {
        let res = "";
        res = '<input ';
        if (this.Id.length > 0) { res += 'id="' + this.Id + '" '; }
        res += 'type="text" min="0" value="' + content + '"/>';
        return res;
    }
}