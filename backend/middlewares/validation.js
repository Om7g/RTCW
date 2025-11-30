const {check,validationResult}=require("express-validator");

const validateUser=[
    check('email').isEmail().withMessage("Invlaid email format"),
    check('password').isStrongPassword({minLenght:1}).withMessage("Password must be strong"),
    (req,res,next)=>{
        const error=validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({errors:errors.array()})
        }
        next();
    }
]