var systemComponents = {
	'tab-buttons': {
		props: ['layer', 'data', 'name'],
		template: `
			<div class="upgRow">
				<div v-for="tab in Object.keys(data)">
					<button v-if="data[tab].unlocked == undefined || data[tab].unlocked" v-bind:class="{tabButton: true, notify: subtabShouldNotify(layer, name, tab), resetNotify: subtabResetNotify(layer, name, tab)}"
					v-bind:style="[{'border-color': tmp[layer].color}, (subtabShouldNotify(layer, name, tab) ? {'box-shadow': 'var(--hqProperty2a), 0 0 20px '  + (data[tab].glowColor || defaultGlow)} : {}), tmp[layer].componentStyles['tab-button'], data[tab].buttonStyle]"
						v-on:click="function(){player.subtabs[layer][name] = tab; updateTabFormats(); needCanvasUpdate = true;}">{{tab}}</button>
				</div>
			</div>
		`
	},

	'tree-node': {
		props: ['layer', 'abb', 'size', 'prev'],
		template: `
		<button v-if="nodeShown(layer)"
			v-bind:id="layer"
			v-on:click="function() {
				if (shiftDown && options.forceTooltips) player[layer].forceTooltip = !player[layer].forceTooltip
				else if(tmp[layer].isLayer) {
					if (tmp[layer].leftTab) {
						showNavTab(layer, prev)
						showTab('none')
					}
					else
						showTab(layer, prev)
				}
				else {run(layers[layer].onClick, layers[layer])}
			}"


			v-bind:class="{
				treeNode: tmp[layer].isLayer,
				treeButton: !tmp[layer].isLayer,
				smallNode: size == 'small',
				[layer]: true,
				tooltipBox: true,
				forceTooltip: player[layer].forceTooltip,
				ghost: tmp[layer].layerShown == 'ghost',
				hidden: !tmp[layer].layerShown,
				locked: tmp[layer].isLayer ? !(player[layer].unlocked || tmp[layer].canReset) : !(tmp[layer].canClick),
				notify: tmp[layer].notify && player[layer].unlocked,
				resetNotify: tmp[layer].prestigeNotify,
				can: ((player[layer].unlocked || tmp[layer].canReset) && tmp[layer].isLayer) || (!tmp[layer].isLayer && tmp[layer].canClick),
				front: !tmp.scrolled,
			}"
			v-bind:style="constructNodeStyle(layer)">
			<span class="nodeLabel" v-html="(abb !== '' && tmp[layer].image === undefined) ? abb : '&nbsp;'"></span>
			<tooltip
      v-if="tmp[layer].tooltip != ''"
			:text="(tmp[layer].isLayer) ? (
				player[layer].unlocked ? (tmp[layer].tooltip ? tmp[layer].tooltip : formatWhole(player[layer].points) + ' ' + tmp[layer].resource)
				: (tmp[layer].tooltipLocked ? tmp[layer].tooltipLocked : 'Reach ' + formatWhole(tmp[layer].requires) + ' ' + tmp[layer].baseResource + ' to unlock (You have ' + formatWhole(tmp[layer].baseAmount) + ' ' + tmp[layer].baseResource + ')')
			)
			: (
				tmp[layer].canClick ? (tmp[layer].tooltip ? tmp[layer].tooltip : 'I am a button!')
				: (tmp[layer].tooltipLocked ? tmp[layer].tooltipLocked : 'I am a button!')
			)"></tooltip>
			<node-mark :layer='layer' :data='tmp[layer].marked'></node-mark></span>
		</button>
		`
	},

	
	'layer-tab': {
		props: ['layer', 'back', 'spacing', 'embedded'],
		template: `<div v-bind:style="[tmp[layer].style ? tmp[layer].style : {}, (tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ? tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style : {}]" class="noBackground">
		<div v-if="back"><button v-bind:class="back == 'big' ? 'other-back' : 'back'" v-on:click="goBack(layer)">←</button></div>
		<div v-if="!tmp[layer].tabFormat">
			<div v-if="spacing" v-bind:style="{'height': spacing}" :key="this.$vnode.key + '-spacing'"></div>
			<infobox v-if="tmp[layer].infoboxes" :layer="layer" :data="Object.keys(tmp[layer].infoboxes)[0]":key="this.$vnode.key + '-info'"></infobox>
			<main-display v-bind:style="tmp[layer].componentStyles['main-display']" :layer="layer"></main-display>
			<div v-if="tmp[layer].type !== 'none'">
				<prestige-button v-bind:style="tmp[layer].componentStyles['prestige-button']" :layer="layer"></prestige-button>
			</div>
			<resource-display v-bind:style="tmp[layer].componentStyles['resource-display']" :layer="layer"></resource-display>
			<milestones v-bind:style="tmp[layer].componentStyles.milestones" :layer="layer"></milestones>
			<div v-if="Array.isArray(tmp[layer].midsection)">
				<column :layer="layer" :data="tmp[layer].midsection" :key="this.$vnode.key + '-mid'"></column>
			</div>
			<clickables v-bind:style="tmp[layer].componentStyles['clickables']" :layer="layer"></clickables>
			<buyables v-bind:style="tmp[layer].componentStyles.buyables" :layer="layer"></buyables>
			<upgrades v-bind:style="tmp[layer].componentStyles['upgrades']" :layer="layer"></upgrades>
			<challenges v-bind:style="tmp[layer].componentStyles['challenges']" :layer="layer"></challenges>
			<achievements v-bind:style="tmp[layer].componentStyles.achievements" :layer="layer"></achievements>
			<br><br>
		</div>
		<div v-if="tmp[layer].tabFormat">
			<div v-if="Array.isArray(tmp[layer].tabFormat)"><div v-if="spacing" v-bind:style="{'height': spacing}"></div>
				<column :layer="layer" :data="tmp[layer].tabFormat" :key="this.$vnode.key + '-col'"></column>
			</div>
			<div v-else>
				<div class="upgTable" v-bind:style="{'padding-top': (embedded ? '0' : '25px'), 'margin-top': (embedded ? '-10px' : '0'), 'margin-bottom': '24px'}">
					<tab-buttons v-bind:style="tmp[layer].componentStyles['tab-buttons']" :layer="layer" :data="tmp[layer].tabFormat" :name="'mainTabs'"></tab-buttons>
				</div>
				<layer-tab v-if="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :layer="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].embedLayer" :embedded="true" :key="this.$vnode.key + '-' + layer"></layer-tab>
				<column v-else :layer="layer" :data="tmp[layer].tabFormat[player.subtabs[layer].mainTabs].content" :key="this.$vnode.key + '-col'"></column>
			</div>
		</div></div>
			`
	},

	'overlay-head': {
		template: `			
		<div class="overlayThing" style="padding-bottom:7px; width: 90%; z-index: 1000; position: relative">
		<span v-if="player.devSpeed && player.devSpeed != 1" class="overlayThing">
			<br>Dev Speed: {{format(player.devSpeed)}}x<br>
		</span>
		<span v-if="player.offTime !== undefined"  class="overlayThing">
			<br>Offline Time: {{formatTime(player.offTime.remain)}}<br>
		</span>
		<br>
		<span v-if="player.points.lt('1e1000')"  class="overlayThing">You have </span>
		<h2  class="overlayThing" id="points">{{format(player.points)}}</h2>
		<span v-if="player.points.lt('1e1e6')"  class="overlayThing"> {{modInfo.pointsName}}</span>
		<br>
		<span v-if="canGenPoints()"  class="overlayThing">({{tmp.other.oompsMag != 0 ? format(tmp.other.oomps) + " OOM" + (tmp.other.oompsMag < 0 ? "^OOM" : tmp.other.oompsMag > 1 ? "^" + tmp.other.oompsMag : "") + "s" : formatSmall(getPointGen())}}/sec)</span>
		<div v-for="thing in tmp.displayThings" class="overlayThing"><span v-if="thing" v-html="thing"></span></div>
	</div>
	`
    },

	'info-tab': {
		template: `
		<div>
		<h2>{{modInfo.name}}</h2>
		<br>
		<h3>{{VERSION.withName}}</h3>
		<span v-if="modInfo.author">
		<br>
		Made by {{modInfo.author}}	
		</span>
		<br>
		The Modding Tree <a v-bind:href="'https://github.com/Acamaeda/The-Modding-Tree/blob/master/changelog.md'" target="_blank" class="link" v-bind:style = "{'font-size': '14px', 'display': 'inline'}" >{{TMT_VERSION.tmtNum}}</a> by Acamaeda
		<br>
		The Prestige Tree made by Jacorb and Aarex
			<br><br>
		<span v-if="modInfo.discordLink"><a class="link" v-bind:href="modInfo.discordLink" target="_blank">{{modInfo.discordName}}</a><br></span>
		<a class="link" href="https://discord.gg/F3xveHV" target="_blank" v-bind:style="modInfo.discordLink ? {'font-size': '16px'} : {}">The Modding Tree Discord</a><br>
		<a class="link" href="http://discord.gg/wwQfgPa" target="_blank" v-bind:style="{'font-size': '16px'}">Main Prestige Tree server</a><br>

		<button class="opt" onclick="player.modTab = !player.modTab"><span>{{player.modTab ? "Show info tab":"Show mod selection tab"}}</button>

		<span v-if="player.modTab">
		<br><br>
		Enter Modes: 
		<table>
			<tr>
				<td>
					<button class="opt" onclick="enterHardMode()">
						<span v-if="player.hardMode"><bdi style='color:#CC0033'>{{"In hard mode"}}</bdi></span>
						<span v-if="!player.hardMode"><bdi style='color:#3300CC'>{{"Enter hard mode"}}</bdi></span>
					</button>
				</td>
				<td>
					<button class="opt" onclick="enterExtremeMode()">
						<span v-if="player.extremeMode"><bdi style='color:#CC0033'>{{"In extreme mode"}}</bdi></span>
						<span v-if="!player.extremeMode"><bdi style='color:#3300CC'>{{"Enter extreme mode"}}</bdi></span>
					</button>
				</td>
				<td>
					<button class="opt" onclick="enterEasyMode()">
						<span v-if="player.easyMode"><bdi style='color:#CC0033'>{{"In easy mode"}}</bdi></span>
						<span v-if="!player.easyMode"><bdi style='color:#3300CC'>{{"Enter easy mode"}}</bdi></span>
					</button>
				</td>
			</tr>
		</table>
		<br><br>
		<h2 style='color: #FF0066'>Hard mode</h2>:<br>
		Passive gains are 4x less and various other smaller nerfs<br><br>

		<h2 style='color: #FF0066'>Easy mode</h2>:<br>
		All bulk buying is done by default<br>
		Gain 2x of all prestige currencies, and 4x all passive gain currencies<br>
		Gain 2x resets at once and pre-Phosphorus gain ^1.001<br><br>

		<h2 style='color: #FF0066'>Extreme mode</h2>:<br>
		Gain of all currencies is raised ^.75 (after everything except dilation)<br>
		For protein, boosts from things other than mRNA and tRNA are ^.75<br><br>
		
		</span>
		
		<span v-if="!player.modTab">
		<br>
		Time Played: {{ formatTime(player.timePlayed) }}<br>
		<h1 style='color: #FF0066'>Shift to see details!</h1><br>
		Toggles:
		<table>
			<tr>
				<td><button class="opt" onclick="toggleShift()">Force toggle shift<span><bdi style='color:#CC0033'><br>{{shiftDown?"Down":"Up"}}</bdi></span></button></td>
				<td><button class="opt" onclick="toggleControl()">Force toggle control<span><bdi style='color:#CC0033'><br>{{controlDown?"Down":"Up"}}</bdi></span></button></td>
				<td><button class="opt" onclick="toggleUndulating()">Toggle Undulating Colors<span><bdi style='color:#CC0033'><br>{{player.undulating?"On":"Off"}}</bdi></span></button></td>
				<td><button class="opt" onclick="toggleArrowHotkeys()">Toggle Arrow Hotkeys<span><bdi style='color:#CC0033'><br>{{player.arrowHotkeys?"On":"Off"}}</bdi></span></button></td>
				<td><button class="opt" onclick="player.spaceBarPauses = !player.spaceBarPauses">Toggle space bar pausing<span><bdi style='color:#CC0033'><br>{{player.spaceBarPauses?"Yes":"No"}}</bdi></span></button></td>
				<td><button class="opt" onclick="player.paused = !player.paused">Toggle pause<span><bdi style='color:#CC0033'><br>{{player.paused?"Paused":"Running"}}</bdi></span></button></td>
			</tr>
		</table>
		Others:
		<table>
			<tr>
				<td><button class="opt" onclick="save()">Save<span><br>{{formatTime((new Date().getTime()-player.lastSave)/1000, true)}}</span></button></td>
				<td><button class="opt" onclick="player.showBuiltInSaves = true">Show built in saves</button></td>
				<td><button class="opt" onclick="setUpPGSettings()">Make your settings the same as the dev</button></td>
				<span v-if="player.keepGoing"><td><button class="opt" onclick="player.keepGoing = false">Re-show endgame screen</button></td></span>
			</tr>
		</table>
		
		<br><br>
		<h2 style='color: #00FF99'>Hotkeys</h2><br>
		<span v-for="key in hotkeys" v-if="player[key.layer].unlocked && tmp[key.layer].hotkeys[key.id].unlocked"><span v-html="getDescriptionFromKey(key)"></span><br></span>
		<br><br>

		<h2 style='color: #7D5D9E'>Acknowledgements</h2><br>
		Thank you to <b>Jacorb</b> for letting me use his multi save code!<br>
		Thank you to <b>Digiprime</b> for the idea for the Organ layer!<br>
		Thank you to <b>Lordshinjo</b> for a specific and accurate bug report on "autobuying"<br>buyables and helping to subsequently fix.<br>

		<br><br><span v-if="player.showBuiltInSaves">
			<h2 style='color: #00FF99'>Built in saves</h2><br>
			To import: import the string with <i>capitalization</i> correct and no trailing spaces.<br>
			<bdi style='color: #F16105'>Warning: Scrolling past here may contains spoilers.</bdi><br><br>
			<span v-for="key in CUSTOM_SAVES_IDS">{{key}}<br></span>
		</span>
		<br><br>
		</span>

		</div>
	`
	},

    'options-tab': {
        template: `
	<div>
        <table>
            <tr>
                <td><button class="opt" onclick="save()">Save</button></td>
                <td><button class="opt" onclick="toggleOpt('autosave')">Autosave: {{ options.autosave?"ON":"OFF" }}</button></td>
                <td><button class="opt" onclick="hardReset()">HARD RESET</button></td>
            </tr>
            <tr>
                <td><button class="opt" onclick="exportSave()">Export to clipboard</button></td>
                <td><button class="opt" onclick="importSave()">Import</button></td>
                <td><button class="opt" onclick="toggleOpt('offlineProd')">Offline Prod: {{ options.offlineProd?"ON":"OFF" }}</button></td>
            </tr>
            <tr>
                <td><button class="opt" onclick="switchTheme()">Theme: {{ getThemeName() }}</button></td>
                <td><button class="opt" onclick="adjustMSDisp()">Show Milestones: {{ MS_DISPLAYS[MS_SETTINGS.indexOf(options.msDisplay)]}}</button></td>
                <td><button class="opt" onclick="toggleOpt('hqTree')">High-Quality Tree: {{ options.hqTree?"ON":"OFF" }}</button></td>
            </tr>
            <tr>
                <td><button class="opt" onclick="toggleOpt('hideChallenges')">Completed Challenges: {{ options.hideChallenges?"HIDDEN":"SHOWN" }}</button></td>
                <td><button class="opt" onclick="toggleOpt('forceOneTab'); needsCanvasUpdate = true">Single-Tab Mode: {{ options.forceOneTab?"ALWAYS":"AUTO" }}</button></td>
		<td><button class="opt" onclick="toggleOpt('forceTooltips'); needsCanvasUpdate = true">Shift-Click to Toggle Tooltips: {{ options.forceTooltips?"ON":"OFF" }}</button></td>
	    </tr> 
	    <tr>
	    	<td><button class="opt" onclick="toggleOpt('hideMilestonePopups'); needsCanvasUpdate = false">Popups are: {{ options.hideMilestonePopups?"HIDDEN":"SHOWN" }}</button></td>
		<td><button class="opt" onclick="showAllSaves()">Show your saves</button></td>
		<td></td>
	    </tr>
        </table>
	<saves></saves>
	</div>`
    },

    'back-button': {
        template: `
        <button v-bind:class="back" onclick="goBack()">←</button>
        `
    },


	'tooltip' : {
		props: ['text'],
		template: `<div class="tooltip" v-html="text"></div>
		`
	},

	'node-mark': {
		props: {'layer': {}, data: {}, offset: {default: 0}, scale: {default: 1}},
		template: `<div v-if='data'>
			<div v-if='data === true' class='star' v-bind:style='{position: "absolute", left: (offset-10) + "px", top: (offset-10) + "px", transform: "scale( " + scale||1 + ", " + scale||1 + ")"}'></div>
			<img v-else class='mark' v-bind:style='{position: "absolute", left: (offset-22) + "px", top: (offset-15) + "px", transform: "scale( " + scale||1 + ", " + scale||1 + ")"}' v-bind:src="data"></div>
		</div>
		`
	},

	'particle': {
		props: ['data', 'index'],
		template: `<div><div class='particle instant' v-bind:style="[constructParticleStyle(data), data.style]" 
			v-on:click="run(data.onClick, data)"  v-on:mouseenter="run(data.onMouseOver, data)" v-on:mouseleave="run(data.onMouseLeave, data)" ><span v-html="data.text"></span>
		</div>
		<svg version="2" v-if="data.color">
		<mask v-bind:id="'pmask' + data.id">
        <image id="img" v-bind:href="data.image" x="0" y="0" :height="data.width" :width="data.height" />
    	</mask>
    	</svg>
		</div>
		`
	},

	'bg': {
		props: ['layer'],
		template: `<div class ="bg" v-bind:style="[tmp[layer].style ? tmp[layer].style : {}, (tmp[layer].tabFormat && !Array.isArray(tmp[layer].tabFormat)) ? tmp[layer].tabFormat[player.subtabs[layer].mainTabs].style : {}]"></div>
		`
	}

}

