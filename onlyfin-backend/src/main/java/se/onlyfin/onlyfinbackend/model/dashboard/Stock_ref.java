package se.onlyfin.onlyfinbackend.model.dashboard;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table (name = "stock_ref")
public class Stock_ref {

    public Stock_ref() {

    }
    public Stock_ref(int id){
        this.id = id;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private int id;

    @OneToMany (mappedBy = "stock_ref_id", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Stock> stocks = new ArrayList<>();

    @Column (name = "name")
    private String name;



    public int getId() {
        return id;
    }

    public String getName(){
        return name;
    }
}
