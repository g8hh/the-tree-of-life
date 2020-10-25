function getPointGen() {
	if (!canGenPoints()) return new Decimal(0)

	let gain = new Decimal(1)
        if (hasIUpg(11)) gain = gain.times(getIUpgEff(11))
        gain = gain.times(layers.am.effect())
        gain = gain.times(layers.m.effect()[0])
        gain = gain.times(layers.a.effect()[0])
        

        if (inChallenge("am", 12)) gain = gain.pow(.1)
	return gain
}

function filter(list, keep){
        return list.filter(x => keep.includes(x))
}

function canBuyMax(layer, id) {
        if (layer == "i") return hasAMUpgrade(13)
	return false
}

function hasIUpg(id){
        return hasUpgrade("i", id)
}

function getIUpgEff(id){
        return upgradeEffect("i", id)
}

function getIBuyableCost(id){
        return layers.i.buyables[id].cost()
}

function getIBuyableEff(id){
        return layers.i.buyables[id].effect()
}

function getIBuyablesTotalRow(row){
        a = new Decimal(0)
        for (i = 1; i <= layers.i.buyables.cols; i++){
                a = a.plus(getBuyableAmount("i", 10*row+i))
        }
        return a
}

function getIBuyableFormat(id){
        let a = getBuyableAmount("i", id)
        return formatWhole(a)
}

function getAMUpgEff(id){
        return upgradeEffect("am", id)
}

function hasAMUpgrade(id){
        return hasUpgrade("am", id)
}

function formatNextIUpgText(id, amt){
        let start = "You need " + formatWhole(amt) + " levels of "
        let end = " to unlock the next upgrade"
        let mid = layers.i.buyables[id].title
        return start + mid + end
}

function canSeeIUpgrade(id){
        return layers.i.upgrades[id].unlocked()
}

function canUnlIUpgForText(id){
        if (id <= 31) {
                if (hasAMUpgrade(12)) return false //we already see it
                if (id % 10 == 1) return !canSeeIUpgrade(id) && canSeeIUpgrade(id-7)
                return !canSeeIUpgrade(id) && canSeeIUpgrade(id-1)
        }
        if (!hasAMUpgrade(13)) return false
        if (id <= 34) {
                if (id % 10 == 1) return !canSeeIUpgrade(id) && canSeeIUpgrade(id-7)
                return !canSeeIUpgrade(id) && canSeeIUpgrade(id-1)
        }
        
        return false //for now
}

function hasAUpgrade(id){
        return hasUpgrade("a", id)
}

function getEUpgEff(id){
        return upgradeEffect("e", id)
}

function getIStaminaSoftcapStart(){
        let ret = 40
        if (hasChallenge("am", 11)) ret += 5
        if (hasChallenge("m", 11)) ret += 5
        return ret
}


function getIncBuyableFormulaText(id){
        if (id == 11){
                let base = (hasIUpg(22) ? 1 : 2)/1.01
                let linear = format(base, 2) + "^x"
                return "10*" + linear + "*1.01^(x^2)"
                //Decimal.pow(base1, x).times(Decimal.pow(1.01, exp2)).times(10)
        } 
        if (id == 12){
                let base = hasIUpg(23) ? 1 : 4
                let linear = ""
                if (base != 1) linear = format(base, 2) + "^x*"
                return "1e4*" + linear + "1.25^(x^2)"
        }
        if (id == 13){
                let linear = ""
                let b1 = hasIUpg(24) ? 1 : 2
                if (b1 != 1) linear = format(b1, 2) + "^x*"
                let quad = "1.25^(x^2)*"
                let start = "1e5*"
                if (!hasUpgrade("a", 14)) start = "1e5*" + linear + quad

                let y = getBuyableAmount("i", 13).minus(4).max(1)
                if (hasIUpg(31)) {
                        y = new Decimal(1)
                        //if (x.gt(5/3)) x = x.div(2.5).plus(1)
                }
                let base1 = y.div(10).plus(1)
                let base2 = y.sqrt().div(5).plus(1)

                let formatNum = hasIUpg(31) ? 1 : 2

                let exp = format(base1, formatNum) + "^(" + format(base2, formatNum) + "^"
                let end = hasIUpg(31) ? "(x/2.5+1)" : "x"
                
                return start + exp + end + ")"
        }
}

var incGainFactor = new Decimal(1)

// http://www.singularis.ltd.uk/bifroest/misc/homophones-list.html for list of homophones

addLayer("i", {
        name: "Incrementy", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
                time: 0,
        }},
        color: "#4B4C83",
        requires: new Decimal(10), // Can be a function that takes requirement increases into account
        resource: "Incrementy", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "custom", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        getResetGain() {
                let pts = layers.i.baseAmount()
                let pre = layers.i.getGainMultPre()
                let exp = layers.i.getGainExp()
                let pst = layers.i.getGainMultPost()
                let ret = pts.max(10).log10().times(pre).pow(exp).times(pst).minus(1)
                ret = ret.times(incGainFactor).max(0)

                if (inChallenge("am", 11)) ret = ret.root(10)
                if (inChallenge("m", 11))  ret = ret.root(2)
                if (inChallenge("m", 12))  ret = ret.root(3)

                return ret
        },
        getGainExp(){
                let x = new Decimal(1)
                x = x.times(getIBuyableEff(13))
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1)
                if (hasIUpg(32)) x = x.times(layers.am.effect())
                if (hasAMUpgrade(14)) x = x.times(getBuyableAmount("i", 12).max(1))
                if (hasAMUpgrade(22)) x = x.times(getBuyableAmount("i", 11).max(1))
                if (hasAMUpgrade(24)) x = x.times(getBuyableAmount("i", 13).max(1))
                if (hasAUpgrade(21))  x = x.times(upgradeEffect("a", 21))
                if (hasAUpgrade(22))  x = x.times(upgradeEffect("a", 22))
                if (hasAUpgrade(23))  x = x.times(upgradeEffect("a", 23))
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)
                x = x.times(getIBuyableEff(11))
                x = x.times(getIBuyableEff(12))
                if (!hasIUpg(32)) x = x.times(layers.am.effect())
                if (hasAMUpgrade(11)) x = x.times(getAMUpgEff(11))
                if (hasAMUpgrade(12)) x = x.times(3)
                x = x.times(layers.a.effect()[0])
                x = x.times(layers.m.effect()[0])
                if (hasUpgrade("e", 23)) x = x.times(player.e.points.max(1))
                if (hasChallenge("m", 11)) x = x.times(player.e.points.max(1))
                return x
        },
        update(diff){
                player.i.points = player.i.points.plus(layers.i.getResetGain().times(diff))
                if (!player.i.best) player.i.best = new Decimal(0)
                player.i.best = player.i.best.max(player.i.points)
                
                if (!player.i.time) player.i.time = 0
                player.i.time += diff
                if (player.i.time > 1) {
                        let times = -Math.floor(player.i.time)
                        player.i.time += times
                        times *= -1
                        if (hasMilestone("a", 2)) {
                                if (!hasMilestone("a", 4)) {
                                        layers.i.buyables[11].buyMax(times)
                                        layers.i.buyables[12].buyMax(times)
                                        layers.i.buyables[13].buyMax(times)
                                } else {
                                        layers.i.buyables[11].buyMax(times*100)
                                        layers.i.buyables[12].buyMax(times*100)
                                        layers.i.buyables[13].buyMax(times*100)
                                }
                        }
                }
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            //{key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return true},
        prestigeButtonText(){
                return "if you see this bug"
        },
        canReset(){
                return false
        },
        nextUpgradeText(){
                let t = ""
                if (canUnlIUpgForText(13)) t = formatNextIUpgText(11, 10)
                if (canUnlIUpgForText(14)) t = formatNextIUpgText(12, 3)
                if (canUnlIUpgForText(21)) t = formatNextIUpgText(11, 15)
                if (canUnlIUpgForText(22)) t = formatNextIUpgText(12, 5)
                if (canUnlIUpgForText(23)) t = formatNextIUpgText(11, 66)
                if (canUnlIUpgForText(24)) t = formatNextIUpgText(13, 10)
                if (canUnlIUpgForText(31)) t = formatNextIUpgText(12, 14)
                if (canUnlIUpgForText(32)) t = formatNextIUpgText(12, 17)
                if (canUnlIUpgForText(33)) t = formatNextIUpgText(11, 89)
                if (canUnlIUpgForText(34)) t = formatNextIUpgText(13, 19)
                
                return t
        },
        upgrades: {
                rows: 3,
                cols: 4,
                11: {
                        title: "Cache",
                        description: "Incrementy multiplies point gain",
                        cost: new Decimal(2),
                        effect(){
                                let ret = player.i.points.plus(1)
                                if (hasIUpg(24)) ret = player.i.best.plus(1)
                                if (hasIUpg(21)) ret = ret.pow(2)
                                return ret
                        },
                },
                12: {
                        title: "Cash",
                        description: "Unlock the first repeatable upgrade",
                        cost: new Decimal(50),
                        unlocked(){
                                return hasIUpg(11) || hasAMUpgrade(12) || hasIUpg(12)
                        },
                },
                13: {
                        title: "Raze",
                        description: "Unlock the second repeatable upgrade",
                        cost: new Decimal(1e4),
                        unlocked(){
                                return getBuyableAmount("i", 11).gte(10) || hasAMUpgrade(12) || hasIUpg(13)
                        }
                },
                14: {
                        title: "Raise",
                        description: "Unlock the third repeatable upgrade",
                        cost: new Decimal(2e5),
                        unlocked(){
                                return getBuyableAmount("i", 12).gte(3) || hasAMUpgrade(12) || hasIUpg(14)
                        }
                },
                21: {
                        title: "Faze", 
                        description: "Square Cache",
                        cost: new Decimal(2e5),
                        unlocked(){
                                return getBuyableAmount("i", 11).gte(15) || hasAMUpgrade(12) || hasIUpg(21)
                        },
                },
                22: {
                        title: "Phase", 
                        description: "Remove the linear cost scaling of Incrementy Speed",
                        cost: new Decimal(15e7),
                        unlocked(){
                                return getBuyableAmount("i", 12).gte(5) || hasAMUpgrade(12) || hasIUpg(22)
                        },
                },
                23: {
                        title: "Flower", 
                        description: "Remove the linear cost scaling of Incrementy Strength",
                        cost: new Decimal(1e19),
                        unlocked(){
                                return getBuyableAmount("i", 11).gte(66) || hasAMUpgrade(12) || hasIUpg(23)
                        },
                },
                24: {
                        title: "Flour", 
                        description: "Remove the linear cost scaling of Incrementy Stamina and Cache is based on best Incrementy",
                        cost: new Decimal(1e20),
                        unlocked(){
                                return getBuyableAmount("i", 13).gte(10) || hasAMUpgrade(12) || hasIUpg(24)
                        },
                },
                31: {
                        title: "Kernel", 
                        description: "Nerf the superexponential Incrementy Stamina scaling",
                        cost: new Decimal(2e21),
                        unlocked(){
                                return getBuyableAmount("i", 12).gte(14) || hasAMUpgrade(12) || hasIUpg(31)
                        },
                },
                32: {
                        title: "Colonel", 
                        description: "Antimatter effect is applied before Stamina",
                        cost: new Decimal(2e29),
                        unlocked(){
                                return (hasAMUpgrade(13) && getBuyableAmount("i", 12).gte(17)) || hasIUpg(32)
                        },
                },
                33: {
                        title: "Hall", //haul
                        description: "Each Incrementy Strength adds .02 to the Incrementy Strength base (capped at 10)",
                        cost: new Decimal(1e34),
                        unlocked(){
                                return (hasAMUpgrade(13) && getBuyableAmount("i", 11).gte(89)) || hasIUpg(33)
                        },
                },
                34: {
                        title: "Haul", //haul
                        description: "Each Incrementy Speed adds .01 to the Incrementy Speed base (capped at 10)",
                        cost: new Decimal(1e37),
                        unlocked(){
                                return (hasAMUpgrade(13) && getBuyableAmount("i", 13).gte(19)) || hasIUpg(33)
                        },
                },
        },
        buyables: {
                rows: 1,
                cols: 3,
                11: {
                        title: "Incrementy Speed",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + getIBuyableFormat(11) + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(getIBuyableEff(11)) + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getIBuyableCost(11)) + " Incrementy</b><br>"
                                let cformula = "<b><h2>Cost formula</h2>:<br>" + getIncBuyableFormulaText(11) + "</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(layers.i.buyables[11].effectBase()) + "^x</b><br>"
                                return "<br>"+start+eff+cost+cformula+eformula
                        },
                        cost(a){
                                let x = getBuyableAmount("i", 11).plus(a)
                                let base1 = hasIUpg(22) ? 1 : 2
                                let exp2 = x.minus(1).max(0).times(x)
                                return Decimal.pow(base1, x).times(Decimal.pow(1.01, exp2)).times(10)
                        },
                        effectBase(){
                                let x = getBuyableAmount("i", 11)
                                let base = new Decimal(1.5)
                                let hauleff = x.div(100)
                                if (!hasUpgrade("a", 24)) hauleff = hauleff.min(10)
                                if (hasIUpg(34)) base = base.plus(hauleff)
                                return base
                        },
                        effect(){
                                let x = getBuyableAmount("i", 11)
                                let base = layers.i.buyables[11].effectBase()
                                return Decimal.pow(base, x)
                        },
                        canAfford(){
                                return player.i.points.gte(getIBuyableCost(11))
                        },
                        buy(){
                                let cost = getIBuyableCost(11)
                                if (player.i.points.lt(cost)) return
                                player.i.buyables[11] = player.i.buyables[11].plus(1)
                                // some upgrade should make them not actually remove inc
                                if (!hasAMUpgrade(13)) player.i.points = player.i.points.minus(cost)
                        },
                        buyMax(maximum){       
                                if (player.i.points.lt(10)) return
                                if (player.i.points.lt(20)) {
                                        layers.i.buyables[11].buy()
                                        return
                                }
                                let base1 = (hasIUpg(22) ? 1 : 2 / 1.01) 
                                //this wont quite work if we are buying the very first one and only the very first one

                                // let exp2 = x.minus(1).max(0).times(x)
                                let pttarget = player.i.points.div(10).log(1.01)
                                let bfactor = Math.log(base1)/Math.log(1.01)
                                //want to find ax^2+bx = c
                                let c = pttarget //on other side
                                let b = bfactor - 1
                                // let a = 1 this is constant so remove it

                                let target = c.times(4).plus(b * b).sqrt().minus(b).div(2).floor().plus(1)
                                //-b + sqrt(b*b+4*c)

                                let diff = target.minus(player.i.buyables[11]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                player.i.buyables[11] = player.i.buyables[11].plus(diff)

                                //so ew, make sure to do the rest, but ew
                                
                        },
                        unlocked(){ return hasIUpg(12) },
                },
                12: {
                        title: "Incrementy Strength",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + getIBuyableFormat(12) + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(getIBuyableEff(12)) + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getIBuyableCost(12)) + " Incrementy</b><br>"
                                let cformula = "<b><h2>Cost formula</h2>:<br>" + getIncBuyableFormulaText(12) + "</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(layers.i.buyables[12].effectBase()) + "^x</b><br>"
                                return "<br>" + start + eff + cost + cformula + eformula
                        },
                        cost(a){
                                let x = getBuyableAmount("i", 12).plus(a)
                                let base1 = hasIUpg(23) ? 1 : 4
                                return Decimal.pow(base1, x).times(Decimal.pow(1.25, x.times(x))).times(1e4)
                        },
                        effectBase(){
                                let x = getBuyableAmount("i", 12)
                                let base = new Decimal(2)
                                if (hasIUpg(33)) base = base.plus(x.div(50).min(10))
                                return base
                        },
                        effect(){
                                let x = getBuyableAmount("i", 12)
                                let base = layers.i.buyables[12].effectBase()
                                return Decimal.pow(base, x)
                        },
                        canAfford(){
                                return player.i.points.gte(getIBuyableCost(12))
                        },
                        buy(){
                                let cost = getIBuyableCost(12)
                                if (player.i.points.lt(cost)) return
                                player.i.buyables[12] = player.i.buyables[12].plus(1)
                                // some upgrade should make them not actually remove inc
                                if (!hasAMUpgrade(13)) player.i.points = player.i.points.minus(cost)
                        },
                        buyMax(maximum){       
                                if (player.i.points.lt(1e4)) return
                                if (player.i.points.lt(4e4)) {
                                        layers.i.buyables[12].buy()
                                        return
                                }
                                let base1 = (hasIUpg(23) ? 1 : 4) 
                                //this wont quite work if we are buying the very first one and only the very first one

                                //let exp2 = x.times(x)
                                let pttarget = player.i.points.div(1e4).log(1.25)
                                let bfactor = Math.log(base1) / Math.log(1.25)
                                //want to find ax^2+bx = c
                                let c = pttarget //on other side
                                let b = bfactor
                                // let a = 1 this is constant so remove it

                                let target = c.times(4).plus(b * b).sqrt().minus(b).div(2).floor().plus(1)
                                //-b + sqrt(b*b+4*c)

                                let diff = target.minus(player.i.buyables[12]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                player.i.buyables[12] = player.i.buyables[12].plus(diff)

                                //so ew, make sure to do the rest, but ew
                                
                        },
                        unlocked(){ return hasIUpg(13) },
                },
                13: {
                        title: "Incrementy Stamina",
                        display(){
                                let eform = "1.05^x"
                                let scs = getIStaminaSoftcapStart()
                                if (getBuyableAmount("i", 13).gt(scs)) eform = "1.05^(sqrt(x*" + formatWhole(scs) + "))"


                                let start = "<b><h2>Amount</h2>: " + getIBuyableFormat(13) + "</b><br>"
                                let softcapped = getBuyableAmount("i", 13).gt(getIStaminaSoftcapStart())
                                let eff = "<b><h2>Effect</h2>: ^" + format(getIBuyableEff(13)) + (softcapped ? " (softcapped)" : "") + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getIBuyableCost(13)) + " Incrementy</b><br>"
                                let cformula = "<b><h2>Cost formula</h2>:<br>" + getIncBuyableFormulaText(13) + "</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + eform + "</b><br>"
                                return "<br>" + start + eff + cost + cformula + eformula
                        },
                        cost(a){
                                let x = getBuyableAmount("i", 13).plus(a)
                                let xcopy = getBuyableAmount("i", 13).plus(a)
                                let b1 = hasIUpg(24) ? 1 : 2
                                
                                let y = x.minus(4).max(1)
                                if (hasIUpg(31)) {
                                        y = new Decimal(1)
                                        if (x.gt(5/3)) x = x.div(2.5).plus(1)
                                }
                                let base1 = y.div(10).plus(1)
                                let base2 = y.sqrt().div(5).plus(1)
                                
                                let ret = new Decimal(1e5)
                                if (!hasUpgrade("a", 14)) ret = ret.times(Decimal.pow(b1, xcopy).times(Decimal.pow(1.25, xcopy.times(xcopy))))
                                return ret.times(Decimal.pow(base1, Decimal.pow(base2, x)))
                        },
                        effect(){
                                let x = getBuyableAmount("i", 13)
                                let scs = getIStaminaSoftcapStart()
                                if (x.gt(scs)) x = x.div(scs).pow(.5).times(scs)
                                return Decimal.pow(1.05, x)
                        },
                        canAfford(){
                                return player.i.points.gte(getIBuyableCost(13))
                        },
                        buy(){
                                let cost = getIBuyableCost(13)
                                if (player.i.points.lt(cost)) return
                                player.i.buyables[13] = player.i.buyables[13].plus(1)
                                // some upgrade should make them not actually remove inc
                                if (!hasAMUpgrade(13)) player.i.points = player.i.points.minus(cost)
                        },
                        buyMax(maximum){
                                let pts = player.i.points
                                //eventually we can remove all the scalings except b1^b2^x
                                if (hasUpgrade("a", 14)) {
                                        let pttarget = player.i.points.div(1e5)
                                        if (pttarget.lt(1.1)) return
                                        let xtarget = pttarget.log(1.1).log(1.2)
                                        let target = xtarget.minus(1).times(2.5).floor().plus(1)
                                        
                                        let diff = target.minus(player.i.buyables[13]).max(0)
                                        if (maximum != undefined) diff = diff.min(maximum)
                                        player.i.buyables[13] = player.i.buyables[13].plus(diff)
                                        return 
                                }
                                let max = 30
                                if (maximum != undefined) max = Math.min(maximum, 30)
                                for (i = 0; i < max; i++){
                                        layers.i.buyables[13].buy()
                                }
                        },
                        unlocked(){ return hasIUpg(14) },
                },
        },
        tabFormat: ["main-display",
                ["display-text",
                        function() {return hasIUpg(24) && !hasAMUpgrade(13) ? "Your best incrementy is " + format(player.i.best) : ""}],
                ["display-text",
                        function() {return "You are gaining " + format(layers.i.getResetGain()) + " incrementy per second"},
                        {"font-size": "20px"}],
                ["display-text", function () {return layers.i.nextUpgradeText()}],
                "blank",
                "buyables", 
                "blank", 
                "upgrades"],
        doReset(layer){
                if (false) console.log(layer)
                if (layers[layer].row <= 0) return

                //upgrades
                let keep = []
                if (hasUpgrade("am", 12)) keep.push(11, 12, 13, 14)
                if (!hasUpgrade("am", 13)) player.i.upgrades = filter(player.i.upgrades, keep)

                //incrementy
                player.i.points = new Decimal(0)
                player.i.best = new Decimal(0)

                //buyables
                let resetBuyables = [11,12,13]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.i.buyables[resetBuyables[j]] = new Decimal(0)
                }

        },
})

addLayer("am", {
        name: "Antimatter", 
        symbol: "AM", 
        position: 0,
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
        }},
        color: "#DB4C83",
        requires: new Decimal(100), // Can be a function that takes requirement increases into account
        resource: "Antimatter", // Name of prestige currency
        baseAmount() {return getIBuyablesTotalRow(1)}, 
        branches: ["i"],
        type: "custom", 
        effect(){
                if (inChallenge("m", 12)) return new Decimal(1)
                let a = player.am.points

                let ret = a.plus(1).pow(Math.log(3)/Math.log(2))
                if (!hasUpgrade("e", 33)) {
                        if (ret.gt(100)) ret = ret.div(100).sqrt().times(100)
                        if (ret.gt(1000)) ret = ret.div(1000).pow(.25).times(1000)
                        if (ret.gt(1e4)) ret = ret.div(1e4).pow(.125).times(1e4)
                        if (ret.gt(1e5)) ret = ret.log10().times(2).pow(5)
                }
                if (ret.gt(1e10)) ret = ret.log10().pow(10)
                if (ret.gt(1e25)) ret = ret.log10().times(4000).pow(5)
                
                if (hasAMUpgrade(23)) ret = ret.pow(2)
                return ret
        },
        effectDescription(){
                return "which multiplies incrementy and point gain by " + formatWhole(layers.am.effect())
        },
        getResetGain() {
                let amt = layers.am.baseAmount()
                let pre = layers.am.getGainMultPre()
                let exp = layers.am.getGainExp()
                let pst = layers.am.getGainMultPost()
                let ret = amt.sub(99).max(0).times(pre).pow(exp).times(pst).floor()
                if (player.am.best.eq(0) && player.a.best.eq(0)) return ret.min(1)
                return ret
        },
        getGainExp(){
                let x = new Decimal(.5)
                if (hasAMUpgrade(23)) x = x.times(2)
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1)
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)
                x = x.times(layers.a.effect()[1])
                x = x.times(layers.m.effect()[1])
                return x
        },
        prestigeButtonText(){
                let gain = layers.am.getResetGain()
                let start =  "Reset to gain " + formatWhole(gain) + " Antimatter (based on total buyable levels)<br>"
                let pre = layers.am.getGainMultPre()
                let exp = layers.am.getGainExp()
                let pst = layers.am.getGainMultPost()
                let nextAt = "Next at " + formatWhole(gain.plus(1).div(pst).root(exp).div(pre).ceil().plus(99)) + " levels"
                return start + nextAt
        },
        canReset(){
                return layers.am.getResetGain().gt(0)
        },
        update(diff){
                if (!player.am.best) player.am.best = new Decimal(0)
                player.am.best = player.am.best.max(player.am.points)
                if (hasAMUpgrade(21)) player.am.points = player.am.points.plus(layers.am.getResetGain().times(diff))
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            //{key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return getIBuyablesTotalRow(1).gte(98) || player.am.best.gt(0) || player.a.best.gt(0)},
        upgrades: {
                rows: 2,
                cols: 4,
                11: {
                        title: "Plane", 
                        description: "Incrementy multiplies Incrementy gain",
                        cost: new Decimal(2),
                        effect(){
                                let exp = 1
                                return player.i.points.plus(10).log10().pow(exp)
                        },
                },
                12: {
                        title: "Plain", 
                        description: "Triple Incrementy gain, keep the first row of Incrementy Upgrades, and nerf the Incrementy Stamina formula",
                        cost: new Decimal(2),
                        unlocked(){
                                return hasAMUpgrade(11)
                        },
                },
                13: {
                        title: "Sale", //sail
                        description: "Unlock new I upgrades, keep them on AM reset, you can buy 100 Incrementy Buyables, and they don't cost Incrementy",
                        cost: new Decimal(10),
                        unlocked(){
                                return hasAMUpgrade(12)
                        },
                },
                14: {
                        title: "Sail", //sail
                        description: "Incrementy Strength levels multiply base incrementy gain",
                        cost: new Decimal(1e172),
                        currencyDisplayName: "Incrementy",
                        currencyInternalName: "points",
                        currencyLayer: "i",
                        unlocked(){
                                return hasIUpg(34) || hasAMUpgrade(14)
                        },
                },
                21: {
                        title: "Coarse", 
                        description: "Remove the Antimatter prestige, but gain 100% of gain on reset per second",
                        cost: new Decimal(200),
                        unlocked(){
                                return hasAMUpgrade(14) || hasAMUpgrade(21)
                        },
                },
                22: {
                        title: "Course",
                        description: "Incrementy Speed levels multiply base incrementy gain",
                        cost: new Decimal(2000),
                        unlocked(){
                                return hasAMUpgrade(21) || hasAMUpgrade(22)
                        },
                },
                23: {
                        title: "Waive", //wave
                        description: "Square antimatter gain and effect",
                        cost: new Decimal(3000),
                        unlocked(){
                                return hasAMUpgrade(22) || hasAMUpgrade(23)
                        },
                }, 
                24: {
                        title: "Wave", 
                        description: "Incrementy Stamina levels multiple base incrementy gain",
                        cost: new Decimal(1e26),
                        unlocked(){
                                return hasMilestone("a", 4) || hasAMUpgrade(24)
                        },
                }, 
        },
        challenges:{
                rows: 1,
                cols: 2,
                11: {
                        name: "Know?", 
                        challengeDescription: "Get ^.1 of your normal Incrementy gain",
                        rewardDescription: "Incrementy Stamina softcap starts 5 later (40 -> 45)",
                        unlocked(){
                                return hasAUpgrade(11)
                        },
                        goal: new Decimal(1e100),
                        currencyInternalName: "points",
                },
                12: {
                        name: "No!", 
                        challengeDescription: "Get ^.1 of your normal point gain",
                        rewardDescription: "Unlock Matter",
                        unlocked(){
                                return hasAUpgrade(11)
                        },
                        goal: new Decimal(2.22e222),
                        currencyInternalName: "points",
                },
        },
        tabFormat: ["main-display",
                ["display-text",
                        function() {
                                return hasAMUpgrade(21) ? "You are gaining " + format(layers.am.getResetGain()) + " Antimatter per second" : ""
                        },
                        {"font-size": "20px"}],
                ["prestige-button", "", function (){ return hasAMUpgrade(21) ? {'display': 'none'} : {}}],
                "blank", 
                "upgrades",
                "blank",
                "challenges"],
        doReset(layer){
                if (false) console.log(layer)
                if (layers[layer].row <= 1) return

                //upgrades
                let keep = []
                if (!hasMilestone("a", 1)) player.am.upgrades = filter(player.am.upgrades, keep)

                //resource
                player.am.points = new Decimal(0)
                player.am.best = new Decimal(0)
        },
})

addLayer("a", {
        name: "Amoebas", 
        symbol: "A", 
        position: 0,
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
        }},
        color: "#1B4C23",
        requires: Decimal.pow(10, 417), // Can be a function that takes requirement increases into account
        resource: "Amoeba", // Name of prestige currency
        baseAmount() {return player.i.points}, 
        branches: ["am"],
        type: "custom", 
        effect(){
                if (inChallenge("m", 11) || inChallenge("m", 12)) return [new Decimal(1), new Decimal(1)]
                let a = player.a.points
                let eff1 = Decimal.add(1, a).pow(10)
                let eff2 = Decimal.add(2, a).div(2).pow(5)

                if (eff1.log10().gt(400)) eff1 = eff1.log10().div(4).pow(200)
                if (eff2.log10().gt(200)) eff2 = eff2.log10().div(2).pow(100)

                return [eff1, eff2]
        },
        effectDescription(){
                let eff = layers.a.effect()
                return "which multiplies incrementy and point gain by " + format(eff[0]) + " and antimatter gain by " + format(eff[1])
        },
        getResetGain() {
                let amt = layers.a.baseAmount()
                if (amt.lt(Decimal.pow(10, 417))) return new Decimal(0)
                //10^(sqrt(log(inc)-17)/2-10)
                let exp = amt.log10().minus(17).sqrt().div(2).minus(10)
                let ret = Decimal.pow(10, exp).floor()
                if (player.a.best.eq(0)) return ret.min(1)
                return ret
        },
        getGainMult(){
                let x = new Decimal(1)
                return x
        },
        prestigeButtonText(){
                let gain = layers.a.getResetGain()
                let start =  "Reset to gain " + formatWhole(gain) + " Amoeba (based on incrementy)"
                let nextAt = ""
                if (gain.lt(1000) && player.a.best.gt(0)){
                        nextAt = "<br>Next at " + format(Decimal.pow(10, gain.plus(1).log10().plus(10).times(2).pow(2).plus(17))) + " incrementy"
                }
                return start + nextAt
        },
        canReset(){
                return layers.a.getResetGain().gt(0)
        },
        update(diff){
                if (!player.a.best) player.a.best = new Decimal(0)
                player.a.best = player.a.best.max(player.a.points)
                if (hasMilestone("a", 3)) player.a.points = player.a.points.plus(layers.a.getResetGain().times(diff))
        },
        row: 2, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            //{key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.i.best.gt(Decimal.pow(10, 400)) || player.a.best.gt(0)},
        milestones:{
                1: {
                        requirementDescription: "<b>Right</b><br>Requires: 2 Amoebas", 
                        effectDescription: "You keep antimatter upgrades upon reset",
                        done(){
                                return player.a.best.gte(2)
                        },
                },
                2: {
                        requirementDescription: "<b>Rite</b><br>Requires: 5 Amoebas", 
                        effectDescription: "Once per second buy one of each Incrementy buyable",
                        done(){
                                return player.a.best.gte(5)
                        },
                },
                3: {
                        requirementDescription: "<b>Wright</b><br>Requires: 20 Amoebas", 
                        effectDescription: "Remove the ability to prestige, but gain 100% of amoebas on prestige per second",
                        done(){
                                return player.a.best.gte(20)
                        },
                },
                4: {
                        requirementDescription: "<b>Write</b><br>Requires: 5,000 Amoebas", 
                        effectDescription: "<b>Rite</b> buys 100, and unlock Amoeba upgrades and Wave",
                        done(){
                                return player.a.best.gte(5e3)
                        },
                },
        },
        upgrades: {
                rows: 3,
                cols: 4,
                11: {
                        title: "Here", 
                        description: "Unlock two Antimatter Challenges",
                        cost: new Decimal(5e5),
                        unlocked(){
                                return hasMilestone("a", 4)
                        },
                },
                12: {
                        title: "Hear",
                        description: "Unlock two Matter Challenges",
                        cost: new Decimal(5e13),
                        unlocked(){
                                return hasUpgrade("e", 24)
                        },
                },
                13: {
                        title: "Crews",
                        description: "Unlock new Energy Upgrades",
                        cost: new Decimal(1e17),
                        unlocked(){
                                return hasChallenge("m", 12)
                        },
                },
                14: {
                        title: "Cruise",
                        description: "Remove the quadratic cost scaling of Incrementy Stamina",
                        cost: new Decimal(1e35),
                        unlocked(){
                                return hasUpgrade("e", 34)
                        },
                }, 
                21: {
                        title: "Steal",
                        description: "Amoebas boost base Incrementy gain",
                        cost: Decimal.pow(10, 7960),
                        currencyDisplayName: "Incrementy",
                        currencyInternalName: "points",
                        currencyLayer: "i",
                        effect(){
                                return player.a.points.max(10).log10()
                        },
                        unlocked(){
                                return hasUpgrade("a", 14)
                        },
                }, 
                22: {
                        title: "Steel",
                        description: "Antimatter boosts base Incrementy gain",
                        cost: Decimal.pow(10, 8115),
                        currencyDisplayName: "Incrementy",
                        currencyInternalName: "points",
                        currencyLayer: "i",
                        effect(){
                                return player.am.points.max(10).log10()
                        },
                        unlocked(){
                                return hasUpgrade("a", 21)
                        },
                },
                23: {
                        title: "Sign",
                        description: "Matter boosts base Incrementy gain",
                        cost: Decimal.pow(10, 8460),
                        currencyDisplayName: "Incrementy",
                        currencyInternalName: "points",
                        currencyLayer: "i",
                        effect(){
                                return player.m.points.max(10).log10()
                        },
                        unlocked(){
                                return hasUpgrade("a", 22)
                        },
                }, 
                24: {
                        title: "Sine",
                        description: "Uncap Haul",
                        cost: Decimal.pow(10, 8700),
                        currencyDisplayName: "Incrementy",
                        currencyInternalName: "points",
                        currencyLayer: "i",
                        unlocked(){
                                return hasUpgrade("a", 23)
                        },
                }, 
        },
        tabFormat: ["main-display",
                ["display-text",
                        function() {
                                return hasMilestone("a", 3) ? "You are gaining " + format(layers.a.getResetGain()) + " Amoebas per second" : ""
                        },
                        {"font-size": "20px"}],
                ["prestige-button", "", function (){ return hasMilestone("a", 3) ? {'display': 'none'} : {}}],
                "blank",
                "milestones",
                "blank", 
                "upgrades"],
        doReset(layer){
                if (false) console.log(layer)
                if (layers[layer].row <= 2) return

                //upgrades
                let keep = []
                player.am.upgrades = filter(player.a.upgrades, keep)

                //resource
                player.a.points = new Decimal(0)
                player.a.best = new Decimal(0)
        },
})

addLayer("m", {
        name: "Matter", 
        symbol: "M", 
        position: 1,
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
        }},
        color: "#3B1053",
        requires: Decimal.pow(10, 1170), // Can be a function that takes requirement increases into account
        resource: "Matter", // Name of prestige currency
        baseAmount() {return player.i.points}, 
        branches: ["i"],
        type: "custom", 
        effect(){
                let a = player.m.points
                if (!hasMilestone("m", 2)) a = a.plus(1).log10()
                
                let eff1 = Decimal.add(10, a).div(10).pow(10)
                let eff2 = Decimal.add(2, a).div(2).pow(.5)

                if (eff1.gt(1e100)) eff1 = eff1.log10().pow(50)
                if (eff2.gt(1e50)) eff2 = eff2.log10().times(2).pow(25)
                return [eff1, eff2]
        },
        effectDescription(){
                let eff = layers.m.effect()
                return "which multiplies incrementy and point gain by " + format(eff[0]) + " and antimatter gain by " + format(eff[1])
        },
        getResetGain() {
                let amt = layers.m.baseAmount().max(1)
                let mlt = layers.m.getGainMult()
                return amt.root(1170).minus(9).times(mlt).max(0).floor()
        },
        getGainMult(){
                let x = new Decimal(1)
                if (hasUpgrade("e", 12)) x = x.times(getEUpgEff(12))
                if (hasUpgrade("e", 13)) x = x.times(getEUpgEff(13))
                if (hasUpgrade("e", 21)) x = x.times(player.a.points.plus(1))
                if (hasUpgrade("e", 22)) x = x.times(getEUpgEff(22))
                return x
        },
        prestigeButtonText(){
                let gain = layers.m.getResetGain()
                let start =  "Reset to gain " + formatWhole(gain) + " Matter (based on incrementy)"
                let nextAt = ""
                let mlt = layers.m.getGainMult()
                if (gain.lt(1000) && player.m.best.gt(0)){
                        nextAt = "<br>Next at " + format(gain.plus(1).div(mlt).plus(9).pow(1170)) + " incrementy"
                }
                return start + nextAt
        },
        canReset(){
                return layers.m.getResetGain().gt(0)
        },
        update(diff){
                if (hasUpgrade("e", 14)) player.m.points = player.m.points.plus(layers.m.getResetGain().times(diff))
                if (!player.m.best) player.m.best = new Decimal(0)
                player.m.best = player.m.best.max(player.m.points)
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            //{key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return hasChallenge("am", 12)},
        milestones:{
                1: {
                        requirementDescription: "<b>Rain</b><br>Requires: 1 Matter", 
                        //rain, reign, rein
                        effectDescription: "Unlock Energy",
                        done(){
                                return player.m.points.gte(1)
                        },
                },
                2: {
                        requirementDescription: "<b>Reign</b><br>Requires: 1,000 Matter", 
                        //rain, reign, rein
                        effectDescription: "Severly buff matter effect",
                        done(){
                                return player.m.points.gte(1000)
                        },
                },
                3: {
                        requirementDescription: "<b>Rein</b><br>Requires: 50,000 Matter", 
                        //rain, reign, rein
                        effectDescription: "Unlock new Energy upgrades",
                        done(){
                                return player.m.points.gte(5e4)
                        },
                },
        },
        challenges:{
                rows: 1,
                cols: 2,
                11: {
                        name: "Creak", 
                        challengeDescription: "Amoebas base effects are 1 and square root Incrementy gain",
                        rewardDescription: "Incrementy Stamina softcap starts 5 later (45 -> 50)",
                        unlocked(){
                                return hasAUpgrade(12)
                        },
                        goal: new Decimal("1e840"),
                        currencyInternalName: "points",
                },
                12: {
                        name: "Creek", 
                        challengeDescription: "Amoebas and Antimatter base effects are 1 and cube root Incrementy gain",
                        rewardDescription: "Energy multiples Incrementy gain",
                        unlocked(){
                                return hasAUpgrade(12)
                        },
                        goal: new Decimal("1e410"),
                        currencyInternalName: "points",
                },
        },
        tabFormat: ["main-display",
                ["display-text",
                        function() {
                                return hasUpgrade("e", 14) ? "You are gaining " + format(layers.m.getResetGain()) + " Matter per second" : ""
                        },
                        {"font-size": "20px"}],
                ["prestige-button", "", function (){ return hasUpgrade("e", 14) ? {'display': 'none'} : {}}],
                "blank",
                "milestones",
                "blank", 
                "challenges"],
        doReset(layer){
                if (false) console.log(layer)
                if (layers[layer].row <= 1) return

                /*
                //upgrades
                let keep = []
                if (!hasMilestone("a", 1)) player.m.upgrades = filter(player.am.upgrades, keep)
                */

                //resource
                player.m.points = new Decimal(0)
                player.m.best = new Decimal(0)
        },
})

addLayer("e", {
        name: "Energy", 
        symbol: "E", 
        position: 1,
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
        }},
        color: "#E3FF00",
        requires: Decimal.pow(10, 1170), // not needed
        resource: "Energy", // Name of prestige currency
        baseAmount() {return player.m.points.min(player.am.points)},
        branches: ["am", "m"],
        type: "custom", 
        getResetGain() {
                let amt = layers.e.baseAmount()
                let mlt = layers.e.getGainMult()
                return amt.times(mlt)
        },
        getGainMult(){
                let x = new Decimal(1)
                if (hasUpgrade("e", 11)) x = x.times(getEUpgEff(11))
                return x
        },
        prestigeButtonText(){
                return "if you see this bug"
        },
        canReset(){
                return false
        },
        update(diff){
                player.e.points = player.e.points.plus(layers.e.getResetGain().times(diff))

                if (!player.e.best) player.e.best = new Decimal(0)
                player.e.best = player.e.best.max(player.e.points)
        },
        row: 2, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            //{key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return hasMilestone("m", 1)},
        upgrades:{
                rows: 4,
                cols: 4,
                11:{
                        title: "Peace", //piece
                        description: "Incrementy buffs Energy gain",
                        cost: new Decimal(500),
                        effect(){
                                return player.i.points.plus(10).log10().sqrt()
                        }
                },
                12:{
                        title: "Piece", //piece
                        description: "Energy buffs matter gain",
                        cost: new Decimal(1e4),
                        effect(){
                                return player.e.points.plus(1).pow(.5)
                        },
                        unlocked(){
                                return hasUpgrade("e", 11)
                        }
                },
                13:{
                        title: "Vial", //Vile
                        description: "Each level of Incrementy Speed boosts matter gain by 1%",
                        cost: new Decimal(1e8),
                        effect(){
                                let exp = 1
                                if (hasUpgrade("e", 24)) exp *= 2
                                if (hasUpgrade("e", 31)) exp *= 2
                                if (hasUpgrade("e", 32)) exp *= 2
                                return Decimal.pow(1.01, getBuyableAmount("i", 11)).pow(exp)
                        },
                        unlocked(){
                                return hasMilestone("m", 3)
                        }
                },
                14:{
                        title: "Vile", 
                        description: "Remove the ability to Matter prestige, but get 100% of Matter upon prestige per second",
                        cost: new Decimal(1e12),
                        unlocked(){
                                return hasUpgrade("e", 13)
                        },
                },
                21:{
                        title: "Mind", 
                        description: "Amoebas multiply matter gain",
                        cost: new Decimal(1e16),
                        unlocked(){
                                return hasUpgrade("e", 14)
                        },
                },
                22:{
                        title: "Mined", 
                        description: "Each level of Incrementy Stamina boosts matter gain by 33%",
                        cost: new Decimal(1e42),
                        effect(){
                                let exp = 1
                                if (hasUpgrade("e", 34)) exp *= 2
                                return Decimal.pow(1.33, getBuyableAmount("i", 13)).pow(exp)
                        },
                        unlocked(){
                                return hasUpgrade("e", 21)
                        },
                },
                23:{
                        title: "Cell",
                        description: "Energy multiplies Incrementy gain",
                        cost: new Decimal(1e71),
                        unlocked(){
                                return hasUpgrade("e", 22)
                        },
                },
                24:{
                        title: "Sell",
                        description: "Square vial",
                        cost: new Decimal(1e75),
                        unlocked(){
                                return hasUpgrade("e", 23)
                        },
                },
                31:{
                        title: "War",  
                        description: "Square vial",
                        cost: new Decimal(1e95),
                        unlocked(){
                                return hasUpgrade("a", 13)
                        },
                },
                32:{
                        title: "Wore",  
                        description: "Square vial",
                        cost: new Decimal(1e110),
                        unlocked(){
                                return hasUpgrade("e", 31)
                        },
                },
                33:{
                        title: "Rose",  
                        description: "Remove the current Antimatter to Incrementy multiplier softcaps",
                        cost: new Decimal(1e140),
                        unlocked(){
                                return hasUpgrade("e", 32)
                        },
                },
                34:{
                        title: "Rows",  
                        description: "Square Mined",
                        cost: new Decimal(1e220),
                        unlocked(){
                                return hasUpgrade("e", 33)
                        },
                },
                41:{
                        title: "Hare", //hair
                        description: "Will prb cost 1e263 (not yet)",
                        cost: new Decimal("1e2630"),
                        unlocked(){
                                return hasUpgrade("a", 24)
                        },
                },
        },
        tabFormat: ["main-display",
                ["display-text", "Energy generation is based on the least amount of Matter and Antimatter"],
                ["display-text", function(){return "You are getting " + format(layers.e.getResetGain()) + " Energy per second"}],
                "blank",
                "blank", 
                "upgrades"],
        doReset(layer){
                if (false) console.log(layer)
                if (layers[layer].row <= 2) return

                //upgrades
                let keep = []
                player.e.upgrades = filter(player.e.upgrades, keep)

                //resource
                player.e.points = new Decimal(0)
                player.e.best = new Decimal(0)
        },
})
