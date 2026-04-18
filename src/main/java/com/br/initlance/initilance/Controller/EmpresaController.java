package com.br.initlance.initilance.Controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/empresas")
public class EmpresaController {

    @GetMapping("/cadastrar")
    public String cadastrarEmpresa(){
        return "empresas/formularioCadastroEmpresa";
    }
}
