-- ============================================================
-- Portfolio Website Database Schema
-- Run this file in MySQL Workbench or VSCode MySQL extension
-- ============================================================

CREATE DATABASE IF NOT EXISTS portfolio_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE portfolio_db;

-- ------------------------------------------------------------
-- Admin users (dashboard login)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin') NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Profile / About Me (single row, editable from dashboard)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    title VARCHAR(150) NOT NULL,
    tagline VARCHAR(255),
    about_text TEXT,
    email VARCHAR(150),
    phone VARCHAR(50),
    location VARCHAR(150),
    avatar_url LONGTEXT,
    resume_url VARCHAR(255),
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    facebook_url VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Skills
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) DEFAULT 'General',
    proficiency INT DEFAULT 50, -- 0 - 100
    icon_class VARCHAR(100), -- bootstrap icon class e.g. bi-code-slash
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Projects
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    image_url LONGTEXT,
    tech_stack VARCHAR(255), -- comma separated e.g. "Vue3,Node.js,MySQL"
    demo_url VARCHAR(255),
    repo_url VARCHAR(255),
    featured TINYINT(1) DEFAULT 0,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Experience (work history / timeline)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS experience (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company VARCHAR(150) NOT NULL,
    position VARCHAR(150) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE NULL, -- NULL means "present"
    location VARCHAR(150),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Education
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    school VARCHAR(150) NOT NULL,
    degree VARCHAR(150),
    field_of_study VARCHAR(150),
    start_date DATE,
    end_date DATE NULL,
    description TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- Contact messages (from visitor contact form)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SEED DATA (safe to edit/remove)
-- Default admin password is: Admin@123
-- (hash generated with bcryptjs, 10 salt rounds)
-- ============================================================
INSERT INTO
    users (name, email, password, role)
SELECT 'Admin', 'admin@example.com', '$2a$10$CEfY3jjkUTjQZ7cRy2qYs.WamaS/C9vyo9OOWApjNGSM5wGsiAJBm', 'admin'
WHERE
    NOT EXISTS (
        SELECT 1
        FROM users
        WHERE
            email = 'admin@example.com'
    );

INSERT INTO
    profile (
        full_name,
        title,
        tagline,
        about_text,
        email,
        phone,
        location,
        github_url,
        linkedin_url
    )
SELECT 'Your Name', 'Junior Full-Stack Web Developer', 'I build clean, functional web applications from front to back.', 'I am a junior full-stack developer who enjoys building complete web applications using Vue 3 on the frontend and Node.js/Express/MySQL on the backend. I like solving problems, learning new tools, and shipping projects that work.', 'you@example.com', '+855 00 000 000', 'Phnom Penh, Cambodia', 'https://github.com/yourusername', 'https://linkedin.com/in/yourusername'
WHERE
    NOT EXISTS (
        SELECT 1
        FROM profile
    );

INSERT INTO
    skills (
        name,
        category,
        proficiency,
        icon_class,
        display_order
    )
VALUES (
        'Vue 3',
        'Frontend',
        80,
        'bi-filetype-jsx',
        1
    ),
    (
        'JavaScript',
        'Frontend',
        85,
        'bi-filetype-js',
        2
    ),
    (
        'HTML5 & CSS3',
        'Frontend',
        90,
        'bi-filetype-html',
        3
    ),
    (
        'Node.js',
        'Backend',
        75,
        'bi-hdd-network',
        4
    ),
    (
        'Express.js',
        'Backend',
        75,
        'bi-server',
        5
    ),
    (
        'MySQL',
        'Database',
        70,
        'bi-database',
        6
    ),
    (
        'Git & GitHub',
        'Tools',
        80,
        'bi-github',
        7
    );

INSERT INTO
    projects (
        title,
        description,
        image_url,
        tech_stack,
        demo_url,
        repo_url,
        featured,
        display_order
    )
VALUES (
        'Portfolio Dashboard',
        'A full-stack portfolio website with an admin dashboard to manage projects, skills, and messages.',
        '',
        'Vue3,Node.js,Express,MySQL,JWT',
        '',
        '',
        1,
        1
    ),
    (
        'Task Manager App',
        'A simple CRUD task manager with authentication.',
        '',
        'Vue3,Express,MySQL',
        '',
        '',
        0,
        2
    );

INSERT INTO
    experience (
        company,
        position,
        description,
        start_date,
        end_date,
        location,
        display_order
    )
VALUES (
        'Freelance',
        'Junior Web Developer',
        'Building websites and small web applications for local clients.',
        '2024-01-01',
        NULL,
        'Remote',
        1
    );

INSERT INTO
    education (
        school,
        degree,
        field_of_study,
        start_date,
        end_date,
        description,
        display_order
    )
VALUES (
        'Your University',
        'Bachelor Degree',
        'Computer Science / IT',
        '2021-01-01',
        '2025-01-01',
        'Studied web development, databases, and software engineering fundamentals.',
        1
    );