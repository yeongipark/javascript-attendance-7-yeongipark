import { DateTimes } from '@woowacourse/mission-utils';
import { parseFileContent } from '../util/fileUtil.js';
import {
  ABSENCE,
  ATTENDANCE,
  ATTENDANCE_NUMBER,
  DAY_OF_WEEK,
  HOLIDAY,
  MEETING,
  PERCEPTION,
  PERCEPTION_NUMBER,
  WARNING_NUMBER,
  WEEKEND,
  MEETING_NUMBER,
  PERCEPTION_TO_ABSENCE,
  WARNING,
  WEEDING_NUMBER,
  MONDAY,
  MONDAY_OPEN_TIME,
  OTHER_OPEN_TIME,
} from '../constants/system.js';

export default class Attendance {
  #attendanceList = [];

  async init() {
    const data = await parseFileContent('attendances.csv');
    this.#attendanceList = this.#parseDate(data);
  }

  getNameList() {
    return this.#attendanceList.map((info) => info.name);
  }

  // 오늘 출석이 가능한지
  isAttendance(name) {
    const todayDate = DateTimes.now().getDate();
    const attendanceList = this.#getSpecificAttendance(name);
    const dayList = attendanceList.map((info) => +info.day);
    if (dayList.includes(todayDate)) return false;
    return true;
  }

  getAttendanceList() {
    return this.#attendanceList;
  }

  changeAttendanceTime(name, day, time) {
    const beforeData = this.getBeforeData(name, day);
    const beforeClock = `${beforeData.hour}:${beforeData.minute}`;
    const beforeStatus = this.#getStatus(
      beforeClock.hour,
      beforeClock.minute,
      +day,
    );
    const hour = time.slice(0, 2);
    const minute = time.slice(3);

    const status = this.#getStatus(hour, minute, +day);

    const findDay = this.#attendanceList.findIndex(
      (info) => +info.day === +day && info.name === name,
    );
    this.#attendanceList[findDay].hour = hour;
    this.#attendanceList[findDay].minute = minute;

    return {
      day,
      beforeClock,
      beforeStatus,
      afterClock: time,
      afterStatus: status,
    };
  }

  setAttendance(name, time) {
    const today = DateTimes.now().getDate();
    const hour = time.slice(0, 2);
    const minute = time.slice(3);
    const status = this.#getStatus(+hour, +minute);
    if (status === '결석') return;
    this.#attendanceList.push({
      name,
      day: String(today).padStart(2, 0),
      minute,
      hour,
    });

    return { day: today, clock: time, status };
  }

  getBeforeData(name, day) {
    return this.#attendanceList
      .filter((info) => +info.day === +day)
      .find((info) => info.name === name);
  }

  #getStatus(hour, minute, day) {
    const today = day ?? DateTimes.now().getDate();
    const dayOfWeek = DAY_OF_WEEK[today];
    if (dayOfWeek === MONDAY) {
      if (+hour > MONDAY_OPEN_TIME) return '결석';
      if (+hour === MONDAY_OPEN_TIME && +minute > 30) return '결석';
    } else if (+hour === OTHER_OPEN_TIME && +hour > 30) {
      return '결석';
    }
    if (+minute > 5 && +minute <= 30) return '지각';
    return '출석';
  }

  #getSpecificAttendance(name) {
    return this.#attendanceList.filter((info) => info.name === name);
  }

  #parseDate(data) {
    const parsed = data.map((info) => {
      const day = info.datetime.slice(8, 10);
      const hour = info.datetime.slice(11, 13);
      const minute = info.datetime.slice(14);
      return {
        name: info.nickname,
        day,
        minute,
        hour,
      };
    });
    return parsed;
  }

  getSpecificAttendanceList(name) {
    const attendanceList = this.#getSpecificAttendance(name);
    const list = attendanceList.map((info) => {
      let status = '';
      const dayOfWeek = DAY_OF_WEEK[+info.day];
      if (+info.minute > ATTENDANCE_NUMBER) status = '결석';
      else if (+info.minute > PERCEPTION_NUMBER) status = '지각';
      else status = '출석';
      return {
        day: info.day,
        time: `${info.hour}:${info.minute}`,
        status,
        dayOfWeek,
      };
    });
    this.#fillList(list);
    return list;
  }

  // 없는 날짜는 결석으로 채우기
  #fillList(list) {
    const dayList = list.map((info) => +info.day);
    const todayDate = +DateTimes.now().getDate();
    for (let i = 1; i < todayDate; i += 1) {
      const dayOfWeek = DAY_OF_WEEK[i];
      if (dayList.includes(i)) continue;
      if (i === HOLIDAY || WEEKEND.includes(dayOfWeek)) continue;
      list.push({
        day: String(i).padStart(2, 0),
        time: '--:--',
        status: '결석',
        dayOfWeek,
      });
    }
    list.sort((a, b) => +a.day - +b.day);
  }

  getStatusList(name) {
    const list = this.getSpecificAttendanceList(name);
    let attendance = 0;
    let perception = 0;
    let absence = 0;
    list.forEach((info) => {
      const status = info.status;
      switch (status) {
        case ATTENDANCE:
          attendance += 1;
          break;
        case PERCEPTION:
          perception += 1;
          break;
        case ABSENCE:
          absence += 1;
          break;
      }
    });
    return { attendance, perception, absence };
  }

  getTodayAttendance() {
    const today = DateTimes.now().getDate();

    const list = this.#attendanceList.filter((info) => +info.day === today);
    return list.map((info) => info.name);
  }

  getAllStatus() {
    const allName = this.getNameList();
    const result = [];
    allName.forEach((name) => {
      const nameList = result.map((info) => info.name);
      if (nameList.includes(name)) return;
      let { perception, absence } = this.getStatusList(name);
      let newAbsence = absence + Math.floor(perception / PERCEPTION_TO_ABSENCE);
      if (newAbsence > WEEDING_NUMBER) return;
      if (newAbsence >= MEETING_NUMBER)
        result.push({ name, perception, absence, status: MEETING });
      else if (newAbsence >= WARNING_NUMBER)
        result.push({ name, perception, absence, status: WARNING });
    });

    return this.#sortAllStatus(result);
  }

  #sortAllStatus(list) {
    const sortedList = list.sort((a, b) => {
      const aNewPerception =
        a.perception - Math.floor(a.perception / PERCEPTION_TO_ABSENCE);
      const bNewPerception =
        b.perception - Math.floor(a.perception / PERCEPTION_TO_ABSENCE);
      const aNewAbsence =
        a.absence + Math.floor(a.perception / PERCEPTION_TO_ABSENCE);
      const bNewAbsence =
        b.absence + Math.floor(b.perception / PERCEPTION_TO_ABSENCE);
      if (aNewAbsence > bNewAbsence) return -1;
      else if (aNewAbsence < bNewAbsence) return 1;
      else if (aNewAbsence === bNewAbsence) {
        if (aNewPerception > bNewPerception) return -1;
        else if (aNewPerception < bNewPerception) return 1;
        else if (aNewPerception === bNewPerception) {
          if (a.name > b.name) return 1;
          if (a.name < b.name) return -1;
        }
      }
    });
    return sortedList;
  }
}
