package com.web.invoice.primarydb.service;

import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

@Service
public class ConfigService {

    @PersistenceContext
    private EntityManager entityManager;


    public void setConfig(String codeUser, String ipSource) {
        entityManager.createNativeQuery("select set_config('cashdesk.code_user', :codeUser, false) || set_config('cashdesk.ip_source', :ipSource , false)")
                .setParameter("codeUser", codeUser)
                .setParameter("ipSource", ipSource)
                .getSingleResult();
    }
}
