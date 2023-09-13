package courseproject.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
public class MainController {
    @RequestMapping("/error")
    public String error(HttpServletRequest request) {
        return "error";
    }
}