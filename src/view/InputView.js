import { Console } from '@woowacourse/mission-utils';
import { INPUT_MESSAGE } from '../constants/message.js';

export default class InputView {
  static functionNumber() {
    return Console.readLineAsync(INPUT_MESSAGE.MENU);
  }

  static name() {
    return Console.readLineAsync(INPUT_MESSAGE.NAME);
  }

  static goingTime() {
    return Console.readLineAsync(INPUT_MESSAGE.GOING_TIME);
  }

  static changeName() {
    return Console.readLineAsync(INPUT_MESSAGE.CHANGE_NAME);
  }

  static changeDay() {
    return Console.readLineAsync(INPUT_MESSAGE.CHANGE_DAY);
  }

  static changeTime() {
    return Console.readLineAsync(INPUT_MESSAGE.CHANGE_TIME);
  }
}
