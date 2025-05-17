-- Drop tables if they exist (in reverse order of dependencies)
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS users;
-- Create users table for SSC administration
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (
        role IN (
            'president',
            -- SSC President
            'vice_president',
            -- SSC Vice President
            'admin' -- System Administrator
        )
    ),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Create students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    course VARCHAR(50) NOT NULL,
    year VARCHAR(2) NOT NULL,
    section VARCHAR(2) NOT NULL,
    rfid VARCHAR(50) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_student_id CHECK (student_id ~ '^\d{2}-\d{4}$') -- Ensures format YY-XXXX
);
-- Create events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    location VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
-- Create attendance table
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(10) REFERENCES students(student_id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Present', 'Absent', 'Excused')),
    check_in_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, event_id) -- Prevent duplicate attendance records
);
-- Create indexes for better query performance
CREATE INDEX idx_students_course ON students(course);
CREATE INDEX idx_students_year ON students(year);
CREATE INDEX idx_students_section ON students(section);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_event_id ON attendance(event_id);
CREATE INDEX idx_events_date ON events(event_date);
-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ language 'plpgsql';
-- Create triggers to automatically update updated_at
CREATE TRIGGER update_students_updated_at BEFORE
UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE
UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attendance_updated_at BEFORE
UPDATE ON attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- Create function to notify attendance changes
CREATE OR REPLACE FUNCTION notify_attendance_change() RETURNS TRIGGER AS $$ BEGIN PERFORM pg_notify(
        'attendance_changes',
        json_build_object(
            'operation',
            TG_OP,
            'record',
            row_to_json(NEW)
        )::text
    );
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create trigger for attendance changes
CREATE TRIGGER attendance_change_notification
AFTER
INSERT
    OR
UPDATE ON attendance FOR EACH ROW EXECUTE FUNCTION notify_attendance_change();