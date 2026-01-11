-- Initial PostgreSQL Schema

DROP TABLE IF EXISTS analytics;
DROP TABLE IF EXISTS schedules;
DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS social_posts;
DROP TABLE IF EXISTS blog_posts;
DROP TABLE IF EXISTS users;

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog Posts Table
CREATE TABLE blog_posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    topic VARCHAR(255),
    title VARCHAR(255),
    slug VARCHAR(255) UNIQUE,
    content_markdown TEXT,
    keywords JSONB,
    meta_title VARCHAR(255),
    meta_description TEXT,
    outline JSONB,
    word_count INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Social Posts Table
CREATE TABLE social_posts (
    id SERIAL PRIMARY KEY,
    blog_post_id INTEGER REFERENCES blog_posts(id),
    platform VARCHAR(50), -- twitter, linkedin, instagram
    content TEXT,
    hashtags JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Images Table
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    blog_post_id INTEGER REFERENCES blog_posts(id),
    social_post_id INTEGER REFERENCES social_posts(id),
    url TEXT,
    style VARCHAR(100),
    prompt TEXT,
    usage VARCHAR(50), -- blog_hero, social
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Schedules Table
CREATE TABLE schedules (
    id SERIAL PRIMARY KEY,
    item_type VARCHAR(50), -- blog, social
    item_id INTEGER,
    platform_targets JSONB,
    publish_at TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending', -- pending, sent, failed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Table
CREATE TABLE analytics (
    id SERIAL PRIMARY KEY,
    blog_post_id INTEGER REFERENCES blog_posts(id),
    word_count INTEGER,
    reading_time_minutes INTEGER,
    seo_score INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
