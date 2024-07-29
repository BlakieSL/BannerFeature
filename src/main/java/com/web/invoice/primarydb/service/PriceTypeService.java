package com.web.invoice.primarydb.service;

import com.web.invoice.primarydb.dao.PriceTypeRepository;
import com.web.invoice.primarydb.model.PriceType;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class PriceTypeService {

    private final PriceTypeRepository priceTypeRepository;

    public PriceTypeService(PriceTypeRepository priceTypeRepository) {
        this.priceTypeRepository = priceTypeRepository;
    }

    public List<PriceType> getAllPriceType() {
        return StreamSupport
                .stream(priceTypeRepository.findAll().spliterator(), false)
                .collect(Collectors.toList());
    }

    @Transactional
    public void save(PriceType priceType) {
        priceTypeRepository.save(priceType);
    }

    @Transactional
    public void delete(PriceType priceType) {
        priceTypeRepository.delete(priceType);
    }

}
