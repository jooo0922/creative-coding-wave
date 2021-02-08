'use strict';

import {
  Wave
} from './wave.js';

// wave를 여러 개 만들기 위해서 WaveGroup이라는 클래스 생성
export class WaveGroup {
  constructor() {
    this.totalWaves = 3; // 총 웨이브 갯수
    this.totalPoints = 6; // 몇개의 포인트를 하나의 웨이브에 그릴 것인지 정의

    this.color = ['rgba(255, 0, 0, 0.4)', 'rgba(255, 255, 0, 0.4)', 'rgba(0, 255, 255, 0.4)'];
    // 0.4 정도의 투명도를 가진 서로 다른 색깔의 웨이브들이 겹치면서 아름답게 보이도록 임의로 3개의 파란색 배열들을 만들어짐

    this.waves = []; // for loop에서 생성할 웨이브들을 담아놓을 배열

    for (let i = 0; i < this.totalWaves; i++) {
      // totalWaves 갯수만큼 Wave를 생성해 줌.
      const wave = new Wave(
        i,
        this.totalPoints,
        this.color[i]
      );
      this.waves[i] = wave; // 여기도 현재 비어있는 waves 배열에 [i]번째 인덱스에 새롭게 생성한 wave 인스턴스를 넣어주라는 거지?
    }
  }

  // WaveGroup도 Wave와 동일하게 resize(), draw() 메소드를 가짐
  // 그래서 각각의 메소드가 실행되면 WaveGroup안에 있는 전체 Wave 갯수만큼 메소드를 실행시켜줌.
  resize(stageWidth, stageHeight) {
    for (let i = 0; i < this.totalWaves; i++) {
      const wave = this.waves[i];
      wave.resize(stageWidth, stageHeight);
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.totalWaves; i++) {
      const wave = this.waves[i];
      wave.draw(ctx);
    }
  }
}