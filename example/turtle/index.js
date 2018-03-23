import ActionManager from "../../src/action/ActionManager.js";

export default function initInput(element) {
  // Animation values
  var positionLeft = 0;
  var positionTop = 0;
  var latest = 0;
  var velocityLeft = 0;
  var velocityTop = 0;
  var acceleration = 0;

  var rotation = 0;
  var rotationalVelocity = 0;
  var rotationalAcceleration = 0;

  // Animate the turtle!
  element.style.position = "absolute";
  function step(now) {
    let delta = (now - latest);
    latest = now;
    rotationalVelocity += rotationalAcceleration * delta;
    rotation += rotationalVelocity * delta;
    velocityLeft += acceleration * Math.cos(rotation) * delta;
    velocityTop += acceleration * Math.sin(rotation) * delta;
    positionLeft += velocityLeft * delta;
    positionTop += velocityTop * delta;
    if (positionTop < 0) {
      positionTop = -positionTop;
      velocityTop = -velocityTop;
    } else if (positionTop > 1000) {
      positionTop = 2000 - positionTop;
      velocityTop = -velocityTop;
    }
    if (positionLeft < 0) {
      positionLeft = -positionLeft;
      velocityLeft = -velocityLeft;
    } else if (positionLeft > 1000) {
      positionLeft = 2000 - positionLeft;
      velocityLeft = -velocityLeft;
    }
    element.style.left = positionLeft + "px";
    element.style.top = positionTop + "px";
    element.style.transform = "rotate(" + rotation + "rad)";
    requestAnimationFrame(step);
  }

  requestAnimationFrame(step);

  // Create an ActionManager with the default ActionSets
  let actionManager = new ActionManager(true);

  // Switch to the action set that handles play situations for flat displays
  actionManager.switchToActionSet("/action-set/flat-playing");

  // The app can listen for a single action
  actionManager.addActionListener("/action/move", (actionPath, active, actionParameters, inputSource) => {
    console.log("move event", actionPath, active, actionParameters, inputSource);
    if (active) {
      acceleration = actionParameters.z / 1000;
    } else {
      acceleration = 0;
    }
  });
  actionManager.addActionListener("/action/rotate", (actionPath, active, actionParameters, inputSource) => {
    console.log("rotate event", actionPath, active, actionParameters, inputSource);
    if (active) {
      rotationalAcceleration = actionParameters.y / 100000;
    } else {
      rotationalAcceleration = 0;
    }
  });

  // The app can list for events using semantic path wildcards
  actionManager.addActionListener("/action/menu/*", (actionPath, active, actionParameters, inputSource) => {
    console.log("Menu action event", event, ...params);
  });

  // The app can poll for action state
  actionManager.actionIsActive("/action/jump"); // returns bool

  // Or, if the app needs to poll for action-specific info:
  actionManager.getActionState("/action/jump");
  /*
    returns
    {
      action: Action,
      sources: [Device, ...],
      action specific params...
    }
  */

  console.log("Waiting for actions");
}
