import AttendanceController from './controller/AttendanceController.js';

class App {
  async run() {
    const absenceController = new AttendanceController();
    await absenceController.run();
  }
}

export default App;
