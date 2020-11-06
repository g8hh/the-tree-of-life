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

function getNBuyableCost(id){
        return layers.n.buyables[id].cost()
}

function getIBuyableEff(id){
        return layers.i.buyables[id].effect()
}

function getNBuyableEff(id){
        return layers.n.buyables[id].effect()
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
        let init = formatWhole(a)
        let ex = layers.i.buyables[id].extra()
        if (ex.eq(0)) return init
        return init + " + " + formatWhole(ex)
}

function getNBuyableFormat(id){
        let a = getBuyableAmount("n", id)
        return formatWhole(a)
}

function getNExtraBuyableFormat(id){
        let a = layers.n.buyables[id].extra()
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
        //REMEMBER: IT IS A NUMBER NOT A DECIMAL
        if (inChallenge("sp", 21)) return 1
        let ret = 40
        if (hasChallenge("am", 11)) ret += 5
        if (hasChallenge("m", 11)) ret += 5
        if (hasUpgrade("e", 43)) ret += 1
        if (hasUpgrade("e", 54)) ret += 1
        if (hasUpgrade("am", 25)) ret += 3
        if (hasUpgrade("b", 43)) ret += challengeCompletions("b", 22)
        ret += layers.sp.effect()[0].toNumber()
        if (hasUpgrade("s", 42)) ret += player.s.upgrades.length
        if (hasUpgrade("sp", 13)) ret += player.sp.upgrades.length
        if (hasUpgrade("sp", 21)) ret += challengeCompletions("sp", 21)
        ret += layers.pi.effect().toNumber()
        if (hasMilestone("pi", 1)) ret += 2 * player.pi.milestones.length
        if (hasUpgrade("pi", 13)) ret += player.pi.upgrades.length
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
                if (base != 1) linear = format(base, 0) + "^x*"
                return "1e4*" + linear + "1.25^(x^2)"
        }
        if (id == 13){
                let linear = ""
                let b1 = hasIUpg(24) ? 1 : 2
                if (b1 != 1) linear = format(b1, 0) + "^x*"
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

function getBChallengeTotal(){
        return challengeCompletions("b", 11) + challengeCompletions("b", 12) + challengeCompletions("b", 21) + challengeCompletions("b", 22)
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
                if (inChallenge("q", 11))  ret = ret.root(2)
                if (inChallenge("q", 12))  ret = ret.root(3)
                if (inChallenge("q", 21))  ret = ret.root(4)
                if (inChallenge("q", 22))  ret = ret.root(5)
                if (inChallenge("sp", 22)) ret = ret.root(100)

                return ret
        },
        getGainExp(){
                let x = new Decimal(1)
                x = x.times(getIBuyableEff(13))
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1)
                if (hasIUpg(32))          x = x.times(layers.am.effect())
                if (hasAMUpgrade(14))     x = x.times(getBuyableAmount("i", 12).max(1))
                if (hasAMUpgrade(22))     x = x.times(getBuyableAmount("i", 11).max(1))
                if (hasAMUpgrade(24))     x = x.times(getBuyableAmount("i", 13).max(1))
                if (hasAUpgrade(21))      x = x.times(upgradeEffect("a", 21))
                if (hasAUpgrade(22))      x = x.times(upgradeEffect("a", 22))
                if (hasAUpgrade(23))      x = x.times(upgradeEffect("a", 23))
                if (hasUpgrade("e", 41))  x = x.times(upgradeEffect("e", 41))
                if (hasUpgrade("e", 44))  x = x.times(upgradeEffect("e", 44))
                x = x.times(getNBuyableEff(13))
                if (hasUpgrade("g", 24))  x = x.times(upgradeEffect("g", 24))
                if (hasUpgrade("sp", 41)) x = x.times(player.sp.points.plus(1))
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
                x = x.times(getNBuyableEff(21))
                if (hasUpgrade("g", 31)) x = x.times(player.n.points.max(1))
                x = x.times(layers.s.effect())
                x = x.times(player.a.points.plus(1).pow(layers.b.effect()))
                x = x.times(layers.sp.effect()[1])
                return x
        },
        update(diff){
                player.i.points = player.i.points.plus(layers.i.getResetGain().times(diff))
                if (!player.i.best) player.i.best = new Decimal(0)
                player.i.best = player.i.best.max(player.i.points)
                
                if (!player.i.time) player.i.time = 0
                let mult = hasMilestone("sp", 2) ? 3 : 1
                player.i.time += diff * mult
                if (player.i.time > 1) {
                        let times = -Math.floor(player.i.time)
                        player.i.time += times
                        times *= -1
                        let mult = 1
                        if (hasMilestone("a", 4)) mult *= 1e3
                        if (hasUpgrade("b", 23)) mult *= 5
                        if (hasUpgrade("s", 55)) mult *= 10
                        if (hasUpgrade("sp", 45)) mult *= 10
                        if (hasMilestone("a", 2)) {
                                layers.i.buyables[11].buyMax(times * mult)
                                layers.i.buyables[12].buyMax(times * mult)
                                layers.i.buyables[13].buyMax(times * mult)
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
                if (canUnlIUpgForText(22)) t = formatNextIUpgText(11, 19)
                if (canUnlIUpgForText(23)) t = formatNextIUpgText(11, 65)
                if (canUnlIUpgForText(24)) t = formatNextIUpgText(11, 67)
                if (canUnlIUpgForText(31)) t = formatNextIUpgText(12, 14)
                if (canUnlIUpgForText(32)) t = formatNextIUpgText(12, 17)
                if (canUnlIUpgForText(33)) t = formatNextIUpgText(11, 89)
                if (canUnlIUpgForText(34)) t = formatNextIUpgText(13, 19)
                
                return t
        },
        upgrades: {
                rows: 3,
                cols: 5,
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
                                return getBuyableAmount("i", 11).gte(19) || hasAMUpgrade(12) || hasIUpg(22)
                        },
                },
                23: {
                        title: "Flower", 
                        description: "Remove the linear cost scaling of Incrementy Strength",
                        cost: new Decimal(1e19),
                        unlocked(){
                                return getBuyableAmount("i", 11).gte(65) || hasAMUpgrade(12) || hasIUpg(23)
                        },
                },
                24: {
                        title: "Flour", 
                        description: "Remove the linear cost scaling of Incrementy Stamina and Cache is based on best Incrementy",
                        cost: new Decimal(1e20),
                        unlocked(){
                                return getBuyableAmount("i", 11).gte(67) || hasAMUpgrade(12) || hasIUpg(24)
                        },
                },
                31: {
                        title: "Kernel", 
                        description: "Nerf the superexponential Incrementy Stamina scaling",
                        cost: new Decimal(1e21),
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
                        title: "Hall", 
                        description: "Each Incrementy Strength adds .02 to the Incrementy Strength base (capped at 10)",
                        cost: new Decimal(1e34),
                        unlocked(){
                                return (hasAMUpgrade(13) && getBuyableAmount("i", 11).gte(89)) || hasIUpg(33)
                        },
                },
                34: {
                        title: "Haul", 
                        description: "Each Incrementy Speed adds .01 to the Incrementy Speed base (capped at 10)",
                        cost: new Decimal(1e37),
                        unlocked(){
                                return (hasAMUpgrade(13) && getBuyableAmount("i", 13).gte(19)) || hasIUpg(34)
                        },
                },
                15: {
                        title: "Currently,",
                        description: "Each upgrade in this column adds .5 to the Neutrino Generation buyable base",
                        cost: new Decimal("1e59600"),
                        unlocked(){
                                return hasChallenge("q", 11)
                        },
                },
                25: {
                        title: "Always,",
                        description: "Double Quark gain",
                        cost: new Decimal("1e61090"),
                        unlocked(){
                                return hasIUpg(15)
                        },
                },
                35: {
                        title: "Friendless.",
                        description: "Amoeba Gain buyables give free levels to Incrementy Boost buyables",
                        cost: new Decimal("1e66205"),
                        unlocked(){
                                return hasIUpg(25)
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
                                let end = shiftDown ? cformula + eformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        cost(a){
                                let x = getBuyableAmount("i", 11).plus(a)
                                let base1 = hasIUpg(22) ? 1 : 2
                                let exp2 = x.minus(1).max(0).times(x)
                                return Decimal.pow(base1, x).times(Decimal.pow(1.01, exp2)).times(10)
                        },
                        effectBase(){
                                let x = layers.i.buyables[11].total()
                                let base = new Decimal(1.5)
                                let hauleff = x.div(100)
                                if (!hasUpgrade("a", 24)) hauleff = hauleff.min(10)
                                if (hasIUpg(34)) base = base.plus(hauleff)
                                if (hasUpgrade("s", 13)) base = base.plus(1)
                                return base
                        },
                        effect(){
                                let x = layers.i.buyables[11].total()
                                let base = layers.i.buyables[11].effectBase()
                                return Decimal.pow(base, x)
                        },
                        canAfford(){
                                return player.i.points.gte(getIBuyableCost(11)) && player.i.buyables[11].lt(5e5)
                        },
                        total(){
                                return getBuyableAmount("i", 11).plus(layers.i.buyables[11].extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                if (hasUpgrade("s", 22)) ret = ret.plus(player.s.upgrades.length)
                                ret = ret.plus(layers.b.challenges[12].rewardEffect().times(layers.i.buyables[13].total()).floor())
                                return ret
                        },
                        buy(){
                                let cost = getIBuyableCost(11)
                                if (!layers.i.buyables[11].canAfford()) return
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

                                target = target.min(5e5)

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
                                let end = shiftDown ? cformula + eformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        cost(a){
                                let x = getBuyableAmount("i", 12).plus(a)
                                let base1 = hasIUpg(23) ? 1 : 4
                                return Decimal.pow(base1, x).times(Decimal.pow(1.25, x.times(x))).times(1e4)
                        },
                        effectBase(){
                                let x = layers.i.buyables[12].total()
                                let base = new Decimal(2)
                                if (hasIUpg(33)) {
                                        let a = x.div(50)
                                        if (!hasUpgrade("b", 11)) a = a.min(10)
                                        base = base.plus(a)
                                }
                                base = base.plus(layers.b.challenges[11].rewardEffect())
                                return base
                        },
                        effect(){
                                let x = layers.i.buyables[12].total()
                                let base = layers.i.buyables[12].effectBase()
                                return Decimal.pow(base, x)
                        },
                        canAfford(){
                                return player.i.points.gte(getIBuyableCost(12)) && player.i.buyables[12].lt(5e5)
                        },
                        total(){
                                return getBuyableAmount("i", 12).plus(layers.i.buyables[12].extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                if (hasUpgrade("s", 22)) ret = ret.plus(player.s.upgrades.length)
                                if (hasUpgrade("b", 31)) ret = ret.plus(layers.b.challenges[12].rewardEffect().times(layers.i.buyables[13].total()).floor())
                                return ret
                        },
                        buy(){
                                let cost = getIBuyableCost(12)
                                if (!layers.i.buyables[12].canAfford()) return
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

                                target = target.min(5e5)

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
                                if (layers.i.buyables[13].total().gt(scs)) eform = "1.05^(sqrt(x*" + formatWhole(scs) + "))"


                                let start = "<b><h2>Amount</h2>: " + getIBuyableFormat(13) + "</b><br>"
                                let softcapped = layers.i.buyables[13].total().gt(getIStaminaSoftcapStart())
                                let eff = "<b><h2>Effect</h2>: ^" + format(getIBuyableEff(13)) + (softcapped ? " (softcapped)" : "") + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getIBuyableCost(13)) + " Incrementy</b><br>"
                                let cformula = "<b><h2>Cost formula</h2>:<br>" + getIncBuyableFormulaText(13) + "</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + eform + "</b><br>"
                                let end = shiftDown ? cformula + eformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
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
                                let x = layers.i.buyables[13].total()
                                let scs = getIStaminaSoftcapStart()
                                if (x.gt(scs)) x = x.div(scs).pow(.5).times(scs)
                                let ret = Decimal.pow(1.05, x)
                                if (inChallenge("b", 11)) return x.div(20).plus(1)
                                return ret
                        },
                        canAfford(){
                                return player.i.points.gte(getIBuyableCost(13)) && player.i.buyables[13].lt(400)
                        },
                        total(){
                                return getBuyableAmount("i", 13).plus(layers.i.buyables[13].extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                if (hasUpgrade("s", 11)) ret = ret.plus(1)
                                if (hasUpgrade("s", 12)) ret = ret.plus(1)
                                if (hasUpgrade("s", 22)) ret = ret.plus(player.s.upgrades.length)
                                return ret
                        },
                        buy(){
                                let cost = getIBuyableCost(13)
                                if (!layers.i.buyables[13].canAfford()) return
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

                                        target = target.min(400)
                                        
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
                ["display-text", function () {
                        return player.i.best.plus(10).log10().plus(10).log10().gt(9) ? "You cannot buy Incrementy Buyables past 500,000 (400 for Stamina)!" : ""
                }],
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
                if (hasUpgrade("e", 42)) x = x.times(upgradeEffect("e", 42))
                x = x.times(getNBuyableEff(32))
                if (hasAMUpgrade(15)) x = x.times(upgradeEffect("am", 15))
                if (hasUpgrade("s", 11)) x = x.times(10)
                if (hasUpgrade("b", 41)) x = x.times(layers.p.buyables[12].effect())
                x = x.times(layers.sp.effect()[1])
                x = x.times(player.e.points.max(1).pow(layers.sp.challenges[21].rewardEffect()))
                if (hasUpgrade("sp", 21)) x = x.times(player.a.points.max(1).pow(player.sp.upgrades.length))
                if (hasUpgrade("sp", 44)) x = x.times(Decimal.pow(player.a.points.max(1), challengeCompletions("sp", 22)))
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
        layerShown(){return getIBuyablesTotalRow(1).gte(98) || player.am.best.gt(0) || player.a.best.gt(0) || player.s.best.gt(0) || player.sp.best.gt(0)},
        upgrades: {
                rows: 2,
                cols: 5,
                11: {
                        title: "Plane", 
                        description: "Incrementy boosts Incrementy gain",
                        cost: new Decimal(2),
                        effect(){
                                let exp = 1
                                return player.i.points.plus(10).log10().pow(exp)
                        },
                },
                12: {
                        title: "Plain", 
                        description: "Triple Incrementy gain, and keep the first row of Incrementy Upgrades",
                        cost: new Decimal(2),
                        unlocked(){
                                return hasAMUpgrade(11)
                        },
                },
                13: {
                        title: "Sale",
                        description: "Unlock new I upgrades, keep them on AM reset, you can buy 100 Incrementy Buyables, and they don't cost Incrementy",
                        cost: new Decimal(10),
                        unlocked(){
                                return hasAMUpgrade(12)
                        },
                },
                14: {
                        title: "Sail",
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
                        cost: new Decimal(1000),
                        unlocked(){
                                return hasAMUpgrade(21) || hasAMUpgrade(22)
                        },
                },
                23: {
                        title: "Waive",
                        description: "Square antimatter gain and effect",
                        cost: new Decimal(2000),
                        unlocked(){
                                return hasAMUpgrade(22) || hasAMUpgrade(23)
                        },
                }, 
                24: {
                        title: "Wave", 
                        description: "Incrementy Stamina levels multiply base incrementy gain",
                        cost: new Decimal(1e26),
                        unlocked(){
                                return hasMilestone("a", 4) || hasAMUpgrade(24)
                        },
                }, 
                15: {
                        title: "Sweet",
                        description: "Antimatter gain is boosted by Quark Challenge completions",
                        cost: new Decimal("1e687"),
                        effect(){
                                let c = 0
                                if (hasChallenge("q", 11)) c ++
                                if (hasChallenge("q", 12)) c ++
                                if (hasChallenge("q", 21)) c ++
                                if (hasChallenge("q", 22)) c ++
                                return Decimal.pow(1+c, 300)
                        },
                        unlocked(){
                                return hasChallenge("q", 21)
                        },
                }, 
                25: {
                        title: "Suite",
                        description: "Incrementy Softcap starts 3 later <br>(52 -> 55)",
                        cost: new Decimal("1e870"),
                        unlocked(){
                                return hasUpgrade("am", 15)
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
                                return hasAUpgrade(11) || hasUpgrade("s", 14)
                        },
                        goal: new Decimal(1e100),
                        currencyInternalName: "points",
                },
                12: {
                        name: "No!", 
                        challengeDescription: "Get ^.1 of your normal point gain",
                        rewardDescription: "Unlock Matter and the ability to Matter Prestige",
                        unlocked(){
                                return hasAUpgrade(11) || hasUpgrade("s", 14)
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
                if (!hasMilestone("a", 1) && !hasUpgrade("s", 14)) player.am.upgrades = filter(player.am.upgrades, keep)

                if (layers[layer].row >= 3 && !hasUpgrade("s", 14)) {
                        player.am.challenges[11] = 0
                        player.am.challenges[12] = 0
                }

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
                if (exp.lt(0)) return new Decimal(0)
                let ret = Decimal.pow(10, exp).times(layers.a.getGainMult()).floor()
                return ret
        },
        getGainMult(){
                let x = new Decimal(1)
                x = x.times(getNBuyableEff(33))
                if (hasUpgrade("s", 12)) x = x.times(100)
                x = x.times(player.q.points.max(10).log10().pow(layers.b.challenges[21].rewardEffect()))
                x = x.times(layers.sp.effect()[1])
                if (hasUpgrade("pi", 22)) x = x.times(Decimal.pow(player.s.points.plus(1), player.pi.upgrades.length))
                return x
        },
        prestigeButtonText(){
                let gain = layers.a.getResetGain()
                let start =  "Reset to gain " + formatWhole(gain) + " Amoeba (based on incrementy)"
                let nextAt = ""
                if (gain.lt(1000)){
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
        layerShown(){return player.i.best.gt(Decimal.pow(10, 400)) || player.a.best.gt(0) || player.s.best.gt(0) || player.sp.best.gt(0)},
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
                        effectDescription: "<b>Rite</b> buys 1000, and unlock Amoeba upgrades and Wave",
                        done(){
                                return player.a.best.gte(5e3)
                        },
                },
        },
        upgrades: {
                rows: 3,
                cols: 5,
                11: {
                        title: "Here", 
                        description: "Unlock two Antimatter Challenges",
                        cost: new Decimal(3e5),
                        unlocked(){
                                return hasMilestone("a", 4) || hasUpgrade("s", 15)
                        },
                },
                12: {
                        title: "Hear",
                        description: "Unlock two Matter Challenges",
                        cost: new Decimal(5e13),
                        unlocked(){
                                return hasUpgrade("e", 24) || hasUpgrade("s", 15)
                        },
                },
                13: {
                        title: "Crews",
                        description: "Unlock new Energy Upgrades",
                        cost: new Decimal(1e17),
                        unlocked(){
                                return hasChallenge("m", 12) || hasUpgrade("s", 15)
                        },
                },
                14: {
                        title: "Cruise",
                        description: "Remove the quadratic cost scaling of Incrementy Stamina",
                        cost: new Decimal(1e35),
                        unlocked(){
                                return hasUpgrade("e", 34) || hasUpgrade("s", 15)
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
                                return hasUpgrade("a", 14) || hasUpgrade("s", 15)
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
                                return hasUpgrade("a", 21) || hasUpgrade("s", 15)
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
                                return hasUpgrade("a", 22) || hasUpgrade("s", 15)
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
                                return hasUpgrade("a", 23) || hasUpgrade("s", 15)
                        },
                }, 
                15: {
                        title: "Flair", //Flare
                        description: "Amoebas boost Neutrino gain",
                        cost: new Decimal(3e162),
                        effect(){
                                return player.a.points.plus(10).log10().pow(5)
                        },
                        unlocked(){
                                return hasUpgrade("p", 32) || hasUpgrade("s", 15)
                        },
                },
                25: {
                        title: "Flare", //Flare
                        description: "Particle Acceleration base is multiplied by Neutrino Generation total levels",
                        cost: new Decimal(1e167),
                        unlocked(){
                                return hasUpgrade("a", 15) || hasUpgrade("s", 15)
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

                let keep = []
                if (!hasUpgrade("s", 15)) player.a.upgrades = filter(player.a.upgrades, keep)

                //milestones
                let milekeep = []
                if (!hasUpgrade("s", 21)) player.a.milestones = filter(player.a.milestones, milekeep)
                

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
                x = x.times(getNBuyableEff(31))
                x = x.times(layers.p.buyables[13].effect())
                if (hasUpgrade("s", 12)) x = x.times(100)
                x = x.times(layers.sp.effect()[1])
                return x
        },
        prestigeButtonText(){
                let gain = layers.m.getResetGain()
                let start =  "Reset to gain " + formatWhole(gain) + " Matter (based on incrementy)"
                let nextAt = ""
                let mlt = layers.m.getGainMult()
                if (gain.lt(1000)){
                        nextAt = "<br>Next at " + format(gain.plus(1).div(mlt).plus(9).pow(1170)) + " incrementy"
                }
                return start + nextAt
        },
        canReset(){
                return layers.m.getResetGain().gt(0) && hasChallenge("am", 12)
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
        layerShown(){return hasChallenge("am", 12) || player.s.best.gt(0) || player.sp.best.gt(0)},
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
                                return hasAUpgrade(12) || hasUpgrade("s", 14)
                        },
                        goal: new Decimal("1e840"),
                        currencyInternalName: "points",
                },
                12: {
                        name: "Creek", 
                        challengeDescription: "Amoebas and Antimatter base effects are 1 and cube root Incrementy gain",
                        rewardDescription: "Energy multiples Incrementy gain",
                        unlocked(){
                                return hasAUpgrade(12) || hasUpgrade("s", 14)
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

                if (layers[layer].row >= 3) {
                        if (!hasUpgrade("s", 14)) {
                                player.m.challenges[11] = 0
                                player.m.challenges[12] = 0
                        }
                        
                        //milestones
                        let milekeep = []
                        player.m.milestones = filter(player.m.milestones, milekeep)
                }

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
                x = x.times(getNBuyableEff(23))
                x = x.times(layers.sp.effect()[1])
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
        layerShown(){return hasMilestone("m", 1) || player.s.best.gt(0) || player.sp.best.gt(0)},
        upgrades:{
                rows: 5,
                cols: 5,
                11:{
                        title: "Peace", 
                        description: "Incrementy buffs Energy gain",
                        cost: new Decimal(500),
                        effect(){
                                let exp = .5
                                if (hasUpgrade("e", 51)) exp *= Math.max(player.e.upgrades.length, 1)
                                return player.i.points.plus(10).log10().pow(exp)
                        }
                },
                12:{
                        title: "Piece", //piece
                        description: "Energy buffs matter gain",
                        cost: new Decimal(1e4),
                        effect(){
                                let ret = player.e.points.plus(1).pow(.5)
                                if (ret.gt(1e200)) ret = ret.log10().div(2).pow(100)
                                return ret
                        },
                        unlocked(){
                                return hasUpgrade("e", 11) || hasUpgrade("s", 15)
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
                                return hasMilestone("m", 3) || hasUpgrade("s", 15)
                        }
                },
                14:{
                        title: "Vile", 
                        description: "Remove the ability to Matter prestige, but get 100% of Matter upon prestige per second",
                        cost: new Decimal(1e12),
                        unlocked(){
                                return hasUpgrade("e", 13) || hasUpgrade("s", 15)
                        },
                },
                21:{
                        title: "Mind", 
                        description: "Amoebas multiply matter gain",
                        cost: new Decimal(1e16),
                        unlocked(){
                                return hasUpgrade("e", 14) || hasUpgrade("s", 15)
                        },
                },
                22:{
                        title: "Mined", 
                        description: "Each level of Incrementy Stamina boosts matter gain by 33%",
                        cost: new Decimal(1e41),
                        effect(){
                                let exp = 1
                                if (hasUpgrade("e", 34)) exp *= 2
                                return Decimal.pow(1.33, getBuyableAmount("i", 13)).pow(exp)
                        },
                        unlocked(){
                                return hasUpgrade("e", 21) || hasUpgrade("s", 15)
                        },
                },
                23:{
                        title: "Cell",
                        description: "Energy multiplies Incrementy gain",
                        cost: new Decimal(1e71),
                        unlocked(){
                                return hasUpgrade("e", 22) || hasUpgrade("s", 15)
                        },
                },
                24:{
                        title: "Sell",
                        description: "Square vial",
                        cost: new Decimal(1e75),
                        unlocked(){
                                return hasUpgrade("e", 23) || hasUpgrade("s", 15)
                        },
                },
                31:{
                        title: "War",  
                        description: "Square vial",
                        cost: new Decimal(1e95),
                        unlocked(){
                                return hasUpgrade("a", 13) || hasUpgrade("s", 15)
                        },
                },
                32:{
                        title: "Wore",  
                        description: "Square vial",
                        cost: new Decimal(1e110),
                        unlocked(){
                                return hasUpgrade("e", 31) || hasUpgrade("s", 15)
                        },
                },
                33:{
                        title: "Rose",  
                        description: "Remove the current Antimatter to Incrementy multiplier softcaps",
                        cost: new Decimal(1e140),
                        unlocked(){
                                return hasUpgrade("e", 32) || hasUpgrade("s", 15)
                        },
                },
                34:{
                        title: "Rows",  
                        description: "Square Mined",
                        cost: new Decimal(1e220),
                        unlocked(){
                                return hasUpgrade("e", 33) || hasUpgrade("s", 15)
                        },
                },
                41:{
                        title: "Hare",
                        description: "The number of energy upgrades boost base incrementy gain",
                        cost: new Decimal("1e263"),
                        effect(){
                                let l = player.e.upgrades.length
                                if (l < 1) l = 1
                                return Decimal.pow(l, l / 4) 
                        },
                        unlocked(){
                                return hasUpgrade("a", 24) || hasUpgrade("s", 15)
                        },
                },
                42:{
                        title: "Hair",
                        description: "The number of energy upgrades boosts Antimatter gain",
                        cost: new Decimal("1e9450"),
                        effect(){
                                let l = player.e.upgrades.length
                                if (l < 1) l = 1
                                let exp = l
                                if (hasUpgrade("e", 52)) exp *= 2 
                                if (hasUpgrade("e", 53)) exp *= 2 
                                return Decimal.pow(l, exp) 
                        },
                        currencyDisplayName: "Incrementy",
                        currencyInternalName: "points",
                        currencyLayer: "i",
                        unlocked(){
                                return hasUpgrade("e", 41) || hasUpgrade("s", 15)
                        },
                },
                43:{
                        title: "Morning",
                        description: "Incrementy Stamina softcap starts 1 later (50 -> 51)",
                        cost: new Decimal("1e287"),
                        unlocked(){
                                return hasUpgrade("e", 42) || hasUpgrade("s", 15)
                        },
                },
                44:{
                        title: "Mourning", //rename to me in 2020?
                        description: "Energy boosts base Incrementy gain",
                        cost: new Decimal("1e290"),
                        effect(){
                                return player.e.points.max(10).log10()
                        },
                        unlocked(){
                                return hasUpgrade("e", 43) || hasUpgrade("s", 15)
                        },
                },
                51:{
                        title: "Gate",
                        description: "Peace is rasied to the power of Energy upgrades",
                        cost: new Decimal("1e10370"),
                        currencyDisplayName: "Incrementy",
                        currencyInternalName: "points",
                        currencyLayer: "i",
                        unlocked(){
                                return hasUpgrade("e", 44) || hasUpgrade("s", 15)
                        },
                },
                52:{
                        title: "Gait",
                        description: "Square Hair",
                        cost: new Decimal("1e328"),
                        unlocked(){
                                return hasUpgrade("e", 51) || hasUpgrade("s", 15)
                        },
                },
                53:{
                        title: "Boar",
                        description: "Square Hair",
                        cost: new Decimal("1e355"),
                        unlocked(){
                                return hasUpgrade("e", 52) || hasUpgrade("s", 15)
                        },
                },
                54:{
                        title: "Bore",
                        description: "Incrementy Stamina softcap starts 1 later (51 -> 52)",
                        cost: new Decimal("1e385"),
                        unlocked(){
                                return hasUpgrade("e", 53) || hasUpgrade("s", 15)
                        },
                },
                15:{
                        title: "Homophones?",
                        description: "Base Incrementy Gain buyable effect is raised to the tenth power",
                        cost: new Decimal("1e408"),
                        unlocked(){
                                return getBuyableAmount("n", 31).gte(2) || hasUpgrade("s", 15)
                        },
                },
                25:{
                        title: "How",
                        description: "Gain a free Energy Boost buyable",
                        cost: new Decimal("1e418"),
                        unlocked(){
                                return hasUpgrade("e", 15) || hasUpgrade("s", 15)
                        },
                }, 
                35:{
                        title: "Could", 
                        description: "Energy effects Neutrino gain",
                        cost: new Decimal("1e435"),
                        effect(){
                                return player.e.points.plus(10).log10().pow(.5)
                        },
                        unlocked(){
                                return hasUpgrade("e", 25) || hasUpgrade("s", 15)
                        },
                },
                45:{
                        title: "You", //suggest
                        description: "Each Neutrino Generation level past 100 boosts its base by .01 (capped at 10)",
                        cost: new Decimal("1e439"),
                        unlocked(){
                                return getBuyableAmount("n", 12).gte(24) || hasUpgrade("s", 15)
                        },
                },
                55:{
                        title: "Suggest?", //suggest
                        description: "Incrementy buffs Neutrino gain",
                        cost: new Decimal("1e457"),
                        effect(){
                                return player.i.points.plus(10).log10().root(3)
                        },
                        unlocked(){
                                return hasUpgrade("e", 45) || hasUpgrade("s", 15)
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

                
                let keep = []
                if (!hasUpgrade("s", 21)) player.e.upgrades = filter(player.e.upgrades, keep)

                //resource
                player.e.points = new Decimal(0)
                player.e.best = new Decimal(0)
        },
})

addLayer("p", {
        name: "Particles", 
        symbol: "P", 
        position: 2,
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
                time: 0,
        }},
        color: "#FFC0F0",
        requires: Decimal.pow(10, 11475), // not needed
        resource: "Particles", // Name of prestige currency
        baseAmount() {return player.i.points},
        branches: ["i", "n", "g", "q"],
        type: "custom", 
        getResetGain() {
                let amt = layers.p.baseAmount()
                let log = amt.max(10).log10().div(18.36)
                let ret = log.sqrt().div(25)
                let add = new Decimal(hasUpgrade("s", 21) ? 1 : 0)
                if (hasUpgrade("s", 54)) add = add.max(1000)
                if (ret.lt(1)) return new Decimal(0).plus(add)
                return ret.plus(add).times(layers.p.getGainMult())
        },
        getGainMult(){
                let x = new Decimal(1)
                x = x.times(getNBuyableEff(12))
                x = x.times(getNBuyableEff(22))
                if (hasUpgrade("g", 12)) x = x.times(upgradeEffect("g", 12))
                if (hasUpgrade("g", 13)) x = x.times(upgradeEffect("g", 13))
                if (hasUpgrade("g", 22)) x = x.times(upgradeEffect("g", 22))
                if (hasUpgrade("g", 23)) x = x.times(upgradeEffect("g", 23))
                x = x.times(layers.p.buyables[11].effect())
                if (hasUpgrade("s", 13)) x = x.times(100)
                x = x.times(layers.sp.effect()[1])
                if (hasUpgrade("s", 43)) x = x.times(player.i.points.max(1).pow(.0001))
                return x
        },
        prestigeButtonText(){
                return "if you see this bug"
        },
        canReset(){
                return false
        },
        update(diff){
                let gain = layers.p.getResetGain().max(0)
                let a = hasUpgrade("s", 13) ? 1 : 60
                player.p.points = player.p.points.plus(gain.times(diff)).min(gain.times(a)).max(player.p.points)

                if (!player.p.best) player.p.best = new Decimal(0)
                player.p.best = player.p.best.max(player.p.points)

                let mult = hasMilestone("sp", 2) ? 3 : 1
                player.p.time += diff * mult
                if (player.p.time > 1){
                        player.p.time += -1
                        let j = hasUpgrade("s", 41) ? 4 : 1
                        if (hasMilestone("pi", 2)) j *= 5
                        if (hasUpgrade("s", 25)) {
                                for (let i = 0; i < j; i ++) {
                                        if (layers.p.buyables[11].canAfford()) layers.p.buyables[11].buy()
                                        if (layers.p.buyables[12].canAfford()) layers.p.buyables[12].buy()
                                        if (layers.p.buyables[13].canAfford()) layers.p.buyables[13].buy()
                                }
                        }
                }
        },
        upgrades:{
                rows: 3,
                cols: 5,
                11:{
                        title: "Groan",
                        description: "Begin production of Neutrinos",
                        cost: new Decimal(50),
                        unlocked(){
                                return true
                        },
                },
                12:{
                        title: "Grown",
                        description: "Amoebas boost Neutrino gain",
                        cost: new Decimal(6e4),
                        effect(){
                                return player.a.points.plus(10).log10().pow(.5)
                        },
                        unlocked(){
                                return getBuyableAmount("n", 12).gte(9) || hasUpgrade("s", 21)
                        },
                },
                13:{
                        title: "Flea",
                        description: "Particles boost Neutrino gain",
                        cost: new Decimal(2e6),
                        effect(){
                                return player.p.points.plus(10).log10()
                        },
                        unlocked(){
                                return getBuyableAmount("n", 21).gte(6) || hasUpgrade("s", 21)
                        },
                },
                14:{
                        title: "Flee",
                        description: "Neutrinos boost Neutrino gain",
                        cost: new Decimal(11e7),
                        effect(){
                                return player.n.points.plus(10).log10()
                        },
                        unlocked(){
                                return hasUpgrade("p", 13) || hasUpgrade("s", 21)
                        },
                },
                21:{
                        title: "Tier",
                        description: "Begin production of Gluons",
                        cost: new Decimal(3.5e34),
                        unlocked(){
                                return getBuyableAmount("n", 12).gte(31) || hasUpgrade("s", 21)
                        }
                },
                22:{
                        title: "Tear",
                        description: "Gluons boost Neutrinos",
                        cost: new Decimal(3e40),
                        effect(){
                                let ret = player.g.points.max(1)
                                if (ret.gt(1e10)) ret = ret.log10().pow(10)
                                return ret
                        },
                        unlocked(){
                                return getBuyableAmount("n", 12).gte(33) || hasUpgrade("s", 21)
                        }
                },
                23:{
                        title: "Tide", 
                        description: "Each Gluon Upgrade adds .05 to the Neutrino Generation base",
                        cost: new Decimal(2e96),
                        unlocked(){
                                return getBuyableAmount("n", 11).gte(54) || hasUpgrade("s", 21)
                        }
                },
                24:{
                        title: "Tied", 
                        description: "Energy boosts Gluon generation",
                        cost: new Decimal(1.5e128),
                        effect(){
                                return player.e.points.max(10).log10()
                        },
                        unlocked(){
                                return getBuyableAmount("n", 12).gte(64) || hasUpgrade("s", 21)
                        }
                },
                31:{
                        title: "Break", 
                        description: "Begin production of Quarks",
                        cost: new Decimal(1.5e198),
                        unlocked(){
                                return hasUpgrade("g", 54) || hasUpgrade("s", 21)
                        }
                },
                32:{
                        title: "Brake",
                        description: "Unlock a 5th Column of Amoeba Upgrades",
                        cost: new Decimal("7e311"),
                        unlocked(){
                                return hasUpgrade("p", 25) || hasUpgrade("s", 21)
                        }
                },
                33:{
                        title: "Brews",
                        description: "Unlock the third Particle Buyable and P Collision gives free levels to middle column Neutrino buyables",
                        cost: new Decimal("4e352"),
                        unlocked(){
                                return hasUpgrade("p", 32) || hasUpgrade("s", 21)
                        }
                },
                34:{
                        title: "Bruise",
                        description: "Particle Simulation gives free levels to right column Neutrino buyables and gain 1000x Neutrinos", 
                        cost: new Decimal("2.58e423"),
                        unlocked(){
                                return hasUpgrade("p", 33) || hasUpgrade("s", 21)
                        }
                },
                15:{
                        title: "Accelerate!",
                        description: "Unlock the first Particle Buyable", 
                        cost: Decimal.pow(2, 1024),
                        unlocked(){
                                return hasChallenge("q", 22) || hasUpgrade("s", 21)
                        }
                },
                25:{
                        title: "Collision!",
                        description: "Unlock the second Particle Buyable and P Acceleration gives free levels to left column Neutrino buyables", 
                        cost: Decimal.pow(10, 311),
                        unlocked(){
                                return hasUpgrade("p", 15) || hasUpgrade("s", 21)
                        }
                },
                35:{
                        title: "Simulation?",
                        description: "Unlock Shards", 
                        cost: Decimal.pow(10, 502).times(2),
                        unlocked(){
                                return hasUpgrade("p", 34) || hasUpgrade("s", 21)
                        }
                },
        },
        buyables:{
                rows: 1, 
                cols: 3,
                11: {
                        title: "Particle Acceleration",
                        display(){
                                let additional = ""
                                if (layers.p.buyables[11].extra().gt(0)) additional = "+" + formatWhole(layers.p.buyables[11].extra())
                                let start = "<b><h2>Amount</h2>: " + formatWhole(getBuyableAmount("p", 11)) + additional + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(layers.p.buyables[11].effect()) + "<br> to Particles</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(layers.p.buyables[11].cost()) + " Particles</b><br>"
                                //let cformula = "<b><h2>Cost formula</h2>:<br>" + getIncBuyableFormulaText(11) + "</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(layers.p.buyables[11].effectBase()) + "^x</b><br>"
                                let end = shiftDown ? eformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        cost(a){
                                let x = getBuyableAmount("p", 11).plus(a)
                                let exp1 = x.pow(1)
                                let exp2 = x.pow(2)
                                let exp3 = x.pow(3)
                                
                                return Decimal.pow(1e4, exp1).times(Decimal.pow(10, exp2)).times(Decimal.pow(2, exp3)).times(Decimal.pow(2, 1024))
                        },
                        effectBase(){
                                let base = new Decimal(100)
                                if (hasUpgrade("a", 25)) base = base.times(layers.n.buyables[11].total().max(1))
                                if (hasUpgrade("b", 44)) base = base.times(Decimal.pow(1.05, Decimal.times(challengeCompletions("b", 22), layers.p.buyables[13].total())))
                                return base
                        },
                        effect(){
                                let x = layers.p.buyables[11].total()
                                let base = layers.p.buyables[11].effectBase()
                                return Decimal.pow(base, x)
                        },
                        total(){
                                return getBuyableAmount("p", 11).plus(layers.p.buyables[11].extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                if (hasUpgrade("s", 33)) ret = ret.plus(layers.p.buyables[13].total())
                                if (hasUpgrade("s", 34)) ret = ret.plus(layers.p.buyables[12].total())
                                return ret
                        },
                        canAfford(){
                                return player.p.points.gte(layers.p.buyables[11].cost())
                        },
                        buy(){
                                let cost = layers.p.buyables[11].cost()
                                if (player.p.points.lt(cost)) return
                                player.p.buyables[11] = player.p.buyables[11].plus(1)
                                player.p.points = player.p.points.minus(cost)
                        },
                        buyMax(maximum){
                                return 
                                /*       
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
                                */
                        },
                        unlocked(){ return hasUpgrade("p", 15) || player.sp.best.gt(0)},
                },
                12: {
                        title: "Particle Collision",
                        display(){
                                let additional = ""
                                if (layers.p.buyables[12].extra().gt(0)) additional = "+" + formatWhole(layers.p.buyables[12].extra())
                                let start = "<b><h2>Amount</h2>: " + formatWhole(getBuyableAmount("p", 12)) + additional + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(layers.p.buyables[12].effect()) + "<br> to Neutrinos and Quarks</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(layers.p.buyables[12].cost()) + " Particles</b><br>"
                                //let cformula = "<b><h2>Cost formula</h2>:<br>" + getIncBuyableFormulaText(11) + "</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(layers.p.buyables[12].effectBase()) + "^x</b><br>"
                                let end = shiftDown ? eformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        cost(a){
                                let x = getBuyableAmount("p", 12).plus(a)
                                let exp1 = x.pow(1)
                                let exp2 = x.pow(2)
                                let exp3 = x.pow(3)
                                let base1 = Decimal.pow(5, 8)
                                
                                return Decimal.pow(base1, exp1).times(Decimal.pow(25, exp2)).times(Decimal.pow(2, exp3)).times(Decimal.pow(10, 311))
                        },
                        effectBase(){
                                let base = new Decimal(1e7)
                                if (hasUpgrade("b", 23)) base = base.pow(1 + challengeCompletions("b", 12))
                                return base
                        },
                        effect(){
                                let x = layers.p.buyables[12].total()
                                let base = layers.p.buyables[12].effectBase()
                                return Decimal.pow(base, x)
                        },
                        total(){
                                return getBuyableAmount("p", 12).plus(layers.p.buyables[12].extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                if (hasUpgrade("s", 35)) ret = ret.plus(layers.p.buyables[13].total())
                                if (hasUpgrade("b", 21)) ret = ret.plus(challengeCompletions("b", 11))
                                if (hasUpgrade("b", 41)) ret = ret.plus(challengeCompletions("b", 21))
                                return ret
                        },
                        canAfford(){
                                return player.p.points.gte(layers.p.buyables[12].cost())
                        },
                        buy(){
                                let cost = layers.p.buyables[12].cost()
                                if (player.p.points.lt(cost)) return
                                player.p.buyables[12] = player.p.buyables[12].plus(1)
                                player.p.points = player.p.points.minus(cost)
                        },
                        buyMax(maximum){
                                return 
                                /*       
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
                                */
                        },
                        unlocked(){ return hasUpgrade("p", 25) || player.sp.best.gt(0) },
                },
                13: {
                        title: "Particle Simulation",
                        display(){
                                let additional = ""
                                if (layers.p.buyables[13].extra().gt(0)) additional = "+" + formatWhole(layers.p.buyables[13].extra())
                                let start = "<b><h2>Amount</h2>: " + formatWhole(getBuyableAmount("p", 13)) + additional + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(layers.p.buyables[13].effect()) + "<br> to Matter and Neutrinos</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(layers.p.buyables[13].cost()) + " Particles</b><br>"
                                //let cformula = "<b><h2>Cost formula</h2>:<br>" + getIncBuyableFormulaText(11) + "</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(layers.p.buyables[13].effectBase()) + "^x</b><br>"
                                let end = shiftDown ? eformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        cost(a){
                                let x = getBuyableAmount("p", 13).plus(a)
                                let exp1 = x.pow(1)
                                let exp2 = x.pow(2)
                                let exp3 = x.pow(3)

                                return Decimal.pow(3e17, exp1).times(Decimal.pow(1e4, exp2)).times(Decimal.pow(5, exp3)).times(Decimal.pow(10, 422).times(5))
                        },
                        effectBase(){
                                let ret = new Decimal(1e10)
                                if (hasUpgrade("s", 23)) ret = ret.pow(player.p.buyables[13].max(1))
                                return ret
                        },
                        effect(){
                                let x = layers.p.buyables[13].total()
                                let base = layers.p.buyables[13].effectBase()
                                return Decimal.pow(base, x)
                        },
                        total(){
                                return getBuyableAmount("p", 13).plus(layers.p.buyables[13].extra())
                        },
                        extra(){
                                let ret = new Decimal(0)
                                if (hasUpgrade("b", 24)) ret = ret.plus(challengeCompletions("b", 12))
                                if (hasUpgrade("b", 33)) ret = ret.plus(challengeCompletions("b", 11))
                                if (hasUpgrade("b", 33)) ret = ret.plus(challengeCompletions("b", 21))
                                ret = ret.plus(layers.b.challenges[22].rewardEffect()[1])
                                return ret
                        },
                        canAfford(){
                                return player.p.points.gte(layers.p.buyables[13].cost())
                        },
                        buy(){
                                let cost = layers.p.buyables[13].cost()
                                if (player.p.points.lt(cost)) return
                                player.p.buyables[13] = player.p.buyables[13].plus(1)
                                player.p.points = player.p.points.minus(cost)
                        },
                        buyMax(maximum){
                                return 
                                /*       
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
                                */
                        },
                        unlocked(){ return hasUpgrade("p", 33) || player.sp.best.gt(0) },
                },
        },
        row: 2, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            //{key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.i.best.gt(Decimal.pow(10, 11450)) || player.p.best.gt(0) || player.s.best.gt(0) || player.sp.best.gt(0)},
        tabFormat: ["main-display",
                ["display-text", function(){
                        return "You are getting " + format(layers.p.getResetGain()) + " Particles per second (based on Incrementy, requires 1e11475)"
                        }],
                ["display-text", function(){ 
                        let a = hasUpgrade("s", 13) ? 1 : 60
                        return "This maxes at " + formatWhole(a) + " seconds worth of production (" + format(layers.p.getResetGain().times(a)) + ")"
                        }],
                "blank",
                "blank", 
                "upgrades",
                "blank",
                "buyables"],
        doReset(layer){
                if (false) console.log(layer)
                if (layers[layer].row <= 2) return


                //upgrades
                let keep = []
                if (!hasUpgrade("s", 21)) player.p.upgrades = filter(player.p.upgrades, keep)


                //buyables
                let resetBuyables = [11, 12, 13]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.p.buyables[resetBuyables[j]] = new Decimal(0)
                }

                //resource
                player.p.points = new Decimal(0)
                player.p.best = new Decimal(0)
        },
})


addLayer("n", {
        name: "Neutrinos", 
        symbol: "N", 
        position: 2,
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
                time: 0,
        }},
        color: "#B5F146",
        requires: Decimal.pow(10, 11475), // not needed
        resource: "Neutrinos", // Name of prestige currency
        baseAmount() {return player.p.points},
        branches: [],
        type: "custom", 
        getResetGain() {
                if (!hasUpgrade("p", 11)) return new Decimal(0)
                let amt = layers.n.baseAmount()
                let base = amt.div(60).sqrt()
                if (base.gt(1e10)) base = base.log10().pow(10)
                let ret = base.times(layers.n.getGainMult())

                if (inChallenge("sp", 12)) ret = ret.root(100)

                return ret
        },
        getGainMult(){
                let x = new Decimal(1)
                x = x.times(getNBuyableEff(11))
                if (hasUpgrade("p", 12)) x = x.times(upgradeEffect("p", 12))
                if (hasUpgrade("p", 13)) x = x.times(upgradeEffect("p", 13))
                if (hasUpgrade("p", 14)) x = x.times(upgradeEffect("p", 14))
                if (hasUpgrade("e", 35)) x = x.times(upgradeEffect("e", 35))
                if (hasUpgrade("e", 55)) x = x.times(upgradeEffect("e", 55))
                if (hasUpgrade("g", 11)) x = x.times(upgradeEffect("g", 11))
                if (hasUpgrade("p", 22)) x = x.times(upgradeEffect("p", 22))
                x = x.times(layers.p.buyables[12].effect())
                if (hasUpgrade("a", 15)) x = x.times(upgradeEffect("a", 15))
                x = x.times(layers.p.buyables[13].effect())
                if (hasUpgrade("s", 12)) x = x.times(Math.max(player.s.upgrades.length, 1))
                if (hasUpgrade("p", 34)) x = x.times(1000)
                x = x.times(layers.sp.effect()[1])
                return x
        },
        prestigeButtonText(){
                return "if you see this bug"
        },
        canReset(){
                return false
        },
        update(diff){
                let gain = layers.n.getResetGain()
                player.n.points = player.n.points.plus(gain.times(diff))

                if (!player.n.best) player.n.best = new Decimal(0)
                player.n.best = player.n.best.max(player.n.points)

                if (!player.n.time) player.n.time = 0
                let mult = hasMilestone("sp", 2) ? 3 : 1
                player.n.time += diff * mult
                if (player.n.time >= 1) {
                        let times = -Math.floor(player.n.time)
                        player.n.time += times
                        times *= -1
                        if (hasUpgrade("s", 23)) times *= 10
                        if (hasUpgrade("s", 41)) times *= 10
                        if (hasUpgrade("pi", 31)) times *= 2
                        
                        if (hasUpgrade("s", 14)) {
                                layers.n.buyables[11].buyMax(times)
                                layers.n.buyables[12].buyMax(times)
                                layers.n.buyables[13].buyMax(times)
                                layers.n.buyables[21].buyMax(times)
                                layers.n.buyables[22].buyMax(times)
                                layers.n.buyables[23].buyMax(times)
                                layers.n.buyables[31].buyMax(times)
                                layers.n.buyables[32].buyMax(times)
                                layers.n.buyables[33].buyMax(times)
                        }
                }
        },
        buyables:{
                rows: 3,
                cols: 3,
                11: {
                        title: "Neutrino Generation",
                        display(){
                                let additional = ""
                                if (layers.n.buyables[11].extra().gt(0)) additional = "+" + getNExtraBuyableFormat(11)
                                let start = "<b><h2>Amount</h2>: " + getNBuyableFormat(11) + additional + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(getNBuyableEff(11)) + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getNBuyableCost(11)) + " Neutrinos</b><br>"
                                //let cformula = "<b><h2>Cost formula</h2>:<br>" + getIncBuyableFormulaText(11) + "</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(layers.n.buyables[11].effectBase()) + "^x</b><br>"
                                let end = shiftDown ? eformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        cost(a){
                                let x = getBuyableAmount("n", 11).plus(a)
                                let base1 = 4
                                let base2 = 1.25
                                let exp2 = x.times(x)
                                return Decimal.pow(base1, x).times(Decimal.pow(base2, exp2)).times(25)
                        },
                        total(){
                                return getBuyableAmount("n", 11).plus(layers.n.buyables[11].extra())
                        },
                        effect(){
                                let x = layers.n.buyables[11].total()
                                let base = layers.n.buyables[11].effectBase()
                                return Decimal.pow(base, x)
                        },
                        effectBase(){
                                if (inChallenge("sp", 11)) return new Decimal(1)
                                let ret = new Decimal(3)
                                if (hasUpgrade("e", 25)) {
                                        let diff = layers.n.buyables[11].total().div(100).minus(1).max(0)
                                        diff = diff.min(10)
                                        ret = ret.plus(diff)
                                }
                                if (hasUpgrade("g", 21)) ret = ret.plus(.3)
                                if (hasUpgrade("p", 23)) ret = ret.plus(player.g.upgrades.length / 20)
                                if (hasIUpg(15)) {
                                        let a = 1
                                        if (hasIUpg(25)) a ++
                                        if (hasIUpg(35)) a ++
                                        ret = ret.plus(a / 2)
                                }
                                if (hasUpgrade("s", 13)) ret = ret.plus(1)
                                ret = ret.plus(layers.b.challenges[11].rewardEffect())
                                return ret
                        },
                        canAfford(){
                                return player.n.points.gte(getNBuyableCost(11))
                        },
                        extra(){
                                let ret = layers.n.buyables[12].total().plus(layers.n.buyables[21].total()).plus(layers.n.buyables[13].total()).plus(layers.n.buyables[31].total())
                                if (hasUpgrade("g", 25)) ret = ret.plus(layers.n.buyables[13].total())
                                else if (hasUpgrade("g", 15)) ret = ret.plus(layers.n.buyables[13].total().div(3).floor())
                                if (hasUpgrade("g", 45)) ret = ret.plus(layers.n.buyables[33].total())
                                if (hasUpgrade("p", 25)) ret = ret.plus(layers.p.buyables[11].total())
                                if (hasUpgrade("s", 25)) ret = ret.plus(layers.n.buyables[22].total())
                                return ret
                        },
                        buy(){
                                let cost = getNBuyableCost(11)
                                if (player.n.points.lt(cost)) return
                                player.n.buyables[11] = player.n.buyables[11].plus(1)
                                player.n.points = player.n.points.minus(cost)
                        },
                        buyMax(maximum){       
                                if (player.n.points.lt(25)) return
                                let base1 = 4
                                let baseInit = 25
                                let base2 = 1.25

                                let pttarget = player.n.points.div(baseInit).log(base2)
                                let bfactor = Math.log(base1)/Math.log(base2)
                                //want to find ax^2+bx = c
                                let c = pttarget //on other side
                                let b = bfactor
                                // let a = 1 this is constant so remove it

                                let target = c.times(4).plus(b * b).sqrt().minus(b).div(2).floor().plus(1)
                                //-b + sqrt(b*b+4*c)

                                let diff = target.minus(player.n.buyables[11]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                player.n.buyables[11] = player.n.buyables[11].plus(diff)
                        },
                        unlocked(){ return true },
                },
                12: {
                        title: "Particle Generation",
                        display(){
                                let additional = ""
                                if (layers.n.buyables[12].extra().gt(0)) additional = "+" + getNExtraBuyableFormat(12)
                                let start = "<b><h2>Amount</h2>: " + getNBuyableFormat(12) + additional + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(getNBuyableEff(12)) + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getNBuyableCost(12)) + " Neutrinos</b><br>"
                                //let cformula = "<b><h2>Cost formula</h2>:<br>" + getIncBuyableFormulaText(11) + "</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(layers.n.buyables[12].effectBase()) + "^x</b><br>"
                                let end = shiftDown ? eformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        cost(a){
                                let x = getBuyableAmount("n", 12).plus(a)
                                let base1 = 8
                                let base2 = 1.25
                                let exp2 = x.times(x)
                                return Decimal.pow(base1, x).times(Decimal.pow(base2, exp2)).times(500)
                        },
                        total(){
                                return getBuyableAmount("n", 12).plus(layers.n.buyables[12].extra())
                        },
                        effect(){
                                let x = layers.n.buyables[12].total()
                                let base = layers.n.buyables[12].effectBase()
                                return Decimal.pow(base, x)
                        },
                        effectBase(){
                                if (inChallenge("sp", 11)) return new Decimal(1)
                                let ret = new Decimal(1.5)
                                if (hasUpgrade("b", 22)) ret = ret.plus(layers.b.challenges[11].rewardEffect().root(3))
                                ret = ret.plus(layers.b.challenges[22].rewardEffect()[0])
                                return ret
                        },
                        canAfford(){
                                return player.n.points.gte(getNBuyableCost(12))
                        },
                        extra(){
                                let ret = layers.n.buyables[22].total().plus(layers.n.buyables[13].total()).plus(layers.n.buyables[32].total())
                                if (hasUpgrade("g", 41)) ret = ret.plus(layers.n.buyables[31].total())
                                if (hasUpgrade("g", 54)) ret = ret.plus(layers.n.buyables[33].total())
                                if (hasUpgrade("p", 33)) ret = ret.plus(layers.p.buyables[12].total())
                                return ret
                        },
                        buy(){
                                let cost = getNBuyableCost(12)
                                if (player.n.points.lt(cost)) return
                                player.n.buyables[12] = player.n.buyables[12].plus(1)
                                player.n.points = player.n.points.minus(cost)
                        },
                        buyMax(maximum){       
                                if (player.n.points.lt(500)) return
                                let base1 = 8
                                let baseInit = 500
                                let base2 = 1.25

                                let pttarget = player.n.points.div(baseInit).log(base2)
                                let bfactor = Math.log(base1)/Math.log(base2)
                                //want to find ax^2+bx = c
                                let c = pttarget //on other side
                                let b = bfactor
                                // let a = 1 this is constant so remove it

                                let target = c.times(4).plus(b * b).sqrt().minus(b).div(2).floor().plus(1)
                                //-b + sqrt(b*b+4*c)

                                let diff = target.minus(player.n.buyables[12]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                player.n.buyables[12] = player.n.buyables[12].plus(diff)
                        },
                        unlocked(){ return player.n.buyables[11].gte(2) || hasUpgrade("s", 15) },
                },
                13: {
                        title: "Base Incrementy Gain",
                        display(){
                                let additional = ""
                                if (layers.n.buyables[13].extra().gt(0)) additional = "+" + getNExtraBuyableFormat(13)
                                let start = "<b><h2>Amount</h2>: " + getNBuyableFormat(13) + additional + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(getNBuyableEff(13)) + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getNBuyableCost(13)) + " Neutrinos</b><br>"
                                //let cformula = "<b><h2>Cost formula</h2>:<br>" + getIncBuyableFormulaText(11) + "</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(layers.n.buyables[13].effectBase()) + "^x (based on best Incrementy)</b><br>"
                                let end = shiftDown ? eformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        cost(a){
                                let x = getBuyableAmount("n", 13).plus(a)
                                let base1 = 1024
                                let base2 = 25
                                let exp2 = x.times(x)
                                return Decimal.pow(base1, x).times(Decimal.pow(base2, exp2)).times(1e21)
                        },
                        total(){
                                return getBuyableAmount("n", 13).plus(layers.n.buyables[13].extra())
                        },
                        effect(){
                                let x = layers.n.buyables[13].total()
                                let base = layers.n.buyables[13].effectBase()
                                return Decimal.pow(base, x)
                        },
                        effectBase(){
                                if (inChallenge("sp", 11)) return new Decimal(1)
                                let ret = player.i.best.plus(10).log10().max(1e4).div(1e4)
                                if (ret.lt(1)) return new Decimal(1)
                                if (ret.gt(2)) ret = ret.times(50).log10()
                                if (hasUpgrade("e", 15)) ret = ret.pow(10)
                                if (inChallenge("b", 12)) ret = ret.pow(new Decimal(2).div(3 + challengeCompletions("b", 12)))
                                if (inChallenge("b", 21)) return new Decimal(1)
                                return ret
                        },
                        canAfford(){
                                return player.n.points.gte(getNBuyableCost(13))
                        },
                        extra(){
                                let ret = layers.n.buyables[23].total().plus(layers.n.buyables[33].total())
                                if (hasUpgrade("g", 14)) ret = ret.plus(2)
                                if (hasUpgrade("g", 53)) ret = ret.plus(layers.n.buyables[32].total())
                                if (hasUpgrade("p", 34)) ret = ret.plus(layers.p.buyables[13].total())
                                if (hasUpgrade("s", 24)) ret = ret.plus(layers.n.buyables[31].total())
                                return ret
                        },
                        buy(){
                                let cost = getNBuyableCost(13)
                                if (player.n.points.lt(cost)) return
                                player.n.buyables[13] = player.n.buyables[13].plus(1)
                                player.n.points = player.n.points.minus(cost)
                        },
                        buyMax(maximum){       
                                if (player.n.points.lt(1e21)) return
                                let base1 = 1024
                                let baseInit = 1e21
                                let base2 = 25

                                let pttarget = player.n.points.div(baseInit).log(base2)
                                let bfactor = Math.log(base1)/Math.log(base2)
                                //want to find ax^2+bx = c
                                let c = pttarget //on other side
                                let b = bfactor
                                // let a = 1 this is constant so remove it

                                let target = c.times(4).plus(b * b).sqrt().minus(b).div(2).floor().plus(1)
                                //-b + sqrt(b*b+4*c)

                                let diff = target.minus(player.n.buyables[13]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                player.n.buyables[13] = player.n.buyables[13].plus(diff)
                        },
                        unlocked(){ return player.n.buyables[11].gte(12) || hasUpgrade("s", 15) },
                },
                21: {
                        title: "Incrementy Boost",
                        display(){
                                let additional = ""
                                if (layers.n.buyables[21].extra().gt(0)) additional = "+" + getNExtraBuyableFormat(21)
                                let start = "<b><h2>Amount</h2>: " + getNBuyableFormat(21) + additional + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(getNBuyableEff(21)) + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getNBuyableCost(21)) + " Neutrinos</b><br>"
                                //let cformula = "<b><h2>Cost formula</h2>:<br>" + getIncBuyableFormulaText(11) + "</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(layers.n.buyables[21].effectBase()) + "^x (based on best Neutrinos)</b><br>"
                                let end = shiftDown ? eformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        cost(a){
                                let x = getBuyableAmount("n", 21).plus(a)
                                let base1 = 8
                                let base2 = 2.5
                                let exp2 = x.times(x)
                                return Decimal.pow(base1, x).times(Decimal.pow(base2, exp2)).times(5e5)
                        },
                        total(){
                                return getBuyableAmount("n", 21).plus(layers.n.buyables[21].extra())
                        },
                        effect(){
                                let x = layers.n.buyables[21].total()
                                let base = layers.n.buyables[21].effectBase()
                                return Decimal.pow(base, x)
                        },
                        effectBase(){
                                if (inChallenge("sp", 11)) return new Decimal(1)
                                return player.n.best.plus(10).log10().pow(2)
                        },
                        canAfford(){
                                return player.n.points.gte(getNBuyableCost(21))
                        },
                        extra(){
                                let ret = layers.n.buyables[22].total().plus(layers.n.buyables[23].total()).plus(layers.n.buyables[31].total())
                                if (hasUpgrade("g", 52)) ret = ret.plus(layers.n.buyables[32].total())
                                if (hasIUpg(35)) ret = ret.plus(layers.n.buyables[33].total())
                                if (hasUpgrade("p", 25)) ret = ret.plus(layers.p.buyables[11].total())
                                if (hasUpgrade("b", 11)) ret = ret.plus(layers.i.buyables[13].total())
                                return ret
                        },
                        buy(){
                                let cost = getNBuyableCost(21)
                                if (player.n.points.lt(cost)) return
                                player.n.buyables[21] = player.n.buyables[21].plus(1)
                                player.n.points = player.n.points.minus(cost)
                        },
                        buyMax(maximum){       
                                if (player.n.points.lt(5e5)) return
                                let base1 = 8
                                let baseInit = 5e5
                                let base2 = 2.5

                                let pttarget = player.n.points.div(baseInit).log(base2)
                                let bfactor = Math.log(base1)/Math.log(base2)
                                //want to find ax^2+bx = c
                                let c = pttarget //on other side
                                let b = bfactor
                                // let a = 1 this is constant so remove it

                                let target = c.times(4).plus(b * b).sqrt().minus(b).div(2).floor().plus(1)
                                //-b + sqrt(b*b+4*c)

                                let diff = target.minus(player.n.buyables[21]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                player.n.buyables[21] = player.n.buyables[21].plus(diff)
                        },
                        unlocked(){ return player.n.buyables[11].gte(5) || hasUpgrade("s", 15) },
                },
                22: {
                        title: "Particle Boost",
                        display(){
                                let additional = ""
                                if (layers.n.buyables[22].extra().gt(0)) additional = "+" + getNExtraBuyableFormat(22)
                                let start = "<b><h2>Amount</h2>: " + getNBuyableFormat(22) + additional + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(getNBuyableEff(22)) + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getNBuyableCost(22)) + " Neutrinos</b><br>"
                                //let cformula = "<b><h2>Cost formula</h2>:<br>" + getIncBuyableFormulaText(11) + "</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(layers.n.buyables[22].effectBase()) + "^x (based on best Neutrinos)</b><br>"
                                let end = shiftDown ? eformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        cost(a){
                                let x = getBuyableAmount("n", 22).plus(a)
                                let base1 = 256
                                let base2 = 5
                                let exp2 = x.times(x)
                                return Decimal.pow(base1, x).times(Decimal.pow(base2, exp2)).times(1e10)
                        },
                        total(){
                                return getBuyableAmount("n", 22).plus(layers.n.buyables[22].extra())
                        },
                        effect(){
                                let x = layers.n.buyables[22].total()
                                let base = layers.n.buyables[22].effectBase()
                                return Decimal.pow(base, x)
                        },
                        effectBase(){
                                if (inChallenge("sp", 11)) return new Decimal(1)
                                let ret = player.n.best.plus(10).log10().root(2)
                                if (hasUpgrade("g", 32)) ret = ret.plus(layers.n.buyables[11].total().div(100))
                                if (hasUpgrade("g", 33)) ret = ret.plus(player.g.upgrades.length/4)
                                ret = ret.times(layers.sp.challenges[22].rewardEffect())
                                return ret
                        },
                        canAfford(){
                                return player.n.points.gte(getNBuyableCost(22))
                        },
                        extra(){
                                let ret = layers.n.buyables[23].total().plus(layers.n.buyables[32].total())
                                if (hasUpgrade("g", 44)) ret = ret.plus(layers.n.buyables[33].total())
                                if (hasUpgrade("p", 33)) ret = ret.plus(layers.p.buyables[12].total())
                                return ret
                        },
                        buy(){
                                let cost = getNBuyableCost(22)
                                if (player.n.points.lt(cost)) return
                                player.n.buyables[22] = player.n.buyables[22].plus(1)
                                player.n.points = player.n.points.minus(cost)
                        },
                        buyMax(maximum){       
                                if (player.n.points.lt(1e10)) return
                                let base1 = 256
                                let baseInit = 1e10
                                let base2 = 5

                                let pttarget = player.n.points.div(baseInit).log(base2)
                                let bfactor = Math.log(base1)/Math.log(base2)
                                //want to find ax^2+bx = c
                                let c = pttarget //on other side
                                let b = bfactor
                                // let a = 1 this is constant so remove it

                                let target = c.times(4).plus(b * b).sqrt().minus(b).div(2).floor().plus(1)
                                //-b + sqrt(b*b+4*c)

                                let diff = target.minus(player.n.buyables[22]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                player.n.buyables[22] = player.n.buyables[22].plus(diff)
                        },
                        unlocked(){ return player.n.buyables[11].gte(5) || hasUpgrade("s", 15) },
                },
                23: {
                        title: "Energy Boost",
                        display(){
                                let additional = ""
                                if (layers.n.buyables[23].extra().gt(0)) additional = "+" + getNExtraBuyableFormat(23)
                                let start = "<b><h2>Amount</h2>: " + getNBuyableFormat(23) + additional + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(getNBuyableEff(23)) + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getNBuyableCost(23)) + " Neutrinos</b><br>"
                                //let cformula = "<b><h2>Cost formula</h2>:<br>" + getIncBuyableFormulaText(11) + "</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(layers.n.buyables[23].effectBase()) + "^x</b><br>"
                                let end = shiftDown ? eformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        cost(a){
                                let x = getBuyableAmount("n", 23).plus(a)
                                let base1 = Decimal.pow(2, 15)
                                let base2 = 125
                                let exp2 = x.times(x)
                                return Decimal.pow(base1, x).times(Decimal.pow(base2, exp2)).times(1e35)
                        },
                        total(){
                                return getBuyableAmount("n", 23).plus(layers.n.buyables[23].extra())
                        },
                        effect(){
                                let x = layers.n.buyables[23].total()
                                let base = layers.n.buyables[23].effectBase()
                                return Decimal.pow(base, x)
                        },
                        effectBase(){
                                if (inChallenge("sp", 11)) return new Decimal(1)
                                let ret = new Decimal(100)
                                if (hasUpgrade("g", 34)) ret = ret.plus(player.i.buyables[12].div(10))
                                return ret
                        },
                        canAfford(){
                                return player.n.points.gte(getNBuyableCost(23))
                        },
                        extra(){
                                let ret = layers.n.buyables[33].total()
                                if (hasUpgrade("e", 25)) ret = ret.plus(1)
                                if (hasUpgrade("g", 35)) {
                                        let a = 1
                                        if (hasUpgrade("g", 15)) a ++
                                        if (hasUpgrade("g", 25)) a ++
                                        if (hasUpgrade("g", 45)) a ++
                                        if (hasUpgrade("g", 55)) a ++
                                        ret = ret.plus(a)
                                }
                                if (hasUpgrade("p", 34)) ret = ret.plus(layers.p.buyables[13].total())
                                return ret
                        },
                        buy(){
                                let cost = getNBuyableCost(23)
                                if (player.n.points.lt(cost)) return
                                player.n.buyables[23] = player.n.buyables[23].plus(1)
                                player.n.points = player.n.points.minus(cost)
                        },
                        buyMax(maximum){       
                                if (player.n.points.lt(1e35)) return
                                let base1 = Math.pow(2, 15)
                                let baseInit = 1e35
                                let base2 = 125

                                let pttarget = player.n.points.div(baseInit).log(base2)
                                let bfactor = Math.log(base1)/Math.log(base2)
                                //want to find ax^2+bx = c
                                let c = pttarget //on other side
                                let b = bfactor
                                // let a = 1 this is constant so remove it

                                let target = c.times(4).plus(b * b).sqrt().minus(b).div(2).floor().plus(1)
                                //-b + sqrt(b*b+4*c)

                                let diff = target.minus(player.n.buyables[23]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                player.n.buyables[23] = player.n.buyables[23].plus(diff)
                        },
                        unlocked(){ return player.n.buyables[11].gte(12) || hasUpgrade("s", 15) },
                },
                31: {
                        title: "Matter Gain",
                        display(){
                                let additional = ""
                                if (layers.n.buyables[31].extra().gt(0)) additional = "+" + getNExtraBuyableFormat(31)
                                let start = "<b><h2>Amount</h2>: " + getNBuyableFormat(31) + additional + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(getNBuyableEff(31)) + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getNBuyableCost(31)) + " Neutrinos</b><br>"
                                //let cformula = "<b><h2>Cost formula</h2>:<br>" + getIncBuyableFormulaText(11) + "</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(layers.n.buyables[31].effectBase()) + "^x</b><br>"
                                let end = shiftDown ? eformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        cost(a){
                                let x = getBuyableAmount("n", 31).plus(a)
                                let base1 = Decimal.pow(2, 19)
                                let base2 = 1250
                                let exp2 = x.times(x)
                                return Decimal.pow(base1, x).times(Decimal.pow(base2, exp2)).times(1e49)
                        },
                        total(){
                                return getBuyableAmount("n", 31).plus(layers.n.buyables[31].extra())
                        },
                        effect(){
                                let x = layers.n.buyables[31].total()
                                let base = layers.n.buyables[31].effectBase()
                                return Decimal.pow(base, x)
                        },
                        effectBase(){
                                if (inChallenge("sp", 11)) return new Decimal(1)
                                let ret = new Decimal(25)
                                if (hasUpgrade("g", 51)) ret = ret.plus(layers.n.buyables[31].total())
                                return ret
                        },
                        canAfford(){
                                return player.n.points.gte(getNBuyableCost(31))
                        },
                        extra(){
                                let ret = layers.n.buyables[32].total().plus(layers.n.buyables[33].total())
                                if (hasUpgrade("p", 25)) ret = ret.plus(layers.p.buyables[11].total())
                                return ret
                        },
                        buy(){
                                let cost = getNBuyableCost(31)
                                if (player.n.points.lt(cost)) return
                                player.n.buyables[31] = player.n.buyables[31].plus(1)
                                player.n.points = player.n.points.minus(cost)
                        },
                        buyMax(maximum){       
                                if (player.n.points.lt(1e49)) return
                                let base1 = Math.pow(2, 19)
                                let baseInit = 1e49
                                let base2 = 1250

                                let pttarget = player.n.points.div(baseInit).log(base2)
                                let bfactor = Math.log(base1)/Math.log(base2)
                                //want to find ax^2+bx = c
                                let c = pttarget //on other side
                                let b = bfactor
                                // let a = 1 this is constant so remove it

                                let target = c.times(4).plus(b * b).sqrt().minus(b).div(2).floor().plus(1)
                                //-b + sqrt(b*b+4*c)

                                let diff = target.minus(player.n.buyables[31]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                player.n.buyables[31] = player.n.buyables[31].plus(diff)
                        },
                        unlocked(){ return player.n.buyables[11].gte(20) || hasUpgrade("s", 15) },
                },
                32: {
                        title: "Antimatter Gain",
                        display(){
                                let additional = ""
                                if (layers.n.buyables[32].extra().gt(0)) additional = "+" + getNExtraBuyableFormat(32)
                                let start = "<b><h2>Amount</h2>: " + getNBuyableFormat(32) + additional + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(getNBuyableEff(32)) + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getNBuyableCost(32)) + " Neutrinos</b><br>"
                                //let cformula = "<b><h2>Cost formula</h2>:<br>" + getIncBuyableFormulaText(11) + "</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(layers.n.buyables[32].effectBase()) + "^x</b><br>"
                                let end = shiftDown ? eformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        cost(a){
                                let x = getBuyableAmount("n", 32).plus(a)
                                let base1 = Decimal.pow(2, 49)
                                let base2 = 1250
                                let exp2 = x.times(x)
                                return Decimal.pow(base1, x).times(Decimal.pow(base2, exp2)).times(1e82)
                        },
                        total(){
                                return getBuyableAmount("n", 32).plus(layers.n.buyables[32].extra())
                        },
                        effect(){
                                let x = layers.n.buyables[32].total()
                                let base = layers.n.buyables[32].effectBase()
                                return Decimal.pow(base, x)
                        },
                        effectBase(){
                                if (inChallenge("sp", 11)) return new Decimal(1)
                                let ret = new Decimal(100)
                                if (hasUpgrade("s", 32)) ret = ret.plus(layers.n.buyables[32].total().pow(3))
                                if (hasUpgrade("g", 42)) ret = ret.pow(2)
                                if (hasUpgrade("g", 43)) ret = ret.pow(2)
                                return ret
                        },
                        canAfford(){
                                return player.n.points.gte(getNBuyableCost(32))
                        },
                        extra(){
                                let ret = layers.n.buyables[33].total()
                                if (hasUpgrade("p", 33)) ret = ret.plus(layers.p.buyables[12].total())
                                if (hasUpgrade("b", 32)) ret = ret.plus(challengeCompletions("b", 21) * 20)
                                return ret
                        },
                        buy(){
                                let cost = getNBuyableCost(32)
                                if (player.n.points.lt(cost)) return
                                player.n.buyables[32] = player.n.buyables[32].plus(1)
                                player.n.points = player.n.points.minus(cost)
                        },
                        buyMax(maximum){       
                                if (player.n.points.lt(1e82)) return
                                let base1 = Math.pow(2, 49)
                                let baseInit = 1e82
                                let base2 = 1250

                                let pttarget = player.n.points.div(baseInit).log(base2)
                                let bfactor = Math.log(base1)/Math.log(base2)
                                //want to find ax^2+bx = c
                                let c = pttarget //on other side
                                let b = bfactor
                                // let a = 1 this is constant so remove it

                                let target = c.times(4).plus(b * b).sqrt().minus(b).div(2).floor().plus(1)
                                //-b + sqrt(b*b+4*c)

                                let diff = target.minus(player.n.buyables[32]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                player.n.buyables[32] = player.n.buyables[32].plus(diff)
                        },
                        unlocked(){ return player.n.buyables[11].gte(20) || hasUpgrade("s", 15) },
                },
                33: {
                        title: "Amoeba Gain",
                        display(){
                                let additional = ""
                                if (layers.n.buyables[33].extra().gt(0)) additional = "+" + getNExtraBuyableFormat(33)
                                let start = "<b><h2>Amount</h2>: " + getNBuyableFormat(33) + additional + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(getNBuyableEff(33)) + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getNBuyableCost(33)) + " Neutrinos</b><br>"
                                //let cformula = "<b><h2>Cost formula</h2>:<br>" + getIncBuyableFormulaText(11) + "</b><br>"
                                let eformula = "<b><h2>Effect formula</h2>:<br>" + format(layers.n.buyables[33].effectBase()) + "^x</b><br>"
                                let end = shiftDown ? eformula : "Shift to see details"
                                return "<br>" + start + eff + cost + end
                        },
                        cost(a){
                                let x = getBuyableAmount("n", 33).plus(a)
                                let base1 = Decimal.pow(2, 214)
                                let base2 = Decimal.pow(5, 10).times(Decimal.pow(2, 18))
                                let exp2 = x.times(x)
                                return Decimal.pow(base1, x).times(Decimal.pow(base2, exp2)).times(1e150)
                        },
                        total(){
                                return getBuyableAmount("n", 33).plus(layers.n.buyables[33].extra())
                        },
                        effect(){
                                let x = layers.n.buyables[33].total()
                                let base = layers.n.buyables[33].effectBase()
                                return Decimal.pow(base, x)
                        },
                        effectBase(){
                                if (inChallenge("sp", 11)) return new Decimal(1)
                                let ret = new Decimal(10)
                                if (hasUpgrade("g", 54)) ret = ret.times(layers.n.buyables[33].total())
                                ret = ret.pow(.1)
                                if (hasUpgrade("g", 55)) ret = ret.pow(2)
                                if (hasUpgrade("b", 12)) ret = ret.plus(challengeCompletions("b", 11))
                                if (hasUpgrade("sp", 14)) ret = ret.pow(upgradeEffect("sp", 14))
                                return ret
                        },
                        canAfford(){
                                return player.n.points.gte(getNBuyableCost(33))
                        },
                        extra(){
                                let ret = new Decimal(0)
                                if (hasUpgrade("p", 34)) ret = ret.plus(layers.p.buyables[13].total())
                                if (hasUpgrade("s", 15)) ret = ret.plus(1)
                                if (hasUpgrade("b", 12)) ret = ret.plus(challengeCompletions("b", 11))
                                return ret
                        },
                        buy(){
                                let cost = getNBuyableCost(33)
                                if (player.n.points.lt(cost)) return
                                player.n.buyables[33] = player.n.buyables[33].plus(1)
                                player.n.points = player.n.points.minus(cost)
                        },
                        buyMax(maximum){       
                                if (player.n.points.lt(1e150)) return
                                let base1 = Math.pow(2, 214)
                                let baseInit = 1e150
                                let base2 = Math.pow(5, 10)*Math.pow(2, 18)

                                let pttarget = player.n.points.div(baseInit).log(base2)
                                let bfactor = Math.log(base1)/Math.log(base2)
                                //want to find ax^2+bx = c
                                let c = pttarget //on other side
                                let b = bfactor
                                // let a = 1 this is constant so remove it

                                let target = c.times(4).plus(b * b).sqrt().minus(b).div(2).floor().plus(1)
                                //-b + sqrt(b*b+4*c)

                                let diff = target.minus(player.n.buyables[33]).max(0)
                                if (maximum != undefined) diff = diff.min(maximum)
                                player.n.buyables[33] = player.n.buyables[33].plus(diff)
                        },
                        unlocked(){ return player.n.buyables[11].gte(20) || hasUpgrade("s", 15) },
                },
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            //{key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return hasUpgrade("p", 11) || player.s.best.gt(0) || player.sp.best.gt(0)},
        tabFormat: ["main-display",
                ["display-text", function(){return "You are getting " + format(layers.n.getResetGain()) + " Neutrinos per second (based on particles)"}],
                ["display-text", "Each buyable has an effect and gives a free level to all upgrades directly to the left or above it"],
                "blank",
                "blank", 
                "buyables"],
        doReset(layer){
                if (false) console.log(layer)
                if (layers[layer].row <= 1) return

                //resource
                player.n.points = new Decimal(0)
                player.n.best = new Decimal(0)

                //buyables
                let resetBuyables = [11,12,13,21,22,23,31,32,33]
                for (let j = 0; j < resetBuyables.length; j++) {
                        player.n.buyables[resetBuyables[j]] = new Decimal(0)
                }
        },
})

addLayer("g", {
        name: "Gluons", 
        symbol: "G", 
        position: 3,
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
        }},
        color: "#744100",
        requires: Decimal.pow(10, 11475), // not needed
        resource: "Gluons", // Name of prestige currency
        baseAmount() {return player.p.points},
        branches: [],
        type: "custom", 
        getResetGain() {
                if (!hasUpgrade("p", 21)) return new Decimal(0)
                let amt = layers.g.baseAmount()
                let base = amt.div(3.5e34).sqrt()
                if (base.lt(1)) return new Decimal(0)
                base = base.minus(1)
                if (base.lt(1)) base = base.sqrt()
                return base.times(layers.g.getGainMult())
        },
        getGainMult(){
                let x = new Decimal(1)
                if (hasUpgrade("p", 24)) x = x.times(upgradeEffect("p", 24))
                if (hasUpgrade("s", 23)) x = x.times(layers.p.buyables[13].effect())
                x = x.times(layers.sp.effect()[1])
                return x
        },
        prestigeButtonText(){
                return "if you see this bug"
        },
        canReset(){
                return false
        },
        update(diff){
                let gain = layers.g.getResetGain()
                player.g.points = player.g.points.plus(gain.times(diff))

                if (!player.g.best) player.g.best = new Decimal(0)
                player.g.best = player.g.best.max(player.g.points)
        },
        upgrades:{
                //1st col boosts left col, 4th col boosts right col
                //bot 2 row boost bot row, top 2 rows boost top row 
                rows: 5,
                cols: 5,
                11: {
                        title: "Won",
                        description: "Best Gluons boost Neutrino gain",
                        cost: new Decimal(10),
                        effect(){
                                let ret = player.g.best.max(1).root(10).times(20)
                                if (ret.gt(1000)) ret = ret.log10().plus(7).pow(3)
                                return ret
                        },
                        unlocked(){
                                return true
                        },
                },
                12: {
                        title: "One",
                        description: "Best Gluons boost Particle gain",
                        cost: new Decimal(15),
                        effect(){
                                let ret = player.g.best.max(1).root(20).times(20)
                                if (ret.gt(100)) ret = ret.log10().times(5).pow(2)
                                return ret
                        },
                        unlocked(){
                                return hasUpgrade("g", 11) || hasUpgrade("s", 15)
                        },
                },
                13: {
                        title: "Build", //Pair/pear
                        description: "Incrementy boosts Particle gain", 
                        cost: new Decimal(300),
                        effect(){
                                let ret = player.i.best.max(10).log10().root(4)
                                return ret
                        },
                        unlocked(){
                                return hasUpgrade("g", 12) || hasUpgrade("s", 15)
                        },
                },
                14: {
                        title: "Billed",
                        description: "Add two free levels to Base Incrementy Gain Neutrino buyable", 
                        cost: new Decimal(1e15),
                        unlocked(){
                                return hasUpgrade("g", 13) || hasUpgrade("s", 15)
                        },
                },
                21: {
                        title: "Main",
                        description: "Add .3 to the Neutrino Generation base", 
                        cost: new Decimal(5e21),
                        unlocked(){
                                return hasUpgrade("g", 14) || hasUpgrade("s", 15)
                        },
                },
                22: {
                        title: "Mane",
                        description: "Boost Particle gain based on Gluon upgrades", 
                        cost: new Decimal(5e24),
                        effect(){
                                let l = player.g.upgrades.length
                                return Decimal.pow(l, l/2)
                        },
                        unlocked(){
                                return hasUpgrade("g", 21) || hasUpgrade("s", 15)
                        },
                },
                23: {
                        title: "Sole",
                        description: "Boost Particle gain based on Energy", 
                        cost: new Decimal(1e26),
                        effect(){
                                return player.e.points.plus(10).log10()
                        },
                        unlocked(){
                                return hasUpgrade("g", 22) || hasUpgrade("s", 15)
                        },
                },
                24: {
                        title: "Soul",
                        description: "Boost Base Incrementy gain based on Gluons", 
                        cost: new Decimal(1e27),
                        effect(){
                                return player.g.points.plus(10).log10().pow(5)
                        },
                        unlocked(){
                                return hasUpgrade("g", 23) || hasUpgrade("s", 15)
                        },
                },
                31: {
                        title: "Muscle",
                        description: "Neutrinos multiply Incrementy gain", 
                        cost: new Decimal(1e28),
                        unlocked(){
                                return hasUpgrade("g", 24) || hasUpgrade("s", 15)
                        },
                },
                32: {
                        title: "Mussel",
                        description: "Each Neutrino Generation Buyable adds .01 to the Particle Boost buyable base", 
                        cost: new Decimal(1e29),
                        unlocked(){
                                return hasUpgrade("g", 31) || hasUpgrade("s", 15)
                        },
                },
                33: {
                        title: "Read",
                        description: "Each Gluon Upgrades adds .25 to the Particle Boost buyable base", 
                        cost: new Decimal(3e30),
                        unlocked(){
                                return hasUpgrade("g", 32) || hasUpgrade("s", 15)
                        },
                },
                34: {
                        title: "Reed",
                        description: "Each Incrementy Strength adds .1 to the Energy Boost buyable base", 
                        cost: new Decimal(1e32),
                        unlocked(){
                                return hasUpgrade("g", 33) || hasUpgrade("s", 15)
                        },
                },
                41: {
                        title: "Read?",
                        description: "Matter Gain buyables also give free levels to Particle Generation", 
                        cost: new Decimal(1e40),
                        unlocked(){
                                return hasUpgrade("g", 34) || hasUpgrade("s", 15)
                        },
                },
                42: {
                        title: "Red!",
                        description: "Square Antimater generation base", 
                        cost: new Decimal(1e48),
                        unlocked(){
                                return hasUpgrade("g", 41) || hasUpgrade("s", 15)
                        },
                },
                43: {
                        title: "Idle",
                        description: "Square Antimater generation base", 
                        cost: new Decimal(1e51),
                        unlocked(){
                                return hasUpgrade("g", 42) || hasUpgrade("s", 15)
                        },
                },
                44: {
                        title: "Idol",
                        description: "Amoeba Gain buyables also give free levels to Particle Boost", 
                        cost: new Decimal(1e52),
                        unlocked(){
                                return hasUpgrade("g", 43) || hasUpgrade("s", 15)
                        },
                },
                51: {
                        title: "Moat",
                        description: "Each Matter Gain buyable adds 1 to its base", 
                        cost: new Decimal(5e63),
                        unlocked(){
                                return hasUpgrade("g", 44) || hasUpgrade("s", 15)
                        },
                },
                52: {
                        title: "Mote",
                        description: "Antimatter Gain buyables also gives free levels to Incrementry Boost", 
                        cost: new Decimal(2e64),
                        unlocked(){
                                return hasUpgrade("g", 51) || hasUpgrade("s", 15)
                        },
                },
                53: {
                        title: "Blue",
                        description: "Antimatter Gain buyables also gives free levels to Base Incrementy Gain", 
                        cost: new Decimal(1e68),
                        unlocked(){
                                return hasUpgrade("g", 52) || hasUpgrade("s", 15)
                        },
                },
                54: {
                        title: "Blew",
                        description: "Amoeba Gain buyables boost its effect base and give free levels to Particle Generation", 
                        cost: new Decimal(1e84),
                        unlocked(){
                                return hasUpgrade("g", 53) || hasUpgrade("s", 15)
                        },
                },
                15: {
                        title: "How", //how do we name these?
                        description: "Every third Base Incrementy Gain buyable gives an additional free level to Neutrino Generation", 
                        cost: new Decimal(3e100),
                        unlocked(){
                                return hasChallenge("q", 12) || hasUpgrade("s", 15)
                        },
                },
                25: {
                        title: "Do", //how do we name these?
                        description: "The above upgrade gives free additional levels to Neutrino Generation no matter what", 
                        cost: new Decimal(1e113),
                        unlocked(){
                                return player.n.buyables[11].gte(103) || hasUpgrade("s", 15)
                        },
                },
                35: {
                        title: "We", //how do we name these?
                        description: "Each upgrade in this column gives a free Energy Boost buyable", 
                        cost: new Decimal(1e129),
                        unlocked(){
                                return hasUpgrade("g", 25) || hasUpgrade("s", 15)
                        },
                },
                45: {
                        title: "Name", //how do we name these?
                        description: "Amoeba Gain buyables give free Neutrino Generation buyables", 
                        cost: new Decimal(1e137),
                        unlocked(){
                                return hasUpgrade("g", 35) || hasUpgrade("s", 15)
                        },
                },
                55: {
                        title: "These?", //how do we name these?
                        description: "Amoeba Gain buyables base is squared", 
                        cost: new Decimal(1e141),
                        unlocked(){
                                return hasUpgrade("am", 15) || hasUpgrade("s", 15)
                        },
                },
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            //{key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return hasUpgrade("p", 21) || player.s.best.gt(0) || player.sp.best.gt(0)},
        tabFormat: ["main-display",
                ["display-text", function(){return "You are getting " + format(layers.g.getResetGain()) + " Gluons per second (based on particles)"}],
                "blank",
                "blank", 
                "upgrades"],
        doReset(layer){
                if (false) console.log(layer)
                if (layers[layer].row <= 1) return

                //upgrades
                let keep = []
                if (!hasUpgrade("s", 15)) player.g.upgrades = filter(player.g.upgrades, keep)

                //resource
                player.g.points = new Decimal(0)
                player.g.best = new Decimal(0)
        },
})

addLayer("q", {
        name: "Quarks", 
        symbol: "Q", 
        position: 4,
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
        }},
        color: "#A40130",
        requires: Decimal.pow(10, 11475), // not needed
        resource: "Quarks", // Name of prestige currency
        baseAmount() {return player.p.points},
        branches: [],
        type: "custom", 
        getResetGain() {
                if (!hasUpgrade("p", 31)) return new Decimal(0)
                let amt = layers.q.baseAmount()
                let base = amt.div(1.5e198).sqrt()
                if (base.lt(1)) return new Decimal(0)
                base = base.minus(1)
                if (base.lt(1)) base = base.cbrt()
                return base.times(layers.q.getGainMult())
        },
        getGainMult(){
                let x = new Decimal(1)
                if (hasIUpg(25)) x = x.times(2)
                x = x.times(layers.p.buyables[12].effect())
                x = x.times(layers.sp.effect()[1])
                return x
        },
        getChallGoalExp(){
                let q = player.q.points
                if (q.gt(100)) q = q.log10().times(50)
                if (q.gt(1e4)) q = q.log10().times(2.5).pow(4)
                if (q.gt(1e10)) q = q.log10().pow(10)
                return q.plus(10).log10().plus(9).log10().pow(-1)
        },
        prestigeButtonText(){
                return "if you see this bug"
        },
        canReset(){
                return false
        },
        update(diff){
                let gain = layers.q.getResetGain()
                player.q.points = player.q.points.plus(gain.times(diff))

                if (!player.q.best) player.q.best = new Decimal(0)
                player.q.best = player.q.best.max(player.q.points)
        },
        challenges: {
                rows: 2,
                cols: 2,
                11: {
                        name: "Son",
                        challengeDescription: "Square root Incrementy gain",
                        rewardDescription: "Unlock a 5th column of Incrementy Upgrades",
                        unlocked(){
                                return true
                        },
                        currencyDisplayName: "Incrementy",
                        currencyInternalName: "points",
                        currencyLayer: "i",
                        goal(){
                                let exp = layers.q.getChallGoalExp()
                                return Decimal.pow(10, 7125).pow(exp)
                        },
                },
                12: {
                        name: "Sun",
                        challengeDescription: "Cube root Incrementy gain",
                        rewardDescription: "Unlock a 5th column of Gluon Upgrades",
                        unlocked(){
                                return true
                        },
                        currencyDisplayName: "Incrementy",
                        currencyInternalName: "points",
                        currencyLayer: "i",
                        goal(){
                                let exp = layers.q.getChallGoalExp()
                                return Decimal.pow(10, 4765).pow(exp)
                        },
                },
                21: {
                        name: "Pole",
                        challengeDescription: "Fourth root Incrementy gain",
                        rewardDescription: "Unlock a 5th column of Antimatter Upgrades",
                        unlocked(){
                                return true
                        },
                        currencyDisplayName: "Incrementy",
                        currencyInternalName: "points",
                        currencyLayer: "i",
                        goal(){
                                let exp = layers.q.getChallGoalExp()
                                return Decimal.pow(10, 3855).pow(exp)
                        },
                },
                22: {
                        name: "Poll",
                        challengeDescription: "Fifth root Incrementy gain",
                        rewardDescription: "Unlock a 5th column of Particle Upgrades",
                        unlocked(){
                                return true
                        },
                        currencyDisplayName: "Incrementy",
                        currencyInternalName: "points",
                        currencyLayer: "i",
                        goal(){
                                let exp = layers.q.getChallGoalExp()
                                return Decimal.pow(10, 3270).pow(exp)
                        },
                },
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            //{key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return hasUpgrade("p", 31) || player.s.best.gt(0) || player.sp.best.gt(0)},
        tabFormat: ["main-display",
                ["display-text", function(){return "You are getting " + format(layers.q.getResetGain()) + " Quarks per second (based on particles)"}],
                ["display-text", function(){return "Your Quark amount raises Quark challenge goals to the power of " + format(layers.q.getChallGoalExp(), 4)}],
                "blank",
                "blank", 
                "challenges"],
        doReset(layer){
                if (false) console.log(layer)
                if (layers[layer].row <= 1) return

                if (layers[layer].row >= 3 && !hasUpgrade("s", 14)) {
                        player.q.challenges[11] = 0
                        player.q.challenges[12] = 0
                        player.q.challenges[21] = 0
                        player.q.challenges[22] = 0
                }

                //resource
                player.q.points = new Decimal(0)
                player.q.best = new Decimal(0)
        },
})

addLayer("s", {
        name: "Shard", 
        symbol: "S", 
        position: 2,
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
        }},
        color: "#1346DF",
        requires: Decimal.pow(10, 502), 
        resource: "Shards",
        baseAmount() {return player.p.points}, 
        branches: ["p"],
        type: "custom", 
        effect(){
                let amt = player.s.points
                if (amt.eq(0) && player.s.best.plus(player.sp.best).gte(1)) amt = new Decimal(1)
                if (amt.lt(9)) return Decimal.pow(1e4, amt.root(3))
                let ret = amt.pow(10)
                return ret
        },
        effectDescription(){
                let a = "which multiplies incrementy gain by " + formatWhole(layers.s.effect()) + "."
                let b = " The effect is always at least 10,000 once you have Shard reset once"
                if (player.s.best.gt(100)) return a
                return a + b 
        },
        getResetGain() {
                let amt = layers.s.baseAmount()
                let pre = layers.s.getGainMultPre()
                let exp = layers.s.getGainExp()
                let pst = layers.s.getGainMultPost()
                let ret = amt.div("1e500").max(1).log10().div(2).times(pre).pow(exp).times(pst)
                return ret.floor()
        },
        getGainExp(){
                let x = new Decimal(.5)
                if (hasUpgrade("s", 33)) x = x.times(3)
                if (hasUpgrade("s", 43)) x = x.times(3)
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1)
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)
                if (hasUpgrade("s", 34)) x = x.times(Decimal.pow(2, layers.n.buyables[33].extra()))
                x = x.times(layers.sp.effect()[1])
                if (hasUpgrade("s", 44)) x = x.times(player.i.points.max(1).pow(.0001).pow(.0002))
                x = x.times(layers.sp.challenges[12].rewardEffect())
                if (hasUpgrade("sp", 33)) x = x.times(Decimal.pow(player.sp.points.max(1), challengeCompletions("sp", 21)))
                return x
        },
        prestigeButtonText(){
                let gain = layers.s.getResetGain()
                let start =  "Reset to gain " + formatWhole(gain) + " Shards<br>"
                let pre = layers.s.getGainMultPre()
                let exp = layers.s.getGainExp()
                let pst = layers.s.getGainMultPost()
                let nextAt = "Next at " + format(Decimal.pow(10, gain.plus(1).div(pst).root(exp).div(pre).times(2).plus(500))) + " particles"
                return start + nextAt
        },
        canReset(){
                return layers.s.getResetGain().gt(0) && hasUpgrade("p", 35)
        },
        update(diff){
                if (!player.s.best) player.s.best = new Decimal(0)
                player.s.best = player.s.best.max(player.s.points)
                if (hasUpgrade("s", 31)) player.s.points = player.s.points.plus(layers.s.getResetGain().times(diff))
        },
        upgrades: {
                rows: 5,
                cols: 5,
                11: {
                        title: "Lead",
                        description: "Gain a free Incrementy Stamina level and gain 10x Antimatter",
                        cost: new Decimal(1),
                        unlocked(){
                                return true
                        },
                },
                12: {
                        title: "Led",
                        description: "Gain a free Incrementy Stamina level, gain 100x Matter and Amoeba, and Shard upgrades multiply Neutrino gain",
                        cost: new Decimal(1),
                        unlocked(){
                                return true
                        },
                },
                13: {
                        title: "Lynx",
                        description: "Add one to the base of Neutrino Generation and Incrementy Speed, make particle gain 100x faster but cap it at 1 second",
                        cost: new Decimal(1),
                        unlocked(){
                                return hasUpgrade("s", 12) && hasUpgrade("s", 11)
                        },
                },
                14: {
                        title: "Links",
                        description: "Keep challenges and upgrades from AM, M, and Q, and buy one of each Neutrino Buyables every second", //only upgrades from AM
                        cost: new Decimal(1),
                        unlocked(){
                                return hasUpgrade("s", 13)
                        },
                },
                15: {
                        title: "Altar",
                        description: "Gain a free Amoeba Gain buyable and keep G and A upgrades",
                        cost: new Decimal(2),
                        unlocked(){
                                return hasUpgrade("s", 14)
                        },
                },
                21: {
                        title: "Alter",
                        description: "Keep P and E upgrades and A milestones, add 1 to Particle per second production",
                        cost: new Decimal(4),
                        unlocked(){
                                return hasUpgrade("s", 15)
                        },
                },
                22: {
                        title: "Wain",
                        description: "Each Shard Upgrade gives a free level to each Incrementy buyable",
                        cost: new Decimal(6),
                        unlocked(){
                                return hasUpgrade("s", 21)
                        },
                },
                23: {
                        title: "Wane",
                        description: "Particle Simulation levels raise its base to its amount, Particle Simulation effects Gluons, and Links can buy 10",
                        cost: new Decimal(8),
                        unlocked(){
                                return hasUpgrade("s", 22)
                        },
                },
                24: {
                        title: "Rap",
                        description: "Matter Gain gives levels to Base Incrementy Gain",
                        cost: new Decimal(10),
                        unlocked(){
                                return hasUpgrade("s", 23)
                        },
                },
                25: {
                        title: "Wrap",
                        description: "Particle Boost give levels to Neutrino Gain and automatically buy Particle Upgrades once per second",
                        cost: new Decimal(20),
                        unlocked(){
                                return hasUpgrade("s", 24)
                        },
                },
                31: {
                        title: "Wring", 
                        description: "Remove the ability to Shard Prestige but gain 100% of Shards on prestige per second",
                        cost: new Decimal(50),
                        unlocked(){
                                return hasUpgrade("s", 25)
                        },
                },
                32: {
                        title: "Ring", //35 is Help?
                        description: "Antimatter Gain buyables cubed adds to their original base",
                        cost: new Decimal(1000),
                        unlocked(){
                                return hasUpgrade("s", 31)
                        },
                },
                33: {
                        title: "Lapse", //35 is Help?
                        description: "Cube Shard gain and Particle Simulation gives free levels to Particle Accerelation",
                        cost: new Decimal("1e2374"),
                        currencyDisplayName: "Antimatter",
                        currencyInternalName: "points",
                        currencyLayer: "am",
                        unlocked(){
                                return hasUpgrade("s", 32)
                        },
                },
                34: {
                        title: "Laps",
                        description: "Each extra Amoeba Gain buyable doubles Shard gain and Particle Collision gives free levels to Particle Accerelation",
                        cost: new Decimal(3e5),
                        unlocked(){
                                return hasUpgrade("s", 33)
                        },
                },
                35: {
                        title: "Help?", 
                        description: "Particle Simulation gives free levels to Particle Collision and begin generation of Bosons",
                        cost: new Decimal(2e7),
                        unlocked(){
                                return hasUpgrade("s", 34)
                        },
                },
                41: {
                        title: "Hoard", 
                        description: "Links and Wrap buy ten and four times more and double Super Prestige point gain",
                        cost: new Decimal(1e69),
                        unlocked(){
                                return hasUpgrade("s", 35) && hasMilestone("sp", 5)
                        },
                },
                42: {
                        title: "Horde", 
                        description: "Cube Super Prestige Point gain and each Shard upgrade pushes Incrementy Stamina softcap back by 1",
                        cost: new Decimal(50),
                        currencyDisplayName: "Super Prestige Points",
                        currencyInternalName: "points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("s", 41)
                        },
                },
                43: {
                        title: "Forth", 
                        description: "Incrementy raised to .01% multiplies Particle gain and cube base Shard gain",
                        cost: new Decimal(50),
                        currencyDisplayName: "Super Prestige Points",
                        currencyInternalName: "points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("s", 42)
                        },
                },
                44: {
                        title: "Fourth", 
                        description: "The previous upgrade works at .02% of the rate for Shards",
                        cost: new Decimal(400),
                        currencyDisplayName: "Super Prestige Points",
                        currencyInternalName: "points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("s", 43)
                        },
                },
                45: {
                        title: "Ceiling", 
                        description: "The previous upgrade works at 1% of the rate for Super Prestige Points",
                        cost: new Decimal(1e97),
                        unlocked(){
                                return hasUpgrade("s", 44)
                        },
                },
                51: {
                        title: "Sealing", 
                        description: "Incrementy boosts Super Prestige Point gain",
                        effect(){
                                return player.i.points.max(10).log10().max(10).log10().div(2).max(1)
                        },
                        cost: new Decimal(1e99),
                        unlocked(){
                                return hasUpgrade("s", 45)
                        },
                },
                52: {
                        title: "Daze", 
                        description: "Each upgrade in this row doubles Super Prestige Point gain",
                        cost: new Decimal(1e103),
                        unlocked(){
                                return hasUpgrade("s", 51)
                        },
                },
                53: {
                        title: "Days", 
                        description: "Square Super Prestige Point gain",
                        cost: new Decimal(5e107),
                        unlocked(){
                                return hasUpgrade("s", 52)
                        },
                },
                54: {
                        title: "Deviser", 
                        description: "Always have at least 1000 Particles per second",
                        cost: new Decimal(5e123),
                        unlocked(){
                                return hasUpgrade("s", 53)
                        },
                },
                55: {
                        title: "Devisor", 
                        description: "<b>Rite</b> can buy ten times more",
                        cost: new Decimal(5e129),
                        unlocked(){
                                return hasUpgrade("s", 54)
                        },
                },

        }, 

        row: 3, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            //{key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.s.best.gt(0) || hasUpgrade("p", 35) || player.sp.best.gt(0)},
        tabFormat: ["main-display",
                ["display-text", function(){return hasUpgrade("s", 31) ? "You are getting " + format(layers.s.getResetGain()) + " Shards per second (based on particles)" : ""}],
                ["prestige-button", "", function (){ return hasUpgrade("s", 31) ? {'display': 'none'} : {}}],
                "blank", 
                "upgrades"],
        doReset(layer){
                if (false) console.log(layer)
                if (layers[layer].row <= 3 && layer != "sp") return

                //upgrades
                let keep = []
                let j = Math.min(25, player.sp.times)
                if (hasMilestone("sp", 1)) {
                        for (let i = 0; i < j; i ++){
                                keep.push([11,12,13,14,15,21,22,23,24,25,31,32,33,34,35,41,42,43,44,45,51,52,53,54,55][i])
                        }
                }
                player.s.upgrades = filter(player.s.upgrades, keep)

                //resource
                player.s.points = new Decimal(0)
                player.s.best = new Decimal(0)
        },
})

addLayer("b", {
        name: "Bosons", 
        symbol: "B", 
        position: 1,
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
                tokens: new Decimal(0),
        }},
        color: "#D346DF",
        requires: Decimal.pow(10, 694), 
        resource: "Bosons",
        baseAmount() {return player.p.points}, 
        branches: ["p", "g", "q"],
        type: "custom", 
        effect(){
                let amt = player.b.points
                let ret = amt.times(9).plus(1).log10()
                if (hasUpgrade("b", 42)) {
                        if (ret.gt(30)) ret = ret.times(3.3).plus(1).log10().pow(4).plus(14)
                } else if (hasUpgrade("b", 13)) {
                        if (ret.gt(20)) ret = ret.times(5).log10().pow(4).times(1.25)
                } else if (ret.gt(10)) ret = ret.log10().times(10)
                return ret
        },
        effectDescription(){
                let a = "which multiplies Incrementy gain by Amoebas ^" + format(layers.b.effect()) + "."
                return a 
        },
        getResetGain() {
                if (!hasUpgrade("s", 35)) return new Decimal(0)
                let amt = layers.b.baseAmount()
                let pre = layers.b.getGainMultPre()
                let exp = layers.b.getGainExp()
                let pst = layers.b.getGainMultPost()
                let ret = amt.div("1e692").max(1).log10().div(2).times(pre).pow(exp).times(pst)
                return ret
        },
        getGainExp(){
                let x = new Decimal(1.5)
                if (hasUpgrade("b", 14)) x = x.times(Decimal.pow(getBChallengeTotal(), .5).max(1))
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1)
                return x
        },
        getGainMultPost(){
                let x = new Decimal(5e5)
                x = x.times(layers.sp.effect()[1])
                if (hasUpgrade("sp", 31)) x = x.times(player.sp.points.max(1))
                return x
        },
        prestigeButtonText(){
                return "lul"
                /*
                let gain = layers.s.getResetGain()
                let start =  "Reset to gain " + formatWhole(gain) + " Shards<br>"
                let pre = layers.s.getGainMultPre()
                let exp = layers.s.getGainExp()
                let pst = layers.s.getGainMultPost()
                let nextAt = "Next at " + format(Decimal.pow(10, gain.plus(1).div(pst).root(exp).div(pre).times(2).plus(500))) + " particles"
                return start + nextAt
                */
        },
        canReset(){
                return false
        },
        update(diff){
                if (!player.s.best) player.b.best = new Decimal(0)
                player.b.best = player.b.best.max(player.b.points)
                player.b.points = player.b.points.plus(layers.b.getResetGain().times(diff))
                player.b.tokens = player.b.tokens.plus(layers.b.tokenGain().times(diff))
        },
        challengesUnlocked(){
                let ret = 1
                if (hasUpgrade("b", 13)) ret = Math.max(2, ret)
                if (hasUpgrade("b", 31)) ret = Math.max(3, ret)
                if (hasUpgrade("b", 33)) ret = Math.max(4, ret)
                return ret
        },
        tokenGain(){
                let ret = Decimal.pow(getBChallengeTotal(), 2)
                if (hasUpgrade("b", 13)) ret = ret.times(Decimal.pow(2, getBChallengeTotal()))
                if (hasUpgrade("b", 24)) ret = ret.times(Decimal.pow(2, getBChallengeTotal()))
                if (hasUpgrade("b", 21)) ret = ret.times(Decimal.max(1, challengeCompletions("b", 11)))
                ret = ret.times(Decimal.pow(3, challengeCompletions("b", 22)))

                if (hasMilestone("sp", 3)) ret = ret.pow(1.1).times(10)
                return ret
        },
        challenges:{
                rows: 2,
                cols: 2,
                11: {
                        name: "Been", 
                        challengeDescription: "Incrementy Stamina effect is linear instead of exponential",
                        rewardDescription: "Add to the base of Incrementy Strength and Neutrino generation based on total Boson Challenge completions",
                        rewardEffect(){
                                let tot = new Decimal(getBChallengeTotal() + 1)
                                let comps = challengeCompletions("b", 11)

                                if (tot.gt(3)) tot = tot.log(3).plus(2)
                                if (tot.gt(4)) tot = tot.log(4).plus(3)
                                if (comps >= 4) comps = Math.log10(comps * 33 + 1) + 1

                                let ret = Decimal.pow(tot, comps).minus(1)

                                if (ret.gt(50)) ret = ret.times(2).log10().times(25)

                                return ret
                        },
                        rewardDisplay(){
                                let comps = "Because you have " + formatWhole(challengeCompletions("b", 11)) + " challenge completions, "
                                let eff = "add " + format(layers.b.challenges[11].rewardEffect()) + " to the base."
                                return comps + eff
                        },
                        unlocked(){
                                return layers.b.challengesUnlocked() >= 1
                        },
                        goal(){
                                let comps = challengeCompletions("b", 11)
                                let base = 91.3e3
                                base += comps * (comps + 9) * 800
                                if (comps >= 3) base += Math.pow(comps, 4) * 136
                                if (comps >= 5) base += -8550
                                if (comps == 6) base += 8994
                                if (comps == 7) base += 1114
                                if (comps == 8) base += -76106
                                if (comps >= 9) base = 954e3
                                return Decimal.pow(10, base)
                        },
                        currencyInternalName: "points",
                        completionLimit: 10,
                },
                12: {
                        name: "Bin", 
                        challengeDescription() {
                                return "Base Incrementy Gain buyable base is raised to the " + format(new Decimal(2).div(3 + challengeCompletions("b", 12)), 3)
                        },
                        rewardDescription: "Incrementy Stamina gives free levels to Incrementy Speed",
                        rewardEffect(){
                                let comps = challengeCompletions("b", 12)

                                let ret = Decimal.pow(comps + 8, 1.5).times(2)

                                if (comps == 0) ret = new Decimal(0)

                                return ret
                        },
                        rewardDisplay(){
                                let comps = "Because you have " + formatWhole(challengeCompletions("b", 12)) + " challenge completions, "
                                let eff = "you get " + format(layers.b.challenges[12].rewardEffect()) + " free Speed levels per Stamina."
                                return comps + eff
                        },
                        unlocked(){
                                return layers.b.challengesUnlocked() >= 2
                        },
                        goal(){
                                let comps = challengeCompletions("b", 12)
                                let base = 1.86e6
                                if (comps >= 1) base = 1.577e6
                                if (comps >= 2) base = 1.483e6
                                if (comps >= 3) base = 1.302e6
                                if (comps >= 4) base = 1.304e6
                                if (comps >= 5) base = 1.574e6
                                if (comps >= 6) base = 1.607e6
                                if (comps >= 7) base = 1.827e6
                                if (comps >= 8) base = 1.862e6
                                if (comps >= 9) base = 1.896e6
                                return Decimal.pow(10, base)
                        },
                        currencyInternalName: "points",
                        completionLimit: 10,
                },
                21: {
                        name: "Band", 
                        challengeDescription: "Base Incrementy Gain buyable effect base is 1",
                        rewardDescription: "Log10 of your Quarks raised to a power boosts Amoeba gain",
                        rewardEffect(){
                                let comps = challengeCompletions("b", 21)

                                let ret = Decimal.pow(comps * 5 + 11, 1.5)

                                if (comps == 0) ret = new Decimal(0)

                                return ret
                        },
                        rewardDisplay(){
                                let comps = "Because you have " + formatWhole(challengeCompletions("b", 21)) + " challenge completions, "
                                let eff = "you get a log(Quarks)^" + format(layers.b.challenges[21].rewardEffect()) + " multiplier to Amoeba gain."
                                return comps + eff
                        },
                        unlocked(){
                                return layers.b.challengesUnlocked() >= 3
                        },
                        goal(){
                                let comps = challengeCompletions("b", 21)
                                let base = 483e3
                                base += comps ** 2 * 13e3
                                if (comps >= 2) base += 16e3 * comps
                                if (comps >= 3) base += 16e3
                                if (comps >= 4) base += 24e3
                                if (comps >= 5) base += 14.4e3 * comps
                                if (comps >= 6) base += -30.4e3
                                if (comps >= 7) base += -92.4e3
                                if (comps >= 8) base += -125.4e3
                                if (comps >= 9) base += -59.4e3
                                return Decimal.pow(10, base)
                        },
                        currencyInternalName: "points",
                        completionLimit: 10,
                },
                22: {
                        name: "Banned", 
                        challengeDescription: "Be in all 3 prior Challenges at Once",
                        rewardDescription: "Add to the Particle Generation base, and get extra Particle Simulation levels",
                        rewardEffect(){
                                let comps = challengeCompletions("b", 22)

                                let ret = Decimal.pow(comps, 2).plus(9)

                                if (comps == 0) ret = new Decimal(0)

                                return [ret, comps * (comps + 3) / 2 + comps * 4]
                        },
                        rewardDisplay(){
                                let comps = "Because you have " + formatWhole(challengeCompletions("b", 22)) + " challenge completions, "
                                let eff = "you get +" + format(layers.b.challenges[22].rewardEffect()[0]) + " to the Particle Generation base and "
                                let eff2 =  formatWhole(layers.b.challenges[22].rewardEffect()[1]) + " extra Particle Simulation levels."
                                return comps + eff + eff2
                        },
                        unlocked(){
                                return layers.b.challengesUnlocked() >= 4
                        },
                        goal(){
                                let comps = challengeCompletions("b", 22)
                                let base = 850e3
                                base += comps ** 2 * 15e3
                                base += comps * 38e3
                                if (comps >= 2) base += -16e3
                                if (comps >= 3) base += -66e3
                                if (comps >= 4) base += -68e3
                                if (comps >= 5) base += -74e3
                                if (comps >= 6) base += -104e3
                                if (comps >= 7) base += -164e3
                                if (comps >= 8) base += -144e3
                                if (comps >= 9) base += -211e3
                                return Decimal.pow(10, base)
                        },
                        currencyInternalName: "points",
                        completionLimit: 10,
                        countsAs: [11, 12, 21],
                },
        },
        upgrades: {
                rows: 4,
                cols: 4, 
                11: {
                        title: "Few",
                        description: "Uncap Hall and Incrementy Stamina gives free levels to Incrementy Boost",
                        cost: new Decimal(30),
                        currencyDisplayName: "Tokens",
                        currencyInternalName: "tokens",
                        currencyLayer: "b",
                        unlocked(){
                                return challengeCompletions("b", 11) > 0
                        },
                },
                12: {
                        title: "Phew",
                        description: "Been completions add to the Amoeba Gain base and give free Amoeba Gain levels",
                        cost: new Decimal(300),
                        currencyDisplayName: "Tokens",
                        currencyInternalName: "tokens",
                        currencyLayer: "b",
                        unlocked(){
                                return hasUpgrade("b", 11)
                        },
                },
                13: {
                        title: "Maze", 
                        description: "Push the Boson softcap to 20, each challenge completion doubles token gain, and unlock the second challenge",
                        cost: new Decimal(1000),
                        currencyDisplayName: "Tokens",
                        currencyInternalName: "tokens",
                        currencyLayer: "b",
                        unlocked(){
                                return hasUpgrade("b", 12)
                        },
                },
                14: {
                        title: "Maize",
                        description: "Boson gain is rasied to the square root of Boson Challenge completions",
                        cost: new Decimal(5e5),
                        currencyDisplayName: "Tokens",
                        currencyInternalName: "tokens",
                        currencyLayer: "b",
                        unlocked(){
                                return hasUpgrade("b", 13)
                        },
                },
                21: {
                        title: "Load",
                        description: "Been Completions give Particle Collision levels and multiply token gain",
                        cost: new Decimal(1e6),
                        currencyDisplayName: "Tokens",
                        currencyInternalName: "tokens",
                        currencyLayer: "b",
                        unlocked(){
                                return hasUpgrade("b", 14) && getBChallengeTotal() >= 7
                        },
                },
                22: {
                        title: "Lode",
                        description: "Been effects Particle Generation at cube root the rate",
                        cost: new Decimal(1e7),
                        currencyDisplayName: "Tokens",
                        currencyInternalName: "tokens",
                        currencyLayer: "b",
                        unlocked(){
                                return hasUpgrade("b", 21)
                        },
                },
                23: {
                        title: "Born",
                        description: "Raise Particle Collision base to 1 + Bin completions and <b>Rite</b> buys 5,000",
                        cost: new Decimal(4e7),
                        currencyDisplayName: "Tokens",
                        currencyInternalName: "tokens",
                        currencyLayer: "b",
                        unlocked(){
                                return hasUpgrade("b", 22)
                        },
                },
                24: {
                        title: "Borne",
                        description: "Bin completions give free Particle Simulation levels and each Boson Challenge doubles token gain",
                        cost: new Decimal(1e8),
                        currencyDisplayName: "Tokens",
                        currencyInternalName: "tokens",
                        currencyLayer: "b",
                        unlocked(){
                                return hasUpgrade("b", 23)
                        },
                },
                31: {
                        title: "Bawl",
                        description: "Unlock the third challenge and Bin reward effects Strength",
                        cost: new Decimal(2e12),
                        currencyDisplayName: "Tokens",
                        currencyInternalName: "tokens",
                        currencyLayer: "b",
                        unlocked(){
                                return hasUpgrade("b", 24)
                        },
                },
                32: {
                        title: "Ball",
                        description: "Band completions give 20 free Antimatter Gain buyables",
                        cost: new Decimal(2e14),
                        currencyDisplayName: "Tokens",
                        currencyInternalName: "tokens",
                        currencyLayer: "b",
                        unlocked(){
                                return hasUpgrade("b", 31)
                        },
                },
                33: {
                        title: "Dew",
                        description: "Been completions give free Particle Simulation levels and unlock the fourth challenge",
                        cost: new Decimal(1e17),
                        currencyDisplayName: "Tokens",
                        currencyInternalName: "tokens",
                        currencyLayer: "b",
                        unlocked(){
                                return hasUpgrade("b", 32)
                        },
                },
                34: {
                        title: "Due",
                        description: "Band completions give free Particle Simulation level",
                        cost: new Decimal(1e18),
                        currencyDisplayName: "Tokens",
                        currencyInternalName: "tokens",
                        currencyLayer: "b",
                        unlocked(){
                                return hasUpgrade("b", 33)
                        },
                }, 
                41: {
                        title: "Rye",
                        description: "Band completions give Particle Collision levels and Particle Collision effects Antimatter gain",
                        cost: new Decimal(5e20),
                        currencyDisplayName: "Tokens",
                        currencyInternalName: "tokens",
                        currencyLayer: "b",
                        unlocked(){
                                return hasUpgrade("b", 34)
                        },
                }, 
                42: {
                        title: "Wry",
                        description: "Push the Boson effect softcap to 30",
                        cost: new Decimal(5e23),
                        currencyDisplayName: "Tokens",
                        currencyInternalName: "tokens",
                        currencyLayer: "b",
                        unlocked(){
                                return hasUpgrade("b", 41)
                        },
                }, 
                43: {
                        title: "Throne",
                        description: "Each Banned completion increases the Incrementy Stamina softcap start by one",
                        cost: new Decimal(5e24),
                        currencyDisplayName: "Tokens",
                        currencyInternalName: "tokens",
                        currencyLayer: "b",
                        unlocked(){
                                return hasUpgrade("b", 42)
                        },
                },
                44: {
                        title: "Thrown",
                        description: "Multiplicatively increase the P Acceleraiton base by 5% per Banned completion per P Simulation level",
                        cost: new Decimal(5e27),
                        currencyDisplayName: "Tokens",
                        currencyInternalName: "tokens",
                        currencyLayer: "b",
                        unlocked(){
                                return hasUpgrade("b", 43)
                        },
                }, 
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            //{key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.b.best.gt(0) || hasUpgrade("s", 35) || player.sp.best.gt(0)},
        tabFormat: {
                "Challenges": {
                        content: [
                                "main-display",
                                ["display-text", function(){
                                        let a = "Gain is based Particles. Starting challenges resets Bosons and Incrementy." 
                                        let b = "<br>You are getting " + format(layers.b.getResetGain()) + " Bosons per second"
                                        if (getBChallengeTotal() >= 40) a = ""
                                        return a+b
                                }],
                                "challenges"
                        ],
                        unlocked(){
                                return true
                        },
                }, 
                "Upgrades": {
                        content: [
                                ["display-text", function(){
                                        let a = "You have <h3>" + formatWhole(player.b.tokens) + "</h3> tokens"
                                        return a
                                }],
                                ["display-text", function(){
                                        let a = "You are gaining " + formatWhole(layers.b.tokenGain()) + " tokens per second"
                                        return a
                                }],
                                "blank",
                                "upgrades"
                        ],
                        unlocked(){
                                return challengeCompletions("b", 11) > 0 // for now
                        },
                }
        },
        //4 challenges repeatable 10? 20? Infinite? times
        doReset(layer){
                if (false) console.log(layer)
                if (layers[layer].row <= 0) return

                //only reset challenges if row >= 3
                if (layers[layer].row >= 3) {
                        let keep = []
                        if (!hasMilestone("sp", 5)) player.b.upgrades = filter(player.b.upgrades, keep)

                        if (!hasMilestone("sp", 4)) player.b.challenges[11] = 0
                        if (!hasMilestone("sp", 4)) player.b.challenges[12] = 0
                        if (!hasMilestone("sp", 5)) player.b.challenges[21] = 0
                        if (!hasMilestone("sp", 5)) player.b.challenges[22] = 0
                }

                //resource
                player.b.points = new Decimal(0)
                player.b.best = new Decimal(0)
                if (layer == "sp") player.b.tokens = new  Decimal(0)
        },
})

addLayer("sp", {
        name: "Superprestige", 
        symbol: "SP", 
        position: 3,
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
                total: new Decimal(0),
                tokens: new Decimal(0),
                times: 0,
                chall1points: new Decimal(0),
                chall2points: new Decimal(0),
                chall3points: new Decimal(0),
                chall4points: new Decimal(0),
        }},
        color: "#1CA2E8",
        requires: Decimal.pow(10, 65), 
        resource: "Super Prestige Points",
        baseAmount() {return player.s.points}, 
        branches: ["s"],
        type: "custom", 
        effect(forceSet){
                let amt = player.sp.best
                if (forceSet != undefined) amt = new Decimal(forceSet)
                if (amt.gt(10)) amt = amt.times(10).sqrt()
                if (amt.gt(20)) amt = amt.times(5).log10().times(10)
                if (amt.gt(40)) amt = amt.div(40).root(3).times(40)
                if (amt.gt(100)) amt = amt.log10().times(50)
                if (forceSet != undefined) return amt
                let a1 = amt.floor()

                let a2 = amt.times(10).max(1).pow(2)
                return [a1, a2]
        },
        effectDescription(){
                let eff = layers.sp.effect()
                let a = "which increases the Incrementy Stamina softcap by " + formatWhole(eff[0]) + " (next at "
                let c = eff[0].plus(1)
                if (c.gt(100)) c = Decimal.pow(10, c.div(50))
                if (c.gt(40))  c = c.div(40).pow(3).times(40)
                if (c.gt(20))  c = Decimal.pow(10, c.div(10)).div(5)
                if (c.gt(10))  c = c.div(10).pow(2).times(10)
                let b = ") and all previous prestige resources by " + format(eff[1]) + " (based on best Super Prestige Points)."
                return a + formatWhole(c.ceil()) + b
        },
        getResetGain() {
                let amt = layers.sp.baseAmount()
                let pre = layers.sp.getGainMultPre()
                let exp = layers.sp.getGainExp()
                let pst = layers.sp.getGainMultPost()
                
                let ret = amt.div(1e64).max(1).log10().times(pre).pow(exp).times(pst)

                return ret.floor()
        },
        getGainExp(){
                let x = new Decimal(.25)
                if (hasUpgrade("s", 42)) x = x.times(3)
                if (hasUpgrade("s", 53)) x = x.times(2)
                if (hasUpgrade("sp", 35)) x = x.times(1.01)
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1)
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)
                if (hasUpgrade("s", 41)) x = x.times(2)
                if (hasUpgrade("s", 45)) x = x.times(player.i.points.max(1).pow(.0001).pow(.0002).pow(.01))
                if (hasUpgrade("s", 51)) x = x.times(upgradeEffect("s", 51))
                if (hasUpgrade("s", 52)) {
                        if (hasUpgrade("s", 51)) x = x.times(2)
                        x = x.times(2)
                        if (hasUpgrade("s", 53)) x = x.times(2)
                        if (hasUpgrade("s", 54)) x = x.times(2)
                        if (hasUpgrade("s", 55)) x = x.times(2)
                }
                x = x.times(layers.sp.challenges[11].rewardEffect())
                if (hasUpgrade("sp", 11)) x = x.times(upgradeEffect("sp", 11))
                if (hasUpgrade("sp", 23)) x = x.times(player.sp.chall3points.max(1))
                if (hasUpgrade("sp", 32)) x = x.times(Decimal.pow(50, challengeCompletions("sp", 22)))
                if (hasUpgrade("sp", 34)) x = x.times(player.sp.chall4points.max(1))
                if (hasUpgrade("sp", 15)) {
                        let a = 1
                        if (hasUpgrade("sp", 25)) a ++
                        if (hasUpgrade("sp", 35)) a ++
                        if (hasUpgrade("sp", 45)) a ++
                        x = x.times(Decimal.pow(challengeCompletions("sp", 11), a))
                }
                if (hasUpgrade("pi", 12)) x = x.times(upgradeEffect("pi", 12))
                if (hasMilestone("pi", 3)) x = x.times(Decimal.pow(2, player.pi.upgrades.length ** 2))
                if (hasUpgrade("pi", 21)) x = x.times(Decimal.pow(player.pi.points.plus(1), player.pi.upgrades.length))
                return x
        },
        prestigeButtonText(){
                let gain = layers.sp.getResetGain()
                let start =  "Reset to gain " + formatWhole(gain) + " Super Prestige Points<br>"
                let pre = layers.sp.getGainMultPre()
                let exp = layers.sp.getGainExp()
                let pst = layers.sp.getGainMultPost()
                let nextAt = "Next at " + format(Decimal.pow(10, gain.plus(1).div(pst).root(exp).div(pre)).times(1e64)) + " Shards"
                if (gain.gt(1e6)) nextAt = ""
                return start + nextAt
        },
        canReset(){
                return layers.sp.getResetGain().gt(0) && getBChallengeTotal() >= 40 && !hasUpgrade("sp", 12) 
        },
        update(diff){
                player.sp.best = player.sp.best.max(player.sp.points)

                if (hasUpgrade("sp", 12)) player.sp.points = player.sp.points.plus(layers.sp.getResetGain().times(diff))
        },
        milestones: {
                1: {
                        requirementDescription: "<b>Toad</b><br>Requires: 2 Resets", 
                        effectDescription: "Keep one Shard upgrade per Super Prestige reset",
                        done(){
                                return player.sp.times >= 2
                        },
                },
                2: {
                        requirementDescription: "<b>Toed</b><br>Requires: 4 Resets", 
                        effectDescription: "Autobuyers are triggered three times as often",
                        done(){
                                return player.sp.times >= 4
                        },
                },
                3: {
                        requirementDescription: "<b>Towed</b><br>Requires: 5 Resets", 
                        effectDescription: "Raise token generation to the 1.1th power and then multiply it by 10",
                        done(){
                                return player.sp.times >= 5
                        },
                },
                4: {
                        requirementDescription: "<b>Wait</b><br>Requires: 10 Resets", 
                        effectDescription: "Keep Been and Bin completions",
                        done(){
                                return player.sp.times >= 10
                        },
                },
                5: {
                        requirementDescription: "<b>Weight</b><br>Requires: 12 Resets", 
                        effectDescription: "Keep Band and Banned completions and Token upgrades",
                        done(){
                                return player.sp.times >= 12
                        },
                },
        },
        challenges:{
                rows: 2,
                cols: 2,
                getPointGain(){
                        if (inChallenge("sp", 11)) {
                                let base = layers.sp.challenges[11].goal(true)
                                let pts = player.points
                                let diff = player.points.max(10).log(10).max(2).log(2).minus(base.log(10).log(2)).max(0)
                                return diff.plus(1).pow(3).minus(1).times(100).floor()
                        }
                        if (inChallenge("sp", 12)) {
                                let base = layers.sp.challenges[12].goal(true)
                                let pts = player.points
                                let diff = player.points.max(10).log(10).max(2).log(2).minus(base.log(10).log(2)).max(0)
                                return diff.plus(1).pow(3).minus(1).times(100).floor()
                        }
                        if (inChallenge("sp", 21)) {
                                let base = layers.sp.challenges[21].goal(true)
                                let pts = player.points
                                let diff = player.points.max(10).log(10).max(2).log(2).minus(base.log(10).log(2)).max(0)
                                return diff.plus(1).pow(3).minus(1).times(100).floor()
                        }
                        if (inChallenge("sp", 22)) {
                                let base = layers.sp.challenges[22].goal(true)
                                let pts = player.points
                                let diff = player.points.max(10).log(10).max(2).log(2).minus(base.log(10).log(2)).max(0)
                                if (diff.gt(1) && !hasUpgrade("pi", 11)) diff = diff.log(100).plus(1) 
                                return diff.plus(1).pow(3).minus(1).times(100).floor()
                        }
                        return new Decimal(0)
                },
                getAdditionalGain(){
                        let id 
                        let gain 
                        let tot = layers.sp.challenges.getPointGain()
                        if (inChallenge("sp", 11)) {
                                id = 11
                                gain = tot.minus(player.sp.chall1points).max(0)
                        }
                        if (inChallenge("sp", 12)) {
                                id = 12
                                gain = tot.minus(player.sp.chall2points).max(0)
                        }
                        if (inChallenge("sp", 21)) {
                                id = 21
                                gain = tot.minus(player.sp.chall3points).max(0)
                        }
                        if (inChallenge("sp", 22)) {
                                id = 22
                                gain = tot.minus(player.sp.chall4points).max(0)
                        }
                        if (id != undefined) return [gain, id]
                        return [null, null]
                },
                11: {
                        name: "Quartz", 
                        challengeDescription: "All Neutrino Buyable bases are set to 1",
                        rewardDescription: "Challenge Points boost Super Prestige Point gain<br>",
                        rewardEffect(){
                                let comps = challengeCompletions("sp", 11)
                                
                                let pts = player.sp.chall1points

                                let exp = Decimal.div(5, 11-Math.sqrt(comps))
                                if (hasUpgrade("sp", 43)) exp = exp.times(2)

                                return Decimal.pow(pts.plus(1), exp)
                        },
                        rewardDisplay(){
                                let comps = "Because you have " + formatWhole(player.sp.chall1points) + " Challenge Points "
                                comps += "and " + formatWhole(challengeCompletions("sp", 11)) + " Challenge completions, "
                                let eff = "you get " + format(layers.sp.challenges[11].rewardEffect()) + "x Super Prestige Points."
                                return comps + eff
                        },
                        unlocked(){
                                return true
                        },
                        goal(initial = false){
                                let comps = challengeCompletions("sp", 11)
                                let init = 21
                                let exp = initial ? init : init + comps
                                return Decimal.pow(10, Decimal.pow(2, exp))
                        },
                        currencyInternalName: "points",
                        completionLimit: 25,
                },
                12: {
                        name: "Quarts", 
                        challengeDescription: "Neutrino gain is raised to the .01",
                        rewardDescription: "Challenge Points boost Shard Gain<br>",
                        rewardEffect(){
                                let comps = challengeCompletions("sp", 12)

                                let pts = player.sp.chall2points

                                let exp = pts.sqrt().min(10 + comps * 3)

                                let ret = Decimal.pow(pts.plus(1), exp)     

                                if (!hasUpgrade("sp", 25) && ret.gt(1e100)) ret = ret.log10().pow(50)
                                return ret                           
                        },
                        rewardDisplay(){
                                let comps = "Because you have " + formatWhole(player.sp.chall2points) + " Challenge Points, "
                                comps += "and " + formatWhole(challengeCompletions("sp", 12)) + " Challenge completions, "
                                let eff = "you get " + format(layers.sp.challenges[12].rewardEffect()) + "x Shard gain."
                                return comps + eff
                        },
                        unlocked(){
                                return true
                        },
                        goal(initial = false){
                                let comps = challengeCompletions("sp", 12)
                                let init = 31
                                let exp = initial ? init : init + comps
                                return Decimal.pow(10, Decimal.pow(2, exp))
                        },
                        currencyInternalName: "points",
                        completionLimit: 25,
                },
                21: {
                        name: "Jewel", 
                        challengeDescription: "Incrementy Stamina Softcap starts at 1",
                        rewardDescription: "Challenge Points boost Energy to Antimatter Synergy<br>",
                        rewardEffect(){
                                let comps = challengeCompletions("sp", 21)

                                if (comps == 0) return new Decimal(0)

                                let pts = player.sp.chall3points

                                let effpts = pts.pow(1 - .8/Math.sqrt(comps))
                                let ret = Decimal.minus(Decimal.div(1, effpts.plus(10).log10()), 1).times(-1)

                                if (hasUpgrade("sp", 42)) ret = ret.sqrt()
                                if (hasUpgrade("pi", 23)) ret = ret.pow(Decimal.pow(.8, player.pi.milestones.length))
                                return ret
                        },
                        rewardDisplay(){
                                let comps = "Because you have " + formatWhole(player.sp.chall3points) + " Challenge Points, "
                                comps += "and " + formatWhole(challengeCompletions("sp", 21)) + " Challenge completions, "
                                let eff = "Energy^" + format(layers.sp.challenges[21].rewardEffect(), 4) + " boosts Antimatter gain."
                                return comps + eff
                        },
                        unlocked(){
                                return true
                        },
                        goal(initial = false){
                                let comps = challengeCompletions("sp", 21)
                                let init = 21
                                let exp = initial ? init : init + comps
                                return Decimal.pow(10, Decimal.pow(2, exp))
                        },
                        currencyInternalName: "points",
                        completionLimit: 25,
                },
                22: {
                        name: "Joule", 
                        challengeDescription: "Incrementy gain is raised to the .01",
                        rewardDescription: "Challenge Points boost Particle Boost base<br>",
                        rewardEffect(){
                                let comps = challengeCompletions("sp", 22)

                                let pts = player.sp.chall4points

                                if (comps > 5) comps = comps / 4 + 3.75

                                return Decimal.pow(pts.plus(1), comps * Math.min(comps, 5) + 4)
                        },
                        rewardDisplay(){
                                let comps = "Because you have " + formatWhole(player.sp.chall4points) + " Challenge Points, "
                                comps += "and " + formatWhole(challengeCompletions("sp", 22)) + " Challenge completions, "
                                let eff = "you get x" + format(layers.sp.challenges[22].rewardEffect()) + " to Particle Boost base."
                                return comps + eff
                        },
                        unlocked(){
                                return true
                        },
                        goal(initial = false){
                                let comps = challengeCompletions("sp", 22)
                                let init = 14
                                let exp = initial ? init : init + comps
                                return Decimal.pow(10, Decimal.pow(2, exp))
                        },
                        currencyInternalName: "points",
                        completionLimit: 25,
                },
        },
        upgrades: {
                rows: 4,
                cols: 5,
                11: {
                        title: "Lute",
                        description: "Quarts Challenge Points boost Super Prestige Point gain",
                        cost: new Decimal(366),
                        currencyDisplayName: "Quartz Challenge Points",
                        currencyInternalName: "chall1points",
                        currencyLayer: "sp",
                        effect(){
                                let amt = player.sp.chall2points
                                if (amt.lte(10)) return amt.max(1)

                                let ret = Decimal.pow(amt, Decimal.log10(amt).pow(-.5))

                                return ret
                        },
                        unlocked(){
                                return hasUpgrade("sp", 11) || player.sp.chall1points.gte(365)
                        },
                }, 
                12: {
                        title: "Loot",
                        description: "Remove the ability to Prestige but gain 100% of Super Prestige Points on prestige per second",
                        cost: new Decimal(396),
                        currencyDisplayName: "Quartz Challenge Points",
                        currencyInternalName: "chall1points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("sp", 11)
                        },
                }, 
                13: {
                        title: "Earn",
                        description: "Each Super Prestige Upgrade pushes the Incrementy Stamina Softcap Start back by one",
                        cost: new Decimal(481),
                        currencyDisplayName: "Quartz Challenge Points",
                        currencyInternalName: "chall1points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("sp", 12)
                        },
                },
                14: {
                        title: "Urn",
                        description: "Quarts Challenge Points raises Amoeba Gain base to a power",
                        cost: new Decimal(730),
                        effect(){
                                let ret = player.sp.chall2points.plus(1).pow(.5)

                                if (hasUpgrade("sp", 24)) ret = ret.times(3)
                                return ret
                        },
                        currencyDisplayName: "Quartz Challenge Points",
                        currencyInternalName: "chall1points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("sp", 13)
                        },
                },
                21: {
                        title: "Ate",
                        description: "Each Super Prestige upgrade makes Amoebas multiply Antimatter",
                        cost: new Decimal(458),
                        currencyDisplayName: "Quarts Challenge Points",
                        currencyInternalName: "chall2points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("sp", 14)
                        },
                },
                22: {
                        title: "Eight",
                        description: "Each Jewel completion pushes the Incrementy Stamina Softcap back by one",
                        cost: new Decimal(643),
                        currencyDisplayName: "Quarts Challenge Points",
                        currencyInternalName: "chall2points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("sp", 21)
                        },
                },
                23: {
                        title: "Shear", 
                        description: "Jewel Points multiply Super Prestige Point gain",
                        cost: new Decimal(839),
                        currencyDisplayName: "Quarts Challenge Points",
                        currencyInternalName: "chall2points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("sp", 22)
                        },
                }, 
                24: {
                        title: "Sheer", 
                        description: "Triple Urn",
                        cost: new Decimal(1097),
                        currencyDisplayName: "Quarts Challenge Points",
                        currencyInternalName: "chall2points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("sp", 23)
                        },
                },
                31: {
                        title: "See", 
                        description: "Super Prestige Points multiply Bosons gain",
                        cost: new Decimal(1302),
                        currencyDisplayName: "Jewel Challenge Points",
                        currencyInternalName: "chall3points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("sp", 24)
                        },
                },
                32: {
                        title: "Sea", 
                        description: "Each Joule Completion boosts Super Prestige point gain by 50x",
                        cost: new Decimal(1700),
                        currencyDisplayName: "Jewel Challenge Points",
                        currencyInternalName: "chall3points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("sp", 31)
                        },
                },
                33: {
                        title: "Add", 
                        description: "Each Jewel Completion multiplies Shard gain by Super Prestige Points",
                        cost: new Decimal(2064),
                        currencyDisplayName: "Jewel Challenge Points",
                        currencyInternalName: "chall3points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("sp", 32)
                        },
                },
                34: {
                        title: "Ad", 
                        description: "Joule Challenge Points multiply Super Prestige point gain",
                        cost: new Decimal(2295),
                        currencyDisplayName: "Jewel Challenge Points",
                        currencyInternalName: "chall3points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("sp", 33)
                        },
                },
                41: {
                        title: "Liar", 
                        description: "Super Prestige Points Boost base Incrementy Gain",
                        cost: new Decimal(122),
                        currencyDisplayName: "Joule Challenge Points",
                        currencyInternalName: "chall4points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("sp", 34)
                        },
                },
                42: {
                        title: "Lyre", 
                        description: "Square root Jewel Exponent (buff!)",
                        cost: new Decimal(1560),
                        currencyDisplayName: "Joule Challenge Points",
                        currencyInternalName: "chall4points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("sp", 41)
                        },
                },
                43: {
                        title: "Ode", 
                        description: "Square Quartz reward",
                        cost: new Decimal(1565),
                        currencyDisplayName: "Joule Challenge Points",
                        currencyInternalName: "chall4points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("sp", 42)
                        },
                },
                44: {
                        title: "Owed", 
                        description: "Each Joule Completion makes Amoebas multiply Antimatter gain",
                        cost: new Decimal(1576),
                        currencyDisplayName: "Joule Challenge Points",
                        currencyInternalName: "chall4points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("sp", 43)
                        },
                }, 
                15: {
                        title: "Bale",
                        description: "Each Upgrade in this column multiplies Super Prestige point gain by Quartz completions",
                        cost: new Decimal(16919),
                        currencyDisplayName: "Quartz Challenge Points",
                        currencyInternalName: "chall1points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("sp", 44)
                        },
                },
                25: {
                        title: "Bail",
                        description: "Remove the 1e100 softcap of Quarts",
                        cost: new Decimal(32955),
                        currencyDisplayName: "Quarts Challenge Points",
                        currencyInternalName: "chall2points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("sp", 15)
                        },
                },
                35: {
                        title: "Barren",
                        description: "Raise base Super Prestige point gain to the 1.01",
                        cost: new Decimal(16480),
                        currencyDisplayName: "Jewel Challenge Points",
                        currencyInternalName: "chall3points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("sp", 25)
                        },
                },
                45: {
                        title: "Baron",
                        description: "Neutrino Autobuyers can buy ten times more",
                        cost: new Decimal(1624),
                        currencyDisplayName: "Joule Challenge Points",
                        currencyInternalName: "chall4points",
                        currencyLayer: "sp",
                        unlocked(){
                                return hasUpgrade("sp", 35)
                        },
                }, //π
        },
        row: 3, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            //{key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return getBChallengeTotal() >= 40 || player.sp.best.gt(0)},
        tabFormat: {
                "QoL": {
                        content: [
                                "main-display",
                                ["display-text", function(){
                                        return "You have done a total of " + formatWhole(player.sp.times) + " Super Prestige resets"
                                }],
                                ["display-text", function(){
                                        if (!hasUpgrade("sp", 12)) return "Super Prestige resets all prior layers, even with Shard upgrades"
                                        return "You are gaining " + format(layers.sp.getResetGain()) + " Super Prestige Points per second"
                                }],
                                ["prestige-button", "", function (){ return hasUpgrade("sp", 12) ? {'display': 'none'} : {}}],
                                "milestones"
                        ],
                        unlocked(){
                                return true
                        },
                }, 
                "Obfuscations": {
                        content: [
                                ["display-text", function(){
                                        return "Each Challenge's Challenge Points are generated based on your Points"
                                }],
                                ["display-text", function(){
                                        if (inChallenge("sp", 11) || inChallenge("sp", 12) || inChallenge("sp", 21) || inChallenge("sp", 22)) {
                                                let gain = layers.sp.challenges.getAdditionalGain()[0]
                                                let a = "Leaving the challenge will give " + formatWhole(gain) + " Challenge Points"
                                                let b = ""
                                                if (gain.lt(1000)) {
                                                        let init = layers.sp.challenges.getPointGain()
                                                        if (inChallenge("sp", 11)) init = init.max(player.sp.chall1points)
                                                        if (inChallenge("sp", 12)) init = init.max(player.sp.chall2points)
                                                        if (inChallenge("sp", 21)) init = init.max(player.sp.chall3points)
                                                        if (inChallenge("sp", 22)) init = init.max(player.sp.chall4points)


                                                        let target = init.plus(1).div(100).plus(1).root(3).minus(1)

                                                        if (inChallenge("sp", 22) && target.gt(1) && !hasUpgrade("pi", 11)) target = Decimal.pow(100, target.minus(1)) 

                                                        let add = new Decimal(0)
                                                        if (inChallenge("sp", 11)) add = layers.sp.challenges[11].goal(true).log(10).log(2)
                                                        if (inChallenge("sp", 12)) add = layers.sp.challenges[12].goal(true).log(10).log(2)
                                                        if (inChallenge("sp", 21)) add = layers.sp.challenges[21].goal(true).log(10).log(2)
                                                        if (inChallenge("sp", 22)) add = layers.sp.challenges[22].goal(true).log(10).log(2)


                                                        let goal = Decimal.pow(10, Decimal.pow(2, target.plus(add)))
                                                        
                                                        b = " (next at " + format(goal) + ")"
                                                }
                                                return a + b
                                        }
                                        return "Enter a Challenge to gain Challenge Points"
                                }],
                                "blank",
                                "challenges",
                        ],
                        unlocked(){
                                return hasUpgrade("s", 55)
                        },
                },
                "Upgrades": {
                        content: [
                                "upgrades"
                        ],
                        unlocked(){
                                return hasUpgrade("sp", 11) || player.sp.chall1points.gte(360)
                        },
                }
        },
        doReset(layer){
                if (false) console.log(layer)
                if (layers[layer].row <= 3 && layer != "pi") return

                //resource
                player.sp.points = new Decimal(0)
                player.sp.best = new Decimal(0)
                player.sp.total = new Decimal(0)

                if (layer == "pi") return
                player.sp.times = 0
        },
})


addLayer("pi", {
        name: "Pions", 
        symbol: "π", 
        position: 4,
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
                total: new Decimal(0),
                bestOnce: new Decimal(0),
                times: 0,
        }},
        color: "#EC8241",
        requires: Decimal.pow(10, 133).times(5), 
        resource: "Pions",
        baseAmount() {return player.sp.points}, 
        branches: ["sp"],
        type: "custom", 
        effect(){
                let amt = player.pi.bestOnce
                if (hasMilestone("pi", 4)) amt = amt.max(player.pi.points)
                let ret = amt.times(2).sqrt().floor()
                
                if (ret.gt(10)) ret = ret.log10().times(10)
                if (ret.gt(50)) ret = ret.times(2).log10().times(25)

                return ret.floor()
        },
        effectDescription(){
                let eff = layers.pi.effect()
                let a = "which increases the Incrementy Stamina softcap by " + formatWhole(eff)
                let b = ""
                if (!hasMilestone("pi", 4)) b = " (based on your best Pions in one reset)"
                let c = " (next at " 
                /*
                let ret = amt.times(2).sqrt().floor()
                
                if (ret.gt(10)) ret = ret.log10().times(10)
                if (ret.gt(50)) ret = ret.times(2).log10().times(25)
                */
                let r = eff.plus(1)
                if (r.gt(50)) r = Decimal.pow(10, r.div(25)).div(2)
                if (r.gt(10)) r = Decimal.pow(10, r.div(10))
                r = r.pow(2).div(2)
                r = r.ceil()

                return a + b + c + formatWhole(r) + ")."
        },
        getResetGain() {
                let amt = layers.pi.baseAmount()
                let pre = layers.pi.getGainMultPre()
                let exp = layers.pi.getGainExp()
                let pst = layers.pi.getGainMultPost()
                
                let ret = amt.div(5e132).max(1).log10().times(pre).pow(exp).times(pst)

                return ret.floor()
        },
        getGainExp(){
                let x = new Decimal(.2339)
                if (hasUpgrade("pi", 14)) x = x.times(2)
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1)
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)
                if (hasUpgrade("pi", 22)) x = x.times(1.8)
                if (hasUpgrade("pi", 24)) x = x.times(Decimal.sqrt(player.pi.upgrades.length).max(1))
                return x
        },
        prestigeButtonText(){
                let gain = layers.pi.getResetGain()
                let start = "Reset to gain " + formatWhole(gain) + " Pions<br>"
                let pre = layers.pi.getGainMultPre()
                let exp = layers.pi.getGainExp()
                let pst = layers.pi.getGainMultPost()
                let nextAt = "Next at " + format(Decimal.pow(10, gain.plus(1).div(pst).root(exp).div(pre)).times(5e132)) + " Super Prestige Points"
                if (gain.gt(1e6)) nextAt = ""
                return start + nextAt
        },
        canReset(){
                return layers.pi.getResetGain().gt(0) && !hasMilestone("pi", 5)
        },
        update(diff){
                player.pi.best = player.pi.best.max(player.pi.points)

                if (hasMilestone("pi", 5)) {
                        let x = layers.pi.getResetGain()
                        player.pi.points = player.pi.points.plus(x.times(diff))
                        player.pi.bestOnce = player.pi.bestOnce.max(x)
                }
        },
        milestones: {
                1: {
                        requirementDescription: "<b>Fore</b><br>Requires: 1 Pions in one reset", 
                        effectDescription: "Each milestone makes the Incrementy Stamina softcap start 2 later",
                        done(){
                                return player.pi.bestOnce.gte(1)
                        },
                },
                2: { //2^^^2 = 2^^(2^^2) = 2^^(2^2) = 2^^4 = 2^2^2^2 = 2^2^4 = 2^16 = 65536
                        requirementDescription: "<b>Four</b><br>Requires: 2 Pions in one reset", 
                        effectDescription: "Particle Buyable Autobuyers are 5x faster",
                        done(){
                                return player.pi.bestOnce.gte(2)
                        },
                },
                3: { //2^^^2 = 2^^(2^^2) = 2^^(2^2) = 2^^4 = 2^2^2^2 = 2^2^4 = 2^16 = 65536
                        requirementDescription: "<b>For</b><br>Requires: 6 Pions in one reset", 
                        effectDescription: "Double Super Prestige Point gain per Pion upgrade squared",
                        done(){
                                return player.pi.bestOnce.gte(6)
                        },
                },
                4: { //2^^^2 = 2^^(2^^2) = 2^^(2^2) = 2^^4 = 2^2^2^2 = 2^2^4 = 2^16 = 65536
                        requirementDescription: "<b>idk</b><br>Requires: 24 Pions in one reset", 
                        effectDescription: "Make pion effect based on pions",
                        done(){
                                return player.pi.bestOnce.gte(24)
                        },
                },
                5: { //2^^^2 = 2^^(2^^2) = 2^^(2^2) = 2^^4 = 2^2^2^2 = 2^2^4 = 2^16 = 65536
                        requirementDescription: "<b>idk</b><br>Requires: 120 Pions in one reset", 
                        effectDescription: "You gain 100% of your pions on reset per second, and your best Pions per reset is likewise updated",
                        done(){
                                return player.pi.bestOnce.gte(120)
                        },
                },
        },
        upgrades:{
                rows: 4,
                cols: 4,
                11: {
                        title: "Bee",
                        description: "Remove the Joule Challenge points softcap",
                        cost: new Decimal(10),
                        unlocked(){
                                return hasMilestone("pi", 2)
                        }
                },
                12: {
                        title: "Be",
                        description: "Each Pion upgrade multiplies Super Prestige Point gain by Joule challenge points",
                        cost: new Decimal(10),
                        effect(){
                                return Decimal.pow(player.sp.chall1points.plus(1), player.pi.upgrades.length)
                        },
                        unlocked(){
                                return hasUpgrade("pi", 11)
                        }
                },
                13: {
                        title: "Beat",
                        description: "Each Pion upgrade pushes the Incrementy Stamina Softcap back by 1",
                        cost: new Decimal(15),
                        unlocked(){
                                return hasUpgrade("pi", 12)
                        }
                },
                14: {
                        title: "Beet",
                        description: "Square the Pion gain formula",
                        cost: new Decimal(15),
                        unlocked(){
                                return hasUpgrade("pi", 13)
                        }
                },
                21: {
                        title: "idk1",
                        description: "Each Pion upgrade multiplies Super Prestige Point gain by Pions",
                        cost: new Decimal(100),
                        unlocked(){
                                return hasUpgrade("pi", 14)
                        }
                },
                22: {
                        title: "idk1",
                        description: "Each Pion upgrade multiplies Shards multiply Amoeba gain and multiply Pion gain by 1.8",
                        cost: new Decimal(120),
                        unlocked(){
                                return hasUpgrade("pi", 21)
                        }
                },
                23: {
                        title: "idk2",
                        description: "Each Pion milestone raises Jewel effect to the .8",
                        cost: new Decimal(200),
                        unlocked(){
                                return hasUpgrade("pi", 22)
                        }
                },
                24: {
                        title: "idk2",
                        description: "The square root of pion upgrades multiplies pion gain",
                        cost: new Decimal(200),
                        unlocked(){
                                return hasUpgrade("pi", 23)
                        }
                },
                31: {
                        title: "idk3",
                        description: "Neutrino autobuyers can buy 2x more",
                        cost: new Decimal(500),
                        unlocked(){
                                return hasUpgrade("pi", 24)
                        }
                },
        },
        row: 3, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            //{key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return player.sp.best.gt(1e132) || player.pi.best.gt(0)},
        tabFormat: {
                "Milestones": {
                        content: [
                                "main-display",
                                ["prestige-button", "", function (){ return hasMilestone("pi", 5) ? {'display': 'none'} : {}}],
                                ["display-text", function(){
                                        if (!hasMilestone("pi", 5)) return ""
                                        return "You are gaining " + format(layers.pi.getResetGain()) + " Pions per second"
                                }],
                                "milestones",
                        ],
                        unlocked(){
                                return true
                        },
                },
                "Upgrades": {
                        content: [
                                "main-display",
                                "upgrades"
                        ],
                        unlocked(){
                                return true
                        },
                }
        },
        doReset(layer){
                if (false) console.log(layer)
                if (layers[layer].row <= 3) return

                //resource
                player.pi.points = new Decimal(0)
                player.pi.best = new Decimal(0)
                player.pi.times = 0
                player.pi.total = new Decimal(0)
                player.pi.bestOnce = new Decimal(0)
        },
})
