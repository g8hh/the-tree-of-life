let modInfo = {
	name: "The Incrementreeverse",
	id: "incrementy",
	author: "pg132",
	pointsName: "points",
	discordName: "pg132#7975",
	discordLink: "",
<<<<<<< HEAD
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	
	offlineLimit: 1,  // In hours
=======
	changelogLink: "https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md",
    	offlineLimit: 10/3600,   
	// In hours, so the current (10/3600) is 10 seconds
    	initialStartPoints: new Decimal (0) // Used for hard resets and new players
>>>>>>> evolution
}

// Set your version in num and name
let VERSION = {
	num: "1.0 The Abelian Tributary",
	name: "",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.0</h3><br>
		- Added things.<br>
		- Added stuff.`

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
}}

// Display extra things at the top of the page
var displayThings = [
	function (){
		if (shiftDown) return "Shift is down"
		if (inChallenge("q", 11)) {
			return "You are in Quark challenge Son"
		} 
		if (inChallenge("q", 12)) {
			return "You are in Quark challenge Sun"
		}
		if (inChallenge("q", 21)) {
			return "You are in Quark challenge Pole"
		}
		if (inChallenge("q", 22)) {
			return "You are in Quark challenge Poll"
		}
		if (inChallenge("m", 11)) {
			return "You are in Matter challenge Creak"
		}
		if (inChallenge("m", 12)) {
			return "You are in Matter challenge Creek"
		}
		if (inChallenge("am", 11)) {
			return "You are in Antimatter challenge Know?"
		}
		if (inChallenge("am", 12)) {
			return "You are in Antimatter challenge No!"
		}
		if (inChallenge("b", 11)) {
			return "You are in Boson challenge Been"
		}
		if (inChallenge("b", 12)) {
			return "You are in Boson challenge Bin"
		}
		if (inChallenge("b", 21)) {
			return "You are in Boson challenge Band"
		}
		if (inChallenge("b", 22)) {
			return "You are in Boson challenge Banned"
		}
		if (inChallenge("sp", 11)) {
			return "You are in Super Prestige challenge Quartz"
		}
		if (inChallenge("sp", 12)) {
			return "You are in Super Prestige challenge Quarts"
		}
		if (inChallenge("sp", 21)) {
			return "You are in Super Prestige challenge Jewel"
		}
		if (inChallenge("sp", 22)) {
			return "You are in Super Prestige challenge Joule"
		}
		if (player.c.best.gt(0))  return "You have 0 layers left to unlock"
		if (player.f.best.gt(0))  return "You have 1 layers left to unlock"
		if (player.o.best.gt(0))  return "You have 2 layers left to unlock"
		if (player.pi.best.gt(0)) return "You have 3 layers left to unlock"
		if (player.sp.best.gt(0)) return "You have 4 layers left to unlock"
		if (player.b.best.gt(0))  return "You have 5 layers left to unlock"
		if (player.s.best.gt(0))  return "You have 6 layers left to unlock"
		if (player.q.best.gt(0))  return "You have 7 layers left to unlock"
		if (player.g.best.gt(0))  return "You have 8 layers left to unlock"
		if (player.n.best.gt(0))  return "You have 9 layers left to unlock"
		if (player.p.best.gt(0))  return "You have 10 layers left to unlock"
		if (player.p.best.gt(0))  return "You have 11 layers left to unlock"
		if (player.e.best.gt(0))  return "You have 12 layers left to unlock"
		if (player.m.best.gt(0))  return "You have 13 layers left to unlock"
		if (player.a.best.gt(0))  return "You have 14 layers left to unlock"
		if (player.am.best.gt(0)) return "You have 15 layers left to unlock"
		return "Welcome to Incrementreeverse!"
	},
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.layer > 1.7e308
}



// Less important things beyond this point!

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
<<<<<<< HEAD
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
=======
	return 1000 // in ms
}

var controlDown = false
var shiftDown = false

window.addEventListener('keydown', function(event) {
	if (event.keyCode == 16) shiftDown = true;
	if (event.keyCode == 17) controlDown = true;
}, false);

window.addEventListener('keyup', function(event) {
	if (event.keyCode == 16) shiftDown = false;
	if (event.keyCode == 17) controlDown = false;
}, false);

>>>>>>> evolution
