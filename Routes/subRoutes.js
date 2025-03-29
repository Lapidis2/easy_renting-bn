const express=require("express")
const router=express.Router()
const {subscribe,deleteSub}=require("../Controller/subscribeController")

router.post('/subscribe',subscribe)
router.delete('/deleteSubscribe',deleteSub)
module.exports=router