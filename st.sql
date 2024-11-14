CREATE USER my11user WITH PASSWORD 'mypassword';
ALTER ROLE my11user SET client_encoding TO 'utf8';
ALTER ROLE my11user SET default_transaction_isolation TO 'read committed';
ALTER ROLE my11user SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE school TO my11user; 