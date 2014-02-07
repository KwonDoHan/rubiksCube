Rubik's Cube
------------

HTML5 관련 책을 보다가 문득 Rubik's Cube를 만들기에 좋을 것 같고 재미있을 것 같다는 생각이 들어 시작했다.
처음 시작했을 때 생각했던 것들을 모두 만들지는 못했지만, 시간이 지나면 잊어버리기 일쑤인데다 볼륨이 커지면 그냥 덮어버릴 것 같아서 조금이나마 기록해 두고자 한다.

터치(touch) 이벤트를 사용하는 모바일 기기에서도 지원하도록 코딩했지만 아직까지는 iOS만 정상 동작한다. Android 모바일 기기는 테스트하기가 쉽지 않아(내 것이 없다. ㅠㅠ) 제대로 동작하지 않는다는 정도만 알고 있을 뿐이다.

> 소스 코드와 함께 앞으로 얘기할 내용들은 브라우저(browser) 호환성에 대해서는 고려되지 않았음을 먼저 밝혀둔다. 다만, *Firefox*에서는 정상적으로 볼 수 있음을 보장한다.

### 마우스에 따라 회전하기 ###

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

### CSS를 이용해 Cube 보여주기 ###

이제는 입체적으로 보이는 큐브를 웹페이지에 보여주기 위해 CSS를 이용하자.
`transform`을 이용하면 엘리먼트를 3차원으로 회전하거나 원하는 만큼 이동시킬 수 있다.
약간은 복잡해 보일 수 있지만, 키보드 옆에 메모장을 하나 두고 실제로 그려보면 어떻게 값을 지정해야 하는지 도움이 된다.

아래 코드는 `style` 태그 내의 값들 중 일부이다.
아직까지는 입체적으로 보이도록 하는 위한 작업으로 각 면에 적당한 색을 지정하지는 않았다.
각 면의 색을 칠하는 것은 나중에 javascript를 이용해서 구현할 것이다.

```css
#c101 > span[data-surface="left"]  { transform: rotateY(270deg) translate3d(   0px,  100px,   50px); }
#c112 > span[data-surface="up"]    { transform: rotateX(270deg) translate3d( 100px,    0px,  -50px); }
#c121 > span[data-surface="right"] { transform: rotateY( 90deg) translate3d(   0px,  100px,  250px); }
#c110 > span[data-surface="down"]  { transform: rotateX( 90deg) translate3d( 100px,    0px, -250px); }
#c011 > span[data-surface="front"] { transform: rotateY(  0deg) translate3d( 100px,  100px,  150px); }
#c211 > span[data-surface="back"]  { transform: rotateY(180deg) translate3d(-100px,  100px,  150px); }

#c021 > span[data-surface="front"] { transform: rotateY(  0deg) translate3d( 200px,  100px,  150px); }
#c021 > span[data-surface="right"] { transform: rotateY( 90deg) translate3d(-100px,  100px,  250px); }
```

그리고, 위에서 지정된 스타일과 관련있는 HTML 코드는 아래와 같다.
당연히 이 내용들은 모두 `control` 영역 안에 있어야 하는 내용이다.
왜냐하면 앞서 봤던 마우스의 움직임에 따라 큐브 전체를 회전시키기 위해서다.

어떤 `DIV` 내에는 하나의 `SPAN` 태그만 있다.
그리고 둘 또는 세 개가 있는 것도 있다.
이것은 실제로 루빅스큐브를 봤다면 금방 이해할 수 있을지도 모르겠지만, 큐브를 분해하면 3가지 모양의 블럭(앞으로는 cubie라고 하겠다)이 있다.
임의의 cubie는 색이 있는 면이 하나인 것도 있고 둘 또는 세 면을 가진 것이 있는데, 프로그램을 쉽게 하고자 하는 마음에 이와 같이 구성한 것이다.
즉 하나의 `DIV` 영역은 cubie 하나와 동일하다고 이해하면 된다.

```html
<div id="c111">
</div>
<div id="c101">
  <span class="surface" data-surface="left"></span>
</div>
<div id="c112">
  <span class="surface" data-surface="up"></span>
</div>
<div id="c121">
  <span class="surface" data-surface="right"></span>
</div>
<div id="c110">
  <span class="surface" data-surface="down"></span>
</div>
<div id="c011">
  <span class="surface" data-surface="front"></span>
</div>
<div id="c211">
  <span class="surface" data-surface="back"></span>
</div>
<div id="c021">
  <span class="surface" data-surface="front"></span>
  <span class="surface" data-surface="right"></span>
</div>
```

### 큐브 한 면 회전하기 ###

사용자와의 새로운 인터페이스로 cubie 위에 마우스를 드래그했을 때, 큐브의 한 면을 회전시키는 것에 대해서 알아보자.
마우스 이벤트를 추가하는 것은 마지막에 하도록 하고 이번에는 버튼을 눌렀을 때 6가지 방향으로 회전하는 애니메이션을 추가하는 것이 목표다.

회전하는 방법에 대해서 알아보기에 앞서 각 면들마다 초기 색상을 칠하는 것은 아래 코드로 간단히 끝낼 수 있다.
아래와 같이 간단히 각 면들에 색을 지정할 수 있기 위해서 미리 `data-surface`를 지정해 둔 것이다.
물론, 나중에도 이 값을 이용하는 코드가 있기는 하다.

```javascript
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
```

이제부터는 큐브의 한 면을 회전하는 `animation`을 추가해 보자.
여러 가지 방법이 있을 수 있겠지만, 나는 `rotating`이라는 아이디(ID)를 가진 `DIV` 엘리먼트를 `control` 영역 안에 추가하고, 이 엘리먼트를 회전시킬 것이다.
회전해야 하는 9개의 cubies를 `#rotating`(CSS에서 사용하는 표현) 엘리먼트의 자식(child) 노드로 이동시키고 애니메이션을 시작하면 모두가 다 함께 회전하게 된다.
그리고 애니메이션이 끝났을 때 9개의 cubies를 원래의 위치로 옮기는 것을 잊지 말자.

```html
<div id="rotating"></div>
```

아래 코드는 `#rotating` 엘리먼트의 스타일과 6가지 방향으로 회전하는 애니메이션에 대한 `keyframes`이다.
애니메이션을 적용할 때 적당한 `animation-name`을 지정하면 된다.

```css
#rotating {
  transform-style: preserve-3d;
  transform-origin: 152px 152px;
  animation-duration: 0.2s;
  animation-timing-function: linear;
}

@keyframes XCW {
  0% { transform: rotateX(0deg); }
  100% { transform: rotateX(-90deg); }
}
@keyframes YCW {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(-90deg); }
}
@keyframes ZCW {
  0% { transform: rotateZ(0deg); }
  100% { transform: rotateZ(-90deg); }
}
@keyframes XCCW {
  0% { transform: rotateX(0deg); }
  100% { transform: rotateX(90deg); }
}
@keyframes YCCW {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(90deg); }
}
@keyframes ZCCW {
  0% { transform: rotateZ(0deg); }
  100% { transform: rotateZ(90deg); }
}
```

### 큐브의 색 바꾸기 ###

큐브의 한 면을 회전하는 애니메이션이 끝난 후에 그에 맞춰 각 면의 색을 바꿈으로써 실제 회전이 완료된 듯이 보이도록 한다.

어느 cubie가 어떤 방향(clockwise, counter clockwise)으로 회전을 했는지에 따라 변경해야 할 원본과 대상에 대한 정보를 아래와 같이 미리 정의해 둔다.

```javascript
var rotateCCW = {
  "00":"20", "01":"10", "02":"00", "10":"21", "11":"11", "12":"01", "20":"22", "21":"12", "22":"02"
};
var rotateCW = {
  "00":"02", "01":"12", "02":"22", "10":"01", "11":"11", "12":"21", "20":"00", "21":"10", "22":"20"
};

var surfaceXCW  = { left: "left", right: "right", up: "back", back: "down", down: "front", front: "up" };
var surfaceXCCW = { left: "left", right: "right", up: "front", front: "down", down: "back", back: "up" };
var surfaceYCW  = { up: "up", down: "down", left: "front", front: "right", right: "back", back: "left" };
var surfaceYCCW = { up: "up", down: "down", left: "back", back: "right", right: "front", front: "left" };
var surfaceZCW  = { front: "front", back: "back", left: "up", up: "right", right: "down", down: "left" };
var surfaceZCCW = { front: "front", back: "back", left: "down", down: "right", right: "up", up: "left" };
```

> 마우스 이벤트에 따라 임의의 대상 cubie가 어느 방향으로 회전해야 하는지에 대해서는 설명을 하기보다는 소스 코드를 직접 분석해 보는 것이 더 쉽지 않을까 해서 생략한다.
