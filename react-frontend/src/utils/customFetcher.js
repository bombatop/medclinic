import http from "./http-common";

let customFetcher = async ({ url, method, params }) => {
    const result = await http[method](url, params);
    return result.data;
};

export default customFetcher;