
/* ------------------------- */
/* Stuff for keyboard events */
/* ------------------------- */


let keysPressed = [];

/**
 * Adds the pressed key to the pressed keys array, if it isn't there already
 * @param {*} event information about the key down event
 */
function keyDown(event) {
  let foundMatch = false;
  for (let i = 0; i < keysPressed.length; i++) {
    let key = keysPressed[i];
    if (key === event.keyCode) {
      foundMatch = true;
    }
  }

  if (!foundMatch) {
    keysPressed.push(event.keyCode);
  }
}
window.addEventListener('keydown', keyDown);


/**
 * Removes the released key from the pressed keys array
 * @param {*} event information about the key up event
 */
function keyUp(event) {
  let newKeysPressed = [];
  for (let i = 0; i < keysPressed.length; i++) {
    let key = keysPressed[i];
    if (key !== event.keyCode) {
      newKeysPressed.push(key);
    }
  }
  keysPressed = newKeysPressed;
}
window.addEventListener('keyup', keyUp);

function getKeysPressed () {
  return keysPressed;
}


const KEYBOARD = {
  getKeysPressed
};

export {
  KEYBOARD
};
