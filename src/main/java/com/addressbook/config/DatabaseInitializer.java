package com.addressbook.config;

import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class DatabaseInitializer {
    private final ContactRepository repo;

    public DatabaseInitializer(ContactRepository repo) { this.repo = repo; }

    @EventListener(ApplicationReadyEvent.class)
    public void seed() {
        if (repo.count() > 0) return;
        var c1 = new Contact(); c1.setFirstName("John"); c1.setLastName("Doe"); c1.setEmail("john@example.com"); c1.setPhoneNumber("+1-555-1234"); c1.setAddress("123 Main St, NY"); c1.setCategory("Family"); repo.save(c1);
        
        var c2 = new Contact(); c2.setFirstName("Jane"); c2.setLastName("Smith"); c2.setEmail("jane.smith@corp.com"); c2.setPhoneNumber("+1-555-9876"); c2.setAddress("456 Oak Ave, CA"); c2.setCategory("Work"); repo.save(c2);
        
        var c3 = new Contact(); c3.setFirstName("Alice"); c3.setLastName("Johnson"); c3.setEmail("alice.j@mail.com"); c3.setPhoneNumber("+1-555-4321"); c3.setAddress("789 Pine Rd, TX"); c3.setCategory("Friends"); repo.save(c3);
        
        var c4 = new Contact(); c4.setFirstName("Bob"); c4.setLastName("Williams"); c4.setEmail("bob.w@tech.io"); c4.setPhoneNumber("+1-555-6789"); c4.setAddress("321 Elm St, WA"); c4.setCategory("Work"); repo.save(c4);
        
        var c5 = new Contact(); c5.setFirstName("Carol"); c5.setLastName("Brown"); c5.setEmail("carol.b@email.com"); c5.setPhoneNumber("+1-555-0987"); c5.setAddress("654 Maple Dr, FL"); c5.setCategory("Family"); repo.save(c5);
    }
}
