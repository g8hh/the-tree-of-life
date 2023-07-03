

var TAXONOMY_EFFECTS = {
        101:() => hasUpgrade("sp", 114) ? "IN<u>tes</u>tine gain per Nucleuses" : "nothing (currently)",
        102:() => hasUpgrade("sp", 141) ? "Organ gain per Token II" : "nothing (currently)",
        103:() => hasUpgrade("sp", 142) ? "all Energy buyable amount gain" : "nothing (currently)",
        104:() => hasUpgrade("sp", 143) ? "gene gain per Mastery Tokens" : "nothing (currently)",
        105:() => hasUpgrade("sp", 144) ? "Animal gain" : "nothing (currently)",
        106:() => hasUpgrade("sp", 145) ? "species gain per .02" : "nothing (currently)",
        107:() => hasUpgrade("sp", 151) ? "Energy gain per Nucleus*2" : "nothing (currently)",
        108:() => hasUpgrade("sp", 152) ? "Animal gain per Mastery Token/100" : "nothing (currently)",

        202:() => hasUpgrade("sp", 35) ? "to Bottom Quark base per .06" : "nothing (currently)",
        203:() => hasUpgrade("nu", 24) ? "Organ gain per Chromosomes" : "nothing (currently)",
        204:() => hasUpgrade("sp", 41) ? "in<u>tes</u>TINE gain per sqrt(Nucleuses)" : "nothing (currently)",
        205:() => hasUpgrade("sp", 42) ? "inTES<u>tine</u> gain per 8" : "nothing (currently)",
        206:() => hasUpgrade("sp", 43) ? "<u>in</u>tesTINE gain per sqrt(Token II)" : "nothing (currently)",
        207:() => hasUpgrade("sp", 44) ? "Contaminant gain per Nucleuses<sup>6</sup>" : "nothing (currently)",
        208:() => hasUpgrade("sp", 45) ? "DNA gain per Nucleuses<sup>9</sup>" : "nothing (currently)",

        303:() => hasUpgrade("ch", 41) ? "Organ gain per Nucleuses" : "nothing (currently)",
        304:() => hasUpgrade("ch", 35) ? "intes<u>TINE</u> gain" : "nothing (currently)",
        305:() => hasMilestone("ch", 21) ? "Contaminant gain per Chromosomes<sup>4</sup>" : "nothing (currently)",
        306:() => hasMilestone("an", 28) ? "Gene gain" : "nothing (currently)",
        307:() => hasMilestone("an", 39) ? "Tissue gain per Chromosomes<sup>3</sup>" : "nothing (currently)",
        308:() => hasMilestone("sp", 21) ? "Organ gain per Chromosome" : player.an.achActive[13] && hasAchievement("an", 13) || hasAchievement("an", 23) ? "Organ gain per Chromosome/17" : "nothing (currently)",

        404:() => hasMilestone("an", 23) ? "Energy gain per Chromosomes" : "nothing (currently)",
        405:() => hasUpgrade("ch", 21) ? "in<u>TES</u>tine gain per Chromosome upgrades" : "nothing (currently)",
        406:() => hasUpgrade("an", 41) ? "Cell gain per Carnivora II<sup>3</sup>" : "nothing (currently)",
        407:() => hasUpgrade("ch", 13) ? "<u>IN</u>testine gain per 7" : "nothing (currently)",
        408:() => hasUpgrade("ch", 11) ? "INtes<u>tine</u> gain" : "nothing (currently)",

        505:() => hasUpgrade("an", 22) ? "Air gain per Psittaciformes" : "nothing (currently)",
        506:() => hasUpgrade("an", 23) ? "Organ gain" : "nothing (currently)",
        507:() => hasUpgrade("an", 31) ? "<u>in</u>TEStine gain" : "nothing (currently)",
        508:() => hasMilestone("an", 22) ? "Animal gain per .01" : "nothing (currently)",

        606:() => hasUpgrade("an", 14) ? "Tissue gain per milestones<sup>2</sup>" : "nothing (currently)",
        607:() => hasUpgrade("an", 15) ? "Energy gain" : "nothing (currently)",
        608:() => hasUpgrade("an", 21) ? "Contaminant gain per Taxonomy levels" : "nothing (currently)",

        707:() => hasMilestone("an", 17) ? makeBlue("DB") + " gain" : "nothing (currently)",
        708:() => hasMilestone("an", 18) ? makePurple("OB") + " gain" : "nothing (currently)",

        808:() => hasMilestone("an", 16) ? "Air gain" : "nothing (currently)",
}

var TAXONOMY_NAMES = {
        101: "Eukaryote I",
        202: "Animalia I",
        303: "Chordata I",
        404: "Mammalia I",
        505: "Primates",
        606: "Hominidae",
        707: "Homo",
        808: "Sapien",
        102: "Eukaryote II",
        203: "Animalia II",
        304: "Chordata II",
        405: "Mammalia II",
        506: "Carnivora I",
        607: "Canidae",
        708: "Canis",
        103: "Eukaryote III",
        204: "Animalia III",
        305: "Chordata III",
        406: "Mammalia III",
        507: "Carnivora II",
        608: "Felidae",
        104: "Eukaryote IV",
        205: "Animalia IV",
        306: "Chordata IV",
        407: "Aves",
        508: "Psittaciformes",
        105: "Bacteria I",
        206: "Eubacteria I",
        307: "Proteobacteria I",
        408: "Gammaproteobacteria",
        106: "Bacteria II",
        207: "Eubacteria II",
        308: "Proteobacteria II",
        107: "Prokaryota I",
        208: "Archaebacteria",
        108: "Prokaryota II ",
}

var TAXONOMY_COSTS = {
        // [a,b,c] means the cost is a*b^(x^c)
        101: [new Decimal("1e253830"), new Decimal(1e250), new Decimal(1.1)],
        102: [new Decimal("1e713300"), new Decimal("1e999"), new Decimal(1.2)],
        103: [new Decimal("1e239930"), new Decimal("1e310"), new Decimal(1.2)],
        104: [new Decimal("1e622500"), new Decimal("1e2000"), new Decimal(1.3)],
        105: [new Decimal("1e1638000"), new Decimal("1e3000"), new Decimal(1.3)],
        106: [new Decimal("1e338170"), new Decimal("1e1000"), new Decimal(1.2)],
        107: [new Decimal("1e1011e3"), new Decimal("1e700"), new Decimal(1.2)],
        108: [new Decimal("1e330000"), new Decimal("1e500"), new Decimal(1.1)],

        202: [new Decimal("1e106090"), new Decimal(1e143), new Decimal(1.1)],
        203: [new Decimal("1e42884"), new Decimal(1e193), new Decimal(1.2)],
        204: [new Decimal("1e78004"), new Decimal(1e109), new Decimal(1.4)],
        205: [new Decimal("2e55367"), new Decimal(1e105), new Decimal(1.4)],
        206: [new Decimal("9e95030"), new Decimal(1e141), new Decimal(1.3)],
        207: [new Decimal("1e55504"), new Decimal(6e25), new Decimal(1.3)],
        208: [new Decimal("1e114301"), new Decimal("1e350"), new Decimal(1.1)],

        303: [new Decimal("1.2e2027"), new Decimal(1.5e10), new Decimal(1.1)],
        304: [new Decimal("1e2315"), new Decimal(1e20), new Decimal(1.3)],
        305: [new Decimal("1.7e4318"), new Decimal("7e335"), new Decimal(1.4)],
        306: [new Decimal("5.9e2513"), new Decimal(1e156), new Decimal(1.2)],
        307: [new Decimal("3.2e8292"), new Decimal(1.2e11), new Decimal(1.3)],
        308: [new Decimal("9.8e5766"), new Decimal(5e11), new Decimal(1.3)],

        404: [new Decimal("5e638"), new Decimal(1e15), new Decimal(1.1)],
        405: [new Decimal("5e799"), new Decimal(1e11), new Decimal(1.3)],
        406: [new Decimal("8e1068"), new Decimal(6e40), new Decimal(1.4)],
        407: [new Decimal("2.4e958"), new Decimal(2.5e11), new Decimal(1.3)],
        408: [new Decimal("1e1257"), new Decimal(90), new Decimal(1.1)],

        505: [new Decimal(1e108), new Decimal(300), new Decimal(1.1)],
        506: [new Decimal(1e123), new Decimal(2e4), new Decimal(1.2)],
        507: [new Decimal("6e467"), new Decimal(2.5e5), new Decimal(1.2)],
        508: [new Decimal(1e292), new Decimal(400), new Decimal(1.1)],

        606: [new Decimal(5e17), new Decimal(100), new Decimal(1.1)],
        607: [new Decimal(1e28), new Decimal(600), new Decimal(1.1)],
        608: [new Decimal(1e53), new Decimal(250), new Decimal(1.1)],

        707: [new Decimal(1e4), new Decimal(20), new Decimal(1.1)],
        708: [new Decimal(5e8), new Decimal(50), new Decimal(1.1)],
        
        808: [new Decimal(10), new Decimal(5), new Decimal(1.1)],
}


var TAXONOMY_COSTS_EXTREME = {
        303: [new Decimal("4e2675"), new Decimal(1e50), new Decimal(1.1)],
        304: [new Decimal("3e5722"), new Decimal(1e59), new Decimal(1.2)],
        305: [new Decimal("1.6e5842"), new Decimal(2e179), new Decimal(1.4)],
        306: [new Decimal("5e2672"), new Decimal(1e106), new Decimal(1.2)],
        307: [new Decimal("3.7e6524"), new Decimal(1e126), new Decimal(1.4)],
        308: [new Decimal("3e6275"), new Decimal(6.5e11), new Decimal(1.2)],

        404: [new Decimal("1e641"), new Decimal(3000), new Decimal(1.1)],
        405: [new Decimal("6.6e1107"), new Decimal(7e34), new Decimal(1.2)],
        406: [new Decimal("1.7e1344"), new Decimal(3e36), new Decimal(1.3)],
        407: [new Decimal("1.3e960"), new Decimal(9e8), new Decimal(1.2)],
        408: [new Decimal("7.6e1034"), new Decimal(2600), new Decimal(1.1)],

        505: [new Decimal(2.5e104), new Decimal(300), new Decimal(1.1)],
        506: [new Decimal(3e118), new Decimal(5e4), new Decimal(1.1)],
        507: [new Decimal("1.4e448"), new Decimal(2.5e5), new Decimal(1.1)],
        508: [new Decimal(5e232), new Decimal(400), new Decimal(1.1)],

        608: [new Decimal(1e56), new Decimal(250), new Decimal(1.1)],

        708: [new Decimal(5e7), new Decimal(50), new Decimal(1.1)],
}

function getTaxonomyCost(id){
        let init = getTaxonomyCostInit(id)
        if (hasMilestone("an", 21) && player.extremeMode && player.an.grid[508].buyables.gte(73)) {
                if (id == 606) init[0] = decimalOne
                if (id == 607 && player.an.grid[508].buyables.gte(74)) init[0] = decimalOne
                if (id == 608 && player.an.grid[508].buyables.gte(76)) init[0] = decimalOne
        }
        if (hasUpgrade("sci", 682) && player.an.genes.points.gte("4e548")) {
                if (id == 505) init[0] = decimalOne
        }
        return init
}

function getTaxonomyCostInit(id) {
        if (player.extremeMode && TAXONOMY_COSTS_EXTREME[id]) return TAXONOMY_COSTS_EXTREME[id]
        return TAXONOMY_COSTS[id]
}

var TAXONOMY_KEYS = [
        101, 102, 103, 104, 105, 106, 107, 108,
        202, 203, 204, 205, 206, 207, 208, 
        303, 304, 305, 306, 307, 308, 
        404, 405, 406, 407, 408, 
        505, 506, 507, 508, 
        606, 607, 608, 
        707, 708, 
        808]

function taxonomyLowerText(){
        let a = "Gene gain is <b>Sapien</b> amount plus 1,<br>and amount gain is 2<sup><b>levels</b></sup>-1, multiplied by above<sup>*</sup> amounts plus 1."
        if (player.ch.unlocked) {
                a = a.replace("2", "(Chromosome effect)")
        }
        let b = "Amounts and gene amount decays by PC per second due to genetic cross contamination."
        let pc = "1%"
        if (hasMilestone("an", 19)) pc = "5%"
        if (hasMilestone("an", 20)) pc = "25%"
        if (hasMilestone("ch", 1))  pc = player.extremeMode && player.ch.points.gte(2) ? "39%" : "33%"
        if (hasMilestone("ch", 2))  pc = player.extremeMode ? "42%" : "39%"
        if (hasMilestone("ch", 4))  pc = "75%"
        if (hasMilestone("an", 22)) pc = "100%"
        if (hasMilestone("sp", 1) && player.ch.points.lt(11)) pc = "1%"
        b = b.replace("PC", pc)
        let part1 = a + br2 + b + br + "Press shift to bulk buy 5x. The buyable in light blue is the cheapest." + br
        if (!player.sp.unlocked) return part1
        return part1 + br + "The number of Chromosomes in amount effects is maxed at 5000."
}

function updateTaxonomyAmounts(diff) {
        let data = player.an
        
        let getLevels = function(id){
                return player.an.grid[id].buyables
        }
        let getExtras = function(id){
                return player.an.grid[id].extras
        }
        // id-101 and id-100 affect id
        let contamRate = .01
        if (hasMilestone("an", 19))                             contamRate = .05
        if (hasMilestone("an", 20))                             contamRate = .25
        if (hasMilestone("ch", 1))                              contamRate = player.extremeMode && player.ch.points.gte(2) ? .39 : .33
        if (hasMilestone("ch", 2))                              contamRate = hasMilestone("ch", 2) ? .42 : .39
        if (hasMilestone("ch", 4))                              contamRate = .75
        if (hasMilestone("an", 22))                             contamRate = 1
        if (hasMilestone("sp", 1) && player.ch.points.lt(11))   contamRate = .01

        data.genes.best = data.genes.best.max(data.genes.points)
        data.genes.points = getLogisticAmount(data.genes.points, tmp.an.gene.getResetGain, contamRate, diff)

        let spExp = [0, 0, 0, 0, 0, 0, 0, 0, 0] // 9 0's
        
        if (hasUpgrade("sp", 22)) spExp[8] = getLevels(808).div(hasUpgrade("sp", 122) ? 2 : hasUpgrade("sp", 72) ? 8 : 15)
        if (hasUpgrade("sp", 23)) spExp[7] = player.ch.points.plus(10).pow(hasUpgrade("sp", 123) ? .65 : hasUpgrade("sp", 73) ? .6 : .5)
        if (hasUpgrade("sp", 24)) spExp[6] = player.nu.points.plus(8).pow(hasUpgrade("sp", 124) ? .96 : hasUpgrade("sp", 74) ? .7 : 1/3)
        if (hasUpgrade("sp", 25)) spExp[5] = hasUpgrade("sp", 125) ? player.sp.upgrades.length + player.tokens.upgrades.length : hasUpgrade("sp", 75) ? player.sp.upgrades.length : new Decimal(player.sp.times).min(hasMilestone("nu", 21) ? 222 : 22).plus(3).sqrt()
        if (hasUpgrade("sp", 31)) spExp[4] = player.nu.points.div(hasUpgrade("sp", 131) ? 7 : hasUpgrade("sp", 81) ? 20 : 50)
        if (hasUpgrade("sp", 32)) spExp[3] = player.ch.points.max(1).log(2).div(hasUpgrade("sp", 132) ? 1 : hasUpgrade("sp", 82) ? 2 : 25)
        if (hasUpgrade("sp", 33)) spExp[2] = player.tokens.tokens2.total.max(1).log10().div(hasUpgrade("sp", 133) ? 1 : hasUpgrade("sp", 83) ? 4 : 25)
        
        let layerEff = [decimalOne, decimalOne, decimalOne, decimalOne, decimalOne, decimalOne, decimalOne, decimalOne, decimalOne] // 9 0's
        for (let i = 1; i <= 8; i ++) {
                layerEff[i] = tmp.sp.effect.pow(spExp[i]).times(tmp.e.effect)
        }

        for (i in TAXONOMY_KEYS) {
                let id = TAXONOMY_KEYS[i]

                let gain = Decimal.pow(tmp.ch.effect, getLevels(id)).sub(1)
                if (id > 200) gain = gain.times(getExtras(id-100).plus(1)).times(getExtras(id-101).plus(1))
                if ((data.achActive[12] || hasMilestone("ch", 16)) && hasAchievement("an", 12) && player.ch.points.gte(180)) {
                        let exp = (data.achActive[22] || hasUpgrade("ch", 41)) && hasAchievement("an", 22) ? 1.25 : 1
                        gain = gain.times(getLevels(id).pow(exp).plus(2).log(2))
                }
                if (id > 700) {
                        let ret = tmp.sci.buyables[622].main_effect
                        if (ret.gte(1e10) && !hasUpgrade("sci", 663)) ret = ret.log10().pow(10)
                        gain = gain.times(ret)
                }
                if (id > 400) {
                        let ret = Decimal.pow(1.01, tmp.sci.buyables[623].effect)
                        if (hasUpgrade("or", 45) && id < 500) ret = ret.root(4)
                        gain = gain.times(ret)
                } else if (id > 300 && hasMilestone("an", 28)) {
                        let ret = Decimal.pow(1.01, tmp.sci.buyables[623].effect.sqrt())
                        gain = gain.times(ret)
                }
                gain = gain.times(layerEff[Math.floor(id/100)])

                if (hasUpgrade("pl", 14))       gain = gain.pow(1.001)
                if (player.extremeMode)         gain = gain.pow(.75)
                if (hasUpgrade("sci", 661))     gain = gain.pow(tmp.sci.upgrades[661].effect)

                if (hasAchievement("an", 33)) {
                        data.grid[id].extras = gain
                } else {
                        data.grid[id].extras = getLogisticAmount(player.an.grid[id].extras, gain, contamRate, diff)
                }
        }
}


