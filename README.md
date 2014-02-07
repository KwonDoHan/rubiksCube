Rubik's Cube
------------

HTML5 관련 책을 보다가 문득 Rubik's Cube를 만들기에 좋을 것 같고 재미있을 것 같다는 생각이 들어 시작했다.
처음 시작했을 때 생각했던 것들을 모두 만들지는 못했지만, 시간이 지나면 잊어버리기 일쑤인데다 볼륨이 커지면 그냥 덮어버릴 것 같아서 조금이나마 기록해 두고자 한다.

터치(touch) 이벤트를 사용하는 모바일 기기에서도 지원하도록 코딩했지만 아직까지는 iOS만 정상 동작한다. Android 모바일 기기는 테스트하기가 쉽지 않아(내 것이 없다. ㅠㅠ) 제대로 동작하지 않는다는 정도만 알고 있을 뿐이다.

> 소스 코드와 함께 앞으로 얘기할 내용들은 브라우저(browser) 호환성에 대해서는 고려되지 않았음을 먼저 밝혀둔다. 다만, *Firefox*에서는 정상적으로 볼 수 있음을 보장한다.

## 마우스에 따라 회전하기 ##

Rubik's Cube를 단계별로 만들어 보자. 먼저 만들어볼 것은 일정한 영역에 마우스를 드래그(drag)했을 때, 큐브가 회전할 수 있도록 하기 위한 작업이다.

먼저, HTML 문서는 아래와 같은 DOM(Document Object Model) 구조를 만들고, 적당한 스타일(style)을 적용하자.

```html
<body>
  <div id="container">
    <div id="control">
    </div>
  </div>
</body>
```

`container`는 마우스의 움직임을 잡아내려는 영역이고, `control` 영역 내에 큐브를 만들어볼 생각이다.
따라서, 우선은 큐브를 만들기 앞서 `control` 영역을 회전시켜보자.

1. `container` 영역에 마우스 이벤트를 추가
    + mousedown / mousemove / mouseup 이벤트
    + mousemove 이벤트에서 마우스의 움직인 좌표값 획
2. 마우스의 움직임에 따라 `control` 영역의 CSS 속성을 변경

```javascript
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
```

> `css()` 함수는 첫 번째 인자로 주어진 엘리먼트(element)에 두 번째 인자로 지정된 스타일을 적용하는 함수로, [impress.js](https://github.com/bartaz/impress.js)에서 발췌하여 그대로 사용했다.
