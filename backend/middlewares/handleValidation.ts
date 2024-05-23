import { NextFunction, Request, Response  } from "express"

const { validationResult } = require("express-validator")

export const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if(errors.isEmpty()) {
        return next()
    }

    return res.status(422).json({
        errors: errors.array()
    })
}
