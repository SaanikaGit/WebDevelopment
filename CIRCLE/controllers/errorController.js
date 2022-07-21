module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // res.status(err.statusCode).json({
    //     status: err.status,
    //     message: err.message,
    //     source : 'Generic Handler'
    // });

    if (process.env.NODE_ENV === 'development') {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
        });
    } else if (process.env.NODE_ENV === 'production') {
        const date = new Date();
        console.error('Error Encountered at ', date);
        console.error(err);

        res.status(500).json({
            status: 'Error',
            message: 'Something Terrible Happened...',
        });
    }
};
