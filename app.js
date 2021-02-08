'use strict';
// 참고로 코드를 class나 module을 사용해 구성한다면 'use strict'를 생략해도 됨.
// 자동으로 엄격모드가 적용되기 때문.

// 참고로 한 모듈 내에서 다른 모듈안에 있는 class의 인스턴스를 생성해주면 import하는 코드를 자동완성해줌.
// VSCode 개좋네ㅋㅋ
// 근데 저 url을 제대로 안 작성해준다. .js를 빼먹고 자동완성 해버림. 에휴 ㅅㅂ 그럼 그렇지
import {
  WaveGroup
} from './wavegroup.js';



// 주요모듈에는 항상 기본이 되는 class App을 정의 및 브라우저 로드 후 인스턴스 생성을 해줄 것.
class App {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.waveGroup = new WaveGroup();
    // 항상 외부 모듈의 클래스에서 정의한 메소드를 animate 함수에서 돌려서 캔버스에 렌더해주거나
    // 아니면 App class내의 다른 메소드 안에서 사용해야 한다면
    // 이 App class의 생성자 내에서 인스턴스를 생성부터 하고!!! 
    // 먼저 생성부터 해주고 animate 같은 곳에 해당 메소드를 호출해줄 것!

    window.addEventListener('resize', this.resize.bind(this), false);
    this.resize();

    requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * 2;
    this.canvas.height = this.stageHeight * 2;
    this.ctx.scale(2, 2);

    this.waveGroup.resize(this.stageWidth, this.stageHeight);
    // 이 this.wave 안에 있는 resize 메소드를 호출하면 일단 무슨 일이 생기냐면, stage의 정가운데 x, y좌표값을 구한 뒤,
    // 그걸 this.wave 안에 있는 init() 메소드에 넘겨서 stage의 정가운데 좌표값을 x, y값으로 갖는 Point 인스턴스를 하나 생성해줌.
    // 이제 이거를 this.waveGroup.resize()로 하니까 6개의 point들의 y좌표값이 왕복운동을 하고, 그것들이 곡선함수로 이어져서 출렁거리는 애니메이션이 그려짐.
  }

  // requestAnimationFrame에 전달되는 콜백함수에는
  // DOMHighResTimeStamp 라는 단일 인자가 전달된다고 하는데 이게 t인것 같음.
  // 이게 뭐냐면 requestAnimationFrame이 해당 콜백함수 실행을 시작할 때의 시점
  // 또는 리페인트 전 리플로우하기 까지 걸린 시간? 을 ms단위로 나타내는 인자 같음.
  animate(t) {
    // stageWidth/Height 만큼 지우는 이유는, 캔버스 사이즈는 레티나 디스플레이 때문에 사이즈 전체가 4배로 되버렸기 때문에
    // 딱 브라우저 사이즈에 해당하는 만큼만 지우려면 stage의 사이즈로 지우는 게 맞겠지?
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);

    this.waveGroup.draw(this.ctx);
    // 얘를 1초에 60번 호출하게 되면 어떻게 되겠어?
    // this.wave.init()메소드에서 생성한 Point 인스턴스의 y좌표값을 Point.update()가 사인함수의 리턴값 따라 계속 바뀌겠지?
    // y좌표값이 매번 바뀌니까 위아래로 운동하는 애니메이션이 그려지겠지?
    // 이거는 이제 point 하나만 움직이는 거고 우리가 할거는 간격을 가진 포인트를 여러 개 만들어서
    // 그 포인트들이 각기 다른 시차를 가지고 아래위로 움직이면, 그걸 하나의 선으로 연결할거임.
    // 그럼 웨이브가 만들어지겠지?

    requestAnimationFrame(this.animate.bind(this));
  }
}

window.onload = () => {
  new App();
};