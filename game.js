/*
Author: Lucca de Mello
CS 132 Spring 2022
Date: April 22, 2022

The script controlling the Gravity simulation. In the module-global scope, 
stores the the simulation parameters and keeps track of the particles.
*/
(() => {

"use strict";

let fps = 60; // Update frequency, in Hz.
let simulationSpeed = 5; // How much time passes (in the simulation) each frame.
let dt = simulationSpeed / fps; /* Unit time of the simulation. If fps doubles, 
                                   dt should be halved so that the same amount 
                                   of time in the simulation passes each 
                                   real-life second. */
let GM = 1e5; // https://en.wikipedia.org/wiki/Standard_gravitational_parameter
let spawnRandomly = false; // Whether to spawn particles at random positions.

const particles = [];

const c = document.getElementById("canvas");
const ctx = c.getContext("2d");

const cursor = { x: c.width / 2, y: c.height / 2 };

/* Update the `height` and `width` properties of the canvas to match those of 
 * the <canvas> element. */
function setCanvasDimensions() {
    c.height = c.clientHeight;
    c.width = c.clientWidth;
}

/**
 * Display, in the corresponding <output>, the value of an <input> slider.
 * @param {string} sliderId The ID of the slider.
 */
function displaySliderValue(sliderId) {
    document.querySelector(`#${sliderId}+output`).value = 
        document.getElementById(sliderId).value;
}

class Particle {
    /**
     * @param {number} x Horizontal starting coordinate, in canvas pixels.
     * @param {number} y Vertical starting coordinate, in canvas pixels.
     * @param {number} r Radius of the particle, in canvas pixels.
     * @param {string} color The color of the particle, 
     * in any CSS <color> format.
     */
    constructor(x, y, r, color) {
        this.radius = r;
        this.color = color;

        this.x = x;
        this.y = y;

        this.vx = 0;
        this.vy = 0;

        this.ax = 0;
        this.ay = 0;
    }

    /**
     * Draw this particle on the canvas.
     */
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }

    /**
     * Updates the particle's position and velocity.
     */
    step() {
        this.vx += this.ax * dt;
        this.vy += this.ay * dt;

        this.x += this.vx * dt;
        this.y += this.vy * dt;
    }

    /**
     * Sets the acceleration
     * @param {number} x Horizontal destination coordinate, in canvas pixels.
     * @param {number} y Vertical destination coordinate, in canvas pixels.
     * @param {number} a Modulus of the new acceleration, in canvas pixels per 
     * square simulation-unit-time.
     */
    accelerateTo(x, y, a) {
        const angle = Math.atan2(y - this.y, x - this.x);

        this.ax = a * Math.cos(angle);
        this.ay = a * Math.sin(angle);
    }
    
    /**
     * Accelerate to the cursor, step, and draw.
     */
    update() {
        const distX = this.x - cursor.x;
        const distY = this.y - cursor.y;
        const distSquared = distX * distX + distY * distY;

        this.accelerateTo(cursor.x, cursor.y, GM / distSquared);
        this.step();
        this.draw();
    }
}

/**
 * Returns a random color, sampled uniformly from #000000 to #FFFFFF.
 * @returns {string} A CSS <color> in 6-digit hex format.
 */
function randomColor() {
    return "#" + Math.ceil(Math.random() * 0xffffff)
                     .toString(16)
                     .padStart(6, "0");
}

/** 
 * Spawns a particle. 
 * @param {string} color The color of the particle in any CSS-compliant format.
 * @param {number} r The radius, in canvas pixels, of the particle.
 */
function spawn(color = randomColor(), r = Math.random() * 10) {
    const [spawnX, spawnY] = spawnRandomly ? 
                             [c.width * Math.random(), 
                              c.height * Math.random()] :
                             [c.width / 2, c.height / 2];

    particles.push(new Particle(spawnX, spawnY, r, color));
}

/* Run one iteration of the game loop. */
function update() {
    // Clear the canvas.
    ctx.clearRect(0, 0, c.width, c.height);

    // Spawn a new particle at the center.
    spawn();

    // Update all particles.
    particles.forEach(particle => particle.update());
}

/**
 * Creates and starts the game loop
 * @param {number} fps The update frequency, in Hz.
 * @returns {number} The ID of the newly-created interval.
 */
function gameLoop(fps) {
    return setInterval(update, 1000 / fps);
}

/**
 * Binds event handlers to the window and the inputs.
 * @param {number} intervalId The ID of the timer calling `gameLoop`. Used by 
 * the `InputEvent` handler of the framerate input.
 */
function bindEventListeners(intervalId) {
    addEventListener("resize", setCanvasDimensions);

    addEventListener("mousemove", e => {
        cursor.x = e.pageX;
        cursor.y = e.pageY;
    });

    document.getElementById("fps").addEventListener("input", e => {
        fps = e.target.value;
        dt = simulationSpeed / fps;
        displaySliderValue("fps");

        clearInterval(intervalId);
        intervalId = gameLoop(e.target.value);
    });

    document.getElementById("simulation-speed").addEventListener("input", e => {
        simulationSpeed = e.target.value;
        dt = simulationSpeed / fps;
        displaySliderValue("simulation-speed");
    });

    document.getElementById("GM").addEventListener("input", e => {
        GM = e.target.value;
        displaySliderValue("GM");
    });

    document.getElementById("spawn-randomly").addEventListener("input", e => {
        spawnRandomly = e.target.checked;
    });
}

function init() {
    setCanvasDimensions();

    // Display initial slider values.
    displaySliderValue("fps");
    displaySliderValue("simulation-speed");
    displaySliderValue("GM");

    bindEventListeners(gameLoop(60));
}

/* British developers be like */ init();

})();