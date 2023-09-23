
/*
 * Useful Functions
 */

function clearAllChildren(element) {
    while (element.lastChild) {
        element.lastChild.remove();
    }
}

function getParent(child, identifierTitle, identifierValue) {
    if (child.getAttribute(identifierTitle) == identifierValue) {
        return child;
    }
    if (!child.parentElement) {
        return;
    }
    return getParent(child.parentElement, identifierTitle, identifierValue);
}

function createUid() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

function hasData(data) {
    return !!Object.keys(data);
}

function copy(str) {
    const textarea = document.createElement('textarea');
    textarea.value = str;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}
