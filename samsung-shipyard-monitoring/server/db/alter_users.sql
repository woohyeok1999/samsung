ALTER TABLE users ADD COLUMN name VARCHAR(255) AFTER id;

USE samsung_shipyard;

-- 기존 users 테이블 수정
ALTER TABLE users
MODIFY id VARCHAR(8) NOT NULL, -- 사번을 8자리 문자열로 설정
DROP PRIMARY KEY, -- 기존 자동 증가 primary key 삭제
ADD PRIMARY KEY (id), -- 사번을 primary key로 설정
ADD department VARCHAR(50) NULL AFTER password; -- 부서 추가 (설계, 생산 등)

ALTER TABLE users
ADD phone VARCHAR(13) NULL AFTER department; -- 전화번호 추가 (형태: 010-0000-0000)

-- 기존 계정의 id 값을 임시 8자리 사번 형식으로 업데이트
SET @row_number = 20241000;

UPDATE users
SET id = @row_number := @row_number + 1;

-- 관리자 계정 (id: 20241001)에 대해 department는 '관리자', phone은 NULL로 설정
UPDATE users
SET department = '관리자', phone = NULL
WHERE id = '20241001';

-- 일반 계정 (id: 20241002)에 대해 department는 '설계', phone은 '010-6348-2189'로 설정
UPDATE users
SET department = '설계', phone = '010-6348-2189'
WHERE id = '20241002';

DESCRIBE users;

-- id, email, password, department 컬럼에 NOT NULL 제약 조건 추가
ALTER TABLE users
MODIFY id VARCHAR(8) NOT NULL,
MODIFY email VARCHAR(255) NOT NULL,
MODIFY password VARCHAR(255) NOT NULL,
MODIFY department VARCHAR(50) NOT NULL;

DROP TABLE IF EXISTS friends;
CREATE TABLE friends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(8) NOT NULL,      -- 친구를 추가한 사용자 ID (varchar(8)로 수정)
    friend_id VARCHAR(8) NOT NULL,    -- 친구로 추가된 사용자 ID (varchar(8)로 수정)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (friend_id) REFERENCES users(id)
);

DROP TABLE IF EXISTS messages;
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id VARCHAR(255) NOT NULL,
    receiver_id VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);


DELETE FROM friends WHERE id = 20241004;
DELETE FROM users WHERE id = 20241004;
