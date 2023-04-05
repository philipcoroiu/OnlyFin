package se.onlyfin.onlyfinbackend.model.dashboard;

import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "stock")
public class Stock {

    @Id
    @GeneratedValue (strategy = GenerationType.SEQUENCE)
    private int id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "stock_ref_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Stock_ref stock_ref_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dashboard_id")
    private Dashboard dashboard_id;

    @OneToMany (mappedBy = "stock_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Category> categories = new ArrayList<>();

    public String getDashboard_id() {
        return dashboard_id.getId();
    }

    public int getId() {
        return id;
    }

    public Stock_ref getStock_ref_id() {
        return stock_ref_id;
    }

    public List<Category> getCategories() {
        return categories;
    }

}

