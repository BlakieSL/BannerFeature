package com.web.invoice.primarydb.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import oracle.ons.Cli;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "group_client", schema = "pos")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class GroupClient {
    @Id
    @Column(name = "code_group", nullable = false)
    private Integer codeGroup;

    @Column(name = "name_group", nullable = false)
    private String nameGroup;

    @Column(name = "code_parent_group", nullable = false)
    private Integer codeParentGroup; //should be filled with some random data as for now

    @OneToMany(mappedBy = "groupClient", cascade = CascadeType.ALL)
    private final Set<Client> clients = new HashSet<>();
}
