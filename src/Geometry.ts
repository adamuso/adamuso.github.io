export class Geometry
{
    static intersects(rect1 : PIXI.Rectangle, rect2 : PIXI.Rectangle)
    {
        // If one rectangle is on left side of other 
        if (rect1.left > rect2.right || rect2.left > rect1.right) 
            return false; 

        // If one rectangle is above other 
        if (rect1.top < rect2.bottom || rect2.top < rect1.bottom) 
            return false; 

        return true; 
    }

    static getIntersection(rect1 : PIXI.Rectangle, rect2 : PIXI.Rectangle)
    {
        const left = Math.max(rect1.left, rect2.left);
        const right = Math.min(rect1.right, rect2.right);
        const top = Math.max(rect1.top, rect2.top);
        const bottom = Math.min(rect1.bottom, rect2.bottom);

        return new PIXI.Rectangle(left, top, right - left, bottom - top);
    }

    static contains(outer : PIXI.Rectangle, inner : PIXI.Rectangle)
    {
        return outer.contains(inner.left, inner.top) &&
            outer.contains(inner.left, inner.bottom) &&
            outer.contains(inner.right, inner.top) && 
            outer.contains(inner.right, inner.bottom);
    }
}