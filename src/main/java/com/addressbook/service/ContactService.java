package com.addressbook.service;
import com.addressbook.model.Contact;
import com.addressbook.repository.ContactRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ContactService {
    private final ContactRepository repository;
    public ContactService(ContactRepository repository) { this.repository = repository; }
    
    public List<Contact> findAll() { return repository.findAll(); }
    public Optional<Contact> findById(Long id) { return repository.findById(id); }
    public Contact create(Contact contact) { return repository.save(contact); }
    public Contact update(Long id, Contact updated) {
        Contact existing = repository.findById(id).orElseThrow(() -> new RuntimeException("Contact not found"));
        existing.setFirstName(updated.getFirstName()); existing.setLastName(updated.getLastName());
        existing.setEmail(updated.getEmail()); existing.setPhoneNumber(updated.getPhoneNumber());
        existing.setAddress(updated.getAddress()); existing.setCategory(updated.getCategory());
        return repository.save(existing);
    }
    public void delete(Long id) { repository.deleteById(id); }
    public List<Contact> search(String query) {
        return repository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                query, query, query);
    }
}
