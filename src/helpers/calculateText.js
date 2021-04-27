export default function calculateText(detail) {
    if (detail) {
        const { target, loc } = detail;
        if (!loc) return;
        const lineNo = loc.line + 1;
        const columnNo = loc.column + 1;
        const tag = target.tagName.toLowerCase();
        return `${loc.file} Line: ${lineNo} Column: ${columnNo} Tag: ${tag}`;
    }
}