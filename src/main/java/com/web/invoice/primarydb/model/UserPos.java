package com.web.invoice.primarydb.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "user_pos", schema = "pos")
@Data
public class UserPos implements UserDetails {

    @Id
    private int codeUser;

    @Column(name = "user_name")
    private String username;

    @Column(name = "pswd")
    private String password;
    @Transient
    private String originalPassword;

    private int codeProfile;
    private String fio;
    private int codeShop;
    private short signActivity;
    private String cardNumber;
    @Transient
    private String originalCardNumber;

    @JsonFormat(pattern="dd.MM.yyyy")
    @Temporal(TemporalType.DATE)
    private Date dateBegin;

    @JsonFormat(pattern="dd.MM.yyyy")
    @Temporal(TemporalType.DATE)
    private Date dateEnd;

    @Transient
    private boolean accountNonExpired;
    @Transient
    private boolean accountNonLocked ;
    @Transient
    private boolean credentialsNonExpired ;
    @Transient
    private boolean enabled ;
    @Transient
    private List<AccessEvent> accessEventList;

    public UserPos() {
        this.accountNonExpired = true;
        this.accountNonLocked = true;
        this.credentialsNonExpired = true;
        this.enabled = true;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(Role.ROLE_ADMIN.toString()));
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return (signActivity == 1);
    }

    @Override
    public boolean isAccountNonLocked() {
        return (signActivity == 1);
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return (signActivity == 1);
    }

    @Override
    public boolean isEnabled() {
        return (signActivity == 1);
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
