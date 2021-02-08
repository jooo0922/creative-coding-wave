'use strict'

import {
  Point
} from './point.js';

export class Wave {
  // Wave에도 index값을 넘겨 줌.
  constructor(index, totalPoints, color) {
    this.index = index;
    this.totalPoints = totalPoints; // 각각의 웨이브마다 총 몇개의 point들을 생성할 것인지 정의해줌.
    this.color = color;
    this.points = [];
  }

  // 애니메이션을 만들 때 가장 중요한 것:
  // '내가 그리고자 하는 애니메이션의 좌표값을 가져오는 것'
  // 그러기 위해서는 애니메이션의 크기를 먼저 알아야 됨. 그래서 stage의 width, height값을 가져오는 게 중요
  resize(stageWidth, stageHeight) {
    this.stageWidth = stageWidth;
    this.stageHeight = stageHeight;

    // 지금 wave가 화면의 중앙에 그려져야 하기 때문에 stage 중앙의 x, y좌표값을 구한 것.
    this.centerX = stageWidth / 2;
    this.centerY = stageHeight / 2;

    // Point 사이의 간격은 전체 스테이지 넓이에서 totalPoints 만큼을 나눈 값이 되겠지 당연히?
    // 6개의 Points로 전체 간격을 나눈다면 나눠진 간격이 5개가 나온다고 볼 수 있겠지
    this.pointGap = this.stageWidth / (this.totalPoints - 1);

    // 이렇게 center 좌표값이 정해지고 나서, 즉 resize 이벤트가 일어난 다음에 
    // init() 메소드를 실행시켜서 Point를 생성해 줌.
    this.init();
  }

  init() {
    // 이 부분은 테스트로 가운데에 빨간 Point 생성해주려고 쓴거고, 실제로 wave 만들때는 안쓰는거니 comment 처리함.
    // resize에서 정의한 stage 중앙의 좌표값을 Point 인스턴스의 x, y좌표값으로 넘겨줘서
    // 각각의 Point가 화면 중간을 기준으로 그려질 수 있도록 정의해 줍니다.
    // this.point = new Point(
    // this.centerX,
    // this.centerY
    // );

    this.points = [];

    // 이제 for loop로 point들의 간격에 맞춰 points를 그려줌
    for (let i = 0; i < this.totalPoints; i++) {
      const point = new Point(
        this.index + i,
        this.pointGap * i, // 각각의 point의 x좌표값은 point간 간격만큼 띄워서 생성하라는 거겠지.
        this.centerY // 그러나 point들의 y좌표값은 모두 똑같이 stage의 가운데에 생성하는거고
      );
      this.points[i] = point; // 이거는 현재 비어있는 points 배열에서 i번째 인덱스에 생성된 point 인스턴스를 담아놓으라는 거
    }
  }

  // 이제 실제로 캔버스에 그리는 메소드
  draw(ctx) {
    // 이 부분도 테스트로 가운데 빨간 point 생성해주려고 쓴 것.
    // 웨이브를 그리기 전에 웨이브의 움직임이 어떻게 진행될 것인가를 빨간색 Point 하나만 생성해서 
    // 화면 중간에 빨간색 점을 하나 그려서 확인해보자
    // ctx.beginPath();
    // ctx.fillStyle = '#ff0000';
    // this.point.update(); // 얘는 정확히 말하면 point의 y좌표값을 Math.sin()을 통해 업데이트 해주는 함수 
    // ctx.arc(this.point.x, this.point.y, 30, 0, Math.PI * 2);
    // ctx.fill();

    // 이제 point 갯수가 한개가 아니라 여러개(여기서는 6개)일 때 얘내들을 모두 그려주는 거로 만들어줘야 함.
    ctx.beginPath();
    ctx.fillStyle = this.color; // 컬러값도 일단 현재 wave의 컬러값으로 해줄 것.

    // 얘내는 맨 첫번째 point의 x, y좌표값을 담아놓은 변수
    let prevX = this.points[0].x;
    let prevY = this.points[0].y

    // 지금 맨 첫번째 point의 x, y좌표값에서 path를 시작하겠다는 뜻이지?
    ctx.moveTo(prevX, prevY);

    // 여기서는 첫 번째 포인트와 마지막 포인트는 가만히 두고, 가운데에 있는 포인트들의 y값만 update()해서 움직여줄 것
    // 그래서 우선 for loop에서 let i = 1 부터 시작함으로써, points 배열의 0번 index에 담긴 point = 첫번째 포인트를 제외시킴
    for (let i = 1; i < this.totalPoints; i++) {
      // 또한 if 조건문에서 totlePoins - 1 즉, points 배열의 마지막 인덱스에 담긴 point = 마지막 포인트도 제외시킴.
      if (i < this.totalPoints - 1) {
        // 이렇게 for loop와 if 조건문을 거치면서 첫번째와 마지막 포인트들은 제외시킴 (6 - 1 = 5, i < 5면, 4번 인덱스까지만 포함하니까.)
        // 결과적으로 가운데에 있는 point들만 update()를 호출해서 y좌표값을 아래위 왕복운동 애니메이션을 시킴.
        this.points[i].update();
      }

      // 지금 포인트 6개끼리만 직선으로 쭉쭉 연결해주면 되는거 아닌가? cx, cy는 뭐고 왜 얘내들을 연결해주는 거지?
      // 나중에 곡선 함수를 사용해서 곡선을 만들려고 할 때 이전 point와 현재 point의 좌표값만 줘버리면 
      // 곡선이 아니라 두 point의 좌표를 잇는 직선만 그려지게 됨.
      // 곡선 함수로 곡선을 그리려면 그 사이의 중간 좌표값이 필요하다.
      // 그래서 (이전 point 좌표값 + 현재 point 좌표값) / 2 하면, 두 좌표값 사이의 중간 좌표값을 얻을 수 있다.
      // 그리고 그 좌표값으로 lineTo를 해서 중간 좌표값도 연결시켜 주는 것. 
      const cx = (prevX + this.points[i].x) / 2;
      const cy = (prevY + this.points[i].y) / 2;
      // 이 공식을 쉽게 이해하려면? 3과 7사이의 중간값은 5지? (3 + 7) / 2 = 5 다. 뭔지 감이 오지?

      // ctx.lineTo(cx, cy); // 이거는 직선으로 이어지는 wave를 그릴 때 쓰고,
      // 곡선을 그릴때는 quadraticCurveTo() api를 사용하면 됨.
      ctx.quadraticCurveTo(prevX, prevY, cx, cy); // 이렇게 이전 x, y 좌표값, 중간 x, y 좌표값을 각각 인자로 전달해야 됨.
      // ctx.quadraticCurveTo(prevX, prevY, this.points[i].x, this.points[i].y);
      // 만약에 이전 좌표값과 현재 좌표값을 각각 인자로 전달하게 되면, 얘내를 직선으로 연결한 웨이브밖에 안나옴.
      // quadraticCurveTo를 사용해서 곡선을 만들고 싶다? 그러면 항상 이전 좌표값과 현재 좌표값 사이에 중간 좌표값을 만들어주고
      // '이전 좌표값과 중간좌표값만' parameter로 전달해줘야 함. 그래야 '곡선'으로 그려짐!

      // 얘내는 중간 좌표값을 구하고 lineTo로 연결하고 나면 이전 포인트의 좌표값으로 prevX,Y를 갱신해주는 거
      prevX = this.points[i].x;
      prevY = this.points[i].y;
    }

    ctx.lineTo(prevX, prevY); // for loop를 다 돌고 빠져나왔다면 prevX,Y에는 this.points[5].x,y 즉, 마지막 포인트의 좌표값이 들어있겠지
    ctx.lineTo(this.stageWidth, this.stageHeight); // stage의 맨 오른쪽 아래 끝지점 좌표로 연결함.
    ctx.lineTo(this.points[0].x, this.stageHeight); // stage의 맨 밑 모서리 중에서도 첫번째 point의 x좌표값에 해당하는 지점까지 연결 
    ctx.fill(); // 웨이브가 stage의 밑부분으로 path가 이어졌으니까 밑부분에 색이 채워지겠지? 
    ctx.closePath();
  }
}