import express from "express";
import Stripe from ("stripe")(process.env.STRIPE_KEY);
const router = express.Router();


router.post("/payment",(req,res)=>
{
    Stripe.charges.create({
        source:req.body.tokenId,
        amount:req.body.amount,
        currency:"usd"
    },(stripeError,stripeRes)=>
    {
        if(stripeError){
            res.status(500).json({status:false,error:stripeError})
        }
        else{
            res.status(200).json({status:true,data:stripeRes})
        }
    }
    );
})

export default router;
