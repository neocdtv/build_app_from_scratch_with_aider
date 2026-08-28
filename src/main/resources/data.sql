-- Sample data for Address Book Application
INSERT INTO contact (first_name, last_name, email_address, phone_number, address, category) VALUES
('John', 'Smith', 'john.smith@example.com', '+1-555-0123', '123 Main St, Springfield', 'Family'),
('Sarah', 'Johnson', 'sarah.johnson@example.com', '+1-555-0456', '456 Oak Ave, Portland', 'Work'),
('Michael', 'Brown', 'michael.brown@example.com', '+1-555-0789', '789 Pine Rd, Seattle', 'Friend'),
('Emily', 'Davis', 'emily.davis@example.com', '+1-555-0321', '321 Elm Blvd, Austin', 'Colleague'),
('David', 'Wilson', 'david.wilson@example.com', '+1-555-0654', '654 Cedar Ln, Denver', 'Family');

-- Insert additional sample contacts for diversity (total 5 as required)
INSERT INTO contact (first_name, last_name, email_address, phone_number, address, category) VALUES
('Lisa', 'Martinez', 'lisa.martinez@example.com', '+1-555-0987', '987 Maple Dr, Miami', 'Work'),
('James', 'Anderson', 'james.anderson@example.com', '+1-555-0234', '234 Birch Ct, Boston', 'Friend');
