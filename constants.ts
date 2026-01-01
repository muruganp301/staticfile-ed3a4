
import { User, AttendanceLog, DailyReport } from './types';

export const sampleData = {
    presentCount: 42,
    absentCount: 8,
    lateCount: 5,
    totalUsers: 75,
    
    attendanceLog: [
        {id: "EMP001", name: "John Smith", time: "08:45 AM", status: "Present", method: "Face Recognition"},
        {id: "EMP002", name: "Sarah Johnson", time: "09:05 AM", status: "Late", method: "Face Recognition"},
        {id: "EMP003", name: "Michael Chen", time: "08:55 AM", status: "Present", method: "RFID Card"},
        {id: "EMP004", name: "Emma Wilson", time: "09:15 AM", status: "Late", method: "Face Recognition"},
        {id: "EMP005", name: "Robert Davis", time: "08:30 AM", status: "Present", method: "Manual Entry"},
        {id: "EMP006", name: "Lisa Brown", time: "08:50 AM", status: "Present", method: "Face Recognition"},
    ] as AttendanceLog[],
    
    users: [
        {id: "EMP001", name: "John Smith", department: "Engineering", faceRegistered: true, lastAttendance: "2023-10-26 08:45", status: "Active"},
        {id: "EMP002", name: "Sarah Johnson", department: "Sales", faceRegistered: true, lastAttendance: "2023-10-26 09:05", status: "Active"},
        {id: "EMP003", name: "Michael Chen", department: "Engineering", faceRegistered: false, lastAttendance: "2023-10-26 08:55", status: "Active"},
        {id: "EMP004", name: "Emma Wilson", department: "Marketing", faceRegistered: true, lastAttendance: "2023-10-26 09:15", status: "Active"},
        {id: "EMP005", name: "Robert Davis", department: "HR", faceRegistered: true, lastAttendance: "2023-10-26 08:30", status: "Active"},
        {id: "EMP006", name: "Lisa Brown", department: "Sales", faceRegistered: true, lastAttendance: "2023-10-26 08:50", status: "Inactive"},
        {id: "EMP007", name: "David Miller", department: "Engineering", faceRegistered: false, lastAttendance: "2023-10-26 09:20", status: "Active"},
        {id: "EMP008", name: "Jessica Taylor", department: "Marketing", faceRegistered: true, lastAttendance: "2023-10-26 08:40", status: "Active"}
    ] as User[],
    
    dailyReport: [
        {id: "EMP001", name: "John Smith", department: "Engineering", timeIn: "08:45", timeOut: "17:15", hours: "8.5", status: "Present"},
        {id: "EMP002", name: "Sarah Johnson", department: "Sales", timeIn: "09:05", timeOut: "17:00", hours: "7.9", status: "Late"},
        {id: "EMP003", name: "Michael Chen", department: "Engineering", timeIn: "08:55", timeOut: "17:20", hours: "8.4", status: "Present"},
        {id: "EMP004", name: "Emma Wilson", department: "Marketing", timeIn: "09:15", timeOut: "17:10", hours: "7.9", status: "Late"},
    ] as DailyReport[],
};
