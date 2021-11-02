exports.error500 = (err, req, res, next) =>{
    res.sendStatus(500)
}
exports.error404 = (req,res)=>{
    res.sendStatus(404)
}
exports.auth = async(req,res)=>{
    res.send('yo')
}