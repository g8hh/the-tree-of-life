function getColRowCode(det, base = 7){
        let tens = Math.floor((det-1)/base) + 1
        let extra = det % base == 0 ? base : det % base
        return 10 * tens + extra
}

function getNumberName(n){ //currently only works up to 1000
        if (n < 100) return getNumberNameLT100(n)
        if (n < 1000) {
                if (n % 100 == 0) return getNumberNameLT100(n / 100) + " Hundred"
                let hun = getNumberNameLT100(Math.floor(n / 100)) + " Hundred and "
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
                        return player.tokens.total.gt(0) || tmp.n.layerShown
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
        64:  () => player.tokens.total.gt(7),
        65:  () => player.tokens.total.gt(8),
        66:  () => player.tokens.total.gt(9),
        67:  () => player.tokens.total.gt(10),
        68:  () => player.tokens.total.gt(11),
        69:  () => player.tokens.total.gt(12),
        70:  () => player.tokens.total.gt(13),
        71:  () => player.tokens.total.gt(14),
        72:  () => player.tokens.total.gt(15),
        73:  () => player.tokens.total.gt(16),
        74:  () => player.tokens.total.gt(17),
        75:  () => player.tokens.total.gt(18),
        76:  () => player.tokens.total.gt(19),
        77:  () => player.tokens.total.gt(20),
        78:  () => player.tokens.total.gt(21),
        79:  () => player.tokens.total.gt(22),
        80:  () => player.tokens.total.gt(23),
        81:  () => player.tokens.total.gt(24),
        82:  () => player.tokens.total.gt(25),
        83:  () => player.tokens.total.gt(26),
        84:  () => player.tokens.total.gt(27),
        85:  () => player.tokens.total.gt(28),
        86:  () => player.tokens.total.gt(29),
        87:  () => player.tokens.total.gt(30),
        88:  () => player.tokens.total.gt(31),
        89:  () => player.tokens.total.gt(32),
        90:  () => player.tokens.total.gt(33),
        91:  () => player.tokens.total.gt(34),
        92:  () => player.tokens.total.gt(35),
        93:  () => player.tokens.total.gt(36),
        94:  () => player.tokens.total.gt(37),
        95:  () => player.tokens.total.gt(38),
        96:  () => player.tokens.total.gt(39),
        97:  () => player.tokens.total.gt(40),
        98:  () => player.tokens.total.gt(41),
        99:  () => player.tokens.total.gt(42),
        100: () => player.tokens.total.gt(43),
        101: () => player.tokens.total.gt(44),
        102: () => player.tokens.total.gt(45),
        103: () => player.tokens.total.gt(46),
        104: () => player.tokens.total.gt(47),
        105: () => player.tokens.total.gt(48),
        106: () => player.tokens.total.gt(49),
        107: () => player.tokens.total.gt(50),
        108: () => player.tokens.total.gt(51),
        109: () => player.tokens.total.gt(52),
        110: () => player.tokens.total.gt(53),
        111: () => player.tokens.total.gt(54),
        112: () => player.tokens.total.gt(55),
        113: () => player.tokens.total.gt(56),
        114: () => player.tokens.total.gt(57),
        115: () => player.tokens.total.gt(58),
        116: () => player.tokens.total.gt(59),
        117: () => player.tokens.total.gt(60),
        118: () => player.tokens.total.gt(61),
        119: () => player.tokens.total.gt(62),
        120: () => player.tokens.total.gt(63),
        121: () => player.tokens.total.gt(64),
        122: () => player.tokens.total.gt(65),
        123: () => player.tokens.total.gt(66),
        124: () => player.tokens.total.gt(67),
        125: () => player.tokens.total.gt(68),
        126: () => player.tokens.total.gt(69),
        127: () => player.tokens.total.gt(70),
        128: () => player.tokens.total.gt(71),
        129: () => player.tokens.total.gt(72),
        130: () => player.tokens.total.gt(73),
        131: () => player.tokens.total.gt(74),
        132: () => player.tokens.total.gt(75),
        133: () => player.tokens.total.gt(76),
        134: () => player.tokens.total.gt(77),
        135: () => player.tokens.total.gt(78),
        136: () => player.tokens.total.gt(79),
        137: () => player.tokens.total.gt(80),
        138: () => player.tokens.total.gt(81),
        139: () => player.tokens.total.gt(82),
        140: () => player.tokens.total.gt(83),
        141: () => player.n.points.max(10).log10().gt(7),
        142: () => player.n.points.max(10).log10().gt(10),
        143: () => player.n.points.max(10).log10().gt(15),
        144: () => player.n.points.max(10).log10().gt(20),
        145: () => player.n.points.max(10).log10().gt(27),
        146: () => player.n.points.max(10).log10().gt(35),
        147: () => player.n.points.max(10).log10().gt(45),
        148: () => player.tokens.total.gt(84),
        149: () => player.tokens.total.gt(85),
        150: () => player.tokens.total.gt(86),
        151: () => player.tokens.total.gt(87),
        152: () => player.tokens.total.gt(88),
        153: () => player.tokens.total.gt(89),
        154: () => player.tokens.total.gt(90),
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
        64:  "8 tokens",
        65:  "9 tokens",
        66:  "10 tokens",
        67:  "11 tokens",
        68:  "12 tokens",
        69:  "13 tokens",
        70:  "14 tokens",
        71:  "15 tokens",
        72:  "16 tokens",
        73:  "17 tokens",
        74:  "18 tokens",
        75:  "19 tokens",
        76:  "20 tokens",
        77:  "21 tokens",
        78:  "22 tokens",
        79:  "23 tokens",
        80:  "24 tokens",
        81:  "25 tokens",
        82:  "26 tokens",
        83:  "27 tokens",
        84:  "28 tokens",
        85:  "29 tokens",
        86:  "30 tokens",
        87:  "31 tokens",
        88:  "32 tokens",
        89:  "33 tokens",
        90:  "34 tokens",
        91:  "35 tokens",
        92:  "36 tokens",
        93:  "37 tokens",
        94:  "38 tokens",
        95:  "39 tokens",
        96:  "40 tokens",
        97:  "41 tokens",
        98:  "42 tokens",
        99:  "43 tokens",
        100: "44 tokens",
        101: "45 tokens",
        102: "46 tokens",
        103: "47 tokens",
        104: "48 tokens",
        105: "49 tokens",
        106: "50 tokens",
        107: "51 tokens",
        108: "52 tokens",
        109: "53 tokens",
        110: "54 tokens",
        111: "55 tokens",
        112: "56 tokens",
        113: "57 tokens",
        114: "58 tokens",
        115: "59 tokens",
        116: "60 tokens",
        117: "61 tokens",
        118: "62 tokens",
        119: "63 tokens",
        120: "64 tokens",
        121: "65 tokens",
        122: "66 tokens",
        123: "67 tokens",
        124: "68 tokens",
        125: "69 tokens",
        126: "70 tokens",
        127: "71 tokens",
        128: "72 tokens",
        129: "73 tokens",
        130: "74 tokens",
        131: "75 tokens",
        132: "76 tokens",
        133: "77 tokens",
        134: "78 tokens",
        135: "79 tokens",
        136: "80 tokens",
        137: "81 tokens",
        138: "82 tokens",
        139: "83 tokens",
        140: "84 tokens",
        141: "10^7 Nitrogen",
        142: "10^10 Nitrogen",
        143: "10^15 Nitrogen",
        144: "10^20 Nitrogen",
        145: "10^27 Nitrogen",
        146: "10^35 Nitrogen",
        147: "10^45 Nitrogen",
        148: "85 tokens",
        149: "86 tokens",
        150: "87 tokens",
        151: "88 tokens",
        152: "89 tokens",
        153: "90 tokens",
        154: "91 tokens",
}









