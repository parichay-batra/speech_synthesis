/**
 * List of HTML tags that we want to ignore when finding the top level readable elements
 * These elements should not be chosen while rendering the hover player
 */
const IGNORE_LIST = [
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "BUTTON",
  "LABEL",
  "SPAN",
  "IMG",
  "PRE",
  "SCRIPT",
];



/**
 *  **TBD:** Implement a function that returns all the top level readable elements on the page, keeping in mind the ignore list.
 *  A top level readable element is defined as follows:
 *    - The text node contained in the element should not be empty
 *    - The element should not be in the ignore list
 *    - The element should not be a child of another element that has only one child.
 *      For example: <div><blockquote>Some text here</blockquote></div>. div is the top level readable element and not blockquote
 */

function includesTextNode(node: HTMLElement) {
  for (let child of node.childNodes) {
    if (child.nodeType === Node.TEXT_NODE && child.nodeValue?.trim()) {
      return true;
    }
  }

  return false;
}


export function getTopLevelReadableElementsOnPage(): HTMLElement[] {
  // const root = document.getElementById('content-1');

  const root = document.body;


  if (!root) {
    return [];
  }

  const stack: HTMLElement[] = Array.from(root.children) as HTMLElement[];
  const result: HTMLElement[] = [];

  while (stack.length) {
    const node = stack.pop()!;

    if (IGNORE_LIST.includes(node.tagName)) {
      continue;
    }

    if (includesTextNode(node) && (!node.parentElement || node.parentElement.childElementCount > 1)) {
      result.push(node);
    } else {
      stack.push(...Array.from(node.children) as HTMLElement[]);
    }
  }

  console.log(result);
  return result;
}

