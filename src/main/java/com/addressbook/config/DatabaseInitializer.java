package com.addressbook.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ResourceDatabasePopulator;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.datasource.DataSourceInitializer;

import java.io.IOException;

@Component
public class DatabaseInitializer implements ApplicationListener<ContextRefreshedEvent>, DataSourceInitializer {

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
        // Initialization via DataSourceInitializer interface is preferred for Spring Boot
    }

    @Override
    public void initializeDatasource(org.springframework.jdbc.datasource.DataSource dataSource) throws IOException {
        databasePopulator.execute(dataSource);
    }
}
