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
                }
            ]).exec();

        return data;
    }
    catch (error) {

    }
}
