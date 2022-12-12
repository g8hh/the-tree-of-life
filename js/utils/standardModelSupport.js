const electronMass      = new Decimal(.511)             // MeV/c^2
const muonMass          = new Decimal(105.7)            // MeV/c^2
const tauonMass         = new Decimal(1780)             // MeV/c^2

const upQuarkMass       = new Decimal(1.9)              // MeV/c^2
const downQuarkMass     = new Decimal(4.4)              // MeV/c^2
const strangeQuarkMass  = new Decimal(87)               // MeV/c^2
const charmQuarkMass    = new Decimal(1320)             // MeV/c^2
const bottomQuarkMass   = new Decimal(4240)             // MeV/c^2
const topQuarkMass      = new Decimal(172700)           // MeV/c^2

const protonMass        = new Decimal(938.2)            // MeV/c^2
const neutronMass       = new Decimal(939.5)            // MeV/c^2
const dalton            = new Decimal(931.494)          // MeV/c^2 https://en.wikipedia.org/wiki/Dalton_(unit)

const MeVtoKg           = new Decimal(1.7827e-30)       // https://www.unitsconverters.com/en/Mev-To-Kg/Utu-3460-3509

const speedOfLight      = new Decimal(299792458)        // 299 792 458 m/s
const coulombConst      = new Decimal(9e9)              // N * m^2 * C^{-2}
const gravitationalConst= new Decimal(6.67430e-11)      // N * m^2 * kg^{-2}
const gravConstMeV      = new Decimal(2.12110e-70)      // N * m^2 * MeV^{-2} * c^4 gravitationalConst.times(MeVtoKg.pow(2))
const chargeToCoulomb   = new Decimal(6.24150e18)       // https://en.wikipedia.org/wiki/Coulomb
const coulombConstElm   = new Decimal(2.31027e-28)      // N * m^2 * e^{-2} coulombConst.div(chargeToCoulomb.pow(2))

const hydrogen1Mass     = new Decimal(1.0078)           // https://en.wikipedia.org/wiki/Isotopes_of_hydrogen
const hydrogen2Mass     = new Decimal(2.0141)

const helium3Mass       = new Decimal(3.0160)           // https://en.wikipedia.org/wiki/Isotopes_of_helium
const helium4Mass       = new Decimal(4.0026)

const lithium6Mass      = new Decimal(6.0151)           // https://en.wikipedia.org/wiki/Isotopes_of_lithium
const lithium7Mass      = new Decimal(7.0160)   

const beryllium9Mass    = new Decimal(9.0121)           // https://en.wikipedia.org/wiki/Isotopes_of_beryllium

const boron10Mass       = new Decimal(10.0129)          // https://en.wikipedia.org/wiki/Isotopes_of_boron
const boron11Mass       = new Decimal(11.0093)

const carbon12Mass      = new Decimal(12)               // https://en.wikipedia.org/wiki/Isotopes_of_carbon
const carbon13Mass      = new Decimal(13.0033)

const nitrogen14Mass    = new Decimal(14.0030)          // https://en.wikipedia.org/wiki/Isotopes_of_nitrogen
const nitrogen15Mass    = new Decimal(15.0001)

const oxygen16Mass      = new Decimal(15.9949)          // https://en.wikipedia.org/wiki/Isotopes_of_oxygen
const oxygen17Mass      = new Decimal(16.9991)
const oxygen18Mass      = new Decimal(17.9991)

const flourine19Mass    = new Decimal(18.9984)          // https://en.wikipedia.org/wiki/Isotopes_of_fluorine

const neon20Mass        = new Decimal(19.9924)          // https://en.wikipedia.org/wiki/Isotopes_of_neon
const neon21Mass        = new Decimal(20.9938)
const neon22Mass        = new Decimal(21.9913)

const sodium23Mass      = new Decimal(22.9897)          // https://en.wikipedia.org/wiki/Isotopes_of_sodium

const magnesium24Mass   = new Decimal(23.9850)          // https://en.wikipedia.org/wiki/Isotopes_of_magnesium
const magnesium25Mass   = new Decimal(24.9858)
const magnesium26Mass   = new Decimal(25.9825)

const aluminium27Mass   = new Decimal(26.9815)          // https://en.wikipedia.org/wiki/Isotopes_of_aluminium

const silicon28Mass     = new Decimal(27.9769)          // https://en.wikipedia.org/wiki/Isotopes_of_silicon
const silicon29Mass     = new Decimal(28.9764)
const silicon30Mass     = new Decimal(29.9737)

const phosphorus31Mass  = new Decimal(30.9737)          // https://en.wikipedia.org/wiki/Isotopes_of_phosphorus

const sulfur32Mass      = new Decimal(31.9720)          // https://en.wikipedia.org/wiki/Isotopes_of_sulfur
const sulfur33Mass      = new Decimal(32.9714)
const sulfur34Mass      = new Decimal(33.9678)
const sulfur36Mass      = new Decimal(35.9670)

const chlorine35Mass    = new Decimal(34.9688)          // https://en.wikipedia.org/wiki/Isotopes_of_chlorine
const chlorine37Mass    = new Decimal(36.9659)

const argon36Mass       = new Decimal(35.9675)          // https://en.wikipedia.org/wiki/Isotopes_of_argon
const argon38Mass       = new Decimal(37.9627)
const argon40Mass       = new Decimal(39.9623)



const chemAbbrev        = {
        "H":    "Hydrogen",
        "He":   "Helium",
        "Li":   "Lithium",
        "Be":   "Beryllium",
        "B":    "Boron",
        "C":    "Carbon",
        "N":    "Nitrogen",
        "O":    "Oxygen",
        "F":    "Flourine",
        "Ne":   "Neon",
        "Na":   "Sodium",
        "Mg":   "Magnesium",
        "Al":   "Aluminium",
        "Si":   "Silicon",
        "P":    "Phosphorus",
        "S":    "Sulfur",
        "Cl":   "Chlorine",
        "Ar":   "Argon",
}

const chemInitialEffects = {
        "H":    "per level subtract .01 from <i>Ittia</i> base (max 150)",
        "He":   "per level multiply Researcher gain by 1+levels/30",
        "Li":   "per level subtract .0001 from Nucleus cost exponent (max 200)",
        "Be":   "per level<sup>.5</sup> subtract .01 from Mastery VII exponent (max 100)",
        "B":    "per level subtract .0007 from Mastery III base (max 100)",
        "C":    "per level add .01 to the Researcher gain exponent (the first level removes the -9)",
        "N":    "per 2 levels gain a Chemist (this one only is based on best)",
        "O":    "per level<sup>.5</sup> multiply worker speed by 1 + levels",
        "F":    "per level log10(Ecosystems) multiplies Human gain",
        "Ne":   "multiply the Researcher effect exponent by 1 + levels / 8",
        "Na":   "Mastery VI exponent is .11 and base is 1.7 - levels / 400",
        "Mg":   "Multiply <i>Hual</i> base by log2(2 + levels)<sup>3</sup>",
        "Al":   "Per level subtract .0001 from Chromosome cost exponent (max 100)",
        "Si":   "Simplify Species gain and multiply its gain exponent by 1 + levels / 1000",
        "P":    "Add 1 - levels / 1e4 to Plant buyables exponent (max 100)",
        "S":    "Per level reduce decay by .01%/s (max 100)",
        "Cl":   "Per level subtract .01 from the <i>Tulinwl</i> base (max 100)",
        "Ar":   "Per level subtract 2 from the <i>GmaptsaIwmte</i> base (max 100)",
}

function displayChemInitialEffect(s){
        return makeGreen(s) + " - " + chemInitialEffects[s]
}








