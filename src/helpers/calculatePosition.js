export default function calculatePosition(detail) {
    const { iframe, event } = detail;
    const doc = iframe.contentDocument;
    if (doc) {
        let element = iframe;
        let _left = 0;
        let _top = 0;
        while (element && element.tagName !== "BODY") {
            _left += element.offsetLeft;
            _top += element.offsetTop;
            element = element.parentElement;
        }
        return { top: _top + event.clientY, left: _left + event.clientX }
    }
    return {};
}