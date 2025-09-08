export function jsonToQueryString(obj: Record<string, any>) {
    return Object.keys(obj)
        .map(key =>
            encodeURIComponent(key) + '=' + encodeURIComponent(obj[key])
        )
        .join('&');
}