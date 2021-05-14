// Variables that must be defined to display popups
var particles = [];
var particleID = 0;
var mouseX = 0;
var mouseY = 0;

// Function to show popups
function makeParticles(data, amount=1) {
    for (let x = 0; x < amount; x++) {
        let particle = getNewParticle()
        for (thing in data) {
            switch(thing) {
                case DEFAULT:
                    particle[thing]=data[thing]
                    
            }
        }
	    particles.push(particle)
    }
}


//Function to reduce time on active popups
function updateParticles(diff) {
	for (p in particles) {
		particles[p].time -= diff;
		if (particles[p]["time"] < 0) {
			particles.splice(p, 1); // Remove popup when time hits 0
		}
	}
}

function getNewParticle() {
    particleID++
    return {
        time: 5,
        id: particleID,
        x: mouseX,
        y: mouseY,
    }
}

function updateMouse(event) {
    mouseX = event.clientX
    mouseY = event.clientY
}