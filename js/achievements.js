function getColRowCode(det, base = 7){
        let tens = Math.floor((det-1)/base) + 1
        let extra = det % base == 0 ? base : det % base
        return 10 * tens + extra
}

function getNumberName(n){ //currently only works up to 100
        if (n < 100) return getNumberNameLT100(n)
        if (n < 1000) {
                if (n % 100 == 0) return getNumberNameLT100(n / 100) + " Hundred"
                let hun = getNumberName(Math.floor(n / 100)) + " Hundred and "
                return hun + getNumberNameLT100(n % 100)
        }
}

function getNumberNameLT100(n){
        let units = {
                1: "One",
                2: "Two",
                3: "Three",
                4: "Four",
                5: "Five",
                6: "Six",
                7: "Seven",
                8: "Eight",
                9: "Nine",
        }
        let tens = {
                2: "Twenty",
                3: "Thirty",
                4: "Forty",
                5: "Fifty",
                6: "Sixty",
                7: "Seventy",
                8: "Eighty",
                9: "Ninety",
        }
        let forced = {
                10: "Ten",
                11: "Eleven",
                12: "Twelve",
                13: "Thirteen",
                14: "Fourteen",
                15: "Fifteen",
                16: "Sixteen",
                17: "Seventeen",
                18: "Eighteen", 
                19: "Nineteen",
        }
        if (forced[n] != undefined) return forced[n]
        if (n == 0) return "Zero"
        if (n % 10 == 0) return tens[n/10]
        if (n < 10) return units[n]
        return tens[Math.floor(n/10)] + "-" + units[n % 10].toLowerCase()
}

function getAchStuffFromNumber(n){
        let name = getNumberName(n)
        let done = function(){
                return hasAchievement("ach", getColRowCode(n)) || PROGRESSION_MILESTONES[n]() 
        }
        let tooltip = function(){
                return "Get " + PROGRESSION_MILESTONES_TEXT[n]
        }
        let unlocked 
        if (n <= 53) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return true
                }
        } else if (n <= 98) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return hasMilestone("goalsii", 7) || player.g.best.gt(0) || hasUnlockedPast("g")
                }
        } else if (n <= 119) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return hasUnlockedPast("g")
                }
        } else if (n <= 154) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return hasUnlockedPast("i")
                }
        } else if (n <= 266) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return hasUnlockedPast("j")
                }
        } else if (n <= 280) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return hasUnlockedPast("k")
                }
        } else if (n <= 336) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return hasUnlockedPast("l")
                }
        } else if (n <= Infinity) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return hasUpgrade("m", 23) || hasUnlockedPast("m")
                }
        } 
        return {name: name, done: done, tooltip: tooltip, unlocked: unlocked}
}

function getFirstNAchData(n){
        let obj = {}
        for (i = 1; i <= n; i++){
                obj[getColRowCode(i)] = getAchStuffFromNumber(i)
        }
        obj.rows = Math.ceil(n / 7)
        obj.cols = 7
        return obj
}

function hasCompletedFirstNRows(n){
	for (i = 1; i <= n; i++){
		for (j = 1; j <= 7; j++){
			x = String(i) + String(j)
			if (layers.ach.achievements[x] == undefined) return false
			if (!hasAchievement("ach", x)) return false
		}
	}
	return true
}

PROGRESSION_MILESTONES = {
        1:   () => player.h.points.root(1).gte(20),
        2:   () => player.h.points.root(2).gte(20),
        3:   () => player.h.points.root(3).gte(20),
        4:   () => player.h.deuterium.points.gte(Decimal.pow(100, 0)),
        5:   () => player.h.deuterium.points.gte(Decimal.pow(100, 1)),
        6:   () => player.h.atomic_hydrogen.points.div(5).gte(Decimal.pow(100, 0)),
        7:   () => player.h.atomic_hydrogen.points.div(5).gte(Decimal.pow(100, 1)),
        8:   () => player.h.deuterium.points.gte(Decimal.pow(100, 2)),
        9:   () => player.h.deuterium.points.gte(Decimal.pow(100, 3)),
        10:  () => player.h.atomic_hydrogen.points.div(5).gte(Decimal.pow(100, 2)),
        11:  () => player.h.atomic_hydrogen.points.div(5).gte(Decimal.pow(100, 3)),
        12:  () => player.h.points.root(7).gte(10),
        13:  () => player.h.points.root(11).gte(10),
        14:  () => player.h.points.root(15).gte(10),
}

PROGRESSION_MILESTONES_TEXT = {
        1:   "Twenty Hydrogen",
        2:   "Four Hundred Hydrogen",
        3:   "Eight Thousand Hydrogen",
        4:   "One Dueterium",
        5:   "One Hundred Dueterium",
        6:   "Five Atomic Hydrogen",
        7:   "Five Hundred Atomic Hydrogen",
        8:   "Ten Thousand Dueterium",
        9:   "One Million Dueterium",
        10:  "Fifty Thousand Atomic Hydrogen",
        11:  "Five Million Atomic Hydrogen",
        12:  "Ten Million Hydrogen",
        13:  "One Hundred Billion Hydrogen",
        14:  "10^15 Hydrogen",
}









