export const ERROR_PREFIX = '[ERROR]';

export const INPUT_MESSAGE = {
  NAME: '\n닉네임을 입력해 주세요.\n',
  GOING_TIME: '등교 시간을 입력해 주세요.\n',
  MENU: `1. 출석 확인
2. 출석 수정
3. 크루별 출석 기록 확인
4. 제적 위험자 확인
Q. 종료\n`,
  CHANGE_NAME: '\n출석을 수정하려는 크루의 닉네임을 입력해 주세요.\n',
  CHANGE_DAY: '수정하려는 날짜(일)를 입력해 주세요.\n',
  CHANGE_TIME: '언제로 변경하겠습니까?\n',
};

export const OUTPUT_MESSAGE = {};

export const ERROR_MESSAGE = {
  FORMAT: `${ERROR_PREFIX} 잘못된 형식을 입력하였습니다.`,
  NOT_EXIST_NAME: `${ERROR_PREFIX} 등록되지 않은 닉네임입니다.`,
  CLOSE: `${ERROR_PREFIX} 12월 14일 토요일은 등교일이 아닙니다.`,
  FUTURE: `${ERROR_PREFIX} 아직 수정할 수 없습니다.`,
  NOT_PLAY_TIME: `${ERROR_PREFIX} 캠퍼스 운영 시간에만 출석이 가능합니다.`,
  ALREADY_ATTENDANCE: `${ERROR_PREFIX} 이미 출석을 확인하였습니다. 필요한 경우 수정 기능을 이용해 주세요.`,
};
