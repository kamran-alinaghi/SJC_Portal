class ColorCategory {
    Name;
    ColorList;
    /**
     * 
     * @param {string} name
     * @param {string[]} colorArray
     */
    constructor(name, colorArray) {
        this.Name = name;
        this.ColorList = [""];
        this.ColorList.pop();
        for (let i = 0; i < colorArray.length; i++) {
            this.ColorList.push(colorArray[i]);
        }
    }
}

export const colorList = [
    new ColorCategory("Blue", ["#8BC1F7", "#519DE9", "#06C", "#004B95", "#002F5D"]),
    new ColorCategory("Green", ["#BDE2B9", "#7CC674", "#4CB140", "#38812F", "#23511E"]),
    new ColorCategory("Gold", ["#F9E0A2", "#F6D173", "#F4C145", "#F0AB00", "#C58C00"]),
    new ColorCategory("Cyan", ["#A2D9D9", "#73C5C5", "#009596", "#005F60", "#003737"]),
    new ColorCategory("Orange", ["#F4B678", "#EF9234", "#EC7A08", "#C46100", "#8F4700"]),
    new ColorCategory("Purple", ["#B2B0EA", "#8481DD", "#5752D1", "#3C3D99", "#2A265F"]),
    new ColorCategory("Red", ["#C9190B", "#A30000", "#7D1007", "#470000", "#2C0000"]),
    new ColorCategory("Black", ["#F0F0F0", "#D2D2D2", "#B8BBBE", "#8A8D90", "#6A6E73"])
];
