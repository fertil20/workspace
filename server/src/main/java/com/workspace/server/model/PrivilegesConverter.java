package com.workspace.server.model;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@Converter
public class PrivilegesConverter implements AttributeConverter<Set<String>, String> {
    @Override
    public String convertToDatabaseColumn(Set<String> strings) {
        return String.join(",", strings);
    }
    @Override
    public Set<String> convertToEntityAttribute(String s) {
        return Arrays.stream(s.split(",")).collect(Collectors.toSet());
    }
}
