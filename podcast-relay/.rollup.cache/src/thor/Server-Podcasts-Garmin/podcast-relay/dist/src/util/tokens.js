var _a, _b, _c;
export const token = ((_c = (_b = (_a = document.cookie) === null || _a === void 0 ? void 0 : _a.split('; ')) === null || _b === void 0 ? void 0 : _b.find(row => row.startsWith('session='))) === null || _c === void 0 ? void 0 : _c.split('=')[1]) || '';
export const getHeaders = () => {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Authorization', token);
    return headers;
};
//# sourceMappingURL=tokens.js.map