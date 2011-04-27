config = {
  host: "http://sniphr.com/",
	sniph: {
		min_length: 3,
		notification_timeout: 3000,
		find_sniphs_for_url_delay: 2500
	},
	debug: {
		enabled: false,
		prepense: "sniphr: "
	},
	options: {
		status_fadeout_delay: 2000,
		width: 400,
		height: 300
	}
};

// Uncomment this line when developing:
// config.debug.enabled = true;

// Dev mode? Change some stuff..
if (config.debug.enabled) {
  config.host = 'http://sniphr.dev/';
}