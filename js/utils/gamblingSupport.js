function getAllowedCharacterValues(){
        let a = [1,2,3,4,5,6,7]
        if (hasUpgrade("mini", 24)) a.push(8)
        if (hasMilestone("tokens", 24)) a.push(9)
        if (false) a.push(10)
        if (false) a.push(11)

        if (hasUpgrade("mini", 25)) a = filterOut(a, [5])
        if (hasUpgrade("mini", 33)) a = filterOut(a, [6])
        if (hasUpgrade("mini", 34)) a = filterOut(a, [7])
        
        return a
}

function getRandomSlotValue(number){
        let allowedVals = getAllowedCharacterValues()
        let len = allowedVals.length
        let a = []
        
        for (i = 0; i < number; i++){
                x = Math.floor(Math.random() * len)
                a.push(allowedVals[x])
        }
        return a
}

function getUnicodeCharacter(value, force = false){
        if (!player.mini.c_points.displayCharacters && !force) return ""
        if (value <= 4) {
                return "♠♣♥♦".slice(value-1, value)
        }
        if (value == 5) return "🛑"
        if (value == 6) return "📪"
        if (value == 7) return "🌲"
        if (value == 8) return "💰"
        if (value == 9) return "🍎"
        if (value ==10) return "🌹"
        if (value ==11) return "🔀"
        console.log("broke")
        return "abc"
}

function getCharacterValue(charID){
        let ret = {
                1: 2,
                2: 2,
                3: 2,
                4: 2,
                5: 1,
                6: 4,
                7: 4,
                8: 300,
                9: 150,
                10:1e3,
                11:1e4,
        }[charID]
        ret = new Decimal(ret)

        if (hasUpgrade("mini", 11)) ret = ret.plus(player.mini.upgrades.length)

        if (hasUpgrade("mini", 31)) {
                if (charID <= 4) ret = ret.pow(2)
                if (charID == 8) ret = ret.times(3)
        }

        return ret

}

function getRewardAmount(spins){
        // if they are all the same give a boost based on the value
        let len = spins.length
        
        let c2 = function(x){
                return x*(x+1)/2
        }
        let rollNums = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                5: 0,
                6: 0,
                7: 0,
                8: 0,
                9: 0,
                10:0,
                11:0,
        }

        for (i = 0; i < spins.length; i++) {
                rollNums[spins[i]] += 1
        }

        let val = new Decimal(1)
        for (i = 1; i <= 11; i++){
                let base = getCharacterValue(i)
                let exp = c2(rollNums[i])
                val = val.times(Decimal.pow(base, exp))
        }
        let a = Math.min(rollNums[1], rollNums[2], rollNums[3], rollNums[4])
        val = val.times(Decimal.pow(30, a ** 2))

        if (hasUpgrade("mini", 32))     val = val.sqrt()
        if (hasUpgrade("mini", 34))     val = val.sqrt()
        if (hasUpgrade("tokens", 92))   val = val.sqrt()
        if (hasUpgrade("sci", 223))     val = val.sqrt()

        return val
}

