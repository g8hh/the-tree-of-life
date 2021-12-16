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

                return val5.max(0)
        } else {
                c = getLogisticTimeConstant(current, gain, loss)
                
                val1 = c.plus(diff) // t+c
                val2 = val1.times(-1).times(loss) // -B(t+c)
                val3 = Decimal.exp(val2) // this should be Bx-A
                val4 = gain.plus(val3) // should be (Bx-A)+A
                val5 = val4.div(loss) // should be x

                return val5.max(0)
        }
}

function recurse(func, startingValue, times){
        if (times <= 0) return startingValue
        return recurse(func, func(startingValue), times-1)
}

function nCk(n, k){
        return binomial(n, k)
}

var binomials = [ // step 1: small cases
        [1],
        [1,1],
        [1,2,1],
        [1,3,3,1],
        [1,4,6,4,1],
        [1,5,10,10,5,1],
        [1,6,15,20,15,6,1],
        [1,7,21,35,35,21,7,1],
        [1,8,28,56,70,56,28,8,1],
];

// step 2: a function that builds out the LUT if it needs to.
function binomial(n,k) {
        if (n > 30) return 
        while (n >= binomials.length) {
                let s = binomials.length;
                let nextRow = [];
                nextRow[0] = 1;
                for (let i = 1, prev = s - 1; i < s; i++) {
                        nextRow[i] = binomials[prev][i-1] + binomials[prev][i];
                }
                nextRow[s] = 1;
                binomials.push(nextRow);
        }
        return binomials[n][k];
}