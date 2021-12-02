// ************ Save stuff ************
var logSave = false 
const saveRegexCode = /[^\w ]|_/g // \w = word library (i.e. all numbers & letters, not case-specific)
var allSaves 

function save(name = allSaves.set, force) {
	NaNcheck(player)
	if (NaNalert && !force) return
	allSaves[name] = player
	setLocalStorage()
}

function hardReset(resetOptions) {
	if (!confirm("Are you sure you want to do this? You will lose all your progress!")) return
	player = getStartPlayer()
	save()
	window.location.reload()
}

function setLocalStorage() {
	let t = new Date().getTime()
	if (logSave) console.log("saved at " + t)
	if (!(player === null)) player.lastSave = t
	localStorage.setItem(modInfo.id, btoa(unescape(encodeURIComponent(JSON.stringify(allSaves)))))
	localStorage.setItem(modInfo.id+"_options", btoa(unescape(encodeURIComponent(JSON.stringify(options)))))
}

function showAllSaves() {
	player.saveMenuOpen = true
}

function loadSave(name) {
	allSaves.set = name
	setLocalStorage()
	window.location.reload()
}

function renameSave(name) {
	let newName = prompt("Enter save name: ")
	newName = newName.replace(saveRegexCode, "") // Removes all non-alphanumeric characters
	if (newName=="set") {
		alert("Sorry, that name is used in the game's data, so you can't use it personally or it will cause terrible glitches!")
		return
	} else if (allSaves[newName] !== undefined) {
		alert("That name is taken already, sorry!")
		return
	} else if (newName.length>20) {
		alert("This name is too long!")
		return
	} else {
		if (name==allSaves.set) save()
		allSaves[newName] = allSaves[name]
		allSaves[name] = undefined
		if (name==allSaves.set) loadSave(newName)
		else setLocalStorage()
	}
	resetSaveMenu()
}

function deleteSave(name) {
	if (Object.keys(allSaves).filter(x => (x!="set" && allSaves[x]!==undefined)).length==1) {
		hardReset()
		return
	}
	if (!confirm("Are you sure you wish to delete your save named " + name + "?")) return
	allSaves[name] = undefined
	if (name==allSaves.set) {
		let valid = Object.keys(allSaves).filter(x => (x!="set" && (allSaves[x]!==undefined||x==name)))
		let toLoad = valid[(valid.indexOf(name)+1)%valid.length]
		loadSave(toLoad)
	}
	setLocalStorage()
	resetSaveMenu()
}

function newSave(mode) {
	let newName = prompt("Enter save name: ")
	newName = newName.replace(saveRegexCode, "") // Removes all non-alphanumeric characters
	if (newName=="set") {
		alert("Sorry, that name is used in the game's data, so you can't use it personally or it will cause terrible glitches!")
		return
	} else if (allSaves[newName] !== undefined) {
		alert("That name is taken already, sorry!")
		return
	} else if (newName.length > 20) {
		alert("This name is too long!")
		return
	} else {
		startPlayer = getStartPlayer()
		if (mode == "easy") startPlayer.easyMode = true 
		if (mode == "hard") {
			startPlayer.hardMode = true
			startPlayer.hardFromBeginning = true
		}
		if (mode == "extreme") {
			startPlayer.extremeMode = true
			startPlayer.extremeFromBeginning = true
		}

		allSaves[newName] = startPlayer
		loadSave(newName)
	}
}

function moveSave(name, dir) {
	let valid = Object.keys(allSaves).filter(x => (x!="set" && allSaves[x]!==undefined))
	let oldPos = valid.indexOf(name)
	let newPos = Math.min(Math.max(oldPos+dir, 0), valid.length-1)
	console.log("Old: "+oldPos+", New: "+newPos)
	if (oldPos==newPos) return
	
	let name1 = valid[oldPos]
	let name2 = valid[newPos]
	let active1 = name1==allSaves.set
	let active2 = name2==allSaves.set
	
	if (active1 || active2) save()
	let newAllSaves = {set: allSaves.set}
	for (let n of Object.keys(allSaves).sort((x,y) => ((x==name1&&y==name2)||(x==name2&&y==name1))?-1:1)) newAllSaves[n] = allSaves[n]
	allSaves = newAllSaves
	
	setLocalStorage()
	resetSaveMenu()
}

function showMoveSaveBtn(name, dir) {
	let valid = Object.keys(allSaves).filter(x => (x!="set" && allSaves[x]!==undefined))
	if (dir=="up") return valid.indexOf(name)>0
	else return valid.indexOf(name)<(valid.length-1)
}

function resetSaveMenu() { // reset the menu display
	player.saveMenuOpen = false
	player.saveMenuOpen = true
}



// **LOADING SAVE STUFF**

function load() {
	let get = localStorage.getItem(modInfo.id)

	if (get === null || get === undefined) {
		player = getStartPlayer()
		options = getStartOptions()
		allSaves = {set: "save1", save1: player}
	} else {
		let data = JSON.parse(decodeURIComponent(escape(atob(get))))
		if (data.set !== undefined) {
			player = Object.assign(getStartPlayer(), data[data.set])
			allSaves = data
		} else {
			player = Object.assign(getStartPlayer(), data)
			allSaves = {set: "save1", save1: player}
		}
	}
	fixSave()
	loadOptions()

	if (options.offlineProd) {
		if (player.offTime === undefined) player.offTime = { remain: 0 }
		player.offTime.remain += (Date.now() - player.time) / 1000
	}
	player.time = Date.now()
	versionCheck()
	changeTheme()
	changeTreeQuality()
	updateLayers()
	setupModInfo()

	setupTemp()
	updateTemp(true)
	updateTemp(true)
	updateTabFormats()
	updateTemp(true)
	loadVue()
	updateTemp()

	player.saveMenuOpen = false // Slight quality of life :)
}

function loadOptions() {
	let get2 = localStorage.getItem(modInfo.id+"_options")
	if (get2) 
		options = Object.assign(getStartOptions(), JSON.parse(decodeURIComponent(escape(atob(get2)))))
	else 
		options = getStartOptions()
	if (themes.indexOf(options.theme) < 0) theme = "default"
	fixData(options, getStartOptions())
}

function setupModInfo() {
	modInfo.changelog = changelog
	modInfo.winText = winText ? winText : `Congratulations! You have reached the end and beaten this game, but for now...`
}

function fixNaNs() {
	return NaNcheck(player)
}

function NaNcheck(data) {
	let curr = true
	for (item in data) {
		if (data[item] == null) {
		}
		else if (Array.isArray(data[item])) {
			curr = curr && NaNcheck(data[item])
		}
		else if (data[item] !== data[item] || checkDecimalNaN(data[item])) {
			if (!NaNalert) {
				clearInterval(interval)
				NaNalert = true
				alert("Invalid value found in player, named '" + item + "'. Please let the creator of this mod know! You can refresh the page, and you will be un-NaNed.")
				return false
			}
		}
		else if (data[item] instanceof Decimal) {
		}
		else if ((!!data[item]) && (data[item].constructor === Object)) {
			curr = curr && NaNcheck(data[item])
		}
	}
	return curr
}
function exportSave() {
	//if (NaNalert) return
	let str = btoa(JSON.stringify(player))

	const el = document.createElement("textarea")
	el.value = str
	document.body.appendChild(el)
	el.select()
	el.setSelectionRange(0, 99999)
	document.execCommand("copy")
	document.body.removeChild(el)
}

function importSave(imported = undefined, forced = false) {
	if (imported === undefined) imported = prompt("Paste your save here")
	try {
		let confirmString = "This save appears to be for a different mod! Are you sure you want to import?"
		if (CUSTOM_SAVES_IDS.includes(imported)) imported = CUSTOM_SAVES[imported]
		let x = atob(imported)
		console.log(x)
		tempPlr = Object.assign(getStartPlayer(), JSON.parse(atob(imported)));
		if (tempPlr.versionType != modInfo.id && !forced && !confirm(confirmString)) {
			// Wrong save (use "Forced" to force it to accept.)
			return ;
		}
			
		player = tempPlr;
		player.versionType = modInfo.id;
		fixSave();
		versionCheck();
		let notbugged = NaNcheck(player)
		if (!notbugged) return 
		save()
		loadSave(allSaves.set)
	} catch (e) {
		console.log(e)
		return;
	}
}

function versionCheck() {
	let setVersion = true;

	if (player.versionType === undefined || player.version === undefined) {
		player.versionType = modInfo.id;
		player.version = 0;
	}

	if (setVersion) {
		if (player.versionType == modInfo.id && VERSION.num > player.version) {
			player.keepGoing = false;
			if (fixOldSave)
				fixOldSave(player.version);
		}
		player.versionType = getStartPlayer().versionType;
		player.version = VERSION.num;
		player.beta = VERSION.beta;
	}
}

var saveInterval = setInterval(function () {
	if (player === undefined) return;
	if (tmp.gameEnded && !player.keepGoing) return;
	if (options.autosave) save();
}, 5000);

window.onbeforeunload = () => {
	if (player.autosave) {
		save();
	}
};

function startPlayerBase() {
	return {
		tab: layoutInfo.startTab,
		navTab: (layoutInfo.showTree ? layoutInfo.startNavTab : "none"),
		time: Date.now(),
		notify: {},
		versionType: modInfo.id,
		version: VERSION.num,
		beta: VERSION.beta,
		timePlayed: 0,
		keepGoing: false,
		hasNaN: false,

		points: modInfo.initialStartPoints,
		subtabs: {},
		lastSafeTab: (readData(layoutInfo.showTree) ? "none" : layoutInfo.startTab)
	};
}

function getStartPlayer() {
	playerdata = startPlayerBase();

	if (addedPlayerData) {
		extradata = addedPlayerData();
		for (thing in extradata)
			playerdata[thing] = extradata[thing];
	}

	playerdata.infoboxes = {};
	for (layer in layers) {
		playerdata[layer] = getStartLayerData(layer);

		if (layers[layer].tabFormat && !Array.isArray(layers[layer].tabFormat)) {
			playerdata.subtabs[layer] = {};
			playerdata.subtabs[layer].mainTabs = Object.keys(layers[layer].tabFormat)[0];
		}
		if (layers[layer].microtabs) {
			if (playerdata.subtabs[layer] == undefined)
				playerdata.subtabs[layer] = {};
			for (item in layers[layer].microtabs)
				playerdata.subtabs[layer][item] = Object.keys(layers[layer].microtabs[item])[0];
		}
		if (layers[layer].infoboxes) {
			if (playerdata.infoboxes[layer] == undefined)
				playerdata.infoboxes[layer] = {};
			for (item in layers[layer].infoboxes)
				playerdata.infoboxes[layer][item] = false;
		}
	}
	return playerdata;
}

function getStartLayerData(layer) {
	layerdata = {};
	if (layers[layer].startData) layerdata = layers[layer].startData();

	if (layerdata.unlocked === undefined) layerdata.unlocked = true;
	if (layerdata.total === undefined) layerdata.total = decimalZero;
	if (layerdata.best === undefined) layerdata.best = decimalZero;
	if (layerdata.resetTime === undefined) layerdata.resetTime = 0;
	if (layerdata.forceTooltip === undefined) layerdata.forceTooltip = false;

	layerdata.buyables = getStartBuyables(layer);
	if (layerdata.noRespecConfirm === undefined) layerdata.noRespecConfirm = false
	if (layerdata.clickables == undefined) layerdata.clickables = getStartClickables(layer);
	layerdata.spentOnBuyables = decimalZero;
	layerdata.upgrades = [];
	layerdata.milestones = [];
	layerdata.lastMilestone = null;
	layerdata.achievements = [];
	layerdata.challenges = getStartChallenges(layer);
	layerdata.grid = getStartGrid(layer);
	layerdata.prevTab = ""

	return layerdata;
}

function getStartBuyables(layer) {
	let data = {};
	if (layers[layer].buyables) {
		for (id in layers[layer].buyables)
			if (isPlainObject(layers[layer].buyables[id]))
				data[id] = decimalZero;
	}
	return data;
}

function getStartClickables(layer) {
	let data = {};
	if (layers[layer].clickables) {
		for (id in layers[layer].clickables)
			if (isPlainObject(layers[layer].clickables[id]))
				data[id] = "";
	}
	return data;
}

function getStartChallenges(layer) {
	let data = {};
	if (layers[layer].challenges) {
		for (id in layers[layer].challenges)
			if (isPlainObject(layers[layer].challenges[id]))
				data[id] = 0;
	}
	return data;
}
function getStartGrid(layer) {
	let data = {};
	if (! layers[layer].grid) return data
	if (layers[layer].grid.maxRows === undefined) layers[layer].grid.maxRows=layers[layer].grid.rows
	if (layers[layer].grid.maxCols === undefined) layers[layer].grid.maxCols=layers[layer].grid.cols

	for (let y = 1; y <= layers[layer].grid.maxRows; y++) {
		for (let x = 1; x <= layers[layer].grid.maxCols; x++) {
			data[100*y + x] = layers[layer].grid.getStartData(100*y + x)
		}
	}
	return data;
}

function fixSave() {
	defaultData = getStartPlayer();
	fixData(defaultData, player);

	for (layer in layers) {
		if (player[layer].best !== undefined)
			player[layer].best = new Decimal(player[layer].best);
		if (player[layer].total !== undefined)
			player[layer].total = new Decimal(player[layer].total);

		if (layers[layer].tabFormat && !Array.isArray(layers[layer].tabFormat)) {

			if (!Object.keys(layers[layer].tabFormat).includes(player.subtabs[layer].mainTabs))
				player.subtabs[layer].mainTabs = Object.keys(layers[layer].tabFormat)[0];
		}
		if (layers[layer].microtabs) {
			for (item in layers[layer].microtabs)
				if (!Object.keys(layers[layer].microtabs[item]).includes(player.subtabs[layer][item]))
					player.subtabs[layer][item] = Object.keys(layers[layer].microtabs[item])[0];
		}
	}
}

function fixData(defaultData, newData) {
	for (item in defaultData) {
		if (defaultData[item] == null) {
			if (newData[item] === undefined)
				newData[item] = null;
		}
		else if (Array.isArray(defaultData[item])) {
			if (newData[item] === undefined)
				newData[item] = defaultData[item];

			else
				fixData(defaultData[item], newData[item]);
		}
		else if (defaultData[item] instanceof Decimal) { // Convert to Decimal
			if (newData[item] === undefined)
				newData[item] = defaultData[item];

			else
				newData[item] = new Decimal(newData[item]);
		}
		else if ((!!defaultData[item]) && (typeof defaultData[item] === "object")) {
			if (newData[item] === undefined || (typeof defaultData[item] !== "object"))
				newData[item] = defaultData[item];

			else
				fixData(defaultData[item], newData[item]);
		}
		else {
			if (newData[item] === undefined)
				newData[item] = defaultData[item];
		}
	}
}