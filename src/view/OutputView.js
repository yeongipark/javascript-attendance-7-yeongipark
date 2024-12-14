import { Console, DateTimes } from '@woowacourse/mission-utils';
import { DAY_OF_WEEK, EMPTY } from '../constants/system.js';

export default class OutputView {
  static start() {
    const todayDate = DateTimes.now().getDate();
    const dayOfWeek = DAY_OF_WEEK[todayDate];
    Console.print(
      `오늘은 12월 ${todayDate}일 ${dayOfWeek}요일입니다. 기능을 선택해 주세요.`,
    );
  }

  static attendance(day, clock, status) {
    const dayOfWeek = DAY_OF_WEEK[day];
    Console.print(
      `\n12월 ${String(day).padStart(2, 0)}일 ${dayOfWeek}요일 ${clock} (${status})\n`,
    );
  }

  static changeAttendance(
    day,
    beforeClock,
    beforeStatus,
    afterClock,
    afterStatus,
  ) {
    const dayOfWeek = DAY_OF_WEEK[day];
    Console.print(
      `\n12월 ${day}일 ${dayOfWeek}요일 ${beforeClock} (${beforeStatus}) -> ${afterClock} (${afterStatus}) 수정 완료!\n`,
    );
  }

  static specificData(name, list) {
    Console.print(`이번 달 ${name}의 출석 기록입니다.\n`);
    list.forEach((info) => {
      const dayOfWeek = DAY_OF_WEEK[+info.day];
      Console.print(
        `12월 ${info.day}일 ${dayOfWeek}요일 ${info.time} (${info.status})`,
      );
    });
  }

  static status({ attendance, perception, absence }) {
    this.newLine();
    Console.print(`출석 : ${attendance}회`);
    Console.print(`지각 : ${perception}회`);
    Console.print(`결석 : ${absence}회`);
    this.newLine();
    const newAbsence = absence + Math.floor(perception / 3);
    if (newAbsence > 5) {
      Console.print('제적 대상자입니다.');
      this.newLine();
    } else if (newAbsence >= 3) {
      Console.print('면담 대상자입니다.');
      this.newLine();
    } else if (newAbsence >= 2) {
      Console.print('경고 대상자입니다.');
      this.newLine();
    } else return;
  }

  static waring(list) {
    this.newLine();
    Console.print('제적 위험자 조회 결과');
    list.forEach((info) => {
      Console.print(
        `- ${info.name}: 결석 ${info.absence}회, 지각 ${info.perception}회 (${info.status})`,
      );
    });
    this.newLine();
  }

  static error(errorMessage) {
    Console.print(errorMessage);
  }

  static newLine() {
    Console.print(EMPTY);
  }
}
