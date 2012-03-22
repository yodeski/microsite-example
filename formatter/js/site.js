$(function() {

	var m,
		mm,
		interaction,
		layer = 'mapbox.tornadoes-2010',
		urlBase = 'http://api.tiles.mapbox.com/v3/mapbox.mapbox-streets,',
		url = urlBase + layer + '.jsonp';
	
	// Write custom interactivity formatter
	var formatter = function(options, obj) {
	
						// Open webkit console to view
    					console.log(arguments);
    					
                		switch (options.format) {
                  			case 'full':
                    			return '';
                    			break;
                  			case 'location':
                    			return '';
                    			break;
                  			case 'teaser': default:
                  				// Call function on hover
                    			return buildStats(obj);
                    			break;
                  		}
                	};
	
	// Build map
	wax.tilejson(url, function(tilejson) {
	
		// Delete original tooltip template
		delete tilejson.template;
		// Set custom formatter
		tilejson.formatter = formatter;
		
		tilejson.minzoom = 4;
		tilejson.maxzoom = 8;
		mm = com.modestmaps;
		
		m = new mm.Map('mymap',
		new wax.mm.connector(tilejson));
		
		wax.mm.zoomer(m, tilejson).appendTo(m.parent);
		interaction = wax.mm.interaction(m, tilejson);
		wax.mm.attribution(m, tilejson).appendTo(m.parent);
		m.setCenterZoom(new mm.Location(39, -98), 5);
	});
	
	// Refresh map
	function refreshMap() {
		url = urlBase + layer + '.jsonp';
		wax.tilejson(url, function(tilejson) {
			delete tilejson.template;
			tilejson.formatter = formatter;
			tilejson.minzoom = 4;
			tilejson.maxzoom = 8;
			m.setProvider(new wax.mm.connector(tilejson));
			interaction.remove();
			interaction = wax.mm.interaction(m, tilejson);
		});
	}
	
	// Layer switcher
	$('#sidebar ul.layerswitch a').click(function (e) {
		e.preventDefault();
		layer = this.id;
		$('#sidebar ul.layerswitch a').removeClass('active');
		$(this).addClass('active');
		refreshMap();
	});
	
	// Function that gets called on hover
	// Places and uses data from tilejson
	function buildStats(obj) {
	  
		var maxFscale = 5,
			maxInjuries = 350,
			maxDeaths = 25;
		
		// Place values in div
		$('#stats .data-row.date .data-value').text(obj.date);
		$('#stats .data-row.time .data-value').text(obj.time);
		$('#stats .bar-row.f-scale .bar-value').text(obj.fscale);
		$('#stats .bar-row.injuries .bar-value').text(obj.injuries);
		$('#stats .bar-row.deaths .bar-value').text(obj.fatalities);
		
		// Use values to style div
		$('#stats .bar-row.f-scale .bar-value').css('width', (obj.fscale/maxFscale)*80 + '%');
		$('#stats .bar-row.injuries .bar-value').css('width', (obj.injuries/maxInjuries)*80 + '%');
		$('#stats .bar-row.deaths .bar-value').css('width', (obj.fatalities/maxDeaths)*80 + '%');
	}
	
	// Remove default tooltip and retain mouse pointer icon
	wax.tooltip.prototype.over = function() {
	    $('.wax-tooltips').remove();
	    $('#mymap').css('cursor','pointer');
	}
});