module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // if /API call error then send response. If rendered page error - render an error page
    if (process.env.NODE_ENV === 'development') {
        if (req.originalUrl.startsWith('/api')) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
                stack: err.stack,
            });
        } else {
            res.status(err.statusCode).render('error'),
                {
                    title: 'Something went wrong!',
                    msg: err.message,
                };
        }
    } else if (process.env.NODE_ENV === 'production') {
        const date = new Date();
        console.error('Error Encountered at ', date);
        console.error(err);

        if (req.originalUrl.startsWith('/api')) {
            res.status(500).json({
                status: 'Error',
                message: 'Something Terrible Happened...',
            });
        } else {
            res.status(err.statusCode).render('error'),
                {
                    title: 'Something went wrong!',
                    msg: err,
                    // msg: err.message,
                };
        }
    }
};
