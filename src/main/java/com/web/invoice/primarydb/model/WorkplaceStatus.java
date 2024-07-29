package com.web.invoice.primarydb.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Subselect;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Date;

@Entity
@Subselect(value = "select 1")
@Getter
@Setter
public class WorkplaceStatus {


    private Integer codeShop;
    private Integer idWorkplace;
    private String status;
    private String problem;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)
    private Date replicationBegin;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)
    private Date replicationEnd;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)
    private Date successfulUpdate;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)
    private Date successfulSend;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastTimeError;
    private String errorMessage;
    @Id
    private String key;
}
