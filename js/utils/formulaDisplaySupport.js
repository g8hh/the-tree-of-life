function pointFormulaDisplay(){
        let a = "Point gain is (" + format(getPointConstant(), 1) + "*AX)^BX all dilated ^CX."
        let b = "AX, BX, and CX are initially 1 and boosted as follows."
        let c = ""

        if (tmp.l.effect.gt(1))         c += "Life effect multiplies AX by " + format(tmp.l.effect) + br
        if (tmp.sci.effect.gt(1))       c += "Science effect multiplies AX by " + format(tmp.sci.effect) + br
        if (hasUpgrade("sci", 302))     c += "N Sci II effect multiplies AX by " + format(tmp.sci.upgrades[302].effect) + br
        if (player.easyMode)            c += "Easy mode multiplies AX by 4" + br
        if (c.includes("AX"))           c += br

        if (player.easyMode)            c += "Easy mode multiplies BX by 1.001" + br
        if (hasMilestone("l", 1))       c += "Life Milestone 1 multiplies BX by " + format(tmp.l.milestones[1].effect) + br
        if (hasMilestone("l", 18) && !player.extremeMode) {
                                        c += "Life Milestone 18 multiplies BX by 2" + br
        }
        if (hasUpgrade("mu", 51))       c += "µ XXI multiplies BX by " + format(player.l.points.max(10).log10()) + br
        if (hasMilestone("l", 31)) {
                let l31exp = Math.max(0, player.l.challenges[11] - 100)
                let l31base = 100
                if (player.extremeMode) l31base = 9
                if (hasMilestone("l", 32)) l31base *= 10
                if (hasMilestone("l", 34)) l31base *= 10
                                        c += "Life Milestones 31, 32, and 34 multiply BX by " + format(Decimal.pow(l31base, l31exp)) + br
        }
        if (hasMilestone("l", 33)) {
                let l33base = Math.max(1, player.l.challenges[11]/(player.extremeMode ? 98 : 100) )
                let l33exp = player.mu.buyables[33]
                                        c += "Life Milestone 33 multiplies BX by " + format(Decimal.pow(l33base, l33exp)) + br
        }
        if (layers.l.grid.getGemEffect(102).gt(1)) {
                                        c += "C12 Gems multiply BX by " + format(layers.l.grid.getGemEffect(102)) + br
        }
        if (hasMilestone("a", 18))      c += "Amino Acid milestone 18 multiplies BX by " + format(Decimal.pow(3, getBuyableAmount("l", 23))) + br
        if (!player.extremeMode) {
                let c31base = layers.l.grid.getGemEffect(301)
                if (c31base.gt(1))      c += "C31 Gems multiply BX by " + format(c31base.pow(tmp.l.getNonZeroGemCount)) + br
                let c34base = layers.l.grid.getGemEffect(304)
                if (c34base.gt(1))      c += "C34 Gems multiply BX by " + format(c34base.pow(getBuyableAmount("mu", 32))) + br
                let c65base = layers.l.grid.getGemEffect(605)
                if (c65base.gt(1))      c += "C65 Gems multiply BX by " + format(c65base.pow(getBuyableAmount("l", 11))) + br
                if (!hasUpgrade("or", 132)) {
                        let c73base = layers.l.grid.getGemEffect(703)
                        if (c73base.gt(1)) {
                                        c += "C73 Gems multiply BX by " + format(c73base.pow(getBuyableAmount("a", 21))) + br
                        }
                }
                let c38base = layers.l.grid.getGemEffect(308)
                if (c38base.gt(1))      c += "C38 Gems multiply BX by " + format(c38base.pow(getBuyableAmount("l", 21))) + br
                if (hasMile("l", 36))   c += "Life Milestone 36 multiplies BX by 1.1" + br
        } else {
                let c34base = layers.l.grid.getGemEffect(304)
                if (c34base.gt(1))      c += "C34 Gems multiply BX by " + format(c34base.pow(getBuyableAmount("l", 33))) + br
                if (hasUpg("p", 43))    c += "Phosphorus XVIII multiplies BX by " + format(Decimal.pow(2, player.p.upgrades.length))
                if (hasMile("a", 17))   c += "Amino Acid Milestone 17 multiplies BX by " + format(Decimal.pow(3, player.a.milestones.length)) + br
                if (hasMile("a", 22))   c += "Amino Acid Milestone 22 multiplies BX by " + format(Decimal.pow(1 + player.a.milestones.length/100, player.a.milestones.length)) + br
                                        c += "Extreme Mode multiplies BX by .75" + br
        }
        if (!hasUpgrade("or", 132)) {
                let c54base = layers.l.grid.getGemEffect(504)
                                        c += "C54 Gems multiply BX by " + format(c54base.pow(getBuyableAmount("a", 22))) + br
                let c64base = layers.l.grid.getGemEffect(604)
                                        c += "C64 Gems multiply BX by " + format(c64base.pow(getBuyableAmount("a", 33))) + br
                let c17base = layers.l.grid.getGemEffect(107)
                                        c += "C17 Gems multiply BX by " + format(c17base.pow(getBuyableAmount("a", 32))) + br
                let c18base = layers.l.grid.getGemEffect(108)
                                        c += "C18 Gems multiply BX by " + format(c18base.pow(getBuyableAmount("l", 33).pow(player.extremeMode ? 1.9394 : 1.8))) + br
        }
        if (hasMilestone("a", 19))      c += "Amino Acid Milestone 19 multiply BX by " + format(tmp.a.milestones[19].effect) + br
        if (hasUpgrade("a", 11))        c += "Amino Acid I multiplies BX by " + format(Decimal.pow(3, player.a.upgrades.length))
        if (hasUpgrade("a", 13))        c += "Amino Acid III multiplies BX by " + format(getBuyableAmount("a", 11).max(1))
        if (hasUpgrade("a", 15))        c += "Amino Acid V multiplies BX by " + format(getBuyableAmount("a", 12).max(1))
        if (hasUpgrade("a", 33))        c += "Amino Acid XIII multiplies BX by " + format(Decimal.pow(100, getBuyableAmount("a", 13)))
        let logProteinTimes = hasUpgrade("a", 34) + hasUpgrade("a", 35)
        if (logProteinTimes > 0)        c += "Amino Acid XIII and XIV multiplies BX by " + format(player.a.protein.points.max(10).log10().pow(logProteinTimes)) + br
        if (hasMilestone("a", 24))      c += "Amino Milestone 24 multiplies BX by " + format(tmp.a.milestones[24].effect) + br
        if (!hasUpgrade("or", 223))     c += "siRNA multiplies BX by " + format(tmp.a.buyables[22].effect) + br
        if (hasUpgrade("d", 12)) {
                let ncRNA = getBuyableAmount("a", 31)
                let d12exp = ncRNA.times(player.d.upgrades.length)
                if (ncRNA.gt(1))        c += "DNA II multiplies BX by " + format(ncRNA.pow(d12exp)) + br
        }
        if (hasUpgrade("d", 13)) {
                let d13base = getBuyableAmount("a", 13)
                let d13exp = d13base.times(player.extremeMode && !hasUpgrade("sci", 455) ? 1 : player.d.upgrades.length)
                if (d13base.gt(1))      c += "DNA III multiplies BX by " + format(d13base.pow(d13exp)) + br
        }
        if (hasUpgrade("d", 34)) {
                let a2da = getBuyableAmount("l", 11)
                let d34exp = a2da.times(player.d.upgrades.length)
                                        c += "DNA XIV multiplies BX by " + format(a2da.pow(d34exp)) + br
        }
        if (hasMilestone("d", 27) && tmp.d.milestones[27].effect.gt(1)) {
                                        c += "DNA Milestone 27 multiplies BX by " + format(tmp.d.milestones[27].effect) + br
        }
        if (hasUpgrade("l", 14))        c += "Life IV multiplies BX by " + format(tmp.l.upgrades[14].effect) + br
        if (hasUpgrade("l", 45))        c += "Live XX multiplies BX by " + format(player.l.buyables[22].max(1)) + br
        if (hasUpgrade("sci", 411))     c += "Protein Sci VI multiplies BX by " + format(player.sci.protein_science.points.max(1)) + br
        if (hasUpgrade("sci", 502))     c += "DNA Sci II multiplies BX by " + format(player.d.points.max(1).pow(player.a.buyables[31].plus(player.a.buyables[13]))) + br
        if (hasUpgrade("sci", 504))     c += "DNA Sci IV multiplies BX by " + format(tmp.sci.upgrades[504].effect) + br
        if (c.includes("BX"))           c += br

        if (inChallenge("l", 11))       c += "Dilation multiplies CX by " + format(tmp.l.challenges[11].challengeEffect) + br
        if (inChallenge("l", 12)) {
                let c2depth = tmp.l.challenges[12].getChallengeDepths[2] || 0
                let c5depth = tmp.l.challenges[12].getChallengeDepths[5] || 0  
                let c6depth = tmp.l.challenges[12].getChallengeDepths[6] || 0
                let c7depth = tmp.l.challenges[12].getChallengeDepths[7] || 0

                let c6Layers = (86 + c2depth) * c6depth ** (1/(player.extremeMode ? 10 : 8))
                let c6Base = player.extremeMode ? (hasUpgrade("sci", 451) ? .952 : .951) : .96
                let c7Base = player.extremeMode ? .0188 : .023
                c7Base -= layers.l.grid.getGemEffect(706).toNumber()
                c6Base -= c7Base * c7depth ** .56

                let portion = decimalOne
                let challId = player.l.activeChallengeID
                portion = portion.times(Decimal.pow(player.extremeMode ? .713 : .665, Math.sqrt(c5depth)))
                portion = portion.times(Decimal.pow(c6Base, c6Layers))
                if (challId > 801 && !player.extremeMode) {
                        portion = portion.div(Decimal.pow(200, Math.pow(challId-801, .57)))
                }
                if (challId > 801 && player.extremeMode) {
                        portion = portion.div(Decimal.pow(406, Math.pow(challId-801, .55)))
                }
                if (challId > 803) {
                        let sub = player.extremeMode && challId > 804 ? .058 : 0
                        portion = portion.div(Decimal.pow(2.2 - sub, nCk(challId-802, 2)))
                }
                if (challId > 805 && player.extremeMode) portion = portion.times(1.53)
                if (challId > 806 && player.extremeMode) portion = portion.div(4.47)
                if (challId > 807 && player.extremeMode) portion = portion.div(1.55)

                if (hasMilestone("d", 24)) portion = portion.pow(.94)
                if (hasMilestone("d", 25) && player.extremeMode) portion = portion.pow(.973)
                
                let c58exp = Math.max(0, tmp.l.getNonZeroGemCount - 53)
                let c58base = layers.l.grid.getGemEffect(508)
                
                portion = portion.pow(c58base.pow(c58exp))
                                        c += "Selection multiplies CX by " + format(portion) + br
        }
        if (!hasMilestone("ch", 15)) {
                if (hasUpgrade("cells", 11))    c += "Cells I multiplies CX by " + format(tmp.cells.upgrades[11].effect) + br
                if (hasUpgrade("cells", 61))    c += "Cells XXVI multiplies CX by " + format(Decimal.pow(1.1, player.cells.upgrades.length)) + br
        }
        if (hasUpgrade("cells", 315) && !hasUpgrade("ch", 25)) {
                                        c += "Kappa V multiplies CX by " + format(player.tokens.total.max(1)) + br
        }
        if (hasMilestone("cells", 56) && !hasMilestone("ch", 13)) {
                                        c += "Cell Milestone 56 multiplies CX by " + format(tmp.cells.milestones[56].effect) + br
        }
        if (!hasMilestone("an", 30)) {
                if (hasMilestone("t", 4))       c += "Tissue Milestone 4 multiplies CX by " + format(tmp.t.milestones[4].effect) + br
                if (hasMilestone("t", 21))      c += "Tissue Milestone 21 multiplies CX by " + format(player.t.milestones.length) + br
        }
        if (!hasMilestone("ch", 14)) {
                if (hasUpgrade("t", 114))       c += "Tissues LIV multiplies CX by " + format(player.t.upgrades.length) + br
                if (hasUpgrade("t", 124))       c += "Tissues LIX multiplies CX by " + format(Math.max(1, player.cells.challenges[11]) ** 2.5) + br
        }
        if (hasUpgrade("cells", 43) && !hasMilestone("ch", 15)) {
                                        c += br + "Cells XVIII multiplies CX by " + format(Decimal.pow(13, player.tokens.tokens2.total)) + br
        }
        if (hasMilestone("or", 23))     c += "Organ Milestone 23 multiplies CX by " + format(player.or.energy.points.max(1).pow(.01 * player.or.milestones.length)) + br
        if (hasUpgrade("an", 25))       c += "Animal X multiplies CX by " + format(player.or.air.points.max(1).pow(.01 * player.an.upgrades.length)) + br
        if (hasUpgrade("nu", 32))       c += "Nucleuses XII multiplies CX by " + format(player.or.points.max(1).pow(player.ch.points)) + br

        let ret = a + br + b + br2 + c
        ret = ret.replaceAll("AX", makeRed("A"))
        ret = ret.replaceAll("BX", makeRed("B"))
        ret = ret.replaceAll("CX", makeRed("C"))
        return ret
}

function dnaFormulaDisplay(){
        let a = "DNA gain is " + format(tmp.d.getBaseGain, 3) + "*AX"
        let b = "AX is multiplied by the following factors"
        let c = ""

        if (layers.l.grid.getGemEffect(206).gt(1)) {
                                        c += "C26 Gems multiply AX by " + format(layers.l.grid.getGemEffect(206)) + br
        }
        if (hasUpgrade("d", 12)) {
                let base = 2
                if (hasUpgrade("d", 13)) base *= 2
                if (hasMilestone("d", 14)) base *= 2
                if (hasUpgrade("d", 14)) base *= 2
                if (hasUpgrade("d", 15)) base *= 2
                                        c += "DNA II, III, IV, and V and DNA Milestone 14 multiply AX by " + format(Decimal.pow(base, player.d.upgrades.length)) + br
        }       
        if (hasChallenge("l", 22))      c += "Anti-minigame multiplies AX by " + format(tmp.l.challenges[22].reward) + br
        if (!hasUpgrade("or", 133))     c += "C61 Gems multiply AX by " + format(layers.l.grid.getGemEffect(601).pow(getBuyableAmount("a", 33)).min("1e50000")) + br
        if (hasUpgrade("d", 23) && player.l.points.gt(10)) {
                                        c += "DNA VIII multiplies AX by " + format(player.l.points.max(10).log10()) + br
        }
        if (hasMilestone("d", 18) && !hasMilestone("an", 30)) {
                let base = 2
                if (hasUpgrade("d", 24) && !player.extremeMode) base *= 2
                if (hasUpgrade("d", 25)) base *= 2
                if (hasUpgrade("d", 31)) base *= 2
                                        c += "DNA IX, X, and XI and DNA Milestone 18 multiplies AX by " + format(Decimal.pow(base, player.d.milestones.length)) + br
                if (player.extremeMode) c = c.replaceAll("DNA IX, X,", "DNA X")
        }
        if (layers.l.grid.getGemEffect(607).gt(1)) {
                                        c += "C67 Gems multiply AX by " + format(layers.l.grid.getGemEffect(607).pow(tmp.l.getNonZeroGemCount)) + br
        }
        if (hasUpgrade("d", 35) && getBuyableAmount("a", 33).gt(0)) {
                                        c += "DNA XV multiplies AX by " + format(Decimal.pow(1.01, getBuyableAmount("a", 33)).min("e2e5")) + br
        }
        if (hasUpgrade("cells", 113) && !hasUpgrade("ch", 25)) {
                                        c += "Mu III multiplies AX by " + format(tmp.cells.upgrades[113].effect) + br
        }
        if (hasChallenge("l", 111))     c += "Anti-Theta multiplies AX by " + format(tmp.l.challenges[21].reward) + br
        if (player.cells.challenges[21] >= 1 && !hasMilestone("sp", 13)) {
                let base = player.points.max(10).log10().max(10).log10()
                let exp = player.cells.upgrades.length
                                        c += "Tertiary multiplies AX by " + format(base.pow(exp)) + br
        }
        if (player.easyMode)            c += "Easy mode multiplies AX by 2" + br
        if (hasUpgrade("sci", 553))     c += "DNA Sci XXVIII multiplies AX by " + format(tmp.cells.buyables[13].effect) + br
        if (tmp.sci.buyables[503].effect.gt(0)) {
                let eff = player.points.max(100).log10().log10().log10().max(1).pow(tmp.sci.buyables[503].effect)
                                        c += "DNA Polymerase multiplies AX by " + format(eff) + br
        }
        if (tmp.an.effect.gt(1))        c += "Animal effect multiplies AX by " + format(tmp.an.effect) + br
        if (tmp.or.effect.gt(1))        c += "Organ effect multiplies AX by " + format(tmp.or.effect) + br
                                        c += br + "Cell effect multiplies AX by " + format(tmp.cells.effect, 3) + br
                                        c += "Tissue effect multiplies AX by " + format(tmp.t.effect, 3) + br
        if (hasUpgrade("t", 112))       c += "Tissues LII multiplies AX by " + format(tmp.t.effect.pow(player.t.upgrades.length), 3) + br
        if (hasUpgrade("sp", 45))       c += "Effect XX multiplies AX by " + format(player.an.grid[208].extras.plus(1).pow(player.nu.points.pow(9))) + br

        return (a + br + b + br2 + c).replaceAll("AX", makeRed("A"))
}

function cellFormulaDisplay(){
        let a = "Cell gain is " + format(tmp.cells.getBaseGain, 3) + "*AX"
        let b = "AX is initially 1 and is multiplied by the following factors"
        let c = ""

        let ret = decimalOne
        
        if (!hasMilestone("an", 29)) {
                if (hasUpgrade("cells", 111)) {
                                        c += "Mu I multiplies AX by " + format(tmp.cells.upgrades[111].effect) + br
                }
                if (hasUpgrade("cells", 211)) {
                                        c += "Lambda I multiplies AX by " + format(tmp.cells.upgrades[211].effect) + br
                }
                if (hasUpgrade("cells", 311)) {
                                        c += "Kappa I multiplies AX by " + format(tmp.cells.upgrades[311].effect) + br
                }
                if (hasUpgrade("cells", 411)) {
                                        c += "Iota I multiplies AX by " + format(tmp.cells.upgrades[411].effect) + br
                }
        }
        if (hasMilestone("cells", 16) && !hasMilestone("ch", 13)) {
                                        c += "Cell Milestone 16 multiplies AX by " + format(tmp.cells.milestones[16].effect) + br
        }
        if (!hasUpgrade("an", 51))      c += "Secondary multiplies AX by " + format(tmp.cells.challenges[12].rewardEffect) + br                         
        if (!hasMilestone("sp", 17))    c += "Stem Cells multiply AX by " + format(player.cells.stem_cells.points.plus(10).log10()) + br
        if (!hasMilestone("ch", 15)) {
                if (hasUpgrade("cells", 15))    c += "Cells V multiplies AX by " + format(tmp.cells.upgrades[15].effect) + br
                if (hasUpgrade("cells", 21) && player.extremeMode)  {
                                                c += "Cells VI multiplies AX by " + format(Decimal.pow(player.cells.upgrades.length, player.cells.upgrades.length + 3)) + br
                }
                if (hasUpgrade("cells", 54) && tmp.cells.upgrades[54].effect.gt(1)) {
                                                c += "Cells XXIV multiplies AX by " + format(tmp.cells.upgrades[54].effect) + br
                }
        }
        if (hasMilestone("t", 17) && !hasMilestone("an", 30)) {
                                        c += "Tissue Milestone 17 multiplies AX by " + format(player.tokens.tokens2.total.max(1).pow(player.t.milestones.length)) + br
        }
        if (hasUpgrade("t", 135) && !hasMilestone("ch", 14)) {
                                        c += "Tissues LXV multiplies AX by " + format(tmp.t.upgrades[135].effect) + br
        }
        if (hasUpgrade("sci", 511))     c += "DNA Sci VI multiplies AX by " + format(Decimal.pow(2, tmp.sci.upgrades[511].lvls)) + br
        if (hasUpgrade("sci", 555))     c += "DNA Sci XXV multiplies AX by " + format(tmp.sci.buyables[501].effect.max(1)) + br
        if (hasUpgrade("sci", 561))     c += "DNA Sci XXVI multiplies AX by " + format(tmp.sci.buyables[502].effect.max(1)) + br
        if (hasChallenge("l", 111))     c += "Anti-Theta multiplies AX by " + format(tmp.l.challenges[22].reward.min(ret.sqrt())) + br
        if (tmp.or.effect.gt(1))        c += "Organ effect multiplies AX by " + format(tmp.or.effect) + br
        if (player.easyMode)            c += "Easy mode multiplies AX by 2" + br
        if (hasUpgrade("sci", 514))     c += "DNA Sci IX multiplies AX by " + format(player.cells.stem_cells.points.plus(10).log10()) + br
        if (hasUpgrade("sci", 551))     c += "DNA Sci XXI multiplies AX by " + format(player.sci.dna_science.points.max(10).log10().pow(tmp.sci.upgrades[551].lvls)) + br
        if (tmp.an.effect.gt(1))        c += "Animal effect multiplies AX by " + format(tmp.an.effect) + br
        if (tmp.or.challenges[21].reward.gt(1) && !hasMilestone("sp", 25)) {
                                        c += "Primary Bronchi multiplies AX by " + format(tmp.or.challenges[21].reward) + br
        }
        if (hasUpgrade("or", 102) && !hasMilestone("sp", 18)) {
                                        c += "Heart II multiplies AX by " + format(tmp.or.upgrades[102].cell_effect) + br
        }
                                        
        if (hasMilestone("cells", 40))  c += br + "Cell Milestone 40 multiplies AX by " + format(player.cells.stem_cells.best.max(1).root(hasUpgrade("tokens", 222) ? 50 : 100), 3) + br
                                        c += "Tissue effect multiplies AX by " + format(tmp.t.effect, 3) + br
        if (hasUpgrade("an", 41))       c += "Animals XVI multiplies AX by " + format(player.an.grid[406].extras.plus(1).pow(player.an.grid[507].buyables.pow(3))) + br

        return (a + br + b + br2 + c).replaceAll("AX", makeRed("A"))
}

function stemCellFormulaDisplay(){
        let a = "Stem Cell gain is (AX<sup>BX</sup>CX)<sup>DX</sup>."
        let b = "AX, BX, CX, and DX are initially 1 and boosted as follows."
        let c = ""

        if (player.hardMode)            c += "Hard mode divides AX by 4" + br
        if (player.easyMode)            c += "Easy mode multiplies AX by 4" + br
        if (!hasUpgrade("an", 45)) {
                if (hasUpgrade("cells", 114))   c += "Mu IV multiplies AX by " + format(getBuyableAmount("cells", 112)) + br
                if (hasUpgrade("cells", 214))   c += "Lambda IV multiplies AX by " + format(tmp.cells.upgrades[214].effect) + br
                if (hasUpgrade("cells", 314))   c += "Kappa IV multiplies AX by " + format(tmp.cells.upgrades[314].effect) + br
                if (hasUpgrade("cells", 414))   c += "Iota IV multiplies AX by " + format(getBuyableAmount("cells", 411).max(10).log10().pow(1 + player.extremeMode)) + br
        }
        if (!hasUpgrade("an", 51))      c += "Primary reward multiplies AX by " + format(tmp.cells.challenges[11].rewardEffect) + br
        if (!hasMilestone("ch", 13)) {
                if (hasMilestone("cells", 12)) {
                        let exp = player.extremeMode ? 2.5 : 1
                                                c += "Cell Milestone 12 multiplies AX by " + format(player.cells.milestones.length ** exp) + br
                }
                if (hasMilestone("cells", 16))  c += "Cell Milestone 16 multiplies AX by " + format(tmp.cells.milestones[16].effect) + br
                if (hasMilestone("cells", 17))  {
                        let exp = player.cells.activeChallenge ? 2 : 1
                        if (!player.extremeMode) exp = .5
                                                c += "Cell Milestone 17 multiplies AX by " + format(Math.max(1, player.cells.upgrades.length) ** exp) + br
                }
                if (hasMilestone("cells", 22))  c += "Cell Milestone 22 multiplies AX by " + format(getBuyableAmount("cells", 11).plus(1)) + br
                if (hasMilestone("cells", 23))  c += "Cell Milestone 23 multiplies AX by " + format(player.cells.mu.best.max(10).log10()) + br
                if (hasMilestone("cells", 24))  c += "Cell Milestone 24 multiplies AX by " + format(tmp.tokens.buyables[21].effect) + br
                if (hasMilestone("cells", 26))  c += "Cell Milestone 26 multiplies AX by " + format(player.tokens.total.max(1)) + br
                if (hasMilestone("cells", 32))  c += "Cell Milestone 32 multiplies AX by " + format(player.cells.lambda.points.max(10).log10()) + br
                if (hasMilestone("cells", 38))  c += "Cell Milestone 38 multiplies AX by " + format(player.d.points.max(10).log10()) + br
                if (hasMilestone("cells", 39))  c += "Cell Milestone 39 multiplies AX by " + format(player.mu.points.max(10).log10()) + br
                if (hasMilestone("cells", 41))  c += "Cell Milestone 41 multiplies AX by " + format(player.tokens.buyables[11].max(1)) + br
                if (hasMilestone("cells", 53))  c += "Cell Milestone 53 multiplies AX by " + format(tmp.cells.milestones[53].effect) + br
                if (hasMilestone("cells", 59) && !player.extremeMode) {
                                                c += "Cell Milestone 59 multiplies AX by " + format(layerChallengeCompletions("cells") ** 2) + br
                }
        }
        if (hasChallenge("l", 111) && player.cells.challenges[12] >= 15 && !player.extremeMode) {
                                        c += "Anti-Theta multiplies AX by " + format(tmp.l.challenges[31].reward.max(1)) + br
        }
        if (!hasMilestone("ch", 15)) {
                if (hasUpgrade("cells", 15))    c += "Cells V multiplies AX by " + format(tmp.cells.upgrades[15].effect) + br
                if (hasUpgrade("cells", 21))  {
                        let exp = player.extremeMode ? player.cells.upgrades.length + 3 : 2
                                                c += "Cells VI multiplies AX by " + format(Decimal.pow(player.cells.upgrades.length, exp)) + br
                }
                if (hasUpgrade("cells", 23) && !player.extremeMode) {
                                                c += "Cells VIII multiplies AX by " + format(player.cells.upgrades.length) + br
                }
                if (hasUpgrade("cells", 24)) {
                        if (player.extremeMode) c += "Cells IX multiplies AX by " + format(player.cells.points.max(1).pow(.01)) + br
                        else                    c += "Cells IX multiplies AX by " + format(player.cells.upgrades.length) + br
                }
                if (hasUpgrade("cells", 52))    c += "Cells XXII multiplies AX by " + format(player.cells.points.max(10).log10().pow(player.tokens.tokens2.total)) + br
                if (hasUpgrade("cells", 54) && tmp.cells.upgrades[54].effect.gt(1)) {
                                                c += "Cells XXIV multiplies AX by " + format(tmp.cells.upgrades[54].effect) + br
                }
        }
        if (!hasMilestone("an", 30)) {
                if (hasMilestone("t", 10)) {
                        let base = getBuyableAmount("cells", 13).max(1)
                        let exp  = player.t.upgrades.length ** .5
                                                c += "Tissue Milestone 10 multiplies AX by " + format(base.pow(exp)) + br
                }
                if (hasMilestone("t", 11)) {
                        let base = getBuyableAmount("cells", 13).max(1)
                        let exp  = player.t.milestones.length
                                                c += "Tissue Milestone 11 multiplies AX by " + format(base.pow(exp)) + br
                }
                if (hasMilestone("t", 17))      c += "Tissue Milestone 17 multiplies AX by " + format(player.tokens.tokens2.total.max(1).pow(player.t.milestones.length)) + br
                if (hasMilestone("t", 18))      c += "Tissue Milestone 18 multiplies AX by " + format(player.tokens.total.pow10().root(player.extremeMode ? 29.918840221005354 : 47.19363281906435)) + br
        }
        if (!hasMilestone("ch", 14)) {
                if (hasUpgrade("t", 31))        c += "Tissues XI multiplies AX by 3" + br
                if (hasUpgrade("t", 32) && player.cells.activeChallenge != undefined) {
                                                c += "Tissues XII multiplies AX by 10" + br
                }        
                if (hasUpgrade("t", 34))        c += "Tissues XIV multiplies AX by " + format(tmp.t.upgrades[34].effect) + br
                if (hasUpgrade("t", 92))        c += "Tissues XLII multiplies AX by " + format(player.tokens.total.max(1).pow(Math.PI)) + br
                if (hasUpgrade("t", 111))       c += "Tissues LI multiplies AX by 5" + br
                if (hasUpgrade("t", 113))       c += "Tissues LIII multiplies AX by " + format(player.tokens.tokens2.total.div(69).plus(1).pow(player.tokens.total)) + br
                if (hasUpgrade("t", 135))       c += "Tissues LXV multiplies AX by " + format(tmp.t.upgrades[135].effect) + br
                if (hasUpgrade("t", 144))       c += "Tissues LXIX multiplies AX by " + format(Decimal.pow(2, player.t.upgrades.length)) + br
        }
        if (!hasUpgrade("an", 34))      c += "Down Quark multiplies AX by " + format(tmp.tokens.buyables[102].effect) + br
        if (tmp.or.effect.gt(1))        c += "Organ effect multiplies AX by " + format(tmp.or.effect) + br
        if (player.extremeMode)         c += "Telomerase multiplies AX by " + format(tmp.sci.buyables[522].stem_cell_effect) + br
        if ((!inChallenge("cells", 12) || player.cells.challenges[12] < 10) && tmp.sci.buyables[523].stem_cell_effect.gt(1)) {
                                        c += "Single-strand DNA-binding protein multiplies AX by " + format(tmp.sci.buyables[523].stem_cell_effect) + br
        }
        if (hasUpgrade("sci", 524))     c += "DNA Sci XIV multiplies AX by " + format(tmp.sci.buyables[501].effect.max(1)) + br
        if (hasUpgrade("sci", 525))     c += "DNA Sci XV multiplies AX by " + format(tmp.sci.buyables[502].effect.max(1)) + br
        if (hasMilestone("cells", 32) && player.extremeMode && !hasMilestone("ch", 13)) {
                                        c += "Cell Milestone 32 multiplies AX by " + format(tmp.sci.buyables[503].effect.max(1)) + br
        }
        if (hasUpgrade("sci", 531))     c += "DNA Sci XVI multiplies AX by " + format(tmp.sci.buyables[511].effect.max(1)) + br
        if (hasUpgrade("sci", 532))     c += "DNA Sci XVII multiplies AX by " + format(tmp.sci.buyables[512].effect.max(1).times(tmp.sci.upgrades[532].effect)) + br
        if (hasMilestone("cells", 34) && player.extremeMode) {
                                        c += "Cell Milestone 34 multiplies AX by " + format(tmp.sci.buyables[513].effect.max(1)) + br
        }
        if (hasUpgrade("sci", 533))     c += "DNA Sci XVIII multiplies AX by " + format(tmp.sci.buyables[521].effect.max(1)) + br
        if (hasUpgrade("sci", 534))     c += "DNA Sci XIX multiplies AX by " + format(tmp.sci.buyables[522].effect.max(1)) + br
        if (hasUpgrade("sci", 535))     c += "DNA Sci XX multiplies AX by " + format(tmp.sci.buyables[523].effect.max(1).times(Decimal.pow(1.01, tmp.sci.buyables.dnaBuyablesTotal))) + br
        if (hasUpgrade("sci", 542))     c += "DNA Sci XXII multiplies AX by " + format(tmp.sci.upgrades[542].effect) + br
        if (hasUpgrade("sci", 543))     c += "DNA Sci XXIII multiplies AX by " + format(tmp.sci.upgrades.dnaUpgradesLength) + br
        if (hasUpgrade("or", 102) && !hasMilestone("sp", 18)) {
                                        c += "Heart II multiplies AX by " + format(tmp.or.upgrades[102].stem_cell_effect) + br
        }
        if (hasUpgrade("sci", 552))     c += "DNA Sci XXVII multiplies AX by " + format(Decimal.pow(2, tmp.sci.upgrades[552].lvls)) + br
        if (hasUpgrade("t", 72) && player.extremeMode) {
                                        c += "Tissues XXXII multiplies AX by " + format(player.cells.points.max(10).log10()) + br
        }
        if (hasUpgrade("sci", 553))     c += "DNA Sci XXVIII multiplies AX by " + format(player.tokens.total.max(1)) + br
        if (hasUpgrade("sci", 561))     c += "DNA Sci XXXI multiplies AX by " + format(Decimal.pow(2, tmp.sci.upgrades.dnaUpgradesLength)) + br
        if (hasUpgrade("sci", 562))     c += "DNA Sci XXXII multiplies AX by " + format(tmp.sci.buyables[521].effect.max(1).pow(tmp.sci.upgrades[551].lvls)) + br
        if (hasUpgrade("sci", 563))     c += "DNA Sci XXXIII multiplies AX by " + format(tmp.sci.buyables[512].effect.max(1).pow(tmp.sci.upgrades[551].lvls)) + br
        if (hasUpgrade("sci", 564))     c += "DNA Sci XXXIV multiplies AX by " + format(tmp.sci.buyables[522].effect.max(1).pow(tmp.sci.upgrades[551].lvls)) + br
        if (hasUpgrade("t", 91) && player.extremeMode) {
                                        c += "Tissues XLI multiplies AX by " + format(tmp.t.upgrades[91].effect) + br
        }
        if (tmp.or.challenges[12].reward.gt(1) && !hasMilestone("sp", 25)) {
                                        c += "Trachea multiplies AX by " + format(tmp.or.challenges[12].reward) + br
        }
        if (tmp.an.effect.gt(1))        c += "Animal Effect multiplies AX by " + format(tmp.an.effect) + br
        if (tmp.t.effect.gt(1))         c += br + "Tissue effect multiplies AX by " + format(tmp.t.effect) + br
        if (hasUpgrade("or", 332))      c += "Lung XVII multiplies AX by " + format(player.or.contaminants.points.max(1).pow(.01 * player.or.upgrades.length)) + br
                                        c += "Omnipotent multiplies AX by " + format(tmp.cells.buyables[11].effect) + br
                                        c += "Totipotent multiplies AX by " + format(tmp.cells.buyables[12].effect) + br
                                        c += "Pluripotent multiplies AX by " + format(tmp.cells.buyables[13].effect) + br
                                        c += "Multipotent multiplies AX by " + format(tmp.cells.buyables[21].effect) + br
                                        c += "Oligopotent multiplies AX by " + format(tmp.cells.buyables[22].effect) + br
        if (hasMilestone("cells", 40))  c += "Cell Milestone 40 multiplies AX by " + format(player.cells.best.max(1).root(player.extremeMode ? 100 : hasUpgrade("tokens", 222) ? 25 : 50)) + br
        if (c.includes("AX"))           c += br

        if (inChallenge("cells", 12))   c += "Secondary Challenge multiplies BX by " + format(tmp.cells.challenges[12].challengeEffect) + br
        if (c.includes("BX"))           c += br

        // AFTER SECONDARY BUFFS
        if (!hasMilestone("ch", 14)) {
                if (hasUpgrade("t", 63))        c += "Tissues XXVIII multiplies CX by " + format(tmp.t.effect) + br
                if (hasUpgrade("t", 124))       c += "Tissues LIX multiplies CX by " + format(Math.max(1, player.cells.challenges[11]) ** 2.5) + br
        }
        if (hasMilestone("t", 20) && !hasMilestone("an", 30)) {
                                        c += "Tissue Milestone 20 multiplies CX by " + format(Decimal.pow(1.5, player.tokens.tokens2.total)) + br
        }
        if (c.includes("CX"))           c += br

        if (hasUpgrade("t", 35))        c += "Tissues XV multiplies DX by 1.001" + br
        if (hasUpgrade("sci", 513))     c += "DNA Sci VIII multiplies DX by " + format(tmp.sci.upgrades[513].effect, 4) + br
        if (hasUpgrade("sci", 525))     c += "DNA Sci XV multiplies DX by 1.01" + br
        if (player.extremeMode)         c += "Extreme mode multiplies DX by .75" + br
        if (hasUpgrade("or", 205) && player.or.filterLeftKidney) {
                                        c += "Kidney V multiplies DX by 1.001" + br
        }
        if (hasUpgrade("or", 214) && !player.or.filterLeftKidney) {
                                        c += "Kidney IX multiplies DX by 1.001" + br
        }
        if (hasUpgrade("sp", 54))       c += "Effect XXIV multiplies DX by 1.0" + (hasUpgrade("sp", 104) ? "" : "0") +"1" + br
        if (c.includes("DX"))           c += br

        let ret = a + br + b + br2 + c
        ret = ret.replaceAll("AX", makeRed("A"))
        ret = ret.replaceAll("BX", makeRed("B"))
        ret = ret.replaceAll("CX", makeRed("C"))
        ret = ret.replaceAll("DX", makeRed("D"))
        return ret
}

function tissueFormulaDisplay(){
        let a = "Tissue gain is " + format(tmp.t.getBaseGain, 3) + "*AX"
        let b = "AX is initially 1 and is multiplied by the following factors"
        let c = ""

        if (player.easyMode)            c += "Easy Mode multiplies AX by " + format(2) + br
        if (!hasMilestone("ch", 14)) {
                if (hasUpgrade("t", 83)) {
                        let base = new Decimal(player.cells.challenges[12]).max(10).log10()
                        let exp = Math.max(0, player.cells.challenges[11] - 10)
                                                c += "Tissues XXXVIII multiplies AX by " + format(base.pow(exp)) + br
                }
                if (hasUpgrade("t", 131))       c += "Tissues LXI multiplies AX by " + format(Decimal.pow(2, tmp.t.upgrades.endUpgradeAmount)) + br
                if (hasUpgrade("t", 155))       c += "Tissues LXXV multiplies AX by " + format(Decimal.pow(1.11, player.tokens.tokens2.total)) + br
        }
        if (hasUpgrade("cells", 44) && !hasMilestone("ch", 15)) {
                                        c += "Cells XIX multiplies AX by " + format(player.tokens.tokens2.total.max(1)) + br
        }
        if (!hasUpgrade("or", 43))      c += "Bottom Quark multiplies AX by " + format(tmp.tokens.buyables[122].effect) + br
        if (player.cells.challenges[21] >= 2 && !hasMilestone("sp", 13)) {
                                        c += "Tertiary multiplies AX by " + format(player.t.best.plus(10).log10().plus(9).log10().pow(player.cells.challenges[21])) + br
        }
        if (tmp.an.effect.gt(1))        c += "Animal effect multiplies AX by " + format(tmp.an.effect) + br
        if (hasMilestone("or", 10) && !hasUpgrade("nu", 35)) {
                                        c += "Organ Milestone 10 multiplies AX by " + format(Decimal.pow(2, player.or.milestones.length)) + br
        }
        if (hasUpgrade("sci", 552))     c += "DNA Sci XXVII multiplies AX by " + format(Decimal.pow(2, tmp.sci.upgrades[552].lvls)) + br
        if (!hasMilestone("sp", 18)) {
                if (hasUpgrade("or", 143))      c += "Heart XXIII multiplies AX by " + format(player.or.buyables[202].max(1).pow(player.or.upgrades.length)) + br
                if (hasUpgrade("or", 155))      c += "Heart XXX multiplies AX by " + format(player.or.energy.points.max(1)) + br
        }
        if (hasUpgrade("sci", 563))     c += "DNA Sci XXXIII multiplies AX by " + format(2) + br
        if (tmp.or.challenges[32].reward.gt(1) && !hasMilestone("sp", 25)) {
                                        c += "Bronchioles multiplies AX by " + format(tmp.or.challenges[32].reward) + br
        }
        if (hasUpgrade("an", 14))       c += "Animals IV multiplies AX by " + format(player.an.grid[608].extras.plus(1).pow(player.an.milestones.length ** 2)) + br
        if (hasUpgrade("an", 34))       c += "Animals XIV multiplies AX by " + format(tmp.tokens.buyables[102].effect) + br
        if (hasMilestone("nu", 2) && !hasMilestone("sp", 25)) {
                                        c += "Nucleus Milestone 2 multiplies AX by " + format(player.t.points.plus(10).log10().pow(player.nu.points)) + br
        }
        if (tmp.or.effect.gt(1))        c += br + "Organ effect multiplies AX by " + format(tmp.or.effect) + br
        if (hasMilestone("an", 39))     c += "Animal Milestone 39 multiplies AX by " + format(player.an.grid[307].extras.plus(1).pow(player.ch.points.min(5000).pow(3))) + br
        
        return (a + br + b + br2 + c).replaceAll("AX", makeRed("A"))
}

function organFormulaDisplay(){
        let a = "Organ gain is " + format(tmp.or.getBaseGain, 3) + "*AX"
        let b = "AX is initially 1 and is multiplied by the following factors"
        let c = ""

        if (player.easyMode)            c += "Easy Mode multiplies AX by 2" + br
        if (!hasMilestone("sp", 18)) {
                if (hasUpgrade("or", 124))      c += "Heart XIV multiplies AX by " + format(tmp.or.upgrades[124].effect) + br
                if (hasUpgrade("or", 131))      c += "Heart XVI multiplies AX by " + format(player.or.milestones.length) + br
                if (hasUpgrade("or", 135))      c += "Heart XX multiplies AX by " + format(player.or.upgrades.length) + br
        }
        if (hasUpgrade("or", 141) && !hasUpgrade("or", 41)) {
                let lvls = Math.max(0, player.or.upgrades.length - 30)
                                        c += "Heart XXI multiplies AX by " + format(player.or.buyables[201].plus(10).log10().pow(lvls)) + br
        }
        if (!hasMilestone("sp", 27)) {
                if (hasUpgrade("or", 14))       c += "Organs IV multiplies AX by " + format(player.tokens.tokens2.total.max(1)) + br
                if (hasUpgrade("or", 31))       c += "Organs XI multiplies AX by " + format(Decimal.pow(1.03, player.tokens.tokens2.total)) + br
        }
        if (hasUpgrade("or", 313) && !hasUpgrade("tokens", 144)) {
                                        c += "Lung VIII multiplies AX by " + format(player.or.air.points.max(10).log10()) + br
        }
        if (hasMilestone("or", 20) && !hasUpgrade("nu", 35)) {
                                        c += "Organ Milestone 20 multiplies AX by " + format(player.or.energy.points.max(10).log10()) + br
        }
        if (tmp.or.buyables[423].effect.gt(1) && !hasUpgrade("sp", 112)) {
                                        c += br + "intes<u>TINE</u> multiplies AX by " + format(tmp.or.buyables[423].effect) + br
        }
        if (tmp.an.effect.gt(1))        c += "Animal effect multiplies AX by " + format(tmp.an.effect) + br
        if (hasUpgrade("an", 23))       c += "Animals VIII multiplies AX by " + format(player.an.grid[506].extras.plus(1)) + br
        if (hasMilestone("ch", 7) && !hasUpgrade("sp", 121)) {
                                        c += "Chromosome Milestone 7 multiplies AX by " + format(player.ch.points.pow(player.ch.points)) + br
        }
        if (player.an.achActive[13] && hasAchievement("an", 13) || hasAchievement("an", 23)) {
                                        c += "COM I being ON multiplies AX by " + format(player.an.grid[308].extras.plus(1).pow(player.ch.points.min(5000).div(hasMilestone("sp", 21) ? 1 : 17))) + br
        }
        if (hasUpgrade("ch", 41))       c += "Chromosomes XVI multiplies AX by " + format(player.an.grid[303].extras.plus(1).pow(player.nu.points)) + br
        if (hasUpgrade("nu", 24))       c += "Nucleuses IX multiplies AX by " + format(player.an.grid[203].extras.plus(1).pow(player.ch.points.min(5000))) + br
        if (hasUpgrade("sp", 12))       c += "Effect II multiplies AX by " + format(tmp.sp.effect.pow(hasUpgrade("sp", 112) ? player.ch.points.pow(2) : Math.min(hasMilestone("nu", 21) ? 222 : 64, player.sp.times) ** 2)) + br
        if (hasUpgrade("sp", 62))       c += "Upgraded Effect II multiplies AX by " + format(tmp.sp.effect.pow(player.nu.points.pow(3))) + br
        if (hasUpgrade("sp", 141))      c += "Boosted Effect XVI multiplies AX by " + format(player.an.grid[102].extras.plus(1).pow(player.tokens.tokens2.total)) + br

        return (a + br + b + br2 + c).replaceAll("AX", makeRed("A"))
}

function airFormulaDisplay(){
        let a = "Air gain is AX<sup>BX</sup>"
        let b = "AX and BX are initially 1 and are multiplied by the following factors"
        let c = ""

        if (player.hardMode)            c += "Hard Mode divides AX by 4" + br
        if (player.easyMode)            c += "Easy Mode multiplies AX by 4" + br
        if (!hasMilestone("ch", 11)) {
                                        c += "Larynx multiplies AX by " + format(tmp.or.challenges[11].reward) + br
                                        c += "Trachea multiplies AX by " + format(tmp.or.challenges[12].reward) + br
                                        c += "Primary Bronchi multiplies AX by " + format(tmp.or.challenges[21].reward) + br
                                        c += "Secondary Bronchi multiplies AX by " + format(tmp.or.challenges[22].reward) + br
                                        c += "Tertiary Bronchi multiplies AX by " + format(tmp.or.challenges[31].reward) + br
                                        c += "Bronchoiles multiplies AX by " + format(tmp.or.challenges[32].reward) + br
        }
        if (!hasMilestone("sp", 19)) {
                if (hasUpgrade("or", 221))      c += "Kidney XI multiplies AX by " + format(player.t.points.max(10).log10()) + br
                if (hasUpgrade("or", 224))      c += "Kidney XIV multiplies AX by " + format(tmp.or.upgrades[224].effect) + br
                if (hasUpgrade("or", 225))      c += "Kidney XV multiplies AX by " + format(tmp.or.buyables[412].effect) + br
                if (hasUpgrade("or", 233))      c += "Kidney XVIII multiplies AX by " + format(tmp.or.upgrades[323].effect) + br
        }
        if (hasUpgrade("or", 301))      c += "Air I multiplies AX by " + format(tmp.or.upgrades[301].effect) + br
        if (hasUpgrade("or", 312))      c += "Air VII multiplies AX by " + format(Decimal.pow(3, player.tokens.best_buyables[101].sub(30)).max(1)) + br
        if (!hasUpgrade("nu", 35)) {
                if (hasMilestone("or", 17))     c += "Organ Milestone 17 multiplies AX by " + format(player.or.milestones.length) + br
                if (hasMilestone("or", 20))     c += "Organ Milestone 20 multiplies AX by " + format(player.or.energy.points.max(10).log10()) + br
        }
        if (hasUpgrade("or", 23))       c += "Organs VIII multiplies AX by " + format(tmp.or.upgrades[23].effect) + br
        if (hasUpgrade("or", 43))       c += "Organs XVIII multiplies AX by " + format(tmp.tokens.buyables[122].effect) + br
        if (tmp.an.effect.gt(1))        c += "Animal effect multiplies AX by " + format(tmp.an.effect) + br
        if (hasMilestone("an", 16))     c += "Animal Milestone 16 multiplies AX by " + format(player.an.grid[808].extras.plus(1)) + br
        if (hasUpgrade("an", 22))       c += "Animals VII multiplies AX by " + format(player.an.grid[505].extras.plus(1).pow(player.an.grid[508].buyables)) + br
        if (hasUpgrade("sp", 14))       c += "Effect IV multiplies AX by " + format(tmp.sp.effect.pow(player.tokens.total.pow(.7))) + br
        if (c.includes("AX"))           c += br

        if (hasMilestone("ch", 11))     c += "Chromosome Milestone 11 multiplies BX by " + format(60) + br
        if (hasMilestone("nu", 17))     c += "Nucleus Milestone 17 multiplies BX by " + format(Decimal.pow(1.01, player.nu.points)) + br
        if (hasUpgrade("sp", 64))       c += "Upgraded Effect IV multiplies BX by " + format(Decimal.pow(1.01, player.sp.upgrades.length)) + br
        if (c.includes("BX"))           c += br

        let ret = a + br + b + br2 + c
        ret = ret.replaceAll("AX", makeRed("A"))
        ret = ret.replaceAll("BX", makeRed("B"))
        return ret
}

function energyFormulaDisplay(){
        let a = "Energy gain is AX<sup>BX</sup>"
        let b = "AX and BX are initially 1 and are multiplied by the following factors"
        let c = ""
        let data = player.or.extras

        if (player.easyMode)            c += "Easy Mode multiplies AX by 4" + br
        if (data[401].gt(0))            c += "<u>IN</u>testine multiplies AX by " + format(data[401].plus(1)) + br
        if (data[402].gt(0))            c += "<u>in</u>TEStine multiplies AX by " + format(data[402].plus(1)) + br
        if (data[403].gt(0))            c += "<u>in</u>tesTINE multiplies AX by " + format(data[403].plus(1)) + br
        if (data[411].gt(0))            c += "IN<u>tes</u>tine multiplies AX by " + format(data[411].plus(1)) + br
        if (data[412].gt(0))            c += "in<u>TES</u>tine multiplies AX by " + format(data[412].plus(1)) + br
        if (data[413].gt(0))            c += "in<u>tes</u>TINE multiplies AX by " + format(data[413].plus(1)) + br
        if (data[421].gt(0))            c += "INtes<u>tine</u> multiplies AX by " + format(data[421].plus(1)) + br
        if (data[422].gt(0))            c += "inTES<u>tine</u> multiplies AX by " + format(data[422].plus(1)) + br
        if (data[423].gt(0))            c += "intes<u>TINE</u> multiplies AX by " + format(data[423].plus(1)) + br
        if (hasMilestone("or", 20) && !hasUpgrade("nu", 35)) {
                                        c += "Organ Milestone 20 multiplies AX by " + format(player.or.milestones.length) + br
        }
        if (!hasMilestone("sp", 27)) {
                if (hasUpgrade("or", 21))       c += "Organs VI multiplies AX by " + format(player.d.points.max(10).log10()) + br
                if (hasUpgrade("or", 23))       c += "Organs VIII multiplies AX by " + format(tmp.or.upgrades[23].effect) + br
        }
        if (hasUpgrade("or", 43))       c += "Organs XVIII multiplies AX by " + format(tmp.tokens.buyables[122].effect) + br
        if (hasUpgrade("or", 323) && !hasUpgrade("tokens", 144)) {
                                        c += "Lung XIII multiplies AX by " + format(tmp.or.upgrades[323].effect) + br
        }
        if (tmp.an.effect.gt(1))        c += "Animal effect multiplies AX by " + format(tmp.an.effect) + br
        if (hasUpgrade("an", 15))       c += "Animals V multiplies AX by " + format(player.an.grid[607].extras.plus(1)) + br
        if (hasMilestone("an", 23)) {
                let base = player.an.grid[404].extras.plus(1)
                let exp = hasMilestone("ch", 36) ? player.ch.points.times(player.ch.points.min(5000)).sqrt() : player.ch.points.min(5000)
                                        c += "Animal Milestone 23 multiplies AX by " + format(base.pow(exp)) + br
        }
        if (c.includes("AX"))           c += br

        // BELOW IS EXPONENTIAL THINGS
        if (hasMilestone("or", 21)) {
                let a = hasUpgrade("or", 151) + hasUpgrade("or", 152) + hasUpgrade("or", 153)
                a += hasUpgrade("or", 154) + hasUpgrade("or", 155) 
                                        c += "Organ Milestone 21 multiplies BX by " + format(Decimal.pow(1.01, a), 4) + br
        }
        if (hasUpgrade("nu", 21))       c += "Nucleuses VI multiplies BX by " + format(player.ch.points.max(1234).div(1234).cbrt().min(1.01), 4) + br
        if (hasMilestone("an", 42))     c += "Animal Milestone 42 multiplies BX by " + format(player.ch.points.max(1465).div(1465).sqrt().min(1.1), 4) + br
        if (hasUpgrade("sp", 53))       c += "Effect XXIII multplies BX by 1.001" + br
        if (hasUpgrade("sp", 103))      c += "Upgraded Effect XXIII multiplies BX by 1.003" + br
        if (c.includes("BX"))           c += br

        let ret = a + br + b + br2 + c
        ret = ret.replaceAll("AX", makeRed("A"))
        ret = ret.replaceAll("BX", makeRed("B"))
        return ret
}

function animalFormulaDisplay(){
        let a = "Animal gain is " + format(tmp.an.getBaseGain, 3) + "*AX"
        let b = "AX is initially 1 and is multiplied by the following factors"
        let c = ""

        if (player.easyMode)            c += "Easy Mode multiplies AX by 2" + br
        if (hasMilestone("an", 13))     c += "Animal Milestone 13 multiplies AX by " + format(player.an.milestones.length) + br
        if (hasMilestone("an", 18))     c += "Animal Milestone 18 multiplies AX by " + format(player.an.genes.points.max(10).log10()) + br
        else if (hasUpgrade("or", 351)) {
                let a = 1
                if (hasUpgrade("or", 352)) a ++
                if (hasUpgrade("or", 353)) a ++
                if (hasUpgrade("or", 354)) a ++
                if (hasUpgrade("or", 355)) a ++
                                        c += "Lung XXVI multiplies AX by " + format(Decimal.pow(2, a)) + br
        }
        if (hasUpgrade("an", 35))       c += "Animals XV multiplies AX by " + format(Decimal.pow(1.01, player.ch.points)) + br
        if (hasAchievement("an", 23) && player.an.achActive[23]) {
                                        c += "COM II multiplies AX by 10" + br
        }
        if (hasMilestone("nu", 1))      c += "Nucleuses Milestone 1 multiplies AX by 2" + br

        if (hasUpgrade("an", 53))       c += br + "Animals XXIII multiplies AX by " + format(Decimal.pow(1.01, player.tokens.tokens2.total.sub(hasMilestone("nu", 9) ? 0 : 7200).max(0))) + br
        if (hasUpgrade("nu", 33))       c += "Nucleuses XIII multiplies AX by " + format(tmp.sp.challenges[11].reward.pow(player.nu.upgrades.length ** .5)) + br
        if (hasMilestone("an", 22))     c += "Animal Milestone 22 multiplies AX by " + format(player.an.grid[508].extras.plus(1).pow(.01)) + br
        if ((player.an.achActive[33] || hasMilestone("nu", 14)) && hasAchievement("an", 33)) {
                                        c += "COM III multiplies AX by " + format(Decimal.pow(5, player.nu.points.times(tmp.an.clickables.rowThreeOff))) + br
        }
        if (hasUpgrade("sp", 11))       c += "Effect I multiplies AX by " + format(tmp.sp.effect.pow(hasUpgrade("sp", 111) ? player.nu.points : 1)) + br
        if (hasMilestone("sp", 7))      c += "Species Milestone 7 multiplies AX by " + format(tmp.sp.effect.pow(player.sp.milestones.length)) + br
        if (hasMilestone("sp", 10)) {
                let sub = hasUpgrade("nu", 45) ? 0 : 85800
                let base = decimalOne.plus(player.sp.milestones.length/500)
                                        c += "Species Milestone 10 multiplies AX by " + format(base.pow(player.tokens.tokens2.total.sub(sub).max(0))) + br
        }
        if (hasUpgrade("sp", 152))      c += "Boosted Upgrade XXII multiplies AX by " + format(player.an.grid[108].extras.plus(1).pow(player.tokens.mastery_tokens.total.div(100))) + br

        return (a + br + b + br2 + c).replaceAll("AX", makeRed("A"))
}

function geneFormulaDisplay(){
        let a = "Gene gain is " + format(player.an.grid[808].extras.plus(1), 3) + "*AX"
        let b = "AX is initially 1 and is multiplied by the following factors"
        let c = ""

        if (player.easyMode)            c += "Easy Mode multiplies AX by 4" + br
        if (hasMilestone("an", 16) && !hasUpgrade("tokens", 114)) {
                let sub = hasMilestone("an", 22) ? 0 : 1000
                                        c += "Animal Milestone 16 multiplies AX by " + format(Decimal.pow(1.01, player.tokens.tokens2.total.sub(sub).max(0))) + br
                if (player.sp.unlocked) c += "Animal Milestone 16 due to Species multiplies AX by " + format(Decimal.pow(10, player.sp.times).min(1e22)) + br
        }
        if (!hasUpgrade("ch", 44)) {
                if (hasMilestone("an", 17)) {
                        let base = player.or.deoxygenated_blood.points.max(10).log10().max(10).log10()
                        let exp = player.nu.points.plus(player.an.upgrades.length)
                                                c += "Animal Milestone 17 multiplies AX by " + format(base.pow(exp)) + br
                }
                if (hasMilestone("an", 18))     c += "Animal Milestone 18 multiplies AX by " + format(player.an.points.max(10).log10()) + br
                if (hasMilestone("an", 19))     c += "Animal Milestone 19 multiplies AX by " + format(player.or.contaminants.points.max(10).log10()) + br
                if (hasMilestone("an", 20))     c += "Animal Milestone 20 multiplies AX by " + format(player.cells.points.max(10).log10()) + br
        }
        if (hasMilestone("an", 21) && !hasUpgrade("nu", 23)) {
                                        c += "Animal Milestone 21 multiplies AX by " + format(tmp.an.milestones[21].effect) + br
        }
        if (hasMilestone("an", 28))     c += "Animal Milestone 28 multiplies AX by " + format(player.an.grid[306].extras.plus(1)) + br
        if (hasMilestone("an", 34) && !hasMilestone("an", 36)) {
                                        c += "Animal Milestone 34 multiplies AX by 10" + br
        }
        if (hasMilestone("an", 39))     c += "Animal Milestone 39 multiplies AX by 1000" + br
        if (hasMilestone("ch", 5) && !hasUpgrade("an", 31)) {
                                        c += "Chromosome Milestone 5 divides AX by " + format(Decimal.pow(2, player.ch.points.sub(8))) + br
        }
        if (hasMilestone("ch", 6) && !hasMilestone("an", 24)) {
                                        c += "Chromosome Milestone 6 divides AX by " + format(Decimal.pow(2, player.ch.points)) + br
        }
        if (!hasUpgrade("nu", 23)) {
                if (hasMilestone("ch", 8))      c += "Chromosome Milestone 8 multiplies AX by " + format(player.ch.points.pow(player.ch.milestones.length/3).max(1)) + br
                if (hasMilestone("ch", 16))     c += "Chromosome Milestone 16 multiplies AX by " + format(player.ch.points.plus(1)) + br
                if (hasMilestone("ch", 17))     c += "Chromosome Milestone 17 multiplies AX by " + format(Decimal.pow(2, player.nu.points)) + br
        }
        if (hasUpgrade("ch", 14) && !hasMilestone("ch", 30)) {
                                        c += "Chromosomes IV multiplies AX by " + format(tmp.ch.upgrades[14].effect) + br
        }
        if (hasUpgrade("ch", 15) && !hasMilestone("sp", 26)) {
                let base = hasUpgrade("an", 34) ? 1.04 : 1.01
                let sub = hasUpgrade("an", 43) ? 0 : 2600
                let exp = player.tokens.tokens2.total.sub(sub).max(0)
                                        c += "Chromosomes V multiplies AX by " + format(Decimal.pow(base, exp)) + br
        }
        if (hasUpgrade("ch", 23) && !hasUpgrade("nu", 14)) {
                                        c += "Chromosomes VIII multiplies AX by 20" + br
        }
        if (hasUpgrade("ch", 32) && !hasUpgrade("nu", 14)) {
                                        c += "Chromosomes XII multiplies AX by 20" + br
        }
        if (hasUpgrade("an", 43) && !hasMilestone("ch", 29)) {
                                        c += "Animals XVIII divides AX by 1e42" + br
        }
        if (!hasMilestone("sp", 26)) {
                if (hasUpgrade("an", 51))       c += "Animals XXI multiplies AX by 2" + br
                if (hasUpgrade("an", 53)) {
                        let sub = hasMilestone("nu", 9) ? 0 : 7200
                        let per = 1.05
                                                c += "Animals XXIII multiplies AX by " + format(Decimal.pow(per, player.tokens.tokens2.total.sub(sub).max(0))) + br
                }
                if (hasUpgrade("an", 54))       c += "Animals XXIV multiplies AX by " + format(player.nu.points.div(4).plus(1).pow(player.an.upgrades.length)) + br
        }
        if (!player.an.achActive[11] && hasAchievement("an", 11)) {
                if (!player.an.achActive[22]) {
                                        c += "PRO I multiplies AX by " + format(Decimal.pow(hasMilestone("an", 36) ? 25 : 5, player.an.achievements.length + 4)) + br
                } else                  c += "PRO I multiplies AX by 25" + br
        }
        if (hasAchievement("an", 12)) {
                if ((player.an.achActive[12] || hasMilestone("ch", 16)) && !hasUpgrade("ch", 34)) {
                                        c += "PRI I divides AX by 4e49" + br
                } 
                if (!player.an.achActive[12] || hasAchievement("an", 22)) {
                                        c += "PRI I multiplies AX by " + format(Decimal.pow(hasMilestone("an", 31) ? 2 : 4, player.ch.points.sub(hasUpgrade("nu", 12) ? 0 : 200).max(0))) + br
                }
        }
        if (hasAchievement("an", 21)) {
                let l = player.ch.points.sub(235).max(0)
                let aa = player.an.achActive
                let r1o = !aa[11] + !aa[12] + !aa[13] + !aa[14]
                if (player.an.achActive[21])    c += "PRO II multiplies AX by " + format(Decimal.pow(3.3, l.times(r1o))) + br
                else                            c += "PRO II multiplies AX by " + format(Decimal.pow(100, l)) + br
        }
        if (hasAchievement("an", 31) && !hasUpgrade("tokens", 123)) {
                                        c += "Progression III multiplies AX by " + format(Decimal.pow(15, player.nu.milestones.length)) + br
        }
        if (hasMilestone("nu", 1))      c += "Nucleus Milestone 1 multiplies AX by 2" + br
        if (hasMilestone("nu", 2) && !hasMilestone("sp", 25)) {
                                        c += "Nucleus Milestone 2 multiplies AX by " + format(Decimal.pow(hasMilestone("an", 43) ? 70 : 10, player.nu.points)) + br
        }
        if (hasUpgrade("tokens", 102))  c += "Token<sup>2</sup> II multiplies AX by " + format(player.sp.points.max(1).pow(player.tokens.upgrades.length)) + br
        
        if (c.includes(br))             c += br 
        if (hasMilestone("ch", 7) && !hasUpgrade("sp", 121)) {
                                        c += "Chromosome Milestone 7 multiplies AX by " + format(player.ch.points.div(67).plus(1).pow(player.ch.points)) + br
        }
        if (hasMilestone("sp", 26))     c += "Species Milestone 26 multiplies AX by " + format(Decimal.pow(1.1, player.tokens.tokens2.total)) + br
        if (hasMilestone("an", 23))     c += "Animal Milestone 23 multiplies AX by " + format(player.or.energy.points.div("1e14000").plus(1).pow(.002)) + br
        if (hasUpgrade("sp", 143))      c += "Boosted Species XVIII multiplies AX by " + format(player.an.grid[104].extras.plus(1).pow(player.tokens.mastery_tokens.total)) + br

        return (a + br + b + br2 + c).replaceAll("AX", makeRed("A"))
}

function contaminantFormulaDisplay(){
        let a = "Contaminant gain is AX"
        let b = "AX is initially 1 and is multiplied by the following factors"
        let c = ""

        if (hasUpgrade("or", 201)) {
                let base = hasUpgrade("or", 321) || player.an.unlocked ? 4 : 2
                                        c += "Kidney I multiplies AX by " + format(Decimal.pow(base, tmp.or.upgrades.kidneyUpgradesLength)) + br
        }
        if (hasUpgrade("or", 225))      c += "Kidney XV multiplies AX by " + format(player.or.energy.points.max(1).div(1e200).pow(player.or.upgrades.length)) + br
        if (!hasMilestone("sp", 25))    c += "Larynx multiplies AX by " + format(tmp.or.challenges[11].reward) + br
        if (hasUpgrade("or", 142))      c += "Heart XXII multiplies AX by " + format(player.or.points.max(1)) + br
        if (hasUpgrade("or", 143) && !hasMilestone("sp", 18)) {
                                        c += "Heart XXIII multiplies AX by " + format(player.or.buyables[202].max(1).pow(player.or.upgrades.length)) + br
        }
        if (hasMilestone("or", 16))     c += "Organ Milestone 16 multiplies AX by " + format(player.or.deoxygenated_blood.points.max(1)) + br
        if (tmp.an.effect.gt(1))        c += "Animal effect multiplies AX by " + format(tmp.an.effect) + br
        if (hasMilestone("an", 5))      c += "Animal Milestone 5 multiplies AX by " + format(player.or.contaminants.points.plus(10).log10().sqrt().pow10()) + br
        if (hasUpgrade("an", 21))       c += "Animals VI multiplies AX by " + format(player.an.grid[608].extras.plus(1).pow(tmp.an.grid.totalLevels)) + br
        if (hasMilestone("ch", 21))     c += "Chromosome Milestone 21 multiplies AX by " + format(player.an.grid[305].extras.plus(1).pow(player.ch.points.min(5000).pow(4))) + br
        if (hasUpgrade("sp", 15))       c += "Effect V multiplies AX by " + format(tmp.sp.effect.pow(player.or.buyables[201].pow(hasUpgrade("sp", 115) ? .91 : hasUpgrade("sp", 65) ? .9 : .8))) + br
        if (hasUpgrade("sp", 44))       c += "Effect XIX multiplies AX by " + format(player.an.grid[206].extras.plus(1).pow(player.nu.points.pow(6))) + br
        if (c.includes(br))             c += br
                                        c += "I'm multiplies AX by " + format(tmp.or.buyables[201].effect) + br
                                        c += "gonna multiplies AX by " + format(tmp.or.buyables[202].effect) + br
                                        c += "make multiplies AX by " + format(tmp.or.buyables[203].effect) + br
                                        c += "you multiplies AX by " + format(tmp.or.buyables[211].effect) + br
                                        c += "an multiplies AX by " + format(tmp.or.buyables[212].effect) + br
                                        c += "offer multiplies AX by " + format(tmp.or.buyables[213].effect) + br
                                        c += "you multiplies AX by " + format(tmp.or.buyables[221].effect) + br
                                        c += "can't multiplies AX by " + format(tmp.or.buyables[222].effect) + br
                                        c += "refuse multiplies AX by " + format(tmp.or.buyables[223].effect) + br
        
        return (a + br + b + br2 + c).replaceAll("AX", makeRed("A"))
}








