package com.br.initlance.initilance.Controller;

import org.springframework.ui.Model;
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

    @GetMapping("/entrar-como")
    public String entrarComo() {
        return "redirect:/login/sing-up";
    }

    @GetMapping("/cadastrar")
    public String cadastrar(@RequestParam("tipo") String tipo) {
        if ("empresa".equals(tipo)) {
            return "redirect:/empresas/cadastrar";
        } else if ("freelancer".equals(tipo)) {
            return "redirect:/freelancers/cadastrar";
        }
        return "redirect:/login/cadastrar-como?erro";
    }

    @GetMapping("/sing-up")
    public String singUp(
            @RequestParam(value = "erro", required = false) String erro,
            @RequestParam(value = "logout", required = false) String logout,
            Model model) {
        if (erro != null) {
            model.addAttribute("erro", "E-mail ou senha invalidos.");
        }
        if (logout != null) {
            model.addAttribute("sucesso", "Voce saiu da conta com sucesso.");
        }
        return "usuarios/formulario-sing-up";
    }

}
