package se.onlyfin.onlyfinbackend.model.dashboard_entity;


import com.fasterxml.jackson.databind.JsonNode;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;


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

    @Column(name = "content")
    @JdbcTypeCode(SqlTypes.JSON)
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

    @Override
    public String toString() {
        return "ModuleEntity{" +
                "category_id=" + category_id.getId() +
                ", content=" + content +
                ", module_type='" + module_type + '\'' +
                '}';
    }
}
