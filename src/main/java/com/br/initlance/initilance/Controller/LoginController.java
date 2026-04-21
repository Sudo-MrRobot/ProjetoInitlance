package com.br.initlance.initilance.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/login")
public class LoginController {

    @GetMapping("/cadastrar-como")
    public String cadastrarComo() {
        return "usuarios/cadastrar-como";
    }

    @GetMapping("/cadastrar")
    public String cadastrar(@RequestParam("tipo") String tipo) {
        if ("empresa".equals(tipo)) {
            return "empresas/formularioCadastroEmpresa";
        } else if ("freelancer".equals(tipo)) {
            return "freelancers/formularioCadastroFreelancer";
        }
        return "redirect:/login/cadastrar-como?erro";
    }

    @GetMapping("/sing-up")
    public String singUp() {
        return "usuarios/formulario-sing-up";
    }

}
