domReady(function () {
  "use strict";

  var control = document.getElementById("control");

  // 큐브의 초기 회전 값 지정
  css(control, {
    transform: "rotateX(-30deg) rotateY(40deg)"
  });

  // 큐브의 초기 면(surface) 색상
  var initColors = {
    front: "white", left: "green", back: "yellow", right: "blue", down: "red", up: "orange"
  };

  var surfaces = document.getElementsByClassName("surface");
  for (var i = 0; i < surfaces.length; i++) {
    css(surfaces[i], {
      backgroundColor: initColors[surfaces[i].dataset.surface]
    });
  }

  //
  //
  //
  var cubieElements = document.getElementsByClassName("cubie");
  var rotatingPane = document.getElementById("rotating");
  var targetCubies = [];
  var rotatingDir = "";
 
  // elem 엘리먼트가 포함된 큐브의 한 면을 direction 방향으로 duration 시간동안 회전한다.
  var rotateCubies = window.rotateCubies = function (elem, direction, duration) {
    direction = direction || rotatingDir;
    duration = duration || 0.2;

    if (direction == "") return;

    rotatingDir = direction;
    var dirAxis = direction.charAt(0).toUpperCase();

    // 회전하려는 대상 cubie elements를 확인한다.
    targetCubies = [];
    for (var i = 0; i < cubieElements.length; i++) {
      switch (dirAxis) {
        case "X":
          if ( cubieElements[i].dataset.x == elem.dataset.x )
            targetCubies.push(cubieElements[i]);
          break;
        case "Y":
          if ( cubieElements[i].dataset.y == elem.dataset.y )
            targetCubies.push(cubieElements[i]);
          break;
        case "Z":
          if ( cubieElements[i].dataset.z == elem.dataset.z )
            targetCubies.push(cubieElements[i]);
          break;
      }
    }
    prepareRotatingPane(targetCubies);

    css(rotatingPane, { animationName: direction, animationDuration: duration + "s" });      
  }

  // 애니메이션이 끝난 다음에 처리해야 할 내용에 대해서 이벤트를 걸어둔다.
  addEvent(rotatingPane, "AnimationEnd", function() {
    //
    changeSurfaceColors(rotatingDir, targetCubies);

    css(this, { animationName : "" });
    emptyRotatingPane();

    rotatingDir = "";
    targetCubies = [];
  });

  function prepareRotatingPane (elems) {
    elems = elems || targetCubies;

    for (var i = 0; i < elems.length; i++) {
      elems[i].parentNode.removeChild(elems[i]);
      rotatingPane.appendChild(elems[i]);
    }
  }

  function emptyRotatingPane() {
    while (rotatingPane.firstChild) {
      var elem = rotatingPane.firstChild;
      rotatingPane.removeChild(elem);
      rotatingPane.parentNode.appendChild(elem);
    }
  }
});