var tmp = {}
var temp = tmp // Proxy for tmp
var funcs = {}
var NaNalert = false;

// Tmp will not call these
var activeFunctions = [
	"startData", "onPrestige", "doReset", "update", "automate",
	"buy", "buyMax", "respec", "onPress", "onClick", "onHold", "masterButtonPress",
	"sellOne", "sellAll", "pay", "actualCostFunction", "actualEffectFunction",
	"effectDescription", "display", "fullDisplay", "effectDisplay", "rewardDisplay",
	"tabFormat", "content",
	"onComplete", "onPurchase", "onEnter", "onExit", "done",
	"getUnlocked", "getStyle", "getCanClick", "getTitle", "getDisplay",
	"getMinigameMaximum", "maxTimes", "exitMinigame", 
]

var noCall = doNotCallTheseFunctionsEveryTick
for (item in noCall) {
	activeFunctions.push(noCall[item])
}

// Add the names of classes to traverse
var traversableClasses = []

function setupTemp() {
	tmp = {}
	tmp.pointGen = {}
	tmp.backgroundStyle = {}
	tmp.displayThings = []
	tmp.scrolled = 0
	tmp.gameEnded = false
	funcs = {}
	
	setupTempData(layers, tmp, funcs)
	for (layer in layers){
		tmp[layer].resetGain = {}
		tmp[layer].nextAt = {}
		tmp[layer].nextAtDisp = {}
		tmp[layer].canReset = {}
		tmp[layer].notify = {}
		tmp[layer].prestigeNotify = {}
		tmp[layer].computedNodeStyle = []
		setupBuyables(layer)
		tmp[layer].trueGlowColor = []
	}

	tmp.other = {
		lastPoints: player.points || decimalZero,
		oomps: decimalZero,
		screenWidth: 0,
		screenHeight: 0,
    }

	updateWidth()

	temp = tmp
}

const boolNames = ["unlocked", "deactivated"]

function setupTempData(layerData, tmpData, funcsData) {
	for (item in layerData){
		if (layerData[item] == null) tmpData[item] = null
		else if (layerData[item] instanceof Decimal)
			tmpData[item] = layerData[item]
		else if (Array.isArray(layerData[item])) {
			tmpData[item] = []
			funcsData[item] = []
			setupTempData(layerData[item], tmpData[item], funcsData[item])
		}
		else if ((!!layerData[item]) && (layerData[item].constructor === Object)) {
			tmpData[item] = {}
			funcsData[item] = []
			setupTempData(layerData[item], tmpData[item], funcsData[item])
		}
		else if ((!!layerData[item]) && (typeof layerData[item] === "object") && traversableClasses.includes(layerData[item].constructor.name)) {
			tmpData[item] = new layerData[item].constructor()
			funcsData[item] = new layerData[item].constructor()
		}
		else if (isFunction(layerData[item]) && !activeFunctions.includes(item)){
			funcsData[item] = layerData[item]
			if (boolNames.includes(item)) tmpData[item] = false
			else tmpData[item] = decimalOne // The safest thing to put probably?
		} else {
			tmpData[item] = layerData[item]
		}
	}	
}


function updateTemp(noError = false) {
	if (tmp === undefined) setupTemp()

	updateTempData(layers, tmp, funcs, undefined, noError, true)

	for (layer in layers){
		tmp[layer].resetGain = getResetGain(layer)
		tmp[layer].nextAt = getNextAt(layer)
		tmp[layer].nextAtDisp = getNextAt(layer, true)
		tmp[layer].canReset = canReset(layer)
		tmp[layer].trueGlowColor = tmp[layer].glowColor
		tmp[layer].notify = shouldNotify(layer)
		tmp[layer].prestigeNotify = prestigeNotify(layer)
		if (tmp[layer].passiveGeneration === true) tmp[layer].passiveGeneration = 1 // new Decimal(true) = decimalZero

	}

	tmp.pointGen = getPointGen()
	tmp.backgroundStyle = readData(backgroundStyle)

	tmp.displayThings = []
	for (thing in displayThings){
		let text = displayThings[thing]
		if (isFunction(text)) text = text()
		tmp.displayThings.push(text) 
	}
	if (checkWordData()) player.wordsSpelled ++

}

function updateTempData(layerData, tmpData, funcsData, useThis, noError = false, firstStep = false) {
	for (item in funcsData){
		if (firstStep && !noError) {
			if (layers[item].deactivated) {
				if (layers[item].deactivated()) continue
			}
		}
		if (Array.isArray(layerData[item])) {
			if (item !== "tabFormat" && item !== "content") // These are only updated when needed
				updateTempData(layerData[item], tmpData[item], funcsData[item], useThis, noError)
		}
		else if ((!!layerData[item]) && (layerData[item].constructor === Object) || (typeof layerData[item] === "object") && traversableClasses.includes(layerData[item].constructor.name)){
			updateTempData(layerData[item], tmpData[item], funcsData[item], useThis, noError)
		}
		else if (isFunction(layerData[item]) && !isFunction(tmpData[item])){
			let value

			if (useThis !== undefined) value = layerData[item].bind(useThis)()
			else value = layerData[item]()
			if (value !== value || checkDecimalNaN(value)){
				if (!NaNalert && !noError) {
					console.log(value, layerData, funcsData, tmpData, useThis)
					confirm("Invalid value found in tmp, named '" + item + "'. Please let the creator of this mod know with a screenshot of the console and the save! You can refresh the page, and you will be un-NaNed.")
					clearInterval(interval);
					NaNalert = true;
					return
				}
			}
			Vue.set(tmpData, item, value)
		}
	}	
}

function updateChallengeTemp(layer){
	updateTempData(layers[layer].challenges, tmp[layer].challenges, funcs[layer].challenges)
}


function updateBuyableTemp(layer){
	updateTempData(layers[layer].buyables, tmp[layer].buyables, funcs[layer].buyables)
}

function updateClickableTemp(layer){
	updateTempData(layers[layer].clickables, tmp[layer].clickables, funcs[layer].clickables)
}

function setupBuyables(layer) {
	for (id in layers[layer].buyables) {
		if (isPlainObject(layers[layer].buyables[id])) {
			let b = layers[layer].buyables[id]
			b.actualCostFunction = b.cost
			b.cost = function(x) {
				x = (x === undefined ? player[this.layer].buyables[this.id] : x)
				return layers[this.layer].buyables[this.id].actualCostFunction(x)
			}
			b.actualEffectFunction = b.effect
			b.effect = function(x) {
				x = (x === undefined ? player[this.layer].buyables[this.id] : x)
				return layers[this.layer].buyables[this.id].actualEffectFunction(x)
			}
		}
	}
}

function checkDecimalNaN(x) {
	return (x instanceof Decimal) && !x.eq(x)
}