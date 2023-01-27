/* Replace with your SQL commands */
CREATE TABLE tasks (
    task_id serial PRIMARY KEY,
    duration DECIMAL NOT NULL,
    is_processed BOOLEAN NOT NULL 
)