/*
Author: Lucca de Mello
CS 132 Spring 2022
Date: April 22, 2022

The script controlling the Gravity title screen. 
Or, more accurately, the turtle widget.
*/

(() => {
"use strict";

document.getElementById("more-turtles").addEventListener("click", () => {
    const turtle = document.createElement('div');
    turtle.textContent = "🐢";
    document.getElementById("tower").appendChild(turtle);
});

document.getElementById("flip-turtles").addEventListener("click", () => {
    document.querySelectorAll("#tower div").forEach(turtle => 
        turtle.classList.toggle('flipped'));
});

})();