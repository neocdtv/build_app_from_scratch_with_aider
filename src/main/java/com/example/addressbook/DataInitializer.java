package com.example.addressbook;
import com.example.addressbook.model.entity.Contact;
import com.example.addressbook.repository.ContactRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class DataInitializer {
    private final ContactRepository repository;

    public DataInitializer(ContactRepository repository) { this.repository = repository; }

    @PostConstruct
    public void init() {
        if (repository.count() > 0) return; // Skip if already seeded

        Contact c1 = new Contact();
        c1.setFirstName("Alice"); c1.setLastName("Smith"); c1.setEmail("alice@example.com");
        c1.setPhoneNumber("+11234567890"); c1.setAddress("123 Main St, NY"); c1.setCategory("Work");
        repository.save(c1);

        Contact c2 = new Contact();
        c2.setFirstName("Bob"); c2.setLastName("Johnson"); c2.setEmail("bob@example.com");
        c2.setPhoneNumber("+19876543210"); c2.setAddress("456 Oak Ave, CA"); c2.setCategory("Personal");
        repository.save(c2);

        Contact c3 = new Contact();
        c3.setFirstName("Carol"); c3.setLastName("Williams"); c3.setEmail("carol@example.com");
        c3.setPhoneNumber("+15551234567"); c3.setAddress(null); c3.setCategory("Work");
        repository.save(c3);

        Contact c4 = new Contact();
        c4.setFirstName("David"); c4.setLastName("Brown"); c4.setEmail("david@example.com");
        c4.setPhoneNumber("+18889990000"); c4.setAddress("789 Pine Rd, TX"); c4.setCategory("Family");
        repository.save(c4);

        Contact c5 = new Contact();
        c5.setFirstName("Eve"); c5.setLastName("Davis"); c5.setEmail("eve@example.com");
        c5.setPhoneNumber("+16667778888"); c5.setAddress("321 Elm St, FL"); c5.setCategory("Personal");
        repository.save(c5);
    }
}
