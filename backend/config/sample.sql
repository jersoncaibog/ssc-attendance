-- Sample Users
INSERT INTO users (username, password, role)
VALUES ('president', 'password', 'president'),
    ('vice_president', 'password', 'vice_president'),
    ('admin1', 'password', 'admin'),
    ('admin2', 'password', 'admin');
-- Sample Students
INSERT INTO students (student_id, name, course, year, section, rfid)
VALUES (
        '21-0001',
        'John Smith',
        'bsit',
        '4',
        'a',
        'RFID001'
    ),
    (
        '21-0002',
        'Maria Garcia',
        'bsit',
        '4',
        'a',
        'RFID002'
    ),
    (
        '21-0003',
        'James Wilson',
        'bsit',
        '3',
        'b',
        'RFID003'
    ),
    (
        '21-0004',
        'Sarah Lee',
        'bsit',
        '3',
        'b',
        'RFID004'
    ),
    (
        '21-0005',
        'Michael Brown',
        'bshm',
        '2',
        'a',
        'RFID005'
    ),
    (
        '21-0006',
        'Emily Davis',
        'bshm',
        '2',
        'a',
        'RFID006'
    ),
    (
        '21-0007',
        'David Miller',
        'bshm',
        '1',
        'c',
        'RFID007'
    ),
    (
        '21-0008',
        'Lisa Anderson',
        'bscrim',
        '4',
        'b',
        'RFID008'
    ),
    (
        '21-0009',
        'Robert Taylor',
        'bscrim',
        '3',
        'c',
        'RFID009'
    ),
    (
        '21-0010',
        'Jennifer White',
        'bscrim',
        '2',
        'a',
        'RFID010'
    );
-- Sample Events (for today)
INSERT INTO events (title, description, event_date, location)
VALUES (
        'SSC General Assembly',
        'First semester general assembly meeting',
        CURRENT_DATE,
        'Main Auditorium'
    ),
    (
        'Christmas Ball',
        'A joyous Christmas vacation',
        CURRENT_DATE,
        'Campus Covered Court'
    );
-- Sample Attendance (for all students in both events)
INSERT INTO attendance (student_id, event_id, status, check_in_time)
SELECT s.student_id,
    e.id,
    'Absent',
    CURRENT_TIMESTAMP
FROM students s
    CROSS JOIN events e
WHERE e.id IN (1, 2);