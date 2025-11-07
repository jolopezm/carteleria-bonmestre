export function getQueryStrings() {
    const url = window.location.href;
    const hashIndex = url.indexOf("?");
    const queryString = hashIndex !== -1 ? url.substring(hashIndex + 1) : "";

    const params = new URLSearchParams(queryString);
    const queryObject = {};

    params.forEach((value, key) => {
        if (queryObject.hasOwnProperty(key)) {
            if (!Array.isArray(queryObject[key])) {
                queryObject[key] = [queryObject[key]];
            }
            queryObject[key].push(value);
        } else {
            queryObject[key] = value;
        }
    });

    return queryObject;
}
