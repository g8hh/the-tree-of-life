/*


dx/dt = A-Bx
dx/(A-Bx) = dt
-ln(A-Bx)/B = t+c

so c = -ln(A-B[CURRENT])/B



*/
function getLogisticTimeConstant(current, gain, loss){
        if (current.eq(gain.div(loss))) return Infinity
        if (current.gt(gain.div(loss))) return current.times(loss).sub(gain).ln().div(-1).div(loss)
        return current.times(loss).sub(gain).times(-1).ln().div(-1).div(loss)
}

function logisticTimeUntil(goal, current, gain, loss){
        if (current.gte(goal)) return formatTime(0)
        if (goal.gte(gain.div(loss))) return formatTime(1/0)
        // we have current < goal < gain/loss
        val1 = goal.times(loss) //Bx
        val2 = gain.sub(val1) //A-Bx
        val3 = val2.ln() //ln(A-Bx)
        val4 = val3.times(-1).div(loss) //LHS

        c = getLogisticTimeConstant(current, gain, loss)
        return formatTime(val4.sub(c))  
}


function getLogisticAmount(current, gain, loss, diff){
        if (current.eq(gain.div(loss))) return current
        if (current.lt(gain.div(loss))) {
                c = getLogisticTimeConstant(current, gain, loss)
                
                val1 = c.plus(diff) // t+c
                val2 = val1.times(-1).times(loss) // -B(t+c)
                val3 = Decimal.exp(val2) // this should be A-Bx
                val4 = gain.sub(val3) // should be A-(A-Bx) = Bx
                val5 = val4.div(loss) // should be x

                return val5
        } else {
                c = getLogisticTimeConstant(current, gain, loss)
                
                val1 = c.plus(diff) // t+c
                val2 = val1.times(-1).times(loss) // -B(t+c)
                val3 = Decimal.exp(val2) // this should be Bx-A
                val4 = gain.plus(val3) // should be (Bx-A)+A
                val5 = val4.div(loss) // should be x

                return val5
        }
}

function getAllowedCharacters(){
        let a = ["♠","♣","♥","♦","🍎","📪","🌲"]
        if (false) a.push("💰")
        if (false) a.push("🛑")
        if (false) a.push("🌹")
        if (false) a.push("🔀")

        return a
}

function getAllowedCharacterValues(){
        let a = [1,2,3,4,5,6,7]
        if (false) a.push(8)
        if (false) a.push(9)
        if (false) a.push(10)
        if (false) a.push(11)
        
        return a
}

function getRandomSlotValue(number){
        let poss = getAllowedCharacters()
        let len = poss.length
        let a = []
        let allowedVals = getAllowedCharacterValues()
        for (i = 0; i < number; i++){
                x = Math.floor(Math.random() * len)
                a.push(allowedVals[x])
        }
        return a
}

function getUnicodeCharacter(value){
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
                8: 100,
                9: 3,
                10:10,
                11:8,
        }[charID]
        ret = new Decimal(ret)

        if (hasUpgrade("mini", 11)) ret = ret.plus(player.mini.upgrades.length)

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
        return val
}












