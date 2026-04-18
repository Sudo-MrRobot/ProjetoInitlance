package com.br.initlance.initilance.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/login")
public class LoginController {

    @GetMapping("/entrar-como")
    public String entrarComo() {
        return "usuarios/entrar-como";
    }

    @GetMapping("/entrar")
    public String entrar(@RequestParam("tipo") String tipo) {
        if ("empresa".equals(tipo)) {
            return "empresas/formularioCadastroEmpresa";
        } else if ("freelancer".equals(tipo)) {
            return "freelancers/formularioCadastroFreelancer";
        }
        return "redirect:/login/entrar?erro";
    }

    @GetMapping("/sing-up")
    public String singUp() {
        return "usuarios/formulario-sing-up";
    }

}
