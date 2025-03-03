export const ServerError = (resp) => {
    resp.status(505).json({
        status : 'error',
        message : 'Somthing bad happend please try again'
    });
}

export const ResponseError = (resp , message) => {
    resp.status(400).json({
        status : 'error',
        message
    });
}