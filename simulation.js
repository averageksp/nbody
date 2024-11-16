const canvas = document.getElementById("simulation");
const ctx = canvas.getContext("2d");

// Constants
const G = 6.67430e-11; // Gravitational constant
const TIMESTEP = 0.01; // Time step for simulation

// Variables
let planets = [];
let timeWarpFactor = 1;

// Planet Class
class Planet {
    constructor(x, y, vx, vy, mass, radius, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Load planets from JSON file
document.getElementById("fileInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            planets = JSON.parse(event.target.result).map(p =>
                new Planet(p.x, p.y, p.vx, p.vy, p.mass, p.radius, p.color)
            );
        };
        reader.readAsText(file);
    }
});

// Calculate gravitational forces
function calculateForces() {
    for (let i = 0; i < planets.length; i++) {
        let fx = 0, fy = 0;
        for (let j = 0; j < planets.length; j++) {
            if (i !== j) {
                const dx = planets[j].x - planets[i].x;
                const dy = planets[j].y - planets[i].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const force = (G * planets[i].mass * planets[j].mass) / (distance * distance);
                fx += force * (dx / distance);
                fy += force * (dy / distance);
            }
        }
        planets[i].vx += (fx / planets[i].mass) * TIMESTEP * timeWarpFactor;
        planets[i].vy += (fy / planets[i].mass) * TIMESTEP * timeWarpFactor;
    }
}

// Update positions
function updatePositions() {
    for (let planet of planets) {
        planet.x += planet.vx * TIMESTEP * timeWarpFactor;
        planet.y += planet.vy * TIMESTEP * timeWarpFactor;
    }
}

// Draw simulation
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let planet of planets) {
        planet.draw();
    }
}

// Main simulation loop
function simulate() {
    calculateForces();
    updatePositions();
    draw();
    requestAnimationFrame(simulate);
}

// Event listeners
document.getElementById("start").addEventListener("click", simulate);
document.getElementById("timeWarp").addEventListener("click", () => {
    timeWarpFactor = timeWarpFactor === 1 ? 10 : 1;
});
document.getElementById("reset").addEventListener("click", () => {
    planets = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});
