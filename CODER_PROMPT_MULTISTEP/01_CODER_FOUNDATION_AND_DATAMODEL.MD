We are building an Address Book Web Application using Spring Boot (Java 17+). 
Based on our ARCHITECTURE.md, please implement the following initial files:
1. `pom.xml`: Include Spring Boot Starter Web, Data JPA, Validation, and H2 dependencies.
2. `src/main/resources/application.yml`: Configure for an H2 in-memory database and enable the H2 console.
3. `src/main/java/com/addressbook/model/Contact.java`: Create the JPA entity. It must include an auto-incremented Long id, and String fields for firstName, lastName, email, phoneNumber, address, and category. Apply Jakarta `@NotBlank` and `@Email` validation annotations where appropriate, alongside length constraints.