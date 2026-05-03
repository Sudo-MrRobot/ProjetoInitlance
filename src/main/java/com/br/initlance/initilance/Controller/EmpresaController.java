package com.br.initlance.initilance.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import com.br.initlance.initilance.Service.UsuarioService;
import com.br.initlance.initilance.entity.Empresa;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/empresas")
public class EmpresaController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/salvar")
    public String salvarEmpresa(@ModelAttribute("empresa") Empresa empresa,
            HttpServletRequest request,
            Model model) {

        String senhaOriginal = empresa.getSenha();

        try {
            System.out.println("SALVANDO EMPRESA...");

            Empresa salva = usuarioService.cadastrarEmpresa(empresa);

            System.out.println("ID EMPRESA SALVA: " + salva.getIdUsuario());

            autenticarUsuario(salva.getEmail(), senhaOriginal, request);

            return "redirect:/empresas/dashboard";

        } catch (Exception ex) {
            ex.printStackTrace();

            model.addAttribute("empresa", empresa);
            model.addAttribute("erro", ex.getMessage());

            return "empresas/formularioCadastroEmpresa";
        }
    }

    @GetMapping("/cadastrar")
    public String cadastrarEmpresa(Model model) {
        if (!model.containsAttribute("empresa")) {
            model.addAttribute("empresa", new Empresa());
        }
        return "empresas/formularioCadastroEmpresa";
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "empresas/dashboard";
    }

    private void autenticarUsuario(String email, String senha, HttpServletRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, senha));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        HttpSession session = request.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
    }
}
