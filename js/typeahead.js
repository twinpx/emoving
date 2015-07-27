jQuery(document).ready(function() {
    var $input = $('.typeahead');
	var cities = [];

	$.getJSON( "json/jsonCities.js", {
      	name: "name",
    	outbound: "outbound",
    	inbound: "inbound"
    })
    .done(function( data ){
        	$.each( data, function( i, item ){
        		cities.push( item );
        	});

        })
    .complete(function(){
        $input
        	.removeAttr('disabled')
        	.typeahead({
                source: cities.map(function(item) {
                    return item.name;
                }),
                autoSelect: false
            });
    });

});