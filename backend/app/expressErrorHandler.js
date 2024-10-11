function expressErrorHandler(err, req, res, next) {
    res.status(err.status || 500).send(err.message);
    console.log("\nerror in a request:\n");
    console.error(err);
}

function statusError(status,message) {
    const err = new Error(message);
    err.status = status;
    throw err;
}

function CheckErr(message) {
    statusError(422,message);
}

export { expressErrorHandler, CheckErr, statusError };