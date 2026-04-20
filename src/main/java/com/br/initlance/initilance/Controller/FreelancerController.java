package com.br.initlance.initilance.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/freelancers")
public class FreelancerController {
    @GetMapping("/cadastrar")
    public String cadastrarFreelancer(){
        return "freelancers/formularioCadastroFreelancer";
    }

    @GetMapping("/dashboard")
    public String dashboard(){
        return "freelancers/dashboard";
    }
}
