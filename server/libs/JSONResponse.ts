class JSONResponse {
    constructor() {}

    static success(req: any, res: any, message: string, data: any) {
        res.status(200).json({
            code: 200,
            message: message || 'success',
            data: data,
        });
    }

    static serverError(req: any, res: any, message: string, data: any) {
        res.status(500).json({
            code: 500,
            message: message || 'internal server error',
            data: data,
        });
    }
}

export default JSONResponse;