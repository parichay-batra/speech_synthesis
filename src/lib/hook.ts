import { useEffect, useState } from "react";

/**
 * Gets bounding boxes for an element. This is implemented for you
 */
export function getElementBounds(elem: HTMLElement) {
  const bounds = elem.getBoundingClientRect();
  const top = bounds.top + window.scrollY;
  const left = bounds.left + window.scrollX;

  return {
    x: left,
    y: top,
    top,
    left,
    width: bounds.width,
    height: bounds.height,
  };
}

/**
 * **TBD:** Implement a function that checks if a point is inside an element
 */
export function isPointInsideElement(
  coordinate: { x: number; y: number },
  element: HTMLElement
): boolean {

  const bounds = getElementBounds(element);

  const coordinateX = coordinate.x + window.scrollX;
  const coordinateY = coordinate.y + window.scrollY;

  return coordinateX >= bounds.x - 50
    && coordinateX <= bounds.x + bounds.width + 50
    && coordinateY >= bounds.y
    && coordinateY <= bounds.y + bounds.height;
}

/**
 * **TBD:** Implement a function that returns the height of the first line of text in an element
 * We will later use this to size the HTML element that contains the hover player
 */
export function getLineHeightOfFirstLine(element: HTMLElement): number {
  // const temp = document.createElement(element.nodeName);

  // temp.setAttribute("style", "margin:0; padding:0; display: inline-block; "
  //   + "font-family:" + (element.style.fontFamily || temp.style.fontFamily || "inherit") + "; "
  //   + "font-size:" + (element.style.fontSize || temp.style.fontSize || "inherit"));
  // temp.innerHTML = "A";

  // element.parentNode!.appendChild(temp);
  // const result = temp.clientHeight;
  // temp.parentNode!.removeChild(temp);

  // return result;

  // Create a temporary span element
  const temp = document.createElement(element.nodeName);
  temp.innerHTML = "A"; // Use a single character to measure line height

  // Copy all relevant computed styles from the original element to the temporary element
  const computedStyle = window.getComputedStyle(element);

  temp.style.fontFamily = computedStyle.fontFamily;
  temp.style.fontSize = computedStyle.fontSize;
  temp.style.lineHeight = computedStyle.lineHeight;
  temp.style.margin = "0";
  temp.style.padding = "0";
  temp.style.position = "absolute";
  temp.style.visibility = "hidden";
  temp.style.whiteSpace = "nowrap";

  // Append the temporary element to the original element to measure it
  element.appendChild(temp);
  const lineHeight = temp.clientHeight;
  element.removeChild(temp);

  return lineHeight;
}



export type HoveredElementInfo = {
  element: HTMLElement;
  top: number;
  left: number;
  heightOfFirstLine: number;
};

/**
 * **TBD:** Implement a React hook to be used to help to render hover player
 * Return the absolute coordinates on where to render the hover player
 * Returns null when there is no active hovered paragraph
 * Note: If using global event listeners, attach them window instead of document to ensure tests pass
 */

export function useHoveredParagraphCoordinate(
  parsedElements: HTMLElement[]
): HoveredElementInfo | null {
  const [result, setResult] = useState<HoveredElementInfo | null>(null)

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      for (const node of parsedElements) {
        if (isPointInsideElement({ x: e.clientX, y: e.clientY }, node)) {
          const bounds = getElementBounds(node);
          setResult({ element: node, heightOfFirstLine: getLineHeightOfFirstLine(node), left: bounds.left, top: bounds.top });
          return;
        }
        else {
          setResult(null);
        }
      }
    }

    window.addEventListener('mouseover', listener)

    return () => {
      window.removeEventListener('mouseover', listener);
    }

  }, []);

  return result;
}
