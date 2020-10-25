function getPointGen() {
	if (!canGenPoints()) return new Decimal(0)

	let gain = new Decimal(1)
        if (hasIUpg(11)) gain = gain.times(getIUpgEff(11))
        gain = gain.times(layers.am.effect())
        gain = gain.times(layers.a.effect()[0])
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
                return ret.times(incGainFactor).max(0)
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
                                        layers.i.buyables[11].buyMax()
                                        layers.i.buyables[12].buyMax()
                                        layers.i.buyables[13].buyMax()
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
                                return "<br>"+start+eff+cost
                        },
                        cost(a){
                                let x = getBuyableAmount("i", 11).plus(a)
                                let base1 = hasIUpg(22) ? 1 : 2
                                let exp2 = x.minus(1).max(0).times(x)
                                return Decimal.pow(base1, x).times(Decimal.pow(1.01, exp2)).times(10)
                        },
                        effect(){
                                let x = getBuyableAmount("i", 11)
                                let base = new Decimal(1.5)
                                if (hasIUpg(34)) base = base.plus(x.div(100).min(8.5))
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
                                return "<br>"+start+eff+cost
                        },
                        cost(a){
                                let x = getBuyableAmount("i", 12).plus(a)
                                let base1 = hasIUpg(23) ? 1 : 4
                                return Decimal.pow(base1, x).times(Decimal.pow(1.25, x.times(x))).times(1e4)
                        },
                        effect(){
                                let x = getBuyableAmount("i", 12)
                                let base = new Decimal(2)
                                if (hasIUpg(33)) base = base.plus(x.div(50).min(8))
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
                                let start = "<b><h2>Amount</h2>: " + getIBuyableFormat(13) + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: ^" + format(getIBuyableEff(13)) + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getIBuyableCost(13)) + " Incrementy</b><br>"
                                return "<br>"+start+eff+cost
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
                                
                                let ret = Decimal.pow(b1, xcopy).times(Decimal.pow(1.25, xcopy.times(xcopy))).times(1e5)
                                return ret.times(Decimal.pow(base1, Decimal.pow(base2, x)))
                        },
                        effect(){
                                let x = getBuyableAmount("i", 13)
                                if (x.gt(40)) x = x.div(40).pow(.5).times(40)
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
                        function() {return hasIUpg(24) ? "Your best incrementy is " + format(player.i.best) : ""}],
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
                let ret = player.am.points.plus(1).pow(Math.log(3)/Math.log(2))
                if (ret.gt(100)) ret = ret.div(100).sqrt().times(100)
                if (ret.gt(1000)) ret = ret.div(1000).pow(.25).times(1000)
                if (ret.gt(1e4)) ret = ret.div(1e4).pow(.125).times(1e4)
                if (ret.gt(1e5)) ret = ret.log10().times(2).pow(5)
                
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
                        description: "Unlock new I upgrades, keep them on AM reset, you can buy max Incrementy Boosts, and they don't cost Incrementy",
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
        tabFormat: ["main-display",
                ["display-text",
                        function() {
                                return hasAMUpgrade(21) ? "You are gaining " + format(layers.am.getResetGain()) + " Antimatter per second" : ""
                        },
                        {"font-size": "20px"}],
                ["prestige-button", "", function (){ return hasAMUpgrade(21) ? {'display': 'none'} : {}}],
                "blank", 
                "upgrades"],
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
                let a = player.a.points
                let eff1 = Decimal.add(1, a).pow(10)
                let eff2 = Decimal.add(2, a).div(2).pow(5)
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
                if (!player.am.best) player.a.best = new Decimal(0)
                player.a.best = player.a.best.max(player.a.points)
                if (hasMilestone("a", 3)) player.a.points = player.a.points.plus(layers.a.getResetGain().times(diff))
        },
        row: 2, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            //{key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.i.best.gt(Decimal.pow(10, 417)) || player.a.best.gt(0)},
        upgrades: {
                rows: 2,
                cols: 4,
        },
        milestones:{
                1: {
                        requirementDescription: "<b>Right</b><br>Requires: 2 Amoebas", 
                        //right, rite, wright, write
                        effectDescription: "You keep antimatter upgrades upon reset",
                        done(){
                                return player.a.points.gte(2)
                        },
                },
                2: {
                        requirementDescription: "<b>Rite</b><br>Requires: 5 Amoebas", 
                        effectDescription: "Once per second buy one of each Incrementy buyable",
                        done(){
                                return player.a.points.gte(5)
                        },
                },
                3: {
                        requirementDescription: "<b>Wright</b><br>Requires: 20 Amoebas", 
                        effectDescription: "Remove the ability to prestige, but gain 100% of amoebas on prestige per second",
                        done(){
                                return player.a.points.gte(20)
                        },
                },
                4: {
                        requirementDescription: "<b>Write</b><br>Requires: 5,000 Amoebas", 
                        effectDescription: "<b>Rite</b> buys max, and unlock Amoeba upgrades and Wave",
                        done(){
                                return player.a.points.gte(5e3)
                        },
                },
        },
        upgrades: {
                rows: 3,
                cols: 4,
                11: {
                        title: "Here", //hear
                        description: "Unlock two Antimatter Challenges (not yet)",
                        cost: new Decimal(5e5),
                        unlocked(){
                                return hasMilestone("a", 4)
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


