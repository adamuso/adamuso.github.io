define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Geometry {
        static intersects(rect1, rect2) {
            // If one rectangle is on left side of other 
            if (rect1.left > rect2.right || rect2.left > rect1.right)
                return false;
            // If one rectangle is above other 
            if (rect1.top < rect2.bottom || rect2.top < rect1.bottom)
                return false;
            return true;
        }
        static getIntersection(rect1, rect2) {
            const left = Math.max(rect1.left, rect2.left);
            const right = Math.min(rect1.right, rect2.right);
            const top = Math.max(rect1.top, rect2.top);
            const bottom = Math.min(rect1.bottom, rect2.bottom);
            return new PIXI.Rectangle(left, top, right - left, bottom - top);
        }
        static contains(outer, inner) {
            return outer.contains(inner.left, inner.top) &&
                outer.contains(inner.left, inner.bottom) &&
                outer.contains(inner.right, inner.top) &&
                outer.contains(inner.right, inner.bottom);
        }
    }
    exports.Geometry = Geometry;
});
//# sourceMappingURL=Geometry.js.map