'use strict';

// 웨이브를 그린다는 건 '웨이브 자체'를 그린다기 보단
// 각각의 간격을 가진 좌표를 하나씩 만들어서 그 좌표들의 y값을 아래위로 이동시키고
// 각각의 좌표를 하나의 선으로 연결하는, 그런 걸 그린다고 생각하면 쉬울 거 같다.
// 그래서 Point라는 클래스를 만들어서 그 좌표들을 만드는거지.
export class Point {
  constructor(index, x, y) {
    this.x = x;
    this.y = y;
    this.fixedY = y;
    // 얘는 초기의 고정된 y값. Point Y방향 움직임의 중심 좌표값임. 
    // Point의 y좌표값은 얘를 중심으로 같은 간격만큼 위아래로 왕복운동함. 왕복운동의 중심점. 

    this.speed = 0.1;
    // speed에는 항상 '좌표의 이동량'을 할당해 준다고 보면 됨.
    // 여기서는 프레임마다 sin 메소드에 들어갈 radian값을 조금씩 늘려주는 애. 

    this.cur = index; // current 값, 현재값. sine함수에 넣을 현재 radian값
    // index는 현재 포인트가 한 웨이브 당 존재하는 6개의 포인트 중에서 몇 번째 포인트인지 정의해 줌.
    // point 6개가 동시에 아래위로 움직이면 웨이브처럼 안보이고 하나의 선처럼 보이겠지?
    // 그래서 각 point마다 고유의 index number를 넘겨줘서 Wave 하나가 약간의 차이를 두고 움직일 수 있게
    // 그래서 y좌표값이 다른 Point가 되도록 만든 것.
    // 이 index는 결국 어디서 전달받은 것이냐?  

    this.max = Math.random() * 100 + 150; // 얘는 150 ~ 250사이의 랜덤한 수를 받는 거. 공식 기억해!
    // this.max는 y좌표값을 얼마만큼, 어디까지 움직일 것인가에 대한 Max값, 즉 최댓값. 
  }

  // update() 메소드를 실행하면 Point가 아래 위로 움직이는 것!
  update() {
    this.cur += this.speed;
    this.y = this.fixedY + (Math.sin(this.cur) * this.max);
    /**
     * sine 함수를 써서 아래위로 움직일 수 있도록 만든 것.
     * Math.sin() 메소드는 라디안으로 주어진 각도의 사인 값인 -1과 1 사이의 수를 반환합니다.
     * 
     * 인터넷에 sine 곡선 그래프를 검색해보면, y좌표값이 
     * 1에서 -1 사이를 왔다갔다하면서 곡선을 그리는 게 보일거다. 
     * 이거 필기한 거 볼 때 구굴에 sine 곡선 그래프 검색해서 꼭 같이봐라! 
     * 그냥 글만 보면 절대 이해안감!!
     * 
     * 이 메소드는 이 sine 곡선 그래프를 구현한거임. 
     * 그니까 그래프의 x값(즉, 라디안 각도값)을 넣어주면 
     * 그에 해당하는 그래프의 y값(즉, 사인 값)을 return해주는거
     * 
     * 그럼 그래프 모양을 봐도, 1 ~ -1 ~ 1 ~ -1 ... 
     * 이 사이의 값들을 계속 왔다리갔다리 하면서 차례대로 return해주겠지?
     * 그럼 얘내를 100 ~ 250사이의 랜덤한 숫자가 담긴 max와 곱해서 왕복운동의 중심이 되는 y좌표값(fixedY)에 더한 결과가
     * 한 프레임 내에서 포인트의 최종 y좌표값이 되는거야.
     * 
     * 그리고 이 포인트의 y좌표값은 매번 프레임에 새로 그려질 때마다 
     * 1 ~ -1 까지 왕복해서 return해주는 sine값에 따라서 달라지겠지?
     * 
     * 그렇기 때문에 이 Update를 requestAnimationFrame으로 계속 돌려주면 
     * 생성된 Point가 fixedY값을 중심으로하면서 반복적으로 y축 위에 있는 특정 구간 사이를 
     * 계속 왔다갔다 왕복운동하는 애니메이션을 그릴거임. 
     * 
     * ***여기서 매우 중요한 '포인트' cur값이 처음에는 0이라고 가정하면, 
     * cur값이 프레임마다 0, 0.1, 0.2, 0.3,... 요런식으로 그려지겠지?
     * 근데 중요한 건 이 cur값은 0.1 degree로써 Math.sin();에 전달되는 게 아니라!!
     * '0.1 rad' 즉, radian 단위로써 들어가는거야!! 1rad가 대략 57.3도인 걸 감안하면,
     * 0.1 rad = 5.73도, 한마디로 각도가 5.73 degree 일 때의 sine값이 return 되겠지!
     * 
     * 왜 toRadian() 같은 유틸리티를 만들어서 전달하지 않나요? 라고 할 필요가 없는게
     * 우리가 정확한 degree값을 전달해서 뭔가를 만들어야 하는 상황이 아니잖아?
     * speed = 0.1 로 설정했으니까, 우리는 대략 0.1단위로 증가하는 radian값에 대한 sine값만 받으면 됨.
     * 중요한 건 '일정 단위로 증가하는 sine값'만 받으면 된다는 거. 그안에서 구체적으로 어떤 degree의 값을 구해야 할 필요가 없지?
     * 그니까 굳이 특정 degree를 radian으로 변환할 필요가 없는거야. 
     * 무조건 radian값이 인수로 들어간다고 toRadian() 만들어야 하나? 이렇게 생각하지 말 것!
     * 필요하면 만드는거고, 필요 없으면 만들지 않아도 된다고!
     */

    // 이게 point들이 여러 개가 되는 순간 
    // (우리는 두번째 포인트에서 다섯번째 포인트들만 update()를 해주니까. Wave의 draw()메소드에서 그렇게 제한을 줬음.)
    // 두번째 point는 cur값이 1, 1.1, 1.2, 1.3, ... 이렇게 늘어나고
    // 세번째 포인트는 cur값이 2, 2.1, 2.2, 2.3, ... 이런식으로 4개의 point가 
    // 달라진 index값에 의해 늘어나는 cur값들도 다 달라지겠지
    // cur값이 달라지만 Math.sin의 리턴값도 매 프레임마다 1 ~ -1 사이에서 point마다 각각 다른 값을 부여받을거고
    // 그럼 메 프레임마다 각각의 포인트의 y좌표값도 다르겠지
    // 이것이 point마다 y좌표값이 왕복운동을 할 때 '시차'를 만들게 되는 것
  }
}