import { Request } from 'express';
import { Response } from 'express';

import { fillAttendance } from './attendance.DAL';

/**
 * Fill Students Attendance
 * @param req => Express Request
 * @param res => Express Response
 */
class studentController {
  async fillAttendance(req: Request, res: Response) {
    try {
      const response = fillAttendance(req.body);
      res.status(200).send({ success: true, data: { statusCode: 200, message: 'Attendance Filled Successfully' } });
    } catch (error) {
      res.status(500).send({ success: false, error: { statusCode: 500, message: error } });
    }
  }
}
export default studentController;
// Testing
