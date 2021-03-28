const HTTP_PROTOCOL = "http://";
const HTTPS_PROTOCOL = "https://";

exports.getProtocol = () => {
    let protocol = HTTP_PROTOCOL;

    if (process.env.NODE_ENV === "production") {
        protocol = HTTPS_PROTOCOL;
    }  

    return protocol;
}