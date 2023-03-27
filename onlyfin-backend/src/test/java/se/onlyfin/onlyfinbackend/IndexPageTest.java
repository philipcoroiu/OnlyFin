package se.onlyfin.onlyfinbackend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import se.onlyfin.onlyfinbackend.controller.IndexPageController;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class IndexPageTest {

    @Autowired
    private IndexPageController indexPageController;

    @Test
    public void testIndexPage() {
        assertEquals(indexPageController.indexPage(), "index.html");
    }

}
