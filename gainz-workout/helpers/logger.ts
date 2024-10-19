class Logger {
    static debug(message: string) {
        const enable_logging = true;

        if (enable_logging) {
            console.log('DEBUG: ', message);
        }
    }

    static log_error(type: string, message: string) {
        const enable_logging = true;

        if (enable_logging) {
            console.error('ERROR: ', type, message);
        }
    }
}