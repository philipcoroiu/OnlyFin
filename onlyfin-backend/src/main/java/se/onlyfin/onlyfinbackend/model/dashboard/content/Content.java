package se.onlyfin.onlyfinbackend.model.dashboard.content;


public abstract class Content {


    private String type;

    public Content(String type) {
            this.type = type;
    }

    public String getType() {
            return type;
    }

    public void setType(String type) {
            this.type = type;
    }


}
