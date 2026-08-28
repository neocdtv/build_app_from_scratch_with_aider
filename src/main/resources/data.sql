-- Sample contacts for Address Book Application (with address field)
INSERT INTO contact (first_name, last_name, email, phone_number, address, category) VALUES
('John', 'Smith', 'john.smith@example.com', '+1-555-0123', '123 Main St, Springfield', 'Family'),
('Sarah', 'Johnson', 'sarah.johnson@example.com', '+1-555-0456', '456 Oak Ave, Portland', 'Work'),
('Michael', 'Williams', 'michael.williams@example.com', '+1-555-0789', '789 Pine Rd, Seattle', 'Friends'),
('Emily', 'Brown', 'emily.brown@example.com', '+1-555-0321', '321 Elm Blvd, Austin', 'Family'),
('David', 'Davis', 'david.davis@example.com', '+1-555-0654', '654 Maple Dr, Denver', 'Colleagues');

-- Clear existing data on restart (optional)
DELETE FROM contact;
