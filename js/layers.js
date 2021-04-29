function getPointGen() {
	let gain = new Decimal(.1)
        if (hasUpgrade("h", 11)) gain = gain.times(tmp.h.upgrades[11].effect)
        if (hasUpgrade("h", 22)) gain = gain.times(tmp.h.upgrades[22].effect)
        if (hasUpgrade("h", 34)) gain = gain.times(tmp.h.upgrades[13].effect)
        gain = gain.times(tmp.mini.buyables[61].effect)
        if (hasUpgrade("o", 15)) gain = gain.times(tmp.o.upgrades[15].effect)
        if (hasUpgrade("h", 61)) gain = gain.times(tmp.h.upgrades[61].effect)

        gain = gain.times(tmp.tokens.buyables[11].effect)
        gain = gain.times(tmp.n.effect)



        if (hasUpgrade("h", 25)) gain = gain.pow(tmp.h.upgrades[25].effect)
        if (hasUpgrade("o", 13)) gain = gain.pow(tmp.o.upgrades[13].effect)
        gain = gain.pow(tmp.tokens.buyables[41].effect)
        if (hasUpgrade("n", 11)) gain = gain.pow(1.001)

	return gain
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

/*
function tryStuff(target, left){
    let valid = [1,3,6,10,15,21,28,36,45,55,66,78,91,105,120,136,153,171,190,210]
    if (left <= 1) return valid.includes(target)
    for (let i = 0; i < valid.length; i++){
        let amt = valid[i]
        if (amt == target) return true
        if (amt > target) return false
        let a = tryStuff(target-amt, left-1)
        if (a) return true
    }
}
*/

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
                return new Decimal(0) //this doesnt matter
        },
        getLossRate() { //hydrogen loss
                let ret = new Decimal(.01)
                if (hasUpgrade("h", 21)) ret = ret.plus(.0002)
                if (hasUpgrade("h", 31)) ret = ret.plus(.001)
                if (hasUpgrade("h", 35)) ret = ret.sub( .0012)



                return ret.max(.00001)
        },
        getGainMult(){
                let x = new Decimal(1)

                if (hasUpgrade("h", 13)) x = x.times(tmp.h.upgrades[13].effect)
                if (hasUpgrade("h", 22)) x = x.times(tmp.h.upgrades[22].effect)
                x = x.times(tmp.mini.buyables[42].effect)
                x = x.times(tmp.mini.buyables[63].effect)
                x = x.times(tmp.tokens.buyables[12].effect)
                if (hasUpgrade("o", 21)) x = x.times(player.o.points.max(1))
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

                if (false) {
                        //do autobuyer stuff
                } else {
                        data.abtime = 0
                }
                data.time += diff
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
                {key: "]", description: "]: Buy max of all upgrades", 
                        onPress(){
                                console.log("yo do this")
                        }
                },
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

                        return ret
                },
                getLossRate() { //deuterium loss
                        return new Decimal(.01)
                },
                getGainMult(){
                        let x = new Decimal(1)

                        if (hasUpgrade("h", 23)) x = x.times(tmp.h.upgrades[23].effect)
                        if (hasUpgrade("h", 41)) x = x.times(Decimal.pow(player.h.atomic_hydrogen.points.plus(3).ln(), tmp.h.upgrades[41].effect))
                        x = x.times(tmp.mini.buyables[13].effect)
                        x = x.times(tmp.tokens.buyables[21].effect)

                        return x
                },
        },
        atomic_hydrogen: {
                getResetGain() {
                        let base = player.h.points.times(.001)
                        let mult = tmp.h.atomic_hydrogen.getGainMult

                        let ret = base.times(mult)

                        ret = ret.pow(tmp.tokens.buyables[43].effect)

                        return ret
                },
                getLossRate() { //atomic hydrogen loss atomic loss
                        return new Decimal(.01)
                },
                getGainMult(){
                        let x = new Decimal(1)

                        if (hasUpgrade("h", 42)) x = x.times(Decimal.pow(player.h.deuterium.points.plus(3).ln(), tmp.h.upgrades[42].effect))
                        x = x.times(tmp.mini.buyables[11].effect)
                        x = x.times(tmp.tokens.buyables[13].effect)

                        return x
                },
        },
        upgrades: {
                rows: 1000,
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

                                if (hasUpgrade("h", 33)) ret = init.log2().max(1)
                                else                     ret = init.ln().max(1)

                                if (hasUpgrade("h", 14)) ret = ret.pow(tmp.h.upgrades[14].effect)

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
                                if (hasUpgrade("h", 43)) ret = a1.log2().max(1)
                                else ret = a1.ln().max(1)

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
                                a = ""
                                if (hasUpgrade("h", 21)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[21].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
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
                                if (!player.hardMode) return hasUpgrade("h", 31) ? new Decimal(10e3) : new Decimal(10)
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
                                if (!player.hardMode) return hasUpgrade("h", 31) ? new Decimal(40e3) : new Decimal(40)
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
                                a = ""
                                if (hasUpgrade("h", 24)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[24].cost, player.h.deuterium.points, tmp.h.deuterium.getResetGain, tmp.h.deuterium.getLossRate)
                        },
                        cost(){
                                if (!player.hardMode) return hasUpgrade("h", 31) ? new Decimal(300e3) : new Decimal(300)
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
                                if (!player.hardMode) return hasUpgrade("h", 31) ? new Decimal(4000e3) : new Decimal(4000)
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
                                a = ""
                                if (hasUpgrade("h", 31)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[31].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
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
                                if (!player.hardMode) return hasUpgrade("h", 21) ? new Decimal(40e3) : new Decimal(40)
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
                                a = ""
                                if (hasUpgrade("h", 33)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[33].cost, player.h.atomic_hydrogen.points, tmp.h.atomic_hydrogen.getResetGain, tmp.h.atomic_hydrogen.getLossRate)
                        },
                        cost(){
                                if (!player.hardMode) return hasUpgrade("h", 21) ? new Decimal(150e3) : new Decimal(150)
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
                                a = ""
                                if (hasUpgrade("h", 34)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[34].cost, player.h.atomic_hydrogen.points, tmp.h.atomic_hydrogen.getResetGain, tmp.h.atomic_hydrogen.getLossRate)
                        },
                        cost(){
                                if (!player.hardMode) return hasUpgrade("h", 21) ? new Decimal(1500e3) : new Decimal(1500)
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
                                a = ""
                                if (hasUpgrade("h", 35)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[35].cost, player.h.atomic_hydrogen.points, tmp.h.atomic_hydrogen.getResetGain, tmp.h.atomic_hydrogen.getLossRate)
                        },
                        cost(){
                                if (!player.hardMode) return hasUpgrade("h", 21) ? new Decimal(7000e3) : new Decimal(7000)
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
                                if (!shiftDown) return "ln(3+[Atomic Hydrogen])^<bdi style='color:#CC0033'>A</bdi> multiplies Deuterium gain"
                                eff = format(tmp.h.upgrades[41].effect)
                                a = "ln(3+[Atomic Hydrogen])^" + eff
                                if (hasUpgrade("h", 41)) {
                                        a += "<br>" + format(player.h.atomic_hydrogen.points.plus(3).ln()) + "^" + eff
                                        return a
                                } // red a 
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[41].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                return player.hardMode ? new Decimal(5.5e9) : new Decimal(3e9)
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
                                if (!shiftDown) return "ln(3+[Deuterium])^<bdi style='color:#CC0033'>B</bdi> multiplies Atomic Hydrogen gain"
                                eff = format(tmp.h.upgrades[42].effect)
                                a = "ln(3+[Deuterium])^" + eff
                                if (hasUpgrade("h", 42)) {
                                        a += "<br>" + format(player.h.deuterium.points.plus(3).ln()) + "^" + eff
                                        return a
                                } //red b
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[42].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                return player.hardMode ? new Decimal(7e9) : new Decimal(4e9)
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
                                a = ""
                                if (hasUpgrade("h", 43)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[43].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                return player.hardMode ? new Decimal(8e9) : new Decimal(5e9)
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
                                a = ""
                                if (hasUpgrade("h", 44)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[44].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
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
                                a = ""
                                if (hasUpgrade("h", 45)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[45].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
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
                                a = ""
                                if (hasUpgrade("h", 51)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[51].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
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
                                a = ""
                                if (hasUpgrade("h", 52)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[52].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
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
                                a = ""
                                if (hasUpgrade("h", 53)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[53].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
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
                                if (!shiftDown) return "sqrt in the A production formula becomes ^.52"
                                a = ""
                                if (hasUpgrade("h", 54)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[54].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                return player.hardMode ? new Decimal("1e364") : new Decimal("1e360")
                        },
                        unlocked(){
                                return hasMilestone("tokens", 2) || hasUpgrade("h", 53) 
                        }, //hasUpgrade("h", 54)
                },
                55: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(24) + "'>Hydrogen XV"
                        },
                        description(){
                                if (!shiftDown) return "^.52 in the A production formula becomes ^.524 and unlock Carbon (C) and Oxygen (O)"
                                a = ""
                                if (hasUpgrade("h", 55)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[55].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
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
                                return "<bdi style='color: #" + getUndulatingColor(35) + "'>Hydrogen XVI"
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
                                return "<bdi style='color: #" + getUndulatingColor(36) + "'>Hydrogen XVII"
                        },
                        description(){
                                if (!shiftDown) return "Oxygen IV effects Carbon gain and double autobuyer speed"
                                a = ""
                                if (hasUpgrade("h", 62)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[62].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
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
                                return "<bdi style='color: #" + getUndulatingColor(37) + "'>Hydrogen XVIII"
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
                                return "<bdi style='color: #" + getUndulatingColor(38) + "'>Hydrogen XIX"
                        },
                        description(){
                                if (!shiftDown) return "Square the ln(x) term in White and add a log10(x) term to Green"
                                a = ""
                                if (hasUpgrade("h", 64)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[64].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
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
                                return "<bdi style='color: #" + getUndulatingColor(39) + "'>Hydrogen XX"
                        },
                        description(){
                                if (!shiftDown) return "Unlock tokens"
                                a = ""
                                if (hasUpgrade("h", 65)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[65].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
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
                                return "<bdi style='color: #" + getUndulatingColor(111) + "'>Deuterium VI"
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
                                return "<bdi style='color: #" + getUndulatingColor(111) + "'>Deuterium VII"
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
                                return "<bdi style='color: #" + getUndulatingColor(112) + "'>" + end
                        },
                        canAfford(){
                                if (player.h.deuterium.points.lt(tmp.h.upgrades[73].cost)) return false
                                return hasUpgrade("tokens", 71)
                        },
                        description(){
                                if (!shiftDown) return "Add .01 to Constant base and you can buy all 3 row 7 coin upgrades"
                                a = ""
                                return a
                        },
                        cost(){
                                return Decimal.pow(10, 4518e3)
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
                                return "<bdi style='color: #" + getUndulatingColor(112) + "'>Deuterium IX"
                        },
                        canAfford(){
                                if (player.h.deuterium.points.lt(tmp.h.upgrades[74].cost)) return false
                                return hasUpgrade("tokens", 71)
                        },
                        description(){
                                if (!shiftDown) return "Square Oxygen I and remove the -9"
                                a = ""
                                return a
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
                                return "<bdi style='color: #" + getUndulatingColor(113) + "'>Deuterium X"
                        },
                        canAfford(){
                                if (player.h.deuterium.points.lt(tmp.h.upgrades[75].cost)) return false
                                return hasUpgrade("tokens", 71)
                        },
                        description(){
                                if (!shiftDown) return "Change token buyable costs from ceiling to rounding"
                                a = ""
                                return a
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
                                return "<bdi style='color: #" + getUndulatingColor(115) + "'>Atomic Hydrogen VI"
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
                                return Decimal.pow(10, 6100e3)
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
                                return "<bdi style='color: #" + getUndulatingColor(116) + "'>Atomic Hydrogen VII"
                        },
                        canAfford(){
                                if (player.h.atomic_hydrogen.points.lt(tmp.h.upgrades[82].cost)) return false
                                return hasUpgrade("tokens", 72)
                        },
                        description(){
                                if (!shiftDown) return "Per token per upgrade multiply Microwave base by 1.01"
                                a = ""
                                return a
                        },
                        cost(){
                                return Decimal.pow(10, 7030e3)
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
                                return "<bdi style='color: #" + getUndulatingColor(117) + "'>Atomic Hydrogen VIII"
                        },
                        canAfford(){
                                if (player.h.atomic_hydrogen.points.lt(tmp.h.upgrades[83].cost)) return false
                                return hasUpgrade("tokens", 72)
                        },
                        description(){
                                if (!shiftDown) return "Raise token buyable costs ^.9 (ceilinged)"
                                a = ""
                                return a
                        },
                        cost(){
                                return Decimal.pow(10, 7360e3)
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
                                return "<bdi style='color: #" + getUndulatingColor(118) + "'>Atomic Hydrogen IX"
                        },
                        canAfford(){
                                if (player.h.atomic_hydrogen.points.lt(tmp.h.upgrades[84].cost)) return false
                                return hasUpgrade("tokens", 72)
                        },
                        description(){
                                if (!shiftDown) return "Change token buyable exponent to .8"
                                a = ""
                                return a
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
                                return "<bdi style='color: #" + getUndulatingColor(119) + "'>Atomic Hydrogen X"
                        },
                        canAfford(){
                                if (player.h.atomic_hydrogen.points.lt(tmp.h.upgrades[85].cost)) return false
                                return hasUpgrade("tokens", 72)
                        },
                        description(){
                                if (!shiftDown) return "Change token buyable exponent to .7"
                                a = ""
                                return a
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

                if (hasUpgrade("c", 15)) ret = ret.pow(tmp.h.upgrades[25].effect)
                ret = ret.pow(tmp.tokens.buyables[52].effect)
                if (hasUpgrade("n", 11)) ret = ret.pow(1.001)

                if (hasUpgrade("tokens", 51)) ret = ret.times(player.o.points.max(1).pow(.1))

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

                return ret.max(.00001)
        },
        getGainMult(){ //carbon gain mult
                let x = new Decimal(1)

                if (hasUpgrade("c", 14)) x = x.times(tmp.c.upgrades[14].effect)
                if (hasUpgrade("c", 15)) x = x.times(tmp.h.upgrades[25].effect)
                if (hasUpgrade("h", 62)) x = x.times(tmp.o.upgrades[14].effect)
                if (hasUpgrade("h", 63)) x = x.times(tmp.h.upgrades[63].effect)
                x = x.times(tmp.tokens.buyables[22].effect)
                if (hasMilestone("tokens", 3)) x = x.times(player.ach.achievements.length)
                if (hasUpgrade("c", 21)) x = x.times(tmp.c.upgrades[21].effect)
                x = x.times(tmp.mini.buyables[101].effect)
                x = x.times(tmp.n.effect)
                if (hasUpgrade("n", 23)) x = x.times(tmp.n.upgrades[23].effect)

                return x
        },
        update(diff){
                let data = player.c
                
                if (data.best.gt(0)) data.unlocked = true
                else data.unlocked = (!player.o.best.gt(0) || player.points.max(2).log(2).gte(2460)) &&  player.points.max(2).log(2).gte(1024)
                data.best = data.best.max(data.points)
                
                // do hydrogen gain
                data.points = getLogisticAmount(data.points, tmp.c.getResetGain, tmp.c.getLossRate, diff)
                /*if (hasUpgrade("h", 21)) deut.points = getLogisticAmount(deut.points, 
                                                                         tmp.h.deuterium.getResetGain, 
                                                                         tmp.h.deuterium.getLossRate, 
                                                                         diff)*/
                

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
                rows: 1000,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(25) + "'>Carbon I"
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
                                return "<bdi style='color: #" + getUndulatingColor(26) + "'>Carbon II"
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
                                return "<bdi style='color: #" + getUndulatingColor(27) + "'>Carbon III"
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
                                return "<bdi style='color: #" + getUndulatingColor(28) + "'>Carbon IV"
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
                                let init = player.h.deuterium.points.plus(3).ln().div(1000).max(1)

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
                                return "<bdi style='color: #" + getUndulatingColor(29) + "'>Carbon V"
                        },
                        description(){
                                if (!shiftDown) return "Deuterium V multiplies and then exponentiates Carbon gain"
                                a = ""
                                if (hasUpgrade("c", 15)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.c.upgrades[15].cost, player.c.points, tmp.c.getResetGain, tmp.c.getLossRate)
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
                                return "<bdi style='color: #" + getUndulatingColor(29) + "'>Carbon VI"
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
                                return "<bdi style='color: #" + getUndulatingColor(601) + "'>Carbon VII"
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
                                return player.hardMode ? new Decimal(1e37) : new Decimal(3e36)
                        },
                        unlocked(){
                                return hasMilestone("n", 6) || hasUpgrade("o", 22)
                        }, //hasUpgrade("c", 22)
                },
                23: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(603) + "'>Carbon VIII"
                        },
                        description(){
                                if (!shiftDown) return "Change token buyable cost scaling from exponential to linear"
                                a = ""
                                if (hasUpgrade("c", 23)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.c.upgrades[23].cost, player.c.points, tmp.c.getResetGain, tmp.c.getLossRate)
                        },
                        cost() {
                                return player.hardMode ? new Decimal(3e73) : new Decimal(1e73)
                        },
                        unlocked(){
                                return hasMilestone("n", 6) || hasUpgrade("o", 23)
                        }, //hasUpgrade("c", 23)
                },
                24: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(604) + "'>Carbon IX"
                        },
                        description(){
                                if (!shiftDown) return "Add 1000 to Carbon VII and halve the Double-exponential divider"
                                a = ""
                                if (hasUpgrade("c", 24)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.c.upgrades[24].cost, player.c.points, tmp.c.getResetGain, tmp.c.getLossRate)
                        },
                        cost() {
                                return player.hardMode ? new Decimal(8.1e155) : new Decimal(5e155)
                        },
                        unlocked(){
                                return hasMilestone("n", 6) || hasUpgrade("o", 24)
                        }, //hasUpgrade("c", 24)
                },
                25: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(605) + "'>Carbon X"
                        },
                        description(){
                                if (!shiftDown) return "Halve the Double-exponential divider and add .01 to Polynomial base"
                                a = ""
                                if (hasUpgrade("c", 25)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.c.upgrades[25].cost, player.c.points, tmp.c.getResetGain, tmp.c.getLossRate)
                        },
                        cost() {
                                return player.hardMode ? new Decimal(6.1e220) : new Decimal(5e220)
                        },
                        unlocked(){
                                return hasMilestone("n", 6) || hasUpgrade("o", 25)
                        }, //hasUpgrade("c", 25)
                },
                31: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(605) + "'>Carbon XI"
                        },
                        description(){
                                let a = "Square base Nitrogen gain"
                                return a
                        },
                        cost() {
                                return Decimal.pow(10, 69000)
                        },
                        unlocked(){
                                return hasUpgrade("o", 32)
                        }, // hasUpgrade("c", 31)
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
                                                return "You are losing " + format(tmp.c.getLossRate.times(100)) + "% of your Carbon per second"
                                        },
                                ],

                                "blank", 
                                ["upgrades", [1,2,3,4,5,6,7]]],
                        unlocked(){
                                return true
                        },
                },
                /*
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
                                ["upgrades", [2]]
                                ],
                        unlocked(){
                                return hasUpgrade("h", 21)
                        },
                },*/
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
                if (hasUpgrade("n", 11)) ret = ret.pow(1.001)

                if (hasUpgrade("tokens", 52)) ret = ret.times(player.c.points.max(1).pow(.1))

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

                if (hasUpgrade("tokens", 21)) base = base.pow(3)
                if (hasMilestone("tokens", 17)) base = base.pow(3)
                if (hasUpgrade("h", 74)) base = base.pow(2)

                if (base.lt(1)) base = new Decimal(0)

                return base
        },
        getNextAt(){
                return new Decimal(0) //this doesnt matter
        },
        getLossRate() { //oxygen loss
                let ret = new Decimal(.01)

                if (hasUpgrade("h", 81)) ret = ret.times(50)

                return ret.max(.00001)
        }, //oxygen gain
        getGainMult(){
                let x = new Decimal(1)

                if (hasUpgrade("o", 12)) x = x.times(tmp.o.upgrades[12].effect)
                if (hasUpgrade("o", 14)) x = x.times(tmp.o.upgrades[14].effect)
                if (hasUpgrade("h", 63)) x = x.times(tmp.h.upgrades[63].effect)
                x = x.times(tmp.tokens.buyables[23].effect)
                if (hasMilestone("tokens", 3)) x = x.times(player.ach.achievements.length)
                if (hasUpgrade("h", 71)) {
                        x = x.times(Decimal.pow(player.tokens.coins.points.max(10).log10().min(5), player.h.upgrades.length))
                }
                if (hasUpgrade("tokens", 81)) x = x.times(81)
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
                data.points = getLogisticAmount(data.points, tmp.o.getResetGain, tmp.o.getLossRate, diff)
                /*if (hasUpgrade("h", 21)) deut.points = getLogisticAmount(deut.points, 
                                                                         tmp.h.deuterium.getResetGain, 
                                                                         tmp.h.deuterium.getLossRate, 
                                                                         diff)*/
                

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
                rows: 1000,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(30) + "'>Oxygen I"
                        },
                        description(){
                                if (!shiftDown) return "Begin Production of Oxygen, but vastly increase the cost of Carbon I"
                                a = "(log2(log2(Life Points))-9)^2<br>*multipliers"
                                if (hasUpgrade("tokens", 21)) a = a.replace("^2", "^6")
                                if (hasMilestone("tokens", 17)) a = a.replace("^6", "^18")
                                if (hasUpgrade("h", 74)) a = "(log2(log2(Life Points)))^36<br>*multipliers"
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
                                return "<bdi style='color: #" + getUndulatingColor(31) + "'>Oxygen II"
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
                                return "<bdi style='color: #" + getUndulatingColor(32) + "'>Oxygen III"
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
                                return "<bdi style='color: #" + getUndulatingColor(33) + "'>Oxygen IV"
                        },
                        description(){
                                if (!shiftDown) return "ln(Oxygen) multiplies Oxygen gain"
                                a = "ln(Oxygen)"
                                if (hasUpgrade("o", 15)) a = "(ln(Oxygen))^2"
                                if (hasMilestone("tokens", 13)) a = a.replace("^2", "^4")
                                if (hasUpgrade("h", 81)) a = a.replace("^4", "^8")
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
                                return "<bdi style='color: #" + getUndulatingColor(34) + "'>Oxygen V"
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
                                if (hasUpgrade("tokens", 11)) exp = exp.plus(3)
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
                                return "<bdi style='color: #" + getUndulatingColor(50) + "'>Oxygen VI"
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
                                return "<bdi style='color: #" + getUndulatingColor(51) + "'>Oxygen VII"
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
                                return "<bdi style='color: #" + getUndulatingColor(52) + "'>Oxygen VIII"
                        },
                        description(){
                                if (!shiftDown) return "<bdi style='font-size: 80%'>Multiply Near-ultraviolet base by log10(Life Points) and Infrared and Visible effects are raised to [tokens]^3"
                                let a = "log10(Life Points)"
                                if (hasUpgrade("o", 23)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.o.upgrades[23].cost, player.o.points, tmp.o.getResetGain, tmp.o.getLossRate)
                        },
                        cost:() => new Decimal(5e47),
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
                                return "<bdi style='color: #" + getUndulatingColor(53) + "'>Oxygen IX"
                        },
                        description(){
                                if (!shiftDown) return "Multiply Radio Wave base by log10(Life Points) and square it"
                                let a = "log10(Life Points)"
                                if (hasUpgrade("o", 24)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.o.upgrades[24].cost, player.o.points, tmp.o.getResetGain, tmp.o.getLossRate)
                        },
                        cost:() => new Decimal(5e156),
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
                                return "<bdi style='color: #" + getUndulatingColor(54) + "'>Oxygen X"
                        },
                        description(){
                                if (!shiftDown) return "Multiply and the exponentiate X-Ray base by the number of upgrades*pi"
                                let a = ""
                                if (hasUpgrade("o", 25)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.o.upgrades[25].cost, player.o.points, tmp.o.getResetGain, tmp.o.getLossRate)
                        },
                        cost:() => new Decimal(1e210),
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
                                return "<bdi style='color: #" + getUndulatingColor(54) + "'>Oxygen XI"
                        },
                        description(){
                                let a = "C Point gain 9's log10 becomes a ln"
                                return a 
                        },
                        cost:() => new Decimal(2048),
                        currencyLocation:() => player.n,
                        currencyInternalName:() => "points",
                        currencyDisplayName:() => "Nitrogen",
                        unlocked(){
                                return hasUpgrade("n", 25)
                        }, //hasUpgrade("o", 31)
                },
                32: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(54) + "'>Oxygen XII"
                        },
                        description(){
                                let a = "Add .08 to color gain exponent"
                                return a 
                        },
                        cost:() => Decimal.pow(10, 310400),
                        unlocked(){
                                return hasUpgrade("o", 31)
                        }, // hasUpgrade("o", 32)
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
                if (hasUpgrade("c", 31)) ret = ret.times(2)

                return ret
        },
        getBaseGain(){
                let pts = player.points
                if (player.points.lt(10)) return new Decimal(0)

                let init = pts.log10().div(105)
                let exp = tmp.n.getGainExp

                if (init.lt(1)) return new Decimal(0)

                let base = init.log(2).sub(19).pow(exp)

                if (base.lt(1)) base = new Decimal(0)

                return base
        },
        getNextAt(){
                let curr = tmp.n.getResetGain
                let v1 = curr.plus(1).div(tmp.n.getGainMult)
                let v2 = v1.root(tmp.n.getGainExp).plus(19)
                let v3 = Decimal.pow(2, v2)
                let v4 = v3.times(105)
                let v5 = Decimal.pow(10, v4)
                return v5
        },
        getGainMult(){//nitrogen gain
                let x = new Decimal(1)

                if (hasUpgrade("n", 24)) x = x.times(tmp.n.upgrades[24].effect)

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
                        data.points = data.points.plus(tmp.n.getResetGain.times(diff))
                        data.total = data.total.plus(tmp.n.getResetGain.times(diff))
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
                                showTab("n")
                        }
                },
                {key: "Control+N", description: "Control+N: Reset for Nitrogen", onPress(){
                                if (canReset("n")) doReset("n")
                        }
                },
        ],
        layerShown(){return hasUpgrade("mini", 45) || player.n.best.gt(0)},
        prestigeButtonText(){
                let gain = tmp.n.getResetGain
                let nextAt = tmp.n.getNextAt
                if (gain.eq(0)) {
                        let a = "You cannot reset for Nitrogen, you need<br>"
                        let b = format(nextAt) + " Life Points for the first"
                }
                let amt = "You can reset for <br>" + formatWhole(tmp.n.getResetGain) + " Nitrogen"
                let nxt = ""
                if (gain.lt(1000)) nxt = "<br>You need " + format(nextAt) + "<br>Life Points for the next"
                return amt + nxt
        },
        canReset(){
                return !hasMilestone("n", 13) && tmp.n.getResetGain.gt(0) && hasUpgrade("mini", 45)
        },
        upgrades: {
                rows: 1000,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(30) + "'>Nitrogen I"
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
                                return "<bdi style='color: #" + getUndulatingColor(31) + "'>Nitrogen II"
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
                                return "<bdi style='color: #" + getUndulatingColor(31) + "'>Nitrogen III"
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
                                return "<bdi style='color: #" + getUndulatingColor(31) + "'>Nitrogen IV"
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
                                return "<bdi style='color: #" + getUndulatingColor(31) + "'>Nitrogen V"
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
                                return "<bdi style='color: #" + getUndulatingColor(32) + "'>Nitrogen VI"
                        },
                        description(){
                                let a = "Each upgrade adds .001 to Exponential base"
                                return a
                        },
                        cost:() => new Decimal(2),
                        unlocked(){
                                return hasUpgrade("n", 11) && hasUpgrade("n", 12) && hasUpgrade("n", 13) && hasUpgrade("n", 14) && hasUpgrade("n", 15)
                        }, // hasUpgrade("n", 21)
                },
                22: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(32) + "'>Nitrogen VII"
                        },
                        description(){
                                let a = "Keep the first row of Oxygen and Carbon upgrades upon Nitrogen reset and each upgrade raises C point gain ^1.0002"
                                return a
                        },
                        cost:() => new Decimal(3),
                        unlocked(){
                                return hasUpgrade("n", 21) 
                        }, // hasUpgrade("n", 22)
                },
                23: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(32) + "'>Nitrogen VIII"
                        },
                        description(){
                                let a = "Per upgrade multiply C Point and Carbon gain by best Nitrogen<br>Currently: "
                                let b = format(tmp.n.upgrades[23].effect)
                                return a + b
                        },
                        cost:() => new Decimal(20),
                        effect(){
                                return player.n.best.max(1).pow(player.n.upgrades.length)
                        },
                        unlocked(){
                                return hasMilestone("n", 11) || player.n.best.gt(19) 
                        }, // hasUpgrade("n", 23)
                },
                24: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(32) + "'>Nitrogen IX"
                        },
                        description(){
                                let a = "Token cost exponent is .55 and ln(Nitrogen) multiplies Nitrogen<br>"
                                let b = "Currently: " + format(tmp.n.upgrades[24].effect)
                                return a + b
                        },
                        cost:() => new Decimal(25),
                        effect(){
                                return player.n.points.max(1).ln().max(1)
                        },
                        unlocked(){
                                return hasUpgrade("n", 23)
                        }, // hasUpgrade("n", 24)
                },
                25: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(32) + "'>Nitrogen X"
                        },
                        description(){
                                let a = "Double-exponential divider is 1 and raise Nitrogen effect to the number of upgrades"
                                return a
                        },
                        cost:() => new Decimal(100),
                        effect(){
                                return player.n.points.max(1).ln().max(1)
                        },
                        unlocked(){
                                return hasUpgrade("n", 24)
                        }, // hasUpgrade("n", 25)
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
                                let b = "Currently: " + format(tmp.n.milestones[1].effect)
                                if (false && shiftDown) {
                                        let formula = "Formula: idk"
                                        return a + formula
                                }
                                return a // b
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
                                let b = "Currently: " + format(tmp.n.milestones[2].effect)
                                if (false && shiftDown) {
                                        let formula = "Formula: idk"
                                        return a + formula
                                }
                                return a // b
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
                                let b = "Currently: " + format(tmp.n.milestones[2].effect)
                                if (false && shiftDown) {
                                        let formula = "Formula: idk"
                                        return a + formula
                                }
                                return a // b
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
                                let b = "Currently: " + format(tmp.n.milestones[2].effect)
                                if (false && shiftDown) {
                                        let formula = "Formula: idk"
                                        return a + formula
                                }
                                return a // b
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
                                let a = "Reward: Keep Cookie, here..., coin upgrades are always possible to buy, and tokens do not reset Oxygen upgrades.<br>"
                                let b = "Currently: " + format(tmp.n.milestones[2].effect)
                                if (false && shiftDown) {
                                        let formula = "Formula: idk"
                                        return a + formula
                                }
                                return a // b
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
                                let a = "Reward: Keep Carbon and Nitrogen upgrades unlocked and tokens do not reset Carbon upgrades.<br>"
                                let b = "Currently: " + format(tmp.n.milestones[2].effect)
                                if (false && shiftDown) {
                                        let formula = "Formula: idk"
                                        return a + formula
                                }
                                return a // b
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
                                let b = "Currently: " + format(tmp.n.milestones[2].effect)
                                if (false && shiftDown) {
                                        let formula = "Formula: idk"
                                        return a + formula
                                }
                                return a // b
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
                                let b = "Currently: " + format(tmp.n.milestones[2].effect)
                                if (false && shiftDown) {
                                        let formula = "Formula: idk"
                                        return a + formula
                                }
                                return a // b
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
                                let b = "Currently: " + format(tmp.n.milestones[2].effect)
                                if (false && shiftDown) {
                                        let formula = "Formula: idk"
                                        return a + formula
                                }
                                return a // b
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
                                let b = "Currently: " + format(tmp.n.milestones[2].effect)
                                if (false && shiftDown) {
                                        let formula = "Formula: idk"
                                        return a + formula
                                }
                                return a // b
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
                                let b = "Currently: " + format(tmp.n.milestones[2].effect)
                                if (false && shiftDown) {
                                        let formula = "Formula: idk"
                                        return a + formula
                                }
                                return a // b
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
                                let m = player.hardMode ? 5 : 1
                                return Decimal.pow(2, 9).times(m)
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
                                                if (hasMilestone("n", 13)) return "You are gaining " + format(tmp.n.getResetGain) + " Nitrogen per second"
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
                        if (hasMilestone("n", 7)) rem = rem.slice(player.n.times)
                        if (hasMilestone("n", 3)) rem = filterOut(rem, [12])
                        if (hasMilestone("n", 4)) rem = filterOut(rem, [22])
                        if (hasMilestone("n", 5)) rem = filterOut(rem, [43])
                        data1.upgrades = filterOut(data1.upgrades, rem) // 3b
                }

                // 4: Tokens
                if (!false){
                        let starting = new Decimal(0)
                        if (hasMilestone("n", 12)) starting = new Decimal(50)
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
                        // hasMilestone("n", 2)
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
                unlocked: true,
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
                autobuytokens: false,
                autobuyradio: false,
        }},
        color: "#7D5D58",
        branches: [],
        requires: new Decimal(0),
        resource: "Minigames completed",
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
                if (hasUpgrade("h", 51) || player.subtabs.mini.mainTabs == "B" && tmp.mini.tabFormat.B.unlocked) {
                        bpts.points = bpts.points.plus(tmp.mini.b_points.getResetGain.times(diff))
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

                        // extras[11] = extras[11].plus(extras[21].root(2).div(10).times(Decimal.pow(2, lvls[21])))
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
                                

                                let max = new Decimal(1)
                                if (hasMilestone("tokens", 3)) max = max.times(10)
                                if (hasMilestone("tokens", 13)) max = max.times(5)
                                if (hasMilestone("n", 1)) max = max.times(5)
                                if (hasMilestone("n", 2)) max = max.times(4)


                                for (i = 0; i < list1.length; i++){
                                        let id = list1[i]
                                        if (!tmp.mini.buyables[id].unlocked) continue
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

                                let list2 = []
                                if (hasUpgrade("mini", 22)) list2 = [ 71,  72,  73,  81,  82, 
                                                                      83,  91,  92,  93, 101,
                                                                     102, 103, 111, 112, 113,
                                                                     ].concat(list1)

                                let bulk = new Decimal(1)
                                if (hasUpgrade("mini", 41)) bulk = bulk.times(5)
                                if (hasUpgrade("mini", 44)) bulk = bulk.times(2)
                                if (hasMilestone("n", 2)) bulk = bulk.times(5)
                                if (hasMilestone("n", 4)) bulk = bulk.times(4)
                                // other things
                                bulk = bulk.sub(1)

                                for (i = 0; i < list2.length; i++){
                                        let id = list2[i]
                                        if (!tmp.mini.buyables[id].unlocked) continue
                                        if (!hasMilestone("n", 8) && getBuyableAmount("mini", id).eq(0)) continue
                                        if (tmp.mini.buyables[id].canAfford) {
                                                layers.mini.buyables[id].buy()
                                                if (bulk.eq(0)) continue
                                                if (id == 71) continue // cant be bulked
                                                let maxAfford = tmp.mini.buyables[id].maxAfford
                                                let curr = getBuyableAmount("mini", id)
                                                let add = maxAfford.sub(curr).max(0).min(bulk)
                                                player.mini.buyables[id] = player.mini.buyables[id].plus(add)
                                                if (!hasUpgrade("tokens", 95)) break
                                        }
                                }
                        }
                } else {
                        data.autotime = 0
                }

                if (!tmp.mini.tabFormat.C.unlocked) player.mini.c_points.lastRollTime = new Date().getTime()
                if (hasUpgrade("mini", 12)) {
                        //new Date().getTime() - player.mini.c_points.lastRollTime 
                        //>= 1000 * tmp.mini.upgrades[12].timeNeeded
                        let timeSinceLast = new Date().getTime() - player.mini.c_points.lastRollTime 
                        if (timeSinceLast >= 1000 * tmp.mini.upgrades[12].timeNeeded) {
                                layers.mini.clickables[41].onClick()
                        }
                }
                if (player.tokens.autobuytokens && hasMilestone("n", 4)) {
                        // autobuy tokens
                        if (canReset("tokens")) doReset("tokens")
                }
                if (player.tokens.autobuyradio && hasMilestone("n", 7)) {
                        if (tmp.tokens.buyables[11].canAfford) layers.tokens.buyables[11].buy()
                }
        },
        row: "side",
        hotkeys: [{key: "shift+@", description: "Shift+2: Go to minigames", 
                        onPress(){
                                player.tab = "mini"
                        }
                },
                {key: "shift+A", description: "Shift+A: Go to A", 
                        onPress(){
                                player.tab = "mini"
                                player.subtabs.mini.mainTabs = "A"
                        }
                },
                {key: "shift+B", description: "Shift+B: Go to B", 
                        onPress(){
                                player.tab = "mini"
                                player.subtabs.mini.mainTabs = "B"
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
        a_points: {
                getGainMult(){ // apoint gain a point gain
                        let ret = new Decimal(1)

                        if (player.hardMode) ret = ret.div(100)
                        if (hasUpgrade("h", 51)) ret = ret.times(1e5)

                        ret = ret.times(tmp.mini.buyables[12].effect)
                        ret = ret.times(tmp.mini.buyables[62].effect)
                        ret = ret.times(tmp.mini.buyables[51].effect)
                        ret = ret.times(tmp.tokens.buyables[31].effect)
                        if (hasMilestone("n", 3)) ret = ret.times(100)
                        if (hasUpgrade("mini", 45)) ret = ret.times(player.mini.c_points.points.max(1))

                        return ret
                },
                getResetGain(){
                        let apts = player.mini.a_points
                        let extras = apts.extras
                        let lvls = player.mini.buyables
                        let order = [11,12,13  ,23,63,62  ,61,21]
                        let a = new Decimal(1)
                        for (i = 0; i < 8; i++){
                                a = a.times(extras[order[i]].plus(1))
                        }
                        let ret = a.sub(1).times(tmp.mini.a_points.getGainMult)

                        ret = ret.pow(tmp.tokens.buyables[61].effect)
                        if (hasUpgrade("n", 11)) ret = ret.pow(1.001)
                        if (hasUpgrade("n", 12)) ret = ret.pow(1.02)

                        if (hasMilestone("tokens", 9)) ret = ret.times(player.mini.b_points.points.plus(1).pow(.1))

                        return ret
                },
                getColorGainExp(){ // color gain exponent color gain exp
                        let exp = hasUpgrade("h", 54) ? .52 : .5
                        if (hasUpgrade("h", 55)) exp += .004
                        if (hasUpgrade("c", 12)) exp += tmp.c.upgrades[12].effect.toNumber()
                        exp += tmp.tokens.buyables[63].effect.toNumber()
                        if (hasMilestone("tokens", 4)) exp += .05
                        if (hasUpgrade("o", 32)) exp += .08

                        return exp
                },
                colorGainMult(){ // color gain
                        let ret = new Decimal(1)

                        ret = ret.times(tmp.tokens.buyables[33].effect)
                        ret = ret.times(tmp.n.effect)

                        return ret
                },
        },
        b_points: {
                getResetGain(){ // bpoint gain b point gain
                        let ret = new Decimal(1)

                        if (player.hardMode) ret = ret.div(3)

                        ret = ret.times(tmp.mini.buyables[31].effect)
                        ret = ret.times(tmp.mini.buyables[32].effect)
                        ret = ret.times(tmp.mini.buyables[41].effect)
                        ret = ret.times(tmp.mini.buyables[42].effect)
                        ret = ret.times(tmp.tokens.buyables[32].effect)
                        if (hasUpgrade("o", 21)) ret = ret.times(player.h.points.max(1))
                        if (hasUpgrade("mini", 42)) ret = ret.times(player.mini.c_points.points.max(1))
                        if (hasMilestone("n", 3)) ret = ret.times(100)

                        if (hasUpgrade("o", 13)) ret = ret.pow(tmp.o.upgrades[13].effect)
                        ret = ret.pow(tmp.tokens.buyables[62].effect)
                        if (hasUpgrade("n", 11)) ret = ret.pow(1.001)
                        if (hasUpgrade("n", 13)) ret = ret.pow(1.02)

                        if (hasMilestone("tokens", 8)) ret = ret.times(player.mini.a_points.points.plus(1).pow(.1))

                        return ret
                },
        },
        c_points: {
                getGainMult(){ // cpoint gain c point gain cpt gain
                        let ret = new Decimal(1)

                        if (player.hardMode) ret = ret.div(4)
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
                        if (hasMilestone("n", 1)) ret = ret.times(Decimal.pow(10, player.n.milestones.length ** 2))
                        if (hasMilestone("n", 3)) ret = ret.times(100)
                        if (hasUpgrade("mini", 13))   ret = ret.times(tmp.tokens.buyables[23].effect.max(10).log10())
                        if (hasUpgrade("mini", 14))   ret = ret.times(player.points.max(10).log10())
                        if (hasUpgrade("mini", 15))   ret = ret.times(player.mini.b_points.points.max(10).log10())
                        if (hasUpgrade("mini", 22))   ret = ret.times(player.h.points.max(10).log10())
                        if (hasUpgrade("mini", 32))   ret = ret.times(player.mini.c_points.points.max(1).pow(.01))
                        if (hasUpgrade("mini", 34))   ret = ret.times(player.mini.c_points.points.max(1).pow(.01))
                        if (hasUpgrade("tokens", 92)) ret = ret.times(player.mini.c_points.points.max(1).pow(.01))
                        if (hasUpgrade("mini", 35))   ret = ret.times(Decimal.pow(50, player.mini.upgrades.length))
                        if (hasUpgrade("n", 23))      ret = ret.times(tmp.n.upgrades[23].effect)

                        if (hasUpgrade("n", 11)) ret = ret.pow(1.001)
                        if (hasUpgrade("n", 22)) ret = ret.pow(Decimal.pow(1.0002, player.n.upgrades.length))

                        return ret
                },
        },
        buyables: {
                rows: 15,
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
                                let eformula = format(tmp.mini.buyables[11].base) + "^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                        cost: () => new Decimal(1e21).times(Decimal.pow(1e9, Decimal.pow(getBuyableAmount("mini", 12), 1.1))),
                        canAfford:() => player.mini.a_points.points.gte(tmp.mini.buyables[12].cost) && getBuyableAmount("mini", 12).lt(5000),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[12] = player.mini.buyables[12].plus(1)
                                player.mini.a_points.points = player.mini.a_points.points.sub(tmp.mini.buyables[12].cost)
                        },
                        maxAfford(){
                                let div = new Decimal(1e21)
                                let base = 1e9
                                let exp = 1.1
                                let pts = player.mini.a_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1).min(5000)
                        },
                        base(){
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
                                let eformula = format(tmp.mini.buyables[12].base) + "^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
                                let ef1 = "<b><h2>Effect formula</h2>:<br>"
                                let ef2 = "</b><br>"
                                let allEff = ef1 + eformula + ef2

                                if (!shiftDown) {
                                        let end = "Shift to see details"
                                        let start = lvl + amt + eff1 + eff2 + cost
                                        return "<br>" + start + end
                                }

                                let cost1 = "<b><h2>Cost formula</h2>:<br>"
                                let cost2 = "(1e21)*(1e9^x<sup>1.1</sup>)" 
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
                                let eformula = format(tmp.mini.buyables[13].base) + "^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                        base(){
                                let ret = new Decimal(2)
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
                                let eformula = "2*x" //+ getBuyableEffectString(layer, id)
                                if (hasUpgrade("h", 53)) eformula = "2*x*ln(x)"
                                if (hasUpgrade("h", 64)) eformula = "2*x*(ln(x))^2"
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                                let eformula = "x" //+ getBuyableEffectString(layer, id)
                                if (hasUpgrade("h", 64)) eformula = "log10(x)*x<br>" + format(getBuyableBase("mini", 23)) + "*x"
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                                let eformula = format(tmp.mini.buyables[61].base) + "^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                                let eformula = "ln(10+[A Points])^x<br>" + format(tmp.mini.buyables[62].base) + "^x" //+ getBuyableEffectString(layer, id)
                                if (hasUpgrade("c", 14)) eformula = eformula.replace("ln", "log2")
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                                let eformula = "2^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                                return "A Point production is the product of <br><b>(1+[amounts])</b><br> over all colors minus 1<br>Currently: " + format(tmp.mini.a_points.getResetGain) + "/sec"
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
                                let eformula = "log10([Life Points] + 10)^x<br>" + format(getBuyableBase("mini", 31)) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let eformula = "log2([B Points] + 10)^x<br>" + format(getBuyableBase("mini", 32)) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let eformula = ".1*x" //+ getBuyableEffectString(layer, id)
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
                                let eformula = "<bdi style='color:#CC0033'>B</bdi>^x<br>" + format(getBuyableBase("mini", 41)) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let eformula = "ln(log8([B points]))^x<br>" + format(getBuyableBase("mini", 42)) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let eformula = "ln(1.2+x/100)*x<br>" + format(getBuyableBase("mini", 43), 3) + "*x" //+ getBuyableEffectString(layer, id)
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
                                return player.mini.buyables[31].gte(2000) //worst year?
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
                                let eformula = "ln(ln([B Points]))^x<br>" + format(getBuyableBase("mini", 51), 3) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let cost2 = "(1e5600)*(1e8^x<sup>1.3</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                52: {
                        title: "B32", 
                        cost:() => new Decimal("1e18400").times(Decimal.pow(1e4, Decimal.pow(nerfBminigameBuyableAmounts(getBuyableAmount("mini", 52)), 1.1))),
                        canAfford:() => player.mini.b_points.points.gte(tmp.mini.buyables[52].cost) && getBuyableAmount("mini", 52).lt(5000),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[52] = player.mini.buyables[52].plus(1)
                                player.mini.b_points.points = player.mini.b_points.points.sub(tmp.mini.buyables[52].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e18400")
                                let base = 1e4
                                let exp = 1.1
                                let pts = player.mini.b_points.points
                                if (pts.lt(div)) return new Decimal(0)
                                return pts.div(div).log(base).root(exp).floor().plus(1).min(5000)
                        },
                        unlocked(){
                                return player.mini.buyables[33].gte(2008) //worst year?
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
                                let eformula = ".01*x" //+ getBuyableEffectString(layer, id)
                                if (hasUpgrade("c", 13)) eformula = ".01*ln(e+sqrt(x)/10)*x<br>" + format(getBuyableBase("mini", 52), 4) + "*x"
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
                                let cost2 = "(1e18400)*(1e4^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                53: {
                        title: "B33", 
                        cost:() => new Decimal("1e21000").times(Decimal.pow(1e3, Decimal.pow(nerfBminigameBuyableAmounts(getBuyableAmount("mini", 53)), 1.2))),
                        canAfford:() => player.mini.b_points.points.gte(tmp.mini.buyables[53].cost) && getBuyableAmount("mini", 53).lt(5000),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[53] = player.mini.buyables[53].plus(1)
                                player.mini.b_points.points = player.mini.b_points.points.sub(tmp.mini.buyables[53].cost)
                        },
                        maxAfford(){
                                let div = new Decimal("1e21000")
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
                                let eformula = "(1+x/30)*x<br>" + format(getBuyableBase("mini", 53)) + "*x" //+ getBuyableEffectString(layer, id)
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
                                let cost2 = "(1e21000)*(1e3^x<sup>1.2</sup>)" 
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
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[72]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[72].effect) + " to C Point</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 72)) + " C Points</b><br>"
                                let init = "log10(C Points)<sup>x</sup>"
                                if (hasUpgrade("tokens", 91)) init = "ln(C Points)<sup>x</sup>"
                                let eformula = init + "<br>" + format(getBuyableBase("mini", 72)) + "^x" //+ getBuyableEffectString(layer, id)
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
                                return player.tokens.total.max(1).min(100)
                        },
                        effect(){
                                return tmp.mini.buyables[73].base.pow(player.mini.buyables[73])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[73]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[73].effect) + " to C Point</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 73)) + " C Points</b><br>"
                                let eformula = "min(100, tokens)<sup>x</sup><br>" + format(getBuyableBase("mini", 73)) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let ret = new Decimal(.1)
                                if (hasUpgrade("mini", 21)) ret = ret.plus(.1)
                                if (hasUpgrade("mini", 24)) ret = ret.plus(.05)
                                
                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[81].base.times(player.mini.buyables[81])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[81]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[81].effect) + " to <bdi style='color:#CC0033'>C</bdi></b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 81)) + " C Points</b><br>"
                                let eformula = format(getBuyableBase("mini", 81)) + "*x" //+ getBuyableEffectString(layer, id)
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
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[82]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[82].effect) + " to C Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 82)) + " C Points</b><br>"
                                let baseStr = "<bdi style='color:#CC0033'>C</bdi>"
                                if (hasUpgrade("mini", 43)) baseStr = "(" + baseStr + " + x)"
                                let eformula = baseStr + "<sup>x</sup><br>" + format(getBuyableBase("mini", 82)) + "^x" //+ getBuyableEffectString(layer, id)
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
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[83]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[83].effect) + " to C Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 83)) + " C Points</b><br>"
                                let eformula = "(log10(Oxygen))<sup>x</sup><br>" + format(getBuyableBase("mini", 83)) + "^x" //+ getBuyableEffectString(layer, id)
                                if (hasUpgrade("mini", 23)) eformula = eformula.replace("log10", "ln")
                                if (hasMilestone("tokens", 24)) eformula = eformula.replace("ln", "log2")
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
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[91]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[91].effect) + " to <bdi style='color:#CC0033'>C</bdi></b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 91)) + " C Points</b><br>"
                                let eformula = "ln(1.2+x/100)*x<br>" + format(getBuyableBase("mini", 91)) + "*x" //+ getBuyableEffectString(layer, id)
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
                                let ret = player.points.max(10).log10()

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[92].base.pow(player.mini.buyables[92])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[92]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[92].effect) + " to C Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 92)) + " C Points</b><br>"
                                let eformula = "(log10(Life Points))<sup>x</sup><br>" + format(getBuyableBase("mini", 92)) + "^x"
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

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[102].base.pow(player.mini.buyables[102])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[102]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[102].effect) + " to C Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 102)) + " C Points</b><br>"
                                let eformula = "(log10(Carbon))<sup>x</sup><br>" + format(getBuyableBase("mini", 102)) + "^x"
                                if (hasUpgrade("mini", 41)) eformula = eformula.replace("log10", "log2")
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
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[111]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: +"
                                let eff2 = format(tmp.mini.buyables[111].effect) + " to <bdi style='color:#CC0033'>C</bdi></b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 111)) + " C Points</b><br>"
                                let eformula = "(1+x/500)*x<br>" + format(getBuyableBase("mini", 111),3) + "*x" //+ getBuyableEffectString(layer, id)
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

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[112].base.pow(player.mini.buyables[112])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[112]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[112].effect) + " to C Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 112)) + " C Points</b><br>"
                                let eformula = "(log10(Hydrogen))<sup>x</sup><br>" + format(getBuyableBase("mini", 112)) + "^x"
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

                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[113].base.pow(player.mini.buyables[113])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "C") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let amt = "<b><h2>Amount</h2>: " + formatWhole(player.mini.buyables[113]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[113].effect) + " to C Point gain</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 113)) + " C Points</b><br>"
                                let eformula = "(log10(B Points))<sup>x</sup><br>" + format(getBuyableBase("mini", 113)) + "^x"
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
        },
        clickables: {
                rows: 4,
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
                                        return "Have not rolled this slot yet" //get the character
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
                                        return "Have not rolled this slot yet" //get the character
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
                                        return "Have not rolled this slot yet" //get the character
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
                                        return "Have not rolled this slot yet" //get the character
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
                                        return "Have not rolled this slot yet" //get the character
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
                                        return "Have not rolled this slot yet" //get the character
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
                                        return "Have not rolled this slot yet" //get the character
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
                                        return "Have not rolled this slot yet" //get the character
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
                                        return "Have not rolled this slot yet" //get the character
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
                                        return "Have not rolled this slot yet" //get the character
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
                                        return "Have not rolled this slot yet" //get the character
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
                                        return "Have not rolled this slot yet" //get the character
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
                                        return "Have not rolled this slot yet" //get the character
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
                                        return "Have not rolled this slot yet" //get the character
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
                                        return "Have not rolled this slot yet" //get the character
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
                                if (hasUpgrade("mini", 34)) ret = 3
                                if (hasMilestone("tokens", 26)) ret = 1
                                if (hasUpgrade("tokens", 92)) ret = .25
                                if (hasUpgrade("mini", 42)) ret = .1
                                if (hasUpgrade("mini", 43)) ret = .05
                                return ret
                        },
                        display(){
                                let last = player.mini.c_points.lastRollTime
                                let now = new Date().getTime()
                                let rem = (now - last)/1000
                                let req = tmp.mini.clickables[41].timeRequired
                                let a = "Time until next spin: " + formatTime(Math.max(0, req-rem)) + "<br>"
                                let b = ""
                                return a + b
                        },
                        unlocked(){
                                return true
                        },
                        canClick(){
                                let req = tmp.mini.clickables[41].timeRequired
                                return new Date().getTime() - player.mini.c_points.lastRollTime >= 1000 * req
                        },
                        onClick(){
                                let data = player.mini.c_points
                                data.lastRollTime = new Date().getTime()
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
        },
        upgrades: {
                rows: 1000,
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

                                if (hasUpgrade("mini", 14)) ret = 9
                                if (hasUpgrade("mini", 15)) ret = 8
                                if (hasUpgrade("mini", 21)) ret = 7
                                if (hasUpgrade("mini", 22)) ret = 6
                                if (hasUpgrade("mini", 23)) ret = 5
                                if (hasMilestone("n", 3)) ret = 5
                                if (hasMilestone("tokens", 25)) ret = 3
                                if (hasMilestone("tokens", 26)) ret = 1
                                if (hasUpgrade("tokens", 92)) ret = .25
                                if (hasUpgrade("mini", 42)) ret = .1
                                if (hasUpgrade("mini", 43)) ret = .05

                                return ret
                        },
                        description(){
                                if (shiftDown) return "Warning! May cause lag if this tab is not active."
                                let timeNeed = tmp.mini.upgrades[12].timeNeeded
                                let a = "Automatically gamble if you have not gambled in the last "
                                a += formatWhole(timeNeed) + " seconds<br>"

                                let last = player.mini.c_points.lastRollTime
                                let now = new Date().getTime()

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
                        cost:() => Decimal.pow(10, 97593),
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
                        cost:() => Decimal.pow(10, 128833),
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
        },
        microtabs: {
                c_content: {
                        "Upgrades": {
                                content: [
                                        ["upgrades", [1,2,3,4]],
                                        ["display-text", function(){
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
                                                let data = tmp.mini.buyables
                                                let a = data[71].cost
                                                let num = 71
                                                let ids = [ 72,  73,  81,  82,  83,
                                                            91,  92,  93, 101, 102,
                                                           103, 111, 112, 113, ]
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
                                                if (pts.eq(0)) {
                                                        end = "0 points."
                                                } else if (pts.gt(a)) {
                                                        end = format(pts.div(a)) + " times more points."
                                                } else {
                                                        end = format(a.div(pts)) + " times less points."
                                                }
                                                return start+mid+end
                                        }],
                                        ["buyables", [7,8,9,10,11,12]]
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
                                        if (hasUpgrade("h", 51)) return ""
                                        return "You need to be on this tab to keep this minigame ticking!"
                                }],
                                ["display-text", "Each color produces the next color clockwise!"],
                                ["display-text", function(){
                                        if (!shiftDown) return ""
                                        a = "Formula: sqrt(amt)/20*2^levels*multipliers"
                                        let exp = tmp.mini.a_points.getColorGainExp
                                        if (exp != .5) a = "Formula: ((amt)^" + format(exp, 4) + ")/20*2^levels*multipliers"
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
                                        if (hasUpgrade("h", 51)) {
                                                return hasUpgrade("h", 52) ? "" : "Costs after 1000 are increased (x->x*log(x)/log(1000))"
                                        }
                                        return "You need to be on this tab to keep this minigame ticking!"
                                }],
                                ["display-text", function(){
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
                                        let a = "Each character has a given value, and the more of said character you get,<br> the more powerful its value is."

                                        // loop through all and show values

                                        let b = "<br>Additionally, per set of suits squared, you gain 30x points.<br>Finally, point gain is the product of all above values time multipliers."
                                        if (shiftDown) b += "<br>Multipliers: x" + format(tmp.mini.c_points.getGainMult) + " C Point gain"

                                        return a + b
                                }],
                                ["clickables", [1]],
                                ["microtabs", "c_content"],
                        ],
                        unlocked(){
                                return hasMilestone("tokens", 23) 
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
                                        let c = "<br><br>"
                                        let d = "<br>Press space to get a new word. This is just a minigame :)"
                                        return c + c + c + c + c + c + a + b + d
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
                unlocked: true,
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
                return tmp.tokens.getResetGain.gt(0)
        },
        getNextAt(){
                let log_costs = [  6420,   7587,   7630,   8184,   8314, 
                                   9270,    1e4,  10730,  11160,  12590,
                                  14470,  15200,  15480,  17500,  24000,
                                  30810,  33300,  33500,  42600,  45300,
                                  45800,  50650,  60000,  80750,  88222,
                                  93000,  99790,  114e3, 133540, 134125,
                                 137240, 137820, 141200, 176900, 178250,
                                 205700, 227400, 260200, 297450, 298600,
                                 335080, 336336, 357900, 398888, 405900,
                                 432950, 445250, 462700, 467500, 542000,
                                 692000, 774000, 793000, 1085e3, 1380e3,
                                 1804e3, 1870e3, 1996e3, 2044e3, 2354e3,
                                 3807e3, 4666e3, 5383e3, 9500e3, 9871e3,
                                 11531e3, 13127e3, 13539e3, 14553e3, 15542e3,
                                 16528e3, 20892e3, 22977e3, 28491e3, 34256e3,
                                 60576e3, 91049e3, 11858e4, 12317e4, 13287e4,
                                 13793e4, 18750e4,
                                 ]/*1e6-1,*/
                let add = player.hardMode ? 4 : 0
                let len = log_costs.length

                let getid = player.tokens.total.toNumber()

                if (hasUpgrade("tokens", 73)) getid += -1
                if (getid < 0) return Decimal.pow(10, 5000)

                getid = Math.floor(getid)

                if (getid >= len) return new Decimal("10pt10")
                return Decimal.pow(10, log_costs[getid] + add)
        },
        update(diff){
                let data = player.tokens
                let a = ["11", "12", "13", "21", "22", "23", "31", "32", "33", "41", "42", "43", "51", "52", "53", "61", "62", "63"]
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

                if (hasUpgrade("c", 21)) {
                        //tick coins
                        //first tick gain
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

                        if (hasUpgrade("o", 22)) ret = ret.times(2)
                        if (hasMilestone("tokens", 14)) ret = ret.times(player.tokens.total.max(1))
                        if (hasMilestone("tokens", 16)) ret = ret.times(tmp.tokens.milestones[16].effect)
                        if (hasUpgrade("h", 71)) ret = ret.times(10)
                        if (hasUpgrade("tokens", 81)) ret = ret.times(81)
                        if (hasUpgrade("tokens", 93)) ret = ret.times(81)
                        if (hasMilestone("n", 8)) ret = ret.times(20)
                        if (hasMilestone("n", 2)) ret = ret.times(10)
                        if (player.hardMode) ret = ret.div(3)

                        if (hasUpgrade("n", 11)) ret = ret.pow(1.001)

                        return ret
                },
        },
        row: "side",
        hotkeys: [{key: "shift+#", description: "Shift+3: Go to tokens", 
                        onPress(){
                                player.tab = "tokens"
                        }
                },
                {key: "t", description: "T: Reset for tokens", 
                        onPress(){
                                if (canReset("tokens")) doReset("tokens")
                        }
                },
                {key: "s", description: "S: Sell token buyables (only if on said tab)", 
                        onPress(){
                                if (player.tab == "tokens") {
                                        if (["Flat", "Scaling"].includes(player.subtabs.tokens.mainTabs)) {
                                                layers.tokens.buyables[71].buy()
                                        }
                                }
                                if (player.tab == "tokens") {
                                        if (["Coins"].includes(player.subtabs.tokens.mainTabs)) {
                                                layers.tokens.buyables[81].buy()
                                        }
                                }
                        }
                },
                ],
        layerShown(){return hasUpgrade("h", 65) || player.tokens.total.gt(0) || tmp.n.layerShown},
        prestigeButtonText(){
                return "Reset for a token (" + formatWhole(player.tokens.total.plus(1)) + ")<br>Requires: " + format(tmp.tokens.getNextAt) + " Life Points"
        },
        canReset(){
                return tmp.tokens.getResetGain.gt(0) && hasUpgrade("h", 55)
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
                        if (hasUpgrade("n", 24))      return x.pow(.55).round()
                        if (hasUpgrade("mini", 33))   return x.pow(.6).round()
                        if (hasUpgrade("tokens", 82)) return x.pow(.65).round()
                        if (hasUpgrade("h", 75))      return x.pow(.7).round()
                        if (hasUpgrade("h", 85))      return x.pow(.7).ceil()
                        if (hasUpgrade("h", 84))      return x.pow(.8).ceil()
                        if (hasUpgrade("h", 83))      return x.pow(.9).ceil()
                        if (hasUpgrade("c", 23))      return x
                        return Decimal.pow(2, x)
                },
                costFormulaText(){
                        if (hasUpgrade("n", 24))      return "round(x<sup>.55</sup>)"
                        if (hasUpgrade("mini", 33))   return "round(x<sup>.6</sup>)"
                        if (hasUpgrade("tokens", 82)) return "round(x<sup>.65</sup>)"
                        if (hasUpgrade("h", 75))      return "round(x<sup>.7</sup>)"
                        if (hasUpgrade("h", 85))      return "ceil(x<sup>.7</sup>)"
                        if (hasUpgrade("h", 84))      return "ceil(x<sup>.8</sup>)"
                        if (hasUpgrade("h", 83))      return "ceil(x<sup>.9</sup>)"
                        if (hasUpgrade("c", 23))      return "x"
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
                                if (hasMilestone("tokens", 7)) ret = ret.times(tmp.tokens.milestones[7].effect)
                                if (hasUpgrade("o", 24)) ret = ret.times(player.points.max(1).ln().max(1))
                                
                                if (hasMilestone("tokens", 1)) ret = ret.pow(tmp.tokens.milestones[1].effect)
                                if (hasUpgrade("o", 24)) ret = ret.pow(2)
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
                                let eformula = format(tmp.tokens.buyables[11].base, 3) + "^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                                if (hasMilestone("tokens", 10)) ret = ret.times(tmp.tokens.milestones[10].effect)
                                if (hasUpgrade("h", 82)) {
                                        ret = ret.times(Decimal.pow(1.01, player.tokens.total.times(player.h.upgrades.length)))
                                }
                                if (hasMilestone("tokens", 2)) ret = ret.pow(tmp.tokens.milestones[2].effect)
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
                                let eformula = format(tmp.tokens.buyables[12].base, 3) + "^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                                let eformula = format(tmp.tokens.buyables[13].base, 3) + "^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                                let eformula = format(tmp.tokens.buyables[21].base, 3) + "^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
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

                                if (hasUpgrade("o", 23)) ret = ret.times(tmp.o.upgrades[23].effect)
                                if (hasMilestone("tokens", 15)) ret = ret.times(Decimal.pow(1.2, player.tokens.milestones.length))
                                if (hasUpgrade("h", 72)) ret = ret.times(tmp.h.upgrades[72].effect)
                                if (hasUpgrade("mini", 13)) ret = ret.times(player.mini.c_points.points.max(10).log10())


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
                                let eformula = format(tmp.tokens.buyables[22].base, 3) + "^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                                if (hasUpgrade("tokens", 32)) ret = ret.times(player.tokens.total.max(1))
                                if (hasUpgrade("c", 22)) ret = ret.times(tmp.c.upgrades[22].effect)
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
                                let eformula = format(tmp.tokens.buyables[23].base, 3) + "^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
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

                                if (hasUpgrade("c", 21)) ret = ret.times(tmp.c.upgrades[21].effect)
                                if (hasUpgrade("o", 25)) ret = ret.times(tmp.o.upgrades[25].effect)

                                if (hasMilestone("tokens", 4)) ret = ret.pow(3)
                                if (hasUpgrade("tokens", 41)) ret = ret.pow(2)
                                if (hasUpgrade("o", 25)) ret = ret.pow(tmp.o.upgrades[25].effect)

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
                                let eformula = format(tmp.tokens.buyables[31].base, 3) + "^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                                if (hasUpgrade("o", 22)) ret = ret.times(player.points.plus(10).log10())
                                if (hasMilestone("tokens", 6)) ret = ret.pow(tmp.tokens.milestones[6].effect)
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
                                let eformula = format(tmp.tokens.buyables[32].base, 3) + "^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                                let eformula = format(tmp.tokens.buyables[33].base, 3) + "^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                                let eformula = format(tmp.tokens.buyables[41].base, 3) + "^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                                let eformula = format(tmp.tokens.buyables[42].base, 3) + "^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                                let eformula = format(tmp.tokens.buyables[43].base, 3) + "^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                                let eformula = format(tmp.tokens.buyables[51].base, 3) + "^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                                if (hasUpgrade("n", 14)) ret = ret.plus(.001)
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
                                let eformula = format(tmp.tokens.buyables[52].base, 3) + "^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                                if (hasUpgrade("c", 22)) ret = ret.plus(.01)
                                if (hasUpgrade("c", 25)) ret = ret.plus(.01)
                                if (hasUpgrade("n", 15)) ret = ret.plus(.001)
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
                                let eformula = format(tmp.tokens.buyables[53].base, 3, 3) + "^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                                if (hasMilestone("tokens", 5)) ret = ret.plus(.01)
                                if (hasMilestone("tokens", 21)) ret = ret.plus(.03)
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
                                let eformula = format(tmp.tokens.buyables[61].base, 3) + "^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                                if (hasMilestone("tokens", 5)) ret = ret.plus(.01)
                                if (hasMilestone("tokens", 22)) ret = ret.plus(.03)
                                if (hasUpgrade("n", 21)) ret = ret.plus(.001 * player.n.upgrades.length)
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
                                let eformula = format(tmp.tokens.buyables[62].base, 3) + "^x" //+ getBuyableEffectString(layer, id)
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                                let eformula = ".2-.2/(1+x/20)" //+ getBuyableEffectString(layer, id)
                                if (hasUpgrade("c", 24)) eformula = eformula.replace("20", "10")
                                if (hasUpgrade("c", 25)) eformula = eformula.replace("10", "5")
                                if (hasUpgrade("n", 25)) eformula = eformula.replace("x/5", "x")
                                //if its undefined set it to that
                                //otherwise use normal formula
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
                                player.tokens.buyables = {
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
                                if (hasMilestone("tokens", 18)) keep = keep.concat([42, 61, 62])
                                if (hasUpgrade("mini", 31)) keep = keep.concat([71, 72, 73, 81, 82])
                                if (hasMilestone("tokens", 20)) keep = keep.concat([11, 21, 22, 31, 32, 33, 34, 41, 51, 52])
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
                                return new Decimal(20)
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
                                return a + b
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
                rows: 1000,
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
                        cost:() => new Decimal(70),
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
                        cost:() => new Decimal(70),
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
                                return hasMilestone("n", 5) || hasMilestone("tokens", 18) || hasUpgrade("tokens", 41) && hasUpgrade("tokens", 42)
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
                                return hasMilestone("n", 5) || hasMilestone("tokens", 18) || hasUpgrade("tokens", 41) && hasUpgrade("tokens", 42)
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
                        }, //hasUpgrade("tokens", 82)
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
                                return player.tokens.total.gte(54) || hasMilestone("n", 5)
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
                                return player.tokens.total.gte(56) || hasMilestone("n", 5)
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
                                return player.tokens.total.gte(61) || hasMilestone("n", 5)
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
                                return player.tokens.total.gte(63) || hasMilestone("n", 5)
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
                                return player.tokens.total.gte(64) || hasMilestone("n", 5)
                        }, // hasUpgrade("tokens", 95)
                },
        },
        tabFormat: {
                "Milestones": {
                        content: [
                                ["prestige-button", "", function (){ return false ? {'display': 'none'} : {}}],
                                ["milestones", [1]],// work on this later i guess
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
                },
                "Coins": {
                        content: [
                                ["secondary-display", "coins"],
                                ["display-text", function(){
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
                },
        },
})





