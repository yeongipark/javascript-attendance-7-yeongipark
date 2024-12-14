import Validator from '../Validator.js';
import InputView from '../view/InputView.js';
import OutputView from '../view/OutputView.js';
import Attendance from '../model/AttendanceModel.js';
import { DateTimes } from '@woowacourse/mission-utils';

export default class AttendanceController {
  #attendance;
  #functionNumber;
  #flag = true;

  constructor() {
    this.#attendance = new Attendance();
  }

  async run() {
    while (this.#flag) {
      await this.#attendance.init();
      this.#flag = await this.#processInputFunctionNumber();
      await this.#play();
    }
  }

  async #processInputFunctionNumber() {
    OutputView.start();
    const number = await InputView.functionNumber();
    Validator.validateFunctionInput(number);
    this.#functionNumber = number;
    if (number === 'Q') return false;
    return true;
  }

  async #play() {
    if (this.#functionNumber === '1') {
      await this.#checkAttendance();
    }

    if (this.#functionNumber === '2') {
      await this.#changeAttendance();
    }

    if (this.#functionNumber === '3') {
      await this.#specificList();
    }

    if (this.#functionNumber === '4') {
      this.#warning();
    }
  }

  async #changeAttendance() {
    const name = await InputView.changeName();
    const nameList = this.#attendance.getNameList();
    Validator.validateName(name, nameList);
    const date = await InputView.changeDay();
    Validator.checkFuture(date);
    Validator.validateWeekend(date);
    const time = await InputView.changeTime();
    Validator.validateGoingFormat(time);

    const { day, beforeClock, beforeStatus, afterClock, afterStatus } =
      this.#attendance.changeAttendanceTime(name, date, time);

    OutputView.changeAttendance(
      day,
      beforeClock,
      beforeStatus,
      afterClock,
      afterStatus,
    );
  }

  async #checkAttendance() {
    Validator.validateWeekend(DateTimes.now().getDate());
    const nickname = await InputView.name();
    const nameList = this.#attendance.getNameList();
    Validator.validateName(nickname, nameList);
    Validator.validateAlreadyAttendance(
      nickname,
      this.#attendance.getTodayAttendance(),
    );
    const time = await InputView.goingTime();
    Validator.validateGoingFormat(time);
    Validator.validateGoingTime(time, DateTimes.now().getDate());
    const { day, clock, status } = this.#attendance.setAttendance(
      nickname,
      time,
    );
    OutputView.attendance(day, clock, status);
  }

  async #specificList() {
    const name = await InputView.name();
    const nameList = this.#attendance.getNameList();
    Validator.validateName(name, nameList);
    const list = this.#attendance.getSpecificAttendanceList(name);
    OutputView.specificData(name, list);
    const { attendance, perception, absence } =
      this.#attendance.getStatusList(name);
    OutputView.status({ attendance, perception, absence });
  }

  #warning() {
    const allStatus = this.#attendance.getAllStatus();
    OutputView.waring(allStatus);
  }
}
