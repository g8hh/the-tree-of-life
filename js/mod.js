let modInfo = {
	name: "The Tree of Life",
	id: "tree_of_life",
	author: "pg132",
	pointsName: "Life Points",
	modFiles: ["layers.js", "tree.js"],
	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (1), // Used for hard resets and new players
	offlineLimit: 0,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.223",
	name: "Advil's Auspicious Acension",
}


var forceEndgame = false
function isEndgame() {
	if (forceEndgame) return true
	if (player.extremeMode) return player.tokens.tokens2.total.gt(0)
	return player.tokens.tokens2.total.gte(1114)
}

let changelog = `<h1>Changelog:</h1><br>
	<br><h2 style='color: #DDDD00'>Endgame:</h2><br>
		Reaching the endgame screen (updated at least as of v1.223)<br><br>
	<br><h2 style='color: #00CC00'>Notes</h2><br>
		- Versions will be vA.B.C<br>
		- A will be big releases.<br>
		- B will be each content patch.<br>
		- C will be small patches without content (bug/wording fixes).<br><br><br>

	<br><h3 style='color: #CC0000'>v1.223</h3><br>
		- Balanced until 1114 Token II.<br>
		- Added a custom save.<br>
		- Added two Organ upgrades.<br>
		- Added a Lung upgrade.<br>
		- Added two Animal milestones.<br>
		- Added a hardcap for Charm's effect to Tissue exponent.<br>
	<br><h3 style='color: #CC0000'>v1.222</h3><br>
		- Added three Lung upgrades.<br>
		- Added an Organ upgrade.<br>
		- Added an Animal milestone.<br>
		- Added an Animal upgrade.<br>
		- Various code cleanup.<br>
		- Balanced until Organs XIII.<br>
	<br><h3 style='color: #CC0000'>v1.221</h3><br>
		- Added a Lung upgrade.<br>
		- Added four Animal milestones.<br>
	<br><h3 style='color: #CC0000'>v1.220</h3><br>
		- Added three Animal milestones.<br>
		- Balanced until 5 Animal resets.<br>
	<br><h3 style='color: #CC0000'>v1.219</h3><br>
		- Added a Lung upgrade.<br>
		- Added three Animal milestones.<br>
		- Balanced until 5 Animal resets.<br>
	<br><h3 style='color: #CC0000'>v1.218</h3><br>
		- Balanced until 2 Animal resets.<br>
		- Added two animal milestones.<br>
		- Added a animal upgrade.<br>
	<br><h3 style='color: #CC0000'>v1.217.1</h3><br>
		- Added five rows of achievements.<br>
		- Made achievements unlock at various points.<br>
	<br><h3 style='color: #CC0000'>v1.217</h3><br>
		- Balanced until 1e100 Organs.<br>
		- Added 3 Organ upgrades.<br>
		- Added 3 Kidney upgrades.<br>
		- Added 4 Lung upgrades.<br>
		- Added 3 Organ milestones.<br>
		- Various code and display clean up.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.216</h3><br>
		- Balanced until 1e2948 Energy.<br>
		- Added three Organ upgrades.<br>
		- Added two Kidney upgrades.<br>
		- Added six Lung upgrades.<br>
		- Added three Intestine buyables.<br>
		- Added an Organ milestone.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.215</h3><br>
		- Added two Intestine buyables.<br>
		- Added an Organ upgrade.<br>
		- Added two Heart upgrades.<br>
		- Added a Kidney upgrade.<br>
		- Added two Organ milestones.<br>
		- Balanced until 1e671 Energy.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.214</h3><br>
		- Added four Intestine buyables.<br>
		- Added a Lung upgrade.<br>
		- Balanced until 1e175 Energy.<br>
		- Added a new layer.<br>
	<br><h3 style='color: #CC0000'>v1.213</h3><br>
		- Added a Heart upgrade.<br>
		- Added three Lung upgrades.<br>
		- Added a custom save.<br>
		- Balanced until 1e2050 Air.<br>
		- Added four rows of achievements (up to 100)!<br>
	<br><h3 style='color: #CC0000'>v1.212</h3><br>
		- Added two Kidney upgrades.<br>
		- Added a Lung upgrade.<br>
		- Added a Organ milestone.<br>
		- Added three new layers.<br>
		- Fixed the order of a custom save.<br>
		- Balanced until 1e1150 Air.<br>
	<br><h3 style='color: #CC0000'>v1.211</h3><br>
		- Balanced until 1 token II.<br>
		- Various extreme mode changes.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.210.1</h3><br>
		- Added three rows of achievements.<br>
		- Made the 91st row of achievements slihgtly easier.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.210</h3><br>
		- Added a Lung challenge.<br>
		- Added a Lung upgrades.<br>
		- Added two Kidney upgrades.<br>
		- Balanced until 1e960 Air.<br>
		- Next patch will remove Amino Acid and have three (3!!) new layers.<br>
	<br><h3 style='color: #CC0000'>v1.209</h3><br>
		- Added a Lung challenge.<br>
		- Added two Lung upgrades.<br>
		- Added a Heart upgrade.<br>
		- Balanced until 1e366 Air.<br>
	<br><h3 style='color: #CC0000'>v1.208</h3><br>
		- Added two Lung challenges.<br>
		- Added three Lung upgrades.<br>
		- Balanced until 1e117 Air.<br>
	<br><h3 style='color: #CC0000'>v1.207</h3><br>
		- Added Air and Lungs.<br>
		- Added two Lung challenges.<br>
		- Added two Organ milestones.<br>
		- Added a custom save.<br>
		- Balanced until 1e13 Air.<br>
	<br><h3 style='color: #CC0000'>v1.206</h3><br>
		- Balanced until 63 Secondary completions.<br>
		- Various extreme mode changes.<br>
		- Added a custom save.<br>
		- Added a DNA Science upgrade.<br>
	<br><h3 style='color: #CC0000'>v1.205</h3><br>
		- Balanced until 59 Secondary completions.<br>
		- Various extreme mode changes.<br>
		- Added two DNA Science upgrades.<br>
	<br><h3 style='color: #CC0000'>v1.204</h3><br>
		- Balanced until 51 Secondary completions.<br>
		- Various extreme mode changes.<br>
		- Added a DNA Science upgrade.<br>
	<br><h3 style='color: #CC0000'>v1.203</h3><br>
		- Balanced until 45 Secondary completions.<br>
		- Various extreme mode changes.<br>
		- Various display fixes.<br>
		- Added Upgrades II for DNA Science, and changed XXVI.<br>
	<br><h3 style='color: #CC0000'>v1.202.2</h3><br>
		- Various balance changes.<br>
		- Fixed a bug with Omnipotent needing Organ milestone 3, not 2 to bulk.<br>
	<br><h3 style='color: #CC0000'>v1.202.1</h3><br>
		- Added a hotkey for forcing the endgame screen (shift+control+e).<br>
		- Various code cleanup.<br>
		- New file! js/utils/gemSupport.js!<br>
	<br><h3 style='color: #CC0000'>v1.202</h3><br>
		- Balanced until 1e538,000 Contaminants.<br>
		- Added two Kidney upgrades.<br>
		- Added a Kidney buyable.<br>
		- Added a Organ milestone.<br>
	<br><h3 style='color: #CC0000'>v1.201</h3><br>
		- Balanced until 1e152,996 Contaminants.<br>
		- Added a way to slow the game down by 100x for five real seconds.<br>
		- Added a Heart upgrade.<br>
		- Added an Organ upgrade.<br>
		- Added a Kidney upgrade.<br>
		- Added a Kidney buyable.<br>
	<br><h3 style='color: #CC0000'>v1.200.2</h3><br>
		- Fixed a bug with having the exact right amount of Contaminants.<br>
		- Various code clean up.<br>
		- Added a display to respec for Token II.<br>
	<br><h3 style='color: #CC0000'>v1.200.1</h3><br>
		- Fixed the bug where you hold a buyable and then switch tabs to keep it autobuying.<br>
		- Thank you so much to Lordshinjo for helping report and fix the issue.<br>
	<br><h3 style='color: #CC0000'>v1.200</h3><br>
		- Balanced until 1e67,900 Contaminants.<br>
		- Added a Kidney upgrade.<br>
		- Added a Kidney buyable.<br>
		- Added two Heart upgrades.<br>
		- Added three rows of achievements.<br>
		- Added a custom save.<br>
		- Various wording fixes.<br>
		- 200! Let's go! Here's to 200 more patches!<br>
	<br><h3 style='color: #CC0000'>v1.199</h3><br>
		- Added a Kidney upgrade.<br>
		- Added a Kidney buyable.<br>
		- Balanced until 1e29,600 Contaminants.<br>
		- Added three Heart upgrades.<br>
	<br><h3 style='color: #CC0000'>v1.198</h3><br>
		- Added Kidney.<br>
		- Added five Kidney upgrades.<br>
		- Added five Kidney buyables.<br>
		- Balanced until 1e6000 Contaminants.<br>
		- Various wording fixes and code cleanup.<br>
		- Added two rows of achievements.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.197.2</h3><br>
		- Added a Organ upgrade.<br>
	<br><h3 style='color: #CC0000'>v1.197.1</h3><br>
		- Various code cleanup.<br>
		- Rebalanced 1000-1e7 Organ Era.<br>
		- Added a display for cheapest DNA Science buyable.<br>
		- Added a display for next at for Organ gain.<br>
		- Made the 7e242 Life milestone only require 2.5e242.<br>
	<br><h3 style='color: #CC0000'>v1.197</h3><br>
		- Balanced until Tissues XL.<br>
		- Various extreme mode changes.<br>
		- Various wording changes and code clean up.<br>
		- Added a DNA Science upgrade.<br>
	<br><h3 style='color: #CC0000'>v1.196</h3><br>
		- Balanced until Tissues XXXVIII.<br>
		- Various extreme mode changes.<br>
		- Added a DNA Science upgrade.<br>
	<br><h3 style='color: #CC0000'>v1.195</h3><br>
		- Balanced until Tissues XXXV.<br>
		- Various extreme mode changes, and display fixes.<br>
		- Added a custom save.<br>
		- Added three DNA Science upgrades.<br>
	<br><h3 style='color: #CC0000'>v1.194</h3><br>
		- Balanced until Tissues XXX.<br>
		- Various extreme mode changes, bugfixes, code cleanup, and display fixes.<br>
	<br><h3 style='color: #CC0000'>v1.193</h3><br>
		- Balanced until 33 total Tissues.<br>
		- Added a custom save.<br>
		- Various extreme mode changes.<br>
	<br><h3 style='color: #CC0000'>v1.192</h3><br>
		- Balanced extreme mode until Tissue unlock.<br>
		- Various code clean up and extreme mode changes.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.191</h3><br>
		- Balanced until 1e24 Deoxygenated Blood.<br>
		- Various bugfixes and code clean up.<br>
		- Implemented the 4th Tertiary completion.<br>
	<br><h3 style='color: #CC0000'>v1.190</h3><br>
		- Balanced until 5e22 Deoxygenated Blood.<br>
		- Added three Heart upgrades.<br>
		- Added an Organ upgrade.<br>
	<br><h3 style='color: #CC0000'>v1.189</h3><br>
		- Balanced until 3e18 Deoxygenated Blood.<br>
		- Added four Heart upgrades.<br>
		- Added a Organ upgrade.<br>
		- Added two Organ milestones.<br>
		- Added three rows of achievements.<br>
		- Various display changes, display fixes, bug fixes, and code cleanup.<br>
	<br><h3 style='color: #CC0000'>v1.188</h3><br>
		- Balanced until 5e11 Deoxygenated Blood.<br>
		- Added thirteen Heart upgrades.<br>
		- Added a custom save.<br>
		- Made green letters purple for better visibility.<br>
		- Various code clean up and display fixes.<br>
		- Added 1 to point gain if you have Cells unlocked (tell me why for bonus points)!<br>
	<br><h3 style='color: #CC0000'>v1.187</h3><br>
		- Various extreme mode changes.<br>
		- Added a custom save.<br>
		- Balanced extreme mode until 1e4927 DNA Science.<br>
		- Added two DNA Science upgrades.<br>
		- Initially added Heart.<br>
		- Added a Stem Cell buyable.<br>
	<br><h3 style='color: #CC0000'>v1.186</h3><br>
		- Added a custom save.<br>
		- Various extreme mode changes.<br>
		- Balanced extreme mode until 1e3796 DNA Science.<br>
		- Added three DNA Science upgrades.<br>
	<br><h3 style='color: #CC0000'>v1.185</h3><br>
		- Various extreme mode changes.<br>
		- Balanced extreme mode until 1e1084 DNA Science.<br>
		- Added three DNA Science upgrades.<br>
		- Various display fixes and improvements.<br>
	<br><h3 style='color: #CC0000'>v1.184</h3><br>
		- Various extreme mode changes.<br>
		- Balanced extreme mode until 1e852 DNA Science.<br>
		- Added two DNA Science upgrades.<br>
	<br><h3 style='color: #CC0000'>v1.183</h3><br>
		- Balanced normal mode until 3 Tertiary completions.<br>
		- Added four Organ milestones.<br>
	<br><h3 style='color: #CC0000'>v1.182</h3><br>
		- Balanced normal mode until 10 Organs.<br>
		- Various extreme mode changes.<br>
		- Various bugfixes.<br>
		- Various display fixes.<br>
	<br><h3 style='color: #CC0000'>v1.181</h3><br>
		- Balanced until 1e643 DNA Science.<br>
		- Added six DNA Science upgrades.<br>
		- Added two DNA Science buyables.<br>
		- Various extreme mode changes.<br>
		- Added Stem Cell amount to Cell tooltip.<br>
		- Improved DNA Science tab display.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.180.1</h3><br>
		- Fixed various bugs.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.180</h3><br>
		- Various wording fixes.<br>
		- Balanced until 1e168 DNA Science.<br>
		- Added a DNA science buyable.<br>
		- Various extreme mode changes.<br>
	<br><h3 style='color: #CC0000'>v1.179</h3><br>
		- Various wording fixes.<br>
		- Added two DNA science upgrades.<br>
		- Added a DNA science buyable.<br>
		- Various extreme mode changes.<br>
		- Balanced until approx 1e11/1e14/1e30/1e69 minigame amounts.<br>
		- Now deleting a save names it in the popup.<br>
	<br><h3 style='color: #CC0000'>v1.178.1</h3><br>
		- Made the second row of Atomic Hydrogen and Deuterium upgrades display that they need coin upgrades.<br>
		- Added a custom save.<br>
		- Made changing modes ask you if you want to create a new save.<br>
		- Various wording fixes.<br>
	<br><h3 style='color: #CC0000'>v1.178</h3><br>
		- Balanced until the second set of minigames unlocked.<br>
		- Various extreme mode changes.<br>
	<br><h3 style='color: #CC0000'>v1.177</h3><br>
		- Balanced until 5 cell resets.<br>
		- Various extreme mode changes.<br>
		- Various wording and other small changes.<br>
	<br><h3 style='color: #CC0000'>v1.176</h3><br>
		- Added 13 gems.<br>
		- Balanced until Cells unlock.<br>
		- Various extreme mode changes.<br>
		- Added a DNA Science upgrade.<br>
		- Added a DNA Science buyable.<br>
		- Added two custom saves.<br>
		- Various wording changes.<br>
		- Various code cleanup.<br>
	<br><h3 style='color: #CC0000'>v1.175.2</h3><br>
		- Balanced until 1e26 DNA Science.<br>
		- Added a gem.<br>
	<br><h3 style='color: #CC0000'>v1.175.1</h3><br>
		- Added a DNA Science upgrade.<br>
		- Added a DNA Science buyable.<br>
		- Balanced until 5e23 DNA Science.<br>
	<br><h3 style='color: #CC0000'>v1.175</h3><br>
		- Added a DNA Science upgrade.<br>
		- Added a DNA Science buyable.<br>
		- Added two gems.<br>
		- Balanced until 8 Topoisomerase.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.174.4</h3><br>
		- Added a DNA Science upgrade.<br>
		- Added a DNA Science buyable.<br>
		- Added a gem.<br>
		- Various wording fixes.<br>
		- Balanced until C76 Gems.<br>
	<br><h3 style='color: #CC0000'>v1.174.3</h3><br>
	 	- Various code cleanup.<br>
	<br><h3 style='color: #CC0000'>v1.174.2</h3><br>
		- Added DNA Science.<br>
		- Added a DNA Science upgrade.<br>
		- Added a DNA Science buyable.<br>
	<br><h3 style='color: #CC0000'>v1.174.1</h3><br>
		- Balanced until C75 Gems.<br>
		- Added six gems.<br>
		- Various extreme mode changes.<br>
	<br><h3 style='color: #CC0000'>v1.174</h3><br>
		- Balanced until C57 Gems.<br>
		- Added five gems.<br>
		- Various extreme mode changes.<br>
		- Various rewording changes.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.173</h3><br>
		- Balanced until Anti-Phi.<br>
		- Various extreme mode changes.<br>
		- Added six gems.<br>
		- Added two Protein Science upgrades.<br>
		- Added a Life challenge info minitab.<br>
		- Made various autobuyers not trigger if the game is paused.<br>
	<br><h3 style='color: #CC0000'>v1.172</h3><br>
		- Balanced until 1e916 Protein Science.<br>
		- Added a Protein Science upgrade.<br>
		- Added a gem.<br>
		- Various extreme mode changes.<br>
	<br><h3 style='color: #CC0000'>v1.171</h3><br>
		- Various code clean up.<br>
		- Various extreme mode changes.<br>
		- Implemented four gems.<br>
		- Added two Protein Science upgrades.<br>
	<br><h3 style='color: #CC0000'>v1.170</h3><br>
		- Various bugfixes.<br>
		- Balanced until 10 DNA resets.<br>
	<br><h3 style='color: #CC0000'>v1.169</h3><br>
		- Various code cleanup.<br>
		- Balanced until 2 DNA resets.<br>
		- Implemented DNA reset.<br> 
	<br><h3 style='color: #CC0000'>v1.168</h3><br>
		- Added eight Protein Science upgrades.<br>
		- Various extreme mode changes.<br>
		- Balanced until 8e415 Amino Acid.<br>
		- Added a custom save.<br>
		- Various code cleanup.<br>
		- Various wording changes.<br>
	<br><h3 style='color: #CC0000'>v1.167</h3><br>
		- Implemented a gem.<br>
		- Various extreme mode changes.<br>
		- Balanced until 1e105,000 Protein.<br>
		- Added a custom save.<br>
		- Added nine Protein Science upgrades.<br>
		- Various wording fixes.<br>
	<br><h3 style='color: #CC0000'>v1.166</h3><br>
		- Implemented a gem.<br>
		- Various extreme mode changes.<br>
		- Balanced until 1e20,000 Protein.<br>
		- Added two Protein Science upgrades.<br>
	<br><h3 style='color: #CC0000'>v1.165</h3><br>
		- Implemented a gem.<br>
		- Various extreme mode changes.<br>
		- Added a custom save.<br>
		- Balanced until 1e6800 Protein.<br>
		- Added Protein Science.<br>
		- Added five Protein Science upgrades.<br>
	<br><h3 style='color: #CC0000'>v1.164</h3><br>
		- Implemented 7 gems.<br>
		- Various extreme mode changes.<br>
		- Balanced until Protein unlock.<br>
	<br><h3 style='color: #CC0000'>v1.163</h3><br>
		- Various code cleanup.<br>
		- Balanced until C14 Gems.<br>
		- Various small rewordings.<br>
		- Added an effect to Amino Acid milestone 6.<br>
		- Various extreme mode changes.<br>
	<br><h3 style='color: #CC0000'>v1.162</h3><br>
		- Made parts of Life/Amino milestone 1 be given for unlocking the layer (see info).<br>
		- Various code cleanup.<br>
		- Cleaned up some display issues.<br>
		- Various code cleanup.<br>
		- Added a "MAXED" display for Reduce.<br>
	<br><h3 style='color: #CC0000'>v1.161</h3><br>
		- Balanced until Amino Acid unlock.<br>
		- Implemented C23, 31, 32, and 33 gems.<br>
		- Made more than 1 C3 depth harder.<br>
		- Added a custom save.<br>
		- Added three Life upgrades.<br>
		- Buffed some of Phosphorus milestone 1 effects to permanent.<br>
		- Various code cleanup.<br>
		- Various display cleanup.<br>
	<br><h3 style='color: #CC0000'>v1.160</h3><br>
		- Balanced until C13 gems.<br>
		- Added two Life upgrades.<br>
		- Various extreme mode changes.<br>
	<br><h3 style='color: #CC0000'>v1.159.1</h3><br>
		- Finished code cleanup (for now)!<br>
		- Prepped gems for extreme mode.<br>
	<br><h3 style='color: #CC0000'>v1.159</h3><br>
		- Balanced until 110 Dilation completions.<br>
		- Various extreme mode changes.<br>
		- Various code cleanup.<br>
	<br><h3 style='color: #CC0000'>v1.158.2</h3><br>
		- More code cleanup (~1070 lines removed).<br>
		- Some displays are now hidden eventually.<br>
	<br><h3 style='color: #CC0000'>v1.158.1</h3><br>
		- Various code cleanup (and ~1800 lines removed!).<br>
	<br><h3 style='color: #CC0000'>v1.158</h3><br>
		- Balanced until 99 Dilation completions.<br>
		- Added 5 Life upgrades.<br>
		- Various extreme mode changes.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.157</h3><br>
		- Balanced until 60 Dilation completions.<br>
		- Added 3 Life upgrades.<br>
		- Various extreme mode changes.<br>
		- Added a custom save.<br>
		- Fixed an issue with Dilation effecting Science gain when not in the challenge.<br>
	<br><h3 style='color: #CC0000'>v1.156</h3><br>
		- Balanced until 43 Dilation completions.<br>
		- Added a Life upgrade.<br>
		- Various extreme mode changes.<br>
	<br><h3 style='color: #CC0000'>v1.155</h3><br>
		- Balanced until 31 Dilation completions.<br>
		- Added three Life upgrades.<br>
		- Various extreme mode changes.<br>
	<br><h3 style='color: #CC0000'>v1.154</h3><br>
		- Balanced until 7 Dilation completions.<br>
		- Various extreme mode changes.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.153</h3><br>
		- Balanced until 20 lives.<br>
		- Various extreme mode changes.<br>
		- Nerfed Life to Nitrogen Science boost.<br>
	<br><h3 style='color: #CC0000'>v1.152</h3><br>
		- Various extreme mode changes.<br>
		- Balanced until 4 Lives.<br>
	<br><h3 style='color: #CC0000'>v1.151.2</h3><br>
		- Added a custom save.<br>
		- Various small changes.<br>
	<br><h3 style='color: #CC0000'>v1.151.1</h3><br>
		- Created Life reset for extreme mode.<br>
		- Replaced instances of "x = x.times" with "ret = ret.times" (cleaner code).<br>
		- Buffed Life milestone 1 to make tokens permanently reset nothing.<br>
		- Correspondingly removed above effect from Organ milestone 1.<br>
		- Cleaned up Life info display.<br>
		- Various code cleanup.<br>
		- Made Life effect affect Science content.<br>
		- Fixed Oxygen I cost being less than intended (not a substantive change).<br>
	<br><h3 style='color: #CC0000'>v1.151</h3><br>
		- Fixed some stuff surrounding dilation.<br>
	<br><h3 style='color: #CC0000'>v1.150</h3><br>
		- Balanced until Life unlock.<br>
		- Various extreme mode changes.<br>
		- Added a custom save.<br>
		- Added four µ milestones.<br>
	<br><h3 style='color: #CC0000'>v1.149</h3><br>
		- Balanced until µ XIV.<br>
		- Added three Phosphorus uprgrades.<br>
		- Added three µ milestones.<br>
		- Various extreme mode changes.<br>
	<br><h3 style='color: #CC0000'>v1.148</h3><br>
		- Balanced until 6e638 Phosphorus.<br>
		- Added four Phosphorus upgrades.<br>
		- Various extreme mode changes.<br>
	<br><h3 style='color: #CC0000'>v1.147</h3><br>
		- Balanced until 1e157 Phosphorus.<br>
		- Added a Phosphorus upgrade.<br>
	<br><h3 style='color: #CC0000'>v1.146</h3><br>
		- Balanced until 1e135 Phosphorus.<br>
		- Various extreme mode changes.<br>
		- Added two Phosphorus upgrades.<br>
		- Added a Phosphorus milestone.<br>
	<br><h3 style='color: #CC0000'>v1.145</h3><br>
		- Balanced until 2 Phosphorus resets.<br>
		- Implemented Phosphorus reset for extreme mode.<br>
	<br><h3 style='color: #CC0000'>v1.144.1</h3><br>
		- Fixed an issue with D Points in the main game.<br>
	<br><h3 style='color: #CC0000'>v1.144</h3><br>
		- Balanced until 1e2348 Nitrogen.<br>
		- Improved the display of various components.<br>
		- Added a custom save.<br>
		- Please do NOT phosphorus reset in extreme mode--the game isn't balanced yet.<br>
		- Various extreme mode changes.<br>
		- Fixed initial phosphorus gain display info.<br>
		- Added a Nitrogen Science upgrade.<br>
	<br><h3 style='color: #CC0000'>v1.143</h3><br>
		- Balanced until 1e8660 E Points.<br>
	<br><h3 style='color: #CC0000'>v1.142.1</h3><br>
		- Balanced until 1e1738 E Points.<br>
		- Added a Nitrogen Science upgrade.<br>
		- Various extreme mode changes.<br>
	<br><h3 style='color: #CC0000'>v1.142</h3><br>
		- Balanced until 1e181 E Points.<br>
		- Added two Nitrogen Science upgrade.<br>
	<br><h3 style='color: #CC0000'>v1.141.1</h3><br>
		- Thank you so much to Jacorb for <br>
		1) Letting me use his multisave system and code<br>
		2) Helping me through the parts I didn't understand<br>
		3) Giving pointers on the code he provided<br>
		- Multiple saves are now possible!<br>
		- Go to the options tab (cog) > Show your saves button to view them<br>
		- Click outside the popup to close it.<br>
		- Create new saves (which replicate the current state).<br>
		- Added an infobox in Hydrogen that introduce people to various important things.<br>
	<br><h3 style='color: #CC0000'>v1.141</h3><br>
		- Added a custom save.<br>
		- Balanced until 1e52 E Points.<br>
		- Various extreme mode changes.<br>
		- Added seven Nitrogen Science upgrades.<br>
	<br><h3 style='color: #CC0000'>v1.140</h3><br>
		- Balanced until E Points unlock.<br>
		- Added two custom saves.<br>
		- Various extreme mode changes.<br>
		- Added five Nitrogen Science upgrades.<br>
	<br><h3 style='color: #CC0000'>v1.139</h3><br>
		- Balanced until 1.3e79 Nitrogen Science.<br>
		- Added six Nitrogen Science upgrades.<br>
		- Loads of extreme mode changes (order changes too).<br>
		- Renamed redudant buyables names (eg. Quadratic Increase 1 -> Quadratic Increase).<br>
	<br><h3 style='color: #CC0000'>v1.138</h3><br>
		- Balanced until 1e4046 D Points.<br>
		- Various extreme mode changes.<br>
		- Added three Nitrogen Science upgrades.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.137</h3><br>
		- Balanced until 1e21 D Points.<br>
		- Added three Nitrogen Science upgrades.<br>
		- Various changes.<br>
	<br><h3 style='color: #CC0000'>v1.136</h3><br>
		- Balanced until D Point unlocked.<br>
		- Implemented the removal of Hydrogen Science.<br>
		- Added a custom save.<br>
		- Various extreme mode changes.<br>
		- Various code cleanup.<br>
		- Added a Nitrogen Science upgrade.<br>
	<br><h3 style='color: #CC0000'>v1.135</h3><br>
		- Balanced until 5e5 Nitrogen Science.<br>
		- Various code cleanup.<br>
		- Improved A Point buyables cost formula displays.<br>
		- Added Nitrogen Science.<br>
		- Added five Nitrogen Science upgrades.<br>
		- Hardcapped Nitrogen effect on Carbon Science.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.134</h3><br>
		- Balanced until 1e4 total nitrogen.<br>
		- Various extreme mode changes.<br>
		- Nitrogen science next patch.<br>
	<br><h3 style='color: #CC0000'>v1.133</h3><br>
		- Balanced until 20 total nitrogen.<br>
		- Various extreme mode changes.<br>
		- Various code cleanup.<br>
	<br><h3 style='color: #CC0000'>v1.132</h3><br>
		- Balanced until 3 total nitrogen.<br>
		- Added a Hydrogen Science upgrade autobuyer.<br>
	<br><h3 style='color: #CC0000'>v1.131</h3><br>
		- Balanced until 2 total nitrogen.<br>
		- Made token reset do what I want it to do.<br>
		- Various extreme mode changes.<br>
	<br><h3 style='color: #CC0000'>v1.130</h3><br>
		- Added five Carbon Science upgrades.<br>
		- Added two token milestones.<br>
		- Buffed token milestone 25 in extreme mode.<br>
		- Various extreme mode changes.<br>
		- Balanced until Nitrogen is unlocked.<br>
		- Added a custom save.<br>
		- Fixed a bunch of next at displays.<br>
	<br><h3 style='color: #CC0000'>v1.129</h3><br>
		- Balanced until 1e14250 C Points.<br>
		- Added a Carbon Science upgrade.<br>
		- Added a custom save.<br>
		- Various extreme mode changes.<br>
	<br><h3 style='color: #CC0000'>v1.128</h3><br>
		- Balanced until 1e6280 C Points.<br>
		- Added a Carbon Science upgrade.<br>
		- Various extreme mode changes.<br>
	<br><h3 style='color: #CC0000'>v1.127</h3><br>
		- Balanced until 1e2180 C Points.<br>
		- Added two Carbon Science upgrades.<br>
		- Removed the character effect display from the upgrades subtab.<br>
		- Various extreme mode changes.<br>
	<br><h3 style='color: #CC0000'>v1.126</h3><br>
		- Balanced until 1e1002 C Points.<br>
		- Added a Carbon Science upgrade.<br>
		- Various code cleanup.<br>
		- Improved science tab's tooltip.<br>
	<br><h3 style='color: #CC0000'>v1.125</h3><br>
		- Balanced until 1e814 C Points.<br>
		- Added a custom save.<br>
		- Added four Carbon Science upgrades.<br>
		- Various changes for extreme mode.<br>
	<br><h3 style='color: #CC0000'>v1.124</h3><br>
		- Balanced until 1e200 C Points.<br>
		- Added seven Carbon Science upgrades.<br>
		- Various other changes for extreme mode.<br>
	<br><h3 style='color: #CC0000'>v1.123</h3><br>
		- Balanced until 1e48 C Points.<br>
		- Added two Carbon Science upgrades.<br>
	<br><h3 style='color: #CC0000'>v1.122</h3><br>
		- Balanced until 1e31 C Points.<br>
		- Added Carbon Science.<br>
		- Added two Carbon Science upgrades.<br>
		- C Point displays have been changed around.<br>
	<br><h3 style='color: #CC0000'>v1.121</h3><br>
		- Balanced extreme until 1e9 C Points.<br>
		- Made C point countdown based on game time, not real time.<br>
		- Made extreme mode effect C/D/E Point gain (not achieved prior, so this makes no difference to progression).<br>
		- Added a single token.<br>
	<br><h3 style='color: #CC0000'>v1.120</h3><br>
		- Balanced until 42 tokens.<br>
		- Added three Oxygen Science upgrades.<br>
	<br><h3 style='color: #CC0000'>v1.119</h3><br>
		- Balanced until 36 tokens.<br>
		- Various cost changes.<br>
		- Implemented a Oxygen Science upgrade.<br>
	<br><h3 style='color: #CC0000'>v1.118</h3><br>
		- Extreme mode is balanced until 11 Oxygen Science upgrades.<br>
		- Various cost and other balance changes.<br>
	<br><h3 style='color: #CC0000'>v1.117.2</h3><br>
		- Phosphorus XXI unlock is now 6.8e107 Lives.<br>
	<br><h3 style='color: #CC0000'>v1.117.1</h3><br>
		- Hard and extreme is now playable, albeit very slow. Tell me about your progress!<br>
	<br><h3 style='color: #CC0000'>v1.117</h3><br>
		- Balanced until 26 tokens.<br>
		- Next is AH7 -> D7 -> token 27.<br>
	<br><h3 style='color: #CC0000'>v1.116</h3><br>
		- Balanced until 24 tokens.<br>
	<br><h3 style='color: #CC0000'>v1.115</h3><br>
		- Added two Oxygen Science upgrades.<br>
		- Various other changes to make extreme work.<br>
		- Balanced until 23 tokens.<br>
		- Various code cleanup.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.114</h3><br>
		- Fixed an issue with some tabs not went to when ArrowRight/ArrowLeft.<br>
		- Added a custom save.<br> 
		- Balanced until 15 tokens.<br>
		- Various additional bugfixes and wording amends.<br>
	<br><h3 style='color: #CC0000'>v1.113</h3><br>
		- Balanced until 10 tokens.<br>
		- Added an Oxygen science upgrade.<br>
		- Various milestone changes to autobuy science buyables.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.112</h3><br>
		- Balanced until 8 tokens.<br>
		- Various additional autobuyers added.<br>
		- Made science mini-notify if a buyable is affordable.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.111.1</h3><br>
		- Various fixes with extreme mode and bulk buying.<br>
		- Balanced until 4 tokens.<br>
		- Made extreme mode costs seperate.<br>
		- Fixed token effect displaying outside of extreme.<br>
		- Added an autobuyer to token milestone 3.<br>
	<br><h3 style='color: #CC0000'>v1.111</h3><br>
		- Balanced until 3 Tokens.<br>
		- Added a custom save.<br>
		- Added a couple autobuyers for science buyables.<br>
	<br><h3 style='color: #CC0000'>v1.110.1</h3><br>
		- Balanced until 2 Tokens.<br>
		- Added a Oxygen Science upgrade.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.110</h3><br>
		- Balanced extreme until one token.<br>
		- Fixed a bug with logistic currencies sometimes being negative.<br>
		- Added five Oxygen Science upgrades.<br>
		- Added six Oxygen Science buyables.<br>
		- Various cost changes.<br>
		- Carbon and Oxygen initial costs are higher.<br>
	<br><h3 style='color: #CC0000'>v1.109.1</h3><br>
		- Made various text the correct size.<br>
		- Balanced Oxygen up to maxing B11.<br>
	<br><h3 style='color: #CC0000'>v1.109</h3><br>
		- Balanced extreme until Carbon and Oxygen are unlocked.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.108</h3><br>
		- Added two custom saves.<br>
		- Made extreme mode not nerf B buyable costs.<br>
		- Added 6 Hydrogen Science upgrade.<br>
		- Added 2 Hydrogen Science buyables.<br>
		- Added 5 A minigame milestones.<br>
		- Made various costs cheaper and more expenive in extreme.<br>
		- Various word fixes (Hydrogen XI actually adds 1 to Violet base, not Hydrogen XII).<br>
		- Various small bug fixes.<br>
	<br><h3 style='color: #CC0000'>v1.107.1</h3><br>
		- Fixed a bug with Cell production.<br>
		- Added a custom save.<br>
		- Fixed various display issues.<br>
	<br><h3 style='color: #CC0000'>v1.107</h3><br>
		- Added a custom save.<br>
		- Fixed extreme mode description.<br>
		- Made milestones that are no unlocked not rewarded.<br>
		- Fixed a "feature" where clicking a layer brings you to the first subtab.<br>
		- Added 7 B Point milestones.<br>
		- Added a Hydrogen Science upgrade.<br>
		- Added a Hydrogen Science buyable.<br>
		- Various code cleanup.<br>
	<br><h3 style='color: #CC0000'>v1.106</h3><br>
		- Rollover, I guess.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.105.9</h3><br>
		- Organ milestone 5 makes Down Quarks not reset anymore (used to never reset).<br>
	<br><h3 style='color: #CC0000'>v1.105.8</h3><br>
		- Added two rows of achievements.<br>
		- Made bulking of Cell challenges not occur while in them.<br>
	<br><h3 style='color: #CC0000'>v1.105.7</h3><br>
		- Various code cleanup.<br>
		- Made a toggle for disabling milestone popups.<br>
		- Added a new file (<i>hotkeySupport.js</i>).<br>
	<br><h3 style='color: #CC0000'>v1.105.6</h3><br>
		- Various code cleanup.<br>
		- Removed 12 "new Decimal(0)"s to make the code a tiny bit faster.<br>
		- Made milestone popups not say "Requires:" anymore.<br>
	<br><h3 style='color: #CC0000'>v1.105.5</h3><br>
		- Made Organ milestones 2/3 permanently bulk buy Omnipotent/Totipotent.<br>
	<br><h3 style='color: #CC0000'>v1.105.4</h3><br>
		- Fixed Tokens II initial unlock still notifying the layer.<br>
	<br><h3 style='color: #CC0000'>v1.105.3</h3><br>
		- Made Organ milestone 4 also give minigame QoL.<br>
	<br><h3 style='color: #CC0000'>v1.105.2</h3><br>
		- Fixed a bug with Organ milestone 4 autobuyer.<br>
		- Fixed a bug with buying upgrades generally.<br>
	<br><h3 style='color: #CC0000'>v1.105.1</h3><br>
		- Fixed a longstanding bug that messes with Organ resetting.<br>
		- Made Tissue milestone 4 easier after Organ unlock.<br>
	<br><h3 style='color: #CC0000'>v1.105</h3><br>
		- Added two Organ milestones.<br>
		- Various code cleanup.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.104</h3><br>
		- Added a Organ milestone.<br>
		- Made Organ milestone 2 autobuy DNA upgrades.<br>
		- Made Organ upgrade 11 remove coins.<br>
	<br><h3 style='color: #CC0000'>v1.103</h3><br>
		- Implemented extreme mode's nerfs.<br>
		- Balanced until 3 Organs.<br>
		- Balanced extreme mode until minigame unlock.<br>
		- Added a custom save.<br>
		- Added the Labratory and Science.<br>
		- Added three Science upgrades.<br>
		- Added three Science buyables.<br>
		- Added Hydrogen Science.<br>
		- Added a backup font for most things.<br>
		- Fixed various display issue.<br>
	<br><h3 style='color: #CC0000'>v1.102</h3><br>
		- Disjointed hard and extreme mode.<br>
		- Removed some displays for hard mode.<br>
		- Various code cleanup.<br>
		- Improved mode selector display.<br>
	<br><h3 style='color: #CC0000'>v1.101.1</h3><br>
		- Added extreme mode.<br>
		- Implemented extreme mode nerfs.<br>	
	<br><h3 style='color: #CC0000'>v1.101</h3><br>
		- Added an Organ milestone.<br>
		- Cleaned up token cost function.<br>
		- Added easy mode.<br>
		- Various code cleanup.<br>
		- Added a mode switcher tab.<br>
	<br><h3 style='color: #CC0000'>v1.100</h3><br>
		- Added Organs.<br>
		- Added a Organ upgrade.<br>
		- Added a Organ milestone.<br>
		- Fixed an issue with layers un-deactivated-ing.<br>
		- Subtabs no longer notify when the tab is hidden.<br>
		- Fixed a bug with Cells being able to reset too early after some upgrades.<br>
		- Fixed a typo in Tissues XIX display.<br>
		- Fixed a typo with Tissue reset saying Cells.<br>
		- Token auto prestiging now uses autoPrestige, meaning it doesnt notify.<br>
		- Tokens now are cheaper when you are resetting "with" negative tokens.<br>
		- Added Micro.<br>
		- Added three Micro buyables.<br>
		- Added a custom save.<br>
<bdi style='color: #FFAAFF'>- Note that I now have plans for easy and (sorta) for extreme mode.</bdi><br>
	<br><h3 style='color: #CC0000'>v1.099</h3><br>
		- Added four Tissue upgrades.<br>
		- Added a second Tiertiary completion/reward.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.098</h3><br>
		- Added a custom save.<br>
		- Made it so you cannot buy upgrades of a disabled layer.<br>
		- Added two Cell upgrades.<br>
		- Added a Tissue upgrade.<br>
		- Removed Phosphorus and µ.<br>
		- Removed Life buyables.<br>
		- Removed some unnecessary code for a Life upgrade.<br>
		- Fixed the display for Amino Milestone 29 (ln(1+x) ~ x - .5x<sup>2</sup>).<br>
		- Made a clickable for the M<sub>C</sub> tab for jumping to Stem Cells.<br>
		- Fixed tetrational token cost display formula.<br>
		- Various code clearnup.<br>
	<br><h3 style='color: #CC0000'>v1.097.1</h3><br>
		- Fixed some issues with need respec not displaying.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.097</h3><br>
		- Added three Cell upgrades.<br>
		- Added a Cell challenge.<br>
		- Made the 's' hotkey work for Token II.<br>
	<br><h3 style='color: #CC0000'>v1.096</h3><br>
		- Capped Tissue milestone 18 at 1.5x.<br>
		- Added two Token buyables.<br>
		- Added two rows of achievements.<br>
		- Added a Tissue upgrade.<br>
		- Added a hotkey for going to Stem.<br>
	<br><h3 style='color: #CC0000'>v1.095</h3><br>
		- Added a Cell buyable.<br>
		- Added two Tissue upgrades.<br>
		- Added a Tissue milestone.<br>
	<br><h3 style='color: #CC0000'>v1.094</h3><br>
		- Added two Tissue upgrades.<br>
		- Cell challenges are now fully completeable.<br>
	<br><h3 style='color: #CC0000'>v1.093</h3><br>
		- Added a Cell upgrade.<br>
		- Added a row of achievements.<br>
		- 23 Token II is now possible.<br>
		- Added a custom save.<br>
		- You can now click and drag to buy upgrades.<br>
	<br><h3 style='color: #CC0000'>v1.092</h3><br>
		- Added two Tissue upgrades.<br>
		- 24/95 is now possible.<br>
	<br><h3 style='color: #CC0000'>v1.091.1</h3><br>
		- Added a custom save.<br>
		- Various bug fixes.<br>
	<br><h3 style='color: #CC0000'>v1.091</h3><br>
		- 22/95 is now possible.<br>
		- Added three Tissue upgrades.<br>
	<br><h3 style='color: #CC0000'>v1.090</h3><br>
		- 21/95 is now possible.<br>
		- Added a custom save.<br>
		- Added 9 Tissue upgrades.<br>
		- Added 2 Tissue milestones.<br>
		- Added a row of achievements.<br>
	<br><h3 style='color: #CC0000'>v1.089</h3><br>
		- Added a Tissue upgrades.<br>
		- Added a row of achievements.<br>
		- 19/83 is now possible.<br>
	<br><h3 style='color: #CC0000'>v1.088</h3><br>
		- Added five Cell upgrades.<br>
		- 18/82 is now possible.<br>
		- Added a digit of display for Tissue effect exponent.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.087</h3><br>	
		- 17/76 is now possible.<br>
		- Added a Cell upgrade.<br>
		- Added two Token buyables.<br>
	<br><h3 style='color: #CC0000'>v1.086</h3><br>	
		- 17/76 is now possible.<br>
		- Added a Cell upgrade.<br>
		- Fixed Token II notification.<br>
	<br><h3 style='color: #CC0000'>v1.085</h3><br>
		- Added a Cell upgrade.<br>
		- Added four Tissue milestones.<br>
		- Added a Token buyable.<br>
		- 17/75 is now possible.<br>
		- Added a custom save.<br>
		- Added a row of achievements.<br>
	<br><h3 style='color: #CC0000'>v1.084</h3><br>
		- Started adding Tokens II.<br>
		- Made Cell upgrade 42 remove a bunch of content/hide things.<br>
		- Added four Token buyables.<br>
		- Added a Token clickable.<br>
		- Added a new currency.<br>
		- Implemented new (display) formulas for Token II.<br>
		- 16/71 is now possible.<br>
	<br><h3 style='color: #CC0000'>v1.083</h3><br>
		- Added twelve Cell upgrades.<br>
		- Various small rewordings.<br>
		- Added a custom save.<br>
		- 16/70 is now possible.<br>
	<br><h3 style='color: #CC0000'>v1.082</h3><br>
		- Added a Cell upgrade.<br>
		- Added three Tissue upgrades.<br>
		- Added a Tissue milestone.<br>
		- 15/59 is now possible.<br>
		- Added a custom save.<br>
		- Fixed a bug with M<sub>C</sub> getting notified for Cell upgrades.<br>
		- Added a reshow endgame button.<br>
	<br><h3 style='color: #CC0000'>v1.081</h3><br>
		- 15/55 is now possible.<br>
		- Added a Tissue upgrade.<br>
		- Added two Tissue milestones.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.080</h3><br>
		- 14/52 is now possible.<br>
		- Added a Tissue upgrade.<br>
	<br><h3 style='color: #CC0000'>v1.079</h3><br>
		- 14/51 is now possible.<br>
		- Added two Tissue upgrades.<br>
		- Made µ use autoPrestige and not the manual version so its not prestige-notified.<br>
		- Fixed a bug with t92.<br>
	<br><h3 style='color: #CC0000'>v1.078</h3><br>
		- 14/49 is now possible.<br>
		- Added a Custom save.<br>
		- Added two Tissue upgrades.<br>
		- Fixed Deuterium X not notifying you that you need to respec tokens.<br>
		- Made Customizable's details for changing the challenge correct.<br>
	<br><h3 style='color: #CC0000'>v1.077</h3><br>
		- 14/47 is now possible.<br>
		- Added a Tissue upgrade.<br>
		- Added a Tissue milestone.<br>
	<br><h3 style='color: #CC0000'>v1.076</h3><br>
		- Added a custom save.<br>
		- Added three Tissue milestones.<br>
		- 13/45 is now possible.<br>
	<br><h3 style='color: #CC0000'>v1.075</h3><br>
		- 13/42 is now possible.<br>
		- Added two Tissue upgrades.<br>
		- Added a Tissue milestone.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.074</h3><br>
		- Added a custom save.<br>
		- Added a Tissue upgrade.<br>
		- Added a Tissue milestone.<br>
	<br><h3 style='color: #CC0000'>v1.073</h3><br>
		- Added three Tissue upgrades.<br>
		- Added a Tissue milestone.<br>
		- 11/37 is now possible.<br>
		- Fixed Tissue/token hotkeys.<br>
		- Cleaned up the Life challenges tab.<br>
	<br><h3 style='color: #CC0000'>v1.072</h3><br>
		- Added a Cell buyable.<br>
		- Added two Tissue uprgades.<br>
		- You can now complete Secondary 34 times.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.071</h3><br>
		- Added seven Tissue upgrades.<br>
		- You can now complete Secondary 31 times.<br>
		- <i>Tokens tooltip now says if you need to respec</i>.<br>
		- Tokens tooltip now says synced amount once you have unlocked Amino.<br>
		- Made achievement amounts use commas.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.070</h3><br>
		- Added two rows of achievements.<br>
		- Added a custom save.<br>
		- Added a Life challenge.<br>
		- Added three Tissue milestones.<br>
		- Changed Tissue gain formula.<br> 
		- Tissue II and Tissue V now have an additional effect.<br>
		- Tissue XXII requirement is easier.<br>
		- Mu II effects are now at least 1.<br>
		- Note endgame.<br>
	<br><h3 style='color: #CC0000'>v1.069</h3><br>
		- Endgame is 10 Tissue resets.<br>
		- Added two custom saves.<br>
		- Made it clearer how to import custom saves.<br>
		- Buffed Tissue XXV.<br>
		- Fixed some bugs with Mu II.<br>
		- Made M<sup>C</sup> be notified and Cells not notified when applicable.<br>
	<br><h3 style='color: #CC0000'>v1.068</h3><br>
		- Tissues now displays stuff.<br>
		- Endgame is 7 Tissue resets.<br>
		- Added a Tissue milestone.<br>
	<br><h3 style='color: #CC0000'>v1.067.1</h3><br>
		- Minigame tab is no longer highlighted when D isn't unlocked.<br>
		- Fixed the hotkey titles showing up with nothing in them.<br>
		- Oxygen IV is cheaper.<br>
		- Various spelling and small display fixes.<br>
	<br><h3 style='color: #CC0000'>v1.067</h3><br>
		- Added a custom save.<br>
		- Added a Tissue milestone.<br>
		- Gave M<sub>C</sub> a tooltip of Stem Cell amount.<br>
		- Changed Tissue XXII requirement.<br>
		- Endgame is now 4 tissue resets, please don't go past that.<br>
	<br><h3 style='color: #CC0000'>v1.066.1</h3><br>
		- Fixed the display of Tissue gain formula.<br>
		- Gave Tissue milestone 1 another two effects.<br>
		- Made Tissue reset require 25 Secondary completions.<br>
		- Gave row five upgrades a requirement.<br> 
	<br><h3 style='color: #CC0000'>v1.066</h3><br>
		- Merged TMT version 2.6.5.1<br>
		- Fixed a bug with pasuing.<br>
		- Added a custom save.<br>
		- Fixed a big bug with Carbon IV.<br>
		- Cell milestone 21 is buffed.<br>
		- Fixed cell milestone 9.<br>
		- Added Tissues.<br>
		- Added 25 Tissue upgrades.<br>
		- Fixed a bunch of bugs I created while making this patch :).<br>
	<br><h3 style='color: #CC0000'>v1.065.1</h3><br>
		- Added a Kappa upgrade.<br>
		- Added an Iota upgrade.<br>
		- Fixed a spelling error with C85 Gems.<br>
		- Made a pg-settings button.<br>
		- Fixed a bug with not buying Iota buyables.<br>
		- Made Stem now be notified when you can complete a challenge/buy a new buyable.<br>
	<br><h3 style='color: #CC0000'>v1.065</h3><br>
		- Added a Mu upgrade.<br>
		- Added a Lambda upgrade.<br>
		- Added four Cell milestones.<br>
		- You can now complete Secondary 25 times.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.064</h3><br>
		- Added two Life challenges.<br>
		- You can now complete Secondary 21 times.<br>
		- Added three rows of achievements.<br>
		- Added a custom save.<br>
		- Added two Cell milestones.<br>
		- Removed some proteins displays once they are unnecessary/unhelpful.<br>
	<br><h3 style='color: #CC0000'>v1.063</h3><br>
		- Added five Cell milestones.<br>
		- You can now complete Secondary 18 times.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.062</h3><br>
		- Added three Cell milestones.<br>
		- Added a custom save.<br>
		- Added eight rows of achievements.<br>
		- You can now complete Secondary 14 times.<br>
	<br><h3 style='color: #CC0000'>v1.061</h3><br>
		- Added a custom save.<br> 
		- Added four Cell milestones.<br>
	<br><h3 style='color: #CC0000'>v1.060</h3><br>
		- Added eight Cell milestones.<br>
		- Added a custom save.<br>
		- Added two rows of achievements.<br>
	<br><h3 style='color: #CC0000'>v1.059</h3><br>
		- Added six rows of achievements.<br>
		- Changed another row of achievements to be easier.<br>
		- Added two Cell milestones.<br>
		- Added a Cell challenge.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.058</h3><br>
		- Added 2 Cell milestones.<br>
		- Improved Iota IV.<br>
		- Primary is now completeable.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.057</h3><br>
		- Added 3 Cell milestones.<br>
	<br><h3 style='color: #CC0000'>v1.056</h3><br>
		- Added 8 Cell milestones.<br>
		- Added a custom save.<br>
		- Added a new layer.<br>
	<br><h3 style='color: #CC0000'>v1.055</h3><br>
		- Added a Cell upgrade.<br>
		- Added 9 Cell milestones.<br>
		- Added a Cell challenge.<br>
		- Added subtabs for Stem Cells.<br>
		- Various wording fixes.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.054</h3><br>
		- Added an Iota upgrade.<br>
		- Added a Kappa upgrade.<br>
		- Added a Stem Cell buyable.<br>
		- Added a custom save.<br>
		- Made paused status keep upon reloading.<br>
	<br><h3 style='color: #CC0000'>v1.053</h3><br>
		- Added Stem Cells!<br>
		- Added a Stem Cell buyable.<br>
		- Made tmp not update deactivated layers.<br>
		- Added a custom save.<br>
		- Added a Lambda upgrade.<br>
		- Added a Cell upgrade.<br>
		- Added a Mu upgrade.<br>
		- Added a Cell milestone.<br>
	<br><h3 style='color: #CC0000'>v1.052.1</h3><br>
		- Fixed a display buf with dilation challenge.<br>
	<br><h3 style='color: #CC0000'>v1.052</h3><br>
		- Added a Mu upgrade.<br>
		- Added a Mu buyable.<br>
	<br><h3 style='color: #CC0000'>v1.051</h3><br>
		- Added a Cell milestone.<br>
	<br><h3 style='color: #CC0000'>v1.050</h3><br>
		- Added a Kappa upgrade.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.049</h3><br>
		- Added a lambda upgrade.<br>
		- Fixed a couple of typos.<br>
	<br><h3 style='color: #CC0000'>v1.048</h3><br>
		- Added a Cell upgrade.<br>
		- Added an Iota upgrade.<br>
		- Added a Cell milestone.<br>
	<br><h3 style='color: #CC0000'>v1.047</h3><br>
		- Added a Mu upgrade.<br>
		- Endgame is about 2e7/e15/e23/e49.<br>
	<br><h3 style='color: #CC0000'>v1.046.1</h3><br>
		- Fixed a bug with Phosphorus reset.<br>
	<br><h3 style='color: #CC0000'>v1.046</h3><br>
		- Added a way to pause the game.<br>
		- Can be used for speedrunning or by mobile players.<br>
		- Added a hotkey (space) for (un)pausing the game if a toggle is on.<br>
		- Added displays for when the game is paused.<br>
		- Added Iota.<br>
		- Added three Iota buyables.<br>
		- Added two Iota upgrades, a Kappa upgrade and a Lambda upgrade.<br>
		- Note: Endgame is about e6/e8/e12/e47.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.045</h3><br>
		- Added Lambda.<br>
		- Added Kappa.<br>
	<br><h3 style='color: #CC0000'>v1.044</h3><br>
		- Fixed later Life challenges.<br>
		- Ugh .gt(1e4) :(.<br>
	<br><h3 style='color: #CC0000'>v1.043</h3><br>
		- Added a Life challenge.<br>
		- "Added" four minigames.<br>
		- Added the displays for all the minigames.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.042.1</h3><br>
		- Added a custom save.<br>
		- Made it so people who are hacking/not following rules can still progress.<br>
	<br><h3 style='color: #CC0000'>v1.042</h3><br>
		- Added an Life challenge.<br>
		- Spent far too long coding up its reward.<br>
		- Added two custom saves.<br>
		- In a previous patch made Protein (given its >0) part of the Amino Acid display.<br>
		- Also added a total tokens display (i.e. 4/79 tokens).<br>
	<br><h3 style='color: #CC0000'>v1.041</h3><br>
		- Added two Life challenges.<br>
		- Added two Cell milestones.<br>
		- Fixed formatting for numbers <.001 <br>
	<br><h3 style='color: #CC0000'>v1.040</h3><br>
		- Added a hotkey for entering customizable (v).<br>
		- Added three Cell milestones.<br>
		- Added an effect to Cell milestone 1.<br>
		- Buffed an effect of Cell milestone 3.<br>
		- Added two rows of achievements.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.039.2</h3><br>
		- Fixed said row of achievements.<br>
		- Made Amino Acid display protein amount if its unlocked.<br>
		- Changed Cell formula from logarithmic to exponential.<br>
		- Made upgrades and milestones keep from the start.<br>
	<br><h3 style='color: #CC0000'>v1.039.1</h3><br>
		- Added a row of achievements.<br>
	<br><h3 style='color: #CC0000'>v1.039</h3><br>
		- Added two Cell milestones.<br>
		- Added two custom saves.<br>
		- Changed Cell milestone 1 permanently to actually be permanent.<br>
	<br><h3 style='color: #CC0000'>v1.038.1</h3><br>
		- Redid hotkey setup.<br>
		- Hotkeys are now organized by function, with headings.<br>
		- Please do not go past endgame and if you do, import a save from the bank upon the new update!<br>
	<br><h3 style='color: #CC0000'>v1.038</h3><br>
		- Added a DNA upgrade.<br>
		- Added a new layer, Cells!<br>
		- Added a Cell milestone.<br>
		- Added a Cell upgrade.<br>
		- Made Anti-Omega properly reduce Life requiremenet.<br>
		- Darkened the background color of maxed life challenges.<br>
		- Made the text highlight red of maxed, selected life challenges.<br>
		- Made DNA current formula not display -- when it should display -.<br>
		- Added two custom saves.<br>
	<br><h3 style='color: #CC0000'>v1.037.1</h3><br>
		- Added five rows of achievements.<br>
		- Made the achievement clickables displays for shift always active.<br>
		- Made it a bit clearer how to use the save bank.<br>
		- Changed the background color of active life challenge.<br>
		- Changed the background color when you have maxed out given gem effect.<br>
	<br><h3 style='color: #CC0000'>v1.037</h3><br>
		- Added an Easter Egg.<br>
		- Hint 1: It has to do with a game I like.<br>
		- Hint 2: It has to do with a number whose largest prime factor is 23.<br>
		- Note: Don't tell me unless BOTH hints are satisfied and you know why.<br>
		- Added two custom saves.<br>
		- Added five DNA upgrades.<br>
		- Added C84, C85, C86, C87, and C88 gems.<br>
		- Made N → Δµ's formula display accurate.<br>
		- Next up is a new layer, probably Cells.<br>
	<br><h3 style='color: #CC0000'>v1.036</h3><br>
		- Added 6 DNA milestones.<br>
		- Added C18, C28, C38, C48, C58, C68, C81, C78, C82, and C83 gems.<br>
		- Added a display for Dilation effect.<br>
		- Implemented challenge 8.<br>
		- Note: C84 is made intentionally harder to prevent progression past intention.<br>
	<br><h3 style='color: #CC0000'>v1.035</h3><br>
		- Say in #pg-trees that "I know" if you see this, but don't explain yourself.<br>
		- Added two Life challenges.<br>
		- Added a DNA upgrade.<br>
		- Added four DNA milestones.<br>
		- Added C57, C67, C71, C72, C73, C74, C75, C76, and C77 gems.<br>
		- Made autobuying of Life buyables better eventually.<br>
		- Changed C7 for >1 depth.<br>
		- Added a custom save.<br>
		- Renamed other custom saves.<br>
	<br><h3 style='color: #CC0000'>v1.034.1</h3><br>
		- Added a row of achievements.<br>
		- Fixed some spelling issues.<br>
	<br><h3 style='color: #CC0000'>v1.034</h3><br>
		- Added two Life challenges.<br>
		- Implemented challenge 7.<br>
		- Fixed wording of DNA milestone 15.<br>
		- Added three DNA milestones.<br>
		- Added effects to C17, C27, C37, and C47 gems.<br>
		- Added a custom save.<br>
		- Reached 100 saves in the save bank!<br>
		- Cleaned up getPointExponentiation() .<br>
	<br><h3 style='color: #CC0000'>v1.033</h3><br>
		- Gave anti-omega another effect.<br>
		- Added two Life challenges.<br>
		- Added two DNA upgrade.<br>
		- Added a DNA milestone.<br>
		- Added a custom save.<br>
		- Made formatting numbers << 1 better.<br>
	<br><h3 style='color: #CC0000'>v1.032</h3><br>
		- Improved the display of effects (Life and Phosphorus).<br>
		- Added a Life challenge.<br>
		- Made it possible to token reset once anti-hydrogen is completed.<br>
		- Made tokens past the initial 87 fixed costs log10^7 times cheaper.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.031.1</h3><br>
		- Added a DNA upgrade.<br>
		- Added a life challenge.<br>
		- Fixed a bug with l42's goal.<br>
		- Added a display for next protein buyable.<br>
		- Fixed a bug with anti-nitrogen zeroing your Phosphorus gain.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.031</h3><br>
		- Added two DNA upgrades.<br>
		- Added two rows of achievements.<br>
		- Added C56 and C66 gem effects.<br>
		- Added a custom save.<br>
		- Added a Life challenge.<br>
	<br><h3 style='color: #CC0000'>v1.030</h3><br>
		- Added a DNA upgrade.<br>
		- Added a DNA milestone.<br>
		- Cleaned up the point gain function.<br>
		- Added a row of achievements.<br>
		- Added a custom save.<br>
		- Fixed a bug with deactivated layers giving milestones.<br>
		- Added C56, C61, C62, C63, and C64.<br>
		- Nerfed C6 with more than one C6 depth.<br>
	<br><h3 style='color: #CC0000'>v1.029</h3><br>
		- Added a DNA milestone.<br>
		- Added four Life challenges.<br>
		- Added a custom save.<br>
		- Finally fixed hotkeys.<br>
	<br><h3 style='color: #CC0000'>v1.028</h3><br>
		- Added a DNA milestone.<br>
		- Added C36 and C46 gem effects.<br>
		- Added a display for shRNA's boost to Amino Acid which in turn boosts protein.<br>
		- Removed some of Customizable's displays after A:m13.<br>
	<br><h3 style='color: #CC0000'>v1.027</h3><br>
		- Added a DNA upgrade.<br>
		- Added 2 DNA milestones.<br>
		- Added C16 and C26 gem effects.<br>
		- Added challenge 6.<br>
		- Added a custom save.<br>
		- Fixed a bug with large times.<br>
	<br><h3 style='color: #CC0000'>v1.026.1</h3><br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.026</h3><br>
		- Added two rows of achievements.<br>
		- Added a custom save.<br>
		- Hardcapped gems at 10,000.<br>
		- Added the ultimate effect to DNA milestone 3.<br>
		- Added four DNA milestones.<br>
		- Improved various wordings.<br>
		- Note: cotent includes anything that can or does changes how one plays.<br>
		- Improved one of the error displays error message.<br>
	<br><h3 style='color: #CC0000'>v1.025.4</h3><br>
		- Added a DNA milestone.<br>
		- Reduced the DNA boost to Amino Acid gain.<br>
	<br><h3 style='color: #CC0000'>v1.025.3</h3><br>
		- Added a DNA milestone.<br>
		- Added a display for milestone numbers.<br>
	<br><h3 style='color: #CC0000'>v1.025.2</h3><br>
		- Added a DNA milestone.<br>
		- Made Life not light up when you have passive gain from Customizable.<br>
	<br><h3 style='color: #CC0000'>v1.025.1</h3><br>
		- Marged v2.6.4.3 of TMT.<br>
		- Default font is now Inconsolata.<br>
		- Fixed some things being 0 cause division by zero.<br>
	<br><h3 style='color: #CC0000'>v1.025</h3><br>
		- Added a DNA milestone.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.024</h3><br>
		- Added a DNA milestone.<br>
		- Added a custom save.<br>
		- Fixed a couple typos.<br>
	<br><h3 style='color: #CC0000'>v1.023</h3><br>
		- Added DNA.<br>
		- Added a DNA milestone.<br>
		- Added a DNA upgrade.<br>
		- Added a µs display.<br>
	<br><h3 style='color: #CC0000'>v1.022</h3><br>
		- Added 10 Amino Acid upgrades.<br>
		- Added 8 Amino Acid milestones.<br>
		- Added two saves to the bank.<br>
		- Improved time display for very very small times.<br>
		- Achievement text fixes.<br>
	<br><h3 style='color: #CC0000'>v1.021.2</h3><br>
		- Fixed undulating colors, and automated it.<br>
	<br><h3 style='color: #CC0000'>v1.021.1</h3><br>
		- Improved info of Amino Acid page.<br>
		- Added displays for each buyable's boost.<br>
		- Added display from each upgrade.<br>
		- Added <i>colors</i>.<br>
		- Removed an extra line from many milestones.<br>
	<br><h3 style='color: #CC0000'>v1.021</h3><br>
		- Added seven (7!) rows of achievements.<br>
		- Added two Amino milestone.<br>
		- Added a protein buyable.<br>
	<br><h3 style='color: #CC0000'>v1.020.1</h3><br>
		- Added two custom saves.<br>
		- Added ms display for formatTime.<br>
		- Added stuff to the Amino info tab.<br>
	<br><h3 style='color: #CC0000'>v1.020</h3><br>
		- Added three Amino upgrades.<br>
		- Added seven Amino milestones.<br>
		- Added a protein buyable.<br>
	<br><h3 style='color: #CC0000'>v1.019</h3><br>
		- Fixed a bug in b_e and got patashu to fix it!<br>
		- Added two custom saves.<br>
		- Made hardmode nerf protein gain.<br>
		- Added C54 and C55 rewards.<br>
		- Added six Amino milestones.<br>
	<br><h3 style='color: #CC0000'>v1.018</h3><br>
		- Added 3 Amino milestones.<br>
		- Added 2 Amino upgrades.<br>
		- Added a protein buyable.<br>
		- Implemented 5 challenges.<br>
		- Nerfed C5 at >1 depth.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.017</h3><br>
		- Implemented C5.<br>
		- Gave C15 and C25 rewards.<br>
		- Added 15 Amino upgrades.<br>
		- Added protein.<br>
		- Added 4 Amino buyables (as a part of protein).<br>
		- Added 3 Amino milestones.<br>
		- Added two saves to the bank.<br>
	<br><h3 style='color: #CC0000'>v1.016</h3><br>
		- Added a C43 reward.<br>
		- Added a Life milestone.<br>
	<br><h3 style='color: #CC0000'>v1.015.1</h3><br>
		- Added a Life milestone.<br>
		- Added C41 and C42 rewards.<br>
		- Made C43 possible.<br>
		- As Nyan Cat would say, RTFSC (<i>p</i><sub>25</sub>?).<br>
	<br><h3 style='color: #CC0000'>v1.015</h3><br>
		- Added an effect to Life milestone 30.<br>
		- Added three Amino milestones.<br>
		- Added effects to C24 and C34.<br>
		- Made C41 completeable (I think).<br>
		- I have surpassed 1MB of data in layers.js, at over 1,033,000 characters in that file alone.<br>
	<br><h3 style='color: #CC0000'>v1.014.1</h3><br>
		- Added two Amino Acid milestones.<br>
		- Made C14 completeable and gave it a reward.<br>
		- Made C24 completeable.<br>
		- Made C4 tougher.<br>
	<br><h3 style='color: #CC0000'>v1.014</h3><br>
		- Added a Amino Acid milestone.<br>
		- Added C4.<br>
	<br><h3 style='color: #CC0000'>v1.013.1</h3><br>
		- Added a save to the bank.<br>
	<br><h3 style='color: #CC0000'>v1.013</h3><br>
		- Added ten Amino Acid milestones.<br>
	<br><h3 style='color: #CC0000'>v1.012</h3><br>
		- Properly added the rest of the achievement row.<br>
		- Fixed a bug where having 0 E Points caused you to not have D Point production.<br>
		- Made tokens cost more if you can actively afford less than the set amount.<br>
		- Added a new layer, Amino Acids.<br>
		- Added two Amino Acid milestones.<br>
	<br><h3 style='color: #CC0000'>v1.011.2</h3><br>
		- Added a save to the bank.<br>
	<br><h3 style='color: #CC0000'>v1.011.1</h3><br>
		- Merged v2.6.1 of TMT.<br>
	<br><h3 style='color: #CC0000'>v1.011</h3><br>
		- "Added" a row of achievements.<br>
		- Gave C33 a reward.<br>
		- Added four Life milestones.<br>
	<br><h3 style='color: #CC0000'>v1.010</h3><br>
		- Added a Life milestone.<br>
		- Gave C31 and C32 a reward.<br>
		- Made C3 more stringent.<br>
		- Fixed a couple wording issues.<br>
	<br><h3 style='color: #CC0000'>v1.009</h3><br>
		- Gave C13/23 rewards.<br>
		- Made C23 completeable.<br>
		- Nerfed Life milestone 13 in hard.<br>
		- Slightly buffed Life milestone 36.<br>
		- Added a new Life milestones.<br>
		- Fixed milestone titles.<br>
		- Addded a save to the bank.<br>
	<br><h3 style='color: #CC0000'>v1.008.6</h3><br>
		- A couple small balance changes.<br>
		- Fixed some bugs with tokens being zero.<br>
	<br><h3 style='color: #CC0000'>v1.008.5</h3><br>
		- Made some checks to only run format when necessary.<br>
		- Gave C22 Gems an effect.<br>
		- Added a row of achievements.<br>
		- Added a save to the bank.<br>
		- Note: I haven't gotten to a C13 gem, but I am close so it should be possible.<br>
	<br><h3 style='color: #CC0000'>v1.008.4</h3><br>
		- Allowed C22 to be completeable.<br>
		- Implemented C21 reward.<br>
		- Next up is C22 reward.<br>
	<br><h3 style='color: #CC0000'>v1.008.3</h3><br>
		- Added two Life milestones.<br>
		- Made C12 and C21 completeable.<br>
		- Gave C21 a tentative effect [not implement though].<br>
	<br><h3 style='color: #CC0000'>v1.008.2</h3><br>
		- Merged v2.6 of TMT.<br>
	<br><h3 style='color: #CC0000'>v1.008.1</h3><br>
		- Implemented challenge 2.<br>
		- Made the first 2x2 square possible.<br>
	<br><h3 style='color: #CC0000'>v1.008</h3><br>
		- Info tab improvement in Life.<br>
		- Added my first grid!<br>
		- Added another Life challenge.<br>
		- Improved minigame highlighting.<br>
	<br><h3 style='color: #CC0000'>v1.007</h3><br>
		- Added a save to the bank.<br>
		- Dilation is now fully completeable.<br>
		- Added three Phosphorus upgrades.<br>
		- Added nine Life milestones.<br>
		- Added two Life buyables.<br>
		- Added a display for current Life gain formula.<br>
	<br><h3 style='color: #CC0000'>v1.006</h3><br>
		- Added a Life milestone.<br>
		- Added two Phosphorus upgrades.<br>
	<br><h3 style='color: #CC0000'>v1.005.1</h3><br>
		- Added a Life buyable.<br>
		- Added a Phosphorus upgrade.<br>
	<br><h3 style='color: #CC0000'>v1.004</h3><br>
		- Added four Phosphorus upgrades.<br>
		- Added nine µ upgrades.<br>
		- Added five Life milestones.<br>
		- Added five Life buyables.<br>
		- Changed µ V text.<br>
		- Added four rows of achievements.<br>
		- Added a save to the bank.<br>
		- The 2.7e12 Life milestone now has an effect.<br>
		- Added a base gain/gain exp display in info tab (for Life) after they are relavent.<br>
		- Made the mspt display red when over 50 mspt.<br>
	<br><h3 style='color: #CC0000'>v1.003</h3><br>
		- Added a µ upgrade.<br>
		- Added a Life milestone.<br>
		- Added a custom save.<br>
		- Small spelling fixes.<br>
		- Added an explanation for how dilation works [go play AD y'all].<br>
	<br><h3 style='color: #CC0000'>v1.002</h3><br>
		- Added two Life milestones.<br>
		- Added a Life buyable.<br>
	<br><h3 style='color: #CC0000'>v1.001.2</h3><br>
		- Added a Life milestone.<br>
		- Next up is a Life buyable.<br>
	<br><h3 style='color: #CC0000'>v1.001.1</h3><br>
		- Added two rows of achievements.<br>
	<br><h3 style='color: #CC0000'>v1.001</h3><br>
		- Added 2 µ buyables.<br>
		- Added 14 Life milestones.<br>
		- Added a Life challenge.<br>
		- Added a custom save.<br>
	<br><h3 style='color: #CC0000'>v1.000</h3><br>
		- Added Life, the beginning of phase 2.<br>
	<br><h3 style='color: #CC0000'>v0.064</h3><br>
		- Finished phase 1!<br>
		- Next patch will be v1 with balancing!<br>
		- Added two Phosphorus upgrades.<br>
		- Added ten µ upgrades.<br>
		- Added nine µ milestones.<br>
		- Added seven µ buyables.<br>
		- Made E point recursion simulated after 5 iterations.<br>
	<br><h3 style='color: #CC0000'>v0.063</h3><br>
		- Added 4 µ upgrades.<br>
		- Added 2 µ milestones.<br>
		- Added an E Point buyable.<br>
		- Added three Phosphorus upgrades.<br>
		- Added a save to the bank.<br>
	<br><h3 style='color: #CC0000'>v0.062</h3><br>
		- Added µ (new layer).<br>
		- Added two rows of achievements.<br>
		- Added a save to the bank.<br>
		- Added two mu milestones.<br>
		- Added a mu upgrade.<br>
		- Guess why I chose to name it µ and get your name in the game (again possibly)!<br>
	<br><h3 style='color: #CC0000'>v0.061</h3><br>
		- Added two Phosphorus upgrades.<br>
	<br><h3 style='color: #CC0000'>v0.060</h3><br>
		- Wording fixes.<br>
		- Added four Phosphorus upgrades.<br>
		- Fixed mspt display.<br>
	<br><h3 style='color: #CC0000'>v0.059</h3><br>
		- Wording fixes.<br>
		- Implemented 2e10 Phosphorus milestone.<br>
		- Removed some unnecessary stuff after 1ee6 fuel.<br>
	<br><h3 style='color: #CC0000'>v0.058.2</h3><br>
		- Added a save to the save bank.<br>
		- Updated endgame.<br>
	<br><h3 style='color: #CC0000'>v0.058.1</h3><br>
		- So my brain exploded three times, I had to be revived, thanks doc!<br>
		- Fixed the jumping production bug<br>
		(Dinner didn't add to total Nitrogen, which Nitrogen's effect is based on)<br>
		- Added 4 Phosphorus milestones.<br>
		- Added two Phosphorus upgrades.<br>
		- Misc QoL changes.<br>
	<br><h3 style='color: #CC0000'>v0.058</h3><br>
		- My brain will explode... idk man.<br>
	<br><h3 style='color: #CC0000'>v0.057</h3><br>
		- Added Phosphorus (P).<br>
		- Improved notification for side-layers.<br>
		- Added a D Point buyable.<br>
		- Added a Phosphorus upgrade.<br>
		- Added five Phosphorus milestones.<br>
		- Added two saves to the bank.<br>
		- Hotfixed a couple of bugs, not sure if it actually works tho.<br>
	<br><h3 style='color: #CC0000'>v0.056.1</h3><br>
		- Added a mspt display.<br>
		- Cleaned up a bit of code, and created some error catchers.<br>
	<br><h3 style='color: #CC0000'>v0.056</h3><br>
		- Merged v2.5.9.2 of TMT.<br>
	<br><h3 style='color: #CC0000'>v0.055</h3><br>
		- Added 3 D Point upgrades.<br>
	<br><h3 style='color: #CC0000'>v0.054</h3><br>
		- Added a nitrogen milestone.<br>
	<br><h3 style='color: #CC0000'>v0.053</h3><br>
		- Added two E Point buyables.<br>
		- Added a Oxygen upgrade.<br>
		- Added two Carbon upgrades.<br>
		- Added a save to the bank.<br>
		- Buffed Oxygen XII and nerfed Nitrogen XV.<br>
	<br><h3 style='color: #CC0000'>v0.052</h3><br>
		- Added a D Point buyable.<br>
		- Added two Oxygen upgrades.<br>
		- Added two Carbon upgrades.<br>
		- Added two saves to the bank.<br>
		- Rebalanced until endgame.<br>
	<br><h3 style='color: #CC0000'>v0.051</h3><br>
		- Added a E Point buyable.<br>
		- Added a Nitrogen milestone.<br>
		- Added three Nitrogen upgrades.<br>
		- Added a save to the bank.<br>
		- Fixed Nitrogen XVIII cost.<br>
	<br><h3 style='color: #CC0000'>v0.050.1</h3><br>
		- Added two E Point buyables.<br>
		- Improved number formatting.<br>
		- Added a save to the bank.<br>
		- Made sure that v.050 content was all pushed.<br>
	<br><h3 style='color: #CC0000'>v0.050</h3><br>
		- Finally more content!<br>
		- Added 5 Nitrogen upgrades.<br>
		- Added a E Point buyable.<br>
		- Make blue a 10 times larger but effect 10x smaller (no net change).<br>
		- As always, added some saves into the bank (3).<br>
	<br><h3 style='color: #CC0000'>v0.049.2</h3><br>
		- Added all the saves from my pastebin.<br>
	<br><h3 style='color: #CC0000'>v0.049.1</h3><br>
		- Fixed hotkey display with mini hotkeys.<br>
		- Added custom saves (only 1 right now).<br>
		- Improved the info tab.<br>
		- Added in player.dev.autobuytokens and player.dev.aPointMult etc.<br>
	<br><h3 style='color: #CC0000'>v0.049</h3><br>
		- Rebalanced until Nitrogen.<br>
	<br><h3 style='color: #CC0000'>v0.048</h3><br>
		- Rebalanced until e20k C Points.<br>
		- Made tokens layer notify you when you can afford all 18 buyables.<br>
		- Added player.dev.cPointMult and player.dev.fastCorn <br>
	<br><h3 style='color: #CC0000'>v0.047</h3><br>
		- Added a E buyable.<br>
		- Added a Nitrogen upgrade.<br>
	<br><h3 style='color: #CC0000'>v0.046</h3><br>
		- Added 2 E buyables.<br>
		- Added a Nitrogen upgrade.<br>
		- Improved E Point (shift on) display.<br>
		- Now shows the value from f^n(0) as well as specifying the exponent better.<br>
	<br><h3 style='color: #CC0000'>v0.045</h3><br>
		- Added 3 E buyables.<br>
		- Nerfed iteration cost.<br>
	<br><h3 style='color: #CC0000'>v0.044.2</h3><br>
		- Rebalanced up to 16 tokens.<br>
	<br><h3 style='color: #CC0000'>v0.044.1</h3><br>
		- Changed display to not show digits after the decimal point between 1e6 and 1e9.<br>
		- Early game cost reductions (basically everything pre minigames is 2x cheaper).<br>
		- Reduce the first token cost.<br>
		- Increase the cost of B33 (by e1000x), reduced orange cost by 10x.<br>
		- Minigame tooltip now displays minigame points.<br>
		- Added control+shift+s to save.<br>
		- Fixed error console message.<br>
		- Added a couple of empty lines under hotkeys to reduce clutter.<br>
		- Changed reset for Nitrogen hotkey.<br>
		- Made log10(9+log10(10+B Points)) multiply color production (to make B->A more playable).<br>
		- A Point gain formula display improvement.<br>
		- Reduce fourteen goal in hard mode.<br>
		- Made the first purchase of B buyables not automatic.<br>
	<br><h3 style='color: #CC0000'>v0.044</h3><br>
		- Added 2 D Point upgrades.<br>
		- Added a D Point buyable.<br>
		- Added 3 Nitrogen upgrades.<br>
		- Added E minigame.<br>
		- Added an E Point buyables.<br>
		- Buffed supper to include making buyables not cost anything.<br>
		- Made all uses of format run only if it is being displayed.<br>
		- Display one more digit on currencies.<br>
	<br><h3 style='color: #CC0000'>v0.043</h3><br>
		- Added 3 D Point upgrades.<br>
		- Added 2 D Point buyables.<br>
		- Added 2 Nitrogen challenges.<br>
		- Fixed some bugs with not having all C Point upgrades.<br>
		- Improved the fuel display with colors and information.<br>
		- Added a row of achievements.<br>
		- Code was cleaned up.<br>
	<br><h3 style='color: #CC0000'>v0.042</h3><br>
		- Added 3 D Point upgrades.<br>
		- Added a D Point buyable.<br>
	<br><h3 style='color: #CC0000'>v0.041</h3><br>
		- Added 4 D Point upgrades.<br>
		- Added 4 D Point buyables.<br>
		- Changed formatting slightly from ee9 to ee10.<br>
		- Made D buyables not display on the C buyables tab.<br>
	<br><h3 style='color: #CC0000'>v0.040</h3><br>
		- Added 2 D Point upgrades.<br>
		- Added 2 D Point buyables.<br>
		- Made fourteen completeable in hard mode.<br>
	<br><h3 style='color: #CC0000'>v0.039</h3><br>
		- Added 3 D Point upgrades.<br>
		- Added 6 D Point buyables.<br>
	<br><h3 style='color: #CC0000'>v0.038</h3><br>
		- Fixed up the nitrogen challenge display.<br>
		- Added a challenge and gave Fourteen a reward.<br>
	<br><h3 style='color: #CC0000'>v0.037</h3><br>
		- Added two nitrogen challenges.<br>
		- Added two nitrogen milestones.<br>
		- Added two nitrogen upgrades.<br>
		- Fixed a mini-bug in break_eternity.js<br>
	<br><h3 style='color: #CC0000'>v0.036</h3><br>
		- Added three nitrogen challenges.<br>
		- Hard mode resets more stuff during nitrogen challenges, and might make some of them unplayable, hmu.<br>
		- Added two nitrogen milestones.<br>
		- Added a row of achievements.<br>
	<br><h3 style='color: #CC0000'>v0.035</h3><br>
		- Added two nitrogen upgrades.<br>
		- Added two oxygen upgrades.<br>
		- Added a carbon upgrade.<br>
	<br><h3 style='color: #CC0000'>v0.034</h3><br>
		- Added two nitrogen upgrades.<br>
		- Added six nitrogen milestones.<br>
	<br><h3 style='color: #CC0000'>v0.033</h3><br>
		- Made the autobuy token autobuyer work as intended.<br>
		- Fixed a lot of display issues with things now being down.<br>
		- Added a nitrogen upgrade.<br>
		- Added a nitrogen milestone.<br>
		- Moved character multiplier effect display to the upgrades page.<br>
	<br><h3 style='color: #CC0000'>v0.032</h3><br>
		- Added notification for various resets and upgrades.<br>
		- Added three nitrogen milestones.<br>
		- Gave nitrogen an effect.<br>
		- Made token milestones hidden until the previous was unlocked.<br>
	<br><h3 style='color: #CC0000'>v0.031</h3><br>
		- Made achievements not disappear after nitrogen resetting.<br>
		- Added a nitrogen milestone<br>.
		- Gave nitrogen an effect.<br>
		- Made Iron twice as cheap.<br>
		- Added four nitrogen upgrades that can be bought in any order.<br>
		- Added T and S hotkeys.<br>
	<br><h3 style='color: #CC0000'>v0.030</h3><br>
		- Added three upgrades for C minigame.<br>
		- Increased digits display for sufficiently small numbers.<br>
		- Added a hardcap for C Point gain 2, but it's not for a while, so I might remove it.<br>
		- Added nitrogen including...<br>
		... a prestige button/displays for it<br>
		... a prestiging function which resets all prior progress except achievements<br>
		... one upgrade currently (there will be options to start)<br>
	<br><h3 style='color: #CC0000'>v0.029</h3><br>
		- Added six buyables for C minigame.<br>
		- Added two upgrades for C minigame.<br>
		- Added three token upgrades.<br>
		- Added two rows of achievements.<br>
		- Redid C minigame display.<br>
	<br><h3 style='color: #CC0000'>v0.028</h3><br>
		- Added a buyable for C minigame.<br>
		- Added a upgrade for C minigame.<br>
		- Added a token milestone and two token upgrades.<br>
		- Added two rows of achievements.<br>
	<br><h3 style='color: #CC0000'>v0.027</h3><br>
		- Added two buyables for C minigame.<br>
		- Added five upgrades for C minigame.<br>
		- Added two token milestones.<br>
	<br><h3 style='color: #CC0000'>v0.026</h3><br>
		- Added a buyable for C minigame.<br>
		- Added four upgrades for C minigame.<br>
	<br><h3 style='color: #CC0000'>v0.025</h3><br>
		- Added five buyables for C minigame.<br>
		- Added five upgrades for C minigame.<br>
		- Added a display for the base of all characters.<br>
		- By the way, the formula is base^choose2(n) where n is the number of said character.<br>
	<br><h3 style='color: #CC0000'>v0.024</h3><br>
		- Added a token milestone.<br>
		- Added content for C minigame which includes...<br>
		... A virtual slot machine with up to 15 slots!<br>
		... Up to 11 options for you to roll!<br>
		... Upgrades to improve the game (one of them will be auto roll, don't worry 😊)<br>
	<br><h3 style='color: #CC0000'>v0.023</h3><br>
		- Added a spelling minigame.<br>
	<br><h3 style='color: #CC0000'>v0.022</h3><br>
		- This is your second hint! Jacorb found it, and I changed some stuff.<br>
		- Added two rows of achievements.<br>
		- Added two token milestones.<br>
		- Added two Atomic Hydrogen upgrades.<br>
		- Added three Deuterium upgrade.<br>
		- Added a display for total tokens.<br>
	<br><h3 style='color: #CC0000'>v0.021</h3><br>
		- This is your first hint! 15 < x < 21<br>
		- Added two rows of achievements.<br>
		- Added a token milestone.<br>
		- Added a Carbon upgrade.<br>
		- Added an Oxygen upgrade.<br>
		- Added two Atomic Hydrogen upgrades.<br>
	<br><h3 style='color: #CC0000'>v0.020</h3><br>
		- Added an Atomic Hydrogen upgrade.<br>
		- Added an Oxygen upgrade.<br>
		- Added a token milestone.<br>
		- Added a Carbon upgrade.<br>
	<br><h3 style='color: #CC0000'>v0.019</h3><br>
		- Added a Deuterium upgrade.<br>
		- Made Oxygen VIII 10x cheaper.<br>
		- Added a token milestone.<br>
		- Added 3 coin upgrades.<br>
		- Fixed some grammar.<br>
	<br><h3 style='color: #CC0000'>v0.018</h3><br>
		- Added a row of achievements.<br>
		- Added three Carbon upgrades.<br>
		- Added two Oxygen upgrades.<br>
		- Added 5 token milestones.<br>
		- Added coins.<br>
		- Added 13 coin upgrades.<br>
	<br><h3 style='color: #CC0000'>v0.017</h3><br>
		- Added a row of achievements.<br>
		- Fixed a bug where bulk purchasing allowed for over 5000 buyables.<br>
		- Added an Oxygen upgrade.<br>
		- Added 9 token milestones.<br>
	<br><h3 style='color: #CC0000'>v0.016</h3><br>
		- Added a button for selling token buyables to fix bugs.<br>
		- Added 3 token milestones.<br>
	<br><h3 style='color: #CC0000'>v0.015</h3><br>
		- Added a row of achievements.<br>
		- Added 9 more buyables for tokens.<br>
		- Added a token milestone.<br>
	<br><h3 style='color: #CC0000'>v0.014</h3><br>
		- Added tokens.<br>
		- Added three Hydrogen upgrades.<br>
		- Added 8 buyables for tokens that boost previous currencies.<br>
		- Next patch will add the scaling buffs.<br>
	<br><h3 style='color: #CC0000'>v0.013</h3><br>
		- Added 2 rows of achievements.<br>
		- Added two Hydrogen upgrades.<br>
		- Added 4 Oxygen upgrades.<br>
		- Rebalanced A point content slightly.<br>
	<br><h3 style='color: #CC0000'>v0.012</h3><br>
		- Added a row of achievements.<br>
		- Added Oxygen.<br>
		- Added a Oxygen upgrade.<br>
		- Reduced A point gain in hard mode by 100x.<br>
	<br><h3 style='color: #CC0000'>v0.011</h3><br>
		- Added a row of achievements.<br>
		- Added Carbon.<br>
		- Added 4 Carbon upgrades.<br>
	<br><h3 style='color: #CC0000'>v0.010</h3><br>
		- Added a row of achievements.<br>
		- Added 5 Hydrogen upgrades.<br>
		- Added 3 buyables for the B minigame.<br>
		- Added 8 buyables for the A minigame.<br>
		- Improved number display.<br>
		- Added arrow hotkeys.<br>
	<br><h3 style='color: #CC0000'>v0.009</h3><br>
		- Added a row of achievements.<br>
		- Added 5 buyables for the B minigame.<br>
	<br><h3 style='color: #CC0000'>v0.008</h3><br>
		- Added hard mode.<br>
		- Added a display for whether you played hard mode from the start ({HARD} means you have).<br>
		- Added an achievement rows completed display.<br>
		- Added five Hydrogen upgrades.<br>
	<br><h3 style='color: #CC0000'>v0.007</h3><br>
		- Added color undulating.<br>
		- Added Atomic Hydrogen content, displays, and a new tab.<br>
		- Added seven achievements.<br>
		- Added nine Hydrogen upgrades.<br>
		- Made Optima the default font.<br>
	<br><h3 style='color: #CC0000'>v0.006</h3><br>
		- Added time until purchase displays.<br>
		- Added Deuterium content, displays, and a new tab.<br>
		- Added two achievements.<br>
	<br><h3 style='color: #CC0000'>v0.005</h3><br>
		- Added seven Hydrogen upgrades.<br>
		- Added code for when you have too much of an element and it needs to decay.<br>
		- Added a display for actual Hydrogen/s.<br>
		- Added two achievements.<br>
	<br><h3 style='color: #CC0000'>v0.004</h3><br>
		- Added achievements.<br>
	<br><h3 style='color: #CC0000'>v0.003</h3><br>
		- Added the old hotkey set up.<br>
		- Added spacing.<br>
		- Sorta added Hydrogen.<br>
	<br><h3 style='color: #CC0000'>v0.002</h3><br>
		- Added force shift/control and undulation control.<br>
		- Added time since last save display.<br>
	<br><h3 style='color: #CC0000'>v0.001</h3><br>
		- Added some math functions.<br>
		- Made the vueFile local.<br>`

let winText = `Congratulations! You have reached the end of this patch! More content is to come...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything",
					"costFormula",
					"costFormulaID",
					"costFormula2",
					"getCoords",
					"getMaxCoord",
					"getGemEffect",]

function getStartPoints(){
    	return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
	toggleKeys: false,
	undulating: false,
	lastSave: new Date().getTime(),
	hardMode: false,
	easyMode: false,
	extremeMode: false,
	hardFromBeginning: false,
	extremeFromBeginning: false,
	arrowHotkeys: true,
	modTab: false,
	lastLettersPressed: [],
	targetWord: "johnson",
	wordsSpelled: 0,
	currentTime: new Date().getTime(),
	showBuiltInSaves: false,
	dev: {
		fastCorn: false,
		aPointMult: undefined,
		bPointMult: undefined,
		cPointMult: undefined,
		dPointMult: undefined,
		ePointMult: undefined,
		autobuytokens: false,
	},
	spaceBarPauses: false,
	paused: false,
	shiftAlias: false,
	controlAlias: false,
}}

function getLastSaveDisplay(a){
	return "Last save was: " + formatTime((new Date().getTime()-player.lastSave)/1000, a) + " ago. "
}

// Display extra things at the top of the page
var displayThings = [
	function(){
		list1 = []
		if (shiftDown) list1 = list1.concat("S")
		if (controlDown) list1 = list1.concat("C")
		if (player.undulating) list1 = list1.concat("U")
		if (!player.arrowHotkeys) list1 = list1.concat("¬A")
		if (!player.spaceBarPauses) list1 = list1.concat("¬P")
		
		let end = ""
		if (list1.length > 0) end = "(" + combineStrings(list1) + ")"
		let saveFinal = getLastSaveDisplay() + end

		let len = pastTickTimes.length
		if (len <= 3) return saveFinal
		let a = 0
		for (i = 0; i < len; i++){
			a += pastTickTimes[i]
		}

		let val = Math.round(a/len)
		let p1 = ""
		let p2 = ""
		if (val > 50) {
			p1 = "<bdi style='color: #CC0000'>"
			p2 = "</bdi>"
		}

		let msptFinal = " ms/tick = " + p1 + formatWhole(val) + p2
		return saveFinal + msptFinal
	}, 
	function(){
		if (paused || player.paused) return "<bdi style='color:#CC0033'>THE GAME IS PAUSED</bdi>"
		if (player.cells.slowTime > 0) return "For the next " + makeGreen(formatTime(player.cells.slowTime)) + " real seconds,<br>the game will tick 100x slower"
		if (inChallenge("l", 11)) return "Dilation exponent is currently 1/" + format(getPointDilationExponent().pow(-1))
		if (player.keepGoing) return makeBlue("You are past endgame,<br>and the game might not be balanced here.")
		if (player.extremeMode) return "You are in extreme mode"
	},
]

var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return 1 // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
	if (player.version < "1.084" && player.cells.upgrades.includes(42)) {
		player.tokens.buyables[11] = decimalZero
		player.tokens.points = player.tokens.total
		player.subtabs.tokens.mainTabs = "II"
		player.tab = "tokens"
	}
	if (player.version < "1.103" && player.extremeMode) {
		player.extremeMode = false
		player.extremeFromBeginning = false
		let s = "Your save had extreme mode active in a patch before it did anything."
		s += "To keep the save balanced, you have been kicked out of extreme mode."
		alert(s)
	}
	if (player.version < "1.151.1") {
		player.l.everMilestone1 = player.l.milestones.includes("1") || player.a.unlocked
	}
	if (player.version < "1.161") {
		player.a.everMilestone3 = player.d.unlocked || player.a.milestones.includes("3")
		player.a.everMilestone1 = player.d.unlocked || player.a.milestones.includes("1")
	}
	if (player.version < "1.167") {
		player.sci.everUpgrade412 = player.sci.upgrades.includes(412)
	}
	if (player.version < "1.192") {
		player.cells.everMilestone60 = player.t.unlocked || player.cells.milestones.includes("60")
	}
}

var controlDown = false
var shiftDown = false
var logKeyCode = false

function hasSpelledWord(word){
	let l = word.length
	if (l > 25) {
		console.log("nopers")
		return false
	}
	for (i = 0; i < l; i++){
		let id = 25 - l + i
		let is = player.lastLettersPressed[id]
		let shouldbe = word[i]
		if (is != shouldbe) return false
	}
	return true
} 

function getLetterFromNum(x){
	return {
		32: " ",
		65: "a",
		66: "b",
		67: "c",
		68: "d",
		69: "e",
		70: "f",
		71: "g",
		72: "h",
		73: "i",
		74: "j",
		75: "k",
		76: "l",
		77: "m",
		78: "n",
		79: "o",
		80: "p",
		81: "q",
		82: "r",
		83: "s",
		84: "t",
		85: "u",
		86: "v",
		87: "w",
		88: "x",
		89: "y",
		90: "z",
	}[x]
}

window.addEventListener('keydown', function(event) {
	code = event.keyCode
	if (player.toggleKeys) {
		if (code == 16) shiftDown = !shiftDown;
		if (code == 17) controlDown = !controlDown;
	} else {
		if (code == 16) shiftDown = true;
		if (code == 17) controlDown = true;
	}
	if (logKeyCode) console.log(code)
	if ((code >= 65 && code <= 90) || code == 32) {
		player.lastLettersPressed.push(getLetterFromNum(code))
		let l = player.lastLettersPressed.length
		if (l > 25) {
			player.lastLettersPressed = player.lastLettersPressed.slice(l-25,)
		}
	}
	//65 to 90 are a to z
}, false);

window.addEventListener('keyup', function(event) {
	if (player != undefined && player.toggleKeys) return 
	if (event.keyCode == 16) shiftDown = false;
	if (event.keyCode == 17) controlDown = false;
}, false);

function toggleShift(){
	shiftDown = !shiftDown
}

function toggleControl(){
	controlDown = !controlDown
}

function toggleUndulating(){
	player.undulating = !player.undulating
}

function enterHardMode(){
	let s = "Are you sure you want to enter hard mode? This cannot be undone."
	if (!confirm(s)) return 
	if (player.extremeMode) {
		if (!confirm("You are already in extreme mode, this is not advised." + s)) return 
	}
	if (confirm("Would you like to apply that to this save [cancel] or create a new save [okay]?")) {
		// this means you said okay so create a new save
		newSave("hard")
	} else {
		// apply to this save
		player.hardMode = true
		if (player.h.best.lt(10) && !player.o.unlocked && !player.c.unlocked) player.hardFromBeginning = true
	}
}

function enterExtremeMode(){
	let s = "Are you sure you want to enter extreme mode? This cannot be undone."
	if (!confirm(s)) return 
	if (player.hardmode) {
		if (!confirm("You are already in hard mode, this is not advised." + s)) return 
	}
	if (confirm("Would you like to apply that to this save [cancel] or create a new save [okay]?")) {
		// this means you said okay so create a new save
		newSave("extreme")
	} else {
		// apply to this save
		player.extremeMode = true
		if (player.h.best.lt(10) && !player.o.unlocked && !player.c.unlocked) player.extremeFromBeginning = true
	}
}

function enterEasyMode(){
	let s = "Are you sure you want to enter easy mode? This cannot be undone."
	if (!confirm(s)) return 
	if (confirm("Would you like to apply that to this save [cancel] or create a new save [okay]?")) {
		// this means you said okay so create a new save
		newSave("easy")
	} else {
		// apply to this save
		player.easyMode = true
	}
}

function toggleArrowHotkeys(){
	player.arrowHotkeys = !player.arrowHotkeys
}





