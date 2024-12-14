import { DateTimes } from '@woowacourse/mission-utils';
import { ERROR_MESSAGE, ERROR_PREFIX } from './constants/message.js';
import {
  DAY_OF_WEEK,
  FUNCTION_INPUT_LIST,
  HOLIDAY,
  MONDAY,
  MONDAY_CLOSE_TIME,
  MONDAY_OPEN_TIME,
  OTHER_CLOSE_TIME,
  OTHER_OPEN_TIME,
  WEEKEND,
} from './constants/system.js';

export default class Validator {
  static validateFunctionInput(functionInput) {
    if (!FUNCTION_INPUT_LIST.includes(functionInput)) {
      throwError(ERROR_MESSAGE.FORMAT);
    }
  }

  static validateWeekend(day) {
    const dayOfWeek = DAY_OF_WEEK[day];
    if (WEEKEND.includes(dayOfWeek) || day === HOLIDAY) {
      throwError(
        `${ERROR_PREFIX} 12월 ${String(day).padStart(2, 0)}일 ${dayOfWeek}요일은 등교일하는 일이 아닙니다.`,
      );
    }
  }

  static validateName(name, nameList) {
    if (!nameList.includes(name)) {
      throwError(ERROR_MESSAGE.NOT_EXIST_NAME);
    }
  }

  static validateAlreadyAttendance(name, todayAttendanceList) {
    if (todayAttendanceList.includes(name)) {
      throwError(ERROR_MESSAGE.ALREADY_ATTENDANCE);
    }
  }

  static validateGoingFormat(goingTime) {
    const regExp = /\d\d:\d\d/;

    if (!regExp.test(goingTime)) {
      throwError(ERROR_MESSAGE.FORMAT);
    }
  }

  static validateGoingTime(goingTime, day) {
    const dayOfWeek = DAY_OF_WEEK[day];
    if (dayOfWeek === MONDAY) {
      if (goingTime > MONDAY_CLOSE_TIME || goingTime < MONDAY_OPEN_TIME) {
        throwError(ERROR_MESSAGE.NOT_PLAY_TIME);
      }
      return;
    }
    if (goingTime > OTHER_CLOSE_TIME || goingTime < OTHER_OPEN_TIME) {
      throwError(ERROR_MESSAGE.NOT_PLAY_TIME);
    }
  }

  static checkFuture(day) {
    const today = DateTimes.now().getDate();
    if (today < day) {
      throwError(ERROR_MESSAGE.FUTURE);
    }
  }
}

function throwError(error) {
  throw new Error(error);
}
