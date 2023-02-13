module.exports = (err, res, inStatusCode, inStatus, inMessage) => {
    if (process.env.NODE_ENV === 'development') {
        let outStatusCode = inStatusCode || 400;
        let outStatus = inStatus || 'error';
        let outMessage = inMessage || 'Error Encountered';

        res.status(outStatusCode).json({
            status: outStatus,
            message: outMessage,
            error: err,
            stack: err.stack,
        });
    } else if (process.env.NODE_ENV === 'produciton') {
        console.error('Error Encountered at ', Date.now());
        console.error('err');

        res.status(500).json({
            status: 'Error',
            message: 'Something Terrible Happened...',
        });
    }
};