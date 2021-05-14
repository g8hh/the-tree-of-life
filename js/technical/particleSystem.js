// Variables that must be defined to display popups
var particles = {};
var particleID = 0;
var mouseX = 0;
var mouseY = 0;

// Function to show popups
function makeParticles(data, amount=1) {
    for (let x = 0; x < amount; x++) {
        let particle = getNewParticle()
        for (thing in data) {

            switch(thing) {
                case 'onClick', 'onHover', 'update': // Functions that should be copied over
                    particle[thing] = data[thing]
                default:
                    particle[thing]=run(data[thing], data, x)
                    
            }
        }
        if (data.angle === undefined) {
            particle.dir = particle.angle
        }
        particle.dir = particle.dir + (particle.spread * (x- amount/2 + 0.5))

        particle.xVel = particle.speed * sin(particle.dir)
        particle.yVel = particle.speed * cos(particle.dir) * -1

	    Vue.set(particles, particle.id, particle)

    }
}

function sin(x) {
    return Math.sin(x*Math.PI/180)
}

function cos(x) {
    return Math.cos(x*Math.PI/180)
}

function updateParticles(diff) {
	for (p in particles) {
		particles[p].time -= diff;
		if (particles[p]["time"] < 0) {
			Vue.delete(particles, p); 
            
		}
        else {
            if (particles[p].update) run(particles[p].update, particles[p])
            particles[p].angle += particles[p].rotation
            particles[p].x += particles[p].xVel
            particles[p].y += particles[p].yVel
            particles[p].yVel += particles[p].gravity
        }
	}
}

function getNewParticle() {
    particleID++
    return {
        time: 2,
        id: particleID,
        x: mouseX,
        y: mouseY,
        width: 35,
        height: 35,
        image: "resources/genericParticle.png",
        angle: 0,
        spread: 30,
        offset: 20,
        speed: 20,
        xVel: 0,
        yVel: 0,
        rotation: 0,
        gravity: 4,
    }
}

function updateMouse(event) {
    mouseX = event.clientX
    mouseY = event.clientY
}

function constructParticleStyle(particle){
    return {
        left: (particle.x  - particle.height/2) + 'px',
        top: (particle.y - particle.height/2) + 'px',
        width: particle.width + 'px',
        height: particle.height + 'px',
        transform: "rotate(" + particle.angle + "deg)",
    }
}