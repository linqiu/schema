/**
 * TableStructure View
 * 
 * @class
 * @author  Tim Davies <mail@timdavi.es>
 */
var TableStructure = Backbone.View.extend({
    /**
     * Initialise object and store table
     * @param  {Table} table Table to display
     * @constructor
     * @return {undefined}
     */
    initialize: function(table) {
        this.table = table;
    },
    
    
    /**
     * Render view
     * @return {undefined}
     */
    render: function() {
        var tablestructure = this;
        
        table.getFullColumns(function(columns) {
            $('#main').html(_.template(
                $('#template-tablestructure').html(),
                {
                    table: table,
                    columns: columns
                }
            ));
            
            tablestructure.bindInputs();
            contentview.setLoading(false);
        });
    },
    
    
    /**
     * Bind the various inputs in the view
     * @return {undefined}
     */
    bindInputs: function() {
        var tablestructure = this;
        
        // Bind to field name:
        $('#structure').on('dblclick', 'td.fieldname', function() {
            $(this).attr('contenteditable', true).selectText();
        });
        
        // If enter key is pressed, send "blur" event to save the field:
        $('#structure').on('keydown', 'td.fieldname', function(e) {
            if (e.keyCode == '13') {
                e.preventDefault();
                $(this).blur();
            }
        });
        
        // Save the field when user clicks away from it:
        $('#structure').on('blur', 'td.fieldname', function() {
            // Set content editable and set text colour to grey:
            $(this).attr('contenteditable', false).css('color', 'grey');
            
            // Get old column name:
            var column_name = $(this).parent().find('input.column_name').val();
            
            // Get new column name:
            var new_column_name = $(this).text();
            
            // Print debugging message:
            console.info('Changing', column_name, 'to', new_column_name);
            
            // Get column object:
            var column = tablestructure.table.getColumn(column_name);
            if (!column) {
                console.error("Could not find the column");
                return;
            }
            
            // Give this to variable for callback:
            var td = this;
            
            // Change column name:
            column.changeFieldName(new_column_name, function(err) {
                if (err) {
                    console.error("Could not change field name from", column_name, 'to', new_column_name)
                    return;
                }
                
                // Set column name as new value:
                $(td).parent().find('input.column_name').val(new_column_name);
                
                // Reset colour to indicate field change has saved:
                $(td).css('color', '');
                
                // Set name in column object:
                column.set('name', new_column_name);
                
                // Refresh data in table:
                _.each(tablestructure.table.get('rows'), function (row) {
                    row[new_column_name] = row[column_name];
                    delete row[column_name];
                });
            });
        });
        
        // Bind to Allow Null checkbox:
        $('#structure').on('click', 'input.allownull', function() {
            // Get checkbox:
            var checkbox = $(this);
            
            // Check if clicked on or clicked off:
            if (checkbox.is(':checked')) {
                var allownull = true;
            } else {
                var allownull = false;
            }
            
            // Find column name:
            var column_name = $(this).parent().parent().find('input.column_name').val();
            
            // Set allow null:
            tablestructure.table.setAllowNull(column_name, allownull, null, function() {
                if (allownull) {
                    checkbox.prop('checked', false);
                } else {
                    checkbox.prop('checked', true);
                }
                
                console.error("An error occurred whilst executing SQL to alter the NULL setting");
            });
        });
    }
});
