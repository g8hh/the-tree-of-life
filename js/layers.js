function getPointGen() {
	let gain = new Decimal(.1)
        if (hasUpgrade("h", 11))        gain = gain.times(tmp.h.upgrades[11].effect)
        if (hasUpgrade("h", 22))        gain = gain.times(tmp.h.upgrades[22].effect)
        if (hasUpgrade("h", 34))        gain = gain.times(tmp.h.upgrades[13].effect)
                                        gain = gain.times(tmp.mini.buyables[61].effect)
        if (hasUpgrade("o", 15))        gain = gain.times(tmp.o.upgrades[15].effect)
        if (hasUpgrade("h", 61))        gain = gain.times(tmp.h.upgrades[61].effect)
                                        gain = gain.times(tmp.tokens.buyables[11].effect)
                                        gain = gain.times(tmp.n.effect)

        if (hasUpgrade("h", 25))        gain = gain.pow(tmp.h.upgrades[25].effect)
        if (hasUpgrade("o", 13))        gain = gain.pow(tmp.o.upgrades[13].effect)
                                        gain = gain.pow(tmp.tokens.buyables[41].effect)
        if (hasUpgrade("n", 11))        gain = gain.pow(1.001)

	return gain
}

var TOKEN_COSTS = [   6390,    7587,    7630,    8160,    8350, 
                      9350,   10000,   10860,   11230,   12600,
                     14460,   15170,   15430,   19780,   24000,
                     30710,   33260,   33444,   42900,   45420,
                     45800,   50600,   60000,   80308,   88020,
                     94500,  101570,  113575,  135666,  136290,
                    139530,  140140,  140750,  176444,  177720,
                    205125,  226800,  259560,  296740,  297910,
                    335080,  336363,  357900,  398888,  405900,
                    433950,  445000,  462700,  467500,  542000,
                    692000,  774000,  793000,  1084e3,  1366e3,
                    1810e3, 18697e2,  1996e3,  2044e3, 23519e2,
                    3805e3,  4666e3,  5338e3,  9499e3,  9859e3,
                   11518e3, 13127e3, 13539e3, 14553e3, 15542e3,
                   16455e3, 20892e3, 23072e3, 28491e3, 34256e3,
                   60576e3, 91049e3, 11858e4, 12317e4, 13287e4,
                   13793e4, 18750e4, 40300e4, 91919e4, 10000e5,
                   24380e5, 29250e5,
                ]/*1e6-1,*/

function makeRed(c){
        return "<bdi style='color:#CC0033'>" + c + "</bdi>"
}

function makeBlue(c){
        return "<bdi style='color:#3379E3'>" + c + "</bdi>"
}
                                                                                                                                                                                                                                                                        
function filter(list, keep){
        return list.filter(x => keep.includes(x))
}

function filterOut(list, out){
        return list.filter(x => !out.includes(x))
}

function sumValsExp(exp){
        a = new Decimal(0)
        b = 0
        while (a.lte(player.tokens.total) && b < 100){
                a = a.plus(Decimal.pow(b,exp).floor())
                b += 1
        }
        return [b - 1, a.toNumber()]
}

addLayer("h", {
        name: "Hydrogen", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "H", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: false,
		points: new Decimal(0),
                best: new Decimal(0),
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
                deuterium: {
                        points: new Decimal(0),
                        best: new Decimal(0),
                },
                atomic_hydrogen: {
                        points: new Decimal(0),
                        best: new Decimal(0),
                },
        }},
        color: "#646400",
        branches: [],
        requires: new Decimal(0), // Can be a function that takes requirement increases into account
        resource: "Hydrogen", // Name of prestige currency
        baseResource: "Life Points", // Name of resource prestige is based on
        baseAmount() {return player.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                let base = player.points.ln().min(tmp.h.getDefaultMaximum)
                let mult = tmp.h.getGainMult

                let ret = base.times(mult)

                ret = ret.pow(tmp.tokens.buyables[42].effect)
                if (hasUpgrade("n", 11)) ret = ret.pow(1.001)

                return ret
        },
        getNextAt(){
                return new Decimal(0)
        },
        getLossRate() { //hydrogen loss
                let ret = new Decimal(.01)
                if (hasUpgrade("h", 21)) ret = ret.plus(.0002)
                if (hasUpgrade("h", 31)) ret = ret.plus(.001)
                if (hasUpgrade("h", 35)) ret = ret.sub( .0012)

                if (hasUpgrade("n", 32)) ret = ret.times(100)

                return ret
        },
        getGainMult(){
                let x = new Decimal(1)

                if (hasUpgrade("h", 13))        x = x.times(tmp.h.upgrades[13].effect)
                if (hasUpgrade("h", 22))        x = x.times(tmp.h.upgrades[22].effect)
                                                x = x.times(tmp.mini.buyables[42].effect)
                                                x = x.times(tmp.mini.buyables[63].effect)
                                                x = x.times(tmp.tokens.buyables[12].effect)
                if (hasUpgrade("o", 21))        x = x.times(player.o.points.max(1).min("e2.2e11"))
                                                x = x.times(tmp.n.effect)

                return x
        },
        getDefaultMaximum(){
                let ret = new Decimal(4)
                if (hasUpgrade("h", 12)) ret = ret.plus(tmp.h.upgrades[12].effect)
                return ret
        },
        update(diff){
                let data = player.h
                let deut = data.deuterium
                let atmc = data.atomic_hydrogen
                if (data.best.gt(0)) data.unlocked = true
                data.best = data.best.max(data.points)
                deut.best = deut.best.max(deut.points)
                atmc.best = atmc.best.max(atmc.points)
                
                // do hydrogen gain
                data.points = getLogisticAmount(data.points, tmp.h.getResetGain, tmp.h.getLossRate, diff)
                if (hasUpgrade("h", 21)) deut.points = getLogisticAmount(deut.points, 
                                                                         tmp.h.deuterium.getResetGain, 
                                                                         tmp.h.deuterium.getLossRate, 
                                                                         diff)
                if (hasUpgrade("h", 31)) atmc.points = getLogisticAmount(atmc.points, 
                                                                         tmp.h.atomic_hydrogen.getResetGain, 
                                                                         tmp.h.atomic_hydrogen.getLossRate, 
                                                                         diff)
                data.time += diff
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
                {key: "shift+H", description: "Shift+H: Go to Hydrogen", onPress(){
                                showTab("h")
                        }
                },
                {key: "Control+C", description: "Control+C: Go to changelog", onPress(){
                                showTab("changelog-tab")
                        }
                },
                {key: ",", description: ",: Move one tab to the left", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                player.subtabs[l].mainTabs = getNextLeftTab(l)
                        }
                },
                {key: ".", description: ".: Move one tab to the right", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                player.subtabs[l].mainTabs = getNextRightTab(l)
                        }
                },
                {key: "ArrowRight", description: "Right Arrow: Move one tab to the right", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                if (!player.arrowHotkeys) return
                                player.subtabs[l].mainTabs = getNextRightTab(l)
                        }
                },
                {key: "ArrowLeft", description: "Left Arrow: Move one tab to the left", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                if (!player.arrowHotkeys) return
                                player.subtabs[l].mainTabs = getNextLeftTab(l)
                        }
                },
                {key: "shift+<", description: "Shift+,: Move all the way to the left", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                k = getUnlockedSubtabs(l)
                                player.subtabs[l].mainTabs = k[0]
                        }
                },
                {key: "shift+>", description: "Shift+.: Move all the way to the right", 
                        onPress(){
                                let l = player.tab
                                if (layers[l] == undefined) return
                                k = getUnlockedSubtabs(l)
                                player.subtabs[l].mainTabs = k[k.length-1]
                        }
                },
                {key: "Control+S", description: "Control+S: Save", 
                        onPress(){
                                save()
                        }
                },
                {key: "shift+Control+S", description: "Shift+Control+S: Save", 
                        onPress(){
                                save()
                        }
                },
                {key: "shift+!", description: "Shift+1: Go to achievements", 
                        onPress(){
                                player.tab = "ach"
                        }
                },
        ],
        layerShown(){return true},
        prestigeButtonText(){
                return "hello"
        },
        canReset(){
                return false
        },
        deuterium: {
                getResetGain() {
                        let base = player.h.points.times(.0002)
                        let mult = tmp.h.deuterium.getGainMult

                        let ret = base.times(mult)

                        ret = ret.pow(tmp.tokens.buyables[51].effect)

                        return ret.max(0)
                },
                getLossRate() { //deuterium loss
                        return new Decimal(.01)
                },
                getGainMult(){
                        let x = new Decimal(1)

                        if (hasUpgrade("h", 23))        x = x.times(tmp.h.upgrades[23].effect)
                        if (hasUpgrade("h", 41))        x = x.times(Decimal.pow(player.h.atomic_hydrogen.points.max(3).ln(), tmp.h.upgrades[41].effect))
                                                        x = x.times(tmp.mini.buyables[13].effect)
                                                        x = x.times(tmp.tokens.buyables[21].effect)

                        if (x.lt(0))  Decimal(0)

                        return x
                },
        },
        atomic_hydrogen: {
                getResetGain() {
                        let base = player.h.points.times(.001)
                        let mult = tmp.h.atomic_hydrogen.getGainMult

                        let ret = base.times(mult)

                        ret = ret.pow(tmp.tokens.buyables[43].effect)

                        return ret.max(0)
                },
                getLossRate() { //atomic hydrogen loss atomic loss
                        return new Decimal(.01)
                },
                getGainMult(){
                        let x = new Decimal(1)

                        if (hasUpgrade("h", 42))        x = x.times(Decimal.pow(player.h.deuterium.points.max(3).ln(), tmp.h.upgrades[42].effect))
                                                        x = x.times(tmp.mini.buyables[11].effect)
                                                        x = x.times(tmp.tokens.buyables[13].effect)

                        return x
                },
        },
        upgrades: {
                rows: 10,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(0) + "'>Hydrogen I"
                        },
                        description(){
                                if (!shiftDown) return "ln([best Hydrogen]) multiplies Life Point gain"
                                a = "ln([best Hydrogen])"
                                if (hasUpgrade("h", 14)) a = "(ln([best Hydrogen]))^[Hydrogen IV effect]"
                                if (hasUpgrade("h", 33)) a = a.replace("ln", "log2")
                                if (hasUpgrade("h", 11)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[11].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost:() => player.hardMode ? new Decimal(125) : new Decimal(20),
                        effect(){
                                let init = player.h.best.max(1)
                                let ret 

                                if (hasUpgrade("h", 33))        ret = init.log2().max(1)
                                else                            ret = init.ln().max(1)

                                if (hasUpgrade("h", 14))        ret = ret.pow(tmp.h.upgrades[14].effect)

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "h") return ""
                                if (player.subtabs.h.mainTabs != "Upgrades") return ""
                                return format(tmp.h.upgrades[11].effect)
                        },
                        unlocked(){
                                return player.h.best.gt(0) || hasMilestone("tokens", 2)
                        }, //hasUpgrade("h", 11)
                },
                12: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(1) + "'>Hydrogen II"
                        },
                        description(){
                                if (!shiftDown) return "Each upgrade adds 1 to the Hydrogen gain formula"
                                a = "[Hydrogen upgrades]"
                                if (hasUpgrade("h", 43)) a += "*2"
                                if (hasUpgrade("h", 12)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[12].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost:() => player.hardMode ? new Decimal(300) : new Decimal(50),
                        effect(){
                                let ret = new Decimal(player.h.upgrades.length)

                                if (hasUpgrade("h", 43)) ret = ret.times(2)

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "h") return ""
                                if (player.subtabs.h.mainTabs != "Upgrades") return ""
                                return format(tmp.h.upgrades[12].effect)
                        },
                        unlocked(){
                                return hasUpgrade("h", 11) || hasMilestone("tokens", 2)
                        }, //hasUpgrade("h", 12)
                },
                13: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(2) + "'>Hydrogen III"
                        },
                        description(){
                                if (player.tab != "h") return ""
                                if (player.subtabs.h.mainTabs != "Upgrades") return ""
                                if (!shiftDown) return "1+Achievements multiplies Hydrogen gain"
                                a = "1+[Achievements]"
                                if (hasUpgrade("h", 32)) a = "(" + a + ")^" + format(tmp.h.upgrades[32].effect)
                                if (hasUpgrade("h", 13)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[13].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost:() => player.hardMode ? new Decimal(450) : new Decimal(100),
                        effect(){
                                let ret = new Decimal(player.ach.achievements.length).plus(1)

                                if (hasUpgrade("h", 32)) ret = ret.pow(tmp.h.upgrades[32].effect)

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "h") return ""
                                if (player.subtabs.h.mainTabs != "Upgrades") return ""
                                return format(tmp.h.upgrades[13].effect)
                        },
                        unlocked(){
                                return hasUpgrade("h", 12) || hasMilestone("tokens", 2)
                        }, //hasUpgrade("h", 13)
                },
                14: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(3) + "'>Hydrogen IV"
                        },
                        description(){
                                if (!shiftDown) return "Raise Hydrogen I to ln([Hydrogen upgrades]"
                                a = "ln([Hydrogen upgrades]"
                                if (hasUpgrade("h", 43)) a = a.replace("ln", "log2")
                                if (hasUpgrade("h", 14)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[14].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost:() => player.hardMode ? new Decimal(1700) : new Decimal(500),
                        effect(){
                                let a1 = new Decimal(player.h.upgrades.length).max(1)
                                if (hasUpgrade("h", 43))        ret = a1.log2().max(1)
                                else                            ret = a1.ln().max(1)

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "h") return ""
                                if (player.subtabs.h.mainTabs != "Upgrades") return ""
                                return format(tmp.h.upgrades[14].effect)
                        },
                        unlocked(){
                                return hasUpgrade("h", 13) || hasMilestone("tokens", 2)
                        }, //hasUpgrade("h", 14)
                },
                15: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(4) + "'>Hydrogen V"
                        },
                        description(){
                                if (!shiftDown) return "Unlock Deuterium (<sup>2</sup>H) and Atomic Hydrogen (H<sub>2</sub>) upgrades, but buying one vastly increases the price of and hides the other"
                                a = ""
                                if (hasUpgrade("h", 15)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[15].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost:() => player.hardMode ? new Decimal(1750) : new Decimal(1000),
                        unlocked(){
                                return hasUpgrade("h", 14) || hasMilestone("tokens", 2)
                        }, //hasUpgrade("h", 15)
                },
                21: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(5) + "'>Deuterium I"
                        },
                        description(){
                                if (!shiftDown) return "Search through your Hydrogen to find the special .02% -- Deuterium"
                                if (hasUpgrade("h", 21)) return ""
                                return "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[21].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                if (!player.hardMode) return hasUpgrade("h", 31) ? new Decimal(5e5) : new Decimal(1)
                                return hasUpgrade("h", 31) ? new Decimal(15e5) : new Decimal(1)
                        },
                        unlocked(){
                                return  hasMilestone("tokens", 2) || hasUpgrade("h", 15) && (!hasUpgrade("h", 31) || hasUpgrade("h", 35) || hasUpgrade("h", 25))
                        }, //hasUpgrade("h", 21)
                },
                22: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(6) + "'>Deuterium II"
                        },
                        description(){
                                if (!shiftDown) return "ln(ln(10+[best Deuterium])) multiplies Life Point and Hydrogen gain"
                                a = "ln(ln(10+[best Deuterium]))"
                                if (hasUpgrade("h", 24)) a = "(ln(ln(10+[best Deuterium])))^[this row upgrades]"
                                if (hasUpgrade("h", 22)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[22].cost, player.h.deuterium.points, tmp.h.deuterium.getResetGain, tmp.h.deuterium.getLossRate)
                        },
                        cost(){
                                if (!player.hardMode) return hasUpgrade("h", 31) ? new Decimal(5e3) : new Decimal(5)
                                return hasUpgrade("h", 31) ? new Decimal(123456) : new Decimal(30)
                        },
                        currencyLocation:() => player.h.deuterium,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Deuterium",
                        effect(){
                                let ret = player.h.deuterium.best.plus(10).ln().ln()

                                if (hasUpgrade("h", 24)) ret = ret.pow(tmp.h.upgrades[24].effect)

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "h") return ""
                                if (player.subtabs.h.mainTabs != "Upgrades" && player.subtabs.h.mainTabs != "Deuterium") return ""
                                return format(tmp.h.upgrades[22].effect)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 21)
                        }, //hasUpgrade("h", 22)
                },
                23: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(7) + "'>Deuterium III"
                        },
                        description(){
                                if (!shiftDown) return "ln([best Deuterium]) multiplies Deuterium gain"
                                a = "ln(best Deuterium])"
                                if (hasUpgrade("h", 23)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[23].cost, player.h.deuterium.points, tmp.h.deuterium.getResetGain, tmp.h.deuterium.getLossRate)
                        },
                        cost(){
                                if (!player.hardMode) return hasUpgrade("h", 31) ? new Decimal(20e3) : new Decimal(20)
                                return hasUpgrade("h", 31) ? new Decimal(444444) : new Decimal(80)
                        },
                        currencyLocation:() => player.h.deuterium,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Deuterium",
                        effect(){
                                let ret = player.h.deuterium.best.max(1).ln().max(1)

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "h") return ""
                                if (player.subtabs.h.mainTabs != "Upgrades" && player.subtabs.h.mainTabs != "Deuterium") return ""
                                return format(tmp.h.upgrades[23].effect)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 22)
                        }, //hasUpgrade("h", 23)
                },
                24: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(8) + "'>Deuterium IV"
                        },
                        description(){
                                if (!shiftDown) return "Raise Deuterium II to the number of upgrades in this row"
                                if (hasUpgrade("h", 24)) return ""
                                return "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[24].cost, player.h.deuterium.points, tmp.h.deuterium.getResetGain, tmp.h.deuterium.getLossRate)
                        },
                        cost(){
                                if (!player.hardMode) return hasUpgrade("h", 31) ? new Decimal(200e3) : new Decimal(200)
                                return hasUpgrade("h", 31) ? new Decimal(12e6) : new Decimal(1000)
                        },
                        currencyLocation:() => player.h.deuterium,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Deuterium",
                        effect(){
                                let a = 1
                                if (hasUpgrade("h", 21)) a ++
                                if (hasUpgrade("h", 22)) a ++
                                if (hasUpgrade("h", 23)) a ++
                                if (hasUpgrade("h", 25)) a ++
                                return a
                        },
                        effectDisplay(){
                                if (player.tab != "h") return ""
                                if (player.subtabs.h.mainTabs != "Upgrades" && player.subtabs.h.mainTabs != "Deuterium") return ""
                                return format(tmp.h.upgrades[24].effect)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 23)
                        }, //hasUpgrade("h", 24)
                },
                25: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(9) + "'>Deuterium V"
                        },
                        description(){
                                if (!shiftDown) return "Each upgrade raises Life Point gain ^1.01"
                                a = "1.01^[upgrades]"
                                if (hasUpgrade("h", 25)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[25].cost, player.h.deuterium.points, tmp.h.deuterium.getResetGain, tmp.h.deuterium.getLossRate)
                        },
                        cost(){
                                if (!player.hardMode) return hasUpgrade("h", 31) ? new Decimal(2000e3) : new Decimal(2000)
                                return hasUpgrade("h", 31) ? new Decimal(5e8) : new Decimal(5e4)
                        },
                        currencyLocation:() => player.h.deuterium,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Deuterium",
                        effect(){
                                let a = Decimal.pow(1.01, player.h.upgrades.length)
                                return a
                        },
                        effectDisplay(){
                                if (player.tab != "h") return ""
                                if (player.subtabs.h.mainTabs != "Upgrades" && player.subtabs.h.mainTabs != "Deuterium") return ""
                                return format(tmp.h.upgrades[25].effect, 4)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 24)
                        }, //hasUpgrade("h", 25)
                },
                31: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(10) + "'>Atomic Hydrogen I"
                        },
                        description(){
                                if (!shiftDown) return "Wait for your Hydrogen to cool and bond at a brisk .1% rate"
                                if (hasUpgrade("h", 31)) return ""
                                return "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[31].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                if (!player.hardMode) return hasUpgrade("h", 21) ? new Decimal(3e5) : new Decimal(1)
                                return hasUpgrade("h", 21) ? new Decimal(950e3) : new Decimal(1)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 15) && (!hasUpgrade("h", 21) || hasUpgrade("h", 25) || hasUpgrade("h", 35))
                        }, //hasUpgrade("h", 31)
                },
                32: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(11) + "'>Atomic Hydrogen II"
                        },
                        description(){
                                if (!shiftDown) return "Upgrades in this row ^ .8 raise Hydrogen III effect"
                                a = "[this row upgrades] ^ .8"
                                if (hasUpgrade("h", 32)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[32].cost, player.h.atomic_hydrogen.points, tmp.h.atomic_hydrogen.getResetGain, tmp.h.atomic_hydrogen.getLossRate)
                        },
                        cost(){
                                if (!player.hardMode) return hasUpgrade("h", 21) ? new Decimal(20e3) : new Decimal(20)
                                return hasUpgrade("h", 21) ? new Decimal(120e3) : new Decimal(250)
                        },
                        currencyLocation:() => player.h.atomic_hydrogen,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Atomic Hydrogen",
                        effect(){
                                let a = 1
                                if (hasUpgrade("h", 31)) a ++
                                if (hasUpgrade("h", 33)) a ++
                                if (hasUpgrade("h", 34)) a ++
                                if (hasUpgrade("h", 35)) a ++
                                return Decimal.pow(a, .8)
                        },
                        effectDisplay(){
                                if (player.tab != "h") return ""
                                if (player.subtabs.h.mainTabs != "Upgrades" && player.subtabs.h.mainTabs != "Atomic Hydrogen") return ""
                                return format(tmp.h.upgrades[32].effect)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 31) 
                        }, //hasUpgrade("h", 32)
                },
                33: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(12) + "'>Atomic Hydrogen III"
                        },
                        description(){
                                if (!shiftDown) return "Make the ln in Hydrogen I a log2"
                                if (hasUpgrade("h", 33)) return ""
                                return "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[33].cost, player.h.atomic_hydrogen.points, tmp.h.atomic_hydrogen.getResetGain, tmp.h.atomic_hydrogen.getLossRate)
                        },
                        cost(){
                                if (!player.hardMode) return hasUpgrade("h", 21) ? new Decimal(100e3) : new Decimal(100)
                                return hasUpgrade("h", 21) ? new Decimal(120e4) : new Decimal(1600)
                        },
                        currencyLocation:() => player.h.atomic_hydrogen,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Atomic Hydrogen",
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 32) 
                        }, //hasUpgrade("h", 33)
                },
                34: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(13) + "'>Atomic Hydrogen IV"
                        },
                        description(){
                                if (!shiftDown) return "Hydrogen III effects Life Points"
                                if (hasUpgrade("h", 34)) return ""
                                return "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[34].cost, player.h.atomic_hydrogen.points, tmp.h.atomic_hydrogen.getResetGain, tmp.h.atomic_hydrogen.getLossRate)
                        },
                        cost(){
                                if (!player.hardMode) return hasUpgrade("h", 21) ? new Decimal(1000e3) : new Decimal(1000)
                                return hasUpgrade("h", 21) ? new Decimal(120e5) : new Decimal(6e3)
                        },
                        currencyLocation:() => player.h.atomic_hydrogen,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Atomic Hydrogen",
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 33) 
                        }, //hasUpgrade("h", 34)
                },
                35: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(14) + "'>Atomic Hydrogen V"
                        },
                        description(){
                                if (!shiftDown) return "You lose .12% less Hydrogen per second"
                                if (hasUpgrade("h", 35)) return ""
                                return "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[35].cost, player.h.atomic_hydrogen.points, tmp.h.atomic_hydrogen.getResetGain, tmp.h.atomic_hydrogen.getLossRate)
                        },
                        cost(){
                                if (!player.hardMode) return hasUpgrade("h", 21) ? new Decimal(4000e3) : new Decimal(4000)
                                return hasUpgrade("h", 21) ? new Decimal(85e6) : new Decimal(25e3)
                        },
                        currencyLocation:() => player.h.atomic_hydrogen,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Atomic Hydrogen",
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 34) 
                        }, //hasUpgrade("h", 35)
                },
                41: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(15) + "'>Hydrogen VI"
                        },
                        description(){
                                if (player.tab != "h") return ""
                                if (player.subtabs.h.mainTabs != "Upgrades") return ""
                                if (!shiftDown) return "ln(3+[Atomic Hydrogen])^<bdi style='color:#CC0033'>A</bdi> multiplies Deuterium gain"
                                eff = format(tmp.h.upgrades[41].effect)
                                a = "ln(3+[Atomic Hydrogen])^" + eff
                                if (hasUpgrade("h", 41)) {
                                        a += "<br>" + format(player.h.atomic_hydrogen.points.max(3).ln()) + "^" + eff
                                        return a
                                } // red a 
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[41].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                return player.hardMode ? new Decimal(5.5e9) : new Decimal(2e9)
                        },
                        effect(){
                                let a = new Decimal(1)

                                a = a.plus(tmp.mini.buyables[21].effect)
                                
                                return a
                        },
                        effectDisplay(){
                                if (player.tab != "h") return ""
                                if (player.subtabs.h.mainTabs != "Upgrades") return ""
                                return "<bdi style='color:#CC0033'>A</bdi>=" + format(tmp.h.upgrades[41].effect)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 35) && hasUpgrade("h", 25) 
                        }, //hasUpgrade("h", 41)
                },
                42: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(16) + "'>Hydrogen VII"
                        },
                        description(){
                                if (player.tab != "h") return ""
                                if (player.subtabs.h.mainTabs != "Upgrades") return ""
                                if (!shiftDown) return "ln(3+[Deuterium])^<bdi style='color:#CC0033'>B</bdi> multiplies Atomic Hydrogen gain"
                                eff = format(tmp.h.upgrades[42].effect)
                                a = "ln(3+[Deuterium])^" + eff
                                if (hasUpgrade("h", 42)) {
                                        a += "<br>" + format(player.h.deuterium.points.max(3).ln()) + "^" + eff
                                        return a
                                } //red b
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[42].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                return player.hardMode ? new Decimal(7e9) : new Decimal(3e9)
                        },
                        effect(){
                                let b = new Decimal(2)

                                b = b.plus(tmp.mini.buyables[33].effect)
                                b = b.plus(tmp.mini.buyables[43].effect)
                                b = b.plus(tmp.mini.buyables[53].effect)
                                
                                return b
                        },
                        effectDisplay(){
                                if (player.tab != "h") return ""
                                if (player.subtabs.h.mainTabs != "Upgrades") return ""
                                return "<bdi style='color:#CC0033'>B</bdi>=" + format(tmp.h.upgrades[42].effect)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 41)
                        }, //hasUpgrade("h", 42)
                },
                43: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(17) + "'>Hydrogen VIII"
                        },
                        description(){
                                if (!shiftDown) return "Double Hydrogen II and make the ln in Hydrogen IV a log2"
                                if (hasUpgrade("h", 43)) return ""
                                return "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[43].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                return player.hardMode ? new Decimal(8e9) : new Decimal(4e9)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 42)
                        }, //hasUpgrade("h", 43)
                },
                44: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(18) + "'>Hydrogen IX"
                        },
                        description(){
                                if (!shiftDown) return "Unlock a minigame to increase <bdi style='color:#CC0033'>A</bdi>, but square Hydrogen X cost"
                                if (hasUpgrade("h", 44)) return ""
                                return "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[44].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                a = player.hardMode ? new Decimal(13e9) : new Decimal(6e9)
                                return a.pow(hasUpgrade("h", 45) ? 2 : 1)
                        },
                        onPurchase(){
                                if (tmp.n.layerShown) return 
                                if (player.tokens.total.lt(7)) player.subtabs.mini.mainTabs = "A"
                                if (player.tokens.total.gt(0)) return 
                                player.tab = "mini"
                                
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 43)
                        }, //hasUpgrade("h", 44)
                },
                45: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(19) + "'>Hydrogen X"
                        },
                        description(){
                                if (!shiftDown) return "Unlock a minigame to increase <bdi style='color:#CC0033'>B</bdi>, but square Hydrogen IX cost"
                                if (hasUpgrade("h", 45)) return ""
                                return "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[45].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                a = player.hardMode ? new Decimal(13e9) : new Decimal(6e9)
                                return a.pow(hasUpgrade("h", 44) ? 2 : 1)
                        },
                        onPurchase(){
                                if (tmp.n.layerShown) return 
                                if (player.tokens.total.lt(7)) player.subtabs.mini.mainTabs = "B"
                                if (player.tokens.total.gt(0)) return 
                                player.tab = "mini"
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 43)
                        }, //hasUpgrade("h", 45)
                },
                51: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(20) + "'>Hydrogen XI"
                        },
                        description(){
                                if (!shiftDown) return "Both minigames always tick, autobuy a B buyable once per second, and gain 1e5x A Points"
                                if (hasUpgrade("h", 51)) return ""
                                return "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[51].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                return player.hardMode ? new Decimal(1e36) : new Decimal(1e39)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 44) && hasUpgrade("h", 45)
                        }, //hasUpgrade("h", 51)
                },
                52: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(21) + "'>Hydrogen XII"
                        },
                        description(){
                                if (!shiftDown) return "<bdi style='font-size: 80%'> The autobuyer can buy A buyables, all autobuyers trigger per tick and works 10x as fast. Remove the softcap for B buyables</bdi>"
                                if (hasUpgrade("h", 52)) return ""
                                return "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[52].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                return player.hardMode ? new Decimal(1e98) : new Decimal(1e80)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 51) 
                        }, //hasUpgrade("h", 52)
                },
                53: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(22) + "'>Hydrogen XIII"
                        },
                        description(){
                                if (!shiftDown) return "Add 1 to the Violet base and ln(White) multiplies White effect"
                                if (hasUpgrade("h", 53)) return ""
                                return "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[53].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                return player.hardMode ? new Decimal("1e360") : new Decimal("1e321")
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 52) 
                        }, //hasUpgrade("h", 53)
                },
                54: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(23) + "'>Hydrogen XIV"
                        },
                        description(){
                                if (!shiftDown) return "^.5 in the A production formula becomes ^.52"
                                if (hasUpgrade("h", 54)) return ""
                                return "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[54].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                return player.hardMode ? new Decimal("1e364") : new Decimal("1e360")
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 53) 
                        }, // hasUpgrade("h", 54)
                },
                55: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(24) + "'>Hydrogen XV"
                        },
                        description(){
                                if (!shiftDown) return "^.52 in the A production formula becomes ^.524 and unlock Carbon (C) and Oxygen (O)"
                                if (hasUpgrade("h", 55)) return ""
                                return "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[55].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                return player.hardMode ? new Decimal("1e385") : new Decimal("1e380")
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 54) 
                        }, //hasUpgrade("h", 55)
                },
                61: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(25) + "'>Hydrogen XVI"
                        },
                        description(){
                                if (!shiftDown) return "Per upgrade multiply Life Points by Carbon"
                                a = "Carbon^[upgrades]"
                                if (hasMilestone("tokens", 19)) a = a.replace("[upgrades]", "(1.5*[upgrades])")
                                if (hasUpgrade("h", 61)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[61].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                return player.hardMode ? Decimal.pow(2, 2100) : Decimal.pow(2, 2048)
                        },
                        effect(){
                                let b = player.c.points.max(1)

                                let ret = b.pow(player.h.upgrades.length)
                                if (hasMilestone("tokens", 19)) ret = ret.pow(1.5)
                                
                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "h") return ""
                                if (player.subtabs.h.mainTabs != "Upgrades") return ""
                                return format(tmp.h.upgrades[61].effect)
                        },
                        unlocked(){
                                return hasUpgrade("h", 61) || hasMilestone("tokens", 2) || hasUpgrade("o", 15) && hasUpgrade("c", 15) 
                        }, //hasUpgrade("h", 61)
                },
                62: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(26) + "'>Hydrogen XVII"
                        },
                        description(){
                                if (!shiftDown) return "Oxygen IV effects Carbon gain and double autobuyer speed"
                                if (hasUpgrade("h", 62)) return ""
                                return "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[62].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                return player.hardMode ? Decimal.pow(2, 2250) : Decimal.pow(2, 2200)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 61)
                        }, //hasUpgrade("h", 62)
                },
                63: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(27) + "'>Hydrogen XVIII"
                        },
                        description(){
                                if (!shiftDown) return "sqrt(log10(Life Points)) multiplies Carbon and Oxygen gain"
                                a = "sqrt(log10(Life Points))"
                                if (hasUpgrade("h", 63)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[63].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                return player.hardMode ? Decimal.pow(2, 3250) : Decimal.pow(2, 3072)
                        },
                        effect(){
                                let ret = player.points.max(10).log10().sqrt()
                                
                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "h") return ""
                                if (player.subtabs.h.mainTabs != "Upgrades") return ""
                                return format(tmp.h.upgrades[63].effect)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 62)
                        }, //hasUpgrade("h", 63)
                },
                64: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(28) + "'>Hydrogen XIX"
                        },
                        description(){
                                if (!shiftDown) return "Square the ln(x) term in White and add a log10(x) term to Green"
                                if (hasUpgrade("h", 64)) return ''
                                return "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[64].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                return player.hardMode ? Decimal.pow(10, 1034) : Decimal.pow(10, 1024)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 63)
                        }, //hasUpgrade("h", 64)
                },
                65: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(29) + "'>Hydrogen XX"
                        },
                        description(){
                                if (!shiftDown) return "Unlock tokens"
                                if (hasUpgrade("h", 65)) return ""
                                return "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[65].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                return player.hardMode ? Decimal.pow(10, 1310) : Decimal.pow(10, 1304)
                        },
                        onPurchase(){
                                if (player.tokens.total.eq(0)) player.tab = "tokens"
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 64)
                        }, //hasUpgrade("h", 65)
                },
                71: { // come back to here pls
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(30) + "'>Deuterium VI"
                        },
                        canAfford(){
                                if (player.h.deuterium.points.lt(tmp.h.upgrades[71].cost)) return false
                                return hasUpgrade("tokens", 71)
                        },
                        description(){
                                if (!shiftDown) return "Gain 10x coins and max(5, log10(coins)) multiplies Oxygen per upgrade"
                                a = "max(5, log10(coins))"
                                return a
                        },
                        cost(){
                                return Decimal.pow(10, 2100e3)
                        },
                        currencyLocation:() => player.h.deuterium,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Deuterium",
                        unlocked(){
                                return player.tokens.total.gte(23) || hasMilestone("n", 3)
                        }, //hasUpgrade("h", 71)
                },
                72: { // come back to here pls
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(31) + "'>Deuterium VII"
                        },
                        canAfford(){
                                if (player.h.deuterium.points.lt(tmp.h.upgrades[72].cost)) return false
                                return hasUpgrade("tokens", 71)
                        },
                        description(){
                                if (!shiftDown) return "ln(Carbon) multiplies Near-ultraviolet base"
                                a = "ln(Carbon + 10)"
                                return a
                        },
                        cost(){
                                return Decimal.pow(10, 2444e3)
                        },
                        currencyLocation:() => player.h.deuterium,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Deuterium",
                        effect(){
                                let ret = player.c.points.plus(10).ln()

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "h") return ""
                                if (player.subtabs.h.mainTabs != "Upgrades" && player.subtabs.h.mainTabs != "Deuterium") return ""
                                return format(tmp.h.upgrades[72].effect)
                        },
                        unlocked(){
                                return player.tokens.total.gte(26) || hasMilestone("n", 3)
                        }, //hasUpgrade("h", 72)
                },
                73: { // come back to here pls
                        title(){
                                let end = shiftDown ? "Jacorb!" : "Deuterium VIII"
                                return "<bdi style='color: #" + getUndulatingColor(32) + "'>" + end
                        },
                        canAfford(){
                                if (player.h.deuterium.points.lt(tmp.h.upgrades[73].cost)) return false
                                return hasUpgrade("tokens", 71)
                        },
                        description(){
                                return "Add .01 to Constant base and you can buy all 3 row 7 coin upgrades"
                        },
                        cost(){
                                return Decimal.pow(10, 4516e3)
                        },
                        currencyLocation:() => player.h.deuterium,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Deuterium",
                        unlocked(){
                                return player.tokens.total.gte(34) || hasMilestone("n", 3)
                        }, //hasUpgrade("h", 73)
                },
                74: { // come back to here pls
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(33) + "'>Deuterium IX"
                        },
                        canAfford(){
                                if (player.h.deuterium.points.lt(tmp.h.upgrades[74].cost)) return false
                                return hasUpgrade("tokens", 71)
                        },
                        description(){
                                return "Square Oxygen I and remove the -9"
                        },
                        cost(){
                                return Decimal.pow(10, 7111e3)
                        },
                        currencyLocation:() => player.h.deuterium,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Deuterium",
                        unlocked(){
                                return player.tokens.total.gte(37) || hasMilestone("n", 3)
                        }, //hasUpgrade("h", 74)
                },
                75: { // come back to here pls
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(34) + "'>Deuterium X"
                        },
                        canAfford(){
                                if (player.h.deuterium.points.lt(tmp.h.upgrades[75].cost)) return false
                                return hasUpgrade("tokens", 71)
                        },
                        description(){
                                return "Change token buyable costs from ceiling to rounding"
                        },
                        cost(){
                                return Decimal.pow(10, 7686e3)
                        },
                        currencyLocation:() => player.h.deuterium,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Deuterium",
                        unlocked(){
                                return player.tokens.total.gte(39) || hasMilestone("n", 3)
                        }, //hasUpgrade("h", 75)
                },
                81: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(35) + "'>Atomic Hydrogen VI"
                        },
                        canAfford(){
                                if (player.h.atomic_hydrogen.points.lt(tmp.h.upgrades[81].cost)) return false
                                return hasUpgrade("tokens", 72)
                        },
                        description(){
                                if (!shiftDown) return "Square Oxygen IV but you lose 50 times more Carbon and Oxygen per second"
                                a = ""
                                return a
                        },
                        cost(){
                                return Decimal.pow(10, 5960e3)
                        },
                        currencyLocation:() => player.h.atomic_hydrogen,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Atomic Hydrogen",
                        unlocked(){
                                return hasUpgrade("h", 71) || hasMilestone("n", 3)
                        }, //hasUpgrade("h", 81)
                },
                82: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(36) + "'>Atomic Hydrogen VII"
                        },
                        canAfford(){
                                if (player.h.atomic_hydrogen.points.lt(tmp.h.upgrades[82].cost)) return false
                                return hasUpgrade("tokens", 72)
                        },
                        description(){
                                return "Per token per upgrade multiply Microwave base by 1.01"
                        },
                        cost(){
                                return Decimal.pow(10, 6750e3)
                        },
                        currencyLocation:() => player.h.atomic_hydrogen,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Atomic Hydrogen",
                        unlocked(){
                                return hasUpgrade("h", 81) || hasMilestone("n", 3)
                        }, //hasUpgrade("h", 82)
                },
                83: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(37) + "'>Atomic Hydrogen VIII"
                        },
                        canAfford(){
                                if (player.h.atomic_hydrogen.points.lt(tmp.h.upgrades[83].cost)) return false
                                return hasUpgrade("tokens", 72)
                        },
                        description(){
                                return "Raise token buyable costs ^.9 (ceilinged)"
                        },
                        cost(){
                                return Decimal.pow(10, 7070e3)
                        },
                        currencyLocation:() => player.h.atomic_hydrogen,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Atomic Hydrogen",
                        unlocked(){
                                return hasUpgrade("h", 82) || hasMilestone("n", 3)
                        }, //hasUpgrade("h", 83)
                },
                84: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(38) + "'>Atomic Hydrogen IX"
                        },
                        canAfford(){
                                if (player.h.atomic_hydrogen.points.lt(tmp.h.upgrades[84].cost)) return false
                                return hasUpgrade("tokens", 72)
                        },
                        description(){
                                return "Change token buyable exponent to .8"
                        },
                        cost(){
                                return Decimal.pow(10, 7913e3)
                        },
                        currencyLocation:() => player.h.atomic_hydrogen,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Atomic Hydrogen",
                        unlocked(){
                                return hasUpgrade("h", 83) || hasMilestone("n", 3)
                        }, //hasUpgrade("h", 84)
                },
                85: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(39) + "'>Atomic Hydrogen X"
                        },
                        canAfford(){
                                if (player.h.atomic_hydrogen.points.lt(tmp.h.upgrades[85].cost)) return false
                                return hasUpgrade("tokens", 72)
                        },
                        description(){
                                return "Change token buyable exponent to .7"
                        },
                        cost(){
                                return Decimal.pow(10, 8362e3)
                        },
                        currencyLocation:() => player.h.atomic_hydrogen,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Atomic Hydrogen",
                        unlocked(){
                                return hasUpgrade("h", 84) || hasMilestone("n", 3)
                        }, //hasUpgrade("h", 85)
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                if (player.tab != "h") return ""
                                                if (player.subtabs.h.mainTabs != "Upgrades") return ""
                                                if (shiftDown) return "Your best Hydrogen is " + format(player.h.best) + " and you are netting " + format(tmp.h.getResetGain.sub(tmp.h.getLossRate.times(player.h.points))) + " Hydrogen per second"
                                                return "You are gaining " + format(tmp.h.getResetGain) + " Hydrogen per second"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "h") return ""
                                                if (player.subtabs.h.mainTabs != "Upgrades") return ""
                                                if (shiftDown) return "Formula: min(" + formatWhole(tmp.h.getDefaultMaximum) + ",ln(points))*[multipliers]"
                                                return "You are losing " + format(tmp.h.getLossRate.times(100)) + "% of your Hydrogen per second"
                                        },
                                ],

                                "blank", 
                                ["upgrades", [1,2,3,4,5,6,7,8,9]]],
                        unlocked(){
                                return true
                        },
                },
                "Deuterium": {
                        content: [["secondary-display", "deuterium"],
                                ["display-text",
                                        function() {
                                                if (player.tab != "h") return ""
                                                if (player.subtabs.h.mainTabs != "Deuterium") return ""
                                                if (shiftDown) {
                                                        p1 = player.h.deuterium
                                                        t1 = tmp.h.deuterium
                                                        return "Your best Deuterium is " + format(p1.best) + " and you are netting " + format(t1.getResetGain.sub(t1.getLossRate.times(p1.points))) + " Deuterium per second"
                                                }
                                                return "You are gaining " + format(tmp.h.deuterium.getResetGain) + " Deuterium per second"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "h") return ""
                                                if (player.subtabs.h.mainTabs != "Deuterium") return ""
                                                if (shiftDown) return "Formula: .0002 * Hydrogen * [multipliers]"
                                                return "You are losing " + format(tmp.h.deuterium.getLossRate.times(100)) + "% of your Deuterium per second"
                                        },
                                ],

                                "blank", 
                                ["upgrades", [2,7]]
                                ],
                        unlocked(){
                                return hasUpgrade("h", 21)
                        },
                },
                "Atomic Hydrogen": {
                        content: [["secondary-display", "atomic_hydrogen"],
                                ["display-text",
                                        function() {
                                                if (player.tab != "h") return ""
                                                if (player.subtabs.h.mainTabs != "Atomic Hydrogen") return ""
                                                if (shiftDown) {
                                                        p1 = player.h.atomic_hydrogen
                                                        t1 = tmp.h.atomic_hydrogen
                                                        return "Your best Atomic Hydrogen is " + format(p1.best) + " and you are netting " + format(t1.getResetGain.sub(t1.getLossRate.times(p1.points))) + " Atomic Hydrogen per second"
                                                }
                                                return "You are gaining " + format(tmp.h.atomic_hydrogen.getResetGain) + " Atomic Hydrogen per second"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "h") return ""
                                                if (player.subtabs.h.mainTabs != "Atomic Hydrogen") return ""
                                                if (shiftDown) return "Formula: .001 * Hydrogen * [multipliers]"
                                                return "You are losing " + format(tmp.h.atomic_hydrogen.getLossRate.times(100)) + "% of your Atomic Hydrogen per second"
                                        },
                                ],

                                "blank", 
                                ["upgrades", [3,8]]
                                ],
                        unlocked(){
                                return hasUpgrade("h", 31)
                        },
                },
        },
        doReset(layer){},
})

addLayer("c", {
        name: "Carbon", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: false,
		points: new Decimal(0),
                best: new Decimal(0),
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
                methane: {
                        points: new Decimal(0),
                        best: new Decimal(0),
                },
                graphite: {
                        points: new Decimal(0),
                        best: new Decimal(0),
                },
        }},
        color: "#3C9009",
        branches: [],
        requires:() => hasUpgrade("o", 11) ? Decimal.pow(2, 2460) : Decimal.pow(2, 1024), // Can be a function that takes requirement increases into account
        resource: "Carbon", // Name of prestige currency
        baseResource: "Life Points", // Name of resource prestige is based on
        baseAmount() {return player.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                if (!hasUpgrade("c", 11)) return new Decimal(0)
                let base = tmp.c.getBaseGain

                let mult = tmp.c.getGainMult

                let ret = base.times(mult)

                if (hasUpgrade("c", 15))        ret = ret.pow(tmp.h.upgrades[25].effect)
                                                ret = ret.pow(tmp.tokens.buyables[52].effect)
                if (hasUpgrade("n", 11))        ret = ret.pow(1.001)

                if (hasUpgrade("tokens", 51))   ret = ret.times(player.o.points.max(1).pow(.1))

                return ret
        },
        getBaseGain(){
                let pts = player.points
                if (player.points.lt(2)) return new Decimal(0)
                let base = player.points.log(2).div(256).sub(3).max(0)
                
                if (hasUpgrade("tokens", 22)) base = base.pow(2)

                if (base.lt(1)) base = new Decimal(0)

                return base
        },
        getNextAt(){
                return new Decimal(0) //this doesnt matter
        },
        getLossRate() { //carbon loss
                let ret = new Decimal(.01)

                if (hasUpgrade("h", 81)) ret = ret.times(50)
                if (hasUpgrade("n", 32)) ret = ret.times(100)

                return ret.max(.00001)
        },
        getGainMult(){ //carbon gain mult
                let x = new Decimal(1)

                if (hasUpgrade("c", 14))        x = x.times(tmp.c.upgrades[14].effect)
                if (hasUpgrade("c", 15))        x = x.times(tmp.h.upgrades[25].effect)
                if (hasUpgrade("h", 62))        x = x.times(tmp.o.upgrades[14].effect)
                if (hasUpgrade("h", 63))        x = x.times(tmp.h.upgrades[63].effect)
                                                x = x.times(tmp.tokens.buyables[22].effect)
                if (hasMilestone("tokens", 3))  x = x.times(player.ach.achievements.length)
                if (hasUpgrade("c", 21))        x = x.times(tmp.c.upgrades[21].effect)
                                                x = x.times(tmp.mini.buyables[101].effect)
                                                x = x.times(tmp.n.effect)
                if (hasUpgrade("n", 23))        x = x.times(tmp.n.upgrades[23].effect)
                if (hasChallenge("n", 32)) {
                        let exp = tmp.n.challenges[32].rewardEffect
                        let base = player.o.points.max(10).log10()
                                                x = x.times(base.pow(exp))
                }
                if (hasUpgrade("mini", 64))     x = x.times(player.mini.d_points.fuel.max(1))

                return x
        },
        update(diff){
                let data = player.c
                
                if (data.best.gt(0)) data.unlocked = true
                else data.unlocked = (!player.o.best.gt(0) || player.points.max(2).log(2).gte(2460)) &&  player.points.max(2).log(2).gte(1024)
                data.best = data.best.max(data.points)
                
                // do carbon gain
                if (hasMilestone("mu", 1)) data.points = data.points.plus(tmp.c.getResetGain.times(diff))
                else data.points = getLogisticAmount(data.points, tmp.c.getResetGain, tmp.c.getLossRate, diff)

                if (false) {
                        //do autobuyer stuff
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
                {key: "shift+C", description: "Shift+C: Go to Carbon", onPress(){
                                if (!tmp.c.layerShown) return
                                showTab("c")
                        }
                },
        ],
        layerShown(){return hasUpgrade("h", 55) || tmp.n.layerShown},
        prestigeButtonText(){
                return "hello"
        },
        canReset(){
                return false
        },
        upgrades: {
                rows: 10,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(40) + "'>Carbon I"
                        },
                        description(){
                                if (!shiftDown) return "Begin Production of Carbon, but vastly increase the cost of Oxygen I"
                                a = "(log2(Life Points)/256-3)*multipliers"
                                if (hasUpgrade("tokens", 22)) a = a.replace("3)", "3)^2")
                                return a
                        },
                        cost:() => Decimal.pow(2, hasUpgrade("o", 11) ? 2460 : 1024), //may change
                        currencyLocation:() => player,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Life Points",
                        unlocked(){
                                return true
                        }, //hasUpgrade("c", 11)
                },
                12: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(41) + "'>Carbon II"
                        },
                        description(){
                                if (!shiftDown) return "Add to the A point exponent .126-.126/<br>(1+cbrt([Carbon])/50)"
                                a = ".126-.126/<br>(1+cbrt([Carbon])/50)"
                                if (hasUpgrade("c", 12)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.c.upgrades[12].cost, player.c.points, tmp.c.getResetGain, tmp.c.getLossRate)
                        },
                        cost() {
                                if (hasUpgrade("o", 11)) return player.hardMode ? new Decimal(600) : new Decimal(150)
                                return player.hardMode ? new Decimal(130) : new Decimal(30)
                        },
                        effect(){
                                let init = player.c.points.cbrt().div(50).plus(1)

                                let ret = new Decimal(-.126).times(init.pow(-1).sub(1))

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "c") return ""
                                if (player.subtabs.c.mainTabs != "Upgrades") return ""
                                return format(tmp.c.upgrades[12].effect, 4)
                        },
                        unlocked(){
                                return hasMilestone("n", 6) || hasUpgrade("c", 11)
                        }, //hasUpgrade("c", 12)
                },
                13: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(42) + "'>Carbon III"
                        },
                        description(){
                                if (!shiftDown) return "Add a ln(e+sqrt(x)/10) term to B32"
                                a = "ln(e+sqrt(x)/10)"
                                if (hasUpgrade("c", 13)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.c.upgrades[13].cost, player.c.points, tmp.c.getResetGain, tmp.c.getLossRate)
                        },
                        cost() {
                                if (hasUpgrade("o", 11)) return player.hardMode ? new Decimal(700) : new Decimal(300)
                                return player.hardMode ? new Decimal(190) : new Decimal(40)
                        },
                        unlocked(){
                                return hasMilestone("n", 6) || hasUpgrade("c", 12)
                        }, //hasUpgrade("c", 13)
                },
                14: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(43) + "'>Carbon IV"
                        },
                        description(){
                                if (!shiftDown) return "ln(Deuterium)/1000 multiplies Carbon and Indigo's ln becomes log2"
                                a = "max(1, ln(Deuterium)/1000)"
                                if (hasUpgrade("c", 14)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.c.upgrades[14].cost, player.c.points, tmp.c.getResetGain, tmp.c.getLossRate)
                        },
                        cost() {
                                if (hasUpgrade("o", 11)) return player.hardMode ? new Decimal(950) : new Decimal(500)
                                return player.hardMode ? new Decimal(270) : new Decimal(100)
                        },
                        effect(){
                                let init = player.h.deuterium.points.max(3).ln().div(1000).max(1)

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "c") return ""
                                if (player.subtabs.c.mainTabs != "Upgrades") return ""
                                return format(tmp.c.upgrades[14].effect)
                        },
                        unlocked(){
                                return hasMilestone("n", 6) || hasUpgrade("c", 13)
                        }, //hasUpgrade("c", 14)
                },
                15: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(44) + "'>Carbon V"
                        },
                        description(){
                                if (!shiftDown) return "Deuterium V multiplies and then exponentiates Carbon gain"
                                if (hasUpgrade("c", 15)) return ""
                                return "<br>Estimated time: " + logisticTimeUntil(tmp.c.upgrades[15].cost, player.c.points, tmp.c.getResetGain, tmp.c.getLossRate)
                        },
                        cost() {
                                if (hasUpgrade("o", 11)) return player.hardMode ? new Decimal(6000) : new Decimal(3000)
                                return player.hardMode ? new Decimal(3000) : new Decimal(1000)
                        },
                        unlocked(){
                                return hasMilestone("n", 6) || hasUpgrade("c", 14)
                        }, //hasUpgrade("c", 15)
                },
                21: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(45) + "'>Carbon VI"
                        },
                        description(){
                                if (!shiftDown) return "<bdi style='color:#CC0033'>A</bdi> multiplies Carbon gain and X-Rays base and unlock coins"
                                a = "<bdi style='color:#CC0033'>A</bdi>"
                                if (hasUpgrade("c", 21)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.c.upgrades[21].cost, player.c.points, tmp.c.getResetGain, tmp.c.getLossRate)
                        },
                        effect(){
                                let ret = tmp.h.upgrades[41].effect.max(1)

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "c") return ""
                                if (player.subtabs.c.mainTabs != "Upgrades") return ""
                                return format(tmp.c.upgrades[21].effect)
                        },
                        cost() {
                                return player.hardMode ? new Decimal(6e20) : new Decimal(3e20)
                        },
                        unlocked(){
                                return hasMilestone("n", 6) || hasUpgrade("o", 21)
                        }, //hasUpgrade("c", 21)
                },
                22: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(46) + "'>Carbon VII"
                        },
                        description(){
                                if (!shiftDown) return "cbrt(max(10h, seconds played)) multiplies Ultraviolet base and add .01 to Polynomial base"
                                a = "cbrt(max(36000, seconds played))"
                                if (hasUpgrade("c", 24)) a += "+1000"
                                if (hasUpgrade("c", 22)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.c.upgrades[22].cost, player.c.points, tmp.c.getResetGain, tmp.c.getLossRate)
                        },
                        effect(){
                                let ret = new Decimal(player.timePlayed).max(36000).root(3)

                                if (hasUpgrade("c", 24)) ret = ret.plus(1000)

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "c") return ""
                                if (player.subtabs.c.mainTabs != "Upgrades") return ""
                                return format(tmp.c.upgrades[22].effect)
                        },
                        cost() {
                                return player.hardMode ? new Decimal(1.4e37) : new Decimal(5e36)
                        },
                        unlocked(){
                                return hasMilestone("n", 6) || hasUpgrade("o", 22)
                        }, //hasUpgrade("c", 22)
                },
                23: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(47) + "'>Carbon VIII"
                        },
                        description(){
                                if (!shiftDown) return "Change token buyable cost scaling from exponential to linear"
                                a = ""
                                if (hasUpgrade("c", 23)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.c.upgrades[23].cost, player.c.points, tmp.c.getResetGain, tmp.c.getLossRate)
                        },
                        cost() {
                                return player.hardMode ? new Decimal(4e80) : new Decimal(2e80)
                        },
                        unlocked(){
                                return hasMilestone("n", 6) || hasUpgrade("o", 23)
                        }, //hasUpgrade("c", 23)
                },
                24: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(48) + "'>Carbon IX"
                        },
                        description(){
                                if (!shiftDown) return "Add 1000 to Carbon VII and halve the Double-exponential divider"
                                a = ""
                                if (hasUpgrade("c", 24)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.c.upgrades[24].cost, player.c.points, tmp.c.getResetGain, tmp.c.getLossRate)
                        },
                        cost() {
                                return player.hardMode ? new Decimal(8.1e155) : new Decimal(4.6e155)
                        },
                        unlocked(){
                                return hasMilestone("n", 6) || hasUpgrade("o", 24)
                        }, //hasUpgrade("c", 24)
                },
                25: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(49) + "'>Carbon X"
                        },
                        description(){
                                if (!shiftDown) return "Halve the Double-exponential divider and add .01 to Polynomial base"
                                a = ""
                                if (hasUpgrade("c", 25)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.c.upgrades[25].cost, player.c.points, tmp.c.getResetGain, tmp.c.getLossRate)
                        },
                        cost() {
                                return player.hardMode ? new Decimal(9e222) : new Decimal(8.5e222)
                        },
                        unlocked(){
                                return hasMilestone("n", 6) || hasUpgrade("o", 25)
                        }, //hasUpgrade("c", 25)
                },
                31: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(50) + "'>Carbon XI"
                        },
                        description(){
                                let a = "Square base Nitrogen gain"
                                return a
                        },
                        cost() {
                                return Decimal.pow(10, 69000)
                        },
                        unlocked(){
                                return hasMilestone("n", 10) || hasUpgrade("o", 32)
                        }, // hasUpgrade("c", 31)
                },
                32: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(51) + "'>Carbon XII"
                        },
                        description(){
                                let a = "Respecting addition log base is decreased to 3 and each upgrade in this row reduces it by .2"
                                return a
                        },
                        effect(){
                                let a = 2.8
                                if (hasUpgrade("c", 31)) a -= .2
                                if (hasUpgrade("c", 33)) a -= .2
                                if (hasUpgrade("c", 34)) a -= .2
                                if (hasUpgrade("c", 35)) a -= .2
                                return a
                        },
                        cost() {
                                return Decimal.pow(10, 6296e3)
                        },
                        unlocked(){
                                return hasMilestone("n", 10) || hasUpgrade("n", 55)
                        }, // hasUpgrade("c", 32)
                },
                33: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(51) + "'>Carbon XIII"
                        },
                        description(){
                                let a = "Square addition is associative level effect and unlock a D buyable"
                                return a
                        },
                        cost() {
                                return Decimal.pow(10, 6485e3)
                        },
                        unlocked(){
                                return hasMilestone("n", 10) || hasUpgrade("c", 32)
                        }, // hasUpgrade("c", 33)
                },
                34: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(51) + "'>Carbon XIV"
                        },
                        description(){
                                let a = "Square the ln(x) component in Quadratic"
                                return a
                        },
                        cost() {
                                return Decimal.pow(10, player.hardMode ? 10550e3 : 10530e3)
                        },
                        unlocked(){
                                return hasMilestone("n", 10) || hasUpgrade("o", 34)
                        }, // hasUpgrade("c", 34)
                },
                35: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(51) + "'>Carbon XV"
                        },
                        description(){
                                let a = "Add a ln(x) component to Constant"
                                return a
                        },
                        cost() {
                                return Decimal.pow(10, 11840e3)
                        },
                        unlocked(){
                                return hasMilestone("n", 10) || hasUpgrade("c", 34)
                        }, // hasUpgrade("c", 35)
                },
                
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                if (player.tab != "c") return ""
                                                if (player.subtabs.c.mainTabs != "Upgrades") return ""
                                                if (shiftDown) return "Your best Carbon is " + format(player.c.best) + " and you are netting " + format(tmp.c.getResetGain.sub(tmp.c.getLossRate.times(player.c.points))) + " Carbon per second"
                                                return "You are gaining " + format(tmp.c.getResetGain) + " Carbon per second"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "c") return ""
                                                if (player.subtabs.c.mainTabs != "Upgrades") return ""
                                                if (hasMilestone("mu", 1)) return ""
                                                return "You are losing " + format(tmp.c.getLossRate.times(100)) + "% of your Carbon per second"
                                        },
                                ],

                                "blank", 
                                ["upgrades", [1,2,3,4,5,6,7]]],
                        unlocked(){
                                return true
                        },
                },
        },
        doReset(layer){},
})

addLayer("o", {
        name: "Oxygen", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "O", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: false,
		points: new Decimal(0),
                best: new Decimal(0),
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
                atomic_oxygen: {
                        points: new Decimal(0),
                        best: new Decimal(0),
                },
                ozone: {
                        points: new Decimal(0),
                        best: new Decimal(0),
                },
        }},
        color: "#58E3F1",
        branches: [],
        requires:() => hasUpgrade("c", 11) ? Decimal.pow(2, 2560) : Decimal.pow(2, 1024), // Can be a function that takes requirement increases into account
        resource: "Oxygen", // Name of prestige currency
        baseResource: "Life Points", // Name of resource prestige is based on
        baseAmount() {return player.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                if (!hasUpgrade("o", 11)) return new Decimal(0)
                let base = tmp.o.getBaseGain

                let mult = tmp.o.getGainMult

                let ret = base.times(mult)

                                                ret = ret.pow(tmp.tokens.buyables[53].effect)
                if (hasUpgrade("n", 11))        ret = ret.pow(1.001)

                if (hasUpgrade("tokens", 52))   ret = ret.times(player.c.points.max(1).pow(.1))

                if (inChallenge("n", 12))       ret = ret.root(2)

                return ret
        },
        getBaseGain(){
                let pts = player.points
                if (player.points.lt(2)) return new Decimal(0)
                let init = player.points.max(4).log(2).log(2)
                let base 
                if (hasUpgrade("h", 74)){
                        base = init.max(0).pow(2)
                } else {
                        base = init.sub(9).max(0).pow(2)
                }

                if (hasUpgrade("tokens", 21))   base = base.pow(3)
                if (hasMilestone("tokens", 17)) base = base.pow(3)
                if (hasUpgrade("h", 74))        base = base.pow(2)

                if (base.lt(1)) base = new Decimal(0)

                return base
        },
        getNextAt(){
                return new Decimal(0) //this doesnt matter
        },
        getLossRate() { //oxygen loss
                let ret = new Decimal(.01)

                if (hasUpgrade("h", 81)) ret = ret.times(50)
                if (hasUpgrade("n", 32)) ret = ret.times(100)

                return ret.max(.00001)
        }, //oxygen gain
        getGainMult(){
                if (inChallenge("n", 42)) return new Decimal(1)
                let x = new Decimal(1)

                if (hasUpgrade("o", 12))        x = x.times(tmp.o.upgrades[12].effect)
                if (hasUpgrade("o", 14))        x = x.times(tmp.o.upgrades[14].effect)
                if (hasUpgrade("h", 63))        x = x.times(tmp.h.upgrades[63].effect)
                                                x = x.times(tmp.tokens.buyables[23].effect)
                if (hasMilestone("tokens", 3))  x = x.times(player.ach.achievements.length)
                if (hasUpgrade("h", 71)) {
                                                x = x.times(Decimal.pow(player.tokens.coins.points.max(10).log10().min(5), player.h.upgrades.length))
                }
                if (hasUpgrade("tokens", 81))   x = x.times(81)
                if (hasMilestone("tokens", 23)) {
                        let c = tmp.tokens.milestones[23].effect
                        let base = player.c.points.max(10).log10()
                                                x = x.times(base.pow(c))
                }
                                                x = x.times(tmp.n.effect)

                return x
        },
        update(diff){
                let data = player.o
                
                if (data.best.gt(0)) data.unlocked = true
                else data.unlocked = (!player.c.best.gt(0) || player.points.max(2).log(2).gte(2560)) && player.points.max(2).log(2).gte(1024)
                data.best = data.best.max(data.points)
                
                // do oxygen gain
                if (hasMilestone("mu", 1)) data.points = data.points.plus(tmp.o.getResetGain.times(diff))
                else data.points = getLogisticAmount(data.points, tmp.o.getResetGain, tmp.o.getLossRate, diff)

                if (false) {
                        //do autobuyer stuff
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
                {key: "shift+O", description: "Shift+O: Go to Oxygen", onPress(){
                                if (!tmp.o.layerShown) return
                                showTab("o")
                        }
                },
        ],
        layerShown(){return hasUpgrade("h", 55) || tmp.n.layerShown},
        prestigeButtonText(){
                return "hello"
        },
        canReset(){
                return false
        },
        upgrades: {
                rows: 10,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(51) + "'>Oxygen I"
                        },
                        description(){
                                if (!shiftDown) return "Begin Production of Oxygen, but vastly increase the cost of Carbon I"
                                a = "(log2(log2(Life Points))-9)^2<br>*multipliers"
                                if (hasUpgrade("tokens", 21))   a = a.replace("^2", "^6")
                                if (hasMilestone("tokens", 17)) a = a.replace("^6", "^18")
                                if (hasUpgrade("h", 74))        a = "(log2(log2(Life Points)))^36<br>*multipliers"
                                return a
                        },
                        cost:() => Decimal.pow(2, hasUpgrade("c", 11) ? 2560 : 1024),
                        currencyLocation:() => player,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Life Points",
                        unlocked(){
                                return true
                        }, //hasUpgrade("o", 11)
                },
                12: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(52) + "'>Oxygen II"
                        },
                        description(){
                                if (!shiftDown) return "log10(Atomic Hydrogen)*<br>log10(Deuterium)/10^7 to Oxygen gain"
                                a = "log10(Atomic Hydrogen)*<br>log10(Deuterium)/10^7"
                                if (hasUpgrade("o", 12)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.o.upgrades[12].cost, player.o.points, tmp.o.getResetGain, tmp.o.getLossRate)
                        },
                        cost:() => new Decimal(30),
                        effect(){
                                let a = player.h.atomic_hydrogen.points.max(10).log10()
                                let b = player.h.deuterium.points.max(10).log10()

                                let ret = a.times(b).div(10**7).max(1)

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "o") return ""
                                if (player.subtabs.o.mainTabs != "Upgrades") return ""
                                return format(tmp.o.upgrades[12].effect)
                        },
                        unlocked(){
                                return hasMilestone("n", 6) || hasUpgrade("o", 11)
                        }, //hasUpgrade("o", 12)
                },
                13: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(53) + "'>Oxygen III"
                        },
                        description(){
                                if (!shiftDown) return "Each upgrade raises B Point and Life Point gain ^1.02"
                                a = "1.02^upgrades"
                                if (hasUpgrade("o", 13)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.o.upgrades[13].cost, player.o.points, tmp.o.getResetGain, tmp.o.getLossRate)
                        },
                        cost:() => new Decimal(200),
                        effect(){
                                let ret = Decimal.pow(1.02, player.o.upgrades.length)

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "o") return ""
                                if (player.subtabs.o.mainTabs != "Upgrades") return ""
                                return format(tmp.o.upgrades[13].effect)
                        },
                        unlocked(){
                                return hasMilestone("n", 6) || hasUpgrade("o", 12)
                        }, //hasUpgrade("o", 13)
                },
                14: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(54) + "'>Oxygen IV"
                        },
                        description(){
                                if (!shiftDown) return "ln(Oxygen) multiplies Oxygen gain"
                                a = "ln(Oxygen)"
                                if (hasUpgrade("o", 15))        a = "(ln(Oxygen))^2"
                                if (hasMilestone("tokens", 13)) a = a.replace("^2", "^4")
                                if (hasUpgrade("h", 81))        a = a.replace("^4", "^8")
                                if (hasUpgrade("o", 14)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.o.upgrades[14].cost, player.o.points, tmp.o.getResetGain, tmp.o.getLossRate)
                        },
                        cost:() => new Decimal(2000),
                        effect(){
                                let ret = player.o.points.max(1).ln().max(1)

                                if (hasUpgrade("o", 15)) ret = ret.pow(2)
                                if (hasMilestone("tokens", 13)) ret = ret.pow(2)
                                if (hasUpgrade("h", 81)) ret = ret.pow(2)

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "o") return ""
                                if (player.subtabs.o.mainTabs != "Upgrades") return ""
                                return format(tmp.o.upgrades[14].effect)
                        },
                        unlocked(){
                                return hasMilestone("n", 6) || hasUpgrade("o", 13)
                        }, //hasUpgrade("o", 14)
                },
                15: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(55) + "'>Oxygen V"
                        },
                        description(){
                                if (!shiftDown) return "Oxygen^upgrades multiplies Life Point gain and square Oxygen IV"
                                a = "min(1ee6, Oxygen) ^[upgrades]"
                                if (hasMilestone("tokens", 10)) a = "min(1ee6, Oxygen) ^[upgrades]<sup>2</sup>"
                                if (hasUpgrade("tokens", 11)) a = a.replace("[upgrades]","([upgrades]+3)")
                                if (hasUpgrade("o", 15)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.o.upgrades[15].cost, player.o.points, tmp.o.getResetGain, tmp.o.getLossRate)
                        },
                        cost:() => new Decimal(5e4),
                        effect(){
                                let base = player.o.points.max(1).min(Decimal.pow(10, 1e6))
                                
                                let exp = new Decimal(player.o.upgrades.length)
                                if (hasUpgrade("tokens", 11))   exp = exp.plus(3)
                                if (hasMilestone("tokens", 10)) exp = exp.pow(2)

                                let ret = base.pow(exp)

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "o") return ""
                                if (player.subtabs.o.mainTabs != "Upgrades") return ""
                                return format(tmp.o.upgrades[15].effect)
                        },
                        unlocked(){
                                return hasMilestone("n", 6) || hasUpgrade("o", 14)
                        }, //hasUpgrade("o", 15)
                },
                21: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(56) + "'>Oxygen VI"
                        },
                        description(){
                                if (!shiftDown) return "Oxygen multiplies Hydrogen gain and Hydrogen multiplies B Point gain"
                                let a = ""
                                if (hasUpgrade("o", 21)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.o.upgrades[21].cost, player.o.points, tmp.o.getResetGain, tmp.o.getLossRate)
                        },
                        cost:() => new Decimal(3e22),
                        unlocked(){
                                return hasMilestone("n", 6) || hasMilestone("tokens", 12)
                        }, //hasUpgrade("o", 21)
                },
                22: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(57) + "'>Oxygen VII"
                        },
                        description(){
                                if (!shiftDown) return "Multiply Gamma Ray base by log10(Life Points) and double coin gain"
                                let a = ""
                                if (hasUpgrade("o", 22)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.o.upgrades[22].cost, player.o.points, tmp.o.getResetGain, tmp.o.getLossRate)
                        },
                        cost:() => new Decimal(2e30),
                        unlocked(){
                                return hasMilestone("n", 6) || hasUpgrade("c", 21)
                        }, //hasUpgrade("o", 22)
                },
                23: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(58) + "'>Oxygen VIII"
                        },
                        description(){
                                if (!shiftDown) return "<bdi style='font-size: 80%'>Multiply Near-ultraviolet base by log10(Life Points) and Infrared and Visible effects are raised to [tokens]^3"
                                let a = "log10(Life Points)"
                                if (hasUpgrade("o", 23)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.o.upgrades[23].cost, player.o.points, tmp.o.getResetGain, tmp.o.getLossRate)
                        },
                        cost:() => new Decimal(2e48),
                        effect(){
                                let ret = player.points.max(1).log10().max(1)

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "o") return ""
                                if (player.subtabs.o.mainTabs != "Upgrades") return ""
                                return format(tmp.o.upgrades[23].effect)
                        },
                        unlocked(){
                                return hasMilestone("n", 6) || hasUpgrade("c", 22)
                        }, //hasUpgrade("o", 23)
                },
                24: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(59) + "'>Oxygen IX"
                        },
                        description(){
                                if (!shiftDown) return "Multiply Radio Wave base by log10(Life Points) and square it"
                                let a = "log10(Life Points)"
                                if (hasUpgrade("o", 24)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.o.upgrades[24].cost, player.o.points, tmp.o.getResetGain, tmp.o.getLossRate)
                        },
                        cost:() => new Decimal(5e155),
                        effect(){
                                let ret = player.points.max(1).log10().max(1)

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "o") return ""
                                if (player.subtabs.o.mainTabs != "Upgrades") return ""
                                return format(tmp.o.upgrades[24].effect)
                        },
                        unlocked(){
                                return hasMilestone("n", 6) || hasUpgrade("h", 81)
                        }, //hasUpgrade("o", 24)
                },
                25: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(60) + "'>Oxygen X"
                        },
                        description(){
                                if (!shiftDown) return "Multiply and then exponentiate X-Ray base by the number of upgrades*pi"
                                let a = ""
                                if (hasUpgrade("o", 25)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.o.upgrades[25].cost, player.o.points, tmp.o.getResetGain, tmp.o.getLossRate)
                        },
                        cost:() => new Decimal(7e209),
                        effect(){
                                let ret = new Decimal(player.o.upgrades.length).times(Math.PI)

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "o") return ""
                                if (player.subtabs.o.mainTabs != "Upgrades") return ""
                                return format(tmp.o.upgrades[25].effect)
                        },
                        unlocked(){
                                return hasMilestone("n", 6) || hasUpgrade("c", 24)
                        }, //hasUpgrade("o", 25)
                },
                31: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(61) + "'>Oxygen XI"
                        },
                        description(){
                                let a = "You can bulk 10x A, B, and C buyables"
                                return a 
                        },
                        cost:() => new Decimal(2048),
                        currencyLocation:() => player.n,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Nitrogen",
                        unlocked(){
                                return hasMilestone("n", 10) || hasUpgrade("n", 25)
                        }, // hasUpgrade("o", 31)
                },
                32: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(62) + "'>Oxygen XII"
                        },
                        description(){
                                let a = "Add .08 to color gain exponent and apply the prior upgrade again"
                                return a 
                        },
                        cost:() => Decimal.pow(10, 314000),
                        unlocked(){
                                return hasMilestone("n", 10) || hasUpgrade("o", 31)
                        }, // hasUpgrade("o", 32)
                },
                33: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(63) + "'>Oxygen XIII"
                        },
                        description(){
                                let a = "Square " + makeBlue("a") + " and you bulk 2x E buyables per upgrade in this row"
                                return a 
                        },
                        cost:() => Decimal.pow(10, 28274e3),
                        unlocked(){
                                return hasMilestone("n", 10) || hasUpgrade("c", 33)
                        }, // hasUpgrade("o", 33)
                },
                34: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(63) + "'>Oxygen XIV"
                        },
                        description(){
                                let a = "Commutativity of addition outer log10 becomes ln"
                                return a 
                        },
                        cost:() => Decimal.pow(10, 29185e3),
                        unlocked(){
                                return hasMilestone("n", 10) || hasUpgrade("o", 33)
                        }, // hasUpgrade("o", 34)
                },
                35: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(64) + "'>Oxygen XV"
                        },
                        description(){
                                let a = "Nitrogen<sup>.26</sup> multiplies E Point gain and you bulk 5x E buyables"
                                return a 
                        },
                        cost:() => Decimal.pow(10, player.hardMode ? 404e6 : 403e6),
                        unlocked(){
                                return hasMilestone("n", 10) || hasUpgrade("c", 35)
                        }, // hasUpgrade("o", 35)
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                if (player.tab != "o") return ""
                                                if (player.subtabs.o.mainTabs != "Upgrades") return ""
                                                if (shiftDown) return "Your best Oxygen is " + format(player.o.best) + " and you are netting " + format(tmp.o.getResetGain.sub(tmp.o.getLossRate.times(player.o.points))) + " Oxygen per second"
                                                return "You are gaining " + format(tmp.o.getResetGain) + " Oxygen per second"
                                        }
                                ],
                                ["display-text",
                                        function() {
                                                if (player.tab != "o") return ""
                                                if (player.subtabs.o.mainTabs != "Upgrades") return ""
                                                if (hasMilestone("mu", 1)) return ""
                                                return "You are losing " + format(tmp.o.getLossRate.times(100)) + "% of your Oxygen per second"
                                        },
                                ],

                                "blank", 
                                ["upgrades", [1,2,3,4,5,6,7]]],
                        unlocked(){
                                return true
                        },
                },
        },
        doReset(layer){},
})

addLayer("n", {
        name: "Nitrogen", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "N", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: false,
		points: new Decimal(0),
                best: new Decimal(0),
                total: new Decimal(0),
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
                passivetime: 0,
        }},
        color: "#99582E",
        branches: [],
        requires:() => Decimal.pow(2, Decimal.pow(2, 20).times(100)), // Can be a function that takes requirement increases into account
        resource: "Nitrogen", // Name of prestige currency
        baseResource: "Life Points", // Name of resource prestige is based on
        baseAmount() {return player.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                let base = tmp.n.getBaseGain
                let mult = tmp.n.getGainMult

                let ret = base.times(mult)

                return ret.floor()
        },
        getGainExp(){
                let ret = new Decimal(3)
                if (hasUpgrade("c", 31))        ret = ret.times(2)
                if (hasUpgrade("mini", 82))     ret = ret.times(2)

                return ret
        },
        getBaseGain(){
                let pts = player.points
                if (player.points.lt(10)) return new Decimal(0)

                let init = pts.log10().div(105)
                let exp = tmp.n.getGainExp

                if (init.lt(1)) return new Decimal(0)

                let base = init.log(2).sub(19).max(0).pow(exp)

                if (base.lt(1)) base = new Decimal(0)

                return base
        },
        getNextAt(){
                let curr = tmp.n.getResetGain
                let v1 = curr.plus(1).div(tmp.n.getGainMult).max(1)
                let v2 = v1.root(tmp.n.getGainExp).plus(19)
                let v3 = Decimal.pow(2, v2)
                let v4 = v3.times(105)
                let v5 = Decimal.pow(10, v4)
                return v5
        },
        getGainMult(){//nitrogen gain
                let x = new Decimal(1)

                if (hasUpgrade("n", 24))        x = x.times(tmp.n.upgrades[24].effect)
                if (hasUpgrade("mini", 73))     x = x.times(tmp.mini.d_points.getEffectiveFuelAux.max(1))
                if (hasUpgrade("mini", 81))     x = x.times(tmp.mini.d_points.getUpgrades)
                if (hasUpgrade("n", 35)) {
                        let rede = tmp.n.upgrades[35].effect
                                                x = x.times(player.points.max(10).log10().log10().max(1).pow(rede))
                }
                if (hasUpgrade("n", 41))        x = x.times(player.mini.e_points.points.max(10).log10())
                if (hasUpgrade("n", 53))        x = x.times(Decimal.pow(1.01, player.mini.buyables[211]))
                                                x = x.times(player.p.points.plus(1))
                if (hasUpgrade("p", 14))        x = x.times(tmp.p.upgrades[14].effect)

                return x
        },
        effect(){
                let amt = player.n.total

                let base = amt.sqrt().times(2).plus(1)

                let exp = amt.plus(7).log2()

                if (hasUpgrade("n", 25)) exp = exp.times(player.n.upgrades.length)

                let ret = base.pow(exp)

                return ret
        },
        effectDescription(){
                if (player.tab != "n") return ""
                if (shiftDown) {
                        let a = "effect formula: (sqrt(x)*2+1)^log2(x+7)"
                        return a
                }
                let eff = tmp.n.effect
                let effstr = format(eff)
                let start = " multiplying Point, Hydrogen, Oxygen, Carbon, C Point, and color production gain by "
                let end = "."
                return start + effstr + end
        },
        update(diff){
                let data = player.n
                
                if (tmp.n.layerShown) data.unlocked = true
                data.best = data.best.max(data.points)
                
                // do nitrogen gain
                if (hasMilestone("n", 13)) {
                        let g = tmp.n.getResetGain
                        if (hasUpgrade("mini", 75) && g.times(1e4).gt(data.points)) {
                                let div = player.hardMode ? 100 : 1000
                                let rem = data.points.div(g).sub(1e4).times(-1).div(div) 
                                //number of seconds left of fast stuff
                                if (rem.lt(diff)) {
                                        let prodTime = rem.times(div).plus(diff).sub(rem)
                                        let prod = g.times(prodTime)
                                        // do rem worth of fast and the rest worth of slow
                                        data.points = data.points.plus(prod)
                                        //                   [normal speed]  [1e4 of fast]

                                        data.total = data.total.plus(prod)
                                } else {
                                        data.points = data.points.plus(g.times(diff).times(div))
                                        data.total = data.total.plus(g.times(diff).times(div))
                                }
                        } else {
                                data.points = data.points.plus(tmp.n.getResetGain.times(diff))
                                data.total = data.total.plus(tmp.n.getResetGain.times(diff))
                        }
                        data.passivetime += Math.min(1, diff)
                        if (data.passivetime > 1) {
                                data.passivetime += -1
                                data.times ++
                        }
                }

                if (hasUpgrade("p", 11)) {
                        let m = .5
                        data.points = data.points.plus(diff * m)
                        data.total = data.total.plus(diff * m)
                }

                if (false) {
                        //do autobuyer stuff
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        row: 2, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
                {key: "shift+N", description: "Shift+N: Go to Nitrogen", onPress(){
                                if (!tmp.n.layerShown) return
                                showTab("n")
                        }
                },
                {key: "n", description: "N: Reset for Nitrogen", onPress(){
                                if (canReset("n")) doReset("n")
                        }
                },
        ],
        layerShown(){return hasUpgrade("mini", 45) || player.n.best.gt(0) || player.p.best.gt(0)},
        prestigeButtonText(){
                if (player.tab != "n") return ""
                
                let gain = tmp.n.getResetGain
                let nextAt = tmp.n.getNextAt
                if (gain.eq(0)) {
                        let a = "You cannot reset for Nitrogen, you need<br>"
                        let b = format(nextAt) + " Life Points for the first"
                }
                let amt = "You can reset for <br>" + formatWhole(gain) + " Nitrogen"
                let nxt = ""
                if (gain.lt(1000)) nxt = "<br>You need " + format(nextAt) + "<br>Life Points for the next"
                if (player.n.time > 1 && gain.lt(1e6) && gain.gt(1) && shiftDown) nxt += "<br>" + format(gain.div(player.n.time)) + "/s"
                return amt + nxt
        },
        canReset(){
                return !hasMilestone("n", 13) && tmp.n.getResetGain.gt(0) && hasUpgrade("mini", 45)
        },
        upgrades: {
                rows: 10,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(63) + "'>Nitrogen I"
                        },
                        description(){
                                let a = "All previous primary currencies (hold shift to see) gain is raised ^ 1.001"
                                if (shiftDown) {
                                        return "Life Points, Hydrogen, Oxygen, Carbon, A Points, B Points, C Points, and Coins"
                                }
                                return a
                        },
                        cost:() => new Decimal(1),
                        unlocked(){
                                return true
                        }, // hasUpgrade("n", 11)
                },
                12: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(64) + "'>Nitrogen II"
                        },
                        description(){
                                let a = "A Point gain is raised ^ 1.02"
                                return a
                        },
                        cost:() => new Decimal(1),
                        unlocked(){
                                return true
                        }, // hasUpgrade("n", 12)
                },
                13: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(65) + "'>Nitrogen III"
                        },
                        description(){
                                let a = "B Point gain is raised ^ 1.02"
                                return a
                        },
                        cost:() => new Decimal(1),
                        unlocked(){
                                return true
                        }, // hasUpgrade("n", 13)
                },
                14: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(66) + "'>Nitrogen IV"
                        },
                        description(){
                                let a = "Add .001 to Cubic base"
                                return a
                        },
                        cost:() => new Decimal(1),
                        unlocked(){
                                return true
                        }, // hasUpgrade("n", 14)
                },
                15: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(67) + "'>Nitrogen V"
                        },
                        description(){
                                let a = "Add .001 to Polynomial base"
                                return a
                        },
                        cost:() => new Decimal(1),
                        unlocked(){
                                return true
                        }, // hasUpgrade("n", 15)
                },
                21: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(68) + "'>Nitrogen VI"
                        },
                        description(){
                                let a = "Each upgrade adds .001 to Exponential base"
                                return a
                        },
                        cost:() => new Decimal(2),
                        unlocked(){
                                return hasMilestone("p", 4) || hasUpgrade("n", 11) && hasUpgrade("n", 12) && hasUpgrade("n", 13) && hasUpgrade("n", 14) && hasUpgrade("n", 15)
                        }, // hasUpgrade("n", 21)
                },
                22: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(69) + "'>Nitrogen VII"
                        },
                        description(){
                                let a = "Keep the first row of Oxygen and Carbon upgrades upon Nitrogen reset and each upgrade raises C point gain ^1.0002"
                                return a
                        },
                        cost:() => new Decimal(3),
                        unlocked(){
                                return hasMilestone("p", 4) || hasUpgrade("n", 21) 
                        }, // hasUpgrade("n", 22)
                },
                23: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(70) + "'>Nitrogen VIII"
                        },
                        description(){ 
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Upgrades") return ""

                                let a = "Per upgrade multiply C Point and Carbon gain by best Nitrogen<br>Currently: "
                                let b = format(tmp.n.upgrades[23].effect)
                                return a + b
                        },
                        cost:() => new Decimal(20),
                        effect(){
                                return player.n.best.max(1).pow(player.n.upgrades.length)
                        },
                        unlocked(){
                                return hasMilestone("p", 4) || hasMilestone("n", 11) || player.n.best.gt(19) 
                        }, // hasUpgrade("n", 23)
                },
                24: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(71) + "'>Nitrogen IX"
                        },
                        description(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Upgrades") return ""
                                
                                if (shiftDown) {
                                        let a = "ln(Max(e,Nitrogen))"
                                        if (hasMilestone("n", 15)) a += " ^[challenges]"
                                        return a
                                }
                                let a = "Token cost exponent is .55 and ln(Nitrogen) multiplies Nitrogen<br>"
                                let b = "Currently: " + format(tmp.n.upgrades[24].effect)
                                return a + b
                        },
                        cost:() => new Decimal(15),
                        effect(){
                                let ret = player.n.points.max(1).ln().max(1)

                                if (hasMilestone("n", 15)) {
                                        ret = ret.pow(Math.max(1, layerChallengeCompletions("n")))
                                }

                                return ret
                        },
                        unlocked(){
                                return hasMilestone("p", 4) || hasUpgrade("n", 23)
                        }, // hasUpgrade("n", 24)
                },
                25: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(72) + "'>Nitrogen X"
                        },
                        description(){
                                let a = "Double-exponential divider is 1 and raise Nitrogen effect to the number of upgrades"
                                return a
                        },
                        cost:() => new Decimal(100),
                        unlocked(){
                                return hasMilestone("p", 4) || hasUpgrade("n", 24)
                        }, // hasUpgrade("n", 25)
                },
                31: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(73) + "'>Nitrogen XI"
                        },
                        description(){
                                let a = "Token buyable exponent is .5"
                                return a
                        },
                        cost:() => new Decimal(3e8),
                        unlocked(){
                                return hasMilestone("p", 4) || hasChallenge("n", 21)
                        }, // hasUpgrade("n", 31)
                },
                32: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(74) + "'>Nitrogen XII"
                        },
                        description(){
                                let a = "You lose 100x Oxygen, Carbon, and Hydrogen"
                                return a
                        },
                        cost:() => new Decimal(1e11),
                        unlocked(){
                                return hasMilestone("p", 4) || hasChallenge("n", 22)
                        }, // hasUpgrade("n", 32)
                },
                33: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(75) + "'>Nitrogen XIII"
                        },
                        description(){
                                let a = "Fuel<sup>.001</sup> multiplies D Point gain"
                                return a
                        },
                        cost:() => new Decimal(5.48e27),
                        unlocked(){
                                return hasMilestone("p", 4) || getBuyableAmount("mini", 181).gte(75)
                        }, // hasUpgrade("n", 33)
                },
                34: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(76) + "'>Nitrogen XIV"
                        },
                        description(){
                                let a = "Per upgrade D Points<sup>.01</sup> multiplies maxmimum fuel"
                                return a
                        },
                        cost:() => new Decimal(2.75e32),
                        unlocked(){
                                return hasMilestone("p", 4) || getBuyableAmount("mini", 181).gte(145)
                        }, // hasUpgrade("n", 34)
                },
                35: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(76) + "'>Nitrogen XV"
                        },
                        description(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Upgrades") return ""
                                
                                let a = "log10(log10(Points))<sup>" + makeRed("E") + "</sup> multiplies Nitrogen gain"
                                let b = "<br>"
                                let c = "Currently: " + makeRed("E") + "=" + format(tmp.n.upgrades[35].effect)
                                return a + b + c
                        },
                        effect(){ // red e rede
                                let ret = new Decimal(1)

                                ret = ret.plus(tmp.mini.buyables[232].effect)
                                if (hasMilestone("mu", 3)) ret = ret.plus(getBuyableAmount("mini", 231).div(100))

                                return ret
                        },
                        cost:() => new Decimal(3e32),
                        unlocked(){
                                return hasMilestone("p", 4) || getBuyableAmount("mini", 181).gte(153)
                        }, // hasUpgrade("n", 35)
                },
                41: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(77) + "'>Nitrogen XVI"
                        },
                        canAfford(){
                                if (player.n.points.lt(tmp.n.upgrades[41].cost)) return false
                                return player.mini.e_points.best.gte(1e16)
                        },
                        description(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Upgrades") return ""
                                
                                let b = "Req: 1e16 E Points<br>"
                                let a = "log10(Nitrogen) multiplies E Point gain and log10(E Points) multiplies Nitrogen gain"
                                if (!hasUpgrade("n", 41)) {
                                        return "<bdi style='font-size: 80%'>" + b + a + "</bdi>"
                                }
                                return a
                        },
                        cost:() => new Decimal(4.2e33),
                        unlocked(){
                                return hasMilestone("p", 4) || hasUpgrade("n", 35)
                        }, // hasUpgrade("n", 41)
                },
                42: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(78) + "'>Nitrogen XVII"
                        },
                        canAfford(){
                                if (player.n.points.lt(tmp.n.upgrades[42].cost)) return false
                                return player.mini.e_points.best.gte(1e81)
                        },
                        description(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Upgrades") return ""
                                
                                let b = "Req: 1e81 E Points<br>"
                                let a = "Add .1 to " + makeBlue("a")
                                if (!hasUpgrade("n", 42)) return b + a
                                return a
                        },
                        cost:() => new Decimal(5.6e35),
                        unlocked(){
                                return hasMilestone("p", 4) || hasUpgrade("n", 41)
                        }, // hasUpgrade("n", 42)
                },
                43: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(79) + "'>Nitrogen XVIII"
                        },
                        canAfford(){
                                if (player.n.points.lt(tmp.n.upgrades[43].cost)) return false
                                return player.mini.e_points.best.gte(1e162)
                        },
                        description(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Upgrades") return ""
                                
                                let b = "Req: 1e162 E Points<br>"
                                let a = "Add .1 to " + makeBlue("a") + " and Quadratic gains a ln(x) term"
                                if (!hasUpgrade("n", 43)) return b + a
                                return a
                        },
                        cost:() => new Decimal(1.24e36),
                        unlocked(){
                                return hasMilestone("p", 4) || hasUpgrade("n", 42)
                        }, // hasUpgrade("n", 43)
                },
                44: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(80) + "'>Nitrogen XIX"
                        },
                        canAfford(){
                                if (player.n.points.lt(tmp.n.upgrades[44].cost)) return false
                                return player.mini.e_points.best.gte(1e197)
                        },
                        description(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Upgrades") return ""
                                
                                let b = "Req: 1e197 E Points<br>"
                                let a = "Per existence of 1 add .01 to " + makeBlue("a")
                                if (!hasUpgrade("n", 44)) return b + a
                                return a
                        },
                        cost:() => new Decimal(1.58e36),
                        unlocked(){
                                return hasMilestone("p", 4) || hasUpgrade("n", 43)
                        }, // hasUpgrade("n", 44)
                },
                45: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(81) + "'>Nitrogen XX"
                        },
                        canAfford(){
                                if (player.n.points.lt(tmp.n.upgrades[45].cost)) return false
                                return player.mini.e_points.best.gte(1e213)
                        },
                        description(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Upgrades") return ""
                                
                                let b = "Req: 1e213 E Points<br>"
                                let a = "log10(E Points) multiplies E Points and each existence of 0 past 21 multiplies E Point gain by 2"
                                if (!hasUpgrade("n", 45)) return b + a
                                return a
                        },
                        cost:() => new Decimal(1.80e36),
                        unlocked(){
                                return hasMilestone("p", 4) || hasUpgrade("n", 44)
                        }, // hasUpgrade("n", 45)
                },
                51: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(82) + "'>Nitrogen XXI"
                        },
                        canAfford(){
                                if (player.n.points.lt(tmp.n.upgrades[51].cost)) return false
                                return player.mini.e_points.best.gte(1e234)
                        },
                        description(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Upgrades") return ""
                                
                                let b = "Req: 1e234 E Points<br>"
                                let a = "Each upgrade in this row reapplies the second part of Nitrogen XX and doubles E Point gain"
                                if (!hasUpgrade("n", 51)) return b + a
                                return a
                        },
                        cost:() => new Decimal(2.10e36),
                        unlocked(){
                                return hasMilestone("p", 4) || hasUpgrade("n", 45)
                        }, // hasUpgrade("n", 51)
                },
                52: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(83) + "'>Nitrogen XXII"
                        },
                        description(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Upgrades") return ""
                                
                                let a = "Autobuy E buyables"
                                return a
                        },
                        cost:() => new Decimal(7e36),
                        unlocked(){
                                return hasMilestone("p", 4) || hasUpgrade("n", 51)
                        }, // hasUpgrade("n", 52)
                },
                53: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(84) + "'>Nitrogen XXIII"
                        },
                        canAfford(){
                                if (player.n.points.lt(tmp.n.upgrades[53].cost)) return false
                                return player.mini.e_points.best.gte("1e1604")
                        },
                        description(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Upgrades") return ""
                                
                                let b = "Req: 1e1604 E Points<br>"
                                let a = "Each Quadratic multiplies Nitrogen gain by 1.01"
                                if (!hasUpgrade("n", 53)) return b + a
                                return a
                        },
                        cost:() => new Decimal(1.83e37),
                        unlocked(){
                                return hasMilestone("p", 4) || hasUpgrade("n", 52)
                        }, // hasUpgrade("n", 53)
                },
                54: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(85) + "'>Nitrogen XXIV"
                        },
                        description(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Upgrades") return ""
                                
                                let a = "Existence of 0 effects fuel square rooting factor and you can buy each buyable every tick"
                                return a
                        },
                        cost:() => new Decimal(1.44e42),
                        unlocked(){
                                return hasMilestone("p", 4) || hasUpgrade("n", 53)
                        }, // hasUpgrade("n", 54)
                },
                55: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(85) + "'>Nitrogen XXV"
                        },
                        description(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Upgrades") return ""
                                
                                let a = "E Points multiply D Points (up to 1e50000)"
                                return a
                        },
                        cost:() => new Decimal(4.75e53),
                        unlocked(){
                                return hasMilestone("p", 4) || hasUpgrade("n", 54)
                        }, // hasUpgrade("n", 55)
                },
        },
        milestones: {
                1: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.n.milestones[1].requirement)
                                let b = " Nitrogen reset"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(1)
                        },
                        done(){
                                return tmp.n.milestones[1].requirement.lte(player.n.times)
                        },
                        unlocked(){
                                return true
                        },
                        effect(){
                                return new Decimal(1)
                        },
                        effectDescription(){
                                let a = "Reward: Token resets keep Hydrogen upgrades, the A and B buyable autobuyer bulks 5x, and per milestone squared multiply C Point gain by 10.<br>"
                                return a
                        },
                }, // hasMilestone("n", 1)
                2: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.n.milestones[2].requirement)
                                let b = " Nitrogen resets"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(2)
                        },
                        done(){
                                return tmp.n.milestones[2].requirement.lte(player.n.times)
                        },
                        unlocked(){
                                return hasMilestone("n", 1)
                        },
                        effect(){
                                return new Decimal(1)
                        },
                        effectDescription(){
                                let a = "Reward: You can bulk 5x C buyables, 4x A and B buyables, gain 10x coins, and keep a token milestone per Nitrogen reset.<br>"
                                return a
                        },
                }, // hasMilestone("n", 2)
                3: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.n.milestones[3].requirement)
                                let b = " Nitrogen resets"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(3)
                        },
                        done(){
                                return tmp.n.milestones[3].requirement.lte(player.n.times)
                        },
                        unlocked(){
                                return hasMilestone("n", 2)
                        },
                        effect(){
                                return new Decimal(1)
                        },
                        effectDescription(){
                                let a = "Reward: Keep Corn and Deuterium VIII, Corn interval is at most 5, and gain 100x A, B, and C Points.<br>"
                                return a
                        },
                }, // hasMilestone("n", 3)
                4: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.n.milestones[4].requirement)
                                let b = " Nitrogen resets"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(player.hardMode ? 5 : 4)
                        },
                        done(){
                                return tmp.n.milestones[4].requirement.lte(player.n.times)
                        },
                        unlocked(){
                                return hasMilestone("n", 3)
                        },
                        effect(){
                                return new Decimal(1)
                        },
                        toggles:() => [["tokens", "autobuytokens"]],
                        effectDescription(){
                                let a = "Reward: Keep Coffee, autobuy tokens, and you can bulk 4x C buyables.<br>"
                                return a
                        },
                }, // hasMilestone("n", 4)
                5: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.n.milestones[5].requirement)
                                let b = " Nitrogen resets"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(player.hardMode ? 7 : 5)
                        },
                        done(){
                                return tmp.n.milestones[5].requirement.lte(player.n.times)
                        },
                        unlocked(){
                                return hasMilestone("n", 4)
                        },
                        effect(){
                                return new Decimal(1)
                        },
                        effectDescription(){
                                let a = "Reward: Keep Cookie and here..., coin upgrades are always possible to buy, and tokens do not reset Oxygen upgrades.<br>"
                                return a
                        },
                }, // hasMilestone("n", 5)
                6: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.n.milestones[6].requirement)
                                let b = " Nitrogen resets"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(player.hardMode ? 9 : 6)
                        },
                        done(){
                                return tmp.n.milestones[6].requirement.lte(player.n.times)
                        },
                        unlocked(){
                                return hasMilestone("n", 5)
                        },
                        effect(){
                                return new Decimal(1)
                        },
                        effectDescription(){
                                let a = "Reward: Keep Carbon and Oxygen upgrades unlocked and tokens do not reset Carbon upgrades.<br>"
                                return a
                        },
                }, // hasMilestone("n", 6)
                7: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.n.milestones[7].requirement)
                                let b = " Nitrogen resets"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(player.hardMode ? 11 : 7)
                        },
                        done(){
                                return tmp.n.milestones[7].requirement.lte(player.n.times)
                        },
                        unlocked(){
                                return hasMilestone("n", 6)
                        },
                        effect(){
                                return new Decimal(1)
                        },
                        toggles:() => [["tokens", "autobuyradio"]],
                        effectDescription(){
                                let a = "Reward: Keep one C point upgrade per reset and unlock an autobuyer for Radio Waves.<br>"
                                return a
                        },
                }, // hasMilestone("n", 7)
                8: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.n.milestones[8].requirement)
                                let b = " Nitrogen resets"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(player.hardMode ? 14 : 9)
                        },
                        done(){
                                return tmp.n.milestones[8].requirement.lte(player.n.times)
                        },
                        unlocked(){
                                return hasMilestone("n", 7)
                        },
                        effect(){
                                return new Decimal(1)
                        },
                        effectDescription(){
                                let a = "Reward: Gain 20x coins, keep Egg is here., and you can autobuyer the first level of C buyables.<br>"
                                return a
                        },
                }, // hasMilestone("n", 8)
                9: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.n.milestones[9].requirement)
                                let b = " Nitrogen resets"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(player.hardMode ? 17 : 12)
                        },
                        done(){
                                return tmp.n.milestones[9].requirement.lte(player.n.times)
                        },
                        unlocked(){
                                return hasMilestone("n", 8)
                        },
                        effect(){
                                return new Decimal(1)
                        },
                        effectDescription(){
                                let a = "Reward: Keep coin upgrades.<br>"
                                return a
                        },
                }, // hasMilestone("n", 9)
                10: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.n.milestones[10].requirement)
                                let b = " Nitrogen resets"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(player.hardMode ? 21 : 15)
                        },
                        done(){
                                return tmp.n.milestones[10].requirement.lte(player.n.times)
                        },
                        unlocked(){
                                return hasMilestone("n", 9)
                        },
                        effect(){
                                return new Decimal(1)
                        },
                        effectDescription(){
                                let a = "Reward: Keep all Oxygen and Carbon upgrades upon Nitrogen reset.<br>"
                                if (player.p.times > 0) a = a.replace("Nitrogen reset", "Nitrogen or Phosphorus resets")
                                return a
                        },
                }, // hasMilestone("n", 10)
                11: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.n.milestones[11].requirement)
                                let b = " Nitrogen resets"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(player.hardMode ? 25 : 20)
                        },
                        done(){
                                return tmp.n.milestones[11].requirement.lte(player.n.times)
                        },
                        unlocked(){
                                return hasMilestone("n", 10)
                        },
                        effect(){
                                return new Decimal(1)
                        },
                        effectDescription(){
                                let a = "Reward: Token resets don't reset anything.<br>"
                                return a
                        },
                }, // hasMilestone("n", 11)
                12: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.n.milestones[12].requirement)
                                let b = " Nitrogen"
                                return a + b
                        },
                        requirement(){
                                let m = player.hardMode ? 5 : 1
                                return Decimal.pow(2, 7).times(m)
                        },
                        done(){
                                return tmp.n.milestones[12].requirement.lte(player.n.points)
                        },
                        unlocked(){
                                return hasMilestone("n", 11)
                        },
                        effect(){
                                return new Decimal(1)
                        },
                        effectDescription(){
                                let a = "Reward: Start with 50 tokens.<br>"
                                return a
                        },
                }, // hasMilestone("n", 12)
                13: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.n.milestones[13].requirement)
                                let b = " Nitrogen"
                                return a + b
                        },
                        requirement(){
                                let m = player.hardMode ? 10 : 1
                                return Decimal.pow(2, 8).times(m)
                        },
                        done(){
                                return tmp.n.milestones[13].requirement.lte(player.n.points)
                        },
                        unlocked(){
                                return hasMilestone("n", 12)
                        },
                        effect(){
                                return new Decimal(1)
                        },
                        effectDescription(){
                                let a = "Reward: Remove the ability to reset for Nitrogen, but get 100% of Nitrogen gain per second.<br>"
                                return a
                        },
                }, // hasMilestone("n", 13)
                14: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.n.milestones[14].requirement)
                                let b = " Nitrogen"
                                return a + b
                        },
                        requirement(){
                                let m = player.hardMode ? 10 : 1
                                return Decimal.pow(2, 17).times(m)
                        },
                        done(){
                                return tmp.n.milestones[14].requirement.lte(player.n.points)
                        },
                        unlocked(){
                                return hasMilestone("n", 13)
                        },
                        effect(){
                                return new Decimal(1)
                        },
                        effectDescription(){
                                let a = "Reward: Unlock Nitrogen challenges, which only keep content from before tokens and C Point gain 5's log10 becomes ln.<br>"
                                return a
                        },
                }, // hasMilestone("n", 14)
                15: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.n.milestones[15].requirement)
                                let b = " Nitrogen and 3 Nitrogen challenges"
                                return a + b
                        },
                        requirement(){
                                let m = player.hardMode ? 10 : 1
                                return Decimal.pow(2, 20).times(m)
                        },
                        done(){
                                return tmp.n.milestones[15].requirement.lte(player.n.points) && layerChallengeCompletions("n") >= 3
                        },
                        unlocked(){
                                return hasMilestone("n", 14)
                        },
                        effect(){
                                return new Decimal(1)
                        },
                        effectDescription(){
                                let a = "Reward: Raise Nitrogen IX to the number of N challenge completions.<br>"
                                return a
                        },
                }, // hasMilestone("n", 15)
                16: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.n.milestones[16].requirement)
                                let b = " Nitrogen"
                                return a + b
                        },
                        requirement(){
                                let m = player.hardMode ? 10 : 1
                                return Decimal.pow(2, 30).times(m)
                        },
                        done(){
                                return tmp.n.milestones[16].requirement.lte(player.n.points)
                        },
                        unlocked(){
                                return hasMilestone("n", 15)
                        },
                        effect(){
                                return new Decimal(1)
                        },
                        effectDescription(){
                                let a = "Reward: C Point gain 10 amount multiplies its base.<br>"
                                return a
                        },
                }, // hasMilestone("n", 16)
                17: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.n.milestones[17].requirement)
                                let b = " Nitrogen"
                                return a + b
                        },
                        requirement(){
                                let m = player.hardMode ? 10 : 1
                                return Decimal.pow(10, 46).times(m)
                        },
                        done(){
                                return tmp.n.milestones[17].requirement.lte(player.n.points)
                        },
                        unlocked(){
                                return hasMilestone("n", 16) && player.mini.e_points.best.gte(1e300)
                        },
                        effectDescription(){
                                let a = "Reward: You can bulk 5x E buyables.<br>"
                                return a
                        },
                }, // hasMilestone("n", 17)
                18: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.n.milestones[18].requirement)
                                let b = " Nitrogen"
                                return a + b
                        },
                        requirement(){
                                let m = player.hardMode ? 7.5 : 7.4
                                return Decimal.pow(10, 942).times(m)
                        },
                        done(){
                                return tmp.n.milestones[18].requirement.lte(player.n.points)
                        },
                        unlocked(){
                                return hasMilestone("n", 17)
                        },
                        effectDescription(){
                                let a = "Reward: Add .01 to to left distributivity.<br>"
                                return a
                        },
                }, // hasMilestone("n", 18)
        },
        challenges: {
                11: {
                        name: "Four",
                        challengeDescription: "A buyables and <bdi style='color:#CC0033'>C</bdi> increase 1 effects are nullified",
                        goalDescription(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Challenges") return ""
                                if (!["1", "All"].includes(player.subtabs.n.challenge_content)) return ""
                                return format(tmp.n.challenges[11].goal) + " Points"
                        },
                        goal: () => Decimal.pow(10, player.hardMode ? 291590e3 : 287e6),
                        canComplete: () => player.points.gte(tmp.n.challenges[11].goal),
                        rewardDescription(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Challenges") return ""
                                if (!["1", "All"].includes(player.subtabs.n.challenge_content)) return ""
                                let a = "Per N challenge completion add .001 to Semi-exponential base"
                                let b = "<br>"
                                let c = "Currently: +" + format(tmp.n.challenges[11].rewardEffect, 3)
                                return a + b + c
                        },
                        rewardEffect() {
                                let comps = layerChallengeCompletions("n")
                                return Decimal.times(comps, .001)
                        },
                        unlocked(){
                                return true
                        },
                        countsAs: [],
                }, // inChallenge("n", 11)
                12: {
                        name: "Six",
                        challengeDescription: "Square root Oxygen gain",
                        goalDescription(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Challenges") return ""
                                if (!["1", "All"].includes(player.subtabs.n.challenge_content)) return ""
                                return format(tmp.n.challenges[12].goal) + " Points"
                        },
                        goal: () => Decimal.pow(10, 109.3e6),
                        canComplete: () => player.points.gte(tmp.n.challenges[12].goal),
                        rewardDescription(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Challenges") return ""
                                if (!["1", "All"].includes(player.subtabs.n.challenge_content)) return ""
                                let a = "C Point gain 9's log10 becomes ln"
                                return a
                        },
                        unlocked(){
                                return hasChallenge("n", 11)
                        },
                        countsAs: [],
                }, // inChallenge("n", 12)
                21: {
                        name: "Nine",
                        challengeDescription: "Four and C Point gain 6 is nullified",
                        goalDescription(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Challenges") return ""
                                if (!["2", "All"].includes(player.subtabs.n.challenge_content)) return ""
                                return format(tmp.n.challenges[21].goal) + " Points"
                        },
                        goal: () => Decimal.pow(10, 74e5),
                        canComplete: () => player.points.gte(tmp.n.challenges[21].goal),
                        rewardDescription(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Challenges") return ""
                                if (!["2", "All"].includes(player.subtabs.n.challenge_content)) return ""
                                let a = "<bdi style='color:#CC0033'>C</bdi> increase 1 base is multiplied by the square root of the number of challenge completions"
                                let b = "<br>"
                                let c = "Currently: *" + format(tmp.n.challenges[21].rewardEffect, 3)
                                return a + b + c
                        },
                        rewardEffect() {
                                let comps = layerChallengeCompletions("n")
                                return Decimal.sqrt(comps)
                        },
                        unlocked(){
                                return hasChallenge("n", 12)
                        },
                        countsAs: [11],
                }, // inChallenge("n", 21)
                22: {
                        name: "Ten",
                        challengeDescription: "Six and <bdi style='color:#CC0033'>C</bdi> increase 2 is nullified",
                        goalDescription(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Challenges") return ""
                                if (!["2", "All"].includes(player.subtabs.n.challenge_content)) return ""
                                return format(tmp.n.challenges[22].goal) + " Points"
                        },
                        goal: () => Decimal.pow(10, 166.7e6),
                        canComplete: () => player.points.gte(tmp.n.challenges[22].goal),
                        rewardDescription(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Challenges") return ""
                                if (!["2", "All"].includes(player.subtabs.n.challenge_content)) return ""
                                let a = "C Point Gain 7's base is multiplied by log10(Nitrogen)"
                                let b = "<br>"
                                let c = "Currently: *" + format(tmp.n.challenges[22].rewardEffect)
                                return a + b + c
                        },
                        rewardEffect() {
                                let ret = player.n.points.max(10).log10()
                                return ret
                        },
                        unlocked(){
                                return hasUpgrade("n", 31)
                        },
                        countsAs: [12],
                }, // inChallenge("n", 22)
                31: {
                        name: "Fourteen",
                        challengeDescription: "Nine and you cannot reset for more than fifty tokens",
                        goalDescription(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Challenges") return ""
                                if (!["3", "All"].includes(player.subtabs.n.challenge_content)) return ""
                                return format(tmp.n.challenges[31].goal) + " Points"
                        },
                        goal: () => Decimal.pow(10, 169.5e5),
                        canComplete: () => player.points.gte(tmp.n.challenges[31].goal),
                        rewardDescription(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Challenges") return ""
                                if (!["3", "All"].includes(player.subtabs.n.challenge_content)) return ""
                                let a = "Nitrogen multiplies Near-ultraviolet base and cube Near-ultraviolet base"
                                return a
                        },
                        unlocked(){
                                return hasChallenge("n", 22)
                        },
                        countsAs: [11, 21],
                }, // inChallenge("n", 31) hasChallenge("n", 31)
                32: {
                        name: "Fifteen",
                        challengeDescription: "Ten and C Point gain 5 is nullified",
                        goalDescription(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Challenges") return ""
                                if (!["3", "All"].includes(player.subtabs.n.challenge_content)) return ""
                                return format(tmp.n.challenges[32].goal) + " Points"
                        },
                        goal: () => Decimal.pow(10, player.hardMode ? 190e6 : 165.8e6),
                        canComplete: () => player.points.gte(tmp.n.challenges[32].goal),
                        rewardDescription(){ //red d redd
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Challenges") return ""
                                if (!["3", "All"].includes(player.subtabs.n.challenge_content)) return ""
                                let a = "log10(Oxygen)^<bdi style='color:#CC0033'>D</bdi> multiplies Carbon gain and unlock a minigame for <bdi style='color:#CC0033'>D</bdi>"
                                let b = "<br>"
                                let c = "Currently: <bdi style='color:#CC0033'>D</bdi>=" + format(tmp.n.challenges[32].rewardEffect)
                                return a + b + c
                        },
                        rewardEffect() {
                                let ret = new Decimal(100)

                                if (hasUpgrade("mini", 55)) ret = ret.plus(getBuyableAmount("mini", 151))
                                if (hasUpgrade("mini", 65)) ret = ret.plus(getBuyableAmount("mini", 131))

                                return ret
                        },
                        unlocked(){
                                return hasChallenge("n", 31)
                        },
                        countsAs: [12, 22],
                }, // inChallenge("n", 32) hasChallenge("n", 32)
                41: {
                        name: "Sixteen",
                        challengeDescription: "Fourteen and you can't gain A Points",
                        goalDescription(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Challenges") return ""
                                if (!["4", "All"].includes(player.subtabs.n.challenge_content)) return ""
                                return format(tmp.n.challenges[41].goal) + " Points"
                        },
                        goal: () => Decimal.pow(10, player.hardMode ? 25395e4 : 2538e5),
                        canComplete: () => player.points.gte(tmp.n.challenges[41].goal),
                        rewardDescription(){ //red d redd
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Challenges") return ""
                                if (!["4", "All"].includes(player.subtabs.n.challenge_content)) return ""
                                let a = "Per challenge completion add .03 to fuel square rooting factor"
                                let b = "<br>"
                                let c = "Currently: +" + format(tmp.n.challenges[41].rewardEffect)
                                return a + b + c
                        },
                        rewardEffect() {
                                let comps = layerChallengeCompletions("n")

                                let ret = new Decimal(layerChallengeCompletions("n")).times(.03)

                                return ret
                        },
                        unlocked(){
                                return hasUpgrade("mini", 72)
                        },
                        countsAs: [11, 21, 31],
                }, // inChallenge("n", 41) hasChallenge("n", 41)
                42: {
                        name: "Twenty-one",
                        challengeDescription: "Fifteen and Oxygen gain cannot be increased from base",
                        goalDescription(){
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Challenges") return ""
                                if (!["4", "All"].includes(player.subtabs.n.challenge_content)) return ""
                                return format(tmp.n.challenges[42].goal) + " Points"
                        },
                        goal: () => Decimal.pow(10, player.hardMode ? 169e6 : 167.1e6),
                        canComplete: () => player.points.gte(tmp.n.challenges[42].goal),
                        rewardDescription(){ //red d redd
                                if (player.tab != "n") return ""
                                if (player.subtabs.n.mainTabs != "Challenges") return ""
                                if (!["4", "All"].includes(player.subtabs.n.challenge_content)) return ""
                                let a = "Add .001 to Exponential Increase 1 base"
                                return a
                        },
                        unlocked(){
                                return hasUpgrade("mini", 73)
                        },
                        countsAs: [12, 22, 32],
                }, // inChallenge("n", 42) hasChallenge("n", 42)
        },
        microtabs: {
                challenge_content: {
                        "All": {
                                content: [
                                        ["challenges", [1,2,3,4,5,6,7]],
                                        
                                ],
                                unlocked(){
                                        return true
                                },
                        },
                        "1": {
                                content: [
                                       ["challenges", [1]] 
                                ],
                                unlocked(){
                                        return true
                                },
                        },
                        "2": {
                                content: [
                                       ["challenges", [2]] 
                                ],
                                unlocked(){
                                        return tmp.n.challenges[21].unlocked
                                },
                        },
                        "3": {
                                content: [
                                       ["challenges", [3]] 
                                ],
                                unlocked(){
                                        return tmp.n.challenges[31].unlocked
                                },
                        },
                        "4": {
                                content: [
                                       ["challenges", [4]] 
                                ],
                                unlocked(){
                                        return tmp.n.challenges[41].unlocked
                                },
                        },
                        "5": {
                                content: [
                                       ["challenges", [5]] 
                                ],
                                unlocked(){
                                        return false // return tmp.n.challenges[51].unlocked
                                },
                        },
                        "6": {
                                content: [
                                       ["challenges", [6]] 
                                ],
                                unlocked(){
                                        return false // return tmp.n.challenges[61].unlocked
                                },
                        },
                        "7": {
                                content: [
                                       ["challenges", [7]] 
                                ],
                                unlocked(){
                                        return false //return tmp.n.challenges[71].unlocked
                                },
                        },
                },
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasMilestone("n", 13) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "n") return ""
                                                if (player.subtabs.n.mainTabs != "Upgrades") return ""
                                                if (shiftDown) return "Your best Nitrogen is " + format(player.n.best)
                                                if (hasMilestone("n", 13)) return "You are gaining " + format(tmp.n.getResetGain, 3) + " Nitrogen per second"
                                        }
                                ],

                                "blank", 
                                ["upgrades", [1,2,3,4,5,6,7]]],
                        unlocked(){
                                return true
                        },
                },
                "Challenges": {
                        content: ["main-display",
                                ["microtabs", "challenge_content"]],
                        unlocked(){
                                return hasMilestone("n", 14)
                        },
                },
                "Milestones": {
                        content: ["main-display",
                                ["display-text", function(){
                                        let a = "You have done " 
                                        let b = formatWhole(player.n.times) + " Nitrogen resets"
                                        return a + b
                                }],
                                ["milestones", [1]],
                                ],
                        unlocked(){
                                return true
                        },
                },
        },
        onPrestige(){
                player.n.times ++
        },
        doReset(layer){
                /*
                Things to reset:
                1. A Point stuff
                1a. A buyables
                2. B Point stuff
                2a. B buyables
                3. C Point stuff
                3a. C buuyables
                3b. upgrades
                4. Tokens
                4a. Token buyables
                4b. Coins
                5. Carbon stuff
                6. Oxygen stuff
                7. Hydorgen stuff
                */

                // 1: A point stuff
                if (layer != "n") return 
                player.n.time = 0
                let inChallenge = hasMilestone("n", 13) && player.hardMode // cant reset otherwise once you have passive gain
                let data1 = player.mini
                let data2 = player.tokens
                
                if (!false) {
                        data1.a_points = {
                                points: new Decimal(0), // 1
                                best: new Decimal(0), //1 cont
                                extras: { // 1 cont
                                        11: new Decimal(1),
                                        12: new Decimal(0),
                                        13: new Decimal(0),
                                        21: new Decimal(0),
                                        23: new Decimal(0),
                                        61: new Decimal(0),
                                        62: new Decimal(0),
                                        63: new Decimal(0),
                                }
                        }
                        let list1 = ["11", "12", "13", "21", 
                                     "22", "23", "61", 
                                     "62", "63"]
                        for (i = 0; i < list1.length; i++){
                                data1.buyables[list1[i]] = new Decimal(0)
                        }// 1a
                }

                if (player.n.times < 24) player.subtabs.mini.mainTabs = "Spelling"
                
                // 2: B point stuff
                if (!false) {
                        data1.b_points = {
                                points: new Decimal(0),
                                best: new Decimal(0),
                        } // 2
                        let list2 = ["31", "32", 
                                     "33", "41", "42", "43", 
                                     "51", "52", "53"]
                        for (i = 0; i < list2.length; i++){
                                data1.buyables[list2[i]] = new Decimal(0)
                        } //2a
                }

                // 3: C point stuff
                if (!false) {
                        data1.c_points = {
                                points: new Decimal(0),
                                best: new Decimal(0),
                                lastRoll: [],
                                lastRollTime: data1.c_points.lastRollTime,
                                displayCharacters: data1.c_points.displayCharacters,
                        } // 3
                        let list3 = ["71", "72", "73", "81", "82", 
                                     "83", "91", "92", "93", "101", 
                                     "102", "103", "111", "112", "113"]
                        for (i = 0; i < list3.length; i++){
                                data1.buyables[list3[i]] = new Decimal(0)
                        } //3a
                        
                        let rem = [11, 12, 13, 14, 15, 
                                   21, 22, 23, 24, 25, 
                                   31, 32, 33, 34, 35,        
                                   41, 42, 43, 44, 45, ]
                        if (hasMilestone("n", 7) && !inChallenge) rem = rem.slice(player.n.times)
                        if (hasMilestone("n", 3)) rem = filterOut(rem, [12])
                        if (hasMilestone("n", 4)) rem = filterOut(rem, [22])
                        if (hasMilestone("n", 5)) rem = filterOut(rem, [43])
                        data1.upgrades = filterOut(data1.upgrades, rem) // 3b
                }

                // 4: Tokens
                if (!false){
                        let starting = new Decimal(0)
                        if (hasMilestone("n", 12) && !inChallenge) starting = new Decimal(50)
                        data2.total = starting
                        data2.points = starting
                        
                        let list4 = ["11", "12", "13", "21", "22", 
                                     "23", "31", "32", "33", "41", 
                                     "42", "43", "51", "52", "53", 
                                     "61", "62", "63"]
                        for (i = 0; i < list4.length; i++){
                                data2.buyables[list4[i]] = new Decimal(0)
                                data2.best_buyables[list4[i]] = new Decimal(0)
                        } //4a
                        
                        data2.coins.points = new Decimal(0)
                        data2.coins.best = new Decimal(0)
                        
                        let keep0 = []
                        if (hasMilestone("n", 5)) keep0.push(95)
                        if (hasMilestone("n", 8)) keep0.push(82)
                        if (!hasMilestone("n", 9)) data2.upgrades = filter(data2.upgrades, keep0)
                        
                        let keep1 = []
                        if (hasMilestone("n", 2)) keep1 = keep1.concat(data2.milestones.slice(0, player.n.times))
                        data2.milestones = filter(data2.milestones, keep1)
                }

                // 5: C
                if (!false) {
                        if (!hasMilestone("n", 10)) {
                                let rem = [11, 12, 13, 14, 15, 
                                           21, 22, 23, 24, 25]
                                if (hasUpgrade("n", 22)) rem = filterOut(rem, [11, 12, 13, 14, 15])
                                player.c.upgrades = filterOut(player.c.upgrades, rem)
                        }
                        player.c.points = new Decimal(0)
                        player.c.best = new Decimal(0)
                }

                // 6: O
                if (!false) {
                        if (!hasMilestone("n", 10)) {
                                let rem = [11, 12, 13, 14, 15, 
                                           21, 22, 23, 24, 25]
                                if (hasUpgrade("n", 22)) rem = filterOut(rem, [11, 12, 13, 14, 15])
                                player.o.upgrades = filterOut(player.o.upgrades, rem)
                        }
                        player.o.points = new Decimal(0)
                        player.o.best = new Decimal(0)
                }

                // 7: H
                if (!false) {
                        let remove = [11, 12, 13, 14, 15, 
                                      21, 22, 23, 24, 25, 
                                      31, 32, 33, 34, 35, 
                                      41, 42, 43, 44, 45, 
                                      51, 52, 53, 54, 55, 
                                      61, 62, 63, 64, 65,
                                      71, 72, 73, 74, 75,
                                      81, 82, 83, 84, 85,
                                      ]
                                      
                        if (hasMilestone("tokens", 5)) {
                                remove = remove.slice(player.tokens.milestones.length * 3)
                        }
                        if (hasMilestone("tokens", 2)) remove = filterOut(remove, [51, 52])
                        if (hasMilestone("n", 3)) remove = filterOut(remove, [73])


                        player.h.upgrades = filterOut(player.h.upgrades, remove)
                        player.h.points = new Decimal(0)
                        player.h.best = new Decimal(0)
                        player.h.atomic_hydrogen.points = new Decimal(0)
                        player.h.atomic_hydrogen.best = new Decimal(0)
                        player.h.deuterium.points = new Decimal(0)
                        player.h.deuterium.best = new Decimal(0)
                }
        },
})

addLayer("p", {
        name: "Phosphorus", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: false,
		points: new Decimal(0),
                best: new Decimal(0),
                total: new Decimal(0),
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
                passivetime: 0,
                currentGainPerSec: new Decimal(0),
        }},
        color: "#466BA2",
        branches: [],
        requires:() => Decimal.pow(10, 2155).times(1.3), // Can be a function that takes requirement increases into account
        resource: "Phosphorus", // Name of prestige currency
        baseResource: "Nitrogen", // Name of resource prestige is based on
        baseAmount() {return player.n.points.floor()}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                let base = tmp.p.getBaseGain
                let mult = tmp.p.getGainMult

                let ret = base.times(mult)

                return ret.floor()
        },
        getGainExp(){
                let ret = new Decimal(4)

                if (hasMilestone("p", 9)) ret = ret.times(2)
                if (hasUpgrade("p", 31)) ret = ret.times(2)

                return ret
        },
        getBaseGain(){
                let pts = player.n.points.div(1.3)
                if (pts.lt(10)) return new Decimal(0)

                let init = pts.log10().sub(2027)
                let exp = tmp.p.getGainExp

                if (init.lt(0)) return new Decimal(0)

                let base = init.root(7).sub(1)

                if (base.lt(1)) base = new Decimal(0)

                return base.pow(exp)
        },
        getNextAt(){
                let curr = tmp.p.getResetGain
                let exp = tmp.p.getGainExp
                let mult = tmp.p.getGainMult

                let v1 = curr.div(mult).plus(1).root(exp)
                let v2 = v1.plus(1).pow(7)
                let v3 = v2.plus(2027).pow10().times(1.3)

                return v3
        },
        getGainMult(){//phosphorus gain pgain rusgain
                let x = new Decimal(1)

                if (hasUpgrade("p", 15))        x = x.times(tmp.p.upgrades[15].effect)
                if (hasUpgrade("p", 24))        x = x.times(tmp.p.upgrades[24].effect)
                if (hasMilestone("mu", 1))      x = x.times(player.tokens.total.pow(player.mu.milestones.length))

                return x
        },
        getPassiveGainMult(){
                let x = new Decimal(1)

                if (hasMilestone("p", 2))       x = x.times(tmp.p.milestones[2].effect)
                                                x = x.times(player.p.points.max(1).pow(tmp.mu.effect))
                if (hasUpgrade("mu", 11))       x = x.times(tmp.n.upgrades[35].effect)
                if (hasUpgrade("mu", 12))       x = x.times(player.mu.points.div(100).plus(1).pow(getBuyableAmount("mini", 241).sqrt()))
                if (hasUpgrade("p", 33))        x = x.times(tmp.p.upgrades[33].effect)
                if (hasUpgrade("mu", 13))       x = x.times(tmp.mu.upgrades[13].effect)
                if (hasUpgrade("mu", 14))       x = x.times(10)

                return x
        },
        effect(){
                let amt = player.p.total

                let exp2 = new Decimal(3)
                if (hasMilestone("p", 4)) exp2 = exp2.plus(.1)
                if (hasMilestone("p", 5)) exp2 = exp2.plus(.04)
                if (hasMilestone("p", 6)) exp2 = new Decimal(Math.PI)

                let exp = amt.plus(1).log10().pow(exp2)

                let ret = Decimal.pow(10, exp)

                return ret
        },
        effectDescription(){
                if (player.tab != "p") return ""
                if (shiftDown) {
                        let a = "effect formula: 10^(log10(x+1)^3)"
                        if (hasMilestone("p", 4)) a = a.replace("3", "3.1")
                        if (hasMilestone("p", 5)) a = a.replace("3.1", "3.14")
                        if (hasMilestone("p", 6)) a = a.replace("3.14", "π")
                        return a
                }
                let eff = tmp.p.effect
                let effstr = format(eff)
                let start = " multiplying all minigame point gain by "
                let end = "."
                let init = start + effstr
                let end2 = " and Nitrogen gain by " + format(player.p.points.plus(1))
                return init + end2 + end
        },
        update(diff){
                let data = player.p
                
                if (tmp.p.layerShown) data.unlocked = true
                data.best = data.best.max(data.points)
                
                // do phosphorus gain
                if (hasUpgrade("p", 13)) {
                        data.currentGainPerSec = data.currentGainPerSec.plus(tmp.p.getResetGain.times(diff))
                        
                        data.passivetime += Math.min(1, diff)
                        if (data.passivetime > 1) {
                                data.passivetime += -1
                                data.times ++
                        }
                }
                
                let x = tmp.p.getPassiveGainMult.times(diff)
                data.points = data.points.plus(data.currentGainPerSec.times(x))
                data.total = data.total.plus(data.currentGainPerSec.times(x))

                if (false) {
                        //do autobuyer stuff
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        row: 2, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
                {key: "shift+P", description: "Shift+P: Go to Phosphorus", onPress(){
                                if (!tmp.p.layerShown) return
                                showTab("p")
                        }
                },
                {key: "p", description: "P: Reset for Phosphorus", onPress(){
                                if (canReset("p")) doReset("p")
                        }
                },
        ],
        layerShown(){return player.n.best.div(1.3).max(10).log10().gt(2155) || player.p.best.gt(0)},
        prestigeButtonText(){
                if (player.tab != "p") return ""
                
                let gain = tmp.p.getResetGain
                let nextAt = tmp.p.getNextAt
                if (gain.eq(0)) {
                        let a = "You cannot reset for base Phosphorus/s, you need<br>"
                        let b = format(nextAt) + " Nitrogen for the first"
                }
                let amt = "You can reset for <br>" + formatWhole(gain) + " base Phosphorus/s"
                let nxt = ""
                if (gain.lt(1000)) nxt = "<br>You need " + format(nextAt) + "<br>Nitrogen for the next"
                if (player.p.time > 1 && gain.lt(1e6) && gain.gt(1) && shiftDown) nxt += "<br>" + format(gain.div(player.p.time)) + "/s"
                return amt + nxt
        },
        canReset(){
                return !false && tmp.p.getResetGain.gt(0)
        },
        upgrades: {
                rows: 10,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(163) + "'>Phosphorus I"
                        },
                        description(){
                                let a = "Gain .5 Nitrogen per second and you have one less token for prestige purposes"
                                if (shiftDown) {
                                        return "What is the imaginary period of exponential speed on two? Dm me: pg132#7975"
                                }
                                return a
                        },
                        cost:() => new Decimal(25000),
                        unlocked(){
                                return true
                        }, // hasUpgrade("p", 11)
                },
                12: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(164) + "'>Phosphorus II"
                        },
                        description(){
                                let a = "Tire effects E Point gain"
                                if (shiftDown) {
                                        return "Hint: There are generally an even number, and you should depress your shift key."
                                }
                                return a
                        },
                        cost:() => new Decimal(player.hardMode ? 5e8 : 1e8),
                        unlocked(){
                                return hasUpgrade("p", 11)
                        }, // hasUpgrade("p", 12)
                },
                13: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(165) + "'>Phosphorus III"
                        },
                        description(){
                                let a = "Remove the ability to prestige but gain 100% of Phosphorus/s per second"
                                return a
                        },
                        cost:() => new Decimal(player.hardMode ? 5e10 : 1e10),
                        unlocked(){
                                return hasUpgrade("p", 12)
                        }, // hasUpgrade("p", 13)
                },
                14: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(166) + "'>Phosphorus IV"
                        },
                        description(){
                                let a = "Per Iteration Phosphorus multiplies Nitrogen"
                                let b = "<br>Currently: " + format(tmp.p.upgrades[14].effect)
                                return a + b
                        },
                        effect(){
                                return player.p.points.max(1).pow(tmp.mini.e_points.getMaxInterations)
                        },
                        cost:() => new Decimal(player.hardMode ? 1e12 : 2e11),
                        unlocked(){
                                return hasUpgrade("p", 13)
                        }, // hasUpgrade("p", 14)
                },
                15: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(166) + "'>Phosphorus V"
                        },
                        description(){
                                let a = "<bdi style='font-size: 80%'> Log10(E Points) multiplies base Phosphorus gain and commutativity of addition's outer ln becomes log2"
                                let b = "<br>Currently: " + format(tmp.p.upgrades[15].effect) + "</bdi>"
                                return a + b
                        },
                        effect(){
                                return player.mini.e_points.points.max(10).log10()
                        },
                        cost:() => new Decimal(player.hardMode ? 3e12 : 6e11),
                        unlocked(){
                                return hasUpgrade("p", 14)
                        }, // hasUpgrade("p", 15)
                },
                21: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(167) + "'>Phosphorus VI"
                        },
                        description(){
                                let a = "Each upgrade adds .01 to left distributivity base"
                                return a
                        },
                        cost:() => new Decimal(player.hardMode ? 1e18 : 1e17),
                        unlocked(){
                                return hasUpgrade("p", 15)
                        }, // hasUpgrade("p", 21)
                },
                22: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(167) + "'>Phosphorus VII"
                        },
                        description(){
                                let a = "Each upgrade makes E Points<sup>.05</sup> multiply D Point gain"
                                return a
                        },
                        cost:() => new Decimal(player.hardMode ? 1e19 : 1e18),
                        unlocked(){
                                return hasUpgrade("p", 21)
                        }, // hasUpgrade("p", 22)
                },
                23: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(167) + "'>Phosphorus VIII"
                        },
                        description(){
                                let a = "Each respect scalar multiples E Point gain by 1 + [upgrades]/10"
                                return a
                        },
                        cost:() => new Decimal(player.hardMode ? 3e19 : 3e18),
                        unlocked(){
                                return hasUpgrade("p", 22)
                        }, // hasUpgrade("p", 23)
                },
                24: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(168) + "'>Phosphorus IX"
                        },
                        description(){
                                let a = "Each upgrade multiplies base Phosphorus gain by log10(log10(E Points))"
                                let b = "<br>Currently: " + format(tmp.p.upgrades[24].effect) + "</bdi>"
                                return a + b
                        },
                        effect(){
                                return player.mini.e_points.points.max(10).log10().max(10).log10().pow(player.p.upgrades.length)
                        },
                        cost:() => new Decimal(player.hardMode ? 1e20 : 1e19),
                        unlocked(){
                                return hasUpgrade("p", 23)
                        }, // hasUpgrade("p", 24)
                },
                25: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(168) + "'>Phosphorus X"
                        },
                        description(){
                                let a = "Inner ln of commutativity of addition becomes log2 and square " + makeBlue("a") + " and unlock another layer"
                                return a
                        },
                        effect(){
                                return player.mini.e_points.points.max(10).log10().max(10).log10().pow(player.p.upgrades.length)
                        },
                        cost:() => new Decimal(player.hardMode ? 1e26 : 1e25),
                        unlocked(){
                                return hasUpgrade("p", 24)
                        }, // hasUpgrade("p", 25)
                },
                31: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(168) + "'>Phosphorus XI"
                        },
                        description(){
                                let a = "Square initial Phosphorus gain and " + makeBlue("a")
                                return a
                        },
                        cost:() => new Decimal(player.hardMode ? 1e38 : 1e37),
                        unlocked(){
                                return hasMilestone("mu", 2)
                        }, // hasUpgrade("p", 31)
                },
                32: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(169) + "'>Phosphorus XII"
                        },
                        description(){
                                let a = "You can bulk 100x more C Point buyables"
                                return a
                        },
                        effect(){
                                return player.mini.e_points.points.max(10).log10().max(10).log10().pow(player.p.upgrades.length)
                        },
                        cost:() => new Decimal(player.hardMode ? 1e43 : 1e42),
                        unlocked(){
                                return hasUpgrade("p", 31)
                        }, // hasUpgrade("p", 32)
                },
                33: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(169) + "'>Phosphorus XIII"
                        },
                        description(){
                                let a = "Per µ iterations multiply Phosphorus gain"
                                let b = "<br>Currently: " + format(tmp.p.upgrades[33].effect)
                                return a + b
                        },
                        effect(){
                                return Decimal.pow(tmp.mini.e_points.getMaxInterations, player.mu.points)
                        },
                        cost:() => new Decimal(player.hardMode ? 1e61 : 1e60),
                        unlocked(){
                                return hasUpgrade("p", 32)
                        }, // hasUpgrade("p", 33)
                },
        },
        milestones: {
                1: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.p.milestones[1].requirement)
                                let b = " Phosphorus reset"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(1)
                        },
                        done(){
                                return tmp.p.milestones[1].requirement.lte(player.p.times)
                        },
                        unlocked(){
                                return true
                        },
                        effect(){
                                return new Decimal(1)
                        },
                        effectDescription(){
                                let a = "Reward: Keep one Nitrogen milestone per reset, you have one less token for prestige purposes, and bulk 5x D buyables.<br>"
                                return a
                        },
                }, // hasMilestone("p", 1)
                2: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.p.milestones[2].requirement)
                                let b = " Phosphorus resets"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(2)
                        },
                        done(){
                                return tmp.p.milestones[2].requirement.lte(player.p.times)
                        },
                        unlocked(){
                                return true
                        },
                        effect(){
                                return Decimal.pow(2, Math.min(20, player.p.times))
                        },
                        effectDescription(){
                                let a = "Reward: Each of the first twenty resets doubles Phosphorus gain and bulk 5x E buyables.<br>"
                                return a
                        },
                }, // hasMilestone("p", 2)
                3: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.p.milestones[3].requirement)
                                let b = " Phosphorus resets"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(4)
                        },
                        done(){
                                return tmp.p.milestones[3].requirement.lte(player.p.times)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                let a = "Reward: Unlock a D buyable and E Points<sup>.001</sup> multiply E Point gain.<br>"
                                return a
                        },
                }, // hasMilestone("p", 3)
                4: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.p.milestones[4].requirement)
                                let b = " Phosphorus resets"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(player.hardMode ? 7 : 6)
                        },
                        done(){
                                return tmp.p.milestones[4].requirement.lte(player.p.times)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                let a = "Reward: Keep a D Point upgrade per reset, keep Nitrogen XXII, and increase effect exponent to 3.1.<br>"
                                return a
                        },
                }, // hasMilestone("p", 4)
                5: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.p.milestones[5].requirement)
                                let b = " Phosphorus resets"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(player.hardMode ? 11 :8)
                        },
                        done(){
                                return tmp.p.milestones[5].requirement.lte(player.p.times)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                let a = "Reward: Keep Nitrogen challenges and Nitrogen resets and increase effect exponent to 3.14.<br>"
                                return a
                        },
                }, // hasMilestone("p", 5)
                6: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.p.milestones[6].requirement)
                                let b = " Phosphorus resets"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(player.hardMode ? 16 :10)
                        },
                        done(){
                                return tmp.p.milestones[6].requirement.lte(player.p.times)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                let a = "Reward: Keep Carbon and Oxygen upgrades and increase effect exponent to π.<br>"
                                return a
                        },
                }, // hasMilestone("p", 6)
                7: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.p.milestones[7].requirement)
                                let b = " Phosphorus resets"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(player.hardMode ? 22 : 13)
                        },
                        done(){
                                return tmp.p.milestones[7].requirement.lte(player.p.times)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                let a = "Reward: Per reset keep a Nitrogen upgrade and you can buy the first level of D buyables.<br>"
                                return a
                        },
                }, // hasMilestone("p", 7)
                8: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.p.milestones[8].requirement)
                                let b = " Phosphorus"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(player.hardMode ? 5e9 : 1e9)
                        },
                        done(){
                                return tmp.p.milestones[8].requirement.lte(player.p.points)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                let a = "Reward: You can autobuy Iterations and the first levels of the first four rows of E buyables.<br>"
                                return a
                        },
                }, // hasMilestone("p", 8)
                9: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.p.milestones[9].requirement)
                                let b = " Phosphorus"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(player.hardMode ? 1e11 : 2e10)
                        },
                        done(){
                                return tmp.p.milestones[9].requirement.lte(player.p.points)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                let a = "Reward: Square Phosphorus gain.<br>"
                                return a
                        },
                }, // hasMilestone("p", 9)
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", "", function (){ return hasUpgrade("p", 13) ? {'display': 'none'} : {}}],
                                ["display-text",
                                        function() {
                                                if (player.tab != "p") return ""
                                                if (player.subtabs.p.mainTabs != "Upgrades") return ""
                                                if (shiftDown) {
                                                        let b = "Your best Phosphorus is " + format(player.p.best)
                                                        let c = " and your base Phosphorus/s is " + format(player.p.currentGainPerSec)
                                                        return b + c
                                                }
                                                let x = player.p.currentGainPerSec.times(tmp.p.getPassiveGainMult)
                                                let a = "You are gaining " + format(x, 3) + " Phosphorus/s"
                                                if (!hasUpgrade("p", 13)) return a
                                                return a + " and " + format(tmp.p.getResetGain) + " base Phosphorus/s<sup>2</sup>"
                                        }
                                ],
                                "blank", 
                                ["upgrades", [1,2,3,4,5,6,7]]],
                        unlocked(){
                                return true
                        },
                },
                "Milestones": {
                        content: ["main-display",
                                ["display-text", function(){
                                        let a = "You have done " 
                                        let b = formatWhole(player.p.times) + " Phosphorus resets"
                                        return a + b
                                }],
                                ["milestones", [1]],
                                ],
                        unlocked(){
                                return true
                        },
                },
                "Info": {
                        content: [
                                ["display-text", function(){
                                        let a = "Resetting Phosphorus gives you phrosphorus per second instead of flat gain"
                                        let b = "The base gain formula is (log10(Nitrogen/13)-2154)<sup>1/7</sup>-1"
                                        let br = "<br>"
                                        let c = "Resetting resets all prior currencies, all prior minigame buyables, "
                                        let d = " all D and E point content, C Point upgrades, "
                                        let e = " Nitrogen content, and third row Oxygen and Carbon upgrades."
                                        let f = "The effect on D and E points is hardcapped at 1ee7 and 1ee6 respectively."
                                        return a + br + b + br + c + br + d + br + e + br + f
                                }]
                        ],
                        unlocked(){
                                return true
                        }
                },     
        },
        onPrestige(gain){
                player.p.times ++
                player.p.currentGainPerSec = player.p.currentGainPerSec.plus(gain)
        },
        doReset(layer){
                /*
                Things to reset:
                1. A Point stuff
                1a. A buyables
                2. B Point stuff
                2a. B buyables
                3. C Point stuff
                3a. C buuyables
                3b. upgrades
                4. Tokens
                4a. Token buyables
                4b. Coins
                5. Carbon stuff
                6. Oxygen stuff
                7. Hydorgen stuff
                */

                
                if (layer != "p") return
 
                player.p.time = 0
                let inChallenge = false
                let data1 = player.mini
                let data2 = player.tokens

                // 0: Nitrogen stuff
                if (!false) {
                        if (!hasMilestone("p", 5)) player.n.times = 0
                        player.n.time = 0
                        player.n.passivetime = 0
                        player.n.best = new Decimal(0)
                        player.n.points = new Decimal(0)
                        player.n.total = new Decimal(0)

                        let remupg = [11, 12, 13, 14, 15, 
                                      21, 22, 23, 24, 25, 
                                      31, 32, 33, 34, 35, 
                                      41, 42, 43, 44, 45, 
                                      51, 52, 53, 54, 55,]
                        if (hasMilestone("p", 7)) remupg = remupg.slice(player.p.times, )
                        if (hasMilestone("p", 4)) remupg = filterOut(remupg, [52])
                        player.n.upgrades = filterOut(player.n.upgrades, remupg)

                        if (hasMilestone("p", 1)) {
                                let keep = ["1", "2", "3", "4", "5", 
                                            "6", "7", "8", "9", "10", 
                                            "11", "12", "13", "14", 
                                            "15", "16", "17", "18"].slice(0, player.p.times)
                                player.n.milestones = filter(player.n.milestones, keep)
                        }
                        if (!hasMilestone("p", 5)) player.n.challenges = {
                                11: 0,
                                12: 0,
                                21: 0,
                                22: 0,
                                31: 0,
                                32: 0,
                                41: 0,
                                42: 0,
                        }
                }

                // 1: A point stuff
                if (!false) {
                        data1.a_points = {
                                points: new Decimal(0), // 1
                                best: new Decimal(0), //1 cont
                                extras: { // 1 cont
                                        11: new Decimal(1),
                                        12: new Decimal(0),
                                        13: new Decimal(0),
                                        21: new Decimal(0),
                                        23: new Decimal(0),
                                        61: new Decimal(0),
                                        62: new Decimal(0),
                                        63: new Decimal(0),
                                }
                        }
                        let list1 = ["11", "12", "13", "21", 
                                     "22", "23", "61", 
                                     "62", "63"]
                        for (i = 0; i < list1.length; i++){
                                data1.buyables[list1[i]] = new Decimal(0)
                        }// 1a
                }

                player.subtabs.mini.mainTabs = "A"
                
                // 2: B point stuff
                if (!false) {
                        data1.b_points = {
                                points: new Decimal(0),
                                best: new Decimal(0),
                        } // 2
                        let list2 = ["31", "32", 
                                     "33", "41", "42", "43", 
                                     "51", "52", "53"]
                        for (i = 0; i < list2.length; i++){
                                data1.buyables[list2[i]] = new Decimal(0)
                        } //2a
                }

                // 3: C point stuff
                if (!false) {
                        data1.c_points = {
                                points: new Decimal(0),
                                best: new Decimal(0),
                                lastRoll: [],
                                lastRollTime: data1.c_points.lastRollTime,
                                displayCharacters: data1.c_points.displayCharacters,
                        } // 3
                        let list3 = ["71", "72", "73", "81", "82", 
                                     "83", "91", "92", "93", "101", 
                                     "102", "103", "111", "112", "113"]
                        for (i = 0; i < list3.length; i++){
                                data1.buyables[list3[i]] = new Decimal(0)
                        } //3a
                        let rem = [11, 12, 13, 14, 15, 
                                   21, 22, 23, 24, 25, 
                                   31, 32, 33, 34, 35,        
                                   41, 42, 43, 44, 45, ]
                        if (hasMilestone("n", 7)) rem = rem.slice(player.n.times)
                        if (hasMilestone("n", 3)) rem = filterOut(rem, [12])
                        if (hasMilestone("n", 4)) rem = filterOut(rem, [22])
                        if (hasMilestone("n", 5)) rem = filterOut(rem, [43])
                        data1.upgrades = filterOut(data1.upgrades, rem) // 3b
                }

                // 4: Tokens
                if (!false){
                        let starting = new Decimal(0)
                        if (!player.hardMode) starting = new Decimal(50)
                        data2.total = starting
                        data2.points = starting
                        let list4 = ["11", "12", "13", "21", "22", 
                                     "23", "31", "32", "33", "41", 
                                     "42", "43", "51", "52", "53", 
                                     "61", "62", "63"]
                        for (i = 0; i < list4.length; i++){
                                data2.buyables[list4[i]] = new Decimal(0)
                                data2.best_buyables[list4[i]] = new Decimal(0)
                        } //4a

                        //4b
                        data2.coins.points = new Decimal(0)
                        data2.coins.best = new Decimal(0)
                }

                // 5: C
                if (!false) {
                        player.c.points = new Decimal(0)
                        player.c.best = new Decimal(0)
                        if (!hasMilestone("p", 6)) {
                                let remC = [31, 32, 33, 34, 35]
                                player.c.upgrades = filterOut(player.c.upgrades, remC)
                        }
                }

                // 6: O
                if (!false) {
                        player.o.points = new Decimal(0)
                        player.o.best = new Decimal(0)
                        if (!hasMilestone("p", 6)) {
                                let remO = [31, 32, 33, 34, 35]
                                player.o.upgrades = filterOut(player.o.upgrades, remO)
                        }
                }

                // 7: H
                if (!false) {
                        player.h.points = new Decimal(0)
                        player.h.best = new Decimal(0)
                        player.h.atomic_hydrogen.points = new Decimal(0)
                        player.h.atomic_hydrogen.best = new Decimal(0)
                        player.h.deuterium.points = new Decimal(0)
                        player.h.deuterium.best = new Decimal(0)
                }

                // 8: D Points
                if (!false) {
                        let remove = [51, 52, 53, 54, 55, 
                                      61, 62, 63, 64, 65, 
                                      71, 72, 73, 74, 75, 
                                      81, 82, 83, 84, 85]
                        if (hasMilestone("p", 4)) remove = remove.slice(player.p.times, )
                        data1.upgrades = filterOut(data1.upgrades, remove)
                        
                        data1.d_points = { 
                                points: new Decimal(0),
                                best: new Decimal(0),
                                fuel: new Decimal(0),
                                fuelTimer1: data1.d_points.fuelTimer1,
                                fuelTimer2: data1.d_points.fuelTimer2,
                        }
                        let list4 = ["121", "122", "123", "131", "132", "133",
                                     "151", "152", "153", "161", "162", 
                                     "163", "171", "172", "173", "181", 
                                     "182", "183", ]
                        for (i = 0; i < list4.length; i++){
                                data1.buyables[list4[i]] = new Decimal(0)
                        } // reset buyables
                }

                // 9: E Points
                if (!false) {
                        data1.e_points = { 
                                points: new Decimal(0),
                                best: new Decimal(0),
                        }
                        let list4 = ["201", "202", "203", "211",
                                     "212", "213", "221", "222",
                                     "223", "231", "232", "233"]
                        for (i = 0; i < list4.length; i++){
                                data1.buyables[list4[i]] = new Decimal(0)
                        } // reset buyables
                }

                
        },
})

addLayer("mu", {
        name: "µ", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "µ", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: false,
		points: new Decimal(0),
                best: new Decimal(0),
                total: new Decimal(0),
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
                passivetime: 0,
        }},
        color: "#8200B0",
        branches: [],
        requires:() => Decimal.pow(10, 26).times(player.hardMode ? 10 : 2), // Can be a function that takes requirement increases into account
        resource: "µ", // Name of prestige currency
        baseResource: "Phosphorus", // Name of resource prestige is based on
        baseAmount() {return player.p.points.floor()}, // Get the current amount of baseResource
        type: "static",
        base(){
                let ret = new Decimal(100)
                if (hasUpgrade("mu", 12)) ret = ret.sub(tmp.mu.upgrades[12].effect)
                return ret
        },
        gainMult(){
                return new Decimal(1)
        },
        exponent: new Decimal(2),
        gainExp: new Decimal(1),
        effect(){
                let amt = player.mu.points

                let ret = amt.div(100)

                return ret
        },
        effectDescription(){
                if (player.tab != "mu") return ""
                if (shiftDown) {
                        let a = "effect formula: .01*x"
                        if (tmp.mu.effect.lt(1) && false) {
                                a += format(tmp.mu.effect.sub(1).recip().times(-1), 3) 
                        }
                        return a
                }
                let eff = tmp.mu.effect
                let effstr = format(eff)
                let start = " multiplying Phosphorus gain by Phosphorus<sup>" 
                let end = "</sup>."
                let ret = start + effstr + end
                return ret
        },
        update(diff){
                let data = player.mu
                
                if (tmp.mu.layerShown) data.unlocked = true
                data.best = data.best.max(data.points)
        },
        row: 2, // Row the layer is in on the tree (0 is the first row)
        prestigeButtonText(){
                if (shiftDown) {
                        let p1 = "Formula:<br>" + format(tmp.mu.requires, 0) + "*"
                        let p2 = formatWhole(tmp.mu.base) + "^(x<sup>2</sup>)"
                        return p1+p2
                }

                let a = "Reset for <b>" + formatWhole(tmp.mu.resetGain) + "</b> " + tmp.mu.resource
                let br = "<br>"
                let b = ""
                if (player.mu.points.lt(30)) {
                        let d = tmp.mu.canBuyMax
                        b = tmp.mu.baseAmount.gte(tmp.mu.nextAt) && (d !== undefined) && d ? "Next: " : "Req: "
                }
                let c = formatWhole(tmp.mu.baseAmount) + "/" + format(tmp.mu.nextAtDisp) + " " + tmp.mu.baseResource

                return a + br + br + b + c
        },
        hotkeys: [
                {key: "shift+M", description: "Shift+M: Go to µ", onPress(){
                                if (!tmp.mu.layerShown) return
                                showTab("mu")
                        }
                },
                {key: "m", description: "M: Reset for µ", onPress(){
                                if (canReset("mu")) doReset("mu")
                        }
                },
        ],
        layerShown(){return hasUpgrade("p", 25)},
        upgrades: {
                rows: 10,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(170) + "'>µ I"
                        },
                        description(){
                                let a = "Each constant multiplies E Point gain by log10(10+µ) and " + makeRed("E") + " multiplies Phosphorus gain"
                                return a
                        },
                        cost:() => new Decimal(2),
                        unlocked(){
                                return true
                        }, // hasUpgrade("mu", 11)
                },
                12: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(171) + "'>µ II"
                        },
                        description(){
                                let a = "<bdi style='font-size: 80%'> Per sqrt(associativity of *) multiply Phosphorus gain by 1 + µ/100 and reduces the µ cost base by ceil(40*[this row upgrades]<sup>.5</sup>)"
                                let b = "<br>Currently: -" + formatWhole(tmp.mu.upgrades[12].effect) + "</bdi>"
                                return a + b
                        },
                        cost:() => new Decimal(4),
                        effect(){
                                a = 1
                                if (hasUpgrade("mu", 11)) a += 1
                                if (hasUpgrade("mu", 13)) a += 1
                                if (hasUpgrade("mu", 14)) a += 1
                                if (hasUpgrade("mu", 15)) a += 1
                                return new Decimal(a).sqrt().times(40).ceil()
                        },
                        unlocked(){
                                return hasUpgrade("mu", 11)
                        }, // hasUpgrade("mu", 12)
                },
                13: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(171) + "'>µ III"
                        },
                        description(){
                                let a = "Per µ multiply Phosphorus gain by log10(Phosphorus)"
                                let b = "<br>Currently: " + formatWhole(tmp.mu.upgrades[13].effect)
                                return a + b
                        },
                        cost:() => new Decimal(6),
                        effect(){
                                return player.p.points.max(100).log10().pow(player.mu.points)
                        },
                        unlocked(){
                                return hasUpgrade("mu", 12)
                        }, // hasUpgrade("mu", 13)
                },
                14: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(171) + "'>µ IV"
                        },
                        description(){
                                let a = "Bulk 10x C, D, and E buyables and gain 10x Phosphorus"
                                return a
                        },
                        cost:() => new Decimal(1e108),
                        currencyLocation:() => player.p,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Phosphorus",
                        unlocked(){
                                return hasUpgrade("mu", 13)
                        }, // hasUpgrade("mu", 14)
                },
                15: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(171) + "'>µ V"
                        },
                        description(){
                                let a = "All future upgrades that cost Phosphorus set µ to 0 and do a µ reset"
                                return a
                        },
                        cost:() => new Decimal(1e118),
                        currencyLocation:() => player.p,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Phosphorus",
                        onPurchase(){
                                player.mu.points = new Decimal(0)
                                doReset("mu", true)
                        },
                        unlocked(){
                                return hasUpgrade("mu", 14)
                        }, // hasUpgrade("mu", 15)
                },
        },
        milestones: {
                1: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.mu.milestones[1].requirement)
                                let b = " µ"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(1)
                        },
                        done(){
                                return tmp.mu.milestones[1].requirement.lte(player.mu.points)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                let a = "Reward: Per milestone multiply base Phosphorus gain by total tokens and you no longer lose Oxygen or Carbon.<br>"
                                return a
                        },
                }, // hasMilestone("mu", 1)
                2: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.mu.milestones[2].requirement)
                                let b = " E Points"
                                return a + b
                        },
                        requirement(){
                                return Decimal.pow(10, 12e5)
                        },
                        done(){
                                return tmp.mu.milestones[2].requirement.lte(player.mini.e_points.points)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                let a = "Reward: Unlock a new E buyable.<br>"
                                return a
                        },
                }, // hasMilestone("mu", 2)
                3: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.mu.milestones[3].requirement)
                                let b = " µ"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(5)
                        },
                        done(){
                                return tmp.mu.milestones[3].requirement.lte(player.mu.points)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                let a = "Reward: E Points multiply D Points and each associativity of addition adds .01 to "
                                a += makeRed("E") + ".<br>"
                                return a
                        },
                }, // hasMilestone("mu", 3)
                4: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.mu.milestones[4].requirement)
                                let b = " µ"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(7)
                        },
                        done(){
                                return tmp.mu.milestones[4].requirement.lte(player.mu.points)
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                let a = "Iterations cost exponent is now x<sup>x</sup>"
                                return a
                        },
                }, // hasMilestone("mu", 4)
        },
        tabFormat: {
                "Upgrades": {
                        content: ["main-display",
                                ["prestige-button", ""],
                                ["display-text",
                                        function() {
                                                if (player.tab != "p") return ""
                                                if (player.subtabs.p.mainTabs != "Upgrades") return ""
                                                if (shiftDown) {
                                                        let b = "Your best Phosphorus is " + format(player.p.best)
                                                        let c = " and your base Phosphorus/s is " + format(player.p.currentGainPerSec)
                                                        return b + c
                                                }
                                                let x = player.p.currentGainPerSec.times(tmp.p.getPassiveGainMult)
                                                let a = "You are gaining " + format(x, 3) + " Phosphorus/s"
                                                if (!hasUpgrade("p", 13)) return a
                                                return a + " and " + format(tmp.p.getResetGain) + " base Phosphorus/s<sup>2</sup>"
                                        }
                                ],
                                "blank", 
                                ["upgrades", [1,2,3,4,5,6,7]]],
                        unlocked(){
                                return true
                        },
                },
                "Milestones": {
                        content: ["main-display",
                                ["milestones", [1]],
                                ],
                        unlocked(){
                                return true
                        },
                },    
        },
        doReset(layer){
                if (layer != "mu") return 
                player.p.points = new Decimal(0)
                player.p.total = new Decimal(0)
                player.p.best = new Decimal(0)
                player.p.currentGainPerSec = new Decimal(0)
        },
})


addLayer("ach", {
        name: "Goals",
        symbol: "⭑", 
        position: 1,
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
                total: new Decimal(0),
                abtime: 0,
                time: 0,
                times: 0,
                autotimes: 0,
                hiddenRows: 0,
                clickedYeet: 0,
                completedRows: 0,
        }},
        color: "#FFC746",
        branches: [],
        requires: new Decimal(0),
        resource: "Goals",
        baseResource: "points",
        baseAmount() {return new Decimal(0)},
        type: "custom",
        getResetGain() {
                return new Decimal(0)
        },
        getNextAt(){
                return new Decimal(0)
        },
        update(diff){
                let data = player.ach
                data.points = new Decimal(data.achievements.length).max(data.points)
                data.best = data.best.max(data.points)
                if (hasCompletedFirstNRows(player.ach.completedRows + 1)){
                        player.ach.completedRows ++
                }
        },
        row: "side",
        hotkeys: [],
        layerShown(){return true},
        prestigeButtonText(){
                return ""
        },
        canReset(){
                return false
        },
        achievements: getFirstNAchData(Object.keys(PROGRESSION_MILESTONES).length),
        clickables: {
                rows: 1,
                cols: 3,
                11: {
                        title(){
                                if (player.tab != "ach") return ""
                                if (player.subtabs.ach.mainTabs != "Achievements") return ""
                                return "<h3 style='color: #0033FF'>Hide the top row</h3>"
                        },
                        display(){
                                return shiftDown ? "Hides top layers until an unfinished layer" : ""
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                if (shiftDown) return true
                                return player.ach.hiddenRows < Object.keys(PROGRESSION_MILESTONES).length/7
                        },
                        onClick(){
                                if (!this.canClick()) return 
                                if (!shiftDown) {
                                        player.ach.hiddenRows ++
                                        return
                                }
                                player.ach.hiddenRows = 0
                                let b = 0
                                while (hasCompletedFirstNRows(player.ach.hiddenRows + 1)) {
                                        b ++ 
                                        player.ach.hiddenRows ++
                                        if (b > 1000) {
                                                console.log ('uh oh')
                                                return 
                                        }
                                }
                        },
                },
                12: {
                        title(){
                                if (player.tab != "ach") return ""
                                if (player.subtabs.ach.mainTabs != "Achievements") return ""
                                return "<h3 style='color: #0033FF'>Show a row</h3>"
                        },
                        display(){
                                return shiftDown ? "Show all rows" : ""
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                return player.ach.hiddenRows > 0
                        },
                        onClick(){
                                if (!this.canClick()) return 
                                if (shiftDown) player.ach.hiddenRows = 0
                                else player.ach.hiddenRows --
                        },
                },
                13: {
                        title(){
                                if (player.tab != "ach") return ""
                                if (player.subtabs.ach.mainTabs != "Achievements") return ""
                                return "<h3 style='color: #0033FF'>Click</h3>"
                        },
                        display(){
                                return formatWhole(player.ach.clickedYeet) + (player.ach.clickedYeet == 69 ? " nice" : "")
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                return true
                        },
                        onClick(){
                                player.ach.clickedYeet ++ 
                        },
                },
        },
        tabFormat: {
                "Achievements": {
                        content: [
                                "main-display-goals",
                                "clickables",
                                ["display-text",function(){
                                        return "You have completed the first " + formatWhole(player.ach.completedRows) + " rows"
                                }],
                                "achievements",
                        ],
                        unlocked(){
                                return true
                        },
                },
        },
        doReset(layer){},
})

addLayer("mini", {
        name: "Minigames",
        symbol: "♡", 
        position: 2,
        startData() { return {
                unlocked: false,
                abtime: 0,
                time: 0,
                autotime: 0,
                a_points: {
                        points: new Decimal(0),
                        best: new Decimal(0),
                        extras: {
                                11: new Decimal(1),
                                12: new Decimal(0),
                                13: new Decimal(0),
                                21: new Decimal(0),
                                23: new Decimal(0),
                                61: new Decimal(0),
                                62: new Decimal(0),
                                63: new Decimal(0),
                        }
                },
                b_points: {
                        points: new Decimal(0),
                        best: new Decimal(0),
                },
                c_points: {
                        points: new Decimal(0),
                        best: new Decimal(0),
                        lastRoll: [],
                        lastRollTime: new Date().getTime(),
                        displayCharacters: true,
                },
                d_points: {
                        points: new Decimal(0),
                        best: new Decimal(0),
                        fuel: new Decimal(0),
                        fuelTimer1: 0,
                        fuelTimer2: 0,
                },
                e_points: {
                        points: new Decimal(0),
                        best: new Decimal(0),
                },
                autobuytokens: false,
                autobuyradio: false,
        }},
        color: "#7D5D58",
        branches: [],
        requires: new Decimal(0),
        resource: "Minigames completed",
        tooltip(){
                let tab = player.subtabs.mini.mainTabs
                let data = player.mini
                if (tab == "A") return format(data.a_points.points) + " A Points"
                if (tab == "B") return format(data.b_points.points) + " B Points"
                if (tab == "C") return format(data.c_points.points) + " C Points"
                if (tab == "D") return format(data.d_points.points) + " D Points"
                if (tab == "E") return format(data.e_points.points) + " E Points"
                return ""
        },
        baseResource: "points",
        baseAmount() {return new Decimal(0)},
        type: "custom",
        getResetGain() {
                return new Decimal(0)
        },
        getNextAt(){
                return new Decimal(0)
        },
        update(diff){
                let data = player.mini
                let bpts = data.b_points
                let apts = data.a_points
                let dpts = data.d_points
                let epts = data.e_points
                
                if (hasUpgrade("h", 51) || player.subtabs.mini.mainTabs == "B" && tmp.mini.tabFormat.B.unlocked) {
                        bpts.points = bpts.points.plus(tmp.mini.b_points.getResetGain.times(diff))
                        data.unlocked = true
                }

                if (hasUpgrade("h", 51) || player.subtabs.mini.mainTabs == "A" && tmp.mini.tabFormat.A.unlocked) {
                        //update A minigame
                        let extras = apts.extras
                        if (extras[11].lt(1)) extras[11] = new Decimal(1)
                        let lvls = player.mini.buyables
                        let order = [11,12,13  ,23,63,62  ,61,21,11]
                        let exp = tmp.mini.a_points.getColorGainExp
                        for (i = 0; i < 8; i++){
                                addto = order[i+1]
                                addfrom = order[i]
                                let base = extras[addfrom].pow(exp).div(20).times(Decimal.pow(2, lvls[addfrom]))
                                base = base.times(tmp.mini.a_points.colorGainMult)
                                extras[addto] = extras[addto].plus(base.times(diff))
                        }
                        apts.points = apts.points.plus(tmp.mini.a_points.getResetGain.times(diff))
                        data.unlocked = true
                }
                
                if (hasUpgrade("h", 51)) {
                        let mult = 1
                        if (hasUpgrade("h", 52)) mult *= 10
                        if (hasUpgrade("h", 62)) mult *= 2
                        data.autotime += diff * mult
                        
                        if (data.autotime > 10) data.autotime = 10
                        if (data.autotime > 1) {
                                data.autotime += -1
                                let list1 = [31, 32, 33, 41, 42, 43, 51, 52, 53]
                                if (hasUpgrade("h", 52)) list1 = [11, 12, 13, 21, 23, 61, 62, 63].concat(list1)
                                

                                let max = new Decimal(1) // a and b 
                                if (hasMilestone("tokens", 3))  max = max.times(10)
                                if (hasMilestone("tokens", 13)) max = max.times(5)
                                if (hasMilestone("n", 1))       max = max.times(5)
                                if (hasMilestone("n", 2))       max = max.times(4)
                                if (hasUpgrade("o", 31))        max = max.times(10)
                                if (hasUpgrade("o", 32))        max = max.times(10)
                                if (hasUpgrade("mini", 85))     max = max.times(5)


                                for (i = 0; i < list1.length; i++){
                                        let id = list1[i]
                                        if (!tmp.mini.buyables[id].unlocked) continue
                                        if (getBuyableAmount("mini", id).eq(0) && !tmp.tokens.layerShown) continue
                                        if (tmp.mini.buyables[id].canAfford) {
                                                layers.mini.buyables[id].buy()
                                                let maxaff = tmp.mini.buyables[id].maxAfford
                                                let curr = player.mini.buyables[id]

                                                let buy = max.sub(1).min(maxaff.sub(curr)).max(0) // how many we can buy
                                                player.mini.buyables[id] = player.mini.buyables[id].plus(buy)
                                                //maxAfford
                                                if (!hasUpgrade("h", 52)) break
                                        }
                                }

                                let list2 = [] // c
                                if (hasUpgrade("mini", 22)) list2 = [ 71,  72,  73,  81,  82, 
                                                                      83,  91,  92,  93, 101,
                                                                     102, 103, 111, 112, 113,
                                                                     ].concat(list2)

                                let bulk = new Decimal(1) // c
                                if (hasUpgrade("mini", 41))     bulk = bulk.times(5)
                                if (hasUpgrade("mini", 44))     bulk = bulk.times(2)
                                if (hasMilestone("n", 2))       bulk = bulk.times(5)
                                if (hasMilestone("n", 4))       bulk = bulk.times(4)
                                if (hasUpgrade("o", 31))        bulk = bulk.times(10)
                                if (hasUpgrade("o", 32))        bulk = bulk.times(10)
                                if (hasUpgrade("mini", 85))     bulk = bulk.times(5)
                                if (hasUpgrade("p", 32))        bulk = bulk.times(100)
                                if (hasUpgrade("mu", 14))       bulk = bulk.times(10)
                                
                                bulk = bulk.sub(1)

                                for (i = 0; i < list2.length; i++){
                                        let id = list2[i]
                                        if (!tmp.mini.buyables[id].unlocked) continue
                                        if (!hasMilestone("n", 8) && getBuyableAmount("mini", id).eq(0)) continue
                                        if (tmp.mini.buyables[id].canAfford) {
                                                layers.mini.buyables[id].buy()
                                                if (bulk.neq(0) && id != 71) { // cant bulk 71
                                                        let maxAfford = tmp.mini.buyables[id].maxAfford
                                                        let curr = getBuyableAmount("mini", id)
                                                        let add = maxAfford.sub(curr).max(0).min(bulk)
                                                        player.mini.buyables[id] = player.mini.buyables[id].plus(add)
                                                }
                                                if (!hasUpgrade("tokens", 95)) break
                                        }
                                }

                                let list3 = [] // d buyables
                                if (hasUpgrade("mini", 52)) list3 = [ 121, 122, 123, 131, 132,
                                                                      133,
                                                                     ].concat(list3)

                                if (hasUpgrade("mini", 53)) list3 = [151, 152, 153, 161, 162, 
                                                                     163, 171, 172, 173, 181,
                                                                     182, 183].concat(list3)

                                let bulk2 = new Decimal(1) // d
                                if (hasUpgrade("mini", 63))     bulk2 = bulk2.times(Decimal.pow(1.3, tmp.mini.d_points.getUpgrades).max(0))
                                if (hasUpgrade("mini", 74))     bulk2 = bulk2.times(10)
                                if (hasUpgrade("mini", 85))     bulk2 = bulk2.times(5)
                                if (hasMilestone("p", 1))       bulk2 = bulk2.times(5)
                                if (hasUpgrade("mu", 14))       bulk2 = bulk2.times(10)
                                
                                bulk2 = bulk2.sub(1).floor()

                                for (i = 0; i < list3.length; i++){
                                        let id = list3[i]
                                        if (!tmp.mini.buyables[id].unlocked) continue
                                        if (!hasMilestone("p", 7) && getBuyableAmount("mini", id).eq(0)) continue
                                        if (tmp.mini.buyables[id].canAfford) {
                                                layers.mini.buyables[id].buy()
                                                if (bulk2.neq(0)) {
                                                        let maxAfford = tmp.mini.buyables[id].maxAfford
                                                        let curr = getBuyableAmount("mini", id)
                                                        let add = maxAfford.sub(curr).max(0).min(bulk2)
                                                        player.mini.buyables[id] = player.mini.buyables[id].plus(add)
                                                }
                                                if (!hasUpgrade("mini", 61)) break
                                        }
                                }

                                let list4 = []
                                if (hasUpgrade("n", 52)) list4 = [201, 202, 203, 211, 212, 
                                                                  213, 221, 222, 223, 231, 
                                                                  232, 233, 241]

                                let bulk3 = new Decimal(1) // e
                                if (hasMilestone("n", 17))      bulk3 = bulk3.times(5)
                                if (hasUpgrade("o", 33)) {
                                        if (hasUpgrade("o", 31))bulk3 = bulk3.times(2)
                                        if (hasUpgrade("o", 32))bulk3 = bulk3.times(2)
                                                                bulk3 = bulk3.times(2)
                                        if (hasUpgrade("o", 34))bulk3 = bulk3.times(2)
                                        if (hasUpgrade("o", 35))bulk3 = bulk3.times(2)
                                }        
                                if (hasUpgrade("o", 35))        bulk3 = bulk3.times(5)
                                if (hasUpgrade("mini", 85))     bulk3 = bulk3.times(5)
                                if (hasMilestone("p", 2))       bulk3 = bulk3.times(5)
                                if (hasUpgrade("mu", 14))       bulk3 = bulk3.times(10)
                                
                                bulk3 = bulk3.sub(1).floor()

                                for (i = 0; i < list4.length; i++){
                                        let id = list4[i]
                                        if (id == 201 && !hasMilestone("p", 8)) continue
                                        let canBuyFirst = hasMilestone("p", 8) && id < 240
                                        if (!tmp.mini.buyables[id].unlocked) continue
                                        if (!canBuyFirst && getBuyableAmount("mini", id).eq(0)) continue
                                        if (tmp.mini.buyables[id].canAfford) {
                                                layers.mini.buyables[id].buy()
                                                if (bulk3.neq(0) && id != 201) {
                                                        let maxAfford = tmp.mini.buyables[id].maxAfford
                                                        let curr = getBuyableAmount("mini", id)
                                                        let add = maxAfford.sub(curr).max(0).min(bulk3)
                                                        player.mini.buyables[id] = player.mini.buyables[id].plus(add)
                                                }
                                                if (!hasUpgrade("n", 54)) break
                                        }
                                }
                        }
                } else {
                        data.autotime = 0
                }

                if (!tmp.mini.tabFormat.C.unlocked) player.mini.c_points.lastRollTime = player.time
                if (hasUpgrade("mini", 12)) {
                        let timeSinceLast = player.time - player.mini.c_points.lastRollTime 
                        if (timeSinceLast >= 1000 * tmp.mini.upgrades[12].timeNeeded) {
                                layers.mini.clickables[41].onClick()
                        }
                }
                
                if ((player.tokens.autobuytokens || player.dev.autobuytokens) && hasMilestone("n", 4)) {
                        if (canReset("tokens")) doReset("tokens")
                }

                if (player.tokens.autobuyradio && hasMilestone("n", 7)) {
                        if (tmp.tokens.buyables[11].canAfford) layers.tokens.buyables[11].buy()
                }

                if (tmp.mini.tabFormat.D.unlocked) {
                        if (!false) dpts.fuel = dpts.fuel.times(Decimal.pow(.99, diff))
                        if (hasUpgrade("mini", 54)) {
                                dpts.fuel = dpts.fuel.plus(tmp.mini.d_points.getMaximumFuel.times(.002).times(diff))
                        }
                        dpts.best = dpts.best.max(dpts.points)
                        dpts.points = dpts.points.plus(tmp.mini.d_points.getPointProduction.times(diff))
                        if (hasUpgrade("mini", 51)) dpts.fuelTimer1 = dpts.fuelTimer1 + diff
                        if (hasUpgrade("mini", 52)) dpts.fuelTimer2 = dpts.fuelTimer2 + diff
                        if (dpts.fuelTimer1 > 10) {
                                dpts.fuelTimer1 -= 10
                                if (dpts.fuelTimer1 > 10) dpts.fuelTimer1 = 10
                                layers.mini.clickables[51].onClick()
                        }
                        if (dpts.fuelTimer2 > 11) {
                                dpts.fuelTimer2 -= 11
                                if (dpts.fuelTimer2 > 11) dpts.fuelTimer2 = 11
                                layers.mini.clickables[51].onClick()
                        }
                }

                if (tmp.mini.tabFormat.E.unlocked) {
                        epts.best = epts.best.max(epts.points)
                        epts.points = epts.points.plus(tmp.mini.e_points.getPointProduction.times(diff))
                }
        },
        row: "side",
        hotkeys: [{key: "shift+@", description: "Shift+2: Go to minigames", 
                        onPress(){
                                if (!tmp.mini.layerShown) return
                                player.tab = "mini"
                        }
                },
                {key: "shift+A", description: "Shift+A: Go to A", 
                        onPress(){
                                if (!tmp.mini.layerShown) return
                                if (!tmp.mini.tabFormat.A.unlocked) return 
                                player.tab = "mini"
                                player.subtabs.mini.mainTabs = "A"
                        }
                },
                {key: "shift+B", description: "Shift+B: Go to B", 
                        onPress(){
                                if (!tmp.mini.layerShown) return
                                if (!tmp.mini.tabFormat.B.unlocked) return 
                                player.tab = "mini"
                                player.subtabs.mini.mainTabs = "B"
                        }
                },
                {key: "shift+C", description: "Shift+C: Go to C", 
                        onPress(){
                                if (!tmp.mini.layerShown) return
                                if (!tmp.mini.tabFormat.C.unlocked) return 
                                player.tab = "mini"
                                player.subtabs.mini.mainTabs = "C"
                        }
                },
                {key: "shift+D", description: "Shift+D: Go to D", 
                        onPress(){
                                if (!tmp.mini.layerShown) return
                                if (!tmp.mini.tabFormat.D.unlocked) return 
                                player.tab = "mini"
                                player.subtabs.mini.mainTabs = "D"
                        }
                },
                ],
        layerShown(){return hasUpgrade("h", 45) || hasUpgrade("h", 44) || tmp.n.layerShown},
        prestigeButtonText(){
                return ""
        },
        canReset(){
                return false
        },
        shouldNotify(){
                let data = tmp.mini.tabFormat
                let x = ["A", "B", "C", "D", "E"]
                for (id in x){
                        i = x[id]
                        if (data[i].shouldNotify) return true
                }
                return false
        },
        a_points: {
                getGainMult(){ // apoint gain a point gain
                        let ret = new Decimal(1)

                        if (player.dev.aPointMult != undefined) ret = ret.times(player.dev.aPointMult)

                        if (player.hardMode)            ret = ret.div(100)
                        if (hasUpgrade("h", 51))        ret = ret.times(1e5)

                                                        ret = ret.times(tmp.mini.buyables[12].effect)
                                                        ret = ret.times(tmp.mini.buyables[62].effect)
                                                        ret = ret.times(tmp.mini.buyables[51].effect)
                                                        ret = ret.times(tmp.tokens.buyables[31].effect)
                        if (hasMilestone("n", 3))       ret = ret.times(100)
                        if (hasUpgrade("mini", 45))     ret = ret.times(player.mini.c_points.points.max(1))
                                                        ret = ret.times(tmp.p.effect)

                        return ret
                },
                getResetGain(){
                        if (inChallenge("n", 41)) return new Decimal(0)
                        let apts = player.mini.a_points
                        let extras = apts.extras
                        let lvls = player.mini.buyables
                        let order = [11,12,13  ,23,63,62  ,61,21]
                        let a = new Decimal(1)
                        for (i = 0; i < 8; i++){
                                a = a.times(extras[order[i]].plus(1))
                        }
                        let ret = a.sub(1).times(tmp.mini.a_points.getGainMult)

                        ret =                           ret.pow(tmp.tokens.buyables[61].effect)
                        if (hasUpgrade("n", 11))        ret = ret.pow(1.001)
                        if (hasUpgrade("n", 12))        ret = ret.pow(1.02)

                        if (hasMilestone("tokens", 9))  ret = ret.times(player.mini.b_points.points.plus(1).pow(.1))

                        return ret
                },
                getColorGainExp(){ // color gain exponent color gain exp
                        let exp = hasUpgrade("h", 54) ? .52 : .5
                        if (hasUpgrade("h", 55))        exp += .004
                        if (hasUpgrade("c", 12))        exp += tmp.c.upgrades[12].effect.toNumber()
                                                        exp += tmp.tokens.buyables[63].effect.toNumber()
                        if (hasMilestone("tokens", 4))  exp += .05
                        if (hasUpgrade("o", 32))        exp += .08

                        return exp
                },
                colorGainMult(){ // color gain
                        let ret = new Decimal(1)

                        ret = ret.times(tmp.tokens.buyables[33].effect)
                        ret = ret.times(tmp.n.effect)
                        ret = ret.times(player.mini.b_points.points.plus(10).log10().plus(9).log10())

                        return ret
                },
        },
        b_points: {
                getResetGain(){ // bpoint gain b point gain
                        let ret = new Decimal(1)

                        if (player.dev.bPointMult != undefined) ret = ret.times(player.dev.bPointMult)

                        if (player.hardMode)            ret = ret.div(3)

                                                        ret = ret.times(tmp.mini.buyables[31].effect)
                                                        ret = ret.times(tmp.mini.buyables[32].effect)
                                                        ret = ret.times(tmp.mini.buyables[41].effect)
                                                        ret = ret.times(tmp.mini.buyables[42].effect)
                                                        ret = ret.times(tmp.tokens.buyables[32].effect)
                        if (hasUpgrade("o", 21))        ret = ret.times(player.h.points.max(1))
                        if (hasUpgrade("mini", 42))     ret = ret.times(player.mini.c_points.points.max(1))
                        if (hasMilestone("n", 3))       ret = ret.times(100)
                                                        ret = ret.times(tmp.p.effect)

                        if (hasUpgrade("o", 13))        ret = ret.pow(tmp.o.upgrades[13].effect)
                                                        ret = ret.pow(tmp.tokens.buyables[62].effect)
                        if (hasUpgrade("n", 11))        ret = ret.pow(1.001)
                        if (hasUpgrade("n", 13))        ret = ret.pow(1.02)

                        if (hasMilestone("tokens", 8))  ret = ret.times(player.mini.a_points.points.plus(1).pow(.1))

                        return ret
                },
        },
        c_points: {
                getGainMult(){ // cpoint gain c point gain cpt gain
                        let ret = new Decimal(1)

                        if (player.dev.cPointMult != undefined) ret = ret.times(player.dev.cPointMult)

                        if (player.hardMode)            ret = ret.div(4)
                                                        ret = ret.times(tmp.mini.buyables[72].effect)
                                                        ret = ret.times(tmp.mini.buyables[73].effect)
                                                        ret = ret.times(tmp.mini.buyables[82].effect)
                                                        ret = ret.times(tmp.mini.buyables[83].effect)
                                                        ret = ret.times(tmp.mini.buyables[92].effect)
                                                        ret = ret.times(tmp.mini.buyables[93].effect)
                                                        ret = ret.times(tmp.mini.buyables[102].effect)
                                                        ret = ret.times(tmp.mini.buyables[103].effect)
                                                        ret = ret.times(tmp.mini.buyables[112].effect)
                                                        ret = ret.times(tmp.mini.buyables[113].effect)
                                                        ret = ret.times(tmp.n.effect)
                        if (hasMilestone("n", 1))       ret = ret.times(Decimal.pow(10, player.n.milestones.length ** 2))
                        if (hasMilestone("n", 3))       ret = ret.times(100)
                        if (hasUpgrade("mini", 13))     ret = ret.times(tmp.tokens.buyables[23].effect.max(10).log10())
                        if (hasUpgrade("mini", 14))     ret = ret.times(player.points.max(10).log10())
                        if (hasUpgrade("mini", 15))     ret = ret.times(player.mini.b_points.points.max(10).log10())
                        if (hasUpgrade("mini", 22))     ret = ret.times(player.h.points.max(10).log10())
                        if (hasUpgrade("mini", 32))     ret = ret.times(player.mini.c_points.points.max(1).pow(.01))
                        if (hasUpgrade("mini", 34))     ret = ret.times(player.mini.c_points.points.max(1).pow(.01))
                        if (hasUpgrade("tokens", 92))   ret = ret.times(player.mini.c_points.points.max(1).pow(.01))
                        if (hasUpgrade("mini", 35))     ret = ret.times(Decimal.pow(50, player.mini.upgrades.length))
                        if (hasUpgrade("n", 23))        ret = ret.times(tmp.n.upgrades[23].effect)
                        if (hasUpgrade("mini", 64))     ret = ret.times(player.mini.d_points.points.max(1))
                                                        ret = ret.times(tmp.p.effect)

                        if (hasUpgrade("n", 11))        ret = ret.pow(1.001)
                        if (hasUpgrade("n", 22))        ret = ret.pow(Decimal.pow(1.0002, player.n.upgrades.length))

                        return ret
                },
        },
        d_points: {
                getPointProduction(){
                        let init = tmp.mini.d_points.getFuelMultiplier
                        let mult = tmp.mini.d_points.getGainMult

                        let ret = init.times(mult)

                        if (player.hardMode) ret = ret.div(4)

                        return ret
                },
                getGainMult(){ // dpoint gain d point gain dpt gain
                        let ret = new Decimal(1)

                        if (player.dev.dPointMult != undefined) ret = ret.times(player.dev.dPointMult)

                                                        ret = ret.times(tmp.mini.buyables[151].effect)
                                                        ret = ret.times(tmp.mini.buyables[152].effect)
                                                        ret = ret.times(tmp.mini.buyables[153].effect)
                                                        ret = ret.times(tmp.mini.buyables[161].effect)
                                                        ret = ret.times(tmp.mini.buyables[162].effect)
                                                        ret = ret.times(tmp.mini.buyables[163].effect)
                                                        ret = ret.times(tmp.mini.buyables[171].effect)
                                                        ret = ret.times(tmp.mini.buyables[172].effect)
                                                        ret = ret.times(tmp.mini.buyables[173].effect)
                                                        ret = ret.times(tmp.mini.buyables[181].effect)
                                                        ret = ret.times(tmp.mini.buyables[182].effect)
                                                        ret = ret.times(tmp.mini.buyables[183].effect)
                        if (hasUpgrade("mini", 54))     ret = ret.times(player.n.points.max(1))
                        if (hasUpgrade("mini", 65))     ret = ret.times(3)
                        if (hasUpgrade("mini", 52))     ret = ret.times(2)
                        if (hasUpgrade("n", 33))        ret = ret.times(player.mini.d_points.fuel.max(1).pow(.001))
                        if (hasUpgrade("n", 55))        ret = ret.times(player.mini.e_points.points.max(1).min("1e50000"))
                        if (hasUpgrade("mini", 83))     ret = ret.times(player.mini.e_points.points.pow(.1))
                                                        ret = ret.times(tmp.p.effect.min("1ee7"))
                        if (hasUpgrade("p", 22))        ret = ret.times(player.mini.e_points.points.pow(.05 * player.p.upgrades.length))
                        if (hasMilestone("mu", 3))      ret = ret.times(player.mini.e_points.points)

                        return ret
                },
                getEffectiveFuelLogBase(){
                        let ret = 10
                        if (hasUpgrade("mini", 71)) ret ++
                        if (hasUpgrade("mini", 72)) ret ++

                        ret = new Decimal(ret)

                        if (hasChallenge("n", 41))      ret = ret.plus(tmp.n.challenges[41].rewardEffect)
                                                        ret = ret.plus(tmp.mini.buyables[133].effect)
                        if (hasUpgrade("n", 54))        ret = ret.plus(tmp.mini.buyables[221].effect)

                        return ret 
                },
                getEffectiveFuel(){ //returns the value of fuel for pt gain
                        let amt = player.mini.d_points.fuel.div(10)

                        if (amt.lt(1)) return amt
                        
                        let logBase = tmp.mini.d_points.getEffectiveFuelLogBase // how often we square root

                        let times = amt.log(logBase).plus(1).log(2).floor()
                        // how many times to square root the final thing
                        let a = Decimal.pow(2, times)

                        let mult_main = Decimal.pow(logBase, times)
                        let mult_extra = amt.div(Decimal.pow(logBase, a.sub(1))).root(a)

                        return mult_main.times(mult_extra)
                },
                getEffectiveFuelAux(){
                        let eff = tmp.mini.d_points.getEffectiveFuel
                        
                        let ret = eff.cbrt().div(100)
                        if (ret.gt(1e4)) ret = ret.log10().plus(6).pow(4)

                        return ret
                },      
                getLin(){
                        let ret = new Decimal(1)
                        
                        ret = ret.plus(tmp.mini.buyables[121].effect)

                        return ret
                },
                getQuad(){
                        let ret = new Decimal(0)
                        if (hasUpgrade("mini", 53))     ret = ret.plus(.01)
                                                        ret = ret.plus(tmp.mini.buyables[131].effect)
                        return ret
                },
                getExp1(){
                        let ret = new Decimal(1)

                        ret = ret.plus(tmp.mini.buyables[132].effect)

                        return ret
                },
                getFuelMultiplier(){
                        let data = tmp.mini.d_points
                        let eff = data.getEffectiveFuel

                        let lin  = data.getLin
                        let quad = data.getQuad //quadratic
                        let exp1 = data.getExp1 // base of the exponential

                        let y = data.getEffectiveFuelAux

                        let mult1 = eff.pow(1).times(lin)
                        let mult2 = eff.pow(2).times(quad)
                        let mult3 = Decimal.pow(exp1, y)

                        return mult1.plus(mult2).times(mult3)
                },
                getMaximumFuel(){
                        let ret = new Decimal(100)

                        ret = ret.times(tmp.mini.buyables[122].effect)
                        ret = ret.times(tmp.mini.buyables[123].effect)
                        if (hasUpgrade("n", 34)) {
                                let exp = new Decimal(.01).times(player.n.upgrades.length)
                                ret = ret.times(Decimal.pow(player.mini.d_points.points.max(1), exp))
                        }

                        return ret
                },  
                getUpgrades(){
                        let a = 0
                        let x = player.mini.upgrades
                        for (i in x) {
                                if (x[i] > 50) a ++
                        }
                        return a
                },
        },
        e_points: {
                getGainMult(){ // epoint gain e point gain ept gain e pt gain
                        let ret = new Decimal(1)

                        if (player.dev.ePointMult != undefined) ret = ret.times(player.dev.ePointMult)

                        if (player.hardMode)            ret = ret.div(4)
                                                        ret = ret.times(tmp.mini.buyables[213].effect)
                                                        ret = ret.times(tmp.mini.buyables[223].effect)
                                                        ret = ret.times(tmp.mini.buyables[233].effect)
                                                        ret = ret.times(tmp.mini.buyables[241].effect)
                        if (hasUpgrade("p", 12))        ret = ret.times(tmp.mini.buyables[183].effect)
                        if (hasUpgrade("n", 41))        ret = ret.times(player.n.points.max(10).log10())
                        if (hasUpgrade("o", 35))        ret = ret.times(player.n.points.max(1).pow(.26))
                        if (hasUpgrade("n", 45)) {
                                l = player.mini.buyables[221].sub(21).max(0)
                                let base = 1
                                if (hasUpgrade("n", 51)) {
                                        base ++
                                        if (hasUpgrade("n", 52)) base ++
                                        if (hasUpgrade("n", 53)) base ++
                                        if (hasUpgrade("n", 54)) base ++
                                        if (hasUpgrade("n", 55)) base ++
                                                        ret = ret.times(Decimal.pow(2, base-1))
                                }
                                                        ret = ret.times(Decimal.pow(2, l.times(base)))
                                                        ret = ret.times(player.mini.e_points.points.max(10).log10())
                        }
                        if (hasUpgrade("mini", 84))     ret = ret.times(Decimal.pow(1.02, getBuyableAmount("mini", 222)))
                                                        ret = ret.times(tmp.p.effect.min("1ee6"))
                        if (hasMilestone("p", 3))       ret = ret.times(player.mini.e_points.points.max(1).pow(.001))
                        if (hasUpgrade("p", 23))        {
                                let base = 1 + player.p.upgrades.length/10
                                let exp = getBuyableAmount("mini", 212)
                                                        ret = ret.times(Decimal.pow(base, exp))
                        }
                        if (hasUpgrade("mu", 11))       ret = ret.times(player.mu.points.plus(10).log10().pow(getBuyableAmount("mini", 202)))

                        return ret
                },
                getRecursionValue(){
                        let data = tmp.mini.e_points

                        let a = data.getA
                        let b = data.getB
                        let c = data.getC
                        let d = data.getD
                        let iter = data.getMaxInterations

                        let f = function(x){
                                return a.div(10000).times(x).plus(b).times(x).plus(c).times(x).plus(d)
                        }

                        return recurse(f, new Decimal(0), iter)
                },
                getPointProduction(){
                        let data = tmp.mini.e_points

                        let ret = data.getRecursionValue.times(data.getGainMult)

                        return ret
                },
                getA(){
                        let ret = new Decimal(0)

                        if (hasUpgrade("n", 42)) ret = ret.plus(.1)
                        if (hasUpgrade("n", 43)) ret = ret.plus(.1)
                        if (hasUpgrade("n", 44)) ret = ret.plus(player.mini.buyables[222].times(.01))

                        if (hasUpgrade("o", 33) && ret.gt(1)) ret = ret.pow(2) 
                        if (hasUpgrade("p", 25) && ret.gt(1)) ret = ret.pow(2)
                        if (hasUpgrade("p", 31) && ret.gt(1)) ret = ret.pow(2)

                        return ret
                },
                getB(){
                        let ret = new Decimal(0)

                        ret = ret.plus(tmp.mini.buyables[211].effect)

                        return ret
                },
                getC(){
                        let ret = new Decimal(1)

                        ret = ret.plus(tmp.mini.buyables[203].effect)

                        ret = ret.times(tmp.mini.buyables[231].effect)

                        return ret
                },
                getD(){
                        let ret = new Decimal(1)

                        ret = ret.plus(tmp.mini.buyables[202].effect)

                        return ret
                },
                getMaxInterations(){
                        let ret = 1

                        ret += tmp.mini.buyables[201].effect.toNumber()

                        return ret
                },
        },
        buyables: {
                rows: 25,
                cols: 3,
                11: {
                        title: "<bdi style='color:#FF0000'>Red</bdi>",
                        cost: () => new Decimal(20).times(Decimal.pow(1e3, Decimal.pow(getBuyableAmount("mini", 11), 1.2))),
                        canAfford:() => player.mini.a_points.points.gte(tmp.mini.buyables[11].cost) && getBuyableAmount("mini", 11).lt(5000),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[11] = player.mini.buyables[11].plus(1)
                                player.mini.a_points.points = player.mini.a_points.points.sub(tmp.mini.buyables[11].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(20)
                                let base = 1e3
                                let exp = 1.2
                                let pts = player.mini.a_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1).min(5000)
                        },
                        base(){
                                if (inChallenge("n", 11)) return new Decimal(1)
                                let ret = new Decimal(2)
                                ret = ret.plus(tmp.mini.buyables[23].effect)
                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[11].base.pow(player.mini.buyables[11])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "A") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.mini.buyables[11]) + "</b><br>"
                                let amt = "<b><h2>Amount</h2>: " + format(player.mini.a_points.extras[11]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[11].effect) + " to Atomic Hydrogen gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 11)) + " A Points</b><br>"
                                let eformula = format(tmp.mini.buyables[11].base) + "^x"

                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(20)*(1e3^x<sup>1.2</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                12: {
                        title: "<bdi style='color:#FF9933'>Orange</bdi>",
                        cost: () => new Decimal(1e20).times(Decimal.pow(1e9, Decimal.pow(getBuyableAmount("mini", 12), 1.1))),
                        canAfford:() => player.mini.a_points.points.gte(tmp.mini.buyables[12].cost) && getBuyableAmount("mini", 12).lt(5000),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[12] = player.mini.buyables[12].plus(1)
                                player.mini.a_points.points = player.mini.a_points.points.sub(tmp.mini.buyables[12].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(1e20)
                                let base = 1e9
                                let exp = 1.1
                                let pts = player.mini.a_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1).min(5000)
                        },
                        base(){
                                if (inChallenge("n", 11)) return new Decimal(1)
                                let ret = new Decimal(2)
                                ret = ret.plus(tmp.mini.buyables[23].effect)
                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[12].base.pow(player.mini.buyables[12])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "A") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.mini.buyables[12]) + "</b><br>"
                                let amt = "<b><h2>Amount</h2>: " + format(player.mini.a_points.extras[12]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[12].effect) + " to A Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 12)) + " A Points</b><br>"
                                let eformula = format(tmp.mini.buyables[12].base) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e20)*(1e9^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                13: {
                        title: "<bdi style='color:#FFFF00'>Yellow</bdi>",
                        cost: () => new Decimal(1e6).times(Decimal.pow(1e6, Decimal.pow(getBuyableAmount("mini", 13), 1.2))),
                        canAfford:() => player.mini.a_points.points.gte(tmp.mini.buyables[13].cost) && getBuyableAmount("mini", 13).lt(5000),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[13] = player.mini.buyables[13].plus(1)
                                player.mini.a_points.points = player.mini.a_points.points.sub(tmp.mini.buyables[13].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(1e6)
                                let base = 1e6
                                let exp = 1.2
                                let pts = player.mini.a_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1).min(5000)
                        },
                        base(){
                                if (inChallenge("n", 11)) return new Decimal(1)
                                let ret = new Decimal(2)
                                ret = ret.plus(tmp.mini.buyables[23].effect)
                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[13].base.pow(player.mini.buyables[13])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "A") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.mini.buyables[13]) + "</b><br>"
                                let amt = "<b><h2>Amount</h2>: " + format(player.mini.a_points.extras[13]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[13].effect) + " to Deuterium</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 13)) + " A Points</b><br>"
                                let eformula = format(tmp.mini.buyables[13].base) + "^x" 
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e6)*(1e6^x<sup>1.2</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                21: {
                        title: "<bdi style='color:#FFFFFF'>White</bdi>",
                        cost: () => new Decimal("1e300").times(Decimal.pow(1e30, Decimal.pow(getBuyableAmount("mini", 21), 1.1))),
                        canAfford:() => player.mini.a_points.points.gte(tmp.mini.buyables[21].cost) && getBuyableAmount("mini", 21).lt(5000),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[21] = player.mini.buyables[21].plus(1)
                                player.mini.a_points.points = player.mini.a_points.points.sub(tmp.mini.buyables[21].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(1e300)
                                let base = 1e30
                                let exp = 1.1
                                let pts = player.mini.a_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1).min(5000)
                        },
                        initBase(){
                                if (inChallenge("n", 11)) return new Decimal(0)
                                return new Decimal(2)
                        },
                        base(){
                                let ret = tmp.mini.buyables[21].initBase
                                if (hasUpgrade("h", 53)) {
                                        let a = 1
                                        if (hasUpgrade("h", 64)) a ++
                                        ret = ret.times(player.mini.buyables[21].max(1).ln().max(1).pow(a))
                                }
                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[21].base.times(player.mini.buyables[21])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "A") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.mini.buyables[21]) + "</b><br>"
                                let amt = "<b><h2>Amount</h2>: " + format(player.mini.a_points.extras[21]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[21].effect) + " to <bdi style='color:#CC0033'>A</bdi></b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 21)) + " A Points</b><br>"
                                let eformula = "2*x"
                                if (hasUpgrade("h", 53)) eformula = "2*x*ln(x)"
                                if (hasUpgrade("h", 64)) eformula = "2*x*(ln(x))^2"

                                eformula = eformula.replace("2", format(tmp.mini.buyables[21].initBase))
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e300)*(1e30^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                23: {
                        title: "<bdi style='color:#33CC33'>Green</bdi>",
                        cost: () => new Decimal(1e31).times(Decimal.pow(1e11, Decimal.pow(getBuyableAmount("mini", 23), 1.1))),
                        canAfford:() => player.mini.a_points.points.gte(tmp.mini.buyables[23].cost) && getBuyableAmount("mini", 23).lt(5000),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[23] = player.mini.buyables[23].plus(1)
                                player.mini.a_points.points = player.mini.a_points.points.sub(tmp.mini.buyables[23].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(1e31)
                                let base = 1e11
                                let exp = 1.1
                                let pts = player.mini.a_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1).min(5000)
                        },
                        base(){
                                if (inChallenge("n", 11)) return new Decimal(0)
                                let ret = new Decimal(1)
                                if (hasUpgrade("h", 64)) ret = ret.times(player.mini.buyables[23].max(1).log10().max(1))
                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[23].base.times(player.mini.buyables[23])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "A") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.mini.buyables[23]) + "</b><br>"
                                let amt = "<b><h2>Amount</h2>: " + format(player.mini.a_points.extras[23]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[23].effect) + " to Red, Orange, and Yellow base</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 23)) + " A Points</b><br>"
                                let eformula = "x"
                                if (hasUpgrade("h", 64)) eformula = "log10(x)*x<br>" + format(getBuyableBase("mini", 23)) + "*x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e31)*(1e11^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                61: {
                        title: "<bdi style='color:#660099'>Violet</bdi>",
                        cost: () => new Decimal(1e15).times(Decimal.pow(1e10, Decimal.pow(getBuyableAmount("mini", 61), 1.1))),
                        canAfford:() => player.mini.a_points.points.gte(tmp.mini.buyables[61].cost) && getBuyableAmount("mini", 61).lt(5000),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[61] = player.mini.buyables[61].plus(1)
                                player.mini.a_points.points = player.mini.a_points.points.sub(tmp.mini.buyables[61].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(1e15)
                                let base = 1e10
                                let exp = 1.1
                                let pts = player.mini.a_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1).min(5000)
                        },
                        base(){
                                if (inChallenge("n", 11)) return new Decimal(1)
                                let ret = new Decimal(3)
                                if (hasUpgrade("h", 52)) ret = ret.plus(1)
                                ret = ret.plus(tmp.mini.buyables[52].effect)
                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[61].base.pow(player.mini.buyables[61])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "A") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.mini.buyables[61]) + "</b><br>"
                                let amt = "<b><h2>Amount</h2>: " + format(player.mini.a_points.extras[61]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[61].effect) + " to Life Points</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 61)) + " A Points</b><br>"
                                let eformula = format(tmp.mini.buyables[61].base) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e15)*(1e10^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                62: {
                        title: "<bdi style='color:#333399'>Indigo</bdi>",
                        cost: () => new Decimal(1e33).times(Decimal.pow(2000, Decimal.pow(getBuyableAmount("mini", 62), 1.15))),
                        canAfford:() => player.mini.a_points.points.gte(tmp.mini.buyables[62].cost) && getBuyableAmount("mini", 62).lt(5000),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[62] = player.mini.buyables[62].plus(1)
                                player.mini.a_points.points = player.mini.a_points.points.sub(tmp.mini.buyables[62].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(1e33)
                                let base = 2000
                                let exp = 1.15
                                let pts = player.mini.a_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1).min(5000)
                        },
                        base(){
                                if (inChallenge("n", 11)) return new Decimal(1)
                                let ret = player.mini.a_points.points.plus(10).ln()
                                if (hasUpgrade("c", 14)) ret = ret.div(Math.log(2))
                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[62].base.pow(player.mini.buyables[62])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "A") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.mini.buyables[62]) + "</b><br>"
                                let amt = "<b><h2>Amount</h2>: " + format(player.mini.a_points.extras[62]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[62].effect) + " to A Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 62)) + " A Points</b><br>"
                                let eformula = "ln(10+[A Points])^x<br>" + format(tmp.mini.buyables[62].base) + "^x" 
                                if (hasUpgrade("c", 14)) eformula = eformula.replace("ln", "log2")
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e33)*(2e3^x<sup>1.15</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                63: {
                        title: "<bdi style='color:#0000FF'>Blue</bdi>",
                        cost: () => new Decimal(1e10).times(Decimal.pow(1e8, Decimal.pow(getBuyableAmount("mini", 63), 1.1))),
                        canAfford:() => player.mini.a_points.points.gte(tmp.mini.buyables[63].cost) && getBuyableAmount("mini", 63).lt(5000),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[63] = player.mini.buyables[63].plus(1)
                                player.mini.a_points.points = player.mini.a_points.points.sub(tmp.mini.buyables[63].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(1e10)
                                let base = 1e8
                                let exp = 1.1
                                let pts = player.mini.a_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1).min(5000)
                        },
                        base(){
                                if (inChallenge("n", 11)) return new Decimal(1)
                                let ret = new Decimal(2)
                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[63].base.pow(player.mini.buyables[63])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "A") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.mini.buyables[63]) + "</b><br>"
                                let amt = "<b><h2>Amount</h2>: " + format(player.mini.a_points.extras[63]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[63].effect) + " to Hydrogen</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 63)) + " A Points</b><br>"
                                let eformula = format(tmp.mini.buyables[63].base) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e10)*(1e8^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                22: {
                        display(){
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "A") return ""
                                let a = "A Point production is the product of <br><b>(1+[amounts])</b><br> over all colors minus 1<br>Currently: "
                                return a + format(tmp.mini.a_points.getResetGain) + "/sec"
                        }
                },
                31: {
                        title: "B11", 
                        cost:() => new Decimal(10).times(Decimal.pow(20, Decimal.pow(nerfBminigameBuyableAmounts(getBuyableAmount("mini", 31)), 1.1))),
                        canAfford:() => player.mini.b_points.points.gte(tmp.mini.buyables[31].cost) && getBuyableAmount("mini", 31).lt(5000),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[31] = player.mini.buyables[31].plus(1)
                                player.mini.b_points.points = player.mini.b_points.points.sub(tmp.mini.buyables[31].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(10)
                                let base = 20
                                let exp = 1.1
                                let pts = player.mini.b_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1).min(5000)
                        },
                        unlocked(){
                                return true
                        },
                        base(){
                                return player.points.plus(10).log10()
                        },
                        effect(){
                                return tmp.mini.buyables[31].base.pow(player.mini.buyables[31])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "B") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[31]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[31].effect) + " to B Points gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 31)) + " B Points</b><br>"
                                let eformula = "log10([Life Points] + 10)^x<br>" + format(getBuyableBase("mini", 31)) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(10)*(20^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                32: {
                        title: "B12", 
                        cost:() => new Decimal(3e6).times(Decimal.pow(5e5, Decimal.pow(nerfBminigameBuyableAmounts(getBuyableAmount("mini", 32)), 1.2))),
                        canAfford:() => player.mini.b_points.points.gte(tmp.mini.buyables[32].cost) && getBuyableAmount("mini", 32).lt(5000),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[32] = player.mini.buyables[32].plus(1)
                                player.mini.b_points.points = player.mini.b_points.points.sub(tmp.mini.buyables[32].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(3e6)
                                let base = 5e5
                                let exp = 1.2
                                let pts = player.mini.b_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1).min(5000)
                        },
                        unlocked(){
                                return player.mini.buyables[31].gte(4)
                        },
                        base(){
                                return player.mini.b_points.points.plus(10).log2()
                        },
                        effect(){
                                return tmp.mini.buyables[32].base.pow(player.mini.buyables[32])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "B") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[32]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[32].effect) + " to B Points gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 32)) + " B Points</b><br>"
                                let eformula = "log2([B Points] + 10)^x<br>" + format(getBuyableBase("mini", 32)) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(3e6)*(5e5^x<sup>1.2</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                33: {
                        title: "B13", 
                        cost:() => new Decimal(1e25).times(Decimal.pow(100, Decimal.pow(nerfBminigameBuyableAmounts(getBuyableAmount("mini", 33)), 1.2))),
                        canAfford:() => player.mini.b_points.points.gte(tmp.mini.buyables[33].cost) && getBuyableAmount("mini", 33).lt(5000),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[33] = player.mini.buyables[33].plus(1)
                                player.mini.b_points.points = player.mini.b_points.points.sub(tmp.mini.buyables[33].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(1e25)
                                let base = 100
                                let exp = 1.2
                                let pts = player.mini.b_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1).min(5000)
                        },
                        unlocked(){
                                return player.mini.buyables[31].gte(15)
                        },
                        base(){
                                return new Decimal(.1)
                        },
                        effect(){
                                return tmp.mini.buyables[33].base.times(player.mini.buyables[33])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "B") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[33]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[33].effect) + " to <bdi style='color:#CC0033'>B</bdi></b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 33)) + " B Points</b><br>"
                                let eformula = ".1*x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e25)*(100^x<sup>1.2</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                41: {
                        title: "B21", 
                        cost:() => new Decimal(1e33).times(Decimal.pow(10, Decimal.pow(nerfBminigameBuyableAmounts(getBuyableAmount("mini", 41)), 1.5))),
                        canAfford:() => player.mini.b_points.points.gte(tmp.mini.buyables[41].cost) && getBuyableAmount("mini", 41).lt(5000),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[41] = player.mini.buyables[41].plus(1)
                                player.mini.b_points.points = player.mini.b_points.points.sub(tmp.mini.buyables[41].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(1e33)
                                let base = 10
                                let exp = 1.5
                                let pts = player.mini.b_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1).min(5000)
                        },
                        unlocked(){
                                return player.mini.buyables[31].gte(19)
                        },
                        base(){
                                return tmp.h.upgrades[42].effect
                        },
                        effect(){
                                return tmp.mini.buyables[41].base.pow(player.mini.buyables[41])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "B") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[41]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[41].effect) + " to B Points gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 41)) + " B Points</b><br>"
                                let eformula = "<bdi style='color:#CC0033'>B</bdi>^x<br>" + format(getBuyableBase("mini", 41)) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e33)*(10^x<sup>1.5</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                42: {
                        title: "B22", 
                        cost:() => new Decimal(5e237).times(Decimal.pow(2e10, Decimal.pow(nerfBminigameBuyableAmounts(getBuyableAmount("mini", 42)), 1.35))),
                        canAfford:() => player.mini.b_points.points.gte(tmp.mini.buyables[42].cost) && getBuyableAmount("mini", 42).lt(5000),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[42] = player.mini.buyables[42].plus(1)
                                player.mini.b_points.points = player.mini.b_points.points.sub(tmp.mini.buyables[42].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(5e237)
                                let base = 2e10
                                let exp = 1.35
                                let pts = player.mini.b_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1).min(5000)
                        },
                        unlocked(){
                                return player.mini.buyables[31].gte(114)
                        },
                        base(){
                                return player.mini.b_points.points.plus(10).log(8).ln().max(1)
                        },
                        effect(){
                                return tmp.mini.buyables[42].base.pow(player.mini.buyables[42])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "B") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[42]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[42].effect) + " to B Points and Hydrogen gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 42)) + " B Points</b><br>"
                                let eformula = "ln(log8([B points]))^x<br>" + format(getBuyableBase("mini", 42)) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(5e237)*(2e10^x<sup>1.35</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                43: {
                        title: "B23", 
                        cost:() => new Decimal("1e425").times(Decimal.pow(1e15, Decimal.pow(nerfBminigameBuyableAmounts(getBuyableAmount("mini", 43)), 1.2))),
                        canAfford:() => player.mini.b_points.points.gte(tmp.mini.buyables[43].cost) && getBuyableAmount("mini", 43).lt(5000),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[43] = player.mini.buyables[43].plus(1)
                                player.mini.b_points.points = player.mini.b_points.points.sub(tmp.mini.buyables[43].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e425")
                                let base = 1e15
                                let exp = 1.2
                                let pts = player.mini.b_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1).min(5000)
                        },
                        unlocked(){
                                return player.mini.buyables[31].gte(181)
                        },
                        base(){
                                return new Decimal(1.2).plus(player.mini.buyables[43].div(100)).ln()
                        },
                        effect(){
                                return tmp.mini.buyables[43].base.times(player.mini.buyables[43])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "B") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[43]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[43].effect) + " to <bdi style='color:#CC0033'>B</bdi></b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 43)) + " B Points</b><br>"
                                let eformula = "ln(1.2+x/100)*x<br>" + format(getBuyableBase("mini", 43), 3) + "*x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e425)*(1e15^x<sup>1.2</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                51: {
                        title: "B31", 
                        cost:() => new Decimal("1e5600").times(Decimal.pow(1e8, Decimal.pow(nerfBminigameBuyableAmounts(getBuyableAmount("mini", 51)), 1.3))),
                        canAfford:() => player.mini.b_points.points.gte(tmp.mini.buyables[51].cost) && getBuyableAmount("mini", 51).lt(5000),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[51] = player.mini.buyables[51].plus(1)
                                player.mini.b_points.points = player.mini.b_points.points.sub(tmp.mini.buyables[51].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e5600")
                                let base = 1e8
                                let exp = 1.3
                                let pts = player.mini.b_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1).min(5000)
                        },
                        unlocked(){
                                return player.mini.buyables[31].gte(2000)
                        },
                        base(){
                                return player.mini.b_points.points.plus(10).ln().ln().max(1)
                        },
                        effect(){
                                return tmp.mini.buyables[51].base.pow(player.mini.buyables[51])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "B") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[51]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[51].effect) + " to A Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 51)) + " B Points</b><br>"
                                let eformula = "ln(ln([B Points]))^x<br>" + format(getBuyableBase("mini", 51), 3) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e5600)*(1e8^x<sup>1.3</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                52: {
                        title: "B32", 
                        cost:() => new Decimal("1e18650").times(Decimal.pow(1e4, Decimal.pow(nerfBminigameBuyableAmounts(getBuyableAmount("mini", 52)), 1.1))),
                        canAfford:() => player.mini.b_points.points.gte(tmp.mini.buyables[52].cost) && getBuyableAmount("mini", 52).lt(5000),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[52] = player.mini.buyables[52].plus(1)
                                player.mini.b_points.points = player.mini.b_points.points.sub(tmp.mini.buyables[52].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e18650")
                                let base = 1e4
                                let exp = 1.1
                                let pts = player.mini.b_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1).min(5000)
                        },
                        unlocked(){
                                return player.mini.buyables[33].gte(2008)
                        },
                        base(){
                                let ret = new Decimal(.01)

                                if (hasUpgrade("c", 13)) ret = ret.times(player.mini.buyables[52].sqrt().div(10).plus(Math.E).ln())

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[52].base.times(player.mini.buyables[52])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "B") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[52]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[52].effect) + " to Violet base</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 52)) + " B Points</b><br>"
                                let eformula = ".01*x"
                                if (hasUpgrade("c", 13)) eformula = ".01*ln(e+sqrt(x)/10)*x<br>" + format(getBuyableBase("mini", 52), 4) + "*x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e18650)*(1e4^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                53: {
                        title: "B33", 
                        cost:() => new Decimal("1e22000").times(Decimal.pow(1e3, Decimal.pow(nerfBminigameBuyableAmounts(getBuyableAmount("mini", 53)), 1.2))),
                        canAfford:() => player.mini.b_points.points.gte(tmp.mini.buyables[53].cost) && getBuyableAmount("mini", 53).lt(5000),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[53] = player.mini.buyables[53].plus(1)
                                player.mini.b_points.points = player.mini.b_points.points.sub(tmp.mini.buyables[53].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e22000")
                                let base = 1e3
                                let exp = 1.2
                                let pts = player.mini.b_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1).min(5000)
                        },
                        unlocked(){
                                return player.mini.buyables[52].gte(410)
                        },
                        base(){
                                return player.mini.buyables[53].div(30).plus(1)
                        },
                        effect(){
                                return tmp.mini.buyables[53].base.times(player.mini.buyables[53])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "B") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[53]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[53].effect) + " to <bdi style='color:#CC0033'>B</bdi></b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 53)) + " B Points</b><br>"
                                let eformula = "(1+x/30)*x<br>" + format(getBuyableBase("mini", 53)) + "*x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e22000)*(1e3^x<sup>1.2</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                71: {
                        title: "Unlock a slot", 
                        cost(){
                                let base = new Decimal(100)
                                if (hasUpgrade("mini", 35)) base = new Decimal(50)
                                if (hasUpgrade("tokens", 94)) base = new Decimal(10)

                                let init = getBuyableAmount("mini", 71)
                                if (!hasUpgrade("mini", 25)) init = init.plus(1)

                                let exp2 = getBuyableAmount("mini", 71).div(2).plus(3)
                                if (hasUpgrade("mini", 42)) exp2 = exp2.min(6)
                                let exp = init.pow(exp2)
                                
                                
                                return base.pow(exp)
                        },
                        canAfford:() => player.mini.c_points.points.gte(tmp.mini.buyables[71].cost) && getBuyableAmount("mini", 71).lt(11),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[71] = player.mini.buyables[71].plus(1)
                                player.mini.c_points.points = player.mini.c_points.points.sub(tmp.mini.buyables[71].cost)
                        },
                        unlocked(){
                                return true
                        },
                        display(){
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                if (player.subtabs.mini.c_content != "Buyables") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[71]) + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 71)) + " C Points</b><br>"
                                //if its undefined set it to that
                                //otherwise use normal formula

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + cost
                                        return "<br>" + start + end
                                }
                                let comp1 = "(x+1)"
                                if (hasUpgrade("mini", 25)) comp1 = "x"
                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let base = "100"
                                if (hasUpgrade("mini", 35)) base = "50"
                                if (hasUpgrade("tokens", 94)) base = "10"
                                let exp = "x/2+3"
                                if (hasUpgrade("mini", 42)) exp = "6"
                                let cost2 = "(" + base + ")^(" + comp1 + "<sup>" + exp + "</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allCost + "<br>You can only have 15 slots"
                                return "<br>" + end 
                        },
                },
                72: {
                        title: "C Point Gain 1", 
                        cost:() => new Decimal(1e3).times(Decimal.pow(100, Decimal.pow(getBuyableAmount("mini", 72), 1.3))),
                        canAfford:() => player.mini.c_points.points.gte(tmp.mini.buyables[72].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[72] = player.mini.buyables[72].plus(1)
                                player.mini.c_points.points = player.mini.c_points.points.sub(tmp.mini.buyables[72].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(1e3)
                                let base = 100
                                let exp = 1.3
                                let pts = player.mini.c_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 71).gt(0)
                        },
                        base(){
                                let ret = player.mini.c_points.points.max(10).log10()
                                if (hasUpgrade("tokens", 91)) ret = ret.times(Math.log(10))
                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[72].base.pow(player.mini.buyables[72])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                if (player.subtabs.mini.c_content != "Buyables") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[72]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[72].effect) + " to C Point</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 72)) + " C Points</b><br>"
                                let init = "log10(C Points)<sup>x</sup>"
                                if (hasUpgrade("tokens", 91)) init = "ln(C Points)<sup>x</sup>"
                                let eformula = init + "<br>" + format(getBuyableBase("mini", 72)) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1000)*(100^x<sup>1.3</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                73: {
                        title: "C Point Gain 2", 
                        cost:() => new Decimal(5e3).times(Decimal.pow(200, Decimal.pow(getBuyableAmount("mini", 73), 1.1))),
                        canAfford:() => player.mini.c_points.points.gte(tmp.mini.buyables[73].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[73] = player.mini.buyables[73].plus(1)
                                player.mini.c_points.points = player.mini.c_points.points.sub(tmp.mini.buyables[73].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(5e3)
                                let base = 200
                                let exp = 1.1
                                let pts = player.mini.c_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 72).gt(0)
                        },
                        base(){
                                return player.tokens.total.max(1)
                        },
                        effect(){
                                return tmp.mini.buyables[73].base.pow(player.mini.buyables[73])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                if (player.subtabs.mini.c_content != "Buyables") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[73]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[73].effect) + " to C Point</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 73)) + " C Points</b><br>"
                                let eformula = "tokens<sup>x</sup><br>" + format(getBuyableBase("mini", 73)) + "^x" 
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(5000)*(200^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                81: {
                        title: "<bdi style='color:#CC0033'>C</bdi> increase 1",
                        cost:() => new Decimal(1e90).times(Decimal.pow(1e5, Decimal.pow(getBuyableAmount("mini", 81), 1.2))),
                        canAfford:() => player.mini.c_points.points.gte(tmp.mini.buyables[81].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[81] = player.mini.buyables[81].plus(1)
                                player.mini.c_points.points = player.mini.c_points.points.sub(tmp.mini.buyables[81].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(1e90)
                                let base = 1e5
                                let exp = 1.2
                                let pts = player.mini.c_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 73).gt(28)
                        },
                        base(){
                                if (inChallenge("n", 11)) return new Decimal(0)
                                let ret = new Decimal(.1)
                                if (hasUpgrade("mini", 21)) ret = ret.plus(.1)
                                if (hasUpgrade("mini", 24)) ret = ret.plus(.05)
                                if (hasChallenge("n", 21)) ret = ret.times(tmp.n.challenges[21].rewardEffect)
                                
                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[81].base.times(player.mini.buyables[81])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                if (player.subtabs.mini.c_content != "Buyables") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[81]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[81].effect) + " to <bdi style='color:#CC0033'>C</bdi></b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 81)) + " C Points</b><br>"
                                let eformula = format(getBuyableBase("mini", 81)) + "*x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e90)*(1e5^x<sup>1.2</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                82: {
                        title: "C Point gain 3",
                        cost:() => new Decimal(1e180).times(Decimal.pow(1e4, Decimal.pow(getBuyableAmount("mini", 82), 1.2))),
                        canAfford:() => player.mini.c_points.points.gte(tmp.mini.buyables[82].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[82] = player.mini.buyables[82].plus(1)
                                player.mini.c_points.points = player.mini.c_points.points.sub(tmp.mini.buyables[82].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(1e180)
                                let base = 1e4
                                let exp = 1.2
                                let pts = player.mini.c_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 73).gt(50)
                        },
                        base(){
                                let ret = tmp.tokens.milestones[23].effect

                                if (hasUpgrade("mini", 43)) ret = ret.plus(player.mini.buyables[82])
                                
                                return ret.max(1)
                        },
                        effect(){
                                return tmp.mini.buyables[82].base.pow(player.mini.buyables[82])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                if (player.subtabs.mini.c_content != "Buyables") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[82]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[82].effect) + " to C Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 82)) + " C Points</b><br>"
                                let baseStr = "<bdi style='color:#CC0033'>C</bdi>"
                                if (hasUpgrade("mini", 43)) baseStr = "(" + baseStr + " + x)"
                                let eformula = baseStr + "<sup>x</sup><br>" + format(getBuyableBase("mini", 82)) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e180)*(1e4^x<sup>1.2</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                83: {
                        title: "C Point gain 4",
                        cost:() => new Decimal(1e225).times(Decimal.pow(1e10, Decimal.pow(getBuyableAmount("mini", 83), 1.3))),
                        canAfford:() => player.mini.c_points.points.gte(tmp.mini.buyables[83].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[83] = player.mini.buyables[83].plus(1)
                                player.mini.c_points.points = player.mini.c_points.points.sub(tmp.mini.buyables[83].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(1e225)
                                let base = 1e10
                                let exp = 1.3
                                let pts = player.mini.c_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 73).gt(64)
                        },
                        base(){
                                let ret = player.o.points.max(10).log10()

                                if (hasUpgrade("mini", 23)) ret = ret.times(Math.log(10))
                                if (hasMilestone("tokens", 24)) ret = ret.div(Math.log(2))

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[83].base.pow(player.mini.buyables[83])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                if (player.subtabs.mini.c_content != "Buyables") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[83]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[83].effect) + " to C Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 83)) + " C Points</b><br>"
                                let eformula = "(log10(Oxygen))<sup>x</sup><br>" + format(getBuyableBase("mini", 83)) + "^x"
                                if (hasUpgrade("mini", 23)) eformula = eformula.replace("log10", "ln")
                                if (hasMilestone("tokens", 24)) eformula = eformula.replace("ln", "log2")
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e225)*(1e10^x<sup>1.3</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                91: {
                        title: "<bdi style='color:#CC0033'>C</bdi> increase 2",
                        cost:() => new Decimal("1e1300").times(Decimal.pow(1e8, Decimal.pow(getBuyableAmount("mini", 91), 1.3))),
                        canAfford:() => player.mini.c_points.points.gte(tmp.mini.buyables[91].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[91] = player.mini.buyables[91].plus(1)
                                player.mini.c_points.points = player.mini.c_points.points.sub(tmp.mini.buyables[91].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e1300")
                                let base = 1e8
                                let exp = 1.3
                                let pts = player.mini.c_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 73).gt(300)
                        },
                        base(){
                                if (inChallenge("n", 22)) return new Decimal(0)
                                let amt = player.mini.buyables[91]
                                let ret = amt.div(100).plus(1.2).ln()
                                
                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[91].base.times(player.mini.buyables[91])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                if (player.subtabs.mini.c_content != "Buyables") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[91]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[91].effect) + " to <bdi style='color:#CC0033'>C</bdi></b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 91)) + " C Points</b><br>"
                                let eformula = "ln(1.2+x/100)*x<br>" + format(getBuyableBase("mini", 91)) + "*x" 
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e1300)*(1e8^x<sup>1.3</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                92: {
                        title: "C Point gain 5",
                        cost:() => new Decimal("1e1900").times(Decimal.pow(1e50, Decimal.pow(getBuyableAmount("mini", 92), 1.3))),
                        canAfford:() => player.mini.c_points.points.gte(tmp.mini.buyables[92].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[92] = player.mini.buyables[92].plus(1)
                                player.mini.c_points.points = player.mini.c_points.points.sub(tmp.mini.buyables[92].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e1900")
                                let base = 1e50
                                let exp = 1.3
                                let pts = player.mini.c_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 83).gt(50)
                        },
                        base(){
                                if (inChallenge("n", 32)) return new Decimal(1)
                                let ret = player.points.max(10).log10()

                                if (hasMilestone("n", 14)) ret = ret.times(Math.log(10))

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[92].base.pow(player.mini.buyables[92])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                if (player.subtabs.mini.c_content != "Buyables") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[92]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[92].effect) + " to C Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 92)) + " C Points</b><br>"
                                let eformula = "(log10(Life Points))<sup>x</sup><br>" + format(getBuyableBase("mini", 92)) + "^x"
                                if (hasMilestone("n", 14)) eformula = eformula.replace("log10", "ln")
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e1900)*(1e50^x<sup>1.3</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                93: {
                        title: "C Point gain 6",
                        cost:() => new Decimal("1e6350").times(Decimal.pow(1e6, Decimal.pow(getBuyableAmount("mini", 93), 1.1))),
                        canAfford:() => player.mini.c_points.points.gte(tmp.mini.buyables[93].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[93] = player.mini.buyables[93].plus(1)
                                player.mini.c_points.points = player.mini.c_points.points.sub(tmp.mini.buyables[93].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e6350")
                                let base = 1e6
                                let exp = 1.1
                                let pts = player.mini.c_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 92).gt(30)
                        },
                        base(){
                                if (inChallenge("n", 21)) return new Decimal(1)
                                let init = player.mini.a_points.points.max(10).log10()
                                if (hasUpgrade("tokens", 94)) init = init.times(Math.log(10))
                                
                                let ret = init.log10().max(1)
                                if (hasUpgrade("tokens", 93)) ret = ret.times(Math.log(10))
                                if (hasUpgrade("mini", 44)) ret = ret.div(Math.log(2))

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[93].base.pow(player.mini.buyables[93])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                if (player.subtabs.mini.c_content != "Buyables") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[93]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[93].effect) + " to C Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 93)) + " C Points</b><br>"
                                let eformula = "(log10(log10(A Points)))<sup>x</sup><br>" + format(getBuyableBase("mini", 93)) + "^x"
                                if (hasUpgrade("tokens", 93)) eformula = eformula.replace("log10", "ln") //only replaces the first one
                                if (hasUpgrade("tokens", 94)) eformula = eformula.replace("log10", "ln")
                                if (hasUpgrade("mini", 44)) eformula = eformula.replace("ln", "log2")
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e6350)*(1e6^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                101: {
                        title: "Carbon gain 1",
                        cost:() => new Decimal("1e13000").times(Decimal.pow(100, Decimal.pow(getBuyableAmount("mini", 101), 1.4))),
                        canAfford:() => player.mini.c_points.points.gte(tmp.mini.buyables[101].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[101] = player.mini.buyables[101].plus(1)
                                player.mini.c_points.points = player.mini.c_points.points.sub(tmp.mini.buyables[101].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e13000")
                                let base = 100
                                let exp = 1.4
                                let pts = player.mini.c_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 92).gt(60)
                        },
                        base(){
                                let ret = getBuyableAmount("mini", 92).max(1)

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[101].base.pow(player.mini.buyables[101])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                if (player.subtabs.mini.c_content != "Buyables") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[101]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[101].effect) + " to Carbon gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 101)) + " C Points</b><br>"
                                let eformula = "(C Point gain 5 buyables)<sup>x</sup><br>" + format(getBuyableBase("mini", 101)) + "^x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e13000)*(100^x<sup>1.4</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                102: {
                        title: "C Point gain 7",
                        cost:() => new Decimal("1e19590").times(Decimal.pow(1e23, Decimal.pow(getBuyableAmount("mini", 102), 1.2))),
                        canAfford:() => player.mini.c_points.points.gte(tmp.mini.buyables[102].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[102] = player.mini.buyables[102].plus(1)
                                player.mini.c_points.points = player.mini.c_points.points.sub(tmp.mini.buyables[102].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e19590")
                                let base = 1e23
                                let exp = 1.2
                                let pts = player.mini.c_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 92).gt(90)
                        },
                        base(){
                                let ret = player.c.points.max(10).log10()

                                if (hasUpgrade("mini", 41)) ret = ret.times(Math.log(10)/Math.log(2))
                                if (hasChallenge("n", 22)) ret = ret.times(tmp.n.challenges[22].rewardEffect)

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[102].base.pow(player.mini.buyables[102])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                if (player.subtabs.mini.c_content != "Buyables") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[102]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[102].effect) + " to C Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 102)) + " C Points</b><br>"
                                let eformula = "(log10(Carbon))<sup>x</sup><br>" + format(getBuyableBase("mini", 102)) + "^x"
                                if (hasUpgrade("mini", 41)) eformula = eformula.replace("log10", "log2")
                                if (hasChallenge("n", 22)) eformula = eformula.replace("(","(log10(Nitrogen)*")
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e19590)*(1e23^x<sup>1.2</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                103: {
                        title: "C Point gain 8",
                        cost:() => new Decimal("1e27000").times(Decimal.pow(20, Decimal.pow(getBuyableAmount("mini", 103), 1.2))),
                        canAfford:() => player.mini.c_points.points.gte(tmp.mini.buyables[103].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[103] = player.mini.buyables[103].plus(1)
                                player.mini.c_points.points = player.mini.c_points.points.sub(tmp.mini.buyables[103].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e27000")
                                let base = 20
                                let exp = 1.2
                                let pts = player.mini.c_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 92).gt(118)
                        },
                        base(){
                                let ret = tmp.tokens.buyables[61].effect

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[103].base.pow(player.mini.buyables[103])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                if (player.subtabs.mini.c_content != "Buyables") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[103]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[103].effect) + " to C Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 103)) + " C Points</b><br>"
                                let eformula = "(Semi-exponential effect)<sup>x</sup><br>" + format(getBuyableBase("mini", 103)) + "^x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e27000)*(20^x<sup>1.2</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                111: {
                        title: "<bdi style='color:#CC0033'>C</bdi> increase 3",
                        cost:() => new Decimal("1e56700").times(Decimal.pow(1e11, Decimal.pow(getBuyableAmount("mini", 111), 1.2))),
                        canAfford:() => player.mini.c_points.points.gte(tmp.mini.buyables[111].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[111] = player.mini.buyables[111].plus(1)
                                player.mini.c_points.points = player.mini.c_points.points.sub(tmp.mini.buyables[111].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e56700")
                                let base = 1e11
                                let exp = 1.2
                                let pts = player.mini.c_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 102).gt(470)
                        },
                        base(){
                                let amt = player.mini.buyables[111]
                                let ret = amt.div(500).plus(1)

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[111].base.times(player.mini.buyables[111])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                if (player.subtabs.mini.c_content != "Buyables") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[111]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[111].effect) + " to <bdi style='color:#CC0033'>C</bdi></b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 111)) + " C Points</b><br>"
                                let eformula = "(1+x/500)*x<br>" + format(getBuyableBase("mini", 111),3) + "*x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e56700)*(1e11^x<sup>1.3</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                112: {
                        title: "C Point gain 9",
                        cost:() => new Decimal("1e72175").times(Decimal.pow(1e100, Decimal.pow(getBuyableAmount("mini", 112), 1.1))),
                        canAfford:() => player.mini.c_points.points.gte(tmp.mini.buyables[112].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[112] = player.mini.buyables[112].plus(1)
                                player.mini.c_points.points = player.mini.c_points.points.sub(tmp.mini.buyables[112].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e72175")
                                let base = 1e100
                                let exp = 1.1
                                let pts = player.mini.c_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 92).gt(260)
                        },
                        base(){
                                let ret = player.h.points.max(10).log10()

                                if (hasChallenge("n", 12)) ret = ret.times(Math.log(10))

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[112].base.pow(player.mini.buyables[112])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                if (player.subtabs.mini.c_content != "Buyables") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[112]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[112].effect) + " to C Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 112)) + " C Points</b><br>"
                                let eformula = "(log10(Hydrogen))<sup>x</sup><br>" + format(getBuyableBase("mini", 112)) + "^x"
                                if (hasChallenge("n", 12)) eformula = eformula.replace("log10", "ln")
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e72175)*(1e100^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                113: {
                        title: "C Point gain 10",
                        cost:() => new Decimal("1e80870").times(Decimal.pow(2, Decimal.pow(getBuyableAmount("mini", 113), 1.1).times(1024))),
                        canAfford:() => player.mini.c_points.points.gte(tmp.mini.buyables[113].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[113] = player.mini.buyables[113].plus(1)
                                player.mini.c_points.points = player.mini.c_points.points.sub(tmp.mini.buyables[113].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e80870")
                                let base = Decimal.pow(2, 1024)
                                let exp = 1.1
                                let pts = player.mini.c_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 92).gt(285)
                        },
                        base(){
                                let ret = player.mini.b_points.points.max(10).log10()

                                if (hasMilestone("n", 16)) ret = ret.times(player.mini.buyables[113].max(1))

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[113].base.pow(player.mini.buyables[113])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                if (player.subtabs.mini.c_content != "Buyables") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[113]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[113].effect) + " to C Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 113)) + " C Points</b><br>"
                                let eformula = "(log10(B Points))<sup>x</sup><br>" + format(getBuyableBase("mini", 113)) + "^x"
                                if (hasMilestone("n", 16)) eformula = eformula.replace("(l", "(x*l")
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e80870)*(1.80e308^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                121: {
                        title: "Linear Increase 1",
                        cost:() => new Decimal(150).times(Decimal.pow(1.2, Decimal.pow(getBuyableAmount("mini", 121), 1.1))),
                        canAfford:() => player.mini.d_points.points.gte(tmp.mini.buyables[121].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[121] = player.mini.buyables[121].plus(1)
                                if (hasUpgrade("mini", 55)) return 
                                player.mini.d_points.points = player.mini.d_points.points.sub(tmp.mini.buyables[121].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(150)
                                let base = 1.2
                                let exp = 1.1
                                let pts = player.mini.d_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return player.mini.d_points.best.gt(100)
                        },
                        base(){
                                let ret = new Decimal(1)

                                if (hasUpgrade("mini", 61)) {
                                        let base = player.mini.buyables[121].max(8).log(8)
                                        let upg = tmp.mini.d_points.getUpgrades
                                        let exp = new Decimal(upg).max(0).times(2)
                                        ret = ret.times(base.pow(exp))
                                }

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[121].base.times(player.mini.buyables[121])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "D") return ""
                                if (player.subtabs.mini.d_content != "Speed") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[121]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[121].effect) + " to Linear speed coefficient</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 121)) + " D Points</b><br>"
                                let eformula = format(getBuyableBase("mini", 121)) + "*x"
                                if (hasUpgrade("mini", 61)) {
                                        eformula = "log8(x)<sup>2*upgrades</sup>*x<br>" + eformula
                                }
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(150)*(1.2^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                122: {
                        title: "Fuel Increase 1",
                        cost:() => new Decimal(1e19).times(Decimal.pow(3, Decimal.pow(getBuyableAmount("mini", 122), 1.1))),
                        canAfford:() => player.mini.d_points.points.gte(tmp.mini.buyables[122].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[122] = player.mini.buyables[122].plus(1)
                                if (hasUpgrade("mini", 55)) return 
                                player.mini.d_points.points = player.mini.d_points.points.sub(tmp.mini.buyables[122].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(1e19)
                                let base = 3
                                let exp = 1.1
                                let pts = player.mini.d_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(7)
                        },
                        base(){
                                let ret = new Decimal(2)

                                ret = ret.plus(tmp.mini.buyables[131].effect)

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[122].base.pow(player.mini.buyables[122])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "D") return ""
                                if (player.subtabs.mini.d_content != "Speed") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[122]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[122].effect) + " to Maximum Fuel</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 122)) + " D Points</b><br>"
                                let eformula = format(getBuyableBase("mini", 122)) + "^x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e19)*(3^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                123: {
                        title: "Fuel Increase 2",
                        cost:() => new Decimal("1e383").times(Decimal.pow(5, Decimal.pow(getBuyableAmount("mini", 123), 1.2))),
                        canAfford:() => player.mini.d_points.points.gte(tmp.mini.buyables[123].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[123] = player.mini.buyables[123].plus(1)
                                if (hasUpgrade("mini", 55)) return 
                                player.mini.d_points.points = player.mini.d_points.points.sub(tmp.mini.buyables[123].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e383")
                                let base = 5
                                let exp = 1.2
                                let pts = player.mini.d_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(78)
                        },
                        base(){
                                let ret = player.points.max(10).log10().log10().max(1)

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[123].base.pow(player.mini.buyables[123])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "D") return ""
                                if (player.subtabs.mini.d_content != "Speed") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[123]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[123].effect) + " to Maximum Fuel</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 123)) + " D Points</b><br>"
                                let eformula = "log10(log10(Points))^x<br>" + format(getBuyableBase("mini", 123)) + "^x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e383)*(5^x<sup>1.2</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                131: {
                        title: "Quadratic Increase 1",
                        cost:() => new Decimal("1e1140").times(Decimal.pow(10, Decimal.pow(getBuyableAmount("mini", 131), 1.2))),
                        canAfford:() => player.mini.d_points.points.gte(tmp.mini.buyables[131].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[131] = player.mini.buyables[131].plus(1)
                                if (hasUpgrade("mini", 55)) return
                                player.mini.d_points.points = player.mini.d_points.points.sub(tmp.mini.buyables[131].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e1140")
                                let base = 10
                                let exp = 1.2
                                let pts = player.mini.d_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(183)
                        },
                        base(){
                                let ret = new Decimal(tmp.mini.d_points.getUpgrades)

                                if (hasUpgrade("mini", 62)) ret = ret.pow(3)

                                ret = ret.div(100)

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[131].base.times(player.mini.buyables[131])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "D") return ""
                                if (player.subtabs.mini.d_content != "Speed") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[131]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[131].effect) + " to Quadratic speed coeffecient and Fuel Increase 1 base</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 131)) + " D Points</b><br>"
                                let eformula = "[upgrades]/100*x<br>" + format(getBuyableBase("mini", 131)) + "*x"
                                if (hasUpgrade("mini", 62)) eformula = eformula.replace("]", "]^3")
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e1140)*(10^x<sup>1.2</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                132: {
                        title: "Exponential Increase 1",
                        cost:() => new Decimal("1e6415").times(Decimal.pow(1e38, Decimal.pow(getBuyableAmount("mini", 132), 1.4))),
                        canAfford:() => player.mini.d_points.points.gte(tmp.mini.buyables[132].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[132] = player.mini.buyables[132].plus(1)
                                if (hasUpgrade("mini", 55)) return
                                player.mini.d_points.points = player.mini.d_points.points.sub(tmp.mini.buyables[132].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e6415")
                                let base = 1e38
                                let exp = 1.4
                                let pts = player.mini.d_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(690)
                        },
                        base(){
                                let ret = new Decimal(.01)

                                if (hasChallenge("n", 42)) ret = ret.plus(.001)

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[132].base.times(player.mini.buyables[132])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "D") return ""
                                if (player.subtabs.mini.d_content != "Speed") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[132]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[132].effect, 4) + " to exponential speed base</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 132)) + " D Points</b><br>"
                                let eformula = format(getBuyableBase("mini", 132), 4) + "*x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e6415)*(1e38^x<sup>1.4</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                133: {
                        title: "Fuel Efficiency 1",
                        cost:() => new Decimal("1e32717").times(Decimal.pow(1e8, Decimal.pow(getBuyableAmount("mini", 133), 1.5))),
                        canAfford:() => player.mini.d_points.points.gte(tmp.mini.buyables[133].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[133] = player.mini.buyables[133].plus(1)
                                if (hasUpgrade("mini", 55)) return
                                player.mini.d_points.points = player.mini.d_points.points.sub(tmp.mini.buyables[133].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e32717")
                                let base = 1e8
                                let exp = 1.5
                                let pts = player.mini.d_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(2400)
                        },
                        base(){
                                let ret = new Decimal(.01)

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[133].base.times(player.mini.buyables[133])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "D") return ""
                                if (player.subtabs.mini.d_content != "Speed") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[133]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[133].effect, 4) + " to square rooting factor</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 133)) + " D Points</b><br>"
                                let eformula = format(getBuyableBase("mini", 133), 4) + "*x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e32717)*(1e8^x<sup>1.5</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                151: {
                        title: "Gas Pedal",
                        cost:() => new Decimal(5000).times(Decimal.pow(20, Decimal.pow(getBuyableAmount("mini", 151), 1.3))),
                        canAfford:() => player.mini.d_points.points.gte(tmp.mini.buyables[151].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[151] = player.mini.buyables[151].plus(1)
                                if (hasUpgrade("mini", 74)) return 
                                player.mini.d_points.points = player.mini.d_points.points.sub(tmp.mini.buyables[151].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(5000)
                                let base = 20
                                let exp = 1.3
                                let pts = player.mini.d_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 121).gte(12)
                        },
                        base(){
                                let ret = getBuyableAmount("mini", 121).max(1)

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[151].base.pow(player.mini.buyables[151])                                                                                                                     
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "D") return ""
                                if (player.subtabs.mini.d_content != "Multipliers") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[151]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[151].effect) + " to D Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 151)) + " D Points</b><br>"
                                let eformula = "(Linear Increase 1 buyables)<sup>x</sup><br>" + formatWhole(getBuyableBase("mini", 151)) + "^x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(5000)*(20^x<sup>1.3</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                152: {
                        title: "Engine",
                        cost:() => new Decimal(5e32).times(Decimal.pow(1000, Decimal.pow(getBuyableAmount("mini", 152), 1.2))),
                        canAfford:() => player.mini.d_points.points.gte(tmp.mini.buyables[152].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[152] = player.mini.buyables[152].plus(1)
                                if (hasUpgrade("mini", 74)) return 
                                player.mini.d_points.points = player.mini.d_points.points.sub(tmp.mini.buyables[152].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(5e32)
                                let base = 1000
                                let exp = 1.2
                                let pts = player.mini.d_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 121).gte(210)
                        },
                        base(){
                                let ret = player.n.points.max(10).log10()

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[152].base.pow(player.mini.buyables[152])                                                                                                                     
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "D") return ""
                                if (player.subtabs.mini.d_content != "Multipliers") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[152]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[152].effect) + " to D Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 152)) + " D Points</b><br>"
                                let eformula = "(log10(Nitrogen))<sup>x</sup><br>" + format(getBuyableBase("mini", 152)) + "^x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(5e32)*(1e3^x<sup>1.2</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                153: {
                        title: "Fuel Gauge",
                        cost:() => new Decimal(1e140).times(Decimal.pow(1e10, Decimal.pow(getBuyableAmount("mini", 153), 1.3))),
                        canAfford:() => player.mini.d_points.points.gte(tmp.mini.buyables[153].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[153] = player.mini.buyables[153].plus(1)
                                if (hasUpgrade("mini", 74)) return 
                                player.mini.d_points.points = player.mini.d_points.points.sub(tmp.mini.buyables[153].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(1e140)
                                let base = 1e10
                                let exp = 1.3
                                let pts = player.mini.d_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 121).gte(880)
                        },
                        base(){
                                let ret = player.mini.d_points.fuel.max(10).log10()

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[153].base.pow(player.mini.buyables[153])                                                                                                                     
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "D") return ""
                                if (player.subtabs.mini.d_content != "Multipliers") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[153]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[153].effect) + " to D Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 153)) + " D Points</b><br>"
                                let eformula = "(log10(Fuel))<sup>x</sup><br>" + format(getBuyableBase("mini", 153)) + "^x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e140)*(1e10^x<sup>1.3</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                161: {
                        title: "Accelerometer",
                        cost:() => new Decimal(1e213).times(Decimal.pow(1e20, Decimal.pow(getBuyableAmount("mini", 161), 1.2))),
                        canAfford:() => player.mini.d_points.points.gte(tmp.mini.buyables[161].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[161] = player.mini.buyables[161].plus(1)
                                if (hasUpgrade("mini", 74)) return 
                                player.mini.d_points.points = player.mini.d_points.points.sub(tmp.mini.buyables[161].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(1e213)
                                let base = 1e20
                                let exp = 1.2
                                let pts = player.mini.d_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 121).gte(1290)
                        },
                        base(){
                                let ret = player.mini.d_points.points.max(10).log10()

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[161].base.pow(player.mini.buyables[161])                                                                                                                     
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "D") return ""
                                if (player.subtabs.mini.d_content != "Multipliers") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[161]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[161].effect) + " to D Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 161)) + " D Points</b><br>"
                                let eformula = "(log10(D Points))<sup>x</sup><br>" + format(getBuyableBase("mini", 161)) + "^x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e213)*(1e20^x<sup>1.2</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                162: {
                        title: "Steering Wheel",
                        cost:() => new Decimal("1e654").times(Decimal.pow(100, Decimal.pow(getBuyableAmount("mini", 162), 1.2))),
                        canAfford:() => player.mini.d_points.points.gte(tmp.mini.buyables[162].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[162] = player.mini.buyables[162].plus(1)
                                if (hasUpgrade("mini", 74)) return 
                                player.mini.d_points.points = player.mini.d_points.points.sub(tmp.mini.buyables[162].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e654")
                                let base = 100
                                let exp = 1.2
                                let pts = player.mini.d_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(120)
                        },
                        base(){
                                let ret = new Decimal(tmp.mini.d_points.getUpgrades).max(1)

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[162].base.pow(player.mini.buyables[162])                                                                                                                     
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "D") return ""
                                if (player.subtabs.mini.d_content != "Multipliers") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[162]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[162].effect) + " to D Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 162)) + " D Points</b><br>"
                                let eformula = "(Upgrades)<sup>x</sup><br>" + formatWhole(getBuyableBase("mini", 162)) + "^x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e654)*(100^x<sup>1.2</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                163: {
                        title: "Air Conditioning",
                        cost:() => new Decimal("1e1344").times(Decimal.pow(1e24, Decimal.pow(getBuyableAmount("mini", 163), 1.1))),
                        canAfford:() => player.mini.d_points.points.gte(tmp.mini.buyables[163].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[163] = player.mini.buyables[163].plus(1)
                                if (hasUpgrade("mini", 74)) return 
                                player.mini.d_points.points = player.mini.d_points.points.sub(tmp.mini.buyables[163].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e1344")
                                let base = 1e24
                                let exp = 1.1
                                let pts = player.mini.d_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(207)
                        },
                        base(){
                                let ret = getBuyableAmount("mini", 131).max(1)

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[163].base.pow(player.mini.buyables[163])                                                                                                                     
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "D") return ""
                                if (player.subtabs.mini.d_content != "Multipliers") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[163]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[163].effect) + " to D Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 163)) + " D Points</b><br>"
                                let eformula = "(Quadratic Increase 1 levels)<sup>x</sup><br>" + format(getBuyableBase("mini", 163)) + "^x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e1344)*(1e24^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                171: {
                        title: "Brake Pedal",
                        cost:() => new Decimal("1e3020").times(Decimal.pow(1e30, Decimal.pow(getBuyableAmount("mini", 171), 1.1))),
                        canAfford:() => player.mini.d_points.points.gte(tmp.mini.buyables[171].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[171] = player.mini.buyables[171].plus(1)
                                if (hasUpgrade("mini", 74)) return 
                                player.mini.d_points.points = player.mini.d_points.points.sub(tmp.mini.buyables[171].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e3020")
                                let base = 1e30
                                let exp = 1.1
                                let pts = player.mini.d_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(380)
                        },
                        base(){
                                let ret = getBuyableAmount("mini", 151)

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[171].base.pow(player.mini.buyables[171])                                                                                                                     
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "D") return ""
                                if (player.subtabs.mini.d_content != "Multipliers") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[171]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[171].effect) + " to D Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 171)) + " D Points</b><br>"
                                let eformula = "(Gas Pedal levels)<sup>x</sup><br>" + format(getBuyableBase("mini", 171)) + "^x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e3020)*(1e30^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                172: {
                        title: "Seat Belt",
                        cost:() => new Decimal("1e4751").times(Decimal.pow(1e20, Decimal.pow(getBuyableAmount("mini", 172), 1.4))),
                        canAfford:() => player.mini.d_points.points.gte(tmp.mini.buyables[172].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[172] = player.mini.buyables[172].plus(1)
                                if (hasUpgrade("mini", 74)) return 
                                player.mini.d_points.points = player.mini.d_points.points.sub(tmp.mini.buyables[172].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e4751")
                                let base = 1e20
                                let exp = 1.4
                                let pts = player.mini.d_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(550)
                        },
                        base(){
                                let ret = tmp.n.challenges[32].rewardEffect

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[172].base.pow(player.mini.buyables[172])                                                                                                                     
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "D") return ""
                                if (player.subtabs.mini.d_content != "Multipliers") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[172]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[172].effect) + " to D Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 172)) + " D Points</b><br>"
                                let eformula = "<bdi style='color:#CC0033'>D</bdi><sup>x</sup><br>" + format(getBuyableBase("mini", 172)) + "^x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e4751)*(1e20^x<sup>1.4</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                173: {
                        title: "Gas Gauge",
                        cost:() => new Decimal("1e32284").times(Decimal.pow(1e30, Decimal.pow(getBuyableAmount("mini", 173), 1.1))),
                        canAfford:() => player.mini.d_points.points.gte(tmp.mini.buyables[173].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[173] = player.mini.buyables[173].plus(1)
                                if (hasUpgrade("mini", 74)) return 
                                player.mini.d_points.points = player.mini.d_points.points.sub(tmp.mini.buyables[173].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e32284")
                                let base = 1e30
                                let exp = 1.1
                                let pts = player.mini.d_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(2150)
                        },
                        base(){
                                let ret = tmp.mini.d_points.getEffectiveFuelAux

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[173].base.pow(player.mini.buyables[173])                                                                                                                     
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "D") return ""
                                if (player.subtabs.mini.d_content != "Multipliers") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[173]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[173].effect) + " to D Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 173)) + " D Points</b><br>"
                                let eformula = makeRed("y") + "<sup>x</sup><br>" + format(getBuyableBase("mini", 173)) + "^x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e32284)*(1e30^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                181: {
                        title: "Parking Brake",
                        cost:() => new Decimal("1e41025").times(Decimal.pow(1e35, Decimal.pow(getBuyableAmount("mini", 181), 1.3))),
                        canAfford:() => player.mini.d_points.points.gte(tmp.mini.buyables[181].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[181] = player.mini.buyables[181].plus(1)
                                if (hasUpgrade("mini", 74)) return 
                                player.mini.d_points.points = player.mini.d_points.points.sub(tmp.mini.buyables[181].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e41025")
                                let base = 1e35
                                let exp = 1.3
                                let pts = player.mini.d_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(2888)
                        },
                        base(){
                                let ret = player.mini.c_points.points.max(10).log10()

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[181].base.pow(player.mini.buyables[181])                                                                                                                     
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "D") return ""
                                if (player.subtabs.mini.d_content != "Multipliers") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[181]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[181].effect) + " to D Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 181)) + " D Points</b><br>"
                                let eformula = "log10(C Points)<sup>x</sup><br>" + format(getBuyableBase("mini", 181)) + "^x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e41025)*(1e35^x<sup>1.3</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                182: {
                        title: "Gas Tank",
                        cost:() => new Decimal("1e193300").times(Decimal.pow(1e19, Decimal.pow(getBuyableAmount("mini", 182), 1.1))),
                        canAfford:() => player.mini.d_points.points.gte(tmp.mini.buyables[182].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[182] = player.mini.buyables[182].plus(1)
                                if (hasUpgrade("mini", 74)) return 
                                player.mini.d_points.points = player.mini.d_points.points.sub(tmp.mini.buyables[182].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e193300")
                                let base = 1e19
                                let exp = 1.1
                                let pts = player.mini.d_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return hasUpgrade("c", 33)
                        },
                        base(){
                                let ret = player.mini.e_points.points.max(10).log10()

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[182].base.pow(player.mini.buyables[182])                                                                                                                     
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "D") return ""
                                if (player.subtabs.mini.d_content != "Multipliers") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[182]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[182].effect) + " to D Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 182)) + " D Points</b><br>"
                                let eformula = "log10(E Points)<sup>x</sup><br>" + format(getBuyableBase("mini", 182)) + "^x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e193300)*(1e19^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                }, 
                183: {
                        title: "Tire",
                        cost:() => new Decimal("3e14159").times(Decimal.pow(265358, Decimal.pow(getBuyableAmount("mini", 183), 2))),
                        canAfford:() => player.mini.d_points.points.gte(tmp.mini.buyables[183].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[183] = player.mini.buyables[183].plus(1)
                                if (hasUpgrade("mini", 74)) return 
                                player.mini.d_points.points = player.mini.d_points.points.sub(tmp.mini.buyables[183].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("3e14159")
                                let base = 265358
                                let exp = 2
                                let pts = player.mini.d_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return hasMilestone("p", 3)
                        },
                        base(){
                                let ret = player.p.points.max(1)

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[183].base.pow(player.mini.buyables[183])                                                                                                                     
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "D") return ""
                                if (player.subtabs.mini.d_content != "Multipliers") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[183]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[183].effect) + " to D Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 183)) + " D Points</b><br>"
                                let eformula = "Phosphorus<sup>x</sup><br>" + format(getBuyableBase("mini", 183)) + "^x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(3e14159)*(265358^x<sup>2</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                }, 
                201: {
                        title: "Iterations",
                        cost() {
                                let a = getBuyableAmount("mini", 201)
                                if (hasMilestone("mu", 4)) return Decimal.pow(10, a.pow(a))
                                if (hasUpgrade("mini", 85)) return Decimal.pow(10, a.plus(1).pow(a))
                                return Decimal.pow(10, a.plus(1).pow(a.plus(1)).sub(a))
                        },
                        canAfford:() => player.mini.e_points.points.gte(tmp.mini.buyables[201].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[201] = player.mini.buyables[201].plus(1)
                                if (false) return 
                                player.mini.e_points.points = player.mini.e_points.points.sub(tmp.mini.buyables[201].cost)
                        },
                        unlocked(){
                                return true
                        },
                        effect(){
                                return getBuyableAmount("mini", 201)
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "E") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[201]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = formatWhole(tmp.mini.buyables[201].effect) + " iterations</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 201)) + " E Points</b><br>"

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "10^((x+1)<sup>x+1</sup>-x)" 
                                if (hasUpgrade("mini", 85)) cost2 = "10^(x+1<sup>x</sup>)" 
                                if (hasMilestone("mu", 4)) cost2 = "10^(x<sup>x</sup>)"
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allCost
                                return "<br>" + end
                        },
                },
                202: {
                        title: "Constant",
                        cost:() => new Decimal("30").times(Decimal.pow(1.5, Decimal.pow(getBuyableAmount("mini", 202), 1.1))),
                        canAfford:() => player.mini.e_points.points.gte(tmp.mini.buyables[202].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[202] = player.mini.buyables[202].plus(1)
                                player.mini.e_points.points = player.mini.e_points.points.sub(tmp.mini.buyables[202].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("30")
                                let base = 1.5
                                let exp = 1.1
                                let pts = player.mini.e_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 201).gte(1)
                        },
                        base(){
                                let ret = new Decimal(1)

                                ret = ret.plus(tmp.mini.buyables[221].effect.times(player.mini.buyables[202]))


                                return ret
                        },
                        effect(){
                                let ret = tmp.mini.buyables[202].base.times(player.mini.buyables[202])   
                                if (hasUpgrade("c", 35)) ret = ret.times(player.mini.buyables[202].max(1).ln().max(1))
                                return ret                                                                                                                  
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "E") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[202]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[202].effect) + " to " + makeBlue("d") + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 202)) + " E Points</b><br>"
                                let eformula = format(getBuyableBase("mini", 202)) + "*x"
                                if (hasUpgrade("c", 35)) eformula = eformula.replace("*x", "*ln(x)*x")
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(30)*(1.5^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                203: {
                        title: "Linear",
                        cost:() => new Decimal("250").times(Decimal.pow(2, Decimal.pow(getBuyableAmount("mini", 203), 1.2))),
                        canAfford:() => player.mini.e_points.points.gte(tmp.mini.buyables[203].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[203] = player.mini.buyables[203].plus(1)
                                player.mini.e_points.points = player.mini.e_points.points.sub(tmp.mini.buyables[203].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("250")
                                let base = 2
                                let exp = 1.2
                                let pts = player.mini.e_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 202).gte(3)
                        },
                        base(){
                                let ret = new Decimal(1)

                                ret = ret.plus(tmp.mini.buyables[212].effect.times(getBuyableAmount("mini", 211)))

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[203].base.times(player.mini.buyables[203])                                                                                                                     
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "E") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[203]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[203].effect) + " to " + makeBlue("c") + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 203)) + " E Points</b><br>"
                                let eformula = format(getBuyableBase("mini", 203)) + "*x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(250)*(2^x<sup>1.2</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                211: {
                        title: "Quadratic",
                        cost:() => new Decimal("1e4").times(Decimal.pow(4, Decimal.pow(getBuyableAmount("mini", 211), 1.2))),
                        canAfford:() => player.mini.e_points.points.gte(tmp.mini.buyables[211].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[211] = player.mini.buyables[211].plus(1)
                                player.mini.e_points.points = player.mini.e_points.points.sub(tmp.mini.buyables[211].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e4")
                                let base = 4
                                let exp = 1.2
                                let pts = player.mini.e_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 202).gte(11)
                        },
                        baseInit(){
                                let ret = new Decimal(.2)

                                ret = ret.plus(tmp.mini.buyables[222].effect)

                                return ret
                        },
                        base(){
                                let ret = tmp.mini.buyables[211].baseInit

                                if (hasUpgrade("n", 43)) {
                                        let exp = new Decimal(1)
                                        if (hasUpgrade("c", 34)) exp = exp.times(2)
                                        ret = ret.times(player.mini.buyables[211].max(1).ln().max(1).pow(exp))
                                }

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[211].base.times(player.mini.buyables[211])                                                                                                                     
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "E") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[211]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[211].effect) + " to " + makeBlue("b") + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 211)) + " E Points</b><br>"
                                let eformula = format(tmp.mini.buyables[211].baseInit) + "*x<br>"
                                eformula += format(getBuyableBase("mini", 211)) + "*x" 
                                if (hasUpgrade("n", 43)) eformula = eformula.replace("*x", "*ln(x)*x")
                                if (hasUpgrade("c", 34)) eformula = eformula.replace(")", ")<sup>2</sup>")
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e4)*(4^x<sup>1.2</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                212: {
                        title: "a<bdi style='color:#B00E00'>f</bdi>(x) = <bdi style='color:#B00E00'>f</bdi>(ax)",
                        cost:() => new Decimal("1e8").times(Decimal.pow(7, Decimal.pow(getBuyableAmount("mini", 212), 1.2))),
                        canAfford:() => player.mini.e_points.points.gte(tmp.mini.buyables[212].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[212] = player.mini.buyables[212].plus(1)
                                player.mini.e_points.points = player.mini.e_points.points.sub(tmp.mini.buyables[212].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e8")
                                let base = 7
                                let exp = 1.2
                                let pts = player.mini.e_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 202).gte(25)
                        },
                        base(){
                                let ret = new Decimal(.3)

                                ret = ret.plus(tmp.mini.buyables[222].effect)

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[212].base.times(player.mini.buyables[212])                                                                                                                     
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "E") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[212]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[212].effect, 4) + " to Linear base per Quadratic</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 212)) + " E Points</b><br>"
                                let eformula = format(getBuyableBase("mini", 212), 4) + "*x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e8)*(7^x<sup>1.2</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                213: {
                        title: "<bdi style='color:#B00E00'>f</bdi>(x+y) = <bdi style='color:#B00E00'>f</bdi>(x)+<bdi style='color:#B00E00'>f</bdi>(y)",
                        cost:() => new Decimal("1e9").times(Decimal.pow(5, Decimal.pow(getBuyableAmount("mini", 213), 1.1))),
                        canAfford:() => player.mini.e_points.points.gte(tmp.mini.buyables[213].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[213] = player.mini.buyables[213].plus(1)
                                player.mini.e_points.points = player.mini.e_points.points.sub(tmp.mini.buyables[213].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e9")
                                let base = 5
                                let exp = 1.1
                                let pts = player.mini.e_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 202).gte(31)
                        },
                        base(){
                                let ret = getBuyableAmount("mini", 203).max(1).ln().max(1)

                                if (hasUpgrade("c", 32)) {
                                        a = tmp.c.upgrades[32].effect
                                        if (a < Math.E) ret = ret.div(Math.log(a))
                                }

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[213].base.pow(player.mini.buyables[213])                                                                                                                     
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "E") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[213]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[213].effect) + " to E Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 213)) + " E Points</b><br>"
                                let eformula = "ln(Linear levels)^x<br>" + format(getBuyableBase("mini", 213)) + "^x"
                                if (hasUpgrade("c", 32)) {
                                        let init = format(tmp.c.upgrades[32].effect,1)
                                        if (init == "2.0") init = "2"
                                        eformula = eformula.replace("ln", "log" + init)
                                }
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e9)*(5^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                221: {
                        title: "∃0 0+x=x+0=x",
                        cost:() => new Decimal("1e138").times(Decimal.pow(30, Decimal.pow(getBuyableAmount("mini", 221), 1.3))),
                        canAfford:() => player.mini.e_points.points.gte(tmp.mini.buyables[221].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[221] = player.mini.buyables[221].plus(1)
                                player.mini.e_points.points = player.mini.e_points.points.sub(tmp.mini.buyables[221].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e138")
                                let base = 30
                                let exp = 1.3
                                let pts = player.mini.e_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 212).gte(66)
                        },
                        base(){
                                let ret = new Decimal(.001)

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[221].base.times(player.mini.buyables[221])                                                                                                                     
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "E") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[221]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[221].effect, 4) + " to Constant base per Constant</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 221)) + " E Points</b><br>"
                                let eformula = format(getBuyableBase("mini", 221), 4) + "*x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e138)*(30^x<sup>1.3</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                222: {
                        title: "∃1 1*x=x*1=x",
                        cost:() => new Decimal("1e176").times(Decimal.pow(3, Decimal.pow(getBuyableAmount("mini", 222), 1.2))),
                        canAfford:() => player.mini.e_points.points.gte(tmp.mini.buyables[222].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[222] = player.mini.buyables[222].plus(1)
                                player.mini.e_points.points = player.mini.e_points.points.sub(tmp.mini.buyables[222].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e176")
                                let base = 3
                                let exp = 1.2
                                let pts = player.mini.e_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 212).gte(82)
                        },
                        base(){
                                let ret = new Decimal(.02)

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[222].base.times(player.mini.buyables[222])                                                                                                                     
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "E") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[222]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[222].effect, 4) + " to respecting scalar and Quadratic base</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 222)) + " E Points</b><br>"
                                let eformula = format(getBuyableBase("mini", 222), 4) + "*x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e176)*(3^x<sup>1.2</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                223: {
                        title: "a+b=b+a",
                        cost:() => new Decimal("1e1507").times(Decimal.pow(8, Decimal.pow(getBuyableAmount("mini", 223), 1.2))),
                        canAfford:() => player.mini.e_points.points.gte(tmp.mini.buyables[223].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[223] = player.mini.buyables[223].plus(1)
                                player.mini.e_points.points = player.mini.e_points.points.sub(tmp.mini.buyables[223].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e1507")
                                let base = 8
                                let exp = 1.2
                                let pts = player.mini.e_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 221).gte(191)
                        },
                        base(){
                                let init = player.mini.e_points.points.max(10).log10()
                                if (hasUpgrade("mini", 83)) init = init.times(Math.log(10))
                                if (hasUpgrade("p", 25)) init = init.div(Math.log(2))

                                let ret = init.max(10).log10()

                                if (hasUpgrade("o", 34)) ret = ret.times(Math.log(10))
                                if (hasUpgrade("p", 15)) ret = ret.div(Math.log(2))

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[223].base.pow(player.mini.buyables[223])                                                                                                                     
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "E") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[223]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[223].effect) + " to E Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 223)) + " E Points</b><br>"
                                let eformula = "log10(log10(E Points))^x<br>" + format(getBuyableBase("mini", 223)) + "^x"
                                if (hasUpgrade("o", 34)) eformula = eformula.replace("log10", "ln")
                                if (hasUpgrade("mini", 83)) eformula = eformula.replace("log10", "ln")
                                if (hasUpgrade("p", 15)) eformula = eformula.replace("ln", "log2")
                                if (hasUpgrade("p", 25)) eformula = eformula.replace("ln", "log2")
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e1507)*(8^x<sup>1.2</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                231: {
                        title: "(a+b)+c=a+(b+c)",
                        cost:() => new Decimal("1e9864").times(Decimal.pow(8, Decimal.pow(getBuyableAmount("mini", 231), 1.1))),
                        canAfford:() => player.mini.e_points.points.gte(tmp.mini.buyables[231].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[231] = player.mini.buyables[231].plus(1)
                                player.mini.e_points.points = player.mini.e_points.points.sub(tmp.mini.buyables[231].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e9864")
                                let base = 8
                                let exp = 1.1
                                let pts = player.mini.e_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 221).gte(865)
                        },
                        base(){
                                let ret = new Decimal(2.5)

                                ret = ret.plus(tmp.mini.buyables[232].effect)

                                return ret
                        },
                        levelExp(){
                                let ret = new Decimal(1)

                                if (hasUpgrade("c", 33)) ret = ret.times(2)

                                return ret
                        },
                        effect(){
                                let data = tmp.mini.buyables[231]
                                return data.base.times(player.mini.buyables[231].pow(data.levelExp)).plus(1)                                                                                                               
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "E") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[231]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[231].effect) + " to " + makeBlue("c") + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 231)) + " E Points</b><br>"
                                let eformula = format(getBuyableBase("mini", 231)) + "*x+1"
                                let lvle = tmp.mini.buyables[231].levelExp
                                if (lvle.neq(1)) eformula = eformula.replace("*x", "*x<sup>" + formatWhole(lvle) + "</sup>")
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e9864)*(8^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                232: {
                        title: "a*(b+c)=a*b+a*c",
                        cost:() => new Decimal("1e34464").times(Decimal.pow(6, Decimal.pow(getBuyableAmount("mini", 232), 1.3))),
                        canAfford:() => player.mini.e_points.points.gte(tmp.mini.buyables[232].cost),
                        buy(){
                                if (!this.canAfford()) return
                                player.mini.buyables[232] = player.mini.buyables[232].plus(1)
                                player.mini.e_points.points = player.mini.e_points.points.sub(tmp.mini.buyables[232].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e34464")
                                let base = 6
                                let exp = 1.3
                                let pts = player.mini.e_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 221).gte(2280)
                        },
                        base(){
                                let ret = new Decimal(.1)

                                if (hasMilestone("n", 18)) ret = ret.plus(.01)
                                if (hasUpgrade("p", 21)) ret = ret.plus(.01 * player.p.upgrades.length)

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[232].base.times(player.mini.buyables[232])                                                                                                            
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "E") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[232]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[232].effect) + " to " + makeRed("E") + " and addition is associative base</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 232)) + " E Points</b><br>"
                                let eformula = format(getBuyableBase("mini", 232)) + "*x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e34464)*(6^x<sup>1.3</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        }, 
                },
                233: {
                        title: "(a+b)*c=a*c+b*c",
                        cost:() => new Decimal("1e34833").times(Decimal.pow(100, Decimal.pow(getBuyableAmount("mini", 233), 1.3))),
                        canAfford:() => player.mini.e_points.points.gte(tmp.mini.buyables[233].cost),
                        buy(){
                                if (!this.canAfford()) return
                                player.mini.buyables[233] = player.mini.buyables[233].plus(1)
                                player.mini.e_points.points = player.mini.e_points.points.sub(tmp.mini.buyables[233].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e34833")
                                let base = 100
                                let exp = 1.3
                                let pts = player.mini.e_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return getBuyableAmount("mini", 221).gte(2300)
                        },
                        base(){
                                let ret = tmp.n.upgrades[35].effect.max(1)

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[233].base.pow(player.mini.buyables[233])                                                                                                            
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "E") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[233]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[233].effect) + " to E Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 233)) + " E Points</b><br>"
                                let eformula = makeRed("E") + "^x<br>" + format(getBuyableBase("mini", 233)) + "^x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e34833)*(100^x<sup>1.3</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        }, 
                },
                241: {
                        title: "(a*b)*c=a*(b*c)",
                        cost:() => new Decimal("1e122e4").times(Decimal.pow(1e5, Decimal.pow(getBuyableAmount("mini", 241), 1.1))),
                        canAfford:() => player.mini.e_points.points.gte(tmp.mini.buyables[241].cost),
                        buy(){
                                if (!this.canAfford()) return
                                player.mini.buyables[241] = player.mini.buyables[241].plus(1)
                                player.mini.e_points.points = player.mini.e_points.points.sub(tmp.mini.buyables[241].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e122e4")
                                let base = 1e5
                                let exp = 1.1
                                let pts = player.mini.e_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1)
                        },
                        unlocked(){
                                return hasMilestone("mu", 2)
                        },
                        base(){
                                let ret = player.p.points.max(10).log10()

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[241].base.pow(player.mini.buyables[241])                                                                                                            
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "E") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[241]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[241].effect) + " to E Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 241)) + " E Points</b><br>"
                                let eformula = "log10(Phosphorus)^x<br>" + format(getBuyableBase("mini", 241)) + "^x"
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e1,220,000)*(1e5^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        }, 
                },
        },
        clickables: {
                rows: 5,
                cols: 5,
                unlockedSlots(){
                        let a = 4
                        a += getBuyableAmount("mini", 71).toNumber()
                        if (false) a++ // or something
                        return a
                },
                11: {
                        title(){
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                return "<h3 style='color: #607216'>SLOT 1</h3>"
                        },
                        display(){
                                lr = player.mini.c_points.lastRoll
                                let val = 1
                                if (tmp.mini.clickables.unlockedSlots >= val) {
                                        if (lr.length >= val) {
                                                let start = "<h2 style='font-size: 500%'>"
                                                let end = "</h2>"
                                                return start + getUnicodeCharacter(lr[val-1]) + end
                                        }
                                        return "Have not rolled this slot yet"
                                }
                                return "Not unlocked yet"
                        },
                        unlocked(){
                                return tmp.mini.clickables.unlockedSlots >= 1
                        },
                        canClick(){
                                return false
                        },
                        onClick(){},
                },
                12: {
                        title(){
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                return "<h3 style='color: #607216'>SLOT 2</h3>"
                        },
                        display(){
                                lr = player.mini.c_points.lastRoll
                                let val = 2
                                if (tmp.mini.clickables.unlockedSlots >= val) {
                                        if (lr.length >= val) {
                                                let start = "<h2 style='font-size: 500%'>"
                                                let end = "</h2>"
                                                return start + getUnicodeCharacter(lr[val-1]) + end
                                        }
                                        return "Have not rolled this slot yet"
                                }
                                return "Not unlocked yet"
                        },
                        unlocked(){
                                return tmp.mini.clickables.unlockedSlots >= 1
                        },
                        canClick(){
                                return false
                        },
                        onClick(){},
                },
                13: {
                        title(){
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                return "<h3 style='color: #607216'>SLOT 3</h3>"
                        },
                        display(){
                                lr = player.mini.c_points.lastRoll
                                let val = 3
                                if (tmp.mini.clickables.unlockedSlots >= val) {
                                        if (lr.length >= val) {
                                                let start = "<h2 style='font-size: 500%'>"
                                                let end = "</h2>"
                                                return start + getUnicodeCharacter(lr[val-1]) + end
                                        }
                                        return "Have not rolled this slot yet"
                                }
                                return "Not unlocked yet"
                        },
                        unlocked(){
                                return tmp.mini.clickables.unlockedSlots >= 1
                        },
                        canClick(){
                                return false
                        },
                        onClick(){},
                },
                14: {
                        title(){
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                return "<h3 style='color: #607216'>SLOT 4</h3>"
                        },
                        display(){
                                lr = player.mini.c_points.lastRoll
                                let val = 4
                                if (tmp.mini.clickables.unlockedSlots >= val) {
                                        if (lr.length >= val) {
                                                let start = "<h2 style='font-size: 500%'>"
                                                let end = "</h2>"
                                                return start + getUnicodeCharacter(lr[val-1]) + end
                                        }
                                        return "Have not rolled this slot yet"
                                }
                                return "Not unlocked yet"
                        },
                        unlocked(){
                                return tmp.mini.clickables.unlockedSlots >= 1
                        },
                        canClick(){
                                return false
                        },
                        onClick(){},
                },
                15: {
                        title(){
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                return "<h3 style='color: #607216'>SLOT 5</h3>"
                        },
                        display(){
                                lr = player.mini.c_points.lastRoll
                                let val = 5
                                if (tmp.mini.clickables.unlockedSlots >= val) {
                                        if (lr.length >= val) {
                                                let start = "<h2 style='font-size: 500%'>"
                                                let end = "</h2>"
                                                return start + getUnicodeCharacter(lr[val-1]) + end
                                        }
                                        return "Have not rolled this slot yet"
                                }
                                return "Not unlocked yet"
                        },
                        unlocked(){
                                return tmp.mini.clickables.unlockedSlots >= 1
                        },
                        canClick(){
                                return false
                        },
                        onClick(){},
                },
                21: {
                        title(){
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                return "<h3 style='color: #607216'>SLOT 6</h3>"
                        },
                        display(){
                                lr = player.mini.c_points.lastRoll
                                let val = 6
                                if (tmp.mini.clickables.unlockedSlots >= val) {
                                        if (lr.length >= val) {
                                                let start = "<h2 style='font-size: 500%'>"
                                                let end = "</h2>"
                                                return start + getUnicodeCharacter(lr[val-1]) + end
                                        }
                                        return "Have not rolled this slot yet"
                                }
                                return "Not unlocked yet"
                        },
                        unlocked(){
                                return tmp.mini.clickables.unlockedSlots >= 5
                        },
                        canClick(){
                                return false
                        },
                        onClick(){},
                },
                22: {
                        title(){
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                return "<h3 style='color: #607216'>SLOT 7</h3>"
                        },
                        display(){
                                lr = player.mini.c_points.lastRoll
                                let val = 7
                                if (tmp.mini.clickables.unlockedSlots >= val) {
                                        if (lr.length >= val) {
                                                let start = "<h2 style='font-size: 500%'>"
                                                let end = "</h2>"
                                                return start + getUnicodeCharacter(lr[val-1]) + end
                                        }
                                        return "Have not rolled this slot yet"
                                }
                                return "Not unlocked yet"
                        },
                        unlocked(){
                                return tmp.mini.clickables.unlockedSlots >= 5
                        },
                        canClick(){
                                return false
                        },
                        onClick(){},
                },
                23: {
                        title(){
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                return "<h3 style='color: #607216'>SLOT 8</h3>"
                        },
                        display(){
                                lr = player.mini.c_points.lastRoll
                                let val = 8
                                if (tmp.mini.clickables.unlockedSlots >= val) {
                                        if (lr.length >= val) {
                                                let start = "<h2 style='font-size: 500%'>"
                                                let end = "</h2>"
                                                return start + getUnicodeCharacter(lr[val-1]) + end
                                        }
                                        return "Have not rolled this slot yet"
                                }
                                return "Not unlocked yet"
                        },
                        unlocked(){
                                return tmp.mini.clickables.unlockedSlots >= 5
                        },
                        canClick(){
                                return false
                        },
                        onClick(){},
                },
                24: {
                        title(){
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                return "<h3 style='color: #607216'>SLOT 9</h3>"
                        },
                        display(){
                                lr = player.mini.c_points.lastRoll
                                let val = 9
                                if (tmp.mini.clickables.unlockedSlots >= val) {
                                        if (lr.length >= val) {
                                                let start = "<h2 style='font-size: 500%'>"
                                                let end = "</h2>"
                                                return start + getUnicodeCharacter(lr[val-1]) + end
                                        }
                                        return "Have not rolled this slot yet"
                                }
                                return "Not unlocked yet"
                        },
                        unlocked(){
                                return tmp.mini.clickables.unlockedSlots >= 5
                        },
                        canClick(){
                                return false
                        },
                        onClick(){},
                },
                25: {
                        title(){
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                return "<h3 style='color: #607216'>SLOT 10</h3>"
                        },
                        display(){
                                lr = player.mini.c_points.lastRoll
                                let val = 10
                                if (tmp.mini.clickables.unlockedSlots >= val) {
                                        if (lr.length >= val) {
                                                let start = "<h2 style='font-size: 500%'>"
                                                let end = "</h2>"
                                                return start + getUnicodeCharacter(lr[val-1]) + end
                                        }
                                        return "Have not rolled this slot yet"
                                }
                                return "Not unlocked yet"
                        },
                        unlocked(){
                                return tmp.mini.clickables.unlockedSlots >= 5
                        },
                        canClick(){
                                return false
                        },
                        onClick(){},
                },
                31: {
                        title(){
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                return "<h3 style='color: #607216'>SLOT 11</h3>"
                        },
                        display(){
                                lr = player.mini.c_points.lastRoll
                                let val = 11
                                if (tmp.mini.clickables.unlockedSlots >= val) {
                                        if (lr.length >= val) {
                                                let start = "<h2 style='font-size: 500%'>"
                                                let end = "</h2>"
                                                return start + getUnicodeCharacter(lr[val-1]) + end
                                        }
                                        return "Have not rolled this slot yet"
                                }
                                return "Not unlocked yet"
                        },
                        unlocked(){
                                return tmp.mini.clickables.unlockedSlots >= 10
                        },
                        canClick(){
                                return false
                        },
                        onClick(){},
                },
                32: {
                        title(){
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                return "<h3 style='color: #607216'>SLOT 12</h3>"
                        },
                        display(){
                                lr = player.mini.c_points.lastRoll
                                let val = 12
                                if (tmp.mini.clickables.unlockedSlots >= val) {
                                        if (lr.length >= val) {
                                                let start = "<h2 style='font-size: 500%'>"
                                                let end = "</h2>"
                                                return start + getUnicodeCharacter(lr[val-1]) + end
                                        }
                                        return "Have not rolled this slot yet"
                                }
                                return "Not unlocked yet"
                        },
                        unlocked(){
                                return tmp.mini.clickables.unlockedSlots >= 10
                        },
                        canClick(){
                                return false
                        },
                        onClick(){},
                },
                33: {
                        title(){
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                return "<h3 style='color: #607216'>SLOT 13</h3>"
                        },
                        display(){
                                lr = player.mini.c_points.lastRoll
                                let val = 13
                                if (tmp.mini.clickables.unlockedSlots >= val) {
                                        if (lr.length >= val) {
                                                let start = "<h2 style='font-size: 500%'>"
                                                let end = "</h2>"
                                                return start + getUnicodeCharacter(lr[val-1]) + end
                                        }
                                        return "Have not rolled this slot yet"
                                }
                                return "Not unlocked yet"
                        },
                        unlocked(){
                                return tmp.mini.clickables.unlockedSlots >= 10
                        },
                        canClick(){
                                return false
                        },
                        onClick(){},
                },
                34: {
                        title(){
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                return "<h3 style='color: #607216'>SLOT 14</h3>"
                        },
                        display(){
                                lr = player.mini.c_points.lastRoll
                                let val = 14
                                if (tmp.mini.clickables.unlockedSlots >= val) {
                                        if (lr.length >= val) {
                                                let start = "<h2 style='font-size: 500%'>"
                                                let end = "</h2>"
                                                return start + getUnicodeCharacter(lr[val-1]) + end
                                        }
                                        return "Have not rolled this slot yet"
                                }
                                return "Not unlocked yet"
                        },
                        unlocked(){
                                return tmp.mini.clickables.unlockedSlots >= 10
                        },
                        canClick(){
                                return false
                        },
                        onClick(){},
                },
                35: {
                        title(){
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                return "<h3 style='color: #607216'>SLOT 15</h3>"
                        },
                        display(){
                                lr = player.mini.c_points.lastRoll
                                let val = 15
                                if (tmp.mini.clickables.unlockedSlots >= val) {
                                        if (lr.length >= val) {
                                                let start = "<h2 style='font-size: 500%'>"
                                                let end = "</h2>"
                                                return start + getUnicodeCharacter(lr[val-1]) + end
                                        }
                                        return "Have not rolled this slot yet"
                                }
                                return "Not unlocked yet"
                        },
                        unlocked(){
                                return tmp.mini.clickables.unlockedSlots >= 10
                        },
                        canClick(){
                                return false
                        },
                        onClick(){},
                },
                41: {
                        title(){
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                return "<h3 style='color: #607216'>GAMBLE!</h3>"
                        },
                        timeRequired(){
                                let ret = 5
                                if (hasUpgrade("mini", 34))     ret = 3
                                if (hasMilestone("tokens", 26)) ret = 1
                                if (hasUpgrade("tokens", 92))   ret = .25
                                if (hasUpgrade("mini", 42))     ret = .1
                                if (hasUpgrade("mini", 43))     ret = .05
                                return ret
                        },
                        display(){
                                let last = player.mini.c_points.lastRollTime
                                let now = player.time
                                let rem = (now - last)/1000
                                let req = tmp.mini.clickables[41].timeRequired
                                let a = "Time until next spin: " + formatTime(Math.max(0, req-rem)) + "<br>"
                                return a
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                let req = tmp.mini.clickables[41].timeRequired
                                return player.time - player.mini.c_points.lastRollTime >= 1000 * req
                        },
                        onClick(){
                                let data = player.mini.c_points
                                data.lastRollTime = player.time
                                data.lastRoll = getRandomSlotValue(tmp.mini.clickables.unlockedSlots)
                                //then give money and stuff
                                //getRewardAmount
                                let mult = tmp.mini.c_points.getGainMult
                                data.points = data.points.plus(getRewardAmount(data.lastRoll).times(mult))

                        },
                },      
                42: {
                        title(){
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                return "Toggle character display"
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                return true
                        },
                        onClick(){
                                let data = player.mini.c_points
                                data.displayCharacters = !data.displayCharacters
                        },
                },  
                51: {
                        title(){
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "D") return ""
                                return "Gain fuel"
                        },
                        display(){
                                return "Gain 5 + 2% fuel"
                        },
                        unlocked(){
                                return player.mini.d_points.best.lt("5ee5")
                        },
                        canClick(){
                                return true
                        },
                        onClick(){
                                let data = player.mini.d_points
                                let max = tmp.mini.d_points.getMaximumFuel
                                data.fuel = data.fuel.plus(5)
                                data.fuel = data.fuel.plus(max.times(.02))
                                data.fuel = data.fuel.min(max)
                        },
                },  
        },
        upgrades: {
                rows: 10,
                cols: 5,
                11: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Cabbage</bdi>"
                        },
                        description(){
                                return "Add one to all emoji bases per upgrade"
                        },
                        cost:() => new Decimal(1e25),
                        currencyLocation:() => player.mini.c_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "C Points",
                        unlocked(){
                                return getBuyableAmount("mini", 73).gt(5) || tmp.n.layerShown
                        }, // hasUpgrade("mini", 11)
                },
                12: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Corn</bdi>"
                        },
                        timeNeeded(){
                                let ret = 10

                                if (hasUpgrade("mini", 14))     ret = 9
                                if (hasUpgrade("mini", 15))     ret = 8
                                if (hasUpgrade("mini", 21))     ret = 7
                                if (hasUpgrade("mini", 22))     ret = 6
                                if (hasUpgrade("mini", 23))     ret = 5
                                if (hasMilestone("n", 3))       ret = 5
                                if (hasMilestone("tokens", 25)) ret = 3
                                if (hasMilestone("tokens", 26)) ret = 1
                                if (hasUpgrade("tokens", 92))   ret = .25
                                if (hasUpgrade("mini", 42))     ret = .1
                                if (player.dev.fastCorn)        ret = .1
                                if (hasUpgrade("mini", 43))     ret = .05

                                return ret
                        },
                        description(){
                                if (shiftDown) return "Warning! May cause lag if this tab is not active."
                                let timeNeed = tmp.mini.upgrades[12].timeNeeded
                                let a = "Automatically gamble if you have not gambled in the last "
                                a += formatWhole(timeNeed) + " seconds<br>"

                                let last = player.mini.c_points.lastRollTime
                                let now = player.time

                                let sec = (now-last)/1000

                                a += "The next trigger is in " + formatTime(Math.max(0,timeNeed-sec))

                                return a
                        },
                        cost:() => new Decimal(1e50),
                        currencyLocation:() => player.mini.c_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "C Points",
                        unlocked(){
                                return hasUpgrade("mini", 11) || tmp.n.layerShown
                        }, // hasUpgrade("mini", 12)
                },
                13: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Cake</bdi>"
                        },
                        timeNeeded(){
                                let ret = 10

                                return ret
                        },
                        description(){
                                let a = "log10(C Points) multiplies Ultraviolet base and log10(Ultraviolet) multiplies C Point gain"

                                return a
                        },
                        cost:() => new Decimal(1e68),
                        currencyLocation:() => player.mini.c_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "C Points",
                        unlocked(){
                                return hasUpgrade("mini", 12) || tmp.n.layerShown
                        }, // hasUpgrade("mini", 13)
                },
                14: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Carrot</bdi>"
                        },
                        description(){
                                let a = "log10(Life Points) multiplies C Point gain and reduce Corn interval to 9"

                                return a
                        },
                        cost:() => new Decimal(1e98),
                        currencyLocation:() => player.mini.c_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "C Points",
                        unlocked(){
                                return hasUpgrade("mini", 13) || tmp.n.layerShown
                        }, // hasUpgrade("mini", 14)
                },
                15: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Cheese</bdi>"
                        },
                        description(){
                                let a = "log10(B Points) multiplies C Point gain and reduce Corn interval to 8"

                                return a
                        },
                        cost:() => new Decimal(1e140),
                        currencyLocation:() => player.mini.c_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "C Points",
                        unlocked(){
                                return hasUpgrade("mini", 14) || tmp.n.layerShown
                        }, // hasUpgrade("mini", 15)
                },
                21: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Cream</bdi>"
                        },
                        description(){
                                let a = "Add .1 to <bdi style='color:#CC0033'>C</bdi> increase 1 base and reduce Corn interval to 7"

                                return a
                        },
                        cost:() => Decimal.pow(10, 555),
                        currencyLocation:() => player.mini.c_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "C Points",
                        unlocked(){
                                return getBuyableAmount("mini", 81).gte(43) || tmp.n.layerShown
                        }, // hasUpgrade("mini", 21)
                },
                22: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Coffee</bdi>"
                        },
                        description(){
                                let a = "Autobuy C buyables, log10(Hydrogen) multiplies C point gain, and reduce Corn interval to 6"

                                return a
                        },
                        cost:() => Decimal.pow(10, 777),
                        currencyLocation:() => player.mini.c_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "C Points",
                        unlocked(){
                                return hasUpgrade("mini", 21) || tmp.n.layerShown
                        }, // hasUpgrade("mini", 22)
                },
                23: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Crab</bdi>"
                        },
                        description(){
                                let a = "Change the log10 to ln in C Point gain 4 and reduce Corn interval to 5"

                                return a
                        },
                        cost:() => Decimal.pow(10, 900),
                        currencyLocation:() => player.mini.c_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "C Points",
                        unlocked(){
                                return hasUpgrade("mini", 22) || tmp.n.layerShown
                        }, // hasUpgrade("mini", 23)
                },
                24: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Chicken</bdi>"
                        },
                        description(){
                                let a = "Unlock a new symbol and add .05 to <bdi style='color:#CC0033'>C</bdi> increase 1 base"

                                return a
                        },
                        cost:() => Decimal.pow(10, 1111),
                        currencyLocation:() => player.mini.c_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "C Points",
                        unlocked(){
                                return hasUpgrade("mini", 23) || tmp.n.layerShown
                        }, // hasUpgrade("mini", 24)
                },
                25: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Cherry</bdi>"
                        },
                        description(){
                                let a = "Remove 🛑 and remove the +1 from Unlock a slot exponent base"

                                return a
                        },
                        cost:() => Decimal.pow(10, 1275),
                        currencyLocation:() => player.mini.c_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "C Points",
                        unlocked(){
                                return hasUpgrade("mini", 24) || tmp.n.layerShown
                        }, // hasUpgrade("mini", 25)
                },
                31: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Coconut</bdi>"
                        },
                        description(){
                                let a = "Square suits base, triple 💰 base, and you can buy and keep row 7 and 8 upgrades"

                                return a
                        },
                        cost:() => Decimal.pow(10, 1375),
                        currencyLocation:() => player.mini.c_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "C Points",
                        unlocked(){
                                return hasUpgrade("mini", 25) || tmp.n.layerShown
                        }, // hasUpgrade("mini", 31)
                },
                32: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Cod</bdi>"
                        },
                        description(){
                                let a = "C Points ^.01 multiplies C point gain, but square root the character effect on C point gain"

                                return a
                        },
                        cost:() => Decimal.pow(10, 1775),
                        currencyLocation:() => player.mini.c_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "C Points",
                        unlocked(){
                                return hasUpgrade("mini", 31) || tmp.n.layerShown
                        }, // hasUpgrade("mini", 32)
                },
                33: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Chocolate</bdi>"
                        },
                        description(){
                                let a = "Remove 📪 and reduce token buyable exponent to .6"

                                return a
                        },
                        cost:() => Decimal.pow(10, 1825),
                        currencyLocation:() => player.mini.c_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "C Points",
                        unlocked(){
                                return hasUpgrade("mini", 32) || tmp.n.layerShown
                        }, // hasUpgrade("mini", 33)
                },
                34: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Cupcake</bdi>"
                        },
                        description(){
                                let a = "Remove 🌲, apply Cod again, and you can gamble every 3 seconds"

                                return a
                        },
                        cost:() => Decimal.pow(10, 2750),
                        currencyLocation:() => player.mini.c_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "C Points",
                        unlocked(){
                                return hasUpgrade("mini", 33) || tmp.n.layerShown
                        }, // hasUpgrade("mini", 34)
                },
                35: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Crepe</bdi>"
                        },
                        description(){
                                let a = "Reduce the unlock a slot base to 50 and each upgrade multiplies C point gain by 50"

                                return a
                        },
                        cost:() => Decimal.pow(10, 11825),
                        currencyLocation:() => player.mini.c_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "C Points",
                        unlocked(){
                                return hasUpgrade("mini", 34) || tmp.n.layerShown
                        }, // hasUpgrade("mini", 35)
                },
                41: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Catfish</bdi>"
                        },
                        description(){
                                let a = "C Point gain 7's log10 becomes log2 and you can bulk C buyables 5x"

                                return a
                        },
                        cost:() => Decimal.pow(10, 50518),
                        currencyLocation:() => player.mini.c_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "C Points",
                        unlocked(){
                                return hasUpgrade("mini", 35) || tmp.n.layerShown
                        }, // hasUpgrade("mini", 41)
                },
                42: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Cranberry</bdi>"
                        },
                        description(){
                                let a = "Unlock a slot exponent is 6, you can gamble every .1 seconds, and C Points multiply B points"

                                return a
                        },
                        cost:() => Decimal.pow(10, 82650),
                        currencyLocation:() => player.mini.c_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "C Points",
                        unlocked(){
                                return player.tokens.total.gte(74) || tmp.n.layerShown
                        }, // hasUpgrade("mini", 42)
                },
                43: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Cookie</bdi>"
                        },
                        description(){
                                let a = "Each C Point gain 3 adds 1 to its base and you can gamble every tick (.05 seconds)"

                                return a
                        },
                        cost:() => Decimal.pow(10, 97590),
                        currencyLocation:() => player.mini.c_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "C Points",
                        unlocked(){
                                return player.tokens.total.gte(76) || tmp.n.layerShown
                        }, // hasUpgrade("mini", 43)
                },
                44: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Crumble</bdi>"
                        },
                        description(){
                                let a = "C Point gain 6 outer ln becomes log2 and you can bulk twice as much"

                                return a
                        },
                        cost:() => Decimal.pow(10, 128846),
                        currencyLocation:() => player.mini.c_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "C Points",
                        unlocked(){
                                return player.tokens.total.gte(77) || tmp.n.layerShown
                        }, // hasUpgrade("mini", 44)
                },
                45: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Clam</bdi>"
                        },
                        description(){
                                let a = "Unlock Nitrogen, a new layer, and C Points multiply A Points"

                                return a
                        },
                        cost:() => Decimal.pow(10, 168627),
                        currencyLocation:() => player.mini.c_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "C Points",
                        unlocked(){
                                return player.tokens.total.gte(78) || tmp.n.layerShown
                        }, // hasUpgrade("mini", 45)
                },
                51: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Repetitive clicking</bdi>"
                        },
                        description(){
                                let a = "Once per ten seconds gain fuel"
                                b = "<br>Next in: " + formatTime(Math.max(0, 10-player.mini.d_points.fuelTimer1))

                                return a + b
                        },
                        cost:() => Decimal.pow(10, 25),
                        currencyLocation:() => player.mini.d_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "D Points",
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(9) || player.p.best.gt(0)
                        }, // hasUpgrade("mini", 51)
                },
                52: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Arthritis cure</bdi>"
                        },
                        description(){
                                let a = "<bdi style='font-size: 100%'> Once per 11 seconds gain fuel, unlock an autobuyer for Speed buyables, and double D Point gain</bdi>"
                                b = "Next in: " + formatTime(Math.max(0, 11-player.mini.d_points.fuelTimer2))

                                if (shiftDown) return b

                                return a
                        },
                        cost:() => Decimal.pow(10, 125),
                        currencyLocation:() => player.mini.d_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "D Points",
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(33) || player.p.best.gt(0)
                        }, // hasUpgrade("mini", 52)
                },
                53: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Pre-frontal cortex</bdi>"
                        },
                        description(){
                                let a = "The autobuyer buys multiplier buyables and add .01 to quadratic base"

                                return a
                        },
                        cost:() => Decimal.pow(10, 350),
                        currencyLocation:() => player.mini.d_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "D Points",
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(73) || player.p.best.gt(0)
                        }, // hasUpgrade("mini", 53)
                },
                54: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Frontal cortex</bdi>"
                        },
                        description(){
                                let a = "Gain .2% of your max fuel per second and Nitrogen multiplies D Point gain"

                                return a
                        },
                        cost:() => Decimal.pow(10, 410),
                        currencyLocation:() => player.mini.d_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "D Points",
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(83) || player.p.best.gt(0)
                        }, // hasUpgrade("mini", 54)
                },
                55: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Ancle sprain</bdi>"
                        },
                        description(){
                                let a = "Each Gas Pedal adds 1 to <bdi style='color:#CC0033'>D</bdi> and Speed buyables no longer cost anything"

                                return a
                        },
                        cost:() => Decimal.pow(10, 969),
                        currencyLocation:() => player.mini.d_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "D Points",
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(162) || player.p.best.gt(0)
                        }, // hasUpgrade("mini", 55)
                },
                61: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Splint</bdi>"
                        },
                        description(){
                                let a = "You can buy all buyables at once and per upgrade multiply Linear Increase 1 base by log8(x)^2"

                                return a
                        },
                        cost:() => Decimal.pow(10, 1776),
                        currencyLocation:() => player.mini.d_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "D Points",
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(255) || player.p.best.gt(0)
                        }, // hasUpgrade("mini", 61)
                },
                62: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Cast</bdi>"
                        },
                        description(){
                                let a = "Cube upgrade component in Quadratic Increase 1 base"

                                return a
                        },
                        cost:() => Decimal.pow(10, 2275),
                        currencyLocation:() => player.mini.d_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "D Points",
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(310) || player.p.best.gt(0)
                        }, // hasUpgrade("mini", 62)
                },
                63: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Brace</bdi>"
                        },
                        description(){
                                let a = "You can bulk 1.3x buyables per upgrade (floored)"

                                return a
                        },
                        cost:() => Decimal.pow(10, 3151),
                        currencyLocation:() => player.mini.d_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "D Points",
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(400) || player.p.best.gt(0)
                        }, // hasUpgrade("mini", 63)
                },
                64: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Braces</bdi>"
                        },
                        description(){
                                let a = "D Point gain multiplies C point gain and fuel multiplies Carbon gain"

                                return a
                        },
                        cost:() => Decimal.pow(10, 4167),
                        currencyLocation:() => player.mini.d_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "D Points",
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(490) || player.p.best.gt(0)
                        }, // hasUpgrade("mini", 64)
                },
                65: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Cyborg</bdi>"
                        },
                        description(){
                                let a = "Each Quadratic increase 1 increases <bdi style='color:#CC0033'>D</bdi> by 1 and triple D point gain"

                                return a
                        },
                        cost:() => Decimal.pow(10, 5225),
                        currencyLocation:() => player.mini.d_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "D Points",
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(590) || player.p.best.gt(0)
                        }, // hasUpgrade("mini", 65)
                },
                71: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Breakfast</bdi>"
                        },
                        description(){
                                let a = "The square rooting factor is 11"

                                return a
                        },
                        cost:() => Decimal.pow(10, 6584),
                        currencyLocation:() => player.mini.d_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "D Points",
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(700) || player.p.best.gt(0)
                        }, // hasUpgrade("mini", 71)
                },
                72: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Brunch</bdi>"
                        },
                        description(){
                                let a = "The square rooting factor is 12 and unlock a challenge"

                                return a
                        },
                        cost:() => Decimal.pow(10, 8868),
                        currencyLocation:() => player.mini.d_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "D Points",
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(880) || player.p.best.gt(0)
                        }, // hasUpgrade("mini", 72)
                },
                73: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Lunch</bdi>"
                        },
                        description(){
                                let a = makeRed("y") + " multiplies Nitrogen gain and unlock a challenge"

                                return a
                        },
                        cost:() => Decimal.pow(10, 19428),
                        currencyLocation:() => player.mini.d_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "D Points",
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(1620) || player.p.best.gt(0)
                        }, // hasUpgrade("mini", 73)
                },
                74: {
                        title(){ // https://www.food.com/topic/c
                                if (shiftDown) return "<bdi style='color: #FF0000'>Cass129</bdi>"
                                return "<bdi style='color: #FF0000'>Supper</bdi>"
                        },
                        description(){
                                let a = "Bulk 10x and D buyables no longer cost anything"

                                return a
                        },
                        cost:() => Decimal.pow(10, 31051),
                        currencyLocation:() => player.mini.d_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "D Points",
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(2300) || player.p.best.gt(0)
                        }, // hasUpgrade("mini", 74)
                },
                75: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Dinner</bdi>"
                        },
                        description(){
                                let x = player.hardMode ? "100" : "1000"
                                let a = "If you have less than 10,000 seconds worth of Nitrogen Production you will gain " + x + "x"

                                return a
                        },
                        cost:() => Decimal.pow(10, 36561),
                        currencyLocation:() => player.mini.d_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "D Points",
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(2600) || player.p.best.gt(0)
                        }, // hasUpgrade("mini", 75)
                },
                81: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Multiplicative Identity</bdi>"
                        },
                        description(){
                                let a = "Each upgrade doubles Nitrogen gain"

                                return a
                        },
                        cost:() => Decimal.pow(10, 45477).times(5),
                        currencyLocation:() => player.mini.d_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "D Points",
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(3100) || player.p.best.gt(0)
                        }, // hasUpgrade("mini", 81)
                },
                82: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Even Prime</bdi>"
                        },
                        description(){
                                let a = "Square base Nitrogen gain" 

                                return a
                        },
                        cost:() => Decimal.pow(10, 56749),
                        currencyLocation:() => player.mini.d_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "D Points",
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(3670) || player.p.best.gt(0)
                        }, // hasUpgrade("mini", 82)
                },
                83: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Odd Prime</bdi>"
                        },
                        description(){
                                let a = "Make the inner log10 of commutativity of addition ln and E Points<sup>.1</sup> multiplies D Points" 

                                return a
                        },
                        cost:() => Decimal.pow(10, 691315),
                        currencyLocation:() => player.mini.d_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "D Points",
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(25e3) || player.p.best.gt(0)
                        }, // hasUpgrade("mini", 83)
                },
                84: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Even square</bdi>"
                        },
                        description(){
                                let a = "Each existence of 1 multiples E point gain by 1.02" 

                                return a
                        },
                        cost:() => Decimal.pow(10, 775628),
                        currencyLocation:() => player.mini.d_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "D Points",
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(27e3) || player.p.best.gt(0)
                        }, // hasUpgrade("mini", 84)
                },
                85: {
                        title(){ // https://www.food.com/topic/c
                                return "<bdi style='color: #FF0000'>Safe Prime</bdi>"
                        },
                        description(){
                                let a = "Reduce Iterations exponent to x+1<sup>x</sup> and bulk 5x all minigame buyables" 

                                return a
                        },
                        cost:() => Decimal.pow(10, 787029),
                        currencyLocation:() => player.mini.d_points,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "D Points",
                        unlocked(){
                                return getBuyableAmount("mini", 151).gte(28e3) || player.p.best.gt(0)
                        }, // hasUpgrade("mini", 85)
                },
        },
        bars: {
                fuel: {
                        direction: RIGHT,
                        width: 600,
                        height: 50,
                        progress(){
                                let f = player.mini.d_points.fuel
                                if (f.gt("1ee6")) return Math.sin(player.time/5000)**2
                                return f.div(tmp.mini.d_points.getMaximumFuel)
                        },
                        display(){
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "D") return ""
                                if (player.subtabs.mini.d_content != "Fuel") return ""
                                if (player.mini.d_points.fuel.lt("1ee6")) {
                                        let a = format(player.mini.d_points.fuel) + "/"
                                        let b = format(tmp.mini.d_points.getMaximumFuel) + " fuel"
                                        return a + b
                                }
                                return format(player.mini.d_points.fuel) + " fuel"
                        },
                        unlocked(){
                                return true
                        },
                        fillStyle(){
                                return {
                                        "background": "#66CCFF"
                                }
                        },
                        textStyle(){
                                return {
                                        "color": "#990033"
                                }
                        },
                }
        },
        microtabs: {
                d_content: {
                        "Fuel": { //has upgrades for getting fuel passively
                                content: [
                                        ["bar", "fuel"],
                                        ["display-text", function(){
                                                if (player.tab != "mini") return ""
                                                if (player.subtabs.mini.mainTabs != "D") return ""
                                                if (player.subtabs.mini.d_content != "Fuel") return ""
                                                let a = "Current speed formula: " 
                                                let data = tmp.mini.d_points
                                                let redx = makeRed("x")
                                                let redy = makeRed("y")

                                                let b1 = "(" + format(data.getLin) + redx + "+"
                                                let b2 = format(data.getQuad) + redx + "<sup>2</sup>)*"
                                                let b3 = format(data.getExp1, 4) + "<sup>cbrt()/100</sup>"
                                                let c = ""

                                                if (shiftDown) {
                                                        c += "<br>"
                                                        c += redx + "=" + format(data.getEffectiveFuel) + "  "
                                                        c += redy + "=" + format(data.getEffectiveFuelAux) + "<br>"
                                                        c += redx + " is fuel/10, but every time " + redx
                                                        c += " gets " + format(tmp.mini.d_points.getEffectiveFuelLogBase, 4)
                                                        c += " times larger, it is square rooted"
                                                        b3 = b3.replace("cbrt()/100", redy)
                                                        c += "<br>" + redy + " = cbrt(" + redx + ")/100, softcapped at 10,000: "
                                                        c += redy + "↦(6+log10(" + redy + "))<sup>4</sup>"
                                                }
                                                b3 = b3.replace("()","(" + redx + ")")

                                                return a + b1 + b2 + b3 + c
                                        }],
                                        ["clickables", [5]],
                                        ["display-text", function(){
                                                if (hasUpgrade("mini", 55)) return // eventually dont show this
                                                let a = "This tab has upgrades for passive fuel generation"
                                                return a
                                        }],
                                        ["upgrades", [5, 6, 7, 8]]
                                ],
                                unlocked(){
                                        return true
                                },
                                shouldNotify(){
                                        x = ["51", "52", "53", "54", "55", 
                                             "61", "62", "63", "64", "65",
                                             "71", "72", "73", "74", "75",
                                             "81", "82", "83", "84", "85"]
                                        for (let i = 0; i < x.length; i++){
                                                id = x[i]
                                                if (layers.mini.upgrades[id] == undefined) continue
                                                if (!tmp.mini.upgrades[id].unlocked) continue
                                                if (hasUpgrade("mini", id)) continue
                                                if (player.mini.d_points.points.lt(tmp.mini.upgrades[id].cost)) continue
                                                return true
                                        }
                                        return false
                                },
                        },
                        "Multipliers": {//buff point gain
                                content: [
                                        ["display-text", function(){
                                                if (player.tab != "mini") return ""
                                                if (player.subtabs.mini.mainTabs != "D") return ""
                                                if (player.subtabs.mini.d_content != "Multipliers") return ""
                                                if (hasUpgrade("mini", 55)) {
                                                        let data = tmp.mini.buyables
                                                        let a = data[151].cost
                                                        let num = 151
                                                        let ids = [152, 153, 161, 162, 
                                                                   163, 171, 172, 173, 181,
                                                                   182, 183, 191, 192, 193]
                                                        for (i = 0; i < ids.length; i++){
                                                                let id = ids[i]
                                                                if (layers.mini.buyables[id] == undefined) continue
                                                                if (!data[id].unlocked) continue
                                                                a = a.min(data[id].cost)
                                                                if (a.eq(data[id].cost)) num = id
                                                        }
                                                        let start = "The cheapest buyable (" + (num-140) + ") costs " + format(a) + "."
                                                        if (!shiftDown) return start
                                                        let mid = " You have " 
                                                        let pts = player.mini.d_points.points
                                                        let end = ""
                                                        if (pts.eq(0)) end = "0 points."
                                                        else if (pts.gt(a)) end = format(pts.div(a)) + " times more points."
                                                        else end = format(a.div(pts)) + " times less points."
                                                        return start+mid+end 
                                                }
                                                let a = "This tab has buyables for increasing point gain"
                                                return a
                                        }],
                                        ["buyables", [15,16,17,18,19]],
                                ],
                                unlocked(){
                                        return true
                                },
                                shouldNotify(){
                                        x = [151, 152, 153, 161, 162, 
                                             163, 171, 172, 173, 181,
                                             182, 183, 191, 192, 193]
                                        for (let i = 0; i < x.length; i++){
                                                id = x[i]
                                                if (layers.mini.buyables[id] == undefined) continue
                                                if (!tmp.mini.buyables[id].unlocked) continue
                                                if (tmp.mini.buyables[id].canAfford) {
                                                        if (getBuyableAmount("mini", id).eq(0)) return true
                                                }
                                        }
                                        return false
                                },
                        },
                        "Speed": { //has upgrades for buffing fuel->speed formula
                                content: [
                                        ["display-text", function(){
                                                if (hasUpgrade("mini", 55)) return // eventually dont show this
                                                let a = "This tab has buyables for increasing speed"
                                                return a
                                        }],
                                        ["buyables", [12, 13, 14]],
                                ],
                                unlocked(){
                                        return true
                                },
                                shouldNotify(){
                                        x = [121, 122, 123, 131, 132, 133, 141, 142, 143]
                                        for (let i = 0; i < x.length; i++){
                                                id = x[i]
                                                if (layers.mini.buyables[id] == undefined) continue
                                                if (!tmp.mini.buyables[id].unlocked) continue
                                                if (tmp.mini.buyables[id].canAfford) {
                                                        if (getBuyableAmount("mini", id).eq(0)) return true
                                                }
                                        }
                                        return false
                                },
                        },
                },
                c_content: {
                        "Upgrades": {
                                content: [
                                        ["upgrades", [1,2,3,4]],
                                        ["display-text", function(){
                                                if (player.tab != "mini") return ""
                                                if (player.subtabs.mini.mainTabs != "C") return ""
                                                if (player.subtabs.mini.c_content != "Upgrades") return ""
                                                if (!shiftDown) return ""
                                                let poss = getAllowedCharacterValues()
                                                let len = poss.length
                                                let ret = ""
                                                for (i = 0; i < len; i++){
                                                        let id = poss[i]
                                                        ret += getUnicodeCharacter(id, true)
                                                        ret += " gives " + format(getCharacterValue(id))
                                                        ret += " times the points.<br>"
                                                }
                                                return ret 
                                        }],
                                ],
                                unlocked(){
                                        return true
                                },
                                shouldNotify(){
                                        x = ["11", "12", "13", "14", "15", 
                                             "21", "22", "23", "24", "25", 
                                             "31", "32", "33", "34", "35", 
                                             "41", "42", "43", "44", "45"]
                                        for (let i = 0; i < x.length; i++){
                                                id = x[i]
                                                if (canAffordUpgrade("mini", id)) {
                                                        if (!hasUpgrade("mini", id)) return true
                                                }
                                        }
                                        return false
                                },
                        },
                        "Buyables": {
                                content: [ 
                                        ["display-text", function(){
                                                if (player.tab != "mini") return ""
                                                if (player.subtabs.mini.mainTabs != "C") return ""
                                                if (player.subtabs.mini.c_content != "Buyables") return ""
                                                let data = tmp.mini.buyables
                                                let a = data[71].cost
                                                let num = 71
                                                let ids = [ 72,  73,  81,  82,  83,
                                                            91,  92,  93, 101, 102,
                                                           103, 111, 112, 113, ]
                                                if (player.mini.buyables[71].eq(11)) {
                                                        num = 72
                                                        a = data[72].cost
                                                }
                                                for (i = 0; i < ids.length; i++){
                                                        let id = ids[i]
                                                        if (!data[id].unlocked) continue
                                                        a = a.min(data[id].cost)
                                                        if (a.eq(data[id].cost)) num = id
                                                }
                                                let start = "The cheapest buyable (" + (num-60) + ") costs " + format(a) + "."
                                                if (!shiftDown) return start
                                                let mid = " You have " 
                                                let pts = player.mini.c_points.points
                                                let end = ""
                                                if (pts.eq(0)) end = "0 points."
                                                else if (pts.gt(a)) end = format(pts.div(a)) + " times more points."
                                                else end = format(a.div(pts)) + " times less points."
                                                return start+mid+end
                                        }],
                                        ["buyables", [7,8,9,10,11]]
                                ],
                                unlocked(){
                                        return true
                                },
                                shouldNotify(){
                                        let x = [ 72,  73,  81,  82,  83,
                                                    91,  92,  93, 101, 102,
                                                   103, 111, 112, 113, ]
                                        for (let i = 0; i < x.length; i++){
                                                id = x[i]
                                                if (getBuyableAmount("mini", id).eq(0)) {
                                                        if (!tmp.mini.buyables[id].canAfford) continue
                                                        if (tmp.mini.buyables[id].unlocked) return true
                                                }
                                        }
                                        return false
                                },
                        },
                },
        },
        tabFormat: {
                "A": {
                        content: [
                                ["secondary-display", "a_points"],
                                ["display-text", function(){
                                        if (player.tab != "mini") return
                                        if (player.subtabs.mini.mainTabs != "A") return 
                                        if (hasUpgrade("h", 51)) return ""
                                        
                                        return "You need to be on this tab to keep this minigame ticking!"
                                }],
                                ["display-text", "Each color produces the next color clockwise!"],
                                ["display-text", function(){
                                        if (player.tab != "mini") return
                                        if (player.subtabs.mini.mainTabs != "A") return 

                                        if (!shiftDown) return ""
                                        let mid = hasUpgrade("h", 45) ? "log10(9+log10(10+B Points))*" : ""
                                        let end = "*2<sup>levels</sup>*" + mid + "multipliers"
                                        let exp = tmp.mini.a_points.getColorGainExp
                                        a = "Formula: amt<sup>" + format(exp, 4) + "</sup>/20" + end
                                        return a
                                }],
                                ["buyables", [1,2,6]],
                        ],
                        unlocked(){
                                return hasUpgrade("h", 44)
                        },
                },
                "B": {
                        content: [
                                ["secondary-display", "b_points"],
                                ["display-text", function(){
                                        if (player.tab != "mini") return
                                        if (player.subtabs.mini.mainTabs != "B") return 

                                        if (hasUpgrade("h", 51)) {
                                                return hasUpgrade("h", 52) ? "" : "Costs after 1000 are increased (x->x*log(x)/log(1000))"
                                        }
                                        return "You need to be on this tab to keep this minigame ticking!"
                                }],
                                ["display-text", function(){
                                        if (player.tab != "mini") return
                                        if (player.subtabs.mini.mainTabs != "B") return 

                                        a = "You are currently getting " + format(tmp.mini.b_points.getResetGain)
                                        b = " B Points per second"
                                        return a + b
                                }],
                                ["buyables", [3,4,5]],
                        ],
                        unlocked(){
                                return hasUpgrade("h", 45)
                        },
                },
                "C": {
                        content: [
                                ["secondary-display", "c_points"],
                                ["display-text", function(){
                                        if (player.tab != "mini") return
                                        if (player.subtabs.mini.mainTabs != "C") return 
                                        if (!shiftDown) return 

                                        let a = "Each character has a given value, and the more of said character you get,"
                                        a += "<br> the more powerful its value is."

                                        let b = "<br>Additionally, per set of suits squared, you gain 30x points.<br>"
                                        b += "Finally, point gain is the product of all above values time multipliers."
                                        b += "<br>Multipliers: x" + format(tmp.mini.c_points.getGainMult) + " C Point gain"

                                        return a + b
                                }],
                                ["clickables", [1,2,3,4]],
                                ["microtabs", "c_content"],
                        ],
                        unlocked(){
                                return hasMilestone("tokens", 23) 
                        },
                        shouldNotify(){
                                let y = ["11", "12", "13", "14", "15", 
                                        "21", "22", "23", "24", "25", 
                                        "31", "32", "33", "34", "35", 
                                        "41", "42", "43", "44", "45"]
                                for (let i = 0; i < y.length; i++){
                                        id = y[i]
                                        if (canAffordUpgrade("mini", id)) {
                                                if (!hasUpgrade("mini", id)) return true
                                        }
                                }
                                let x = [ 72, 73,  81,  82,  83,
                                          91,  92,  93, 101, 102,
                                          103, 111, 112, 113, ]
                                for (let i = 0; i < x.length; i++){
                                        id = x[i]
                                        if (getBuyableAmount("mini", id).eq(0)) {
                                                if (!tmp.mini.buyables[id].canAfford) continue
                                                if (tmp.mini.buyables[id].unlocked) return true
                                        }
                                }
                                return false
                        },
                },
                "D": {
                        content: [
                                ["secondary-display", "d_points"],
                                ["display-text", function(){
                                        if (player.tab != "mini") return
                                        if (player.subtabs.mini.mainTabs != "D") return 
                                        
                                        let a = "You can refuel the car by clicking. The car goes faster based on how much fuel it has."

                                        let b = "<br>Point gain is based on speed (which is based on fuel), but you lose 1% of your fuel every second."
                                        if (shiftDown) {
                                                b += "<br>Multipliers: x" + format(tmp.mini.d_points.getGainMult)
                                                b += "   Multiplier from fuel: x" + format(tmp.mini.d_points.getFuelMultiplier)
                                                b += "<br>Gain per second: " + format(tmp.mini.d_points.getPointProduction)
                                        }


                                        return a + b
                                }],
                                ["microtabs", "d_content"],
                        ],
                        unlocked(){
                                return hasChallenge("n", 32)
                        },
                        shouldNotify(){
                                let y = [121, 122, 123, 131, 132, 
                                         133, 141, 142, 143, 151, 
                                         152, 153, 161, 162, 163, 
                                         171, 172, 173, 181, 182, 
                                         183, 191, 192, 193]
                                for (let i = 0; i < y.length; i++){
                                        id = y[i]
                                        if (layers.mini.buyables[id] == undefined) continue
                                        if (!tmp.mini.buyables[id].unlocked) continue
                                        if (tmp.mini.buyables[id].canAfford) {
                                                if (getBuyableAmount("mini", id).eq(0)) return true
                                        }
                                }
                                
                                let x = ["51", "52", "53", "54", "55", 
                                        "61", "62", "63", "64", "65",
                                        "71", "72", "73", "74", "75",
                                        "81", "82", "83", "84", "85"]
                                for (let i = 0; i < x.length; i++){
                                        id = x[i]
                                        if (layers.mini.upgrades[id] == undefined) continue
                                        if (!tmp.mini.upgrades[id].unlocked) continue
                                        if (hasUpgrade("mini", id)) continue
                                        if (player.mini.d_points.points.lt(tmp.mini.upgrades[id].cost)) continue
                                        return true
                                }
                                return false
                        },
                },
                "E": {
                        content: [
                                ["secondary-display", "e_points"],
                                ["display-text", function(){
                                        if (player.tab != "mini") return
                                        if (player.subtabs.mini.mainTabs != "E") return 
                                        let data = tmp.mini.e_points

                                        let br = "<br>"
                                        let mb = makeBlue
                                        let a = "Current gain is " + format(data.getPointProduction) + "/s"
                                        let b = ""
                                        let c = "Gain formula is f<sup> " + formatWhole(data.getMaxInterations) 
                                        c += "</sup>(0) times multipliers"
                                        // getRecursionValue

                                        if (shiftDown) {
                                                b += "Function formula: f(x)=" + mb("a") + "x<sup>3</sup>/1e4+" + mb("b") + "x<sup>2</sup>+"
                                                b += mb("c") + "x+" + mb("d") + br
                                                b += mb("a") + "=" + format(data.getA) + " "
                                                b += mb("b") + "=" + format(data.getB) + " "
                                                b += mb("c") + "=" + format(data.getC) + " "
                                                b += mb("d") + "=" + format(data.getD) + " " 
                                                b += "f<sup> " + formatWhole(data.getMaxInterations) + "</sup>(0)="
                                                b += format(data.getRecursionValue) + br
                                                c += br
                                                c += "f<sup>1</sup>(x) = f(x) and f<sup> n+1</sup>(x) = f(f<sup> n</sup>(x))"
                                        }

                                        return a + br + b + c
                                }],
                                ["buyables", [20, 21, 22, 23, 24, 25]]
                        ],
                        unlocked(){
                                return hasUpgrade("n", 35)
                        },
                        shouldNotify(){
                                x = [201, 202, 203, 211, 212,
                                     213, 221, 222, 223, 231, 
                                     232, 233, 241,]
                                for (let i = 0; i < x.length; i++){
                                        id = x[i]
                                        if (layers.mini.buyables[id] == undefined) continue
                                        if (!tmp.mini.buyables[id].unlocked) continue
                                        if (tmp.mini.buyables[id].canAfford) {
                                                if (getBuyableAmount("mini", id).eq(0) || id == 201) return true
                                        }
                                }
                                return false
                        },
                },
                "Spelling": {
                        content: [
                                ["display-text", function(){
                                        let corr = numCorrectLetters(player.targetWord)
                                        let wordUpper = player.targetWord.toLocaleUpperCase()
                                        let start = "<bdi style='font-size: 300%'>"
                                        let end = "</bdi>"
                                        let goodPart = "<bdi style='color:#FF0000'>" + wordUpper.slice(0,corr) + "</bdi>"
                                        let badPart  = "<bdi style='color:#993333'>" + wordUpper.slice(corr) + "</bdi>"
                                        return start+goodPart+badPart+end
                                }],
                                ["display-text", function(){
                                        let a = "You have spelled " + formatWhole(player.wordsSpelled)
                                        let b = " words correctly!"
                                        let c = "<br><br><br><br><br><br>"
                                        let d = "<br>Press space to get a new word. This is just a minigame :)"
                                        return c + c + a + b + d
                                }],
                        ],
                        unlocked(){
                                return true
                        }
                },
        },
        doReset(layer){
                if (layer == "h") return 
                let data = player.mini

                //section 1: buyables
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33, 41, 42, 43, 51, 52, 53, 61, 62, 63]
                for (let j = 0; j < resetBuyables.length; j++) {
                        data.buyables[resetBuyables[j]] = new Decimal(0)
                }

                // section 2: A point stuff
                let apts = data.a_points
                apts.points = new Decimal(0)
                apts.best = new Decimal(0)
                apts.extras[11] = new Decimal(0)
                apts.extras[12] = new Decimal(0)
                apts.extras[13] = new Decimal(0)
                apts.extras[21] = new Decimal(0)
                apts.extras[23] = new Decimal(0)
                apts.extras[61] = new Decimal(0)
                apts.extras[62] = new Decimal(0)
                apts.extras[63] = new Decimal(0)

                // section 3: B point stuff
                let bpts = data.b_points
                bpts.points = new Decimal(0)
                bpts.best = new Decimal(0)
        },
})


addLayer("tokens", {
        name: "Tokens",
        symbol: "⥈", 
        position: 3,
        startData() { return {
                unlocked: false,
                abtime: 0,
                time: 0,
                best_over_all_time: new Decimal(0),
                autotime: 0,
                points: new Decimal(0),
                total: new Decimal(0),
                best_buyables: {
                        11: new Decimal(0),
                        12: new Decimal(0),
                        13: new Decimal(0),
                        21: new Decimal(0),
                        22: new Decimal(0),
                        23: new Decimal(0),
                        31: new Decimal(0),
                        32: new Decimal(0),
                        33: new Decimal(0),
                        41: new Decimal(0),
                        42: new Decimal(0),
                        43: new Decimal(0),
                        51: new Decimal(0),
                        52: new Decimal(0),
                        53: new Decimal(0),
                        61: new Decimal(0),
                        62: new Decimal(0),
                        63: new Decimal(0),
                },
                coins: {
                        points: new Decimal(0),
                        best: new Decimal(0)
                }
        }},
        color: "#7DC71C",
        branches: [],
        requires: new Decimal(0),
        resource: "Tokens",
        baseResource: "points",
        baseAmount() {return player.points.floor()},
        type: "custom",
        getResetGain() {
                if (tmp.tokens.getNextAt.lt(tmp.tokens.baseAmount)) return new Decimal(1)
                return new Decimal(0)
        },
        shouldNotify(){
                if (tmp.tokens.canReset && (!player.tokens.autobuytokens || !hasMilestone("n", 4))) return true
                let x = ["11", "12", "13", "21", "22", 
                         "23", "31", "32", "33", "41", 
                         "42", "43", "51", "52", "53", 
                         "61", "62", "63"]
                for (i in x){
                        id = x[i]
                        if (!tmp.tokens.buyables[id].canAfford) return false
                }
                return !player.tokens.autobuyradio || !hasMilestone("n", 7)
        },
        getNextAt(){
                let log_costs = TOKEN_COSTS
                
                let add = player.hardMode ? 4 : 0
                let len = log_costs.length

                let getid = player.tokens.total.toNumber()

                if (hasUpgrade("tokens", 73)) getid += -1
                if (hasMilestone("p", 1)) getid += -1
                if (hasUpgrade("p", 11)) getid += -1
                
                if (getid < 0) return Decimal.pow(10, 5000)

                getid = Math.floor(getid)

                if (getid >= len) return new Decimal("10pt10")
                return Decimal.pow(10, log_costs[getid]).times(Decimal.pow(10, add))
        },
        update(diff){
                let data = player.tokens
                let a = ["11", "12", "13", "21", "22", 
                         "23", "31", "32", "33", "41", 
                         "42", "43", "51", "52", "53", 
                         "61", "62", "63"]
                bb = data.best_buyables
                let maxever = new Decimal(0)
                for (i = 0; i < a.length; i++){
                        id = a[i]
                        bb[id] = bb[id].max(data.buyables[id])
                        maxever = maxever.max(bb[id])
                }
                if (hasMilestone("tokens", 13)) {
                        for (i = 0; i < a.length; i++){
                                id = a[i]
                                bb[id] = bb[id].max(maxever)
                        }
                }
                data.best_over_all_time = data.best_over_all_time.max(data.total)
                if (data.total.gt(0)) data.unlocked = true

                if (hasUpgrade("c", 21)) {
                        //tick coins
                        /*
                        dc/dt = N/1+c
                        dc(1+c) = Ndt
                        cc/2+c = Nt+A
                        A = cc/2+c
                        c = -1+sqrt(1+4/2*(Nt+A))
                        = -1+sqrt(1+2(Nt+A))
                        */
                        let datac = data.coins
                        let c = datac.points
                        let a = c.div(2).plus(1).times(c)
                        let nt = tmp.tokens.coins.getGainMult.times(diff)
                        datac.points = a.plus(nt).times(2).plus(1).sqrt().sub(1)
                        datac.best = datac.best.max(datac.points)
                }
        },
        resetsNothing(){
                return hasMilestone("n", 11)
        },
        coins: {
                getGainMult(){ //coin gain coins gain
                        let ret = new Decimal(1)

                        if (hasUpgrade("o", 22))        ret = ret.times(2)
                        if (hasMilestone("tokens", 14)) ret = ret.times(player.tokens.total.max(1))
                        if (hasMilestone("tokens", 16)) ret = ret.times(tmp.tokens.milestones[16].effect)
                        if (hasUpgrade("h", 71))        ret = ret.times(10)
                        if (hasUpgrade("tokens", 81))   ret = ret.times(81)
                        if (hasUpgrade("tokens", 93))   ret = ret.times(81)
                        if (hasMilestone("n", 8))       ret = ret.times(20)
                        if (hasMilestone("n", 2))       ret = ret.times(10)
                        if (player.hardMode)            ret = ret.div(3)

                        if (hasUpgrade("n", 11))        ret = ret.pow(1.001)

                        return ret
                },
        },
        row: "side",
        hotkeys: [{key: "shift+#", description: "Shift+3: Go to tokens", 
                        onPress(){
                                if (!tmp.tokens.layerShown) return
                                player.tab = "tokens"
                        }
                },
                {key: "t", description: "T: Reset for tokens", 
                        onPress(){
                                if (!tmp.tokens.layerShown) return
                                if (canReset("tokens")) doReset("tokens")
                        }
                },
                {key: "s", description: "S: Sell token buyables (only if on said tab)", 
                        onPress(){
                                if (player.tab == "tokens") {
                                        if (["Flat", "Scaling"].includes(player.subtabs.tokens.mainTabs)) {
                                                layers.tokens.buyables[71].buy()
                                        }
                                        if (["Coins"].includes(player.subtabs.tokens.mainTabs)) {
                                                layers.tokens.buyables[81].buy()
                                        }
                                }
                        }
                },
                ],
        layerShown(){return hasUpgrade("h", 65) || player.tokens.total.gt(0) || tmp.n.layerShown},
        prestigeButtonText(){
                if (player.tab != "tokens") return ""
                if (player.subtabs.tokens.mainTabs != "Milestones") return ""
                return "Reset for a token (" + formatWhole(player.tokens.total.plus(1)) + ")<br>Requires: " + format(tmp.tokens.getNextAt) + " Life Points"
        },
        canReset(){ // tokens canReset
                return tmp.tokens.getResetGain.gt(0) && hasUpgrade("h", 55) && (!inChallenge("n", 31) || player.tokens.total.lt(50))
        },
        doReset(layer){
                if (layer != "tokens") return
                /*
                Things to Reset 
                1. A point stuff
                2. B pt stuff
                3. C
                4. O
                5. H
                */

                // 1: A point stuff
                let data1 = player.mini
                if (!false) {
                        data1.a_points = {
                                points: new Decimal(0),
                                best: new Decimal(0),
                                extras: {
                                        11: new Decimal(1),
                                        12: new Decimal(0),
                                        13: new Decimal(0),
                                        21: new Decimal(0),
                                        23: new Decimal(0),
                                        61: new Decimal(0),
                                        62: new Decimal(0),
                                        63: new Decimal(0),
                                }
                        }
                        let list1 = ["11", "12", "13", "21", 
                                     "22", "23", "61", 
                                     "62", "63"]
                        for (i = 0; i < list1.length; i++){
                                data1.buyables[list1[i]] = new Decimal(0)
                        }
                }
                // 2: B point stuff
                if (!false) {
                        data1.b_points = {
                                points: new Decimal(0),
                                best: new Decimal(0),
                        }
                        let list2 = ["31", "32", 
                                     "33", "41", "42", "43", 
                                     "51", "52", "53"]
                        for (i = 0; i < list1.length; i++){
                                data1.buyables[list2[i]] = new Decimal(0)
                        }
                }

                

                // 3: C
                if (!false) {
                        if (!hasMilestone("tokens", 11) && !hasMilestone("n", 6)) {
                                player.c.upgrades = filterOut(player.c.upgrades, [11, 12, 13, 14, 15])
                        }
                        player.c.points = new Decimal(0)
                        player.c.best = new Decimal(0)
                }

                // 4: O
                if (!false) {
                        if (!hasMilestone("tokens", 11) && !hasMilestone("n", 5)) {
                                player.o.upgrades = filterOut(player.o.upgrades, [11, 12, 13, 14, 15])
                        }
                        player.o.points = new Decimal(0)
                        player.o.best = new Decimal(0)
                }

                // 5: H
                if (!false) {
                        let remove = [11, 12, 13, 14, 15, 
                                      31, 32, 33, 34, 35, 
                                      21, 22, 23, 24, 25, 
                                      41, 42, 43, 44, 45, 
                                      51, 52, 53, 54, 55, 
                                      61, 62, 63, 64, 65]

                        if (hasMilestone("tokens", 5)) {
                                remove = remove.slice(player.tokens.milestones.length * 3)
                        }

                        if (hasMilestone("tokens", 2)) remove = filterOut(remove, [51, 52])

                        if (!hasMilestone("n", 1)) player.h.upgrades = filterOut(player.h.upgrades, remove)
                        player.h.points = new Decimal(0)
                        player.h.best = new Decimal(0)
                        player.h.atomic_hydrogen.points = new Decimal(0)
                        player.h.atomic_hydrogen.best = new Decimal(0)
                        player.h.deuterium.points = new Decimal(0)
                        player.h.deuterium.best = new Decimal(0)
                }

        },
        buyables: {
                rows: 15,
                cols: 3,
                costFormulaID(id){
                        return layers.tokens.buyables.costFormula(getBuyableAmount("tokens", id))
                },
                costFormula(x){
                        if (hasUpgrade("n", 31))        return x.pow(.5).round()
                        if (hasUpgrade("n", 24))        return x.pow(.55).round()
                        if (hasUpgrade("mini", 33))     return x.pow(.6).round()
                        if (hasUpgrade("tokens", 82))   return x.pow(.65).round()
                        if (hasUpgrade("h", 75))        return x.pow(.7).round()
                        if (hasUpgrade("h", 85))        return x.pow(.7).ceil()
                        if (hasUpgrade("h", 84))        return x.pow(.8).ceil()
                        if (hasUpgrade("h", 83))        return x.pow(.9).ceil()
                        if (hasUpgrade("c", 23))        return x
                        return Decimal.pow(2, x)
                },
                costFormulaText(){
                        if (hasUpgrade("n", 31))        return "round(x<sup>.5</sup>)"
                        if (hasUpgrade("n", 24))        return "round(x<sup>.55</sup>)"
                        if (hasUpgrade("mini", 33))     return "round(x<sup>.6</sup>)"
                        if (hasUpgrade("tokens", 82))   return "round(x<sup>.65</sup>)"
                        if (hasUpgrade("h", 75))        return "round(x<sup>.7</sup>)"
                        if (hasUpgrade("h", 85))        return "ceil(x<sup>.7</sup>)"
                        if (hasUpgrade("h", 84))        return "ceil(x<sup>.8</sup>)"
                        if (hasUpgrade("h", 83))        return "ceil(x<sup>.9</sup>)"
                        if (hasUpgrade("c", 23))        return "x"
                        return "2<sup>x</sup>"
                },
                11: {
                        title: "<bdi style='color:#FF0000'>Radio Waves</bdi>",
                        cost:() => layers.tokens.buyables.costFormulaID(11),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[11].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[11] = player.tokens.buyables[11].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[11].cost)
                        },
                        base(){
                                let ret = new Decimal(1000)
                                if (hasMilestone("tokens", 7))  ret = ret.times(tmp.tokens.milestones[7].effect)
                                if (hasUpgrade("o", 24))        ret = ret.times(player.points.max(1).ln().max(1))
                                
                                if (hasMilestone("tokens", 1))  ret = ret.pow(tmp.tokens.milestones[1].effect)
                                if (hasUpgrade("o", 24))        ret = ret.pow(2)
                                
                                return ret
                        },
                        effect(){
                                if (hasMilestone("tokens", 4)) {
                                        return tmp.tokens.buyables[11].base.pow(player.tokens.best_buyables[11])
                                }
                                return tmp.tokens.buyables[11].base.pow(player.tokens.buyables[11])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Flat") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.tokens.buyables[11]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.tokens.buyables[11].effect) + " to Life Point</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("tokens", 11)) + " Tokens</b><br>"
                                let eformula = format(tmp.tokens.buyables[11].base, 3) + "^x" 
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = tmp.tokens.buyables.costFormulaText
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                12: {
                        title: "<bdi style='color:#FF0000'>Microwaves</bdi>",
                        cost:() => layers.tokens.buyables.costFormulaID(12),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[12].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[12] = player.tokens.buyables[12].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[12].cost)
                        },
                        base(){
                                let ret = new Decimal(100)
                                if (hasMilestone("tokens", 10))         ret = ret.times(tmp.tokens.milestones[10].effect)
                                if (hasUpgrade("h", 82)) {
                                        let exp = player.tokens.total.times(player.h.upgrades.length)
                                                                        ret = ret.times(Decimal.pow(1.01, exp))
                                }
                                if (hasMilestone("tokens", 2))          ret = ret.pow(tmp.tokens.milestones[2].effect)
                                return ret
                        },
                        effect(){
                                if (hasMilestone("tokens", 5)) {
                                        return tmp.tokens.buyables[12].base.pow(player.tokens.best_buyables[12])
                                }
                                return tmp.tokens.buyables[12].base.pow(player.tokens.buyables[12])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Flat") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.tokens.buyables[12]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.tokens.buyables[12].effect) + " to Hydrogen</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("tokens", 12)) + " Tokens</b><br>"
                                let eformula = format(tmp.tokens.buyables[12].base, 3) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = tmp.tokens.buyables.costFormulaText
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                13: { 
                        title: "<bdi style='color:#FF0000'>Infrared</bdi>",
                        cost:() => layers.tokens.buyables.costFormulaID(13),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[13].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[13] = player.tokens.buyables[13].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[13].cost)
                        },
                        base(){
                                let ret = new Decimal(20)
                                if (hasUpgrade("o", 23)) ret = ret.pow(player.tokens.total.pow(3))
                                return ret
                        },
                        effect(){
                                if (hasMilestone("tokens", 6)) {
                                        return tmp.tokens.buyables[13].base.pow(player.tokens.best_buyables[13])
                                }
                                return tmp.tokens.buyables[13].base.pow(player.tokens.buyables[13])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Flat") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.tokens.buyables[13]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.tokens.buyables[13].effect) + " to Atomic Hydrogen</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("tokens", 13)) + " Tokens</b><br>"
                                let eformula = format(tmp.tokens.buyables[13].base, 3) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = tmp.tokens.buyables.costFormulaText
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                21: { 
                        title: "<bdi style='color:#FF0000'>Visible</bdi>",
                        cost:() => layers.tokens.buyables.costFormulaID(21),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[21].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[21] = player.tokens.buyables[21].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[21].cost)
                        },
                        base(){
                                let ret = new Decimal(20)
                                if (hasUpgrade("o", 23)) ret = ret.pow(player.tokens.total.pow(3))
                                return ret
                        },
                        effect(){
                                if (hasMilestone("tokens", 7)) {
                                        return tmp.tokens.buyables[21].base.pow(player.tokens.best_buyables[21])
                                }
                                return tmp.tokens.buyables[21].base.pow(player.tokens.buyables[21])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Flat") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.tokens.buyables[21]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.tokens.buyables[21].effect) + " to Deuterium</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("tokens", 21)) + " Tokens</b><br>"
                                let eformula = format(tmp.tokens.buyables[21].base, 3) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = tmp.tokens.buyables.costFormulaText
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                22: {
                        title: "<bdi style='color:#FF0000'>Near-ultraviolet</bdi>",
                        cost:() => layers.tokens.buyables.costFormulaID(22),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[22].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[22] = player.tokens.buyables[22].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[22].cost)
                        },
                        base(){
                                let ret = new Decimal(10)

                                if (hasUpgrade("o", 23))        ret = ret.times(tmp.o.upgrades[23].effect)
                                if (hasMilestone("tokens", 15)) ret = ret.times(Decimal.pow(1.2, player.tokens.milestones.length))
                                if (hasUpgrade("h", 72))        ret = ret.times(tmp.h.upgrades[72].effect)
                                if (hasUpgrade("mini", 13))     ret = ret.times(player.mini.c_points.points.max(10).log10())
                                if (hasChallenge("n", 31))      ret = ret.times(player.n.points.max(1))

                                if (hasChallenge("n", 31))      ret = ret.pow(3)

                                return ret
                        },
                        effect(){
                                if (hasMilestone("tokens", 8)) {
                                        return tmp.tokens.buyables[22].base.pow(player.tokens.best_buyables[22])
                                }
                                return tmp.tokens.buyables[22].base.pow(player.tokens.buyables[22])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Flat") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.tokens.buyables[22]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.tokens.buyables[22].effect) + " to Carbon</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("tokens", 22)) + " Tokens</b><br>"
                                let eformula = format(tmp.tokens.buyables[22].base, 3) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = tmp.tokens.buyables.costFormulaText
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                23: {
                        title: "<bdi style='color:#FF0000'>Ultraviolet</bdi>",
                        cost:() => layers.tokens.buyables.costFormulaID(23),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[23].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[23] = player.tokens.buyables[23].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[23].cost)
                        },
                        base(){
                                let ret = new Decimal(10)
                                if (hasUpgrade("tokens", 32))   ret = ret.times(player.tokens.total.max(1))
                                if (hasUpgrade("c", 22))        ret = ret.times(tmp.c.upgrades[22].effect)
                                
                                if (hasMilestone("tokens", 11)) ret = ret.pow(2)
                                return ret
                        },
                        effect(){
                                if (hasMilestone("tokens", 9)) {
                                        return tmp.tokens.buyables[23].base.pow(player.tokens.best_buyables[23])
                                }
                                return tmp.tokens.buyables[23].base.pow(player.tokens.buyables[23])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Flat") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.tokens.buyables[23]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.tokens.buyables[23].effect) + " to Oxygen</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("tokens", 23)) + " Tokens</b><br>"
                                let eformula = format(tmp.tokens.buyables[23].base, 3) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = tmp.tokens.buyables.costFormulaText
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                31: {
                        title: "<bdi style='color:#FF0000'>X-Rays</bdi>",
                        cost:() => layers.tokens.buyables.costFormulaID(31),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[31].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[31] = player.tokens.buyables[31].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[31].cost)
                        },
                        base(){
                                let ret = new Decimal(1e8)

                                if (hasUpgrade("c", 21))        ret = ret.times(tmp.c.upgrades[21].effect)
                                if (hasUpgrade("o", 25))        ret = ret.times(tmp.o.upgrades[25].effect)

                                if (hasMilestone("tokens", 4))  ret = ret.pow(3)
                                if (hasUpgrade("tokens", 41))   ret = ret.pow(2)
                                if (hasUpgrade("o", 25))        ret = ret.pow(tmp.o.upgrades[25].effect)

                                return ret
                        },
                        effect(){
                                if (hasMilestone("tokens", 10)) {
                                        return tmp.tokens.buyables[31].base.pow(player.tokens.best_buyables[31])
                                }
                                return tmp.tokens.buyables[31].base.pow(player.tokens.buyables[31])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Flat") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.tokens.buyables[31]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.tokens.buyables[31].effect) + " to A Point</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("tokens", 31)) + " Tokens</b><br>"
                                let eformula = format(tmp.tokens.buyables[31].base, 3) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = tmp.tokens.buyables.costFormulaText
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                32: {
                        title: "<bdi style='color:#FF0000'>Gamma Rays</bdi>",
                        cost:() => layers.tokens.buyables.costFormulaID(32),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[32].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[32] = player.tokens.buyables[32].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[32].cost)
                        },
                        base(){
                                let ret = new Decimal(1e12)
                                if (hasUpgrade("o", 22))        ret = ret.times(player.points.plus(10).log10())
                                if (hasMilestone("tokens", 6))  ret = ret.pow(tmp.tokens.milestones[6].effect)
                                return ret
                        },
                        effect(){
                                if (hasMilestone("tokens", 11)) {
                                        return tmp.tokens.buyables[32].base.pow(player.tokens.best_buyables[32])
                                }
                                return tmp.tokens.buyables[32].base.pow(player.tokens.buyables[32])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Flat") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.tokens.buyables[32]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.tokens.buyables[32].effect) + " to B Point</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("tokens", 32)) + " Tokens</b><br>"
                                let eformula = format(tmp.tokens.buyables[32].base, 3) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = tmp.tokens.buyables.costFormulaText
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                33: { 
                        title: "<bdi style='color:#FF0000'>UHF Gamma Rays</bdi>",
                        cost:() => layers.tokens.buyables.costFormulaID(33),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[33].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[33] = player.tokens.buyables[33].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[33].cost)
                        },
                        base(){
                                let ret = new Decimal(10)
                                if (hasMilestone("tokens", 3)) {
                                        ret = ret.times(tmp.tokens.milestones[3].effect)
                                        ret = ret.pow(tmp.tokens.milestones[3].effect)
                                }
                                return ret
                        },
                        effect(){
                                if (hasMilestone("tokens", 12)) {
                                        return tmp.tokens.buyables[33].base.pow(player.tokens.best_buyables[33])
                                }
                                return tmp.tokens.buyables[33].base.pow(player.tokens.buyables[33])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Flat") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.tokens.buyables[33]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.tokens.buyables[33].effect) + " to Color Production</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("tokens", 33)) + " Tokens</b><br>"
                                let eformula = format(tmp.tokens.buyables[33].base, 3) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = tmp.tokens.buyables.costFormulaText
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                41: {
                        title: "<bdi style='color:#FFFF00'>Constant</bdi>",
                        cost:() => layers.tokens.buyables.costFormulaID(41),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[41].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[41] = player.tokens.buyables[41].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[41].cost)
                        },
                        base(){
                                let ret = new Decimal(1.02)
                                if (hasUpgrade("h", 73)) ret = ret.plus(.01)
                                return ret
                        },
                        effect(){
                                if (hasMilestone("tokens", 4)) {
                                        return tmp.tokens.buyables[41].base.pow(player.tokens.best_buyables[41])
                                }
                                return tmp.tokens.buyables[41].base.pow(player.tokens.buyables[41])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Scaling") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.tokens.buyables[41]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: ^"
                                let eff2 = format(tmp.tokens.buyables[41].effect) + " to Life Point</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("tokens", 41)) + " Tokens</b><br>"
                                let eformula = format(tmp.tokens.buyables[41].base, 3) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = tmp.tokens.buyables.costFormulaText
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                42: {
                        title: "<bdi style='color:#FFFF00'>Logarithmic</bdi>",
                        cost:() => layers.tokens.buyables.costFormulaID(42),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[42].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[42] = player.tokens.buyables[42].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[42].cost)
                        },
                        base(){
                                let ret = new Decimal(1.01)
                                if (hasUpgrade("tokens", 31)) ret = ret.plus(.01)
                                return ret
                        },
                        effect(){
                                if (hasMilestone("tokens", 5)) {
                                        return tmp.tokens.buyables[42].base.pow(player.tokens.best_buyables[42])
                                }
                                return tmp.tokens.buyables[42].base.pow(player.tokens.buyables[42])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Scaling") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.tokens.buyables[42]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: ^"
                                let eff2 = format(tmp.tokens.buyables[42].effect) + " to Hydrogen</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("tokens", 42)) + " Tokens</b><br>"
                                let eformula = format(tmp.tokens.buyables[42].base, 3) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = tmp.tokens.buyables.costFormulaText
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                43: {
                        title: "<bdi style='color:#FFFF00'>Linear</bdi>",
                        cost:() => layers.tokens.buyables.costFormulaID(43),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[43].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[43] = player.tokens.buyables[43].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[43].cost)
                        },
                        base(){
                                let ret = new Decimal(1.01)
                                if (hasUpgrade("tokens", 34)) ret = ret.plus(.01)
                                return ret
                        },
                        effect(){
                                if (hasMilestone("tokens", 6)) {
                                        return tmp.tokens.buyables[43].base.pow(player.tokens.best_buyables[43])
                                }
                                return tmp.tokens.buyables[43].base.pow(player.tokens.buyables[43])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Scaling") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.tokens.buyables[43]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: ^"
                                let eff2 = format(tmp.tokens.buyables[43].effect) + " to Atomic Hydrogen</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("tokens", 43)) + " Tokens</b><br>"
                                let eformula = format(tmp.tokens.buyables[43].base, 3) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = tmp.tokens.buyables.costFormulaText
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                51: {
                        title: "<bdi style='color:#FFFF00'>Quadratic</bdi>",
                        cost:() => layers.tokens.buyables.costFormulaID(51),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[51].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[51] = player.tokens.buyables[51].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[51].cost)
                        },
                        base(){
                                let ret = new Decimal(1.01)
                                if (hasUpgrade("tokens", 33)) ret = ret.plus(.01)
                                return ret
                        },
                        effect(){
                                if (hasMilestone("tokens", 7)) {
                                        return tmp.tokens.buyables[51].base.pow(player.tokens.best_buyables[51])
                                }
                                return tmp.tokens.buyables[51].base.pow(player.tokens.buyables[51])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Scaling") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.tokens.buyables[51]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: ^"
                                let eff2 = format(tmp.tokens.buyables[51].effect) + " to Deuterium</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("tokens", 51)) + " Tokens</b><br>"
                                let eformula = format(tmp.tokens.buyables[51].base, 3) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = tmp.tokens.buyables.costFormulaText
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                52: {
                        title: "<bdi style='color:#FFFF00'>Cubic</bdi>",
                        cost:() => layers.tokens.buyables.costFormulaID(52),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[52].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[52] = player.tokens.buyables[52].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[52].cost)
                        },
                        base(){
                                let ret = new Decimal(1.01)
                                if (hasMilestone("tokens", 18)) ret = ret.plus(.01)
                                if (hasMilestone("tokens", 20)) ret = ret.plus(.01)
                                if (hasUpgrade("n", 14))        ret = ret.plus(.001)
                                return ret
                        },
                        effect(){
                                if (hasMilestone("tokens", 8)) {
                                        return tmp.tokens.buyables[52].base.pow(player.tokens.best_buyables[52])
                                }
                                return tmp.tokens.buyables[52].base.pow(player.tokens.buyables[52])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Scaling") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.tokens.buyables[52]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: ^"
                                let eff2 = format(tmp.tokens.buyables[52].effect) + " to Carbon</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("tokens", 52)) + " Tokens</b><br>"
                                let eformula = format(tmp.tokens.buyables[52].base, 3) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = tmp.tokens.buyables.costFormulaText
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                53: {
                        title: "<bdi style='color:#FFFF00'>Polynomial</bdi>",
                        cost:() => layers.tokens.buyables.costFormulaID(53),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[53].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[53] = player.tokens.buyables[53].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[53].cost)
                        },
                        base(){
                                let ret = new Decimal(1.01)
                                if (hasUpgrade("c", 22))        ret = ret.plus(.01)
                                if (hasUpgrade("c", 25))        ret = ret.plus(.01)
                                if (hasUpgrade("n", 15))        ret = ret.plus(.001)
                                return ret
                        },
                        effect(){
                                if (hasMilestone("tokens", 9)) {
                                        return tmp.tokens.buyables[53].base.pow(player.tokens.best_buyables[53])
                                }
                                return tmp.tokens.buyables[53].base.pow(player.tokens.buyables[53])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Scaling") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.tokens.buyables[53]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: ^"
                                let eff2 = format(tmp.tokens.buyables[53].effect) + " to Oxygen</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("tokens", 53)) + " Tokens</b><br>"
                                let eformula = format(tmp.tokens.buyables[53].base, 3, 3) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = tmp.tokens.buyables.costFormulaText
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                61: {
                        title: "<bdi style='color:#FFFF00'>Semi-exponential</bdi>",
                        cost:() => layers.tokens.buyables.costFormulaID(61),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[61].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[61] = player.tokens.buyables[61].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[61].cost)
                        },
                        base(){
                                let ret = new Decimal(1.01)
                                if (hasMilestone("tokens", 5))  ret = ret.plus(.01)
                                if (hasMilestone("tokens", 21)) ret = ret.plus(.03)
                                if (hasChallenge("n", 11))      ret = ret.plus(tmp.n.challenges[11].rewardEffect)
                                return ret
                        },
                        effect(){
                                if (hasMilestone("tokens", 10)) {
                                        return tmp.tokens.buyables[61].base.pow(player.tokens.best_buyables[61])
                                }
                                return tmp.tokens.buyables[61].base.pow(player.tokens.buyables[61])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Scaling") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.tokens.buyables[61]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: ^"
                                let eff2 = format(tmp.tokens.buyables[61].effect) + " to A Point</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("tokens", 61)) + " Tokens</b><br>"
                                let eformula = format(tmp.tokens.buyables[61].base, 3) + "^x" 
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = tmp.tokens.buyables.costFormulaText
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                62: {
                        title: "<bdi style='color:#FFFF00'>Exponential</bdi>",
                        cost:() => layers.tokens.buyables.costFormulaID(62),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[62].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[62] = player.tokens.buyables[62].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[62].cost)
                        },
                        base(){
                                let ret = new Decimal(1.01)
                                if (hasMilestone("tokens", 5))  ret = ret.plus(.01)
                                if (hasMilestone("tokens", 22)) ret = ret.plus(.03)
                                if (hasUpgrade("n", 21))        ret = ret.plus(.001 * player.n.upgrades.length)
                                return ret
                        },
                        effect(){
                                if (hasMilestone("tokens", 11)) {
                                        return tmp.tokens.buyables[62].base.pow(player.tokens.best_buyables[62])
                                }
                                return tmp.tokens.buyables[62].base.pow(player.tokens.buyables[62])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Scaling") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.tokens.buyables[62]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: ^"
                                let eff2 = format(tmp.tokens.buyables[62].effect) + " to B Point</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("tokens", 62)) + " Tokens</b><br>"
                                let eformula = format(tmp.tokens.buyables[62].base, 3) + "^x"
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = tmp.tokens.buyables.costFormulaText
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                63: {
                        title: "<bdi style='color:#FFFF00'>Double-exponential</bdi>",
                        cost:() => layers.tokens.buyables.costFormulaID(63),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[63].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[63] = player.tokens.buyables[63].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[63].cost)
                        },
                        effect(){
                                let div = 20
                                if (hasUpgrade("c", 24)) div /= 2
                                if (hasUpgrade("c", 25)) div /= 2
                                if (hasUpgrade("n", 25)) div /= 5
                                if (hasMilestone("tokens", 12)) {
                                        return player.tokens.best_buyables[63].div(div).plus(1).pow(-1).sub(1).times(-.2)
                                }
                                return player.tokens.buyables[63].div(div).plus(1).pow(-1).sub(1).times(-.2)
                                //tmp.tokens.buyables[63].base.pow(player.tokens.buyables[63])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Scaling") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.tokens.buyables[63]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.tokens.buyables[63].effect, 4) + " to Color Production Exponent</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("tokens", 63)) + " Tokens</b><br>"
                                let eformula = ".2-.2/(1+x/20)"
                                if (hasUpgrade("c", 24)) eformula = eformula.replace("20", "10")
                                if (hasUpgrade("c", 25)) eformula = eformula.replace("10", "5")
                                if (hasUpgrade("n", 25)) eformula = eformula.replace("x/5", "x")
                                
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = tmp.tokens.buyables.costFormulaText
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3

                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                71: {
                        title: "<bdi style='color:#FFFFFF'>Sell-all</bdi>",
                        canAfford:() => true,
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.points = player.tokens.total
                                x = ["11", "12", "13", "21", "22", 
                                     "23", "31", "32", "33", "41", 
                                     "42", "43", "51", "52", "53", 
                                     "61", "62", "63"]
                                for (i in x){
                                        id = x[i]
                                        player.tokens.buyables[id] = new Decimal(0)
                                }
                        },
                        style(){
                                return {
                                        height: "100px",
                                        width: "100px",
                                }
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "tokens") return ""
                                if (!["Scaling", "Flat"].includes(player.subtabs.tokens.mainTabs)) return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                return "Sell all buyables<br>(Both pages)"
                        },
                },
                81: {
                        title: "<bdi style='color:#FFFFFF'>Sell-all</bdi>",
                        canAfford:() => true,
                        buy(){
                                if (!this.canAfford()) return 
                                let keep = [91, 92, 93, 94, 95]
                                if (hasMilestone("tokens", 18))         keep = keep.concat([42, 61, 62])
                                if (hasUpgrade("mini", 31))             keep = keep.concat([71, 72, 73, 81, 82])
                                if (hasMilestone("tokens", 20))         keep = keep.concat([11, 21, 22, 31, 32, 33, 34, 41, 51, 52])
                                player.tokens.upgrades = filter(player.tokens.upgrades, keep)
                        },
                        style(){
                                return {
                                        height: "100px",
                                        width: "100px",
                                }
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "tokens") return ""
                                if (!["Coins"].includes(player.subtabs.tokens.mainTabs)) return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                return "Sell all coin upgrades<br>(Does not give coins back)"
                        },
                },
        },
        milestones: {
                1: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[1].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(2)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[1].requirement)
                        },
                        unlocked(){
                                return true
                        },
                        effect(){
                                return player.tokens.total.max(1)
                        },
                        effectDescription(){
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Milestones") return ""

                                let a = "Reward: Raise Radio Wave effect to the total number of tokens.<br>"
                                let b = "Currently: " + format(tmp.tokens.milestones[1].effect)
                                if (shiftDown) {
                                        let formula = "Formula: [total tokens]"
                                        return a + formula
                                }
                                return a + b
                        },
                }, // hasMilestone("tokens", 1)
                2: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[2].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(3)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[2].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 1)
                        },
                        effect(){
                                return player.tokens.total.max(1)
                        },
                        effectDescription(){
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Milestones") return ""
                                
                                let a = "Reward: Raise Microwaves effect to the total number of tokens and keep Hydrogen XI and XII.<br>"
                                let b = "Currently: " + format(tmp.tokens.milestones[2].effect)
                                if (shiftDown) {
                                        let formula = "Formula: [total tokens]"
                                        return a + formula
                                }
                                return a + b
                        },
                }, //hasMilestone("tokens", 2)
                3: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[3].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(4)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[3].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2)
                        },
                        effect(){
                                return player.tokens.total.max(1)
                        },
                        effectDescription(){
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Milestones") return ""
                                
                                let a = "Reward: Multiply and then raise UHF Gamma Rays effect to the total number of tokens and the autobuyer bulks 10x. Multiply Oxygen and Carbon gain by the number of achievements.<br>"                     
                                let b = "Currently: " + format(tmp.tokens.milestones[3].effect)
                                if (shiftDown) {
                                        let formula = "Formula: [total tokens]"
                                        return a + formula
                                }
                                return a + b
                        },
                }, //hasMilestone("tokens", 3)
                4: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[4].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(5)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[4].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 3)
                        },
                        effectDescription(){
                                let a = "Reward: Radio Waves and Constant are based on best amount, cube X-Ray effect, and add .05 to A Point gain exponent<br>"
                                return a 
                        },
                }, // hasMilestone("tokens", 4)
                5: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[5].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(6)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[5].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 4)
                        },
                        effectDescription(){
                                let a = "Reward: Microwaves and Logarithimic are based on best amount, add .01 to Exponential and Semi-exponential, and each milestone keeps three Hydrogen upgrades<br>"
                                return a 
                        },
                },  // hasMilestone("tokens", 5)
                6: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[6].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(7)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[6].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 5)
                        },
                        effect(){
                                return player.tokens.total.max(1)
                        },
                        effectDescription(){
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Milestones") return ""
                                
                                let a = "Reward: Infrared and Linear are based on best amount, and raise Gamma Ray effect to the number of tokens.<br>"                     
                                let b = "Currently: ^" + format(tmp.tokens.milestones[6].effect)
                                if (shiftDown) {
                                        let formula = "Formula: [total tokens]"
                                        return a + formula
                                }
                                return a + b
                        },
                },  // hasMilestone("tokens", 6)
                7: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[7].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(8)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[7].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 6)
                        },
                        effect(){
                                return player.mini.a_points.points.plus(1).ln().max(1)
                        },
                        effectDescription(){
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Milestones") return ""
                                
                                let a = "Reward: Visible and Quadratic are based on best amount, and ln(A Points) multiplies Radio Waves' base.<br>"                     
                                let b = "Currently: *" + format(tmp.tokens.milestones[7].effect)
                                if (shiftDown) {
                                        let formula = "Formula: max(1,ln(A Points+1))"
                                        return a + formula
                                }
                                return a + b
                        },
                },  // hasMilestone("tokens", 7)
                8: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[8].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(9)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[8].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 7)
                        },
                        effectDescription(){
                                let a = "Reward: Near-ultraviolet and Cubic are based on best amount, and [A Points]^.1 multipies B Point gain.<br>"
                                return a 
                        },
                },  // hasMilestone("tokens", 8)
                9: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[9].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(10)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[9].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 8)
                        },
                        effectDescription(){
                                let a = "Reward: Ultraviolet and Polynomial are based on best amount, and [B Points]^.1 multipies A Point gain.<br>"
                                return a 
                        },
                },  // hasMilestone("tokens", 9)
                10: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[10].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(11)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[10].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 9)
                        },
                        effect(){
                                return player.mini.b_points.points.plus(1).ln().max(1)
                        },
                        effectDescription(){
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Milestones") return ""
                                
                                let a = "Reward: X-Rays and Semi-exponential are based on best amount, square Oxygen V exponent, and ln(B Points) multiplies Microwaves' base.<br>"                     
                                let b = "Currently: *" + format(tmp.tokens.milestones[10].effect)
                                if (shiftDown) {
                                        let formula = "Formula: max(1,ln(B Points+1))"
                                        return a + formula
                                }
                                return a + b
                        },
                },  // hasMilestone("tokens", 10)
                11: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[11].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(12)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[11].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 10)
                        },
                        effectDescription(){
                                let a = "Reward: Gamma Rays and Exponential are based on best amount, square Ultraviolet, and keep Oxygen and Carbon upgrades upon token reset.<br>"
                                return a 
                        },
                },  // hasMilestone("tokens", 11)
                12: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[12].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(13)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[12].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 11)
                        },
                        effectDescription(){
                                let a = "Reward: UHF Gamma Rays and Double-exponential are based on best amount and unlock an Oxygen upgrade.<br>"
                                return a 
                        },
                },  // hasMilestone("tokens", 12)
                13: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[13].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(14)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[13].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 12)
                        },
                        effectDescription(){
                                let a = "Reward: Square Oxygen IV, best token buyables are synchronized, and you can bulk 5x more A and B buyables.<br>"
                                return a 
                        },
                },  // hasMilestone("tokens", 13)
                14: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[14].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(16)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[14].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 13)
                        },
                        effectDescription(){
                                let a = "Reward: Tokens multiply coin gain.<br>"
                                return a 
                        },
                },  // hasMilestone("tokens", 14)
                15: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[15].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(18)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[15].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 14)
                        },
                        effectDescription(){
                                let a = "Reward: Each milestone multiplies Near-ultraviolet base by 1.2.<br>"
                                return a 
                        },
                },  // hasMilestone("tokens", 15)
                16: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[16].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(19)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[16].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 15)
                        },
                        effect(){
                                let a = player.tokens.total.max(1)
                                let b = a.ln().max(1).pow(a.sub(17).max(0))
                                return b.min(1000)
                        },
                        effectDescription(){
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Milestones") return ""
                                
                                let a = "Reward: ln(tokens)^[tokens-17] multiplies coin gain (capped at 1000).<br>"                     
                                let b = "Currently: *" + format(tmp.tokens.milestones[16].effect)
                                if (shiftDown) {
                                        let formula = "Formula: ln(tokens)^[tokens-17]"
                                        return a + formula
                                }
                                return a + b
                        },
                },  // hasMilestone("tokens", 16)
                17: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[17].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(22)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[17].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 16)
                        },
                        effectDescription(){
                                let a = "Reward: Cube base Oxygen gain"
                                return a
                        },
                },  // hasMilestone("tokens", 17)
                18: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[18].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(24)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[18].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 17)
                        },
                        effectDescription(){
                                let a = "Reward: Keep upgrades 42, 61, and 62 and add .01 to Cubic base"
                                return a
                        },
                },  // hasMilestone("tokens", 18)
                19: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[19].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(27)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[19].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 18)
                        },
                        effectDescription(){
                                let a = "Reward: Raise Hydrogen XVI to the 1.5"
                                return a
                        },
                },  // hasMilestone("tokens", 19)
                20: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[20].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(31)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[20].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 19)
                        },
                        effectDescription(){
                                let a = "Reward: Keep the first six rows of upgrades and add .01 to Cubic base"
                                return a
                        },
                },  // hasMilestone("tokens", 20)
                21: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[21].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(35)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[21].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 20)
                        },
                        effectDescription(){
                                let a = "Reward: Add .03 to Semi-exponential base"
                                return a
                        },
                },  // hasMilestone("tokens", 21)
                22: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[22].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(39)
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[22].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 21)
                        },
                        effectDescription(){
                                let a = "Reward: Add .03 to Exponential base"
                                return a
                        },
                },  // hasMilestone("tokens", 22)
                23: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[23].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(43) 
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[23].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 22)
                        },
                        effect(){
                                let c = new Decimal(4) // red c red d
                                // i want df/dt = X and you can upgrade X with stuff and there is prestige
                                // for d simialr concept but there is a wacka mole game that gives buffs
                                c = c.plus(tmp.mini.buyables[81].effect)
                                c = c.plus(tmp.mini.buyables[91].effect)
                                c = c.plus(tmp.mini.buyables[111].effect)
                                

                                return c
                        },
                        effectDescription(){
                                if (player.tab != "tokens") return ""
                                if (player.subtabs.tokens.mainTabs != "Milestones") return ""
                                
                                let a = "Reward: log10(Carbon)^<bdi style='color:#CC0033'>C</bdi> multiplies Oxygen and unlock a minigame for increasing <bdi style='color:#CC0033'>C</bdi>"                                                                                    
                                let b = ""

                                if (shiftDown) {
                                        b = "<br>Currently: " + format(player.c.points.max(10).log10()) + "^" + format(tmp.tokens.milestones[23].effect)
                                        b += " because <bdi style='color:#CC0033'>C</bdi> = "+ format(tmp.tokens.milestones[23].effect)
                                }
                                
                                return a + b
                        },
                },  // hasMilestone("tokens", 23)
                24: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[24].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(51) 
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[24].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 23)
                        },
                        effectDescription(){
                                let a = "Reward: Unlock another possible character and C Point gain 4's ln becomes log2" 
                                
                                return a 
                        },
                },  // hasMilestone("tokens", 24)
                25: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[25].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(53) 
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[25].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 24)
                        },
                        effectDescription(){
                                let a = "Reward: Reduce Corn interval to 3" 
                                
                                return a 
                        },
                },  // hasMilestone("tokens", 25)
                26: {
                        requirementDescription(){
                                let a = "Requires: " + formatWhole(tmp.tokens.milestones[26].requirement)
                                let b = " total tokens"
                                return a + b
                        },
                        requirement(){
                                return new Decimal(55) 
                        },
                        done(){
                                return player.tokens.total.gte(tmp.tokens.milestones[26].requirement)
                        },
                        unlocked(){
                                return hasMilestone("tokens", 25)
                        },
                        effectDescription(){
                                let a = "Reward: Reduce Corn interval to 1 and you can gamble after 1 second" 
                                
                                return a 
                        },
                },  // hasMilestone("tokens", 26)

        },
        upgrades: {
                rows: 10,
                cols: 5,
                11: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 11</bdi>"
                                return "<bdi style='color: #FF0000'>Start here!</bdi>"
                        },
                        description(){
                                if (shiftDown) return ""
                                return "Add three effective upgrades for Oxygen V"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[11].cost)) return false
                                return true
                        },
                        cost:() => new Decimal(3),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                return true
                        }, //hasUpgrade("tokens", 11)
                },
                21: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 21</bdi>"
                                return "<bdi style='color: #FF0000'>You get one</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'>Locks Upgrade 22</bdi>"
                                        let b = "<br>Current requirement:<br>!21"
                                        if (tmp.tokens.upgrades[42].unlocked) b += "||42"

                                        return a + b
                                }
                                return "Cube base Oxygen<br>gain"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[21].cost)) return false
                                return hasMilestone("n", 5) || !hasUpgrade("tokens", 22) || hasUpgrade("tokens", 42)
                        },
                        cost:() => new Decimal(5),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                return hasMilestone("n", 5) || hasUpgrade("tokens", 11) || hasMilestone("tokens", 18)
                        }, //hasUpgrade("tokens", 21)
                },
                22: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 22</bdi>"
                                return "<bdi style='color: #FF0000'>on this row.</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'>Locks Upgrade 21</bdi>"
                                        let b = "<br>Current requirement:<br>!22"
                                        if (tmp.tokens.upgrades[42].unlocked) b += "||42"

                                        return a + b
                                }
                                return "Square base Carbon<br>gain"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[22].cost)) return false
                                return hasMilestone("n", 5) || !hasUpgrade("tokens", 21) || hasUpgrade("tokens", 42)
                        },
                        cost:() => new Decimal(5),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                return hasMilestone("n", 5) || hasUpgrade("tokens", 11) || hasMilestone("tokens", 18)
                        }, //hasUpgrade("tokens", 22)
                },
                31: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 31</bdi>"
                                return "<bdi style='color: #FF0000'>An old silent pond /</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'>Locks Upgrade 32</bdi>"
                                        let b = "<br>Current requirement:<br>!32"
                                        if (tmp.tokens.upgrades[61].unlocked) b += "||61"

                                        return a + b
                                }
                                return "Add .01 to Logarithimic base"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[31].cost)) return false
                                return hasMilestone("n", 5) || !hasUpgrade("tokens", 32) || hasUpgrade("tokens", 61)
                        },
                        cost:() => new Decimal(30),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                return hasMilestone("n", 5) || hasMilestone("n", 5) ||  hasMilestone("tokens", 18) || hasUpgrade("o", 23) && (hasUpgrade("tokens", 21) || hasUpgrade("tokens", 22))
                        }, //hasUpgrade("tokens", 31)
                },
                32: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 32</bdi>"
                                return "<bdi style='color: #FF0000'>A frog jumps into</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'>Locks Upgrade 31</bdi>"
                                        let b = "<br>Current requirement:<br>!31"
                                        if (tmp.tokens.upgrades[61].unlocked) b += "||61"

                                        return a + b
                                }
                                return "Tokens multiply Ultraviolet base"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[32].cost)) return false
                                return hasMilestone("n", 5) || !hasUpgrade("tokens", 31) || hasUpgrade("tokens", 61)
                        },
                        cost:() => new Decimal(30),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                return hasMilestone("n", 5) || hasMilestone("tokens", 18) || hasUpgrade("o", 23) && (hasUpgrade("tokens", 21) || hasUpgrade("tokens", 22))
                        }, //hasUpgrade("tokens", 32)
                },
                33: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 33</bdi>"
                                return "<bdi style='color: #FF0000'>the pond— /</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'>Locks Upgrade 34</bdi>"
                                        let b = "<br>Current requirement:<br>!34"
                                        if (tmp.tokens.upgrades[61].unlocked) b += "||61"

                                        return a + b
                                }
                                return "Add .01 to Quadratic base"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[33].cost)) return false
                                return hasMilestone("n", 5) || !hasUpgrade("tokens", 34) || hasUpgrade("tokens", 61)
                        },
                        cost:() => new Decimal(30),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                return hasMilestone("n", 5) || hasMilestone("tokens", 18) || hasUpgrade("o", 23) && (hasUpgrade("tokens", 21) || hasUpgrade("tokens", 22))
                        }, //hasUpgrade("tokens", 33)
                },
                34: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 34</bdi>"
                                return "<bdi style='color: #FF0000'>Splash! Silence</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'>Locks Upgrade 33</bdi>"
                                        let b = "<br>Current requirement:<br>!33"
                                        if (tmp.tokens.upgrades[61].unlocked) b += "||61"

                                        return a + b
                                }
                                return "Add .01 to Linear<br>base"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[34].cost)) return false
                                return hasMilestone("n", 5) || !hasUpgrade("tokens", 33) || hasUpgrade("tokens", 61)
                        },
                        cost:() => new Decimal(30),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                return hasMilestone("n", 5) || hasMilestone("tokens", 18) || hasUpgrade("o", 23) && (hasUpgrade("tokens", 21) || hasUpgrade("tokens", 22))
                        }, //hasUpgrade("tokens", 34)
                },
                41: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 41</bdi>"
                                return "<bdi style='color: #FF0000'>again.</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'></bdi>"
                                        let b = "<br>Current requirement:<br>"

                                        return a + b
                                }
                                return "Square X-Rays<br>base"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[41].cost)) return false
                                return true
                        },
                        cost:() => new Decimal(60),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                return hasMilestone("n", 5) || hasMilestone("tokens", 18) || hasUpgrade("tokens", 31) || hasUpgrade("tokens", 32) || hasUpgrade("tokens", 33) || hasUpgrade("tokens", 34)
                        }, //hasUpgrade("tokens", 41)
                },
                42: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 42</bdi>"
                                return "<bdi style='color: #FF0000'>by Matsuo Bashō</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'></bdi>"
                                        let b = "<br>Current requirement:<br>"

                                        return a + b
                                }
                                return "Re-unlock upgrade 21 and 22"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[42].cost)) return false
                                return true
                        },
                        cost:() => new Decimal(60),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                return hasMilestone("n", 5) || hasMilestone("tokens", 18) || hasUpgrade("tokens", 31) || hasUpgrade("tokens", 32) || hasUpgrade("tokens", 33) || hasUpgrade("tokens", 34)
                        }, //hasUpgrade("tokens", 42)
                },
                51: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 51</bdi>"
                                return "<bdi style='color: #FF0000'>Tau</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'>Locks Upgrade 52</bdi>"
                                        let b = "<br>Current requirement:<br>!52"
                                        if (tmp.tokens.upgrades[62].unlocked) b += "||62"

                                        return a + b
                                }
                                return "Oxygen^ .1 multiplies Carbon gain"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[51].cost)) return false
                                return hasMilestone("n", 5) || !hasUpgrade("tokens", 52) || hasUpgrade("tokens", 62)
                        },
                        cost:() => new Decimal(100),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                if (hasMilestone("n", 5) || hasMilestone("tokens", 18)) return true
                                if (!player.tokens.total.gte(18) && !player.n.unlocked) return false
                                return hasUpgrade("tokens", 41) && hasUpgrade("tokens", 42)
                        }, //hasUpgrade("tokens", 51)
                },
                52: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 52</bdi>"
                                return "<bdi style='color: #FF0000'>Rhenium</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'>Locks Upgrade 51</bdi>"
                                        let b = "<br>Current requirement:<br>!51"
                                        if (tmp.tokens.upgrades[62].unlocked) b += "||62"

                                        return a + b
                                }
                                return "Carbon^ .1 multiplies Oxygen gain"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[51].cost)) return false
                                return hasMilestone("n", 5) || !hasUpgrade("tokens", 51) || hasUpgrade("tokens", 62)
                        },
                        cost:() => new Decimal(100),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                if (hasMilestone("n", 5) || hasMilestone("tokens", 18)) return true
                                if (!player.tokens.total.gte(18) && !player.n.unlocked) return false
                                return hasUpgrade("tokens", 41) && hasUpgrade("tokens", 42)
                        }, //hasUpgrade("tokens", 52)
                },
                                                                                                                                                                                                                                                                                                
                61: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 61</bdi>"
                                return "<bdi style='color: #FF0000'>Electron</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'></bdi>"
                                        let b = "<br>Current requirement:<br>"

                                        return a + b
                                }
                                return "Re-unlocks the third row of upgrades"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[61].cost)) return false
                                return true
                        },
                        cost:() => new Decimal(200),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                return hasMilestone("n", 5) || hasMilestone("tokens", 18) || (hasUpgrade("tokens", 51) || hasUpgrade("tokens", 52)) && player.tokens.total.gte(20)
                        }, //hasUpgrade("tokens", 61)
                },
                62: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 62</bdi>"
                                return "<bdi style='color: #FF0000'>Oxygen</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'></bdi>"
                                        let b = "<br>Current requirement:<br>"

                                        return a + b
                                }
                                return "Re-unlocks the fifth row of upgrades"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[62].cost)) return false
                                return true
                        },
                        cost:() => new Decimal(250),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                return hasMilestone("n", 5) || hasMilestone("tokens", 18) || (hasUpgrade("tokens", 51) || hasUpgrade("tokens", 52)) && player.tokens.total.gte(20)
                        }, //hasUpgrade("tokens", 62)
                },
                71: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 71</bdi>"
                                return "<bdi style='color: #FF0000'>Fluorine</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'>Locks upgrades 72 and 73</bdi>"
                                        let b = "<br>Current requirement:<br>!72 && !73"

                                        if (hasUpgrade("h", 73)) {
                                                a = ""
                                                b = "<br>Current requirement:<br>"
                                        }

                                        return a + b
                                }
                                return "Allow for the purchase of the second row of Deuterium upgrades"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[71].cost)) return false
                                return hasMilestone("n", 5) || hasUpgrade("h", 73) || (!hasUpgrade("tokens", 72) && !hasUpgrade("tokens", 73))
                        },
                        cost:() => new Decimal(3000),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                return hasMilestone("n", 5) || hasMilestone("tokens", 18) || (hasUpgrade("tokens", 61) || hasUpgrade("tokens", 62)) && player.tokens.total.gte(22)
                        }, //hasUpgrade("tokens", 71)
                },
                72: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 72</bdi>"
                                return "<bdi style='color: #FF0000'>Lithium</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'>Locks upgrades 71 and 73</bdi>"
                                        let b = "<br>Current requirement:<br>!71 && !73"

                                        if (hasUpgrade("h", 73)) {
                                                a = ""
                                                b = "<br>Current requirement:<br>"
                                        }

                                        return a + b
                                }
                                return "Allow for the purchase of the second row of Atomic Hydrogen upgrades"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[72].cost)) return false
                                return hasMilestone("n", 5) || hasUpgrade("h", 73) || (!hasUpgrade("tokens", 71) && !hasUpgrade("tokens", 73))
                        },
                        cost:() => new Decimal(3000),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                return hasMilestone("n", 5) || hasMilestone("tokens", 18) || (hasUpgrade("tokens", 61) || hasUpgrade("tokens", 62)) && player.tokens.total.gte(22)
                        }, //hasUpgrade("tokens", 72)
                },
                73: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 73</bdi>"
                                return "<bdi style='color: #FF0000'>Iron</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'>Locks upgrades 71 and 72</bdi>"
                                        let b = "<br>Current requirement:<br>!71 && !72"

                                        if (hasUpgrade("h", 73)) {
                                                a = ""
                                                b = "<br>Current requirement:<br>"
                                        }

                                        return a + b
                                }
                                return "You have one fewer token for token prestige requirements"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[73].cost)) return false
                                return hasMilestone("n", 5) || hasUpgrade("h", 73) || (!hasUpgrade("tokens", 71) && !hasUpgrade("tokens", 72))
                        },
                        cost:() => new Decimal(2000),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                return hasMilestone("n", 5) || hasMilestone("tokens", 18) || (hasUpgrade("tokens", 61) || hasUpgrade("tokens", 62)) && player.tokens.total.gte(22)
                        }, //hasUpgrade("tokens", 73)
                },
                81: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 81</bdi>"
                                return "<bdi style='color: #FF0000'>The Easter</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'>Locks upgrades 82</bdi>"
                                        let b = "<br>Current requirement:<br>!82"
                                        if (hasUpgrade("mini", 31)) {
                                                a = "<bdi style='color: #863813'></bdi>"
                                                b = "<br>Current requirement:<br>"
                                        }

                                        return a + b
                                }
                                return "Gain 81x coins and Oxygen"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[81].cost)) return false
                                return hasMilestone("n", 5) || hasUpgrade("mini", 31) || (!hasUpgrade("tokens", 82))
                        },
                        cost:() => new Decimal(2e4),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                return hasMilestone("n", 5) || (hasUpgrade("tokens", 71) && hasUpgrade("tokens", 72) && hasUpgrade("tokens", 73)) && player.tokens.total.gte(41)
                        }, //hasUpgrade("tokens", 81)
                },
                82: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 82</bdi>"
                                return "<bdi style='color: #FF0000'>Egg is here.</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'>Locks upgrades 81</bdi>"
                                        let b = "<br>Current requirement:<br>!81"
                                        if (hasUpgrade("mini", 31)) {
                                                a = "<bdi style='color: #863813'></bdi>"
                                                b = "<br>Current requirement:<br>"
                                        }

                                        return a + b
                                }
                                return "Token buyable exponent is .65"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[82].cost)) return false
                                return hasMilestone("n", 5) || hasUpgrade("mini", 31) || (!hasUpgrade("tokens", 81))
                        },
                        cost:() => new Decimal(2e4),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                return hasMilestone("n", 5) || (hasUpgrade("tokens", 71) && hasUpgrade("tokens", 72) && hasUpgrade("tokens", 73)) && player.tokens.total.gte(41)
                        }, // hasUpgrade("tokens", 82)
                },
                91: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 91</bdi>"
                                return "<bdi style='color: #FF0000'>Once Upon</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'></bdi>"
                                        let b = "<br>Current requirement:<br>"

                                        return a + b
                                }
                                return "C Point Gain 1's log10 is buffed to ln (upgrades in this row are never repealed)"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[91].cost)) return false
                                return true
                        },
                        cost:() => new Decimal(1e5),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                return hasUpgrade("tokens", 91) || player.tokens.total.gte(54) || hasMilestone("n", 5)
                        }, //hasUpgrade("tokens", 91)
                },
                92: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 92</bdi>"
                                return "<bdi style='color: #FF0000'>A Time</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'></bdi>"
                                        let b = "<br>Current requirement:<br>"

                                        return a + b
                                }
                                return "You can (automatically) gamble four times a second and apply Cod again"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[92].cost)) return false
                                return true
                        },
                        cost:() => new Decimal(2e5),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                return hasUpgrade("tokens", 92) || player.tokens.total.gte(56) || hasMilestone("n", 5)
                        }, // hasUpgrade("tokens", 92)
                },
                93: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 93</bdi>"
                                return "<bdi style='color: #FF0000'>In a galaxy</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'></bdi>"
                                        let b = "<br>Current requirement:<br>"

                                        return a + b
                                }
                                return "C Point gain 6's outer log10 becomes a ln and gain 81x coins"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[93].cost)) return false
                                return true
                        },
                        cost:() => new Decimal(3e5),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                return hasUpgrade("tokens", 93) || player.tokens.total.gte(61) || hasMilestone("n", 5)
                        }, // hasUpgrade("tokens", 93)
                },
                94: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 94</bdi>"
                                return "<bdi style='color: #FF0000'>rather near</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'></bdi>"
                                        let b = "<br>Current requirement:<br>"

                                        return a + b
                                }
                                return "C Point gain 6's inner log10 becomes a ln and Unlock a slot base is 10"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[94].cost)) return false
                                return true
                        },
                        cost:() => new Decimal(1e6),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                return hasUpgrade("tokens", 94) || player.tokens.total.gte(63) || hasMilestone("n", 5)
                        }, // hasUpgrade("tokens", 94)
                },
                95: {
                        title(){
                                if (shiftDown) return "<bdi style='color: #FF00FF'>Upgrade 95</bdi>"
                                return "<bdi style='color: #FF0000'>here...</bdi>"
                        },
                        description(){
                                if (shiftDown) {
                                        let a = "<bdi style='color: #863813'></bdi>"
                                        let b = "<br>Current requirement:<br>"

                                        return a + b
                                }
                                return "The autobuyer can buy each buyable once per trigger"
                        },
                        canAfford(){
                                if (player.tokens.coins.points.lt(tmp.tokens.upgrades[95].cost)) return false
                                return true
                        },
                        cost:() => new Decimal(3e6),
                        currencyLocation:() => player.tokens.coins,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Coins",
                        unlocked(){
                                return hasUpgrade("tokens", 95) || player.tokens.total.gte(64) || hasMilestone("n", 5)
                        }, // hasUpgrade("tokens", 95)
                },
        },
        tabFormat: {
                "Milestones": {
                        content: [
                                ["prestige-button", "", function (){ return false ? {'display': 'none'} : {}}],
                                ["milestones", [1]],
                        ],
                        unlocked(){
                                return true
                        },
                        shouldNotify(){
                                return canReset("tokens")
                        },
                },
                "Flat": {
                        content: [
                                "main-display",
                                /*["display-text", function(){
                                        return "You can at any time remove (and reapply) tokens through shift!"
                                }],*/
                                ["display-text", function(){
                                        let a = "Each upgrade boosts something different! You can sell upgrades at any time with no cost.<br>"
                                        let b = ""
                                        if (player.tokens.total.lt(10)) {
                                                b = "Note that selling things that boost decaying resources can cause you to lose resources."
                                        } else if (player.tokens.total.gte(14)) {
                                                b = "The synchronized amount is currently " + formatWhole(player.tokens.best_buyables[11]) + " levels."
                                                b += " You have " + formatWhole(player.tokens.total) + " total tokens."
                                        }
                                        return a + b
                                }],
                                ["buyables", [1,2,3]],
                                ["display-text", "<br><br><br>"],
                                ["buyables", [7]],
                        ],
                        unlocked(){
                                return true
                        },
                        shouldNotify(){
                                let x = ["11", "12", "13", "21", "22", 
                                        "23", "31", "32", "33", "41", 
                                        "42", "43", "51", "52", "53", 
                                        "61", "62", "63"]
                                for (i in x){
                                        id = x[i]
                                        if (!tmp.tokens.buyables[id].canAfford) return false
                                }
                                return true
                        },
                },
                "Scaling": {
                        content: [
                                "main-display",
                                /*["display-text", function(){
                                        return "You can at any time remove (and reapply) tokens through shift!"
                                }],*/
                                ["display-text", function(){
                                        let a = "Each upgrade boosts something different! You can sell upgrades at any time with no cost.<br>"
                                        let b = ""
                                        if (player.tokens.total.lt(10)) {
                                                b = "Note that selling things that boost decaying resources can cause you to lose resources."
                                        } else if (player.tokens.total.gte(14)) {
                                                b = "The synchronized amount is currently " + formatWhole(player.tokens.best_buyables[11]) + " levels."
                                                b += " You have " + formatWhole(player.tokens.total) + " total tokens."
                                        }
                                        return a + b
                                }],
                                ["buyables", [4,5,6]],
                                ["display-text", "<br><br><br>"],
                                ["buyables", [7]],
                        ],
                        unlocked(){
                                return true
                        },
                        shouldNotify(){
                                let x = ["11", "12", "13", "21", "22", 
                                        "23", "31", "32", "33", "41", 
                                        "42", "43", "51", "52", "53", 
                                        "61", "62", "63"]
                                for (i in x){
                                        id = x[i]
                                        if (!tmp.tokens.buyables[id].canAfford) return false
                                }
                                return true
                        },
                },
                "Coins": {
                        content: [
                                ["secondary-display", "coins"],
                                ["display-text", function(){
                                        if (player.tab != "tokens") return ""
                                        if (player.subtabs.tokens.mainTabs != "Coins") return ""
                                
                                        let a = "You passively gain coins. Hold shift to see upgrade numbers and when upgrades get locked.<br>At any time you can remove all upgrades, but you do NOT get coins back."
                                        if (!shiftDown) return a 
                                        let b = "Formula: " + format(tmp.tokens.coins.getGainMult) + "/(1+coins)"
                                        let c = "<br>You are currently gaining " + format(tmp.tokens.coins.getGainMult.div(player.tokens.coins.points.plus(1))) + " coins per second."
                                        return b + c
                                }],
                                ["upgrades", [1,2,3,4,5,6,7,8,9]],
                                ["display-text", "<br><br><br>"],
                                ["buyables", [8]],
                        ],
                        unlocked(){
                                return hasUpgrade("c", 21) || hasMilestone("n", 9)
                        },
                        shouldNotify(){
                                let x = ["11", "21", "22", "31", "32", 
                                         "33", "34", "41", "42", "51", 
                                         "52", "61", "62", "71", "72", 
                                         "73", "81", "82", "91", "92", 
                                         "93", "94", "95",]
                                for (i in x){
                                        id = x[i]
                                        if (hasUpgrade("tokens", id)) continue
                                        if (!tmp.tokens.upgrades[id].unlocked) continue
                                        if (canAffordUpgrade("tokens", id)) return true
                                }
                                return false
                        },
                },
        },
})





