package se.onlyfin.onlyfinbackend.model.dashboard;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import se.onlyfin.onlyfinbackend.converter.JsonNodeConverter;


@Entity
@Table (name = "module")
public class ModuleEntity {

    public ModuleEntity(){}
    public ModuleEntity(int id){
        this.id = id;
    }

    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category_id;

    @Convert(converter = JsonNodeConverter.class)
    @Column(name = "content", columnDefinition = "jsonb")
    private JsonNode content;

    @Column(name = "module_type")
    private String module_type;

    public int getId() {
        return id;
    }

    public int getCategory_id() {
        return category_id.getId();
    }

    public JsonNode getContent() {
        return content;
    }
    public String getModule_type() {
        return module_type;
    }
    public void setContent(JsonNode content) {
        this.content = content;
    }


    public void setModule_type(JsonNode module_type) {
        this.module_type = module_type.asText();
    }

    public void setCategory_id(JsonNode categoryId) {
        try{
            this.category_id = new Category(Integer.parseInt(categoryId.asText()));
        } catch (Exception e){
            System.out.println(e);
        }
    }
}
