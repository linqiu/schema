module.exports = function(app) {
    return function() {
        var i = 0;
        for (inc in app.user_connections) {
            i++;
        }
        
        console.log("There are " + i + " active database connections.");
    }
};
