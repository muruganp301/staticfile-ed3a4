
export interface Student {
  id: string;
  name: string;
  course: string;
  section: string;
  faceRegistered: boolean;
  lastAttendance: string;
  status: 'Active' | 'Inactive';
}

export interface AttendanceLog {
  id: string;
  name: string;
  time: string;
  status: 'Present' | 'Late' | 'Absent';
  method: 'Face Recognition' | 'RFID Card' | 'Manual Entry';
}

export interface DailyReport {
  id: string;
  name: string;
  course: string;
  timeIn: string;
  timeOut: string;
  hours: string;
  status: 'Present' | 'Late';
}
