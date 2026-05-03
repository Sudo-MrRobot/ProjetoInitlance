package com.br.initlance.initilance.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


@Controller

public class InitlanceController {

    @GetMapping("/initlance")
    public String index(){
        return "index";
    }

    
}
