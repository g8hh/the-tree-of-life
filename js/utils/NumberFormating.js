
function exponentialFormat(num, precision, mantissa = true) {
        let e = num.log10().floor()
        let m = num.div(Decimal.pow(10, e))
        if (m.toStringWithDecimalPlaces(precision) == 10) {
                m = new Decimal(1)
                e = e.add(1)
        }
        e = e.gte(10000) ? commaFormat(e, 0) : e.toStringWithDecimalPlaces(0)
        if (mantissa) return m.toStringWithDecimalPlaces(precision) + "e" + e
        else return "e" + e
}

function commaFormat(num, precision) {
        if (num === null || num === undefined) return "NaN"
        if (num.mag < 0.001) return (0).toFixed(precision)
        let init = num.toStringWithDecimalPlaces(precision)
        let portions = init.split(".")
        portions[0] = portions[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")
        if (portions.length == 1) return portions[0]
        return portions[0] + "." + portions[1]
}


function regularFormat(num, precision) {
        if (num === null || num === undefined) return "NaN"
        if (num.mag < 0.001) return (0).toFixed(precision)
        if (num.mag < 0.01) precision = 3
        return num.toStringWithDecimalPlaces(precision)
}

function fixValue(x, y = 0) {
        return x || new Decimal(y)
}

function sumValues(x){
        x = Object.values(x)
        if (!x[0]) return new Decimal(0)
        return x.reduce((a, b) => Decimal.add(a, b))
}

function format(decimal, precision = 2, small) {
        decimal = new Decimal(decimal)
        if (isNaN(decimal.sign) || isNaN(decimal.layer) || isNaN(decimal.mag)) {
                player.hasNaN = true;
                console.log("Sign:" + decimal.sign + "Mag:" + decimal.mag + "Layer:" + decimal.layer) 
                console.log("Sorry that a bug has appeared. Please export this save by running exportSave(). Please give the dev a screenshot of the console and a paste of the save.")
                Decimal(0)
                return "NaN"
        }
        if (decimal.sign < 0) return "-" + format(decimal.neg(), precision)
        if (decimal.mag == Number.POSITIVE_INFINITY) return "Infinity"
        if (decimal.gte("eeee1000")) {
                var slog = decimal.slog()
                if (slog.gte(1e6)) return "F" + format(slog.floor())
                return Decimal.pow(10, slog.sub(slog.floor())).toStringWithDecimalPlaces(3) + "F" + commaFormat(slog.floor(), 0)
        }
        if (decimal.gte("ee10")) return "e" + format(decimal.log10())
        if (decimal.gte("ee7")) return exponentialFormat(decimal, 0, false)
        if (decimal.gte("ee5")) return exponentialFormat(decimal, 0)
        if (decimal.gte(1e9)) return exponentialFormat(decimal, precision)
        if (decimal.gte(1e6)) return commaFormat(decimal, 0)
        if (decimal.gte(1e3)) return commaFormat(decimal, precision)
        if (decimal.gte(0.001) || !small) return regularFormat(decimal, precision)
        if (decimal.eq(0)) return (0).toFixed(precision)

        decimal = invertOOM(decimal) 
        let val = "" 
        if (decimal.lt("1e1000")){ 
                val = exponentialFormat(decimal, precision) 
                return val.replace(/([^(?:e|F)]*)$/, '-$1') 
        } 
        else    
                return format(decimal, precision) + "⁻¹"        

}

function formatCurrency(decimal){
        decimal = new Decimal(decimal)
        if (decimal.gte(1e100)) return format(decimal, 2)
        if (decimal.gte(1e9)) return format(decimal, 3)
        if (decimal.lte(10) && decimal.neq(decimal.floor())) return format(decimal, 2)
        return format(decimal, 0)
}

function formatWhole(decimal) {
        decimal = new Decimal(decimal)
        if (decimal.gte(1e9)) return format(decimal, 2)
        if (decimal.lte(10) && decimal.neq(decimal.floor())) return format(decimal, 2)
        return format(decimal, 0)
}

function formatTime(s) {
        s = new Decimal(s)
        if (s.eq(new Decimal(1/0))) return "Infinite Time"
        if (s < 60) return format(s) + "s"
        else if (s < 3600) return formatWhole(Math.floor(s / 60)) + "m " + format(s % 60) + "s"
        else if (s < 84600) return formatWhole(Math.floor(s / 3600)) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
        else if (s < 31536000) return formatWhole(Math.floor(s / 86400) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
        else return formatWhole(Math.floor(s / 31536000)) + "y " + formatWhole(Math.floor(s / 84600) % 365) + "d " + formatWhole(Math.floor(s / 3600) % 24) + "h " + formatWhole(Math.floor(s / 60) % 60) + "m " + format(s % 60) + "s"
}

function toPlaces(x, precision, maxAccepted) {
        x = new Decimal(x)
        let result = x.toStringWithDecimalPlaces(precision)
        if (new Decimal(result).gte(maxAccepted)) {
                result = new Decimal(maxAccepted - Math.pow(0.1, precision)).toStringWithDecimalPlaces(precision)
        }
        return result
}

// Will also display very small numbers
function formatSmall(x, precision=2) { 
    return format(x, precision, true)    
}

function invertOOM(x){
    let e = x.log10().ceil()
    let m = x.div(Decimal.pow(10, e))
    e = e.neg()
    x = new Decimal(10).pow(e).times(m)

    return x
}