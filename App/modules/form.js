/**************************************************************************************************
 * Module: Form
 * Author(s): Sean Malone
 * Description: This module contains large form data that is repeated throughout the application.
 *              Creating this module allows reduction in the size of the HTML files.
 *************************************************************************************************/
define(function(require) {
	var system = require('durandal/system');
	
	/**************************************************************************************************
	 * Form Structure
	 *************************************************************************************************/
	function form () {}
	
	/**************************************************************************************************
	 * States
	 *************************************************************************************************/
	form.prototype.states = ko.observableArray([
		{'value' : 'AL', 'text': 'Alabama'},
		{'value' : 'AK', 'text' : 'Alaska'}, 
		{'value' : 'AZ', 'text' : 'Arizona'}, 
		{'value' : 'AR', 'text' : 'Arkansas'}, 
		{'value' : 'CA', 'text' : 'California'}, 
		{'value' : 'CO', 'text' : 'Colorado'}, 
		{'value' : 'CT', 'text' : 'Connecticut'}, 
		{'value' : 'DE', 'text' : 'Delaware'}, 
		{'value' : 'DC', 'text' : 'District Of Columbia'}, 
		{'value' : 'FL', 'text' : 'Florida'}, 
		{'value' : 'GA', 'text' : 'Georgia'}, 
		{'value' : 'HI', 'text' : 'Hawaii'}, 
		{'value' : 'ID', 'text' : 'Idaho'}, 
		{'value' : 'IL', 'text' : 'Illinois'}, 
		{'value' : 'IN', 'text' : 'Indiana'}, 
		{'value' : 'IA', 'text' : 'Iowa'}, 
		{'value' : 'KS', 'text' : 'Kansas'}, 
		{'value' : 'KY', 'text' : 'Kentucky'}, 
		{'value' : 'LA', 'text' : 'Louisiana'}, 
		{'value' : 'ME', 'text' : 'Maine'}, 
		{'value' : 'MD', 'text' : 'Maryland'}, 
		{'value' : 'MA', 'text' : 'Massachusetts'}, 
		{'value' : 'MI', 'text' : 'Michigan'}, 
		{'value' : 'MN', 'text' : 'Minnesota'}, 
		{'value' : 'MS', 'text' : 'Mississippi'}, 
		{'value' : 'MO', 'text' : 'Missouri'}, 
		{'value' : 'MT', 'text' : 'Montan'},
		{'value' : 'NE', 'text' : 'Nebrask'},
		{'value' : 'NV', 'text' : 'Nevad'},
		{'value' : 'NH', 'text' : 'New Hampshir'},
		{'value' : 'NJ', 'text' : 'New Jerse'},
		{'value' : 'NM', 'text' : 'New Mexic'},
		{'value' : 'NY', 'text' : 'New Yor'},
		{'value' : 'NC', 'text' : 'North Carolin'},
		{'value' : 'ND', 'text' : 'North Dakot'},
		{'value' : 'OH', 'text' : 'Ohio'}, 
		{'value' : 'OK', 'text' : 'Oklahoma'}, 
		{'value' : 'OR', 'text' : 'Oregon'}, 
		{'value' : 'PA', 'text' : 'Pennsylvania'}, 
		{'value' : 'RI', 'text' : 'Rhode Island'}, 
		{'value' : 'SC', 'text' : 'South Carolina'}, 
		{'value' : 'SD', 'text' : 'South Dakot'},
		{'value' : 'TN', 'text' : 'Tennessee'}, 
		{'value' : 'TX', 'text' : 'Texas'}, 
		{'value' : 'UT', 'text' : 'Utah'}, 
		{'value' : 'VT', 'text' : 'Vermont'}, 
		{'value' : 'VA', 'text' : 'Virginia'}, 
		{'value' : 'WA', 'text' : 'Washington'}, 
		{'value' : 'WV', 'text' : 'West Virginia'}, 
		{'value' : 'WI', 'text' : 'Wisconsin'}, 
		{'value' : 'WY', 'text' : 'Wyoming'}
	]);
	
	/**************************************************************************************************
	 * Countries
	 *************************************************************************************************/
	form.prototype.countries = ko.observableArray([
		{'value' : 'AF', 'text' : 'Afghanistan'},
		{'value' : 'AL', 'text' : 'Albania'},
		{'value' : 'DZ', 'text' : 'Algeria'},
		{'value' : 'AS', 'text' : 'American Samoa'},
		{'value' : 'AD', 'text' : 'Andorra'},
		{'value' : 'AO', 'text' : 'Angola'},
		{'value' : 'AI', 'text' : 'Anguilla'},
		{'value' : 'AQ', 'text' : 'Antarctica'},
		{'value' : 'AG', 'text' : 'Antigua and Barbuda'},
		{'value' : 'AR', 'text' : 'Argentina'},
		{'value' : 'AM', 'text' : 'Armenia'},
		{'value' : 'AW', 'text' : 'Aruba'},
		{'value' : 'AU', 'text' : 'Australia'},
		{'value' : 'AT', 'text' : 'Austria'},
		{'value' : 'AZ', 'text' : 'Azerbaijan'},
		{'value' : 'BS', 'text' : 'Bahamas'},
		{'value' : 'BH', 'text' : 'Bahrain'},
		{'value' : 'BD', 'text' : 'Bangladesh'},
		{'value' : 'BB', 'text' : 'Barbados'},
		{'value' : 'BY', 'text' : 'Belarus'},
		{'value' : 'BE', 'text' : 'Belgium'},
		{'value' : 'BZ', 'text' : 'Belize'},
		{'value' : 'BJ', 'text' : 'Benin'},
		{'value' : 'BM', 'text' : 'Bermuda'},
		{'value' : 'BT', 'text' : 'Bhutan'},
		{'value' : 'BO', 'text' : 'Bolivia'},
		{'value' : 'BA', 'text' : 'Bosnia and Herzegovina'},
		{'value' : 'BW', 'text' : 'Botswana'},
		{'value' : 'BV', 'text' : 'Bouvet Island'},
		{'value' : 'BR', 'text' : 'Brazil'},
		{'value' : 'IO', 'text' : 'British Indian Ocean Territory'},
		{'value' : 'BN', 'text' : 'Brunei Darussalam'},
		{'value' : 'BG', 'text' : 'Bulgaria'},
		{'value' : 'BF', 'text' : 'Burkina Faso'},
		{'value' : 'BI', 'text' : 'Burundi'},
		{'value' : 'KH', 'text' : 'Cambodia'},
		{'value' : 'CM', 'text' : 'Cameroon'},
		{'value' : 'CA', 'text' : 'Canada'},
		{'value' : 'CV', 'text' : 'Cape Verde'},
		{'value' : 'KY', 'text' : 'Cayman Islands'},
		{'value' : 'CF', 'text' : 'Central African Republic'},
		{'value' : 'TD', 'text' : 'Chad'},
		{'value' : 'CL', 'text' : 'Chile'},
		{'value' : 'CN', 'text' : 'China'},
		{'value' : 'CX', 'text' : 'Christmas Island'},
		{'value' : 'CC', 'text' : 'Cocos (Keeling) Islands'},
		{'value' : 'CO', 'text' : 'Colombia'},
		{'value' : 'KM', 'text' : 'Comoros'},
		{'value' : 'CG', 'text' : 'Congo'},
		{'value' : 'CD', 'text' : 'Congo, the Democratic Republic of the'},
		{'value' : 'CK', 'text' : 'Cook Islands'},
		{'value' : 'CR', 'text' : 'Costa Rica'},
		{'value' : 'CI', 'text' : 'Cote D\'Ivoire'},
		{'value' : 'HR', 'text' : 'Croatia'},
		{'value' : 'CU', 'text' : 'Cuba'},
		{'value' : 'CY', 'text' : 'Cyprus'},
		{'value' : 'CZ', 'text' : 'Czech Republic'},
		{'value' : 'DK', 'text' : 'Denmark'},
		{'value' : 'DJ', 'text' : 'Djibouti'},
		{'value' : 'DM', 'text' : 'Dominica'},
		{'value' : 'DO', 'text' : 'Dominican Republic'},
		{'value' : 'EC', 'text' : 'Ecuador'},
		{'value' : 'EG', 'text' : 'Egypt'},
		{'value' : 'SV', 'text' : 'El Salvador'},
		{'value' : 'GQ', 'text' : 'Equatorial Guinea'},
		{'value' : 'ER', 'text' : 'Eritrea'},
		{'value' : 'EE', 'text' : 'Estonia'},
		{'value' : 'ET', 'text' : 'Ethiopia'},
		{'value' : 'FK', 'text' : 'Falkland Islands (Malvinas)'},
		{'value' : 'FO', 'text' : 'Faroe Islands'},
		{'value' : 'FJ', 'text' : 'Fiji'},
		{'value' : 'FI', 'text' : 'Finland'},
		{'value' : 'FR', 'text' : 'France'},
		{'value' : 'GF', 'text' : 'French Guiana'},
		{'value' : 'PF', 'text' : 'French Polynesia'},
		{'value' : 'TF', 'text' : 'French Southern Territories'},
		{'value' : 'GA', 'text' : 'Gabon'},
		{'value' : 'GM', 'text' : 'Gambia'},
		{'value' : 'GE', 'text' : 'Georgia'},
		{'value' : 'DE', 'text' : 'Germany'},
		{'value' : 'GH', 'text' : 'Ghana'},
		{'value' : 'GI', 'text' : 'Gibraltar'},
		{'value' : 'GR', 'text' : 'Greece'},
		{'value' : 'GL', 'text' : 'Greenland'},
		{'value' : 'GD', 'text' : 'Grenada'},
		{'value' : 'GP', 'text' : 'Guadeloupe'},
		{'value' : 'GU', 'text' : 'Guam'},
		{'value' : 'GT', 'text' : 'Guatemala'},
		{'value' : 'GN', 'text' : 'Guinea'},
		{'value' : 'GW', 'text' : 'Guinea-Bissau'},
		{'value' : 'GY', 'text' : 'Guyana'},
		{'value' : 'HT', 'text' : 'Haiti'},
		{'value' : 'HM', 'text' : 'Heard Island and Mcdonald Islands'},
		{'value' : 'VA', 'text' : 'Holy See (Vatican City State)'},
		{'value' : 'HN', 'text' : 'Honduras'},
		{'value' : 'HK', 'text' : 'Hong Kong'},
		{'value' : 'HU', 'text' : 'Hungary'},
		{'value' : 'IS', 'text' : 'Iceland'},
		{'value' : 'IN', 'text' : 'India'},
		{'value' : 'ID', 'text' : 'Indonesia'},
		{'value' : 'IR', 'text' : 'Iran, Islamic Republic of'},
		{'value' : 'IQ', 'text' : 'Iraq'},
		{'value' : 'IE', 'text' : 'Ireland'},
		{'value' : 'IL', 'text' : 'Israel'},
		{'value' : 'IT', 'text' : 'Italy'},
		{'value' : 'JM', 'text' : 'Jamaica'},
		{'value' : 'JP', 'text' : 'Japan'},
		{'value' : 'JO', 'text' : 'Jordan'},
		{'value' : 'KZ', 'text' : 'Kazakhstan'},
		{'value' : 'KE', 'text' : 'Kenya'},
		{'value' : 'KI', 'text' : 'Kiribati'},
		{'value' : 'KP', 'text' : 'Korea, Democratic People\'s Republic of'},
		{'value' : 'KR', 'text' : 'Korea, Republic of'},
		{'value' : 'KW', 'text' : 'Kuwait'},
		{'value' : 'KG', 'text' : 'Kyrgyzstan'},
		{'value' : 'LA', 'text' : 'Lao People\'s Democratic Republic'},
		{'value' : 'LV', 'text' : 'Latvia'},
		{'value' : 'LB', 'text' : 'Lebanon'},
		{'value' : 'LS', 'text' : 'Lesotho'},
		{'value' : 'LR', 'text' : 'Liberia'},
		{'value' : 'LY', 'text' : 'Libyan Arab Jamahiriya'},
		{'value' : 'LI', 'text' : 'Liechtenstein'},
		{'value' : 'LT', 'text' : 'Lithuania'},
		{'value' : 'LU', 'text' : 'Luxembourg'},
		{'value' : 'MO', 'text' : 'Macao'},
		{'value' : 'MK', 'text' : 'Macedonia, the Former Yugoslav Republic of'},
		{'value' : 'MG', 'text' : 'Madagascar'},
		{'value' : 'MW', 'text' : 'Malawi'},
		{'value' : 'MY', 'text' : 'Malaysia'},
		{'value' : 'MV', 'text' : 'Maldives'},
		{'value' : 'ML', 'text' : 'Mali'},
		{'value' : 'MT', 'text' : 'Malta'},
		{'value' : 'MH', 'text' : 'Marshall Islands'},
		{'value' : 'MQ', 'text' : 'Martinique'},
		{'value' : 'MR', 'text' : 'Mauritania'},
		{'value' : 'MU', 'text' : 'Mauritius'},
		{'value' : 'YT', 'text' : 'Mayotte'},
		{'value' : 'MX', 'text' : 'Mexico'},
		{'value' : 'FM', 'text' : 'Micronesia, Federated States of'},
		{'value' : 'MD', 'text' : 'Moldova, Republic of'},
		{'value' : 'MC', 'text' : 'Monaco'},
		{'value' : 'MN', 'text' : 'Mongolia'},
		{'value' : 'MS', 'text' : 'Montserrat'},
		{'value' : 'MA', 'text' : 'Morocco'},
		{'value' : 'MZ', 'text' : 'Mozambique'},
		{'value' : 'MM', 'text' : 'Myanmar'},
		{'value' : 'NA', 'text' : 'Namibia'},
		{'value' : 'NR', 'text' : 'Nauru'},
		{'value' : 'NP', 'text' : 'Nepal'},
		{'value' : 'NL', 'text' : 'Netherlands'},
		{'value' : 'AN', 'text' : 'Netherlands Antilles'},
		{'value' : 'NC', 'text' : 'New Caledonia'},
		{'value' : 'NZ', 'text' : 'New Zealand'},
		{'value' : 'NI', 'text' : 'Nicaragua'},
		{'value' : 'NE', 'text' : 'Niger'},
		{'value' : 'NG', 'text' : 'Nigeria'},
		{'value' : 'NU', 'text' : 'Niue'},
		{'value' : 'NF', 'text' : 'Norfolk Island'},
		{'value' : 'MP', 'text' : 'Northern Mariana Islands'},
		{'value' : 'NO', 'text' : 'Norway'},
		{'value' : 'OM', 'text' : 'Oman'},
		{'value' : 'PK', 'text' : 'Pakistan'},
		{'value' : 'PW', 'text' : 'Palau'},
		{'value' : 'PS', 'text' : 'Palestinian Territory, Occupied'},
		{'value' : 'PA', 'text' : 'Panama'},
		{'value' : 'PG', 'text' : 'Papua New Guinea'},
		{'value' : 'PY', 'text' : 'Paraguay'},
		{'value' : 'PE', 'text' : 'Peru'},
		{'value' : 'PH', 'text' : 'Philippines'},
		{'value' : 'PN', 'text' : 'Pitcairn'},
		{'value' : 'PL', 'text' : 'Poland'},
		{'value' : 'PT', 'text' : 'Portugal'},
		{'value' : 'PR', 'text' : 'Puerto Rico'},
		{'value' : 'QA', 'text' : 'Qatar'},
		{'value' : 'RE', 'text' : 'Reunion'},
		{'value' : 'RO', 'text' : 'Romania'},
		{'value' : 'RU', 'text' : 'Russian Federation'},
		{'value' : 'RW', 'text' : 'Rwanda'},
		{'value' : 'SH', 'text' : 'Saint Helena'},
		{'value' : 'KN', 'text' : 'Saint Kitts and Nevis'},
		{'value' : 'LC', 'text' : 'Saint Lucia'},
		{'value' : 'PM', 'text' : 'Saint Pierre and Miquelon'},
		{'value' : 'VC', 'text' : 'Saint Vincent and the Grenadines'},
		{'value' : 'WS', 'text' : 'Samoa'},
		{'value' : 'SM', 'text' : 'San Marino'},
		{'value' : 'ST', 'text' : 'Sao Tome and Principe'},
		{'value' : 'SA', 'text' : 'Saudi Arabia'},
		{'value' : 'SN', 'text' : 'Senegal'},
		{'value' : 'CS', 'text' : 'Serbia and Montenegro'},
		{'value' : 'SC', 'text' : 'Seychelles'},
		{'value' : 'SL', 'text' : 'Sierra Leone'},
		{'value' : 'SG', 'text' : 'Singapore'},
		{'value' : 'SK', 'text' : 'Slovakia'},
		{'value' : 'SI', 'text' : 'Slovenia'},
		{'value' : 'SB', 'text' : 'Solomon Islands'},
		{'value' : 'SO', 'text' : 'Somalia'},
		{'value' : 'ZA', 'text' : 'South Africa'},
		{'value' : 'GS', 'text' : 'South Georgia and the South Sandwich Islands'},
		{'value' : 'ES', 'text' : 'Spain'},
		{'value' : 'LK', 'text' : 'Sri Lanka'},
		{'value' : 'SD', 'text' : 'Sudan'},
		{'value' : 'SR', 'text' : 'Suriname'},
		{'value' : 'SJ', 'text' : 'Svalbard and Jan Mayen'},
		{'value' : 'SZ', 'text' : 'Swaziland'},
		{'value' : 'SE', 'text' : 'Sweden'},
		{'value' : 'CH', 'text' : 'Switzerland'},
		{'value' : 'SY', 'text' : 'Syrian Arab Republic'},
		{'value' : 'TW', 'text' : 'Taiwan, Province of China'},
		{'value' : 'TJ', 'text' : 'Tajikistan'},
		{'value' : 'TZ', 'text' : 'Tanzania, United Republic of'},
		{'value' : 'TH', 'text' : 'Thailand'},
		{'value' : 'TL', 'text' : 'Timor-Leste'},
		{'value' : 'TG', 'text' : 'Togo'},
		{'value' : 'TK', 'text' : 'Tokelau'},
		{'value' : 'TO', 'text' : 'Tonga'},
		{'value' : 'TT', 'text' : 'Trinidad and Tobago'},
		{'value' : 'TN', 'text' : 'Tunisia'},
		{'value' : 'TR', 'text' : 'Turkey'},
		{'value' : 'TM', 'text' : 'Turkmenistan'},
		{'value' : 'TC', 'text' : 'Turks and Caicos Islands'},
		{'value' : 'TV', 'text' : 'Tuvalu'},
		{'value' : 'UG', 'text' : 'Uganda'},
		{'value' : 'UA', 'text' : 'Ukraine'},
		{'value' : 'AE', 'text' : 'United Arab Emirates'},
		{'value' : 'GB', 'text' : 'United Kingdom'},
		{'value' : 'US', 'text' : 'United States'},
		{'value' : 'UM', 'text' : 'United States Minor Outlying Islands'},
		{'value' : 'UY', 'text' : 'Uruguay'},
		{'value' : 'UZ', 'text' : 'Uzbekistan'},
		{'value' : 'VU', 'text' : 'Vanuatu'},
		{'value' : 'VE', 'text' : 'Venezuela'},
		{'value' : 'VN', 'text' : 'Viet Nam'},
		{'value' : 'VG', 'text' : 'Virgin Islands, British'},
		{'value' : 'VI', 'text' : 'Virgin Islands, U.S.'},
		{'value' : 'WF', 'text' : 'Wallis and Futuna'},
		{'value' : 'EH', 'text' : 'Western Sahara'},
		{'value' : 'YE', 'text' : 'Yemen'},
		{'value' : 'ZM', 'text' : 'Zambia'},
		{'value' : 'ZW', 'text' : 'Zimbabwe'}
	]);
	
	/**************************************************************************************************
	 * Medication Routes
	 *************************************************************************************************/
	form.prototype.routes = ko.observable([
		{'value' : 'IM', 'text' : 'IM'},
		{'value' : 'Inhalational', 'text' : 'Inhalational'},
		{'value' : 'IV-Push', 'text' : 'IV-Push'},
		{'value' : 'IV-Infusion', 'text' : 'IV-Infusion'},
		{'value' : 'Local', 'text' : 'Local'},
		{'value' : 'PO', 'text' : 'PO'},
		{'value' : 'Rectally', 'text' : 'Rectally'},
		{'value' : 'SC', 'text' : 'SC'},
		{'value' : 'Sublingually', 'text' : 'Sublingually'},
		{'value' : 'Through-Tube', 'text' : 'Through-Tube'},
		{'value' : 'Transdermal', 'text' : 'Transdermal'}
	]);
	
	/**************************************************************************************************
	 * Medication Sig Codes
	 *************************************************************************************************/
	form.prototype.sigCodes = ko.observableArray([
		{'value' : '2h', 'text' : '2h'},
		{'value' : '2h pm', 'text' : '2h pm'},
		{'value' : '5xd', 'text' : '5xd'},
		{'value' : '6xd', 'text' : '6xd'},
		{'value' : 'As Directed', 'text' : 'As Directed'},
		{'value' : 'At 4 PM', 'text' : 'At 4 PM'},
		{'value' : 'At noon', 'text' : 'At noon'},
		{'value' : 'bid', 'text' : 'bid'},
		{'value' : 'biw', 'text' : 'biw'},
		{'value' : 'hs', 'text' : 'hs'},
		{'value' : 'pc', 'text' : 'pc'},
		{'value' : 'pm', 'text' : 'pm'},
		{'value' : 'q10h', 'text' : 'q10h'},
		{'value' : 'q12h', 'text' : 'q12h'},
		{'value' : 'q18h', 'text' : 'q18h'},
		{'value' : 'q1h', 'text' : 'q1h'},
		{'value' : 'q1mo', 'text' : 'q1mo'},
		{'value' : 'q2-3h', 'text' : 'q2-3h'},
		{'value' : 'q24h', 'text' : 'q24h'},
		{'value' : 'q2-4h', 'text' : 'q2-4h'},
		{'value' : 'q2d', 'text' : 'q2d'},
		{'value' : 'q2h', 'text' : 'q2h'},
		{'value' : 'q2wk', 'text' : 'q2wk'},
		{'value' : 'q3-4h', 'text' : 'q3-4h'},
		{'value' : 'q3-4wk', 'text' : 'q3-4wk'},
		{'value' : 'q36h', 'text' : 'q36h'},
		{'value' : 'q3d', 'text' : 'q3d'},
		{'value' : 'q3h', 'text' : 'q3h'},
		{'value' : 'q3wk', 'text' : 'q3wk'},
		{'value' : 'q4-6h', 'text' : 'q4-6h'},
		{'value' : 'q4-6h pm', 'text' : 'q4-6h pm'},
		{'value' : 'q48h', 'text' : 'q48h'},
		{'value' : 'q4d', 'text' : 'q4d'},
		{'value' : 'q4h', 'text' : 'q4h'},
		{'value' : 'q4h pm', 'text' : 'q4h pm'},
		{'value' : 'q4wk', 'text' : 'q4wk'},
		{'value' : 'q5d', 'text' : 'q5d'},
		{'value' : 'q5h', 'text' : 'q5h'},
		{'value' : 'q6-8h', 'text' : 'q6-8h'},
		{'value' : 'q6-8h pm', 'text' : 'q6-8h pm'},
		{'value' : 'q6d', 'text' : 'q6d'},
		{'value' : 'q6h', 'text' : 'q6h'},
		{'value' : 'q7d', 'text' : 'q7d'},
		{'value' : 'q7h', 'text' : 'q7h'},
		{'value' : 'q8-12h', 'text' : 'q8-12h'},
		{'value' : 'q8h', 'text' : 'q8h'},
		{'value' : 'q9', 'text' : 'q9'},
		{'value' : 'qac', 'text' : 'qac'},
		{'value' : 'qam', 'text' : 'qam'},
		{'value' : 'qd', 'text' : 'qd'},
		{'value' : 'Qday', 'text' : 'Qday'},
		{'value' : 'qhs', 'text' : 'qhs'},
		{'value' : 'qid', 'text' : 'qid'},
		{'value' : 'qnoc', 'text' : 'qnoc'},
		{'value' : 'qod', 'text' : 'qod'},
		{'value' : 'qpm', 'text' : 'qpm'},
		{'value' : 'qwk', 'text' : 'qwk'},
		{'value' : 'stat', 'text' : 'stat'},
		{'value' : 'tid', 'text' : 'tid'},
		{'value' : 'tiw', 'text' : 'tiw'},
		{'value' : 'x1', 'text' : 'x1'}
	]);
	
	/**************************************************************************************************
	 * Orders
	 *************************************************************************************************/
	// Imaging
	form.prototype.ImagingOrders = ko.observableArray([
		'Imaging-Radiology',
		'Imaging-Ultrasound',
		'Imaging-CT Scan',
		'Imaging-MRI',
		'Imaging-Fluroscopy',
		'Imaging-Nuclear Med',
		'Imaging-Mammogram',
		'Imaging-Plain Fils',
		'Imaging-Others'
	]);
	
	// Lab
	form.prototype.LabOrders = ko.observableArray([
		'Labs-Disease Panels',
		'Labs-Combination Tests',
		'Labs-Hematology',
		'Labs-LPD Panel',
		'Labs-Microbiology',
		'Labs-Anemia Panel',
		'Labs-Tumor Markers',
		'Labs-Bleeding Dispanel',
		'Labs-CTD Panel',
		'Labs-COAG Panel',
		'Labs-Chemistry',
		'Labs-Viral Serologies',
		'Labs-Urine Analysis',
		'Labs-Others',
		'Labs-In Office Labs'
	]);
	
	// Lab
	form.prototype.ChemoOrders = ko.observableArray([
		'Procedure-General',
		'Procedure-Chemo'
	]);
	
	/**************************************************************************************************
	 * Dates
	 *************************************************************************************************/
	// Database format to UI format
	form.prototype.uiDate = function(date) {
		if(date != null && date != undefined && date != '' && date != '0000-00-00') {
			if(date.indexOf('-') >= 0)
				return date.substring(5,7) + "/" + date.substring(8,10) + "/" + date.substring(0,4);
			else
				return date;
		}
		else {
			return null;
		}
	}
	
	// UI format to Database format
	form.prototype.dbDate = function(date) {
		if(date != null && date != undefined && date != '' && date != '0000/00/00') {
			if(date.indexOf('/') >= 0)
				return date.substring(6,10) + "-" + date.substring(0,2) + "-" + date.substring(3,5);
			else
				return date;
		}
		else {
			return null;
		}
	}
	
	// Current date in UI format
	form.prototype.currentDate = function() {
		var date = new Date();
		var year = date.getFullYear().toString();
		var month = (date.getMonth()+1).toString();
		var day = date.getDate().toString();
		return (month[1] ? month : "0" + month[0]) + "/" + (day[1] ? day : "0" + day[0]) + "/" + year;
	}
	
	/**************************************************************************************************
	 * Return class so it is usable.
	 *************************************************************************************************/
	return form;
});