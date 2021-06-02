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
	num: "1.005",
	name: "Beginnings",
}

let changelog = `<h1>Changelog:</h1><br>
	<br><h2 style='color: #CCCC00'>Endgame</h2><br>
		- 87 Dilation completions OR the last save in the bank<br><br>
	<br><h2 style='color: #00CC00'>Notes</h2><br>
		- Versions will be vA.B.C<br>
		- A will be big releases <br>
		- B will be each content patch<br>
		- C will be small patches without content<br><br><br>

	<br><h3 style='color: #CC0000'>v1.004</h3><br> 
		- Added a Life buyable.<br>
		- Added a Phosphorus upgrade.<br>
	<br><h3 style='color: #CC0000'>v1.004</h3><br> 
		- Added four Phosphorus upgrades.<br>
		- Added nine µ upgrades.<br>
		- Added five Life milestones.<br>
		- Added five Life buyables.<br>
		- Changed µ V text.<br>
		- Added four rows of achievements.<br>
		- Added a save to the bank.<br>
		- The 2.7e12 Life milestone now has an effect.<br>
		- Added a base gain/gain exp display in info tab (for Life) after they are relavent.<br>
		- Made the mspt display red when over 50 mspt.<br>
	<br><h3 style='color: #CC0000'>v1.003</h3><br> 
		- Added a µ upgrade.<br>
		- Added a Life milestone.<br>
		- Added a custom save.<br>
		- Small spelling fixes.<br>
		- Added an explination for how dilation works [go play AD y'all].<br>
	<br><h3 style='color: #CC0000'>v1.002</h3><br> 
		- Added two Life milestones.<br>
		- Added a life buyable.<br>
	<br><h3 style='color: #CC0000'>v1.001.2</h3><br> 
		- Added a Life milestone.<br>
		- Next up is a Life buyable.<br>
	<br><h3 style='color: #CC0000'>v1.001.1</h3><br> 
		- Added two rows of achievements.<br>
	<br><h3 style='color: #CC0000'>v1.001</h3><br> 
		- Added 2 µ buyables.<br>
		- Added 14 Life milestones.<br>
		- Added a Life challenge.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.000</h3><br>
		- Added Life, the beginning of phase 2.<br>
	<br><h3 style='color: #CC0000'>v0.064</h3><br>
		- Finished phase 1!<br>
		- Next patch will be v1 with balancing!<br>
		- Added two Phosphorus upgrades.<br>
		- Added ten µ upgrades.<br>
		- Added nine µ milestones.<br>
		- Added seven µ buyables.<br>
		- Made E point recursion simulated after 5 iterations.<br>
	<br><h3 style='color: #CC0000'>v0.063</h3><br>
		- Added 4 µ upgrades.<br>
		- Added 2 µ milestones.<br>
		- Added an E Point buyable.<br>
		- Added three Phosphorus upgrades.<br>
		- Added a save to the bank.<br>
	<br><h3 style='color: #CC0000'>v0.062</h3><br> 4upg 2 mileston buyable
		- Added µ (new layer).<br>
		- Added two rows of achievements.<br>
		- Added a save to the bank.<br>
		- Added two mu milestones.<br>
		- Added a mu upgrade.<br>
		- Guess why I chose to name it µ and get your name in the game (again possibly)!<br>
	<br><h3 style='color: #CC0000'>v0.061</h3><br>
		- Added two Phosphorus upgrades.<br>
	<br><h3 style='color: #CC0000'>v0.060</h3><br>
		- Wording fixes.<br>
		- Added four Phosphorus upgrades.<br>
		- Fixed mspt display.<br>
	<br><h3 style='color: #CC0000'>v0.059</h3><br>
		- Wording fixes.<br>
		- Implemented 2e10 Phosphorus milestone.<br>
		- Removed some unnecessary stuff after 1ee6 fuel.<br>
	<br><h3 style='color: #CC0000'>v0.058.2</h3><br>
		- Added a save to the save bank.<br>
		- Updated endgame.<br>
	<br><h3 style='color: #CC0000'>v0.058.1</h3><br>
		- So my brain exploded three times, I had to be revived, thanks doc!<br>
		- Fixed the jumping production bug<br>
		(Dinner didn't add to total Nitrogen, which Nitrogen's effect is based on)<br>
		- Added 4 Phosphorus milestones.<br>
		- Added two Phosphorus upgrades.<br>
		- Misc QoL changes.<br>
	<br><h3 style='color: #CC0000'>v0.058</h3><br>
		- My brain will explode... idk man.<br>
	<br><h3 style='color: #CC0000'>v0.057</h3><br>
		- Added Phosphorus (P).<br>
		- Improved notification for side-layers.<br>
		- Added a D Point buyable.<br>
		- Added a Phosphorus upgrade.<br>
		- Added five Phosphorus milestones.<br>
		- Added two saves to the bank.<br>
		- Hotfixed a couple of bugs, not sure if it actually works tho.<br>
	<br><h3 style='color: #CC0000'>v0.056.1</h3><br>
		- Added a mspt display.<br>
		- Cleaned up a bit of code, and created some error catchers.<br>
	<br><h3 style='color: #CC0000'>v0.056</h3><br>
		- Merged v2.5.9.2 of TMT.<br>
	<br><h3 style='color: #CC0000'>v0.055</h3><br>
		- Added 3 D Point upgrades.<br>
	<br><h3 style='color: #CC0000'>v0.054</h3><br>
		- Added a nitrogen milestone.<br>
	<br><h3 style='color: #CC0000'>v0.053</h3><br>
		- Added two E Point buyables.<br>
		- Added a Oxygen upgrade.<br>
		- Added two Carbon upgrades.<br>
		- Added a save to the bank.<br>
		- Buffed Oxygen XII and nerfed Nitrogen XV.<br>
	<br><h3 style='color: #CC0000'>v0.052</h3><br>
		- Added a D Point buyable.<br>
		- Added two Oxygen upgrades.<br>
		- Added two Carbon upgrades.<br>
		- Added two saves to the bank.<br>
		- Rebalanced until endgame.<br>
	<br><h3 style='color: #CC0000'>v0.051</h3><br>
		- Added a E Point buyable.<br>
		- Added a Nitrogen milestone.<br>
		- Added three Nitrogen upgrades.<br>
		- Added a save to the bank.<br>
		- Fixed Nitrogen XVIII cost.<br>
	<br><h3 style='color: #CC0000'>v0.050.1</h3><br>
		- Added two E Point buyables.<br>
		- Improved number formatting.<br>
		- Added a save to the bank.<br>
		- Made sure that v.050 content was all pushed.<br>
	<br><h3 style='color: #CC0000'>v0.050</h3><br>
		- Finally more content!<br>
		- Added 5 Nitrogen upgrades.<br>
		- Added a E Point buyable.<br>
		- Make blue a 10 times larger but effect 10x smaller (no net change).<br>
		- As always, added some saves into the bank (3).<br>
	<br><h3 style='color: #CC0000'>v0.049.2</h3><br>
		- Added all the saves from my pastebin.<br>
	<br><h3 style='color: #CC0000'>v0.049.1</h3><br>
		- Fixed hotkey display with mini hotkeys.<br>
		- Added custom saves (only 1 right now).<br>
		- Improved the info tab.<br>
		- Added in player.dev.autobuytokens and player.dev.aPointMult etc.<br>
	<br><h3 style='color: #CC0000'>v0.049</h3><br>
		- Rebalanced until Nitrogen.<br>
	<br><h3 style='color: #CC0000'>v0.048</h3><br>
		- Rebalanced until e20k C Points.<br>
		- Made tokens layer notify you when you can afford all 18 buyables.<br>
		- Added player.dev.cPointMult and player.dev.fastCorn <br>
	<br><h3 style='color: #CC0000'>v0.047</h3><br>
		- Added a E buyable.<br>
		- Added a Nitrogen upgrade.<br>
	<br><h3 style='color: #CC0000'>v0.046</h3><br>
		- Added 2 E buyables.<br>
		- Added a Nitrogen upgrade.<br>
		- Improved E Point (shift on) display.<br>
		- Now shows the value from f^n(0) as well as specifying the exponent better.<br>
	<br><h3 style='color: #CC0000'>v0.045</h3><br>
		- Added 3 E buyables.<br>
		- Nerfed iteration cost.<br>
	<br><h3 style='color: #CC0000'>v0.044.2</h3><br>
		- Rebalanced up to 16 tokens.<br>
	<br><h3 style='color: #CC0000'>v0.044.1</h3><br>
		- Changed display to not show digits after the decimal point between 1e6 and 1e9.<br>
		- Early game cost reductions (basically everything pre minigames is 2x cheaper).<br>
		- Reduce the first token cost.<br>
		- Increase the cost of B33 (by e1000x), reduced orange cost by 10x.<br>
		- Minigame tooltip now displays minigame points.<br>
		- Added control+shift+s to save.<br>
		- Fixed error console message.<br>
		- Added a couple of empty lines under hotkeys to reduce clutter.<br>
		- Changed reset for Nitrogen hotkey.<br>
		- Made log10(9+log10(10+B Points)) multiply color production (to make B->A more playable).<br>
		- A Point gain formula display improvement.<br>
		- Reduce fourteen goal in hard mode.<br>
		- Made the first purchase of B buyables not automatic.<br>
	<br><h3 style='color: #CC0000'>v0.044</h3><br>
		- Added 2 D Point upgrades.<br>
		- Added a D Point buyable.<br>
		- Added 3 Nitrogen upgrades.<br>
		- Added E minigame.<br>
		- Added an E Point buyables.<br>
		- Buffed supper to include making buyables not cost anything.<br>
		- Made all uses of format run only if it is being displayed.<br>
		- Display one more digit on currencies.<br>
	<br><h3 style='color: #CC0000'>v0.043</h3><br>
		- Added 3 D Point upgrades.<br>
		- Added 2 D Point buyables.<br>
		- Added 2 Nitrogen challenges.<br>
		- Fixed some bugs with not having all C Point upgrades.<br>
		- Improved the fuel display with colors and information.<br>
		- Added a row of achievements.<br>
		- Code was cleaned up.<br>
	<br><h3 style='color: #CC0000'>v0.042</h3><br>
		- Added 3 D Point upgrades.<br>
		- Added a D Point buyable.<br>
	<br><h3 style='color: #CC0000'>v0.041</h3><br> 
		- Added 4 D Point upgrades.<br>
		- Added 4 D Point buyables.<br>
		- Changed formatting slightly from ee9 to ee10.<br>
		- Made D buyables not display on the C buyables tab.<br>
	<br><h3 style='color: #CC0000'>v0.040</h3><br>
		- Added 2 D Point upgrades.<br>
		- Added 2 D Point buyables.<br>
		- Made fourteen completeable in hard mode.<br>
	<br><h3 style='color: #CC0000'>v0.039</h3><br>
		- Added 3 D Point upgrades.<br>
		- Added 6 D Point buyables.<br>
	<br><h3 style='color: #CC0000'>v0.038</h3><br>
		- Fixed up the nitrogen challenge display.<br>
		- Added a challenge and gave Fourteen a reward.<br>
	<br><h3 style='color: #CC0000'>v0.037</h3><br> 
		- Added two nitrogen challenges.<br>
		- Added two nitrogen milestones.<br>
		- Added two nitrogen upgrades.<br>
		- Fixed a mini-bug in break_eternity.js<br>
	<br><h3 style='color: #CC0000'>v0.036</h3><br> 
		- Added three nitrogen challenges.<br>
		- Hard mode resets more stuff during nitrogen challenges, and might make some of them unplayable, hmu.<br>
		- Added two nitrogen milestones.<br>
		- Added a row of achievements.<br>
	<br><h3 style='color: #CC0000'>v0.035</h3><br> 
		- Added two nitrogen upgrades.<br>
		- Added two oxygen upgrades.<br>
		- Added a carbon upgrade.<br>
	<br><h3 style='color: #CC0000'>v0.034</h3><br> 
		- Added two nitrogen upgrades.<br>
		- Added six nitrogen milestones.<br>
	<br><h3 style='color: #CC0000'>v0.033</h3><br> 
		- Made the autobuy token autobuyer work as intended.<br>
		- Fixed a lot of display issues with things now being down.<br>
		- Added a nitrogen upgrade.<br>
		- Added a nitrogen milestone.<br>
		- Moved character multiplier effect display to the upgrades page.<br>
	<br><h3 style='color: #CC0000'>v0.032</h3><br>
		- Added notification for various resets and upgrades.<br>
		- Added three nitrogen milestones.<br>
		- Gave nitrogen an effect.<br>
		- Made token milestones hidden until the previous was unlocked.<br>
	<br><h3 style='color: #CC0000'>v0.031</h3><br> 
		- Made achievements not disappear after nitrogen resetting.<br>
		- Added a nitrogen milestone<br>.
		- Gave nitrogen an effect.<br>
		- Made Iron twice as cheap.<br>
		- Added four nitrogen upgrades that can be bought in any order.<br>
		- Added T and S hotkeys.<br>
	<br><h3 style='color: #CC0000'>v0.030</h3><br>
		- Added three upgrades for C minigame.<br>
		- Increased digits display for sufficiently small numbers.<br>
		- Added a hardcap for C Point gain 2, but it's not for a while, so I might remove it.<br>
		- Added nitrogen including...<br>
		... a prestige button/displays for it<br>
		... a prestiging function which resets all prior progress except achievements<br>
		... one upgrade currently (there will be options to start)<br>
	<br><h3 style='color: #CC0000'>v0.029</h3><br>
		- Added six buyables for C minigame.<br>
		- Added two upgrades for C minigame.<br>
		- Added three token upgrades.<br>
		- Added two rows of achievements.<br>
		- Redid C minigame display.<br>
	<br><h3 style='color: #CC0000'>v0.028</h3><br>
		- Added a buyable for C minigame.<br>
		- Added a upgrade for C minigame.<br>
		- Added a token milestone and two token upgrades.<br>
		- Added two rows of achievements.<br>
	<br><h3 style='color: #CC0000'>v0.027</h3><br>
		- Added two buyables for C minigame.<br>
		- Added five upgrades for C minigame.<br>
		- Added two token milestones.<br>
	<br><h3 style='color: #CC0000'>v0.026</h3><br>
		- Added a buyable for C minigame.<br>
		- Added four upgrades for C minigame.<br>
	<br><h3 style='color: #CC0000'>v0.025</h3><br>
		- Added five buyables for C minigame.<br>
		- Added five upgrades for C minigame.<br>
		- Added a display for the base of all characters.<br>
		- By the way, the formula is base^choose2(n) where n is the number of said character.<br>
	<br><h3 style='color: #CC0000'>v0.024</h3><br>
		- Added a token milestone.<br>
		- Added content for C minigame which includes...<br>
		... A virtual slot machine with up to 15 slots!<br>
		... Up to 11 options for you to roll!<br>
		... Upgrades to improve the game (one of them will be auto roll, don't worry 😊)<br>
	<br><h3 style='color: #CC0000'>v0.023</h3><br>
		- Added a spelling minigame.<br>
	<br><h3 style='color: #CC0000'>v0.022</h3><br>
		- This is your second hint! Jacorb found it, and I changed some stuff.<br>
		- Added two rows of achievements.<br>
		- Added two token milestones.<br>
		- Added two Atomic Hydrogen upgrades.<br>
		- Added three Deuterium upgrade.<br>
		- Added a display for total tokens.<br>
	<br><h3 style='color: #CC0000'>v0.021</h3><br>
		- This is your first hint! 15 < x < 21<br>
		- Added two rows of achievements.<br>
		- Added a token milestone.<br>
		- Added a Carbon upgrade.<br>
		- Added an Oxygen upgrade.<br>
		- Added two Atomic Hydrogen upgrades.<br>
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
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything",
					"costFormula",
					"costFormulaID"]

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
	arrowHotkeys: true,
	lastLettersPressed: [],
	targetWord: "johnson",
	wordsSpelled: 0,
	currentTime: new Date().getTime(),
	showBuiltInSaves: false,
	dev: {
		fastCorn: false,
		aPointMult: undefined,
		bPointMult: undefined,
		cPointMult: undefined,
		dPointMult: undefined,
		ePointMult: undefined,
		autobuytokens: false,
	},
}}

// Display extra things at the top of the page
var displayThings = [
	function(){
		let t1 = player.lastSave
		let t2 = new Date().getTime()

		list1 = []
		if (shiftDown) list1 = list1.concat("S")
		if (controlDown) list1 = list1.concat("C")
		if (player.undulating) list1 = list1.concat("U")
		if (!player.arrowHotkeys) list1 = list1.concat("¬A")
		
		let end = ""
		if (list1.length > 0) end = "(" + combineStrings(list1) + ")"
		if (player.hardFromBeginning && player.hardMode) end += "{HARD}" 
		else if (player.hardMode) end += "{Hard}"
		let saveFinal = "Last save was: " + formatTime((t2-t1)/1000) + " ago. " + end

		let len = pastTickTimes.length
		if (len <= 3) return saveFinal
		let a = 0
		for (i = 0; i < len; i++){
			a += pastTickTimes[i]
		}

		let val = Math.round(a/len)
		let p1 = ""
		let p2 = ""
		if (val > 50) {
			p1 = "<bdi style='color: #CC0000'>"
			p2 = "</bdi>"
		}

		let msptFinal = " ms/tick = " + p1 + formatWhole(val) + p2
		return saveFinal + msptFinal
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
var logKeyCode = false

function hasSpelledWord(word){
	let l = word.length
	if (l > 25) {
		console.log("nopers")
		return false
	}
	for (i = 0; i < l; i++){
		let id = 25 - l + i
		let is = player.lastLettersPressed[id]
		let shouldbe = word[i]
		if (is != shouldbe) return false
	}
	return true
} 
/* 
take 10k common words and convert into list that can be copy pasted somewhere
then put somewhere and make function to generate random word
then display it, figure out how much has been spelled and show that in one color
unspelled in different 
upon spelling of the word give reward poggers

*/

function getLetterFromNum(x){
	return {
		32: " ",
		65: "a",
		66: "b",
		67: "c",
		68: "d",
		69: "e",
		70: "f",
		71: "g",
		72: "h",
		73: "i",
		74: "j",
		75: "k",
		76: "l",
		77: "m",
		78: "n",
		79: "o",
		80: "p",
		81: "q",
		82: "r",
		83: "s",
		84: "t",
		85: "u",
		86: "v",
		87: "w",
		88: "x",
		89: "y",
		90: "z",
	}[x]
}

window.addEventListener('keydown', function(event) {
	code = event.keyCode
	if (player.toggleKeys) {
		if (code == 16) shiftDown = !shiftDown;
		if (code == 17) controlDown = !controlDown;
	} else {
		if (code == 16) shiftDown = true;
		if (code == 17) controlDown = true;
	}
	if (logKeyCode) console.log(code)
	if ((code >= 65 && code <= 90) || code == 32) {
		player.lastLettersPressed.push(getLetterFromNum(code))
		let l = player.lastLettersPressed.length
		if (l > 25) {
			player.lastLettersPressed = player.lastLettersPressed.slice(l-25,)
		}
	}
	//65 to 90 are a to z
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
}

function enterHardMode(){
	player.hardMode = true
	if (player.h.best.lt(10)) player.hardFromBeginning = true
}

function toggleArrowHotkeys(){
	player.arrowHotkeys = !player.arrowHotkeys
}





