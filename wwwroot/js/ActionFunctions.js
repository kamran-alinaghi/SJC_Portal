import { SJC_Project } from "./ProjectClass/SJC_Project.js";

/**
 * 
 * @param {HTMLElement} element
 * @param {string[]} classList1
 * @param {string[]} classList2
 */
export function ToggleClass(element, classList1, classList2) {
    let isRemoved = false;
    for (let i = 0; i < classList1.length; i++) {
        if (RemoveClass(element, classList1[i])) {
            isRemoved = true;
        }
    }

    if (isRemoved) {
        for (let i = 0; i < classList2.length; i++) {
            AddClass(element, classList2[i]);
        }
    }
    else {
        for (let i = 0; i < classList2.length; i++) {
            RemoveClass(element, classList2[i]);
        }
        for (let i = 0; i < classList1.length; i++) {
            AddClass(element, classList1[i]);
        }
    }
}
/**
 * 
 * @param {HTMLElement} element
 */
export function ToggleBigButtonSize(element) {
    const editBtn = document.getElementById(element.getAttribute("data-editButton"));
    if (RemoveClass(element, "shrink-button")) {
        RemoveClass(editBtn, "edit-button-expand");
        AddClass(element, "expand-button");
        AddClass(editBtn, "edit-button-shrink");
    }
    else {
        RemoveClass(element, "expand-button");
        RemoveClass(editBtn,"edit-button-shrink")
        AddClass(element, "shrink-button");
        AddClass(editBtn, "edit-button-expand");
    }
}

export function ToggleEditButtonSize(element) {
    AddClass(element, "edit-button-shrink");
}

/**
 * 
 * @param {HTMLElement} element
 * @param {string} className
 */
export function AddClass(element, className) {
    if (!element.classList.contains(className)) {
        element.classList.add(className);
        return true;
    }
    return false;
}
/**
 * 
 * @param {HTMLElement} element
 * @param {string} className
 * @returns
 */
export function RemoveClass(element, className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className);
        return true;
    }
    return false;
}


/**
 * 
 * @param {HTMLElement} element
 */
export function ToggleRelatedBoxVisibility(element) {
    if (RemoveClass(element, "expand-div")) {
        AddClass(element, "shrink-div");
    }
    else {
        RemoveClass(element, "shrink-div");
        AddClass(element, "expand-div");
    }
}


/**
 * 
 * @param {HTMLElement} element
 */
export function ResetButtonStatus(element) {
    const editBtn = document.getElementById(element.getAttribute("data-editButton"));
    if (RemoveClass(element, "shrink-button")) {
        AddClass(element, "expand-button");
        AddClass(editBtn, "edit-button-shrink");
        ToggleRelatedBoxVisibility(document.getElementById(element.getAttribute("data-rel")));
    }
}
/**
 * 
 * @param {SJC_Project[]} list
 * @returns
 */
export function GetLastId(list) {
    let res = -1;
    if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
            if (list[i]._id > res) { res = list[i]._id }
        }
    }
    
    return res;
}

/**
 * 
 * @param {SJC_Project[]} array
 * @param {string} id
 */
export function FindIndex(array, id) {
    let res = -1;
    for (let i = 0; i < array.length; i++) {
        if (array[i]._id == id) {
            res = i;
            break;
        }
    }
    return res;
}
/**
 * 
 * @param {HTMLElement} element
 */
export function ToggleBigBoxVisibility(element) {
    const relatedDiv = document.getElementById(element.getAttribute("data-rel"));
    if (RemoveClass(relatedDiv, "show-big-box")) {
        AddClass(relatedDiv, "hide-big-box");
    }
    else {
        RemoveClass(relatedDiv, "hide-big-box");
        AddClass(relatedDiv, "show-big-box");
    }
}

/**
 * 
 * @param {SJC_Project} project
 * @returns
 */
export function GetAllInvoicedValue(project) {
    let result = 0;
    for (let i = 1; i < project.FramingInvoiceList.length; i++) {
        for (let j = 0; j < project.FramingInvoiceList[i].Buildings.length; j++) {
            for (let k = 0; k < project.FramingInvoiceList[i].Buildings[j].Pairs.length; k++) {
                result += project.FramingInvoiceList[i].Buildings[j].Pairs[k].Percent;
            }
        }
    }
    return result;
}

export function toUnicodeVariant(str, variant, flags) {
    const offsets = {
        m: [0x1d670, 0x1d7f6],
        b: [0x1d400, 0x1d7ce],
        i: [0x1d434, 0x00030],
        bi: [0x1d468, 0x00030],
        c: [0x1d49c, 0x00030],
        bc: [0x1d4d0, 0x00030],
        g: [0x1d504, 0x00030],
        d: [0x1d538, 0x1d7d8],
        bg: [0x1d56c, 0x00030],
        s: [0x1d5a0, 0x1d7e2],
        bs: [0x1d5d4, 0x1d7ec],
        is: [0x1d608, 0x00030],
        bis: [0x1d63c, 0x00030],
        o: [0x24B6, 0x2460],
        p: [0x249C, 0x2474],
        w: [0xff21, 0xff10],
        u: [0x2090, 0xff10]
    }

    const variantOffsets = {
        'monospace': 'm',
        'bold': 'b',
        'italic': 'i',
        'bold italic': 'bi',
        'script': 'c',
        'bold script': 'bc',
        'gothic': 'g',
        'gothic bold': 'bg',
        'doublestruck': 'd',
        'sans': 's',
        'bold sans': 'bs',
        'italic sans': 'is',
        'bold italic sans': 'bis',
        'parenthesis': 'p',
        'circled': 'o',
        'fullwidth': 'w'
    }

    // special characters (absolute values)
    var special = {
        m: {
            ' ': 0x2000,
            '-': 0x2013
        },
        i: {
            'h': 0x210e
        },
        g: {
            'C': 0x212d,
            'H': 0x210c,
            'I': 0x2111,
            'R': 0x211c,
            'Z': 0x2128
        },
        o: {
            '0': 0x24EA,
            '1': 0x2460,
            '2': 0x2461,
            '3': 0x2462,
            '4': 0x2463,
            '5': 0x2464,
            '6': 0x2465,
            '7': 0x2466,
            '8': 0x2467,
            '9': 0x2468,
        },
        p: {},
        w: {}
    }
    //support for parenthesized latin letters small cases 
    for (var i = 97; i <= 122; i++) {
        special.p[String.fromCharCode(i)] = 0x249C + (i - 97)
    }
    //support for full width latin letters small cases 
    for (var i = 97; i <= 122; i++) {
        special.w[String.fromCharCode(i)] = 0xff41 + (i - 97)
    }

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';

    var getType = function (variant) {
        if (variantOffsets[variant]) return variantOffsets[variant]
        if (offsets[variant]) return variant;
        return 'm'; //monospace as default
    }
    var getFlag = function (flag, flags) {
        if (!flags) return false
        return flags.split(',').indexOf(flag) > -1
    }

    var type = getType(variant);
    var underline = getFlag('underline', flags);
    var strike = getFlag('strike', flags);
    var result = '';

    for (var k of str) {
        let index
        let c = k
        if (special[type] && special[type][c]) c = String.fromCodePoint(special[type][c])
        if (type && (index = chars.indexOf(c)) > -1) {
            result += String.fromCodePoint(index + offsets[type][0])
        } else if (type && (index = numbers.indexOf(c)) > -1) {
            result += String.fromCodePoint(index + offsets[type][1])
        } else {
            result += c
        }
        if (underline) result += '\u0332' // add combining underline
        if (strike) result += '\u0336' // add combining strike
    }
    return result
}