import * as request from "supertest";

import app from '../src/app';

import db from './dbSetUpFileForTest';


beforeEach(db.setupDataBase);


describe("Create new Faculty", () => {
    test("Only Admin can create Faculty", async () => {
        const response = await request(app).post('/faculty/add')
            .set('Authorization', `Bearer ${db.facultyAdmin.authToken}`).
            send(db.demoFacultyToCreate).
            expect(200);

        expect(response._body.success).toBe(true)
    });

    test("Faculty can not add new Faculty", async () => {
        const response = await request(app).post('/faculty/add')
            .set('Authorization', `Bearer ${db.facultyStaff.authToken}`).
            send(db.demoFacultyToCreate).
            expect(403);

        expect(response._body.success).toBe(false)
    });
});


describe("Login Faculty", () => {
    test("Faculty Login", async () => {
        const response = await request(app).post('/faculty/login').
            send({
                emailId:db.facultyAdmin.emailId,
                password:db.facultyAdmin.password
            }).
            expect(200);            
        expect(response._body.success).toBe(true)
    });
});


describe("update Faculty", () => {
    test("Admin Update Faculty By Id", async () => {
        const response = await request(app).patch(`/faculty/update/${db.adminFacultyId}`)
            .set('Authorization', `Bearer ${db.facultyAdmin.authToken}`).
            send({
                name:"Updated Faculty",
                role:"Staff"    
            }).
            expect(200);

        expect(response._body.success).toBe(true)
    });

    test("Admin Update Staff Faculty By Id", async () => {
        const response = await request(app).patch(`/faculty/update/${db.staffFacultyId}`)
            .set('Authorization', `Bearer ${db.facultyAdmin.authToken}`).
            send({
                name:"Demo bhai faculty",
                role:"Staff"    
            }).
            expect(200);

        expect(response._body.success).toBe(true)
    });

});


describe("delete Faculty", () => {
    test("Staff can not delete Staff Faculty By Id", async () => {
        const response = await request(app).delete(`/faculty/delete/${db.staffFacultyId}`)
            .set('Authorization', `Bearer ${db.facultyStaff.authToken}`).
            expect(403);
        expect(response._body.success).toBe(false)
    });

    test("Admin delete Faculty By Id", async () => {
        const response = await request(app).delete(`/faculty/delete/${db.staffFacultyId}`)
            .set('Authorization', `Bearer ${db.facultyAdmin.authToken}`).
            expect(200);

        expect(response._body.success).toBe(true)
    });

 

});


describe("Get Profile", () => {
    test("Get Profile", async () => {
        const response = await request(app).get(`/faculty/me`)
            .set('Authorization', `Bearer ${db.facultyStaff.authToken}`).
            expect(200);


        expect(response._body.success).toBe(true)
    });
});


describe("LogOut Faculty", () => {
    test("LogOut Faculty", async () => {
        const response = await request(app).post(`/faculty/logout`)
            .set('Authorization', `Bearer ${db.facultyStaff.authToken}`).
            expect(200);


        expect(response._body.success).toBe(true)
    });
});


afterAll(() => {
    app.close(() => {
    })
})