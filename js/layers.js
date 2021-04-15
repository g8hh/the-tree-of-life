function getPointGen() {
	let gain = new Decimal(.1)
        if (hasUpgrade("h", 11)) gain = gain.times(tmp.h.upgrades[11].effect)
        if (hasUpgrade("h", 22)) gain = gain.times(tmp.h.upgrades[22].effect)
        if (hasUpgrade("h", 34)) gain = gain.times(tmp.h.upgrades[13].effect)
        gain = gain.times(tmp.mini.buyables[61].effect)
        if (hasUpgrade("o", 15)) gain = gain.times(tmp.o.upgrades[15].effect)
        if (hasUpgrade("h", 61)) gain = gain.times(tmp.h.upgrades[61].effect)

        gain = gain.times(tmp.tokens.buyables[11].effect)



        if (hasUpgrade("h", 25)) gain = gain.pow(tmp.h.upgrades[25].effect)
        if (hasUpgrade("o", 13)) gain = gain.pow(tmp.o.upgrades[13].effect)
        gain = gain.pow(tmp.tokens.buyables[41].effect)

	return gain
}

function filter(list, keep){
        return list.filter(x => keep.includes(x))
}

function filterOut(list, out){
        return list.filter(x => !out.includes(x))
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

                return ret
        },
        getNextAt(){
                return new Decimal(0) //this doesnt matter
        },
        getLossRate() {
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
                getLossRate() {
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
                getLossRate() {
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
                                return player.h.best.gt(0)
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
                                return hasUpgrade("h", 11)
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
                                return hasUpgrade("h", 12)
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
                                return hasUpgrade("h", 13)
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
                        /*
                        effect(){
                                let ret = new Decimal(player.h.upgrades.length).max(1).ln().max(1)

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "h") return ""
                                if (player.subtabs.h.mainTabs != "Upgrades") return ""
                                return format(tmp.h.upgrades[14].effect)
                        },
                        */
                        unlocked(){
                                return hasUpgrade("h", 14)
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
                                return hasUpgrade("h", 15) && (!hasUpgrade("h", 31) || hasUpgrade("h", 35) || hasUpgrade("h", 25))
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
                                return hasUpgrade("h", 21)
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
                                let ret = player.h.deuterium.best.ln()

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "h") return ""
                                if (player.subtabs.h.mainTabs != "Upgrades" && player.subtabs.h.mainTabs != "Deuterium") return ""
                                return format(tmp.h.upgrades[23].effect)
                        },
                        unlocked(){
                                return hasUpgrade("h", 22)
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
                                return hasUpgrade("h", 23)
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
                                return hasUpgrade("h", 24)
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
                                return hasUpgrade("h", 15) && (!hasUpgrade("h", 21) || hasUpgrade("h", 25) || hasUpgrade("h", 35))
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
                                return hasUpgrade("h", 31) 
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
                                return hasUpgrade("h", 32) 
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
                                return hasUpgrade("h", 33) 
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
                                return hasUpgrade("h", 34) 
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
                                }
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
                                return hasUpgrade("h", 35) && hasUpgrade("h", 25) 
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
                                }
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
                                return hasUpgrade("h", 41)
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
                                return hasUpgrade("h", 42)
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
                                player.tab = "mini"
                                player.subtabs.mini.mainTabs = "A"
                        },
                        unlocked(){
                                return hasUpgrade("h", 43)
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
                                player.tab = "mini"
                                player.subtabs.mini.mainTabs = "B"
                        },
                        unlocked(){
                                return hasUpgrade("h", 43)
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
                                return hasUpgrade("h", 44) && hasUpgrade("h", 45)
                        }, //hasUpgrade("h", 51)
                },
                52: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(21) + "'>Hydrogen XII"
                        },
                        description(){
                                if (!shiftDown) return "The autobuyer can buy A buyables, can bulk 10x and works 10x as fast. Remove the softcap for B buyables"
                                a = ""
                                if (hasUpgrade("h", 52)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[52].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                return player.hardMode ? new Decimal(1e98) : new Decimal(1e80)
                        },
                        unlocked(){
                                return hasUpgrade("h", 51) 
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
                                return hasUpgrade("h", 52) 
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
                                return hasUpgrade("h", 53) 
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
                                return hasUpgrade("h", 54) 
                        }, //hasUpgrade("h", 55)
                },
                61: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(35) + "'>Hydrogen XVI"
                        },
                        description(){
                                if (!shiftDown) return "Per upgrade multiply Life Points by Carbon"
                                a = "Carbon^[upgrades]"
                                if (hasUpgrade("h", 61)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.h.upgrades[61].cost, player.h.points, tmp.h.getResetGain, tmp.h.getLossRate)
                        },
                        cost(){
                                return player.hardMode ? Decimal.pow(2, 2100) : Decimal.pow(2, 2048)
                        },
                        effect(){
                                let b = player.c.points.max(1)

                                let ret = b.pow(player.h.upgrades.length)
                                
                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "h") return ""
                                if (player.subtabs.h.mainTabs != "Upgrades") return ""
                                return format(tmp.h.upgrades[61].effect)
                        },
                        unlocked(){
                                return hasUpgrade("o", 15) && hasUpgrade("c", 15) 
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
                                return hasUpgrade("h", 61)
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
                                return hasUpgrade("h", 62)
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
                                return hasUpgrade("h", 63)
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
                                return hasUpgrade("h", 64)
                        }, //hasUpgrade("h", 65)
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
                                ["upgrades", [1,2,3,4,5,6,7]]],
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
                                ["upgrades", [2]]
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
                                ["upgrades", [3]]
                                ],
                        unlocked(){
                                return hasUpgrade("h", 31)
                        },
                },
                /*
                "Buyables": {
                        content: ["main-display",
                                ["display-text",
                                        function() {
                                                if (player.tab != "a") return ""
                                                if (player.subtabs.a.mainTabs != "Buyables") return ""
                                                if (!showCurrency(player.a.points)) return ""
                                                if (hasUpgrade("a", 23) && shiftDown) return "You are gaining " + format(tmp.a.getResetGain) + " Amoebas per second"
                                                return ""
                                        },
                                ],
                                "buyables"],
                        unlocked(){
                                return hasUpgrade("a", 15) || hasUnlockedPast("a")
                        },
                },
                */
        },
        doReset(layer){
                let data = player.h
                if (layer == "h") {
                        data.time = 0
                        return 
                }
                data.time = 0
                data.times = 0

                if (!false) {
                        //upgrades
                        let keep = []
                        if (!false) data.upgrades = filter(data.upgrades, keep)
                }

                //resources
                data.points = new Decimal(0)
                data.best = new Decimal(0)

                //deuterium
                let deut = data.deuterium
                deut.points = new Decimal(0)
                deut.best = new Decimal(0)

                //atomic hydrogen
                let atmh = data.atomic_hydrogen
                atmh.points = new Decimal(0)
                atmh.best = new Decimal(0)

                return 
                //buyables 
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        data.buyables[resetBuyables[j]] = new Decimal(0)
                }
        },
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

                return ret
        },
        getBaseGain(){
                let pts = player.points
                if (player.points.lt(2)) return new Decimal(0)
                let base = player.points.log(2).div(256).sub(3).max(0)

                if (base.lt(1)) base = new Decimal(0)

                return base
        },
        getNextAt(){
                return new Decimal(0) //this doesnt matter
        },
        getLossRate() {
                let ret = new Decimal(.01)

                return ret.max(.00001)
        },
        getGainMult(){
                let x = new Decimal(1)

                if (hasUpgrade("c", 14)) x = x.times(tmp.c.upgrades[14].effect)
                if (hasUpgrade("c", 15)) x = x.times(tmp.h.upgrades[25].effect)
                if (hasUpgrade("h", 62)) x = x.times(tmp.o.upgrades[14].effect)
                if (hasUpgrade("h", 63)) x = x.times(tmp.h.upgrades[63].effect)
                x = x.times(tmp.tokens.buyables[22].effect)

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
        layerShown(){return hasUpgrade("h", 55)},
        prestigeButtonText(){
                return "hello"
        },
        canReset(){
                return false
        },
        /*
        deuterium: {
                getResetGain() {
                        let base = player.h.points.times(.0002)
                        let mult = tmp.h.deuterium.getGainMult

                        return base.times(mult)
                },
                getLossRate() {
                        return new Decimal(.01)
                },
                getGainMult(){
                        let x = new Decimal(1)

                        if (hasUpgrade("h", 23)) x = x.times(tmp.h.upgrades[23].effect)
                        if (hasUpgrade("h", 41)) x = x.times(Decimal.pow(player.h.atomic_hydrogen.points.plus(3).ln(), tmp.h.upgrades[41].effect))
                        x = x.times(tmp.mini.buyables[13].effect)

                        return x
                },
        },*/
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
                                return a
                        },
                        cost:() => Decimal.pow(2, hasUpgrade("o", 11) ? 2460 : 1024), //may change
                        /*
                        effect(){
                                let init = player.h.best.max(1)
                                let ret 

                                if (hasUpgrade("h", 33)) ret = init.log2().max(1)
                                else                     ret = init.ln().max(1)

                                if (hasUpgrade("h", 14)) ret = ret.pow(tmp.h.upgrades[14].effect)

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "c") return ""
                                if (player.subtabs.c.mainTabs != "Upgrades") return ""
                                return format(tmp.c.upgrades[11].effect)
                        },
                        */
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
                                return hasUpgrade("c", 11)
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
                                return hasUpgrade("c", 12)
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
                                return hasUpgrade("c", 13)
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
                                return hasUpgrade("c", 14)
                        }, //hasUpgrade("c", 15)
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
        doReset(layer){
                return 
                /*
                let data = player.h
                if (layer == "h") {
                        data.time = 0
                        return 
                }
                data.time = 0
                data.times = 0

                if (!false) {
                        //upgrades
                        let keep = []
                        if (!false) data.upgrades = filter(data.upgrades, keep)
                }

                //resources
                data.points = new Decimal(0)
                data.best = new Decimal(0)

                //deuterium
                let deut = data.deuterium
                deut.points = new Decimal(0)
                deut.best = new Decimal(0)

                //atomic hydrogen
                let atmh = data.atomic_hydrogen
                atmh.points = new Decimal(0)
                atmh.best = new Decimal(0)

                return 
                //buyables 
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        data.buyables[resetBuyables[j]] = new Decimal(0)
                }
                */
        },
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

                return ret
        },
        getBaseGain(){
                let pts = player.points
                if (player.points.lt(2)) return new Decimal(0)
                let base = player.points.max(4).log(2).log(2).sub(9).max(0).pow(2)

                if (base.lt(1)) base = new Decimal(0)

                return base
        },
        getNextAt(){
                return new Decimal(0) //this doesnt matter
        },
        getLossRate() {
                let ret = new Decimal(.01)

                return ret.max(.00001)
        },
        getGainMult(){
                let x = new Decimal(1)

                if (hasUpgrade("o", 12)) x = x.times(tmp.o.upgrades[12].effect)
                if (hasUpgrade("o", 14)) x = x.times(tmp.o.upgrades[14].effect)
                if (hasUpgrade("h", 63)) x = x.times(tmp.h.upgrades[63].effect)
                x = x.times(tmp.tokens.buyables[23].effect)

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
        layerShown(){return hasUpgrade("h", 55)},
        prestigeButtonText(){
                return "hello"
        },
        canReset(){
                return false
        },
        /*
        deuterium: {
                getResetGain() {
                        let base = player.h.points.times(.0002)
                        let mult = tmp.h.deuterium.getGainMult

                        return base.times(mult)
                },
                getLossRate() {
                        return new Decimal(.01)
                },
                getGainMult(){
                        let x = new Decimal(1)

                        if (hasUpgrade("h", 23)) x = x.times(tmp.h.upgrades[23].effect)
                        if (hasUpgrade("h", 41)) x = x.times(Decimal.pow(player.h.atomic_hydrogen.points.plus(3).ln(), tmp.h.upgrades[41].effect))
                        x = x.times(tmp.mini.buyables[13].effect)

                        return x
                },
        },*/
        upgrades: {
                rows: 1000,
                cols: 5,
                11: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(30) + "'>Oxygen I"
                        },
                        description(){
                                if (!shiftDown) return "Begin Production of Oxygen, but vastly increase the cost of Carbon I"
                                a = "(log2(log2(Life Points))-9)^2*multipliers"
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
                                return hasUpgrade("o", 11)
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
                                return hasUpgrade("o", 12)
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
                                if (hasUpgrade("o", 14)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.o.upgrades[14].cost, player.o.points, tmp.o.getResetGain, tmp.o.getLossRate)
                        },
                        cost:() => new Decimal(2000),
                        effect(){
                                let ret = player.o.points.max(1).ln().max(1)

                                if (hasUpgrade("o", 15)) ret = ret.pow(2)

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "o") return ""
                                if (player.subtabs.o.mainTabs != "Upgrades") return ""
                                return format(tmp.o.upgrades[14].effect)
                        },
                        unlocked(){
                                return hasUpgrade("o", 13)
                        }, //hasUpgrade("o", 14)
                },
                15: {
                        title(){
                                return "<bdi style='color: #" + getUndulatingColor(33) + "'>Oxygen V"
                        },
                        description(){
                                if (!shiftDown) return "Oxygen^upgrades multiplies Life Point gain and square Oxygen IV"
                                a = "Oxygen^[upgrades]"
                                if (hasUpgrade("o", 15)) return a
                                return a + "<br>Estimated time: " + logisticTimeUntil(tmp.o.upgrades[15].cost, player.o.points, tmp.o.getResetGain, tmp.o.getLossRate)
                        },
                        cost:() => new Decimal(5e4),
                        effect(){
                                let ret = player.o.points.max(1).pow(player.o.upgrades.length)

                                return ret
                        },
                        effectDisplay(){
                                if (player.tab != "o") return ""
                                if (player.subtabs.o.mainTabs != "Upgrades") return ""
                                return format(tmp.o.upgrades[15].effect)
                        },
                        unlocked(){
                                return hasUpgrade("o", 14)
                        }, //hasUpgrade("o", 15)
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
                "Milestones": {
                        content: [
                                "main-display-goals",
                                "milestones",
                        ],
                        unlocked(){
                                return false
                        },
                },
        },
        doReset(layer){
                return 
        },
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
                        if (extras[11].lt(1)) extra[11] = new Decimal(1)
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
                                let lim = 1
                                if (hasUpgrade("h", 52)) lim *= 10
                                list1 = [31, 32, 33, 41, 42, 43, 51, 52, 53]
                                let a = 0
                                if (hasUpgrade("h", 52)) list1 = [11, 12, 13, 21, 23, 61, 62, 63].concat(list1)
                                for (i = 0; i < list1.length; i++){
                                        let id = list1[i]
                                        if (!tmp.mini.buyables[id].unlocked) continue
                                        if (tmp.mini.buyables[id].canAfford) {
                                                layers.mini.buyables[id].buy()
                                                a += 1
                                        }
                                        if (a >= lim) break
                                }
                        }
                } else {
                        data.autotime = 0
                }
        },
        row: "side",
        hotkeys: [{key: "shift+@", description: "Shift+2: Go to minigames", 
                        onPress(){
                                player.tab = "mini"
                        }
                },],
        layerShown(){return hasUpgrade("h", 45) || hasUpgrade("h", 44)},
        prestigeButtonText(){
                return ""
        },
        canReset(){
                return false
        },
        clickables: {
                rows: 1,
                cols: 3,
        },
        a_points: {
                getGainMult(){
                        let ret = new Decimal(1)

                        if (player.hardMode) ret = ret.div(100)
                        if (hasUpgrade("h", 51)) ret = ret.times(1e5)

                        ret = ret.times(tmp.mini.buyables[12].effect)
                        ret = ret.times(tmp.mini.buyables[62].effect)
                        ret = ret.times(tmp.mini.buyables[51].effect)
                        ret = ret.times(tmp.tokens.buyables[31].effect)

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

                        return ret
                },
                getColorGainExp(){
                        let exp = hasUpgrade("h", 54) ? .52 : .5
                        if (hasUpgrade("h", 55)) exp += .004
                        if (hasUpgrade("c", 12)) exp += tmp.c.upgrades[12].effect.toNumber()
                        exp += tmp.tokens.buyables[63].effect.toNumber()

                        return exp
                },
                colorGainMult(){
                        let ret = new Decimal(1)

                        ret = ret.times(tmp.tokens.buyables[33].effect)

                        return ret
                },
        },
        b_points: {
                getResetGain(){
                        let ret = new Decimal(1)

                        if (player.hardMode) ret = ret.div(3)

                        ret = ret.times(tmp.mini.buyables[31].effect)
                        ret = ret.times(tmp.mini.buyables[32].effect)
                        ret = ret.times(tmp.mini.buyables[41].effect)
                        ret = ret.times(tmp.mini.buyables[42].effect)
                        ret = ret.times(tmp.tokens.buyables[32].effect)

                        if (hasUpgrade("o", 13)) ret = ret.pow(tmp.o.upgrades[13].effect)
                        ret = ret.pow(tmp.tokens.buyables[62].effect)

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
                autotime: 0,
                points: new Decimal(0),
                total: new Decimal(0),
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
        getNextAt(){
                let log_costs = [6420, 7587, 1e6-1]
                let len = log_costs.length
                if (player.tokens.total.gte(len)) return new Decimal(Infinity)
                return Decimal.pow(10, log_costs[player.tokens.total.toNumber()])
        },
        update(diff){},
        row: "side",
        hotkeys: [{key: "shift+#", description: "Shift+3: Go to tokens", 
                        onPress(){
                                player.tab = "tokens"
                        }
                },],
        layerShown(){return hasUpgrade("h", 65) || player.tokens.total.gt(0)},
        prestigeButtonText(){
                return "Reset for a token<br>Requires: " + format(tmp.tokens.getNextAt) + " Life Points"
        },
        canReset(){
                return tmp.tokens.getResetGain.gt(0)
        },
        onPrestige(gain){
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
                        player.c.upgrades = filterOut(player.c.upgrades, [11, 12, 13, 14, 15])
                        player.c.points = new Decimal(0)
                        player.c.best = new Decimal(0)
                }

                // 4: O
                if (!false) {
                        player.o.upgrades = filterOut(player.o.upgrades, [11, 12, 13, 14, 15])
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

                        player.h.upgrades = filterOut(player.h.upgrades, remove)
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
                11: {
                        title: "<bdi style='color:#FF0000'>Radio Waves</bdi>",
                        cost: () => Decimal.pow(2, getBuyableAmount("tokens", 11)),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[11].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[11] = player.tokens.buyables[11].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[11].cost)
                        },
                        sellOne(){
                                player.tokens.buyables[11] = player.tokens.buyables[11].sub(1)
                                player.tokens.points = player.tokens.points.plus(tmp.tokens.buyables[11].cost.div(2))
                        },
                        canSellOne(){
                                return player.tokens.buyables[11].gt(0)
                        },
                        base(){
                                let ret = new Decimal(1000)
                                return ret
                        },
                        effect(){
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
                                let eformula = format(tmp.tokens.buyables[11].base) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let cost2 = "2<sup>x</sup>" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                12: {
                        title: "<bdi style='color:#FF0000'>Microwaves</bdi>",
                        cost: () => Decimal.pow(2, getBuyableAmount("tokens", 12)),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[12].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[12] = player.tokens.buyables[12].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[12].cost)
                        },
                        sellOne(){
                                player.tokens.buyables[12] = player.tokens.buyables[12].sub(1)
                                player.tokens.points = player.tokens.points.plus(tmp.tokens.buyables[12].cost.div(2))
                        },
                        canSellOne(){
                                return player.tokens.buyables[12].gt(0)
                        },
                        base(){
                                let ret = new Decimal(100)
                                return ret
                        },
                        effect(){
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
                                let eformula = format(tmp.tokens.buyables[12].base) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let cost2 = "2<sup>x</sup>" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                13: { 
                        title: "<bdi style='color:#FF0000'>Infrared</bdi>",
                        cost: () => Decimal.pow(2, getBuyableAmount("tokens", 13)),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[13].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[13] = player.tokens.buyables[13].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[13].cost)
                        },
                        sellOne(){
                                player.tokens.buyables[13] = player.tokens.buyables[13].sub(1)
                                player.tokens.points = player.tokens.points.plus(tmp.tokens.buyables[13].cost.div(2))
                        },
                        canSellOne(){
                                return player.tokens.buyables[13].gt(0)
                        },
                        base(){
                                let ret = new Decimal(20)
                                return ret
                        },
                        effect(){
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
                                let eformula = format(tmp.tokens.buyables[13].base) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let cost2 = "2<sup>x</sup>" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                21: { 
                        title: "<bdi style='color:#FF0000'>Visable</bdi>",
                        cost: () => Decimal.pow(2, getBuyableAmount("tokens", 21)),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[21].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[21] = player.tokens.buyables[21].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[21].cost)
                        },
                        sellOne(){
                                player.tokens.buyables[21] = player.tokens.buyables[21].sub(1)
                                player.tokens.points = player.tokens.points.plus(tmp.tokens.buyables[21].cost.div(2))
                        },
                        canSellOne(){
                                return player.tokens.buyables[21].gt(0)
                        },
                        base(){
                                let ret = new Decimal(20)
                                return ret
                        },
                        effect(){
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
                                let eformula = format(tmp.tokens.buyables[21].base) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let cost2 = "2<sup>x</sup>" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                22: {
                        title: "<bdi style='color:#FF0000'>Near-ultraviolet</bdi>",
                        cost: () => Decimal.pow(2, getBuyableAmount("tokens", 22)),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[22].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[22] = player.tokens.buyables[22].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[22].cost)
                        },
                        sellOne(){
                                player.tokens.buyables[22] = player.tokens.buyables[22].sub(1)
                                player.tokens.points = player.tokens.points.plus(tmp.tokens.buyables[22].cost.div(2))
                        },
                        canSellOne(){
                                return player.tokens.buyables[22].gt(0)
                        },
                        base(){
                                let ret = new Decimal(10)
                                return ret
                        },
                        effect(){
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
                                let eformula = format(tmp.tokens.buyables[22].base) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let cost2 = "2<sup>x</sup>" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                23: {
                        title: "<bdi style='color:#FF0000'>Ultraviolet</bdi>",
                        cost: () => Decimal.pow(2, getBuyableAmount("tokens", 23)),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[23].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[23] = player.tokens.buyables[23].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[23].cost)
                        },
                        sellOne(){
                                player.tokens.buyables[23] = player.tokens.buyables[23].sub(1)
                                player.tokens.points = player.tokens.points.plus(tmp.tokens.buyables[23].cost.div(2))
                        },
                        canSellOne(){
                                return player.tokens.buyables[23].gt(0)
                        },
                        base(){
                                let ret = new Decimal(10)
                                return ret
                        },
                        effect(){
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
                                let eformula = format(tmp.tokens.buyables[23].base) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let cost2 = "2<sup>x</sup>" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                31: {
                        title: "<bdi style='color:#FF0000'>X-Rays</bdi>",
                        cost: () => Decimal.pow(2, getBuyableAmount("tokens", 31)),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[31].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[31] = player.tokens.buyables[31].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[31].cost)
                        },
                        sellOne(){
                                player.tokens.buyables[31] = player.tokens.buyables[31].sub(1)
                                player.tokens.points = player.tokens.points.plus(tmp.tokens.buyables[31].cost.div(2))
                        },
                        canSellOne(){
                                return player.tokens.buyables[31].gt(0)
                        },
                        base(){
                                let ret = new Decimal(1e8)
                                return ret
                        },
                        effect(){
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
                                let eformula = format(tmp.tokens.buyables[31].base) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let cost2 = "2<sup>x</sup>" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                32: {
                        title: "<bdi style='color:#FF0000'>Gamma Rays</bdi>",
                        cost: () => Decimal.pow(2, getBuyableAmount("tokens", 32)),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[32].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[32] = player.tokens.buyables[32].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[32].cost)
                        },
                        sellOne(){
                                player.tokens.buyables[32] = player.tokens.buyables[32].sub(1)
                                player.tokens.points = player.tokens.points.plus(tmp.tokens.buyables[32].cost.div(2))
                        },
                        canSellOne(){
                                return player.tokens.buyables[32].gt(0)
                        },
                        base(){
                                let ret = new Decimal(1e12)
                                return ret
                        },
                        effect(){
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
                                let eformula = format(tmp.tokens.buyables[32].base) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let cost2 = "2<sup>x</sup>" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                33: { 
                        title: "<bdi style='color:#FF0000'>UHF Gamma Rays</bdi>",
                        cost: () => Decimal.pow(2, getBuyableAmount("tokens", 33)),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[33].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[33] = player.tokens.buyables[33].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[33].cost)
                        },
                        sellOne(){
                                player.tokens.buyables[33] = player.tokens.buyables[33].sub(1)
                                player.tokens.points = player.tokens.points.plus(tmp.tokens.buyables[33].cost.div(2))
                        },
                        canSellOne(){
                                return player.tokens.buyables[33].gt(0)
                        },
                        base(){
                                let ret = new Decimal(10)
                                return ret
                        },
                        effect(){
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
                                let eformula = format(tmp.tokens.buyables[33].base) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let cost2 = "2<sup>x</sup>" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                41: {
                        title: "<bdi style='color:#FFFF00'>Constant</bdi>",
                        cost: () => Decimal.pow(2, getBuyableAmount("tokens", 41)),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[41].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[41] = player.tokens.buyables[41].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[41].cost)
                        },
                        sellOne(){
                                player.tokens.buyables[41] = player.tokens.buyables[41].sub(1)
                                player.tokens.points = player.tokens.points.plus(tmp.tokens.buyables[41].cost.div(2))
                        },
                        canSellOne(){
                                return player.tokens.buyables[41].gt(0)
                        },
                        base(){
                                let ret = new Decimal(1.02)
                                return ret
                        },
                        effect(){
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
                                let eformula = format(tmp.tokens.buyables[41].base) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let cost2 = "2<sup>x</sup>" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                42: {
                        title: "<bdi style='color:#FFFF00'>Logarithmic</bdi>",
                        cost: () => Decimal.pow(2, getBuyableAmount("tokens", 42)),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[42].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[42] = player.tokens.buyables[42].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[42].cost)
                        },
                        sellOne(){
                                player.tokens.buyables[42] = player.tokens.buyables[42].sub(1)
                                player.tokens.points = player.tokens.points.plus(tmp.tokens.buyables[42].cost.div(2))
                        },
                        canSellOne(){
                                return player.tokens.buyables[42].gt(0)
                        },
                        base(){
                                let ret = new Decimal(1.01)
                                return ret
                        },
                        effect(){
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
                                let eformula = format(tmp.tokens.buyables[42].base) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let cost2 = "2<sup>x</sup>" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                43: {
                        title: "<bdi style='color:#FFFF00'>Linear</bdi>",
                        cost: () => Decimal.pow(2, getBuyableAmount("tokens", 43)),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[43].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[43] = player.tokens.buyables[43].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[43].cost)
                        },
                        sellOne(){
                                player.tokens.buyables[43] = player.tokens.buyables[43].sub(1)
                                player.tokens.points = player.tokens.points.plus(tmp.tokens.buyables[43].cost.div(2))
                        },
                        canSellOne(){
                                return player.tokens.buyables[43].gt(0)
                        },
                        base(){
                                let ret = new Decimal(1.01)
                                return ret
                        },
                        effect(){
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
                                let eformula = format(tmp.tokens.buyables[43].base) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let cost2 = "2<sup>x</sup>" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                51: {
                        title: "<bdi style='color:#FFFF00'>Quadratic</bdi>",
                        cost: () => Decimal.pow(2, getBuyableAmount("tokens", 51)),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[51].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[51] = player.tokens.buyables[51].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[51].cost)
                        },
                        sellOne(){
                                player.tokens.buyables[51] = player.tokens.buyables[51].sub(1)
                                player.tokens.points = player.tokens.points.plus(tmp.tokens.buyables[51].cost.div(2))
                        },
                        canSellOne(){
                                return player.tokens.buyables[51].gt(0)
                        },
                        base(){
                                let ret = new Decimal(1.01)
                                return ret
                        },
                        effect(){
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
                                let eformula = format(tmp.tokens.buyables[51].base) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let cost2 = "2<sup>x</sup>" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                52: {
                        title: "<bdi style='color:#FFFF00'>Cubic</bdi>",
                        cost: () => Decimal.pow(2, getBuyableAmount("tokens", 52)),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[52].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[52] = player.tokens.buyables[52].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[52].cost)
                        },
                        sellOne(){
                                player.tokens.buyables[52] = player.tokens.buyables[52].sub(1)
                                player.tokens.points = player.tokens.points.plus(tmp.tokens.buyables[52].cost.div(2))
                        },
                        canSellOne(){
                                return player.tokens.buyables[52].gt(0)
                        },
                        base(){
                                let ret = new Decimal(1.01)
                                return ret
                        },
                        effect(){
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
                                let eformula = format(tmp.tokens.buyables[52].base) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let cost2 = "2<sup>x</sup>" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                53: {
                        title: "<bdi style='color:#FFFF00'>Polynomial</bdi>",
                        cost: () => Decimal.pow(2, getBuyableAmount("tokens", 53)),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[53].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[53] = player.tokens.buyables[53].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[53].cost)
                        },
                        sellOne(){
                                player.tokens.buyables[53] = player.tokens.buyables[53].sub(1)
                                player.tokens.points = player.tokens.points.plus(tmp.tokens.buyables[53].cost.div(2))
                        },
                        canSellOne(){
                                return player.tokens.buyables[53].gt(0)
                        },
                        base(){
                                let ret = new Decimal(1.01)
                                return ret
                        },
                        effect(){
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
                                let eformula = format(tmp.tokens.buyables[53].base) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let cost2 = "2<sup>x</sup>" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                61: {
                        title: "<bdi style='color:#FFFF00'>Semi-exponential</bdi>",
                        cost: () => Decimal.pow(2, getBuyableAmount("tokens", 61)),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[61].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[61] = player.tokens.buyables[61].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[61].cost)
                        },
                        sellOne(){
                                player.tokens.buyables[61] = player.tokens.buyables[61].sub(1)
                                player.tokens.points = player.tokens.points.plus(tmp.tokens.buyables[61].cost.div(2))
                        },
                        canSellOne(){
                                return player.tokens.buyables[61].gt(0)
                        },
                        base(){
                                let ret = new Decimal(1.01)
                                return ret
                        },
                        effect(){
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
                                let eformula = format(tmp.tokens.buyables[61].base) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let cost2 = "2<sup>x</sup>" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                62: {
                        title: "<bdi style='color:#FFFF00'>Exponential</bdi>",
                        cost: () => Decimal.pow(2, getBuyableAmount("tokens", 62)),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[62].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[62] = player.tokens.buyables[62].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[62].cost)
                        },
                        sellOne(){
                                player.tokens.buyables[62] = player.tokens.buyables[62].sub(1)
                                player.tokens.points = player.tokens.points.plus(tmp.tokens.buyables[62].cost.div(2))
                        },
                        canSellOne(){
                                return player.tokens.buyables[62].gt(0)
                        },
                        base(){
                                let ret = new Decimal(1.01)
                                return ret
                        },
                        effect(){
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
                                let eformula = format(tmp.tokens.buyables[62].base) + "^x" //+ getBuyableEffectString(layer, id)
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
                                let cost2 = "2<sup>x</sup>" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                63: {
                        title: "<bdi style='color:#FFFF00'>Double-exponential</bdi>",
                        cost: () => Decimal.pow(2, getBuyableAmount("tokens", 63)),
                        canAfford:() => player.tokens.points.gte(tmp.tokens.buyables[63].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.tokens.buyables[63] = player.tokens.buyables[63].plus(1)
                                player.tokens.points = player.tokens.points.sub(tmp.tokens.buyables[63].cost)
                        },
                        sellOne(){
                                player.tokens.buyables[63] = player.tokens.buyables[63].sub(1)
                                player.tokens.points = player.tokens.points.plus(tmp.tokens.buyables[63].cost.div(2))
                        },
                        canSellOne(){
                                return player.tokens.buyables[63].gt(0)
                        },
                        effect(){
                                return player.tokens.buyables[63].div(20).plus(1).pow(-1).sub(1).times(-.2)
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
                                let cost2 = "2<sup>x</sup>" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
        },
        milestones: {
                1: {
                        title: "abc",
                        requirementDescription: "asda",
                        done(){
                                return false
                        },
                        unlocked(){
                                return true
                        },
                        effectDescription(){
                                return "adas"
                        },
                }, 
        },
        tabFormat: {
                "Milestones": {
                        content: [
                                ["prestige-button", "", function (){ return false ? {'display': 'none'} : {}}],
                                ["milestones"],// work on this later i guess
                                ["display-text", "test"],
                        ],
                        unlocked(){
                                return true
                        },
                },
                "Flat": {
                        content: [
                                "main-display",
                                /*["display-text", function(){
                                        return "You can at any time remove (and reapply) tokens through shift!"
                                }],*/
                                ["display-text", function(){
                                        return "Each upgrade boosts something different! You can sell upgrades at any time with no cost.<br>Note that selling things that boost decaying resources can cause you to lose resources."
                                }],
                                ["buyables", [1,2,3]],
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
                                        return "Each upgrade boosts something different! You can sell upgrades at any time with no cost.<br>Note that selling things that boost decaying resources can cause you to lose resources."
                                }],
                                ["buyables", [4,5,6]],
                                ["display-text", "<br><br><br>You'll thank me later."]
                        ],
                        unlocked(){
                                return true
                        },
                },
        },
        doReset(layer){},
})





