package com.web.invoice.primarydb.service;

import com.web.invoice.primarydb.dao.WorkplaceStatusRepository;
import com.web.invoice.primarydb.model.WorkplaceStatus;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class WorkplaceStatusService {

    private final WorkplaceStatusRepository workplaceStatusRepository;

    public WorkplaceStatusService(WorkplaceStatusRepository workplaceStatusRepository) {
        this.workplaceStatusRepository = workplaceStatusRepository;
    }

    public List<WorkplaceStatus> getAllWorkplaceStatus() {
        return StreamSupport
                .stream(workplaceStatusRepository.getWorkplaceStatusList().spliterator(), false)
                .collect(Collectors.toList());
    }

    public List<WorkplaceStatus> getAllWorkplaceStatusFiltered(Boolean toCheckIdWorkplace, Integer idWorkplace, Boolean toCheckCodeShop, Integer codeShop, Integer ignoreInterval, Integer problemInterval, Boolean toCheckProblem) {
        return StreamSupport
                .stream(workplaceStatusRepository.getWorkplaceStatusListFiltered(toCheckIdWorkplace, idWorkplace, toCheckCodeShop, codeShop, ignoreInterval, problemInterval, toCheckProblem).spliterator(), false)
                .collect(Collectors.toList());
    }


    @Transactional
    public void save(WorkplaceStatus workplaceStatus) {
        workplaceStatusRepository.save(workplaceStatus);
    }

    @Transactional
    public void delete(WorkplaceStatus workplaceStatus) {
        workplaceStatusRepository.delete(workplaceStatus);
    }

}
