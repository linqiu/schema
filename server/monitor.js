/**
 * Destroys old connections that aren't being used.
 *
 * @todo: everything
 */
module.exports = function(app) {
    return function() {
        var i = Object.keys(app.user_connections).length;
        
        console.log("There are " + i + " active database connections.");
    }
};
