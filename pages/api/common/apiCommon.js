export const getHeaderWithBearerToken = (token, contentType) => {
    let contentTypeVariable
    if(!contentType)
        contentTypeVariable = "application/json"
    else
        contentTypeVariable = contentType
    return {
        "Content-Type": contentTypeVariable,
        "Authorization": `Bearer ${token}`,
    }
}