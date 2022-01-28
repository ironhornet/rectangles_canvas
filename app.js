
const randomInteger = (min, max) => {
    let random = min + Math.random() * (max + 1 - min);
    return Math.floor(random);
}
const firstRectY = randomInteger(0, 500)
const firstRectX = randomInteger(0, 1100)
const secondRectY = randomInteger(0, 500)
const secondRectX = randomInteger(0, 1100)

const randomFirstRectangleWith = randomInteger(0, 300);
const randomFirstRectangleHeight = randomInteger(0, 500);
const randomSecondRectangleWith = randomInteger(0, 300);
const randomSecondRectangleHeight = randomInteger(0, 500);

const canvas = document.getElementById("canvasBox");
const ctx = canvas.getContext("2d");
const ELLIPSE_DOTS_COUNT = 10;

const dotsCoordinate = (amount, callback) => [...Array(amount).keys()].map(callback);

class Dots {
     drawDotsInEllipse({ radiusX, radiusY, centerX, centerY }) {
        const ctx = canvas.getContext("2d");
        const rand = (min, max) => Math.random() * (max - min) + min;
        const SIDE = 2;
        const HALF_SIDE = 2;

        let array = [];

        dotsCoordinate(ELLIPSE_DOTS_COUNT, () => {
            let x = Math.round(rand(-radiusX + HALF_SIDE, radiusX - HALF_SIDE)),
                maxAbsY = ((radiusY - HALF_SIDE) / radiusX) * Math.sqrt(radiusX * radiusX - x * x),
                y = Math.round(rand(-maxAbsY, maxAbsY));
                
            array.push({ x, y });
            ctx.beginPath();
            ctx.rect(x + centerX - HALF_SIDE, y + centerY - HALF_SIDE, SIDE, SIDE);
            ctx.stroke();
        });
        console.log(array);
    }
}

class Ellipse extends Dots {
    constructor(x1, x2, y1, y2) {
        super()
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2; 
    }
    drawEllipse(x1, x2, y1, y2) {
        const centerX = (x1 + x2) * 0.5;
        const centerY = (y1 + y2) * 0.5;
        const radiusX = Math.abs(centerX - x1);
        const radiusY = Math.abs(centerY - y1);

        const step = 0.01;
        const pi2 = Math.PI * 2 - step;
        let a = step;

        ctx.beginPath();
        ctx.moveTo(centerX + radiusX * Math.cos(0), centerY + radiusY * Math.sin(0));
        for (; a < pi2; a += step) {
            ctx.lineTo(
                centerX + radiusX * Math.cos(a),
                centerY + radiusY * Math.sin(a)
            );
        }
        ctx.closePath();
        ctx.strokeStyle = "#000";
        ctx.stroke();

        super.drawDotsInEllipse({ radiusX, radiusY, centerX, centerY });
    }
}

class Rectangle {
    constructor(x, y, height, width) {
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }

    figuresIntersection(firstFigure, secondFigure) {
        const xIntersect = firstFigure.x < secondFigure.x + secondFigure.width &&
            firstFigure.x + firstFigure.width > secondFigure.x;
        const yIntersect = firstFigure.y < secondFigure.y + secondFigure.height &&
            firstFigure.y + firstFigure.height > secondFigure.y;
        if (!(yIntersect && xIntersect)) {
            return undefined;
        }
        return yIntersect && xIntersect;
    }

    intersectDetails(firstFigure, secondFigure) {
        const left = Math.max(firstFigure.x, secondFigure.x);
        const width = Math.min(firstFigure.x + firstFigure.width, secondFigure.x + secondFigure.width) - left;
        const top = Math.max(firstFigure.y, secondFigure.y);
        const height = Math.min(firstFigure.y + firstFigure.height, secondFigure.y + secondFigure.height) - top;

        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.rect(left, top, width, height);
        ctx.stroke();
        return { left, width, top, height };
    }

    drawFigure() {
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }
}

const rectangle1 = new Rectangle(firstRectX, firstRectY, randomFirstRectangleWith, randomFirstRectangleHeight);
const rectangle2 = new Rectangle(secondRectX, secondRectY, randomSecondRectangleWith, randomSecondRectangleHeight);

rectangle1.drawFigure();
rectangle2.drawFigure();

const shape = new Rectangle();

if (shape.figuresIntersection(rectangle1, rectangle2)) {
    const intersectionDetails = shape.intersectDetails(rectangle1, rectangle2)
    const elipseFigure = new Ellipse();

    elipseFigure.drawEllipse(
        intersectionDetails.left, intersectionDetails.left + intersectionDetails.width,
        intersectionDetails.top, intersectionDetails.top + intersectionDetails.height
    );
}

