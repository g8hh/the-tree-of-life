function getPointGen() {
	let gain = new Decimal(.1)
        if (hasUpgrade("h", 11)) gain = gain.times(tmp.h.upgrades[11].effect)
        if (hasUpgrade("h", 22)) gain = gain.times(tmp.h.upgrades[22].effect)
        if (hasUpgrade("h", 34)) gain = gain.times(tmp.h.upgrades[13].effect)
        gain = gain.times(tmp.mini.buyables[61].effect)



        if (hasUpgrade("h", 25)) gain = gain.pow(tmp.h.upgrades[25].effect)

	return gain
}

function filter(list, keep){
        return list.filter(x => keep.includes(x))
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

                return base.times(mult)
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
        },
        atomic_hydrogen: {
                getResetGain() {
                        let base = player.h.points.times(.001)
                        let mult = tmp.h.atomic_hydrogen.getGainMult

                        return base.times(mult)
                },
                getLossRate() {
                        return new Decimal(.01)
                },
                getGainMult(){
                        let x = new Decimal(1)

                        if (hasUpgrade("h", 42)) x = x.times(Decimal.pow(player.h.deuterium.points.plus(3).ln(), tmp.h.upgrades[42].effect))
                        x = x.times(tmp.mini.buyables[11].effect)

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
                                let a = 1
                                
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
                        unlocked(){
                                return hasUpgrade("h", 43)
                        }, //hasUpgrade("h", 45)
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
                                ["upgrades", [1,2,3,4]]],
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
                data = player.h
                if (layer == "h") data.time = 0
                if (!getsReset("h", layer)) return
                data.time = 0
                data.times = 0

                if (!false) {
                        //upgrades
                        let keep = []
                        if (!false) data.upgrades = filter(data.upgrades, keep)
                }

                //resources
                data.points = new Decimal(0)
                data.total = new Decimal(0)
                data.best = new Decimal(0)

                //buyables
                return 
                let resetBuyables = [11, 12, 13, 21, 22, 23, 31, 32, 33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        data.buyables[resetBuyables[j]] = new Decimal(0)
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
                /*
                if (layers[layer].row != "side") return 
                if (layer == "ach") return
                if (hasMilestone("i", 1)) return 

                let data = player.ach

                let remove = [
                        "11", "12", "13", "14", "15", "16", "17", 
                        "21", "22", "23", "24", "25", "26", "27", 
                        "31", "32", "33", "34", "35", "36", "37", 
                        "41", "42", "43", "44", "45", "46", "47", 
                        "51", "52", "53", "54", "55", "56", "57", 
                        "61", "62", "63", "64", "65", "66", "67", 
                        "71", "72", "73", "74", "75", "76", "77", 
                        "81", "82", "83", "84"]

                data.achievements = filterout(data.achievements, remove)
                data.best = new Decimal(0)
                data.points = new Decimal(0)

                let keep = []
                data.milestones = filter(data.milestones, keep)
                updateAchievements("ach")
                updateMilestones("ach")
                */
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
                autotimes: 0,
                a_points: {
                        points: new Decimal(0),
                        best: new Decimal(0),
                        extras: {
                                11: new Decimal(1),
                                12: new Decimal(0),
                                13: new Decimal(0),
                                21: new Decimal(0),
                                22: new Decimal(0),
                                23: new Decimal(0),
                                61: new Decimal(0),
                                62: new Decimal(0),
                                63: new Decimal(0),
                        },
                        grid: {}
                },
                b_points: {
                        points: new Decimal(0),
                        best: new Decimal(0),
                        /*
                        repeatables: {
                                11: new Decimal(0),
                                12: new Decimal(0),
                                13: new Decimal(0),
                                21: new Decimal(0),
                                22: new Decimal(0),
                                23: new Decimal(0),
                        },
                        */
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
                if (player.subtabs.mini.mainTabs == "B" && tmp.mini.tabFormat.B.unlocked) {
                        bpts.points = bpts.points.plus(tmp.mini.b_points.getResetGain.times(diff))
                }
                if (player.subtabs.mini.mainTabs == "A" && tmp.mini.tabFormat.A.unlocked) {
                        //update A minigame
                        let extras = apts.extras
                        let lvls = player.mini.buyables
                        let order = [11,12,13  ,23,63,62  ,61,21,11]
                        let a = new Decimal(1)
                        for (i = 0; i < 8; i++){
                                addto = order[i+1]
                                addfrom = order[i]
                                a = a.times(extras[addto].plus(1))
                                extras[addto] = extras[addto].plus(extras[addfrom].root(2).div(20).times(Decimal.pow(2, lvls[addfrom])).times(diff))
                        }
                        apts.points = apts.points.plus(a.sub(1).times(tmp.mini.a_points.getGainMult).times(diff))

                        // extras[11] = extras[11].plus(extras[21].root(2).div(10).times(Decimal.pow(2, lvls[21])))
                }
        },
        row: "side",
        hotkeys: [],
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

                        ret = ret.times(tmp.mini.buyables[12].effect)

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

                        return ret
                },
        },
        buyables: {
                rows: 15,
                cols: 3,
                11: {
                        title: "<bdi style='color:#FF0000'>Red</bdi>",
                        cost: () => new Decimal(20).times(Decimal.pow(1e3, Decimal.pow(getBuyableAmount("mini", 11), 1.2))),
                        canAfford:() => player.mini.a_points.points.gte(tmp.mini.buyables[11].cost),
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
                        canAfford:() => player.mini.a_points.points.gte(tmp.mini.buyables[12].cost),
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
                        canAfford:() => player.mini.a_points.points.gte(tmp.mini.buyables[13].cost),
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
                        cost: () => new Decimal(1e100).times(Decimal.pow(1e10, Decimal.pow(getBuyableAmount("mini", 21), 1.1))),
                        canAfford:() => player.mini.a_points.points.gte(tmp.mini.buyables[21].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[21] = player.mini.buyables[21].plus(1)
                                player.mini.a_points.points = player.mini.a_points.points.sub(tmp.mini.buyables[21].cost)
                        },
                        base(){
                                let ret = new Decimal(2)
                                return ret
                        },
                        effect(){
                                return tmp.mini.buyables[21].base.pow(player.mini.buyables[21])
                        },
                        display(){
                                // other than softcapping fully general
                                if (player.tab != "mini") return ""
                                if (player.subtabs.mini.mainTabs != "A") return ""
                                //if we arent on the tab, then we dont care :) (makes it faster)
                                let lvl = "<b><h2>Levels</h2>: " + formatWhole(player.mini.buyables[21]) + "</b><br>"
                                let amt = "<b><h2>Amount</h2>: " + format(player.mini.a_points.extras[21]) + "</b><br>"
                                let eff1 = "<b><h2>Effect</h2>: *"
                                let eff2 = format(tmp.mini.buyables[21].effect) + " to idk</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 21)) + " A Points</b><br>"
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
                                let cost2 = "(10)*(20^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                23: {
                        title: "<bdi style='color:#33CC33'>Green</bdi>",
                        cost: () => new Decimal(1e31).times(Decimal.pow(1e11, Decimal.pow(getBuyableAmount("mini", 23), 1.1))),
                        canAfford:() => player.mini.a_points.points.gte(tmp.mini.buyables[23].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[23] = player.mini.buyables[23].plus(1)
                                player.mini.a_points.points = player.mini.a_points.points.sub(tmp.mini.buyables[23].cost)
                        },
                        base(){
                                let ret = new Decimal(1)
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
                        canAfford:() => player.mini.a_points.points.gte(tmp.mini.buyables[61].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[61] = player.mini.buyables[61].plus(1)
                                player.mini.a_points.points = player.mini.a_points.points.sub(tmp.mini.buyables[61].cost)
                        },
                        base(){
                                let ret = new Decimal(3)
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
                                let eformula = "3^x" //+ getBuyableEffectString(layer, id)
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
                        cost: () => new Decimal(1e100).times(Decimal.pow(1e10, Decimal.pow(getBuyableAmount("mini", 62), 1.1))),
                        canAfford:() => player.mini.a_points.points.gte(tmp.mini.buyables[62].cost),
                        buy(){
                                if (!this.canAfford()) return 
                                player.mini.buyables[62] = player.mini.buyables[62].plus(1)
                                player.mini.a_points.points = player.mini.a_points.points.sub(tmp.mini.buyables[62].cost)
                        },
                        base(){
                                let ret = new Decimal(2)
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
                                let eff2 = format(tmp.mini.buyables[62].effect) + " to idk</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getBuyableCost("mini", 62)) + " A Points</b><br>"
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
                                let cost2 = "(10)*(20^x<sup>1.1</sup>)" 
                                let cost3 = "</b><br>"
                                let allCost = cost1 + cost2 + cost3


                                let end = allEff + allCost
                                return "<br>" + end
                        },
                },
                63: {
                        title: "<bdi style='color:#0000FF'>Blue</bdi>",
                        cost: () => new Decimal(1e10).times(Decimal.pow(1e8, Decimal.pow(getBuyableAmount("mini", 63), 1.1))),
                        canAfford:() => player.mini.a_points.points.gte(tmp.mini.buyables[63].cost),
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
                                let order = [11,12,13  ,23,63,62  ,61,21]
                                let a = new Decimal(1)
                                for (i = 0; i < 8; i++){
                                        a = a.times(player.mini.a_points.extras[order[i]].plus(1))
                                }
                                
                                return "A Point production is the product of <br><b>(1+[amounts])</b><br> over all colors minus 1<br>Currently: " + format(a.sub(1).times(tmp.mini.a_points.getGainMult)) + "/sec"
                        }
                },
                31: {
                        title: "B11", 
                        cost:() => new Decimal(10).times(Decimal.pow(20, Decimal.pow(getBuyableAmount("mini", 31), 1.1))),
                        canAfford:() => player.mini.b_points.points.gte(tmp.mini.buyables[31].cost),
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
                        cost:() => new Decimal(3e6).times(Decimal.pow(5e5, Decimal.pow(getBuyableAmount("mini", 32), 1.2))),
                        canAfford:() => player.mini.b_points.points.gte(tmp.mini.buyables[32].cost),
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
                        cost:() => new Decimal(1e25).times(Decimal.pow(100, Decimal.pow(getBuyableAmount("mini", 33), 1.2))),
                        canAfford:() => player.mini.b_points.points.gte(tmp.mini.buyables[33].cost),
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
                        cost:() => new Decimal(1e33).times(Decimal.pow(10, Decimal.pow(getBuyableAmount("mini", 41), 1.5))),
                        canAfford:() => player.mini.b_points.points.gte(tmp.mini.buyables[41].cost),
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
                        cost:() => new Decimal(5e237).times(Decimal.pow(2e10, Decimal.pow(getBuyableAmount("mini", 42), 1.35))),
                        canAfford:() => player.mini.b_points.points.gte(tmp.mini.buyables[42].cost),
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
                        cost:() => new Decimal("1e425").times(Decimal.pow(1e15, Decimal.pow(getBuyableAmount("mini", 43), 1.2))),
                        canAfford:() => player.mini.b_points.points.gte(tmp.mini.buyables[43].cost),
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
                },
        },
        tabFormat: {
                "A": {
                        content: [
                                ["secondary-display", "a_points"],
                                ["display-text", "Each color produces the next color clockwise!"],
                                ["display-text", function(){
                                        if (!shiftDown) return ""
                                        a = "Formula: sqrt(amt)/20*2^levels"
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
                                ["display-text", "You need to be on this tab to keep this minigame ticking!"],
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
                return 
                /*
                if (layers[layer].row != "side") return 
                if (layer == "ach") return
                if (hasMilestone("i", 1)) return 

                let data = player.ach

                let remove = [
                        "11", "12", "13", "14", "15", "16", "17", 
                        "21", "22", "23", "24", "25", "26", "27", 
                        "31", "32", "33", "34", "35", "36", "37", 
                        "41", "42", "43", "44", "45", "46", "47", 
                        "51", "52", "53", "54", "55", "56", "57", 
                        "61", "62", "63", "64", "65", "66", "67", 
                        "71", "72", "73", "74", "75", "76", "77", 
                        "81", "82", "83", "84"]

                data.achievements = filterout(data.achievements, remove)
                data.best = new Decimal(0)
                data.points = new Decimal(0)

                let keep = []
                data.milestones = filter(data.milestones, keep)
                updateAchievements("ach")
                updateMilestones("ach")
                */
        },
})





