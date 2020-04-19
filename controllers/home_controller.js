//module.exports.action_name = function()
module.exports.home = function(req, res) {
    return res.end('<h1>Hey There running from controller</h1>');
}