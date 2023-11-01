import { ObjectId } from 'mongodb';

import Student from './student.model';

/**
 * Create Student in DB
 * @param studentBody => Student Object to be created.
 * @returns => New Created Student
 */
export async function createStudent(studentBody: object) {
  try {
    return await Student.create(studentBody);
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Find Student from DB
 * @param emailId => Student Email
 * @returns => Student
 *
 */
export async function findStudentByEmailId(emailId) {
  try {
    return await Student.findOne({ emailId });
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Find Students From DB
 * @returns => List of Students
 */
export async function findStudents() {
  try {
    return await Student.find().lean();
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Find Student
 * @param id => Student Id
 * @returns => Student
 */
export async function findStudentById(id: string) {
  try {
    return await Student.findById(id);
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Find BatchYear, Department and Semester Wise Student Count
 * @returns Student Count
 */
export async function getBatchDepartmentWiseData() {
  try {
    const pipeline = [
      {
        $lookup: {
          from: 'departments',
          localField: 'departmentId',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $unwind: {
          path: '$result',
        },
      },
      {
        $group: {
          _id: {
            batchYear: '$batchYear',
            department: '$result.initial',
          },
          count: {
            $sum: 1,
          },
        },
      },
      {
        $addFields: {
          TotalYearCount: '$count',
        },
      },
      {
        $group: {
          _id: '$_id.batchYear',
          branches: {
            $push: {
              dep: '$_id.department',
              totalStudent: '$count',
            },
          },
        },
      },
      {
        $addFields: {
          TotalStudents: {
            $reduce: {
              input: '$branches',
              initialValue: 0,
              in: {
                $add: ['$$value', '$$this.totalStudent'],
              },
            },
          },
        },
      },
      {
        $addFields: {
          year: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $project: {
          data: {
            $map: {
              input: '$branches',
              as: 'branch',
              in: {
                k: '$$branch.dep',
                v: '$$branch.totalStudent',
              },
            },
          },
          year: 1,
          TotalStudents: 1,
        },
      },
      {
        $project: {
          branches: {
            $arrayToObject: '$data',
          },
          year: 1,
          TotalStudents: 1,
        },
      },
    ];
    const data = await Student.aggregate(pipeline).allowDiskUse(true).exec();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Find Absent Students
 * @param requestBody => year,branch,semester,date within a Object
 * @returns => Absent Students
 */
export async function getAbsentStudentBatchYearSemesterDateWise(requestBody: { [key: string]: any }) {
  try {
    const pipeline: any = [
      {
        $lookup: {
          from: 'departments',
          localField: 'departmentId',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $unwind: {
          path: '$result',
        },
      },
      {
        $project: {
          name: 1,
          address: 1,
          batchYear: 1,
          semester: 1,
          onRoll: 1,
          emailId: 1,
          Department: '$result.name',
          DepartmentInitial: '$result.initial',
          attendance: 1,
        },
      },
      {
        $project: {
          AbsentDays: {
            $filter: {
              input: '$attendance',
              as: 'attgrt',
              cond: {
                $and: [
                  {
                    $eq: ['$$attgrt.present', false],
                  },
                  {
                    $eq: ['$$attgrt.date', requestBody.date],
                  },
                ],
              },
            },
          },
          name: 1,
          address: 1,
          batchYear: 1,
          semester: 1,
          onRoll: 1,
          emailId: 1,
          Department: '$result.name',
          DepartmentInitial: '$result.initial',
        },
      },
      {
        $match: {
          $expr: {
            $gt: [
              {
                $size: '$AbsentDays',
              },
              0,
            ],
          },
        },
      },
    ];
    if (requestBody.batch) {
      const object = {
        $match: {
          batchYear: requestBody.batch,
        },
      };
      pipeline.unshift(object);
    }
    if (requestBody.branch) {
      const object = {
        $match: {
          'result.initial': requestBody.branch,
        },
      };
      pipeline.splice(2, 0, object);
    }
    if (requestBody.semester) {
      const object = {
        $match: {
          semester: requestBody.semester,
        },
      };
      pipeline.unshift(object);
    }
    const data = await Student.aggregate(pipeline).exec();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Find Present Students
 * @param requestBody year,branch,semester within a Object
 * @returns => Students whose attendance is more then 75%
 */
export async function getMoreThen75PercentStudent(requestBody: { [key: string]: any }) {
  try {
    const pipeline: any = [
      {
        $lookup: {
          from: 'departments',
          localField: 'departmentId',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $unwind: {
          path: '$result',
        },
      },
      {
        $project: {
          totalAttendanceDay: {
            $size: '$attendance',
          },
          customArry: {
            $filter: {
              input: '$attendance',
              as: 'attgrt',
              cond: {
                $and: [
                  {
                    $eq: ['$$attgrt.present', true],
                  },
                ],
              },
            },
          },
          name: 1,
          Department: '$result.initial',
          emailId: 1,
          address: 1,
          semester: 1,
          batchYear: 1,
        },
      },
      {
        $addFields: {
          presentAttendanceDay: {
            $size: '$customArry',
          },
        },
      },
      {
        $addFields: {
          percentage: {
            $multiply: [
              {
                $divide: ['$presentAttendanceDay', '$totalAttendanceDay'],
              },
              100,
            ],
          },
        },
      },
      {
        $match: {
          percentage: {
            $gt: 75,
          },
        },
      },
      {
        $project: {
          customArry: 0,
          presentAttendanceDay: 0,
          totalAttendanceDay: 0,
        },
      },
    ];
    if (requestBody.batch) {
      const object = {
        $match: {
          batchYear: requestBody.batch,
        },
      };
      pipeline.unshift(object);
    }
    if (requestBody.semester) {
      const object = {
        $match: {
          semester: requestBody.semester,
        },
      };
      pipeline.unshift(object);
    }
    if (requestBody.branch) {
      const object = {
        $match: {
          'result.initial': requestBody.branch,
        },
      };
      pipeline.splice(2, 0, object);
    }
    const data = await Student.aggregate(pipeline).allowDiskUse(true).exec();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

/**
 * Find Vacancy Seats
 * @returns => Department,Year wise Vacancy of seat
 */
export async function getVacancySeat(requestBody) {
  try {
    const pipeline: any = [
      {
        $lookup: {
          from: 'departments',
          localField: 'departmentId',
          foreignField: '_id',
          as: 'result',
        },
      },
      {
        $unwind: {
          path: '$result',
        },
      },
      {
        $group: {
          _id: {
            batchYear: '$batchYear',
            department: '$result.initial',
          },
          count: {
            $sum: 1,
          },
          departmentTotalSeat: {
            $first: '$result.totalSeat',
          },
        },
      },
      {
        $group: {
          _id: '$_id.batchYear',
          branches: {
            $push: {
              dep: '$_id.department',
              totalStudent: '$count',
              totalStudentsIntake: '$departmentTotalSeat',
            },
          },
        },
      },
      {
        $addFields: {
          TotalStudents: {
            $reduce: {
              input: '$branches',
              initialValue: 0,
              in: {
                $add: ['$$value', '$$this.totalStudent'],
              },
            },
          },
          totalStudentsIntake: {
            $reduce: {
              input: '$branches',
              initialValue: 0,
              in: {
                $add: ['$$value', '$$this.totalStudentsIntake'],
              },
            },
          },
        },
      },
      {
        $addFields: {
          year: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
          AvailableSeat: {
            $subtract: ['$totalStudentsIntake', '$TotalStudents'],
          },
          branches: 1,
          TotalStudents: 1,
          totalStudentsIntake: 1,
          year: 1,
        },
      },
      {
        $project: {
          data: {
            $map: {
              input: '$branches',
              as: 'branch',
              in: {
                k: '$$branch.dep',
                v: {
                  totalStudent: '$$branch.totalStudent',
                  totalStudentsIntake: '$$branch.totalStudentsIntake',
                  availableStudent: {
                    $subtract: ['$$branch.totalStudentsIntake', '$$branch.totalStudent'],
                  },
                },
              },
            },
          },
          year: 1,
          TotalStudents: 1,
          totalStudentsIntake: 1,
          AvailableSeat: 1,
        },
      },
      {
        $project: {
          branches: {
            $arrayToObject: '$data',
          },
          year: 1,
          TotalStudents: 1,
          totalStudentsIntake: 1,
        },
      },
    ];
    if (requestBody.batch) {
      const object = {
        $match: {
          batchYear: requestBody.batch,
        },
      };
      pipeline.unshift(object);
    }
    if (requestBody.branch) {
      const object = {
        $match: {
          'result.initial': requestBody.branch,
        },
      };
      pipeline.splice(2, 0, object);
    }
    const data = await Student.aggregate(pipeline).allowDiskUse(true).exec();

    return data;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getBatchAndYearWiseAllocateStudent(reqBody) {
  let { departmentId, batchYear } = reqBody;

  //console.log(departmentId+" "+batchYear);

  departmentId = new ObjectId(departmentId);

  // console.log(departmentId);

  const pipeline = [
    {
      $match: {
        departmentId: departmentId,
        batchYear: batchYear,
      },
    },
    {
      $group: {
        _id: 'departmentId',
        count: {
          $sum: 1,
        },
      },
    },
  ];

  const result = await Student.aggregate(pipeline).allowDiskUse(true).exec();
  return result[0].count;
}
