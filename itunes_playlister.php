<?php
/*
  iTunes XML PhP Parser for PHP 5
  Copyright (C) 2005 Peter Minarik [http://www.wirsindecht.org]
  version: 1.00
  based on:

  iTunes XML PhP Parser
  Copyright (C) 2003 Robert A. Wallis [http://codetriangle.com/]
  version: 1.00

  This program is free software; you can redistribute it and/or
  modify it under the terms of the GNU LESSER GENERAL PUBLIC LICENSE
  as published by the Free Software Foundation; either version 2.1
  of the License, or (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Library General Public License for more details.

  You should have received a copy of the GNU Library General Public
  License along with this library; if not, write to the Free
  Software Foundation, Inc., 59 Temple Place - Suite 330, Boston,
  MA 02111-1307, USA

  iTunes is a product by Apple Computer, Inc.
  http://www.apple.com/

*/

if(isset($_GET['mix']) && $_GET['mix'] != "") {
	$path = $_GET['mix'];
	
	$xml = "mixes/".$path.".xml";
								
	$jsonmix = iTunesPlaylist($xml, $path);
	
	echo $jsonmix;
}

function iTunesPlaylist($filename, $path) {

	$mixStor = "http://d3v2j6sqti93vu.cloudfront.net/mixes/";
	// init main variables
	$songs = array();
	
	$dom = new DomDocument();
	if (!$dom->load($filename))
		die("Could not parse iTunes XML file: ".$filename);

	// get the root element
	$root = $dom->documentElement;
	
	// find the first "dict"
	$children = $root->childNodes;
	foreach ($children as $child) {
		if ($child->nodeName=="dict") {
			$root = $child;
			break;
		}
	}

	// do that again, and find the second inner dict
	$children = $root->childNodes;
	foreach ($children as $child) {
		if ($child->nodeName=="dict") {
			$root = $child;
			break;
		}
	}

	// now go through all the child elements
	$children = $root->childNodes;
	foreach ($children as $child) {
		// all the sub dicts from here on should be songs
		if ($child->nodeName=="dict") {
			$song = NULL;

			// get all the elements
			$elements = $child->childNodes;
			for ($i = 0; $i < $elements->length; $i++) {
				if ($elements->item($i)->nodeName=="key") {
					$key = $elements->item($i)->textContent;
					$i++;
					$value = $elements->item($i)->textContent;
					$song[$key]=$value;
				}
			}
					
			$song["Title"] = $song["Name"];
			$song["name"] = $song["Artist"]." / ".$song["Title"];
			
			$loc = pathinfo($song["Location"],PATHINFO_FILENAME);
					
			$song["mp3"] = $mixStor.$path."/".$loc.".mp3";

			// save the song
			if ($song)
				$songs[] = $song;
		}
		
	}

	return json_encode($songs);
}
