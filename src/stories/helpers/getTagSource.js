const tagRegExp = /<(\/)?(\w+)(\s*>)?/;
const tagRegExpGlobal = new RegExp(tagRegExp, 'g');

export function getTagSource(source = "", start = 0) {
    let returnValue = null;
    const stack = [];
    const srcCopy = source;
    source = source.slice(start);
    source = source.replace(/<\w+[^<>]\/>/g, m => "".padStart(m.length, '#'));
    source.replace(tagRegExpGlobal, (match, ...args) => {
        if (returnValue) return match;
        const [close, tag, , char] = args;
        if (close) {
            const lastTag = stack[stack.length - 1];
            if (lastTag && lastTag.tag === tag) {
                if (stack.length === 1) {
                    const end = start + char + match.length;
                    returnValue = {
                        start,
                        end,
                        source: srcCopy.slice(start, end)
                    };
                    return match;
                }
                stack.pop();
            }
        } else {
            stack.push({
                close: !!close,
                tag,
                char
            });
        }
        return match;
    });
    return returnValue;
}