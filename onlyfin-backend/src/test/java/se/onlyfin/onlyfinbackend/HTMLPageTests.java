package se.onlyfin.onlyfinbackend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class HTMLPageTests {
    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ResourceLoader resourceLoader;

    @Test
    public void testLoadIndexPage() throws IOException {
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/", String.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());

        Resource resource = resourceLoader.getResource("classpath:templates/index.html");
        String expected = resource.getContentAsString(StandardCharsets.UTF_8);
        assertEquals(expected, response.getBody());
    }

    @Test
    public void testLoadRegisterPage() throws IOException {
        ResponseEntity<String> response = restTemplate.getForEntity(
                "http://localhost:" + port + "/register", String.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());

        Resource resource = resourceLoader.getResource("classpath:templates/register.html");
        String expected = resource.getContentAsString(StandardCharsets.UTF_8);
        assertEquals(expected, response.getBody());
    }

}
