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
        if (n <= 56) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return true
                }
        } else if (n <= 1111) {
                unlocked = function(){
                        if (player.ach.hiddenRows >= n/7) return false
                        return player.tokens.total.gt(0)
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
        15:  () => player.h.points.root(22).gte(10),
        16:  () => player.h.points.root(30).gte(10),
        17:  () => player.h.points.root(42).gte(10),
        18:  () => player.h.points.root(56).gte(10),
        19:  () => player.h.points.root(77).gte(10),
        20:  () => player.h.points.root(101).gte(10),
        21:  () => player.h.points.root(135).gte(10),
        22:  () => player.h.points.root(176).gte(10),
        23:  () => player.h.points.root(231).gte(10),
        24:  () => player.h.points.root(297).gte(10),
        25:  () => player.h.points.root(385).gte(10),
        26:  () => player.h.points.root(490).gte(10),
        27:  () => player.h.points.root(627).gte(10),
        28:  () => player.h.points.root(792).gte(10),
        29:  () => player.c.points.root(1).gte(10),
        30:  () => player.c.points.root(2).gte(10),
        31:  () => player.c.points.root(3).gte(10),
        32:  () => player.c.points.root(4).gte(10),
        33:  () => player.c.points.root(5).gte(10),
        34:  () => player.c.points.root(6).gte(10),
        35:  () => player.c.points.root(7).gte(10),
        36:  () => player.o.points.root(1).gte(10),
        37:  () => player.o.points.root(2).gte(10),
        38:  () => player.o.points.root(3).gte(10),
        39:  () => player.o.points.root(4).gte(10),
        40:  () => player.o.points.root(5).gte(10),
        41:  () => player.o.points.root(6).gte(10),
        42:  () => player.o.points.root(7).gte(10),
        43:  () => player.c.points.root(9).gte(10),
        44:  () => player.c.points.root(12).gte(10),
        45:  () => player.c.points.root(15).gte(10),
        46:  () => player.c.points.root(18).gte(10),
        47:  () => player.c.points.root(21).gte(10),
        48:  () => player.c.points.root(24).gte(10),
        49:  () => player.c.points.root(27).gte(10),
        50:  () => player.o.points.root(9).gte(10),
        51:  () => player.o.points.root(12).gte(10),
        52:  () => player.o.points.root(15).gte(10),
        53:  () => player.o.points.root(18).gte(10),
        54:  () => player.o.points.root(21).gte(10),
        55:  () => player.o.points.root(24).gte(10),
        56:  () => player.o.points.root(27).gte(10),
        57:  () => player.tokens.total.gt(0),
        58:  () => player.tokens.total.gt(1),
        59:  () => player.tokens.total.gt(2),
        60:  () => player.tokens.total.gt(3),
        61:  () => player.tokens.total.gt(4),
        62:  () => player.tokens.total.gt(5),
        63:  () => player.tokens.total.gt(6),
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
        15:  "10^22 Hydrogen",
        16:  "10^30 Hydrogen",
        17:  "10^42 Hydrogen",
        18:  "10^56 Hydrogen",
        19:  "10^77 Hydrogen",
        20:  "10^101 Hydrogen",
        21:  "10^135 Hydrogen",
        22:  "10^176 Hydrogen",
        23:  "10^231 Hydrogen",
        24:  "10^297 Hydrogen",
        25:  "10^385 Hydrogen",
        26:  "10^490 Hydrogen",
        27:  "10^627 Hydrogen",
        28:  "10^792 Hydrogen",
        29:  "10^1 Carbon",
        30:  "10^2 Carbon",
        31:  "10^3 Carbon",
        32:  "10^4 Carbon",
        33:  "10^5 Carbon",
        34:  "10^6 Carbon",
        35:  "10^7 Carbon",
        36:  "10^1 Oxygen",
        37:  "10^2 Oxygen",
        38:  "10^3 Oxygen",
        39:  "10^4 Oxygen",
        40:  "10^5 Oxygen",
        41:  "10^6 Oxygen",
        42:  "10^7 Oxygen",
        43:  "10^9 Carbon",
        44:  "10^12 Carbon",
        45:  "10^15 Carbon",
        46:  "10^18 Carbon",
        47:  "10^21 Carbon",
        48:  "10^24 Carbon",
        49:  "10^27 Carbon",
        50:  "10^9 Oxygen",
        51:  "10^12 Oxygen",
        52:  "10^15 Oxygen",
        53:  "10^18 Oxygen",
        54:  "10^21 Oxygen",
        55:  "10^24 Oxygen",
        56:  "10^27 Oxygen",
        57:  "a token",
        58:  "2 tokens",
        59:  "3 tokens",
        60:  "4 tokens",
        61:  "5 tokens",
        62:  "6 tokens",
        63:  "7 tokens",
}









