package se.onlyfin.onlyfinbackend.model.dashboard;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;


@Entity
@Table (name = "module")
public class ModuleEntity {

    @Id
    @GeneratedValue (strategy = GenerationType.SEQUENCE)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category_id;

    @Column(name = "content", columnDefinition = "jsonb")
    private String content;

    public int getId() {
        return id;
    }

    public int getCategory_id() {
        return category_id.getId();
    }

    public String getContent() throws JsonProcessingException {

        return content;
    }
}
