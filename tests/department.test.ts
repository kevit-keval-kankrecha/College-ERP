import * as request from "supertest";

import app from '../src/app';

import db from './dbSetUpFileForTest';

beforeEach(db.setupDataBase);

test('demo',()=>{
    expect(5+5).toBe(10);
})
describe("Create new Department", () => {
    test("Create new Department", async () => {
        const res = await request(app).post('/department/add')
            .set('Authorization', `Bearer ${db.facultyAdmin.authToken}`).
            send(db.departmentOne).
            expect(200);
    })
});

describe("List Departments", () => {
    test("List Departments", async () => {
        const response = await request(app).get('/department')
            .set('Authorization', `Bearer ${db.facultyAdmin.authToken}`).
            expect(200);
        expect(response._body.success).toBe(true);
    })
});

describe("Update Department", () => {
    test("Update Department", async () => {
        const response = await request(app).patch(`/department/update/652fabce5fdac148bdd62c1f`)
            .set('Authorization', `Bearer ${db.facultyAdmin.authToken}`).
            send({
                name: "Mechanical Engineering",
                initial: 'ME',
                totalSeat: 100
            })
        expect(200);

        expect(response._body.success).toBe(true);
    })
});

describe("delete Department", () => {
    test("delete Department", async () => {
        const response = await request(app).delete(`/department/delete/652fabce5fdac148bdd62c1f`)
            .set('Authorization', `Bearer ${db.facultyAdmin.authToken}`).
            expect(200);



        expect(response._body.success).toBe(true);
    })
});

afterAll(() => {
    app.close(() => {
    })
})