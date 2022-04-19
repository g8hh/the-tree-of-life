function getNextLeftTab(layer){
	let l = getUnlockedSubtabs(layer)
	let id = l.indexOf(player.subtabs[layer].mainTabs)
	if (id == -1) return l[0]
	if (id == 0) return l[l.length-1]
	return l[id - 1]
}

function getUnlockedSubtabs(layer){
	let l = Object.keys(layers[layer].tabFormat)
	let n = []
	for (i in l) {
		j = l[i]
		let tempportion = tmp[layer].tabFormat[j].unlocked
		if (tempportion || layers[layer].tabFormat[j].unlocked == undefined) n.push(j)
	}
	return n
}

function getNextRightTab(layer){
	let l = getUnlockedSubtabs(layer)
	let id = l.indexOf(player.subtabs[layer].mainTabs)
	if (id == -1) return l[0]
	if (id == l.length-1) return l[0]
	return l[id + 1]
}

function fixHotkeyCode(s){
	if (s.length == 1) return s.toLowerCase()
	s = replaceString(s, "Shift", "shift")
	s = replaceString(s, "]", "}")
	s = replaceString(s, "[", "{")
	s = replaceString(s, ",", "<")
	s = replaceString(s, ".", ">")
	s = replaceString(s, "0", ")")
	s = replaceString(s, "1", "!")
	s = replaceString(s, "2", "@")
	s = replaceString(s, "3", "#")
	s = replaceString(s, "4", "$")
	s = replaceString(s, "5", "%")

	return s
}

function getDescriptionFromKey(id){
        let d = id.description
        
        if (isFunction(d)) return d()
        return d
}

var logHotkey = false
var qForClear = false

document.onkeydown = function(e) {
	if (player === undefined) return;
	if (tmp.gameEnded && !player.keepGoing) return;
	if (onFocused) return
	let key = e.key
	if (controlDown) key = "Control+" + key.toUpperCase()
	if (shiftDown) key = "shift+" + key
	if (e.ctrlKey && hotkeys[key]) e.preventDefault()

	if (hotkeys[key] != undefined && player[hotkeys[key].layer].unlocked) {
		hotkeys[key].onPress()
	}
	key += "ALT" // try again with ALT at the end
	if (hotkeys[key] != undefined && player[hotkeys[key].layer].unlocked) {
		hotkeys[key].onPress()
	}

	if (logHotkey) console.log(key)
	if (key == "q" && qForClear) clearInterval(interval)
}

