var particles = {};
var particleID = 0;
var mouseX = 0;
var mouseY = 0;

function makeParticles(data, amount=1) {
    for (let x = 0; x < amount; x++) {
        let particle = getNewParticle()
        for (thing in data) {

            switch(thing) {
                case 'onClick': // Functions that should be copied over
                case 'onMouseEnter':
                case 'onMouseLeave':
                case 'update':
                    particle[thing] = data[thing]
                    break;
                default:
                    particle[thing]=run(data[thing], data, x)
                    
            }
        }
        if (data.dir === undefined) {
            particle.dir = particle.angle
        }
        particle.dir = particle.dir + (particle.spread * (x- amount/2 + 0.5))

        particle.x += particle.offset * sin(particle.dir)
        particle.y += particle.offset * cos(particle.dir) * -1

        particle.xVel = particle.speed * sin(particle.dir)
        particle.yVel = particle.speed * cos(particle.dir) * -1
        particle.fadeInTimer = particle.fadeInTime
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
        let particle = particles[p]
		particle.time -= diff;
        particle.fadeInTimer -= diff;
		if (particle["time"] < 0) {
			Vue.delete(particles, p); 
            
		}
        else {
            if (particle.update) run(particle.update, particle)
            particle.angle += particle.rotation
            particle.x += particle.xVel
            particle.y += particle.yVel
            particle.yVel += particle.gravity

        }
	}
}

function getNewParticle() {
    particleID++
    return {
        time: 3,
        id: particleID,
        x: mouseX,
        y: mouseY,
        width: 35,
        height: 35,
        image: "resources/genericParticle.png",
        angle: 0,
        spread: 30,
        offset: 10,
        speed: 15,
        xVel: 0,
        yVel: 0,
        rotation: 0,
        gravity: 0,
        fadeOutTime: 1,
        fadeInTimer: 0,
        fadeIn: 0,
    }
}

function updateMouse(event) {
    mouseX = event.clientX
    mouseY = event.clientY
}

function getOpacity(particle) {
    if ((particle.time < particle.fadeOutTime) && particle.fadeOutTime)
        return particle.time / particle.fadeOutTime
    if (particle.fadeInTimer > 0) 
        return 1 - (particle.fadeInTimer / particle.fadeInTime)
    
    return 1
}   

function constructParticleStyle(particle){
    return {
        left: (particle.x  - particle.height/2) + 'px',
        top: (particle.y - particle.height/2) + 'px',
        width: particle.width + 'px',
        height: particle.height + 'px',
        transform: "rotate(" + particle.angle + "deg)",
        opacity: getOpacity(particle),
        "pointer-events": (particle.onClick || particle.onHover) ? 'auto' : 'none',
        "background-image": "url(" + particle.image + ")",
    }
}

function clearParticles(check) {
    if (!check) check = true

    for (p in particles) {
        if (run(check, particles[p], particles[p])){
            Vue.delete(particles, p)
        }
    }
}