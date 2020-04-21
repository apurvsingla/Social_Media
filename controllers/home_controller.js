//module.exports.action_name = function()
module.exports.home = function(req, res) {
    return res.render('home', {
        title: "Home"
    })
}