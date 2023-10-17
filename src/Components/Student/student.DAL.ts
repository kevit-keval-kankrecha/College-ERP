
import * as mongoose from 'mongoose';
import Student from './student.model'


/**
 * 
 * @param studentBody => Student Object to be created.
 * @returns => Create Student
 */
export async function createStudent(studentBody) {
    try {
        return await Student.create(studentBody);

    }
    catch (error) {

    }
}

/**
 * 
 * @param emailId => Student Email
 * * @returns => Student By Given Email
 * 
 */
export async function findStudentByEmailId(emailId) {
    try {
        return await Student.findOne({ emailId });
    }
    catch (error) {
    }
}

/**
 * 
 * @returns => List of Students
 */
export async function findStudents() {
    try {
        return await Student.find().lean();
    }
    catch (error) {
    }
}

/**
 * 
 * @param id => User Id
 * @returns => User by Given Id
 */
export async function findStudentyById(id) {
    try {
        return await Student.findById(new mongoose.Types.ObjectId(id));
    }
    catch (error) {
    }
}

/**
 * 
 * @returns Count Department,Year,Semester wise Students
 */
export async function getBatchDepartmentWiseData() {
    try {
        const data = await Student.aggregate(
            [
                {
                    '$lookup': {
                        'from': 'departments',
                        'localField': 'departmentId',
                        'foreignField': '_id',
                        'as': 'result'
                    }
                }, {
                    '$unwind': {
                        'path': '$result'
                    }
                }, {
                    '$group': {
                        '_id': {
                            'batchYear': '$batchYear',
                            'department': '$result.initial'
                        },
                        'count': {
                            '$sum': 1
                        }
                    }
                }, {
                    '$addFields': {
                        'TotalYearCount': '$count'
                    }
                }, {
                    '$group': {
                        '_id': '$_id.batchYear',
                        'branches': {
                            '$push': {
                                'dep': '$_id.department',
                                'totalStudent': '$count'
                            }
                        }
                    }
                }, {
                    '$addFields': {
                        'TotalStudents': {
                            '$reduce': {
                                'input': '$branches',
                                'initialValue': 0,
                                'in': {
                                    '$add': [
                                        '$$value', '$$this.totalStudent'
                                    ]
                                }
                            }
                        }
                    }
                }, {
                    '$addFields': {
                        'year': '$_id'
                    }
                }, {
                    '$project': {
                        '_id': 0
                    }
                }, {
                    '$project': {
                        'data': {
                            '$map': {
                                'input': '$branches',
                                'as': 'branch',
                                'in': {
                                    'k': '$$branch.dep',
                                    'v': '$$branch.totalStudent'
                                }
                            }
                        },
                        'year': 1,
                        'TotalStudents': 1
                    }
                }, {
                    '$project': {
                        'branches': {
                            '$arrayToObject': '$data'
                        },
                        'year': 1,
                        'TotalStudents': 1
                    }
                }
            ]).exec();



        return data;
    }
    catch (error) {

    }
}

/**
 * 
 * @param requestBody => year,branch,semester,date within a Object
 * @returns => Absent Student List
 */
export async function getAbsentStudentBatchYearSemesterDateWise(requestBody) {
    let pipeline = []
    pipeline = [
        {
            '$lookup': {
                'from': 'departments',
                'localField': 'departmentId',
                'foreignField': '_id',
                'as': 'result'
            }
        }, {
            '$unwind': {
                'path': '$result'
            }
        }, {
            '$project': {
                'name': 1,
                'address': 1,
                'batchYear': 1,
                'semester': 1,
                'onRoll': 1,
                'emailId': 1,
                'Department': '$result.name',
                'DepartmentInitial': '$result.initial',
                'attendance': 1
            }
        }, {
            '$project': {
                'AbsentDays': {
                    '$filter': {
                        'input': '$attendance',
                        'as': 'attgrt',
                        'cond': {
                            '$and': [
                                {
                                    '$eq': [
                                        '$$attgrt.present', false
                                    ]
                                }, {
                                    '$eq': [
                                        '$$attgrt.date', requestBody.date
                                    ]
                                }
                            ]
                        }
                    }
                },
                'name': 1,
                'address': 1,
                'batchYear': 1,
                'semester': 1,
                'onRoll': 1,
                'emailId': 1,
                'Department': '$result.name',
                'DepartmentInitial': '$result.initial'
            }
        }, {
            '$match': {
                '$expr': {
                    '$gt': [
                        {
                            '$size': '$AbsentDays'
                        }, 0
                    ]
                }
            }
        }
    ]
    if (requestBody.batch) {
        const object = {
            '$match': {
                'batchYear': requestBody.batch
            }
        }
        pipeline.unshift(object)
    }
    if (requestBody.semester) {
        const object = {
            '$match': {
                'semester': requestBody.semester
            }
        }
        pipeline.unshift(object)
    }

    const data = await Student.aggregate(pipeline).exec();


    return data;
}


/**
 * 
 * @param requestBody year,branch,semester within a Object
 * @returns => Students whose attendance is more then 75%
 */
export async function getMoreThen75PercentStudent(requestBody) {
    try {
        let pipeline = [];
        pipeline = [
            {
                '$lookup': {
                    'from': 'departments',
                    'localField': 'departmentId',
                    'foreignField': '_id',
                    'as': 'result'
                }
            }, {
                '$unwind': {
                    'path': '$result'
                }
            }, {
                '$project': {
                    'totalAttendanceDay': {
                        '$size': '$attendance'
                    },
                    'customArry': {
                        '$filter': {
                            'input': '$attendance',
                            'as': 'attgrt',
                            'cond': {
                                '$and': [
                                    {
                                        '$eq': [
                                            '$$attgrt.present', true
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    'name': 1,
                    'Department': '$result.initial',
                    'emailId': 1,
                    'address': 1,
                    'semester': 1,
                    'batchYear': 1
                }
            }, {
                '$addFields': {
                    'presentAttendanceDay': {
                        '$size': '$customArry'
                    }
                }
            }, {
                '$addFields': {
                    'percentage': {
                        '$multiply': [
                            {
                                '$divide': [
                                    '$presentAttendanceDay', '$totalAttendanceDay'
                                ]
                            }, 100
                        ]
                    }
                }
            }, {
                '$match': {
                    'percentage': {
                        '$gt': 75
                    }
                }
            }, {
                '$project': {
                    'customArry': 0,
                    'presentAttendanceDay': 0,
                    'totalAttendanceDay': 0
                }
            }
        ];
        if (requestBody.batch) {
            const object = {
                '$match': {
                    'batchYear': requestBody.batch
                }
            }
            pipeline.unshift(object)
        }
        if (requestBody.semester) {
            const object = {
                '$match': {
                    'semester': requestBody.semester
                }
            }
            pipeline.unshift(object)
        }
        if (requestBody.branch) {
            const object = {
                '$match': {
                    'result.initial': requestBody.branch
                }
            }
            pipeline.splice(2, 0, object);
        }
        const data = await Student.aggregate(pipeline).exec();
        return data;
    }
    catch {

    }
}

/**
 * 
 * @returns => Department,Year wise Vacancy of seat
 */
export async function getVacancySeat(){
    try{
        const data = await Student.aggregate([
            {
              '$lookup': {
                'from': 'departments', 
                'localField': 'departmentId', 
                'foreignField': '_id', 
                'as': 'result'
              }
            }, {
              '$unwind': {
                'path': '$result'
              }
            }, {
              '$group': {
                '_id': {
                  'batchYear': '$batchYear', 
                  'department': '$result.initial'
                }, 
                'count': {
                  '$sum': 1
                }, 
                'departmentTotalSeat': {
                  '$first': '$result.totalSeat'
                }
              }
            }, {
              '$group': {
                '_id': '$_id.batchYear', 
                'branches': {
                  '$push': {
                    'dep': '$_id.department', 
                    'totalStudent': '$count', 
                    'totalStudentsIntake': '$departmentTotalSeat'
                  }
                }
              }
            }, {
              '$addFields': {
                'TotalStudents': {
                  '$reduce': {
                    'input': '$branches', 
                    'initialValue': 0, 
                    'in': {
                      '$add': [
                        '$$value', '$$this.totalStudent'
                      ]
                    }
                  }
                }, 
                'totalStudentsIntake': {
                  '$reduce': {
                    'input': '$branches', 
                    'initialValue': 0, 
                    'in': {
                      '$add': [
                        '$$value', '$$this.totalStudentsIntake'
                      ]
                    }
                  }
                }
              }
            }, {
              '$addFields': {
                'year': '$_id'
              }
            }, {
              '$project': {
                '_id': 0, 
                'AvailableSeat': {
                  '$subtract': [
                    '$totalStudentsIntake', '$TotalStudents'
                  ]
                }, 
                'branches': 1, 
                'TotalStudents': 1, 
                'totalStudentsIntake': 1, 
                'year': 1
              }
            }, {
              '$project': {
                'data': {
                  '$map': {
                    'input': '$branches', 
                    'as': 'branch', 
                    'in': {
                      'k': '$$branch.dep', 
                      'v': {
                        'totalStudent': '$$branch.totalStudent', 
                        'totalStudentsIntake': '$$branch.totalStudentsIntake', 
                        'availableStudent': {
                          '$subtract': [
                            '$$branch.totalStudentsIntake', '$$branch.totalStudent'
                          ]
                        }
                      }
                    }
                  }
                }, 
                'year': 1, 
                'TotalStudents': 1, 
                'totalStudentsIntake': 1, 
                'AvailableSeat': 1
              }
            }, {
              '$project': {
                'branches': {
                  '$arrayToObject': '$data'
                }, 
                'year': 1, 
                'TotalStudents': 1, 
                'totalStudentsIntake': 1
              }
            }
          ]);

        return data;
    }
    catch{

    }
}