import Student from '../Student/student.model'


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
