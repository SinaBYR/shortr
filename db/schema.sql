CREATE DATABASE shortr;

CREATE TABLE user_account (
  id VARCHAR(36) DEFAULT uuid_generate_v4() NOT NULL,
  email TEXT NOT NULL,
  fullname VARCHAR(64) NOT NULL,
  password VARCHAR(64) NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE url (
  id VARCHAR(36) DEFAULT uuid_generate_v4() NOT NULL,
  original_url TEXT NOT NULL,
  url_id TEXT NOT NULL,
  protocol VARCHAR(5) NOT NULL,
  click_count INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP DEFAULT now() NOT NULL,
  user_id VARCHAR(36) NOT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(user_id) REFERENCES user_account(id)
);

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");