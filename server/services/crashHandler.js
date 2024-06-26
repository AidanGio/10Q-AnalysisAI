const handleCrash = (error) => {
    console.error(`Crash prevented: in ${error.stack}. Reason: ${error.message}`);

    process.exit(1);
};

const handleRejection = (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
};

export { handleCrash, handleRejection };
