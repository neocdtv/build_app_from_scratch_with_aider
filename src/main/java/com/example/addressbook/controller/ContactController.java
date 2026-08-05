package com.example.addressbook.controller;
import com.example.addressbook.model.dto.ContactCreateDto;
import com.example.addressbook.model.dto.ContactDto;
import com.example.addressbook.model.dto.ContactUpdateDto;
import com.example.addressbook.service.ContactService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/contacts")
public class ContactController {
    private final ContactService service;

    public ContactController(ContactService service) { this.service = service; }

    @GetMapping
    public ResponseEntity<List<ContactDto>> search(@RequestParam(required = false) String search,
                                                   @RequestParam(required = false) String category) {
        return ResponseEntity.ok(service.searchContacts(search, category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactDto> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getContactById(id));
    }

    @PostMapping
    public ResponseEntity<ContactDto> create(@Valid @RequestBody ContactCreateDto dto) {
        return ResponseEntity.status(201).body(service.createContact(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactDto> update(@PathVariable Long id, @Valid @RequestBody ContactUpdateDto dto) {
        return ResponseEntity.ok(service.updateContact(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteContact(id);
        return ResponseEntity.noContent().build();
    }
}
