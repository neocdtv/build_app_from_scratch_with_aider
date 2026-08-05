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
        repository.save(new Contact() {{
            setFirstName("Alice"); setLastName("Smith"); setEmail("alice@example.com");
            setPhoneNumber("+11234567890"); setAddress("123 Main St, NY"); setCategory("Work");
        }});
        repository.save(new Contact() {{
            setFirstName("Bob"); setLastName("Johnson"); setEmail("bob@example.com");
            setPhoneNumber("+19876543210"); setAddress("456 Oak Ave, CA"); setCategory("Personal");
        }});
        repository.save(new Contact() {{
            setFirstName("Carol"); setLastName("Williams"); setEmail("carol@example.com");
            setPhoneNumber("+15551234567"); setAddress(null); setCategory("Work");
        }});
        repository.save(new Contact() {{
            setFirstName("David"); setLastName("Brown"); setEmail("david@example.com");
            setPhoneNumber("+18889990000"); setAddress("789 Pine Rd, TX"); setCategory("Family");
        }});
        repository.save(new Contact() {{
            setFirstName("Eve"); setLastName("Davis"); setEmail("eve@example.com");
            setPhoneNumber("+16667778888"); setAddress("321 Elm St, FL"); setCategory("Personal");
        }});
    }
}
