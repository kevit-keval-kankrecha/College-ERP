import {
    getBatchDepartmentWiseData,
    getAbsentStudentBatchYearSemesterDateWise,
    getMoreThen75PercentStudent
} from './analysis.DAL'


class analysisController {
    async getBatchDepartmentWiseData(req, res, next) {
        try {
            const data=await getBatchDepartmentWiseData();
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": data, "message":"Success" } });
        }
        catch (error) {
            res.status(500).send({ "success": false, "data": { "statusCode": 500, "message":"Something went wrong white retriving data" } });
        }
    }

    
    async getAbsentStudentBatchYearSemesterDateWise(req,res,next){
        try{
            const data=await getAbsentStudentBatchYearSemesterDateWise(req.body);
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": data, "message":"Success" } });
        }
        catch{
            res.status(500).send({ "success": false, "data": { "statusCode": 500, "message":"Something went wrong white retriving data" } });
        }
    }

    async getMoreThen75PercentStudent(req,res,next){
        try{
            const data=await getMoreThen75PercentStudent(req.body);
            res.status(200).send({ "success": true, "data": { "statusCode": 200, "data": data, "message":"Success" } });
        }
        catch{
            res.status(500).send({ "success": false, "data": { "statusCode": 500, "message":"Something went wrong white retriving data" } });
        }
    }
}
export default analysisController;