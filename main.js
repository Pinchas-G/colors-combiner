const stack = [];
const container = document.querySelector(".container");
const blendingBox = document.querySelector(".blending-box");
const currColorElem = document.querySelector("#curr");
const prevColorElem = document.querySelector("#prev");
showSquares();

function showSquares() {
    const colors = [
        "yellow",
        "red",
        "green",
        "blue",
        "black",
        "white",
        "aqua",
        "purple",
    ];

    for (const color of colors) {
        const elem = document.createElement("div");
        elem.classList.add("color-square");
        elem.style.backgroundColor = color;
        elem.draggable = true;
        elem.ondragstart = (e) => drag(e);
        container.appendChild(elem);
    }
}

function handleColorChange(elem, pos) {
    stack[pos] = hexToRgb(elem.value);
    currColorElem.style.background = stack[0];
    prevColorElem.style.background = stack[1];

    if (stack.length === 2) {
        const blendedColor = blendColors(stack[0], stack[1]);
        blendingBox.style.background = blendedColor;
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    const computedStyle = window.getComputedStyle(ev.target);
    ev.dataTransfer.setData("background", computedStyle.backgroundColor);
}

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("background");

    stack.unshift(data);
    currColorElem.style.background = data;

    if (stack.length === 2) {
        prevColorElem.style.background = stack[1];
        const blendedColor = blendColors(stack[0], stack[1]);
        blendingBox.style.background = blendedColor;
    } else if (stack.length > 2) {
        prevColorElem.style.background = stack[1];
        const blendedColor = blendColors(stack[0], stack[1]);
        blendingBox.style.background = blendedColor;
        stack.pop();
    }
}

function blendColors(color1, color2) {
    const parseColor = (color) => color.match(/\d+/g).map(Number);
    const rgb1 = parseColor(color1);
    const rgb2 = parseColor(color2);
    const blendedRGB = rgb1.map((value, index) =>
        Math.round((value + rgb2[index]) / 2)
    );
    console.log({ rgb1, rgb2, blendedRGB });
    return `rgb(${blendedRGB.join(", ")})`;
}

function hexToRgb(hex) {
    hex = hex.replace(/^#/, "");
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
}