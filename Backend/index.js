import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import db from './config/Database.js';
import SequelizeStore from 'connect-session-sequelize';
import FileUpload from 'express-fileupload';

import UserRoute from './routes/UserRoute.js';
import PositionRoute from './routes/PositionRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import AttendanceRoute from './routes/AttendanceRoute.js';
import SalaryDeductionRoute from './routes/SalaryDeductionRoute.js';
import SalaryRoute from './routes/SalaryRoute.js';
import DashboardRoute from './routes/DashboardRoute.js';
import EmployeeSelfRoute from './routes/EmployeeSelfRoute.js';
import PayrollRoute from './routes/PayrollRoute.js';
import LeaveRoute from './routes/LeaveRoute.js';
import Payroll from './models/PayrollModel.js';
import LeaveType from './models/LeaveTypeModel.js';
import LeaveRequest from './models/LeaveRequestModel.js';

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({ db });

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        secure: 'auto',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));

app.use(express.json());
app.use(FileUpload());
app.use(express.static("public"));

app.use(AuthRoute);
app.use(UserRoute);
app.use(PositionRoute);
app.use(AttendanceRoute);
app.use(SalaryDeductionRoute);
app.use(SalaryRoute);
app.use(DashboardRoute);
app.use(EmployeeSelfRoute);
app.use(PayrollRoute);
app.use(LeaveRoute);

const syncNewTables = async () => {
    await Payroll.sync();
    await LeaveType.sync();
    await LeaveRequest.sync();
    const count = await LeaveType.count();
    if (count === 0) {
        await LeaveType.bulkCreate([
            { name: 'Casual Leave', days_per_year: 12 },
            { name: 'Sick Leave', days_per_year: 10 },
            { name: 'Earned Leave', days_per_year: 15 }
        ]);
    }
};
syncNewTables().catch(console.error);

store.sync();

const PORT = process.env.APP_PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
