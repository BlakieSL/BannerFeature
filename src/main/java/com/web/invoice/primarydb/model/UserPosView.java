package com.web.invoice.primarydb.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.hibernate.annotations.Subselect;

import javax.persistence.*;
import java.util.Date;

@Entity
@Subselect("select 1")
@Getter
@Setter
@ToString
@RequiredArgsConstructor
public class UserPosView {
    @Id
    private int codeUser;
    private String username;

    @JsonFormat(pattern="dd.MM.yyyy")
    @Temporal(TemporalType.DATE)
    private Date dateBegin;

    @JsonFormat(pattern="dd.MM.yyyy")
    @Temporal(TemporalType.DATE)
    private Date dateEnd;

    private String password;
    private String originalPassword;
    private int codeProfile;
    private String nameProfile;
    private String fio;
    private int codeShop;
    private String nameShop;
    private int signActivity;
    private String signActivityText;
    private String cardNumber;
    private String regNumber;
    private String originalCardNumber;

    @Override
    public int hashCode() {
        return super.hashCode();
    }

    @Override
    public boolean equals(Object obj) {
        return super.equals(obj);
    }
}
