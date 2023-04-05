package se.onlyfin.onlyfinbackend.model.dashboard;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "category")
public class Category {

    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn(name = "stock_id")
    private Stock stock_id;

    @Id
    @GeneratedValue (strategy = GenerationType.SEQUENCE)
    private int id;

    @Column (name = "name")
    private String name;

    @OneToMany (mappedBy = "category_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ModuleEntity> moduleEntities = new ArrayList<>();

    public String getName() {
        return name;
    }

    public int getId() {
        return id;
    }

    public List<ModuleEntity> getModuleEntities() {
        return moduleEntities; //moduleEntities;
    }

    public int getStock_id() {
        return stock_id.getId();
    }
}
