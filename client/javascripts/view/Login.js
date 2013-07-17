/**
 * Login View
 * 
 * @class
 * @author  Tim Davies <mail@timdavi.es>
 */
var Login = Backbone.View.extend({
    /**
     * Display login form
     * @return {undefined}
     */
    displayLogin : function() {
        $('#main').html(_.template(
            $('#template-connect-to-server').html(),
            {
                hostname: 'localhost',
                username: 'root',
                password: '',
                port:     '',
                db_type:  ''
            }
        ));
        
        this.bindInputs();
    },
    
    
    /**
     * Bind inputs
     * @return {undefined}
     */
    bindInputs : function() {
        $('#server-connect-button').click(function() {
            var hostname = $('#connect-hostname').val();
            var username = $('#connect-username').val();
            var password = $('#connect-password').val();
            var port     = $('#connect-port').val();
            
            database.connectToDatabase(hostname, username, password, port, function(token) {
                if (token) {
                    window.token = token;
                    localStorage['token'] = token;
                    window.location = "#/database/";
                } else {
                    alert("Sorry, could not connect");
                }
            });
        });
    }
});
