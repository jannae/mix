var mixStor = "http://d3v2j6sqti93vu.cloudfront.net/mixes/";


$(window).load(function() {
     var mix = location.hash.substr(3);
     setMix(mix);
});

$(document).ready(function() {
   /* get directory structure of /mixes/ for file order */

	$.getJSON('mixes.json', function(data) {
		
			if (data.length === 0){
				$('#content').append('There is no data here.');
			}
			else {
				var items = [];
				
				n=0;
				
				$.each(data, function(i, item){
				
					$('ul.thumbs').displayCovers(item);
					
					$('ul.album').displayCovers(item);
					
					/*static HTML template  reuired for JPlayer playlsit */					
					var jplaylisthtml = '<div id="jquery_jplayer_' + n + '" class="jp-jplayer"></div><div class="jp-audio"><div class="jp-type-playlist"><div id="jp_interface_' + n + '" class="jp-interface"><ul class="jp-controls"><li><a href="#" class="jp-play" tabindex="1">play</a></li><li><a href="#" class="jp-pause" tabindex="1">pause</a></li><li><a href="#" class="jp-stop" tabindex="1">stop</a></li><li><a href="#" class="jp-mute" tabindex="1">mute</a></li><li><a href="#" class="jp-unmute" tabindex="1">unmute</a></li><li><a href="#" class="jp-previous" tabindex="1">previous</a></li><li><a href="#" class="jp-next" tabindex="1">next</a></li></ul><div class="jp-progress"><div class="jp-seek-bar"><div class="jp-play-bar"></div></div></div><div class="jp-volume-bar"><div class="jp-volume-bar-value"></div></div><div class="jp-current-time"></div><div class="jp-duration"></div></div><div id="jp_playlist_' + n + '" class="jp-playlist"><ul><!-- The method Playlist.displayPlaylist() uses this unordered list --><li></li></ul></div></div></div>';
				
					$('div.tracks-container').append($('<div/>', {
							'class' : 'playlist hide ' + item,
							html: jplaylisthtml	}));
				
					$('div.tracks-container').jplayerload(item, n);
					
					n++;
		
				});
			}
	});
	/* END get mixes directory structure for file order */


	if (window.outerWidth && window.outerWidth > 485) {
		/* Do a bunch of stuff to show the correct album and playlist if we're in a normal size browser window */
	
		$('.mainNav li').live('click', function() {
	
			var mix = this.getAttribute("mix");
			
			setMix(mix);
			
			$('div#navigation').removeClass('mainNav').addClass('horizNav');

			
			//Horizontal Scrolling menu for album covers: http://valums.com/scroll-menu-jquery/
			var div = $('div.horizNav');
			var ul = $('.horizNav ul');
			// unordered list's left margin
			var ulPadding = 15;
			
			//Get menu width
			var divWidth = div.width();
			
			//Remove scrollbars
			div.css({overflow: 'hidden'});
			
			//Find last image container
			var lastLi = ul.find('li:last-child');
			
			//When user move mouse over menu
			div.mousemove(function(e){			
				//As images are loaded ul width increases, so we recalculate it each time
				var ulWidth = lastLi[0].offsetLeft + lastLi.outerWidth() + ulPadding;
				
				var left = (e.pageX - div.offset().left) * (ulWidth-divWidth) / divWidth;
				div.scrollLeft(left);
			});

		});
	}
	
		/* Still doing a bunch of stuff, but this time ONLY for Mobile! */
	else {
		$('.thumbs li').live('click', function() {
			
			var getClass = $(this).attr('class');
			
			$('.album li.'+getClass).fadeIn('slow');
			
			$('div#navigation').removeClass('mainNav').addClass('horizNav');
				
			$('.playlist.'+getClass).show();
			
			$('.playlist').not('.playlist.'+getClass).hide();
			
			$('.album li').not('.album li.'+getClass).hide();
			
			$('#reset').show().html('<input type="button" value="Main" />');
			
		});
		
		/* END Do a bunch of stuff to show the correct album and playlist */
	}
	
	$('#navigation li, #current').live('click', function() { 
		var mix = this.getAttribute("mix");
		
		setMix(mix);
		
		location.hash = "!/"+mix;
		//var mixObj = {"mix" : mix};
		//history.pushState(mixObj, mix, mix);
	});
	
	$('div#header h1, #reset').live('click', function() {
		 resetMain();
	});
});

/* END Document.ready operations */

function setMix(mix){

	if (window.outerWidth && window.outerWidth > 490) {
		$('.playlist.'+mix).show().animate({
		        marginLeft: '530px', zIndex: '2'}, "slow");
		$('.album li.'+mix).fadeIn('slow');
		$('div#navigation img').animate({width: '100px', height: '100px'}); 
	}
	
	$('.playlist').not('.playlist.'+mix).hide().css('margin', '0px');
		
	$('.album li').not('.album li.'+mix).hide();
    
}

function resetMain(){

	$('div#navigation').removeClass('horizNav').addClass('mainNav');

	if (window.outerWidth && window.outerWidth > 490) {
		$('div#navigation img').animate({width: '200px', height:'200px'}); 
	}

	$('.playlist').hide().css('margin', '0px');		
	$('.album li, #reset').hide();    
}

/*function popChanged(e){
    console.log(e);
    if (e.state != null){
        var mix = e.state.mix;
        setMix(mix);
    }
}*/

function hashChanged(){
    var mix = location.hash.substr(3);

    setMix(mix);
}

/* Get Cover Art Function */

$.fn.displayCovers = function(folderLoc) {

	var cover = 'mixes/'+folderLoc+'.jpg';

	$('<li/>', {
		'class' : folderLoc,
		'mix' : folderLoc,
		html: '<a><img src="'+ cover +'" alt = "'+ folderLoc +'" /></a>'
		}).appendTo(this);
}

/* END Get Cover Art Function */

window.addEventListener("hashchange", hashChanged, false);

/* CODE CREDITED FOR THE STATIC PLAYLIST FRAMEWORK
 *
 * jPlayer Plugin for jQuery JavaScript Library
 * http://www.happyworm.com/jquery/jplayer
 *
 * Copyright (c) 2009 - 2010 Happyworm Ltd
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * Author: Mark J Panaghiston
 * Version: 2.0.0
 * Date: 20th December 2010
 */
$.fn.jplayerload = function(loc, num) {

		var Playlist = function(instance, playlist, options) {
		var self = this;
		
		this.instance = instance; // String: To associate specific HTML with this playlist
		this.playlist = playlist; // Array of Objects: The playlist
		this.options = options; // Object: The jPlayer constructor options for this playlist

		this.current = 0;

		this.cssId = {
			jPlayer: "jquery_jplayer_",
			interface: "jp_interface_",
			playlist: "jp_playlist_"
		};
		this.cssSelector = {};

		$.each(this.cssId, function(entity, id) {
			self.cssSelector[entity] = "#" + id + self.instance;
		});
		
		this.cssSelector["fileLoc"] = loc;

		if(!this.options.cssSelectorAncestor) {
			this.options.cssSelectorAncestor = this.cssSelector.interface;
		}

		$(this.cssSelector.jPlayer).jPlayer(this.options);

		$(this.cssSelector.interface + " .jp-previous").click(function() {
			self.playlistPrev();
			$(this).blur();
			return false;
		});

		$(this.cssSelector.interface + " .jp-next").click(function() {
			self.playlistNext();
			$(this).blur();
			return false;
		});
	};

	Playlist.prototype = {
		displayPlaylist: function() {
			var self = this;
			
			$(this.cssSelector.playlist + " ul").empty();
			
			for (i=0; i < this.playlist.length; i++) {
				var listItem = (i === this.playlist.length-1) ? "<li class='jp-playlist-last'>" : "<li>";
				var num = i+1;
				if(num<10){ num = "0"+num;}
				listItem += "<a href='#' id='" + this.cssId.playlist + this.instance + "_item_" + i +"' tabindex='1'>"+num+": "+ this.playlist[i].name +"</a>";
				// Create links to free media
				if(this.playlist[i].free) {
					var first = true;
					listItem += "<div class='jp-free-media'>(";
					$.each(this.playlist[i], function(property,value) {
						if($.jPlayer.prototype.format[property]) { // Check property is a media format.
							if(first) {
								first = false;
							} else {
								listItem += " | ";
							}
							listItem += "<a id='" + self.cssId.playlist + self.instance + "_item_" + i + "_" + property + "' href='" + value + "' tabindex='1'>" + property + "</a>";
						}
					});
					listItem += ")</span>";
				}

				listItem += "</li>";

				// Associate playlist items with their media
				$(this.cssSelector.playlist + " ul").append(listItem);
				$(this.cssSelector.playlist + "_item_" + i).data("index", i).click(function() {
					var index = $(this).data("index");
					if(self.current !== index) {
						self.playlistChange(index);
					} else {
						$(self.cssSelector.jPlayer).jPlayer("play");
					}
					$(this).blur();
					return false;
				});

				// Disable free media links to force access via right click
				if(this.playlist[i].free) {
					$.each(this.playlist[i], function(property,value) {
						if($.jPlayer.prototype.format[property]) { // Check property is a media format.
							$(self.cssSelector.playlist + "_item_" + i + "_" + property).data("index", i).click(function() {
								var index = $(this).data("index");
								$(self.cssSelector.playlist + "_item_" + index).click();
								$(this).blur();
								return false;
							});
						}
					});
				}
			}
		},
		playlistInit: function(autoplay) {
			if(autoplay) {
				this.playlistChange(this.current);
			} else {
				this.playlistConfig(this.current);
			}
		},
		playlistConfig: function(index) {
			$(this.cssSelector.playlist + "_item_" + this.current).removeClass("jp-playlist-current").parent().removeClass("jp-playlist-current");
			$(this.cssSelector.playlist + "_item_" + index).addClass("jp-playlist-current").parent().addClass("jp-playlist-current");
			this.current = index;
			$(this.cssSelector.jPlayer).jPlayer("setMedia", this.playlist[this.current]);
		},
		playlistChange: function(index) {
			this.playlistConfig(index);
			$(this.cssSelector.jPlayer).jPlayer("play");
			$('#current').html('Now Playing: <strong>'+this.playlist[index].name+'</strong> :: from the <strong>'+this.cssSelector.fileLoc+'</strong> playlist &gt;&gt;');
			$('#current').attr('mix',this.cssSelector.fileLoc);
		},
		playlistNext: function() {
			var index = (this.current + 1 < this.playlist.length) ? this.current + 1 : 0;
			this.playlistChange(index);
		},
		playlistPrev: function() {
			var index = (this.current - 1 >= 0) ? this.current - 1 : this.playlist.length - 1;
			this.playlistChange(index);
		}
	};
	
	function getPlaylist(loc) {
		var playlist;
		
		playlist = Array();
	  	
	  	$.ajax({ 
	        type: "GET", 
	        url: "itunes_playlister.php", 
	        dataType:"json", 
	        async: false,
	        data: "mix="+loc,
	        success: function(data){
	        	playlist = data;
	        } 
  		});
  		
  		return playlist;
  	}
  	
	var myPlayList = getPlaylist(loc);
		
	var audioPlaylist = new Playlist(num, myPlayList, {
		ready: function() {
			audioPlaylist.displayPlaylist();
			audioPlaylist.playlistInit(false); // Parameter is a boolean for autoplay.
		},
		ended: function() {
			audioPlaylist.playlistNext();
		},
		play: function() {
			$(this).jPlayer("pauseOthers");
		},
		swfPath: "js",
		supplied: "mp3"
	});
}
/* END Load JPlayer MP3 Playlist call */