package com.web.invoice.primarydb.component;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.fge.jsonpatch.JsonPatchException;
import com.github.fge.jsonpatch.mergepatch.JsonMergePatch;
import org.springframework.stereotype.Component;

@Component
public class JsonPatchHelper {

    private final ObjectMapper objectMapper;

    public JsonPatchHelper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    public <T> T applyPatch(JsonMergePatch patch, Object targetBean, Class<T> beanClass) throws JsonPatchException, JsonProcessingException {
        JsonNode targetNode = objectMapper.valueToTree(targetBean);
        JsonNode patchedNode = patch.apply(targetNode);
        return objectMapper.treeToValue(patchedNode, beanClass);
    }
}