
import { Student, AttendanceLog, DailyReport } from './types';

export const sampleData = {
    presentCount: 152,
    absentCount: 18,
    lateCount: 25,
    totalUsers: 250,
    
    attendanceLog: [
        {id: "STU001", name: "Alice Johnson", time: "09:05 AM", status: "Present", method: "Face Recognition"},
        {id: "STU002", name: "Bob Williams", time: "09:17 AM", status: "Late", method: "Face Recognition"},
        {id: "STU003", name: "Charlie Brown", time: "09:10 AM", status: "Present", method: "RFID Card"},
        {id: "STU004", name: "Diana Miller", time: "09:25 AM", status: "Late", method: "Face Recognition"},
        {id: "STU005", name: "Ethan Davis", time: "08:55 AM", status: "Present", method: "Manual Entry"},
        {id: "STU006", name: "Fiona Garcia", time: "09:02 AM", status: "Present", method: "Face Recognition"},
    ] as AttendanceLog[],
    
    students: [
        {id: "STU001", name: "Alice Johnson", course: "Computer Science", section: "A", faceRegistered: true, lastAttendance: "2023-10-26 09:05", status: "Active"},
        {id: "STU002", name: "Bob Williams", course: "Business Admin", section: "B", faceRegistered: true, lastAttendance: "2023-10-26 09:17", status: "Active"},
        {id: "STU003", name: "Charlie Brown", course: "Computer Science", section: "A", faceRegistered: false, lastAttendance: "2023-10-26 09:10", status: "Active"},
        {id: "STU004", name: "Diana Miller", course: "Fine Arts", section: "C", faceRegistered: true, lastAttendance: "2023-10-26 09:25", status: "Active"},
        {id: "STU005", name: "Ethan Davis", course: "Mechanical Eng.", section: "A", faceRegistered: true, lastAttendance: "2023-10-26 08:55", status: "Active"},
        {id: "STU006", name: "Fiona Garcia", course: "Business Admin", section: "B", faceRegistered: true, lastAttendance: "2023-10-26 09:02", status: "Inactive"},
        {id: "STU007", name: "George Clark", course: "Computer Science", section: "A", faceRegistered: false, lastAttendance: "2023-10-26 09:22", status: "Active"},
        {id: "STU008", name: "Hannah Lewis", course: "Fine Arts", section: "C", faceRegistered: true, lastAttendance: "2023-10-26 09:01", status: "Active"},
        {id: "STU009", name: "Isaac Newton", course: "Physics", section: "A", faceRegistered: true, lastAttendance: "2023-10-26 08:45", status: "Active"},
        {id: "STU010", name: "Julia Robinson", course: "Mathematics", section: "B", faceRegistered: false, lastAttendance: "Never", status: "Active"},
        {id: "STU011", name: "Kevin Mitnick", course: "Cybersecurity", section: "C", faceRegistered: true, lastAttendance: "2023-10-26 09:12", status: "Active"}
    ] as Student[],
    
    dailyReport: [
        {id: "STU001", name: "Alice Johnson", course: "Computer Science", timeIn: "09:05", timeOut: "16:55", hours: "7.8", status: "Present"},
        {id: "STU002", name: "Bob Williams", course: "Business Admin", timeIn: "09:17", timeOut: "17:00", hours: "7.7", status: "Late"},
        {id: "STU003", name: "Charlie Brown", course: "Computer Science", timeIn: "09:10", timeOut: "17:05", hours: "7.9", status: "Present"},
        {id: "STU004", name: "Diana Miller", course: "Fine Arts", timeIn: "09:25", timeOut: "17:15", hours: "7.8", status: "Late"},
    ] as DailyReport[],
};
