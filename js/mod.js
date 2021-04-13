let modInfo = {
	name: "The Tree of Life",
	id: "tree_of_life",
	author: "pg132",
	pointsName: "Life Points",
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (1), // Used for hard resets and new players
	
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.008.1",
	name: "Beginnings",
}

let changelog = `<h1>Changelog:</h1><br>
	<br><h2 style='color: #CCCC00'>Endgame</h2><br>
		- 3 Million B points<br><br>
	<br><h2 style='color: #00CC00'>Notes</h2><br>
		- Versions will be vA.B.C<br>
		- A will be big releases <br>
		- B will be each content patch<br>
		- C will be small patches without content<br><br><br>

	<br><h3 style='color: #CC0000'>v0.008</h3><br>
		- Added hard mode.<br>
		- Added a display for whether you played hard mode from the start ({HARD} means you have).<br>
		- Added an achievement rows completed display.<br>
		- Added five Hydrogen upgrades.<br>
	<br><h3 style='color: #CC0000'>v0.007</h3><br>
		- Added color undulating.<br>
		- Added Atomic Hydrogen content, displays, and a new tab.<br>
		- Added seven achievements.<br>
		- Added nine Hydrogen upgrades.<br>
		- Made Optima the default font.<br>
	<br><h3 style='color: #CC0000'>v0.006</h3><br>
		- Added time until purchase displays.<br>
		- Added Deuterium content, displays, and a new tab.<br>
		- Added two achievements.<br>
	<br><h3 style='color: #CC0000'>v0.005</h3><br>
		- Added seven Hydrogen upgrades.<br>
		- Added code for when you have too much of an element and it needs to decay.<br>
		- Added a display for actual Hydrogen/s.<br>
		- Added two achievements.<br>
	<br><h3 style='color: #CC0000'>v0.004</h3><br>
		- Added achievements.<br>
	<br><h3 style='color: #CC0000'>v0.003</h3><br>
		- Added the old hotkey set up.<br>
		- Added spacing.<br>
		- Sorta added Hydrogen.<br>
	<br><h3 style='color: #CC0000'>v0.002</h3><br>
		- Added force shift/control and undulation control.<br>
		- Added time since last save display.<br>
	<br><h3 style='color: #CC0000'>v0.001</h3><br>
		- Added some math functions.<br>
		- Made the vueFile local.<br>`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	toggleKeys: false,
	undulating: false,
	lastSave: new Date().getTime(),
	hardMode: false,
	hardFromBeginning: false,
}}

// Display extra things at the top of the page
var displayThings = [
	function(){
		// player.lastSave
		t1 = player.lastSave
		t2 = new Date().getTime()
		end = ""
		if (shiftDown) end += "(S)"
		if (controlDown) end += "(C)"
		if (player.undulating) end += "(U)"
		if (player.hardFromBeginning) end += "{HARD}"
		else if (player.hardMode) end += "{Hard}"
		return "Last save was: " + formatTime((t2-t1)/1000) + " ago " + end
	}
]

// Determines when the game "ends"
function isEndgame() {
	return false
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return 1 // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}

var controlDown = false
var shiftDown = false

window.addEventListener('keydown', function(event) {
	if (player.toggleKeys) {
		if (event.keyCode == 16) shiftDown = !shiftDown;
		if (event.keyCode == 17) controlDown = !controlDown;
	} else {
		if (event.keyCode == 16) shiftDown = true;
		if (event.keyCode == 17) controlDown = true;
	}
}, false);

window.addEventListener('keyup', function(event) {
	if (player != undefined && player.toggleKeys) return 
	if (event.keyCode == 16) shiftDown = false;
	if (event.keyCode == 17) controlDown = false;
}, false);

function toggleShift(){
	shiftDown = !shiftDown
}

function toggleControl(){
	controlDown = !controlDown
}

function toggleUndulating(){
	player.undulating = !player.undulating
	console.log("currently nothing undulates lol")
}

function enterHardMode(){
	player.hardMode = true
	if (player.h.best.lt(10)) player.hardFromBeginning = true
}






