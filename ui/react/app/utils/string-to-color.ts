export function stringToColor (value: string, { s = 85, l = 35 } = {}) {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = value.charCodeAt(i) + ((hash << 5) - hash);
    }

    return `hsl(${hash % 360} ${s}% ${l}%)`;
}
