package com.addressbook.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;

@Component
public class DatabaseInitializer implements ApplicationListener<ContextRefreshedEvent> {

    private final ResourceDatabasePopulator databasePopulator;

    @Autowired
    public DatabaseInitializer() {
        this.databasePopulator = new ResourceDatabasePopulator();
        this.databasePopulator.addScript(
            new ClassPathResource("data.sql")
        );
    }

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        // Get the DataSource from the context
        DataSource dataSource = event.getApplicationContext().getBean(DataSource.class);
        try {
            databasePopulator.execute(dataSource);
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize database", e);
        }
    }
}
