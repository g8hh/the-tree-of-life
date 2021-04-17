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
	num: "0.020.1",
	name: "Beginnings",
}

let changelog = `<h1>Changelog:</h1><br>
	<br><h2 style='color: #CCCC00'>Endgame</h2><br>
		- More tokens :)<br><br>
	<br><h2 style='color: #00CC00'>Notes</h2><br>
		- Versions will be vA.B.C<br>
		- A will be big releases <br>
		- B will be each content patch<br>
		- C will be small patches without content<br><br><br>

	<br><h3 style='color: #CC0000'>v0.020</h3><br>
		- Added an Atomic Hydrogen upgrade.<br>
		- Added an Oxygen upgrade.<br>
		- Added a token milestone.<br>
		- Added a Carbon upgrade.<br>
	<br><h3 style='color: #CC0000'>v0.019</h3><br>
		- Added a Deuterium upgrade.<br>
		- Made Oxygen VIII 10x cheaper.<br>
		- Added a token milestone.<br>
		- Added 3 coin upgrades.<br>
		- Fixed some grammar.<br>
	<br><h3 style='color: #CC0000'>v0.018</h3><br>
		- Added a row of achievements.<br>
		- Added three Carbon upgrades.<br>
		- Added two Oxygen upgrades.<br>
		- Added 5 token milestones.<br>
		- Added coins.<br>
		- Added 13 coin upgrades.<br>
	<br><h3 style='color: #CC0000'>v0.017</h3><br>
		- Added a row of achievements.<br>
		- Fixed a bug where bulk purchasing allowed for over 5000 buyables.<br>
		- Added an Oxygen upgrade.<br>
		- Added 9 token milestones.<br>
	<br><h3 style='color: #CC0000'>v0.016</h3><br>
		- Added a button for selling token buyables to fix bugs.<br>
		- Added 3 token milestones.<br>
	<br><h3 style='color: #CC0000'>v0.015</h3><br>
		- Added a row of achievements.<br>
		- Added 9 more buyables for tokens.<br>
		- Added a token milestone.<br>
	<br><h3 style='color: #CC0000'>v0.014</h3><br>
		- Added tokens.<br>
		- Added three Hydrogen upgrades.<br>
		- Added 8 buyables for tokens that boost previous currencies.<br>
		- Next patch will add the scaling buffs.<br>
	<br><h3 style='color: #CC0000'>v0.013</h3><br>
		- Added 2 rows of achievements.<br>
		- Added two Hydrogen upgrades.<br>
		- Added 4 Oxygen upgrades.<br>
		- Rebalanced A point content slightly.<br>
	<br><h3 style='color: #CC0000'>v0.012</h3><br>
		- Added a row of achievements.<br>
		- Added Oxygen.<br>
		- Added a Oxygen upgrade.<br>
		- Reduced A point gain in hard mode by 100x.<br>
	<br><h3 style='color: #CC0000'>v0.011</h3><br>
		- Added a row of achievements.<br>
		- Added Carbon.<br>
		- Added 4 Carbon upgrades.<br>
	<br><h3 style='color: #CC0000'>v0.010</h3><br>
		- Added a row of achievements.<br>
		- Added 5 Hydrogen upgrades.<br>
		- Added 3 buyables for the B minigame.<br>
		- Added 8 buyables for the A minigame.<br>
		- Improved number display.<br>
		- Added arrow hotkeys.<br>
	<br><h3 style='color: #CC0000'>v0.009</h3><br>
		- Added a row of achievements.<br>
		- Added 5 buyables for the B minigame.<br>
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
	arrowHotkeys: false,
}}

// Display extra things at the top of the page
var displayThings = [
	function(){
		// player.lastSave
		t1 = player.lastSave
		t2 = new Date().getTime()
		list1 = ""
		if (shiftDown) list1 = list1.concat("S")
		if (controlDown) list1 = list1.concat("C")
		if (player.undulating) list1 = list1.concat("U")
		if (!player.arrowHotkeys) list1 = list1.concat("A")
		let end = ""
		if (list1.length > 0) end = "(" + combineStrings(list1) + ")"
		if (player.hardFromBeginning) {
			end += player.hardMode ? "{HARD}" : "{dev easy}"
		}
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

function toggleArrowHotkeys(){
	player.arrowHotkeys = !player.arrowHotkeys
}





