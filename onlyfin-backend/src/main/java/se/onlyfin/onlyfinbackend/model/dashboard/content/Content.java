package se.onlyfin.onlyfinbackend.model.dashboard.content;


import com.fasterxml.jackson.databind.JsonNode;

public class Content {

    private JsonNode jsonNode;

    public Content(JsonNode jsonNode) {
        this.jsonNode = jsonNode;
    }

    public JsonNode getJsonNode() {
        return this.jsonNode;
    }


}
