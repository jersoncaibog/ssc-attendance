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
        '1000000001'
    ),
    (
        '21-0002',
        'Maria Garcia',
        'bsit',
        '4',
        'a',
        '1000000002'
    ),
    (
        '21-0003',
        'James Wilson',
        'bsit',
        '3',
        'b',
        '1000000003'
    ),
    (
        '21-0004',
        'Sarah Lee',
        'bsit',
        '3',
        'b',
        '1000000004'
    ),
    (
        '21-0005',
        'Michael Brown',
        'bshm',
        '2',
        'a',
        '1000000005'
    ),
    (
        '21-0006',
        'Emily Davis',
        'bshm',
        '2',
        'a',
        '1000000006'
    ),
    (
        '21-0007',
        'David Miller',
        'bshm',
        '1',
        'c',
        '1000000007'
    ),
    (
        '21-0008',
        'Lisa Anderson',
        'bscrim',
        '4',
        'b',
        '1000000008'
    ),
    (
        '21-0009',
        'Robert Taylor',
        'bscrim',
        '3',
        'c',
        '1000000009'
    ),
    (
        '21-0010',
        'Jennifer White',
        'bscrim',
        '2',
        'a',
        '1000000010'
    ),
    (
        '21-0011',
        'Daniel Martinez',
        'bsit',
        '1',
        'a',
        '1000000011'
    ),
    (
        '21-0012',
        'Sophia Chen',
        'bsit',
        '1',
        'b',
        '1000000012'
    ),
    (
        '21-0013',
        'William Johnson',
        'bshm',
        '3',
        'b',
        '1000000013'
    ),
    (
        '21-0014',
        'Emma Thompson',
        'bshm',
        '4',
        'c',
        '1000000014'
    ),
    (
        '21-0015',
        'Alexander Kim',
        'bscrim',
        '1',
        'c',
        '1000000015'
    ),
    (
        '21-0016',
        'Olivia Rodriguez',
        'bsit',
        '2',
        'c',
        '1000000016'
    ),
    (
        '21-0017',
        'Ethan Patel',
        'bshm',
        '1',
        'a',
        '1000000017'
    ),
    (
        '21-0018',
        'Isabella Wong',
        'bscrim',
        '3',
        'a',
        '1000000018'
    ),
    (
        '21-0019',
        'Noah Garcia',
        'bsit',
        '4',
        'c',
        '1000000019'
    ),
    (
        '21-0020',
        'Ava Singh',
        'bshm',
        '2',
        'b',
        '1000000020'
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