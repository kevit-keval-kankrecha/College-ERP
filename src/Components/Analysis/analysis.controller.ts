import {
    getBatchDepartmentWiseData
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
}
export default analysisController;