/* VARIOUS SUPPORT FUNCTIONS AND VARIABLES */

var TOKEN_COSTS = [   6390,    7587,    7630,    8160,    8350, 
                      9350,   10000,   10860,   11230,   12600,
                     14460,   15170,   15430,   19780,   24000,
                     30710,   33260,   33444,   42900,   45420,
                     45800,   50600,   60000,   80308,   88020,
                     94500,  101570,  113575,  135666,  136290,
                    139530,  140140,  140750,  176444,  177720,
                    205125,  226800,  259560,  296740,  297910,
                    335080,  336363,  357900,  398888,  405900,
                    433950,  445000,  462700,  467500,  542000,
                    692000,  774000,  793000,  1084e3,  1366e3,
                    1810e3, 18697e2,  1996e3,  2044e3, 23519e2,
                    3805e3,  4666e3,  5338e3,  9499e3,  9859e3,
                   11518e3, 13127e3, 13539e3, 14553e3, 15542e3,
                   16455e3, 20892e3, 23072e3, 28491e3, 34256e3,
                   60576e3, 91049e3, 11858e4, 12317e4, 13287e4,
                   13793e4, 18750e4, 40300e4, 91919e4, 10000e5,
                   24380e5, 29250e5]

var TOKEN_COSTS_EXTREME = [        6395,   7600,   7650,   8735,   9060,
                                  10850,  12390,  13231,  13500,  14190,
                                  15260,  16000,  16280,  18000,  20740,
                                  21650,  28375,  32975,  35000,  35150,
                                  35600,  38500,  45678,  49494,  60125,
                                  61616,  69030,  77177,  77550,  77940,
                                  83680,  87040,  87420, 107270, 120066,
                                 120630, 132275, 149300, 151925, 153460,
                                 194050, 220254, 225947, 260888, 265010,
                                 267200, 275375, 276940, 359037, 599599,
                                 761000, 782287, 1166e3, 1367e3, 1852e3,
                                 2823e3, 2914e3, 3027e3, 3366e3, 5199e3,
                                 5622e3, 6263e3, 6487e3, 9936e3, 1695e4,
                                 1885e4,19324e3,38092e3,46173e3,47211e3,
                                61738e3,82413e3,17889e4,18704e4, 2624e5,
                                 3068e5,37352e4,  675e6]


function tokenTetrationBase(){
        let tetBase = 10
        if (hasMilestone("or", 2))      tetBase = 9.5
        if (hasMilestone("or", 5))      tetBase = 9
        if (hasUpgrade("or", 231))      tetBase = 8.5
        if (hasUpgrade("or", 232))      tetBase = 8
        if (hasUpgrade("or", 34))       tetBase = 7.5
        if (hasUpgrade("or", 35))       tetBase = 7
        if (hasMilestone("an", 36))     tetBase = 6
        if (hasMilestone("sp", 14))     tetBase = 10
        return tetBase 
}

function tokenNextAt(){
        let len = (player.extremeMode ? TOKEN_COSTS_EXTREME : TOKEN_COSTS).length
        let amt = player.tokens.total

        amt = amt.sub(tmp.tokens.getMinusEffectiveTokens).floor()
        
        if (amt.lt(0)) return amt.plus(5000).pow10()

        if (amt.gte(len)) {
                let tetBase = tmp.tokens.getTetrationBase
                let add = hasUpgrade("hu", 101) ? 0 : hasChallenge("hu", 11) ? 1 : 4
                return Decimal.tetrate(tetBase, amt.sub(len).div(tmp.tokens.getTetrationScalingDivisor).plus(add))
        }
        amt = Math.round(amt.toNumber())
        let additional = player.hardMode ? 1e4 : 1
        if (player.extremeMode) return Decimal.pow(10, TOKEN_COSTS_EXTREME[amt]).times(additional)
        return Decimal.pow(10, TOKEN_COSTS[amt]).times(additional)

        /*
        Generalized formula: 
        player.points.slog().sub(4).times(tmp.tokens.getTetrationScalingDivisor).plus(87).plus(tmp.tokens.getMinusEffectiveTokens).ceil()
        */
}

function minusEffectiveTokens(){
        let a = decimalZero
                
        if (hasUpgrade("tokens", 73))   a = a.plus(1)
        if (hasMilestone("p", 1))       a = a.plus(1)
        if (hasUpgrade("p", 11))        a = a.plus(1)
        if (hasUpgrade("mu", 22))       a = a.plus(1)
        if (hasUpgrade("mu", 24))       a = a.plus(1)
        if (hasMilestone("l", 9))       a = a.plus(player.l.challenges[11]/(player.extremeMode ? 1 : 2))
        if (hasUpgrade("p", 41))        a = a.plus(player.extremeMode ? 3 : 1)
        if (!hasUpgrade("or", 132))     a = a.plus(layers.l.grid.getGemEffect(303))
        if (hasMilestone("l", 41))      a = a.plus(player.extremeMode ? tmp.l.getNonZeroGemCount :  1)
        if (hasChallenge("l", 52))      a = a.plus(tmp.l.challenges[52].reward)
        if (hasUpgrade("d", 33))        a = a.plus(player.d.upgrades.length)
        if (hasMilestone("cells", 25) && !player.extremeMode) {
                                        a = a.plus(player.cells.milestones.length)
        }
        if (hasMilestone("t", 2))       a = a.plus(player.t.milestones.length)
        if (hasMilestone("t", 3))       a = a.plus(player.t.milestones.length)
        if (hasUpgrade("cells", 45))    a = a.plus(player.cells.upgrades.length)
                                        a = a.plus(tmp.tokens.buyables[112].effect)
        if (hasUpgrade("t", 141))       a = a.plus(player.t.upgrades.length)
        if (hasUpgrade("sci", 244))     a = a.plus(Math.floor(tmp.sci.upgrades.carbonUpgradesLength / 5))
                                        a = a.plus(tmp.sci.buyables[303].effect)
        if (hasUpgrade("l", 12))        a = a.plus(player.l.upgrades.length)
        if (hasMilestone("or", 14))     a = a.plus(player.or.milestones.length * 3)
        if (hasUpgrade("or", 132))      a = a.plus(player.or.upgrades.length * 3)
        if (hasUpgrade("sci", 203))     a = a.plus(1)
        if (hasUpgrade("sci", 303))     a = a.plus(1)
        if (hasUpgrade("p", 113))       a = a.plus(1)
        if (hasUpgrade("sci", 415))     a = a.plus(tmp.sci.upgrades.proteinUpgradesLength)
        if (hasUpgrade("sci", 454))     a = a.plus(tmp.sci.upgrades.proteinUpgradesLength * 3.5)
        
        return a.ceil()
}

function tokenCFT1(){
        if (hasUpgrade("sci", 562))     return "max(floor(x<sup>.25</sup>)-1, 0)"
        if (hasMilestone("t", 13))      return "max(floor(x<sup>.26</sup>)-1, 0)"
        if (hasMilestone("t", 10))      return "max(floor(x<sup>.27</sup>)-1, 0)"
        if (hasMilestone("t", 9))       return "max(floor(x<sup>.28</sup>)-1, 0)"
        if (hasMilestone("t", 8))       return "max(floor(x<sup>.29</sup>)-1, 0)"
        if (hasUpgrade("t", 65))        return "max(floor(x<sup>.3</sup>)-1, 0)"
        if (hasMilestone("t", 5))       return "max(floor(x<sup>.31</sup>)-1, 0)"
        if (hasMilestone("cells", 62))  return "max(floor(x<sup>.32</sup>)-1, 0)"
        if (hasMilestone("cells", 61))  return "max(floor(x<sup>.33</sup>)-1, 0)"
        if (hasMilestone("cells", 59))  return "max(floor(x<sup>.34</sup>)-1, 0)"
        if (hasMilestone("cells", 58))  return "max(floor(x<sup>.35</sup>)-1, 0)"
        if (hasMilestone("cells", 57))  return "max(floor(x<sup>.36</sup>)-1, 0)"
        if (hasMilestone("cells", 56))  return "max(floor(x<sup>.37</sup>)-1, 0)"
        if (hasMilestone("cells", 55))  return "max(floor(x<sup>.38</sup>)-1, 0)"
        if (hasMilestone("cells", 54))  return "max(floor(x<sup>.39</sup>)-1, 0)"
        if (hasMilestone("cells", 50))  return "max(floor(x<sup>.4</sup>)-1, 0)"
        if (hasMilestone("l", 31))      return "floor(x<sup>.4</sup>)"
        if (hasMilestone("l", 30))      return "floor(x<sup>.41</sup>)"
        if (hasMilestone("l", 29))      return "floor(x<sup>.43</sup>)"
        if (hasUpgrade("p", 53))        return "floor(x<sup>.44</sup>)"
        if (hasMilestone("l", 26))      return "floor(x<sup>.45</sup>)"
        if (hasMilestone("l", 25))      return "floor(x<sup>.46</sup>)"
        if (hasMilestone("l", 24))      return "floor(x<sup>.47</sup>)"
        if (hasUpgrade("mu", 44))       return "floor(x<sup>.48</sup>)"
        if (hasMilestone("l", 18))      return "floor(x<sup>.49</sup>)"
        if (hasMilestone("l", 10))      return "floor(x<sup>.5</sup>)"
        if (hasUpgrade("n", 31))        return "round(x<sup>.5</sup>)"
        if (hasUpgrade("n", 24))        return "round(x<sup>.55</sup>)"
        if (hasUpgrade("mini", 33))     return "round(x<sup>.6</sup>)"
        if (hasUpgrade("tokens", 82))   return "round(x<sup>.65</sup>)"
        if (hasUpgrade("h", 75))        return "round(x<sup>.7</sup>)"
        if (hasUpgrade("h", 85))        return "ceil(x<sup>.7</sup>)"
        if (hasUpgrade("h", 84))        return "ceil(x<sup>.8</sup>)"
        if (hasUpgrade("h", 83))        return "ceil(x<sup>.9</sup>)"
        if (hasUpgrade("c", 23))        return "x"
                                        return "2<sup>x</sup>"
}

function tokenCFID1(){
        if (hasUpgrade("sci", 562))     return 35
        if (hasMilestone("t", 13))      return 34
        if (hasMilestone("t", 10))      return 33
        if (hasMilestone("t", 9))       return 32
        if (hasMilestone("t", 8))       return 31
        if (hasUpgrade("t", 65))        return 30
        if (hasMilestone("t", 5))       return 29
        if (hasMilestone("cells", 62))  return 28
        if (hasMilestone("cells", 61))  return 27
        if (hasMilestone("cells", 59))  return 26
        if (hasMilestone("cells", 58))  return 25
        if (hasMilestone("cells", 57))  return 24
        if (hasMilestone("cells", 56))  return 23
        if (hasMilestone("cells", 55))  return 22
        if (hasMilestone("cells", 54))  return 21
        if (hasMilestone("cells", 50))  return 20
        if (hasMilestone("l", 31))      return 19
        if (hasMilestone("l", 30))      return 18
        if (hasMilestone("l", 29))      return 17
        if (hasUpgrade("p", 53))        return 16
        if (hasMilestone("l", 26))      return 15
        if (hasMilestone("l", 25))      return 14
        if (hasMilestone("l", 24))      return 13
        if (hasUpgrade("mu", 44))       return 12
        if (hasMilestone("l", 18))      return 11
        if (hasMilestone("l", 10))      return 10
        if (hasUpgrade("n", 31))        return 9
        if (hasUpgrade("n", 24))        return 8
        if (hasUpgrade("mini", 33))     return 7
        if (hasUpgrade("tokens", 82))   return 6
        if (hasUpgrade("h", 75))        return 5
        if (hasUpgrade("h", 85))        return 4
        if (hasUpgrade("h", 84))        return 3
        if (hasUpgrade("h", 83))        return 2
        if (hasUpgrade("c", 23))        return 1
                                        return 0
}

function tokenCost1(x){
        if (hasUpgrade("sci", 562))     return x.pow(.25).floor().sub(1).max(0)
        if (hasMilestone("t", 13))      return x.pow(.26).floor().sub(1).max(0)
        if (hasMilestone("t", 10))      return x.pow(.27).floor().sub(1).max(0)
        if (hasMilestone("t", 9))       return x.pow(.28).floor().sub(1).max(0)
        if (hasMilestone("t", 8))       return x.pow(.29).floor().sub(1).max(0)
        if (hasUpgrade("t", 65))        return x.pow(.3).floor().sub(1).max(0)
        if (hasMilestone("t", 5))       return x.pow(.31).floor().sub(1).max(0)
        if (hasMilestone("cells", 62))  return x.pow(.32).floor().sub(1).max(0)
        if (hasMilestone("cells", 61))  return x.pow(.33).floor().sub(1).max(0)
        if (hasMilestone("cells", 59))  return x.pow(.34).floor().sub(1).max(0)
        if (hasMilestone("cells", 58))  return x.pow(.35).floor().sub(1).max(0)
        if (hasMilestone("cells", 57))  return x.pow(.36).floor().sub(1).max(0)
        if (hasMilestone("cells", 56))  return x.pow(.37).floor().sub(1).max(0)
        if (hasMilestone("cells", 55))  return x.pow(.38).floor().sub(1).max(0)
        if (hasMilestone("cells", 54))  return x.pow(.39).floor().sub(1).max(0)
        if (hasMilestone("cells", 50))  return x.pow(.4).floor().sub(1).max(0)
        if (hasMilestone("l", 31))      return x.pow(.4).floor()
        if (hasMilestone("l", 30))      return x.pow(.41).floor()
        if (hasMilestone("l", 29))      return x.pow(.43).floor()
        if (hasUpgrade("p", 53))        return x.pow(.44).floor()
        if (hasMilestone("l", 26))      return x.pow(.45).floor()
        if (hasMilestone("l", 25))      return x.pow(.46).floor()
        if (hasMilestone("l", 24))      return x.pow(.47).floor()
        if (hasUpgrade("mu", 44))       return x.pow(.48).floor()
        if (hasMilestone("l", 18))      return x.pow(.49).floor()
        if (hasMilestone("l", 10))      return x.pow(.5).floor()
        if (hasUpgrade("n", 31))        return x.pow(.5).round()
        if (hasUpgrade("n", 24))        return x.pow(.55).round()
        if (hasUpgrade("mini", 33))     return x.pow(.6).round()
        if (hasUpgrade("tokens", 82))   return x.pow(.65).round()
        if (hasUpgrade("h", 75))        return x.pow(.7).round()
        if (hasUpgrade("h", 85))        return x.pow(.7).ceil()
        if (hasUpgrade("h", 84))        return x.pow(.8).ceil()
        if (hasUpgrade("h", 83))        return x.pow(.9).ceil()
        if (hasUpgrade("c", 23))        return x
                                        return Decimal.pow(2, x)
}

function tokenCFID2(){
        let tertComps = player.cells.challenges[21]
        let r = hasUpgrade("hu", 64) && (hasMilestone("r", 6) || player.hu.points.gte("1e6219"))
        let s = hasUpgrade("hu", 105) && player.hu.points.gte("1e93477")
        
        if (hasUpgrade("hu", 151))      return 55
        if (hasUpgrade("hu", 143))      return 54
        if (s)                          return 53
        if (hasUpgrade("hu", 105))      return 52
        if (hasMilestone("hu", 89))     return 51
        if (r)                          return 50
        if (hasUpgrade("hu", 55))       return 49
        if (hasUpgrade("hu", 54))       return 48
        if (hasUpgrade("hu", 53))       return 47
        if (hasUpgrade("hu", 52))       return 46
        if (hasUpgrade("hu", 51))       return 45
        if (hasUpgrade("hu", 45))       return 44
        if (hasUpgrade("hu", 33))       return 43
        if (hasUpgrade("hu", 24))       return 42
        if (hasMilestone("pl", 21))     return 41
        if (hasUpgrade("pl", 34))       return 40
        if (hasUpgrade("e", 41))        return 39
        if (hasUpgrade("e", 33))        return 38
        if (hasUpgrade("e", 32))        return 37
        if (hasUpgrade("e", 21))        return 36
        if (hasUpgrade("tokens", 134))  return 35
        if (hasUpgrade("tokens", 125))  return 34
        if (hasUpgrade("tokens", 201))  return 33
        if (hasUpgrade("nu", 44))       return 32
        if (hasUpgrade("sp", 93))       return 31
        if (hasMilestone("sp", 12))     return 30
        if (hasMilestone("an", 44))     return 29
        if (player.ch.everUpgrade33)    return 28
        if (hasMilestone("an", 33))     return 27
        if (hasUpgrade("an", 51))       return 26
        if (hasUpgrade("ch", 23))       return 25
        if (hasMilestone("an", 25))     return 24
        if (hasUpgrade("or", 43))       return 23
        if (hasUpgrade("or", 42))       return 22
        if (hasUpgrade("or", 355))      return 21
        if (hasUpgrade("or", 353))      return 20
        if (hasMilestone("an", 15))     return 19
        if (hasMilestone("an", 11))     return 18
        if (hasMilestone("or", 25))     return 17
        if (hasUpgrade("or", 335))      return 16
        if (hasUpgrade("or", 25))       return 15
        if (hasUpgrade("or", 334))      return 14
        if (hasUpgrade("or", 24))       return 13
        if (hasUpgrade("or", 22))       return 12
        if (hasMilestone("or", 21))     return 11
        if (hasUpgrade("or", 315))      return 10
        if (hasUpgrade("or", 314))      return 9
        if (hasUpgrade("or", 223))      return 8
        if (hasUpgrade("or", 221))      return 7
        if (hasUpgrade("or", 304))      return 6
        if (hasUpgrade("or", 151))      return 5
        if (hasUpgrade("or", 15))       return 4
        if (hasUpgrade("or", 204))      return 3
        if (tertComps >= 4)             return 2
        if (hasMilestone("or", 11))     return 1
        return 0
}

function tokenCFT2(){
        let tertComps = player.cells.challenges[21]
        let r3c = tmp.an.clickables.rowThreeOff
        let m1 = hasAchievement("an", 32) && (player.an.achActive[32] || hasMilestone("nu", 12)) && r3c >= 1
        let m2 = m1 && r3c >= 2
        let m3 = m1 && r3c >= 3
        let m4 = m1 && r3c >= 4
        let r = hasUpgrade("hu", 64) && player.hu.points.gte("1e6219")
        let s = hasUpgrade("hu", 105) && player.hu.points.gte("1e93477")
        
        if (hasUpgrade("hu", 151))      return "ceil(x<sup>1.03</sup>)"
        if (hasUpgrade("hu", 143))      return "ceil(x<sup>1.035</sup>)"
        if (s)                          return "ceil(x<sup>1.04</sup>)"
        if (hasUpgrade("hu", 105))      return "ceil(x<sup>1.044</sup>)"
        if (hasMilestone("hu", 89))     return "ceil(x<sup>1.05</sup>)"
        if (r)                          return "ceil(x<sup>1.06</sup>)"
        if (hasUpgrade("hu", 55))       return "ceil(x<sup>1.07</sup>)"
        if (hasUpgrade("hu", 54))       return "ceil(x<sup>1.08</sup>)"
        if (hasUpgrade("hu", 53))       return "ceil(x<sup>1.09</sup>)"
        if (hasUpgrade("hu", 52))       return "ceil(x<sup>1.1</sup>)"
        if (hasUpgrade("hu", 51))       return "ceil(x<sup>1.11</sup>)"
        if (hasUpgrade("hu", 45))       return "ceil(x<sup>1.12</sup>)"
        if (hasUpgrade("hu", 33))       return "ceil(x<sup>1.13</sup>)"
        if (hasUpgrade("hu", 24))       return "ceil(x<sup>1.14</sup>)"
        if (hasMilestone("pl", 21))     return "ceil(x<sup>1.15</sup>)"
        if (hasUpgrade("pl", 34))       return "ceil(x<sup>1.155</sup>)"
        if (hasUpgrade("e", 41))        return "ceil(x<sup>1.16</sup>)"
        if (hasUpgrade("e", 33))        return "ceil(x<sup>1.165</sup>)"
        if (hasUpgrade("e", 32))        return "ceil(x<sup>1.17</sup>)"
        if (hasUpgrade("e", 21))        return "ceil(x<sup>1.18</sup>)"
        if (hasUpgrade("tokens", 134))  return "ceil(x<sup>1.19</sup>)"
        if (hasUpgrade("tokens", 125))  return "ceil(x<sup>1.2</sup>)"
        if (hasUpgrade("tokens", 201))  return "ceil(x<sup>1.21</sup>)"
        if (hasUpgrade("nu", 44))       return "ceil(x<sup>1.22</sup>)"
        if (hasUpgrade("sp", 93))       return "ceil(x<sup>1.23</sup>)"
        if (hasMilestone("sp", 12))     return "ceil(x<sup>1.24</sup>)"
        if (hasMilestone("an", 44))     return "ceil(x<sup>1.25</sup>)"
        if (hasMilestone("nu", 17))     return "ceil(x<sup>1.26</sup>)"
        if (hasMilestone("ch", 31))     return "ceil(x<sup>1.27</sup>)"
        if (hasUpgrade("nu", 22))       return "ceil(x<sup>1.272</sup>)"
        if (hasMilestone("ch", 28))     return "ceil(x<sup>1.274</sup>)"
        if (hasMilestone("ch", 26))     return "ceil(x<sup>1.28</sup>)"
        if (hasMilestone("nu", 15))     return "ceil(x<sup>1.286</sup>)"
        if (hasMilestone("ch", 22))     return "ceil(x<sup>1.29</sup>)"
        if (m4)                         return "ceil(x<sup>1.30</sup>)"
        if (m3)                         return "ceil(x<sup>1.31</sup>)"
        if (m2)                         return "ceil(x<sup>1.32</sup>)"
        if (m1)                         return "ceil(x<sup>1.33</sup>)"
        if (hasMilestone("an", 35))     return "ceil(x<sup>1.34</sup>)"
        if (hasMilestone("an", 34))     return "ceil(x<sup>1.35</sup>)"
        if (player.ch.everUpgrade33)    return "ceil(x<sup>1.36</sup>)"

        if (hasUpgrade("an", 51))       return "max(floor(x<sup>.45</sup>)-1, 0)"
        if (hasUpgrade("ch", 23))       return "max(floor(x<sup>.46</sup>)-1, 0)"
        if (hasMilestone("an", 25))     return "max(floor(x<sup>.47</sup>)-1, 0)"
        if (hasUpgrade("or", 43))       return "max(floor(x<sup>.48</sup>)-1, 0)"
        if (hasUpgrade("or", 42))       return "max(floor(x<sup>.49</sup>)-1, 0)"
        if (hasUpgrade("or", 355))      return "max(floor(x<sup>.5</sup>)-1, 0)"
        if (hasUpgrade("or", 353))      return "max(floor(x<sup>.51</sup>)-1, 0)"
        if (hasMilestone("an", 15))     return "max(floor(x<sup>.52</sup>)-1, 0)"
        if (hasMilestone("an", 11))     return "max(floor(x<sup>.53</sup>)-1, 0)"
        if (hasMilestone("or", 25))     return "max(floor(x<sup>.54</sup>)-1, 0)"
        if (hasUpgrade("or", 335))      return "max(floor(x<sup>.55</sup>)-1, 0)"
        if (hasUpgrade("or", 25))       return "max(floor(x<sup>.56</sup>)-1, 0)"
        if (hasUpgrade("or", 334))      return "max(floor(x<sup>.57</sup>)-1, 0)"
        if (hasUpgrade("or", 24))       return "max(floor(x<sup>.58</sup>)-1, 0)"
        if (hasUpgrade("or", 22))       return "max(floor(x<sup>.6</sup>)-1, 0)"
        if (hasMilestone("or", 21))     return "floor(x<sup>.6</sup>)"
        if (hasUpgrade("or", 315))      return "floor(x<sup>.63</sup>)"
        if (hasUpgrade("or", 314))      return "floor(x<sup>.66</sup>)"
        if (hasUpgrade("or", 223))      return "floor(x<sup>.7</sup>)"
        if (hasUpgrade("or", 221))      return "round(x<sup>.7</sup>)"
        if (hasUpgrade("or", 304))      return "ceil(x<sup>.7</sup>)"
        if (hasUpgrade("or", 151))      return "ceil(x<sup>.75</sup>)"
        if (hasUpgrade("or", 15))       return "ceil(x<sup>.8</sup>)"
        if (hasUpgrade("or", 204))      return "ceil(x<sup>.85</sup>)"
        if (tertComps >= 4)             return "ceil(x<sup>.9</sup>)"
        if (hasMilestone("or", 11))     return "x"
                                        return "1+x"
}

function tokenCost2(x){
        let tertComps = player.cells.challenges[21]
        let r3c = tmp.an.clickables.rowThreeOff
        let m1 = hasAchievement("an", 32) && (player.an.achActive[32] || hasMilestone("nu", 12)) && r3c >= 1
        let m2 = m1 && r3c >= 2
        let m3 = m1 && r3c >= 3
        let m4 = m1 && r3c >= 4
        let r = hasUpgrade("hu", 64) && player.hu.points.gte("1e6219")
        let s = hasUpgrade("hu", 105) && player.hu.points.gte("1e93477")
        
        if (hasUpgrade("hu", 151))      return x.pow(1.03).ceil()
        if (hasUpgrade("hu", 143))      return x.pow(1.035).ceil()
        if (s)                          return x.pow(1.04).ceil()
        if (hasUpgrade("hu", 105))      return x.pow(1.044).ceil()
        if (hasMilestone("hu", 89))     return x.pow(1.05).ceil()
        if (r)                          return x.pow(1.06).ceil()
        if (hasUpgrade("hu", 55))       return x.pow(1.07).ceil()
        if (hasUpgrade("hu", 54))       return x.pow(1.08).ceil()
        if (hasUpgrade("hu", 53))       return x.pow(1.09).ceil()
        if (hasUpgrade("hu", 52))       return x.pow(1.1).ceil()
        if (hasUpgrade("hu", 51))       return x.pow(1.11).ceil()
        if (hasUpgrade("hu", 45))       return x.pow(1.12).ceil()
        if (hasUpgrade("hu", 33))       return x.pow(1.13).ceil()
        if (hasUpgrade("hu", 24))       return x.pow(1.14).ceil()
        if (hasMilestone("pl", 21))     return x.pow(1.15).ceil()
        if (hasUpgrade("pl", 34))       return x.pow(1.155).ceil()
        if (hasUpgrade("e", 41))        return x.pow(1.16).ceil()
        if (hasUpgrade("e", 33))        return x.pow(1.165).ceil()
        if (hasUpgrade("e", 32))        return x.pow(1.17).ceil()
        if (hasUpgrade("e", 21))        return x.pow(1.18).ceil()
        if (hasUpgrade("tokens", 134))  return x.pow(1.19).ceil()
        if (hasUpgrade("tokens", 125))  return x.pow(1.2).ceil()
        if (hasUpgrade("tokens", 201))  return x.pow(1.21).ceil()
        if (hasUpgrade("nu", 44))       return x.pow(1.22).ceil()
        if (hasUpgrade("sp", 93))       return x.pow(1.23).ceil()
        if (hasMilestone("sp", 12))     return x.pow(1.24).ceil()
        if (hasMilestone("an", 44))     return x.pow(1.25).ceil()
        if (hasMilestone("nu", 17))     return x.pow(1.26).ceil()
        if (hasMilestone("ch", 31))     return x.pow(1.27).ceil()
        if (hasUpgrade("nu", 22))       return x.pow(1.272).ceil()
        if (hasMilestone("ch", 28))     return x.pow(1.274).ceil()
        if (hasMilestone("ch", 26))     return x.pow(1.28).ceil()
        if (hasMilestone("nu", 15))     return x.pow(1.286).ceil()
        if (hasMilestone("ch", 22))     return x.pow(1.29).ceil()
        if (m4)                         return x.pow(1.30).ceil()
        if (m3)                         return x.pow(1.31).ceil()
        if (m2)                         return x.pow(1.32).ceil()
        if (m1)                         return x.pow(1.33).ceil()
        if (hasMilestone("an", 35))     return x.pow(1.34).ceil()
        if (hasMilestone("an", 34))     return x.pow(1.35).ceil()
        if (player.ch.everUpgrade33)    return x.pow(1.36).ceil()
        
        if (hasMilestone("an", 33) && x.lte(100)) return decimalZero
        if (hasUpgrade("an", 51))       return x.pow(.45).floor().sub(1).max(0)
        if (hasUpgrade("ch", 23))       return x.pow(.46).floor().sub(1).max(0)
        if (hasMilestone("an", 25))     return x.pow(.47).floor().sub(1).max(0)
        if (hasUpgrade("or", 43))       return x.pow(.48).floor().sub(1).max(0)
        if (hasUpgrade("or", 42))       return x.pow(.49).floor().sub(1).max(0)
        if (hasUpgrade("or", 355))      return x.pow(.5).floor().sub(1).max(0)
        if (hasUpgrade("or", 353))      return x.pow(.51).floor().sub(1).max(0)
        if (hasMilestone("an", 15))     return x.pow(.52).floor().sub(1).max(0)
        if (hasMilestone("an", 11))     return x.pow(.53).floor().sub(1).max(0)
        if (hasMilestone("or", 25))     return x.pow(.54).floor().sub(1).max(0)
        if (hasUpgrade("or", 335))      return x.pow(.55).floor().sub(1).max(0)
        if (hasUpgrade("or", 25))       return x.pow(.56).floor().sub(1).max(0)
        if (hasUpgrade("or", 334))      return x.pow(.57).floor().sub(1).max(0)
        if (hasUpgrade("or", 24))       return x.pow(.58).floor().sub(1).max(0)
        if (hasUpgrade("or", 22))       return x.pow(.6).floor().sub(1).max(0)
        if (hasMilestone("or", 21))     return x.pow(.6).floor()
        if (hasUpgrade("or", 315))      return x.pow(.63).floor()
        if (hasUpgrade("or", 314))      return x.pow(.66).floor()
        if (hasUpgrade("or", 223))      return x.pow(.7).floor()
        if (hasUpgrade("or", 221))      return x.pow(.7).round()
        if (hasUpgrade("or", 304))      return x.pow(.7).ceil()
        if (hasUpgrade("or", 151))      return x.pow(.75).ceil()
        if (hasUpgrade("or", 15))       return x.pow(.8).ceil()
        if (hasUpgrade("or", 204))      return x.pow(.85).ceil()
        if (tertComps >= 4)             return x.pow(.9).ceil()
        if (hasMilestone("or", 11))     return x
        return x.plus(1)
}







