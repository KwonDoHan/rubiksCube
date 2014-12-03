domReady(function () {
  var container = document.getElementById("container");
  var control = document.getElementById("control");

  var ctrlRotating = false;
  var sx = 0, sy = 0;
  var rx = 0, ry = 0;

  function containerMouseDown (evt) {
    evt.preventDefault();

    ctrlRotating = true;

    sx = evt.pageX;
    sy = evt.pageY;
  }

  function containerMouseMove (evt) {
    if (ctrlRotating) {
      evt.preventDefault();

      rx += -1 * (sx - evt.pageX);
      ry += (sy - evt.pageY);

      sx = evt.pageX;
      sy = evt.pageY;

      rotateControl(ry, rx);
    }
  }

  function rotateControl (xdeg, ydeg) {
    rx = ydeg, ry = xdeg;

    css(control, {
      transform: "rotateX(" + xdeg + "deg) rotateY(" + ydeg + "deg)"
    });
  }

  function containerMouseUp (evt) {
    evt.preventDefault();

    ctrlRotating = false;
  }

  addEvent(container, "mousedown", containerMouseDown);
  addEvent(container, "mousemove", containerMouseMove);
  addEvent(container, "mouseup", containerMouseUp);
});
