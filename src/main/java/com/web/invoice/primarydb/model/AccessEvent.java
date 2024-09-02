package com.web.invoice.primarydb.model;

import lombok.*;
import org.hibernate.Hibernate;

import javax.persistence.*;
import java.util.LinkedHashMap;
import java.util.Objects;

@Getter
@Setter
@ToString
@RequiredArgsConstructor
@Entity
@IdClass(AccessEventId.class)
@Table(name = "access_event", schema = "pos")
public class AccessEvent {
    @Id
    private int codeProfile;
    @Id
    private int codeEvent;

    @Transient
    private LinkedHashMap<String, Object> detailAccess;

    @Column(name = "detail_access")
    @Transient
    private String detailAccessText;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        AccessEvent that = (AccessEvent) o;
        return Objects.equals(codeProfile, that.codeProfile)
                && Objects.equals(codeEvent, that.codeEvent);
    }

    @Override
    public int hashCode() {
        return Objects.hash(codeProfile, codeEvent);
    }
}
