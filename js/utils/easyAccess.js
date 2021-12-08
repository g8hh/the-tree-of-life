/* UPGRADE STUFF */
function hasUpgrade(layer, id) {
	return (player[layer].upgrades.includes(toNumber(id)) || player[layer].upgrades.includes(id.toString())) && !tmp[layer].deactivated
}

function hasUpg(layer, id){
	return hasUpgrade(layer, id)
}

function upgradeEffect(layer, id) {
	return tmp[layer].upgrades[id].effect
}

function getUpgradeEffect(layer, id) {
	return upgradeEffect(layer, id)
}

/* MILESTONE STUFF */

function hasMilestone(layer, id) {
	return (player[layer].milestones.includes(toNumber(id)) || player[layer].milestones.includes(id.toString())) && !tmp[layer].deactivated
}

function hasMile(layer, id) {
	return hasMilestone(layer, id)
}

function milestoneEffect(layer, id) {
	return tmp[layer].milestones[id].effect
}

function getMilestoneEffect(layer, id) {
	return tmp[layer].milestones[id].effect
}

/* ACHIEVEMENT STUFF */

function hasAchievement(layer, id) {
	return (player[layer].achievements.includes(toNumber(id)) || player[layer].achievements.includes(id.toString())) && !tmp[layer].deactivated
}

function hasAch(layer, id){
	return hasAchievement(layer, id)
}

function achievementEffect(layer, id) {
	return tmp[layer].achievements[id].effect
}

function getAchievementEffect(layer, id) {
	return tmp[layer].achievements[id].effect
}

/* CHALLENGE STUFF */

function hasChallenge(layer, id) {
	return player[layer].challenges[id] && !tmp[layer].deactivated
}

function maxedChallenge(layer, id) {
	return (player[layer].challenges[id] >= tmp[layer].challenges[id].completionLimit) && !tmp[layer].deactivated
}

function challengeCompletions(layer, id) {
	return player[layer].challenges[id]
}

function challengeEffect(layer, id) {
	return tmp[layer].challenges[id].rewardEffect
}

/* BUYABLE STUFF */

function getBuyableAmount(layer, id) {
	return player[layer].buyables[id]
}

function setBuyableAmount(layer, id, amt) {
	player[layer].buyables[id] = amt
}

function addBuyables(layer, id, amt) {
	player[layer].buyables[id] = player[layer].buyables[id].add(amt)
}

function buyableEffect(layer, id) {
	return tmp[layer].buyables[id].effect
}

function getBuyableEffect(layer, id) {
	return buyableEffect(layer, id)
}

function getBuyableCost(layer, id){
	return tmp[layer].buyables[id].cost
}

function getBuyableBase(layer, id){
	return tmp[layer].buyables[id].base
}

/* CLICKABLE STUFF */

function getClickableState(layer, id) {
	return (player[layer].clickables[id])
}

function setClickableState(layer, id, state) {
	player[layer].clickables[id] = state
}

function clickableEffect(layer, id) {
	return tmp[layer].clickables[id].effect
}

/* GRID STUFF */

function getGridData(layer, id) {
	return (player[layer].grid[id])
}

function setGridData(layer, id, data) {
	player[layer].grid[id] = data
}

function gridEffect(layer, id) {
	return gridRun(layer, 'getEffect', player[layer].grid[id], id)
}




