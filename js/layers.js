function getPointGen() {
	if (!canGenPoints()) return new Decimal(0)

	let gain = new Decimal(1)
        if (hasIUpg(11)) gain = gain.times(getIUpgEff(11))
        gain = gain.times(layers.am.effect())
	return gain
}

function filter(list, keep){
        return list.filter(x => keep.includes(x))
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

addLayer("i", {
        name: "Incrementy", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "I", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        startData() { return {
                unlocked: true,
		points: new Decimal(0),
                best: new Decimal(0),
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
                return ret
        },
        getGainExp(){
                let x = new Decimal(1)
                x = x.times(getIBuyableEff(13))
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1)
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)
                x = x.times(getIBuyableEff(11))
                x = x.times(getIBuyableEff(12))
                x = x.times(layers.am.effect())
                if (hasAMUpgrade(11)) x = x.times(getAMUpgEff(11))
                if (hasAMUpgrade(12)) x = x.times(3)
                return x
        },
        update(diff){
                player.i.points = player.i.points.plus(layers.i.getResetGain().times(diff))
                if (!player.i.best) player.i.best = new Decimal(0)
                player.i.best = player.i.best.max(player.i.points)
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
        upgrades: {
                rows: 4,
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
                        description: "Remove the linear cost scaling of Incrementy Stamina and Cache is based on best Incrmenty",
                        cost: new Decimal(1e20),
                        unlocked(){
                                return getBuyableAmount("i", 13).gte(10) || hasAMUpgrade(12) || hasIUpg(24)
                        },
                },
                31: {
                        title: "Kernel", //Colonel
                        description: "Nerf the superexponential Incrementy Stamina scaling",
                        cost: new Decimal(2e21),
                        unlocked(){
                                return getBuyableAmount("i", 12).gte(14) || hasAMUpgrade(12) || hasIUpg(31)
                                //next is 71st 11
                        },
                },
        },
        buyables: {
                rows: 3,
                cols: 3,
                11: {
                        title: "Incrementy Speed",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + getIBuyableFormat(11) + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(getIBuyableEff(11)) + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getIBuyableCost(11)) + " Incrmenty</b><br>"
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
                                return Decimal.pow(1.5, x)
                        },
                        canAfford(){
                                return player.i.points.gte(getIBuyableCost(11))
                        },
                        buy(){
                                let cost = getIBuyableCost(11)
                                if (player.i.points.lt(cost)) return
                                player.i.buyables[11] = player.i.buyables[11].plus(1)
                                // some upgrade should make them not actually remove inc
                                player.i.points = player.i.points.minus(cost)
                        },
                        unlocked(){ return hasIUpg(12) },
                },
                12: {
                        title: "Incrementy Strength",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + getIBuyableFormat(12) + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: x" + format(getIBuyableEff(12)) + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getIBuyableCost(12)) + " Incrmenty</b><br>"
                                return "<br>"+start+eff+cost
                        },
                        cost(a){
                                let x = getBuyableAmount("i", 12).plus(a)
                                let base1 = hasIUpg(23) ? 1 : 4
                                return Decimal.pow(base1, x).times(Decimal.pow(1.25, x.times(x))).times(1e4)
                        },
                        effect(){
                                let x = getBuyableAmount("i", 12)
                                return Decimal.pow(2, x)
                        },
                        canAfford(){
                                return player.i.points.gte(getIBuyableCost(12))
                        },
                        buy(){
                                let cost = getIBuyableCost(12)
                                if (player.i.points.lt(cost)) return
                                player.i.buyables[12] = player.i.buyables[12].plus(1)
                                // some upgrade should make them not actually remove inc
                                player.i.points = player.i.points.minus(cost)
                        },
                        unlocked(){ return hasIUpg(13) },
                },
                13: {
                        title: "Incrementy Stamina",
                        display(){
                                let start = "<b><h2>Amount</h2>: " + getIBuyableFormat(13) + "</b><br>"
                                let eff = "<b><h2>Effect</h2>: ^" + format(getIBuyableEff(13)) + "</b><br>"
                                let cost = "<b><h2>Cost</h2>: " + format(getIBuyableCost(13)) + " Incrmenty</b><br>"
                                return "<br>"+start+eff+cost
                        },
                        cost(a){
                                let x = getBuyableAmount("i", 13).plus(a)
                                let b1 = hasIUpg(24) ? 1 : 2
                                let ret = Decimal.pow(b1, x).times(Decimal.pow(1.25, x.times(x))).times(1e5)
                                let y = x.minus(4).max(1)
                                if (hasIUpg(31)) {
                                        y = new Decimal(1)
                                        if (x.gt(5/3)) x = x.div(2.5).plus(1)
                                }
                                let base1 = y.div(10).plus(1)
                                let base2 = y.sqrt().div(5).plus(1)
                                return ret.times(Decimal.pow(base1, Decimal.pow(base2, x)))
                        },
                        effect(){
                                let x = getBuyableAmount("i", 13)
                                //if (x.gt(10)) x = x.div(10).pow(.99).times(10)
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
                                player.i.points = player.i.points.minus(cost)
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
                player.i.upgrades = filter(player.i.upgrades, keep)

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
                let ret = player.am.points.plus(1)
                if (ret.gt(10)) ret = ret.div(10).sqrt().times(10)
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
                if (player.am.best.eq(0)) return ret.min(1)
                return ret
        },
        getGainExp(){
                let x = new Decimal(.5)
                return x
        },
        getGainMultPre(){
                let x = new Decimal(1)
                return x
        },
        getGainMultPost(){
                let x = new Decimal(1)
                return x
        },
        prestigeButtonText(){
                return "Reset to gain " + formatWhole(layers.am.getResetGain()) + " Antimatter"
        },
        canReset(){
                return layers.am.getResetGain().gt(0)
        },
        update(diff){
                if (!player.am.best) player.am.best = new Decimal(0)
                player.am.best = player.am.best.max(player.am.points)
        },
        row: 1, // Row the layer is in on the tree (0 is the first row)
        hotkeys: [
            //{key: "p", description: "Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
        ],
        layerShown(){return getIBuyablesTotalRow(1).gte(100) || player.am.best.gt(0)},
        upgrades: {
                rows: 3,
                cols: 4,
                11: {
                        title: "Plane", //plain
                        description: "Incrementy multiplies incrementy gain",
                        cost: new Decimal(2),
                        unlocked(){
                                return player.am.best.gte(2)
                        },
                        effect(){
                                let exp = 1
                                return player.i.points.plus(10).log10().pow(exp)
                        },
                },
                12: {
                        title: "Plane", //plain
                        description: "Triple Incrementy gain and keep the first row of Incrementy Upgrades",
                        cost: new Decimal(2),
                        unlocked(){
                                return hasAMUpgrade(11)
                        },
                },
        },
})




