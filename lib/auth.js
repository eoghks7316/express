module.exports = {
    IsLogin: function (req, res) {
        if (req.session.islogined) {
            return true;
        } else {
            return false;
        }
    },
    StatusUI: function (req, res) {
        var authStatus = '<a href="/auth/login">Login</a>'
        if (this.IsLogin(req, res)) {
            authStatus = `${req.session.nickname} | <a href="/auth/logout">Logout</a>`
        }
        return authStatus
    }

}