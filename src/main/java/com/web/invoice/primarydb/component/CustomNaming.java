package com.web.invoice.primarydb.component;

import org.hibernate.boot.model.naming.Identifier;
import org.hibernate.boot.model.naming.PhysicalNamingStrategy;
import org.hibernate.engine.jdbc.env.spi.JdbcEnvironment;
import org.springframework.beans.factory.annotation.Value;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

public class CustomNaming implements PhysicalNamingStrategy {
    private DataSource dataSource;

    private Boolean is1021;


    public void setDataSource(DataSource dataSource) {
        this.dataSource = dataSource;
    }
    public void setIs1021(Boolean is1021) {
        this.is1021 = is1021;
    }

    @Override
    public Identifier toPhysicalCatalogName(Identifier name, JdbcEnvironment jdbcEnvironment) {
        return name;
    }

    @Override
    public Identifier toPhysicalSchemaName(Identifier name, JdbcEnvironment jdbcEnvironment) {
        return name;
    }

    @Override
    public Identifier toPhysicalTableName(Identifier name, JdbcEnvironment jdbcEnvironment) {
        return name;
    }

    @Override
    public Identifier toPhysicalSequenceName(Identifier name, JdbcEnvironment jdbcEnvironment) {
        return name;
    }

    @Override
    public Identifier toPhysicalColumnName(Identifier name, JdbcEnvironment jdbcEnvironment) {
        String columnName = name.getText();
        String jdbcUrl = getJdbcUrlFromDataSource();

        if (jdbcUrl != null && is1021/*jdbcUrl.contains("dbmain1021") */&& columnName.equals("cardNumber")) {
            return Identifier.toIdentifier("cardnumber");
        }
        return Identifier.toIdentifier(convertToSnakeCase(columnName));
    }

    private String getJdbcUrlFromDataSource() {
        try (Connection connection = dataSource.getConnection()) {
            return connection.getMetaData().getURL();
        } catch (SQLException e) {
            throw new RuntimeException("Failed to get JDBC URL", e);
        }
    }

    private String convertToSnakeCase(String input) {
        StringBuilder result = new StringBuilder();
        for (char c : input.toCharArray()) {
            if (Character.isUpperCase(c)) {
                result.append('_').append(Character.toLowerCase(c));
            } else {
                result.append(c);
            }
        }
        return result.toString();
    }
}
