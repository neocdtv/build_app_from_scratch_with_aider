package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ContactRepository contactRepository;

    public DataInitializer(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Override
    public void run(String... args) {
        contactRepository.save(new Contact() {{
            setFirstName("John"); setLastName("Doe"); setEmail("john.doe@example.com");
            setPhoneNumber("+1-555-1234"); setAddress("123 Main Street, Anytown, USA"); setCategory("Family");
        }});
        contactRepository.save(new Contact() {{
            setFirstName("Jane"); setLastName("Smith"); setEmail("jane.smith@example.com");
            setPhoneNumber("+1-555-5678"); setAddress("456 Oak Avenue, Somewhere, USA"); setCategory("Work");
        }});
        contactRepository.save(new Contact() {{
            setFirstName("Alice"); setLastName("Johnson"); setEmail("alice.j@example.com");
            setPhoneNumber("+1-555-9012"); setAddress("789 Pine Road, Elsewhere, USA"); setCategory("Friend");
        }});
        contactRepository.save(new Contact() {{
            setFirstName("Bob"); setLastName("Brown"); setEmail("bob.brown@example.com");
            setPhoneNumber("+1-555-3456"); setAddress("321 Maple Drive, Nowhere, USA"); setCategory("Work");
        }});
        contactRepository.save(new Contact() {{
            setFirstName("Charlie"); setLastName("Davis"); setEmail("charlie.davis@example.com");
            setPhoneNumber("+1-555-7890"); setAddress("654 Cedar Lane, Anywhere, USA"); setCategory("Family");
        }});
    }
}
