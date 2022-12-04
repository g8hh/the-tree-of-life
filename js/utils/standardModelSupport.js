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














