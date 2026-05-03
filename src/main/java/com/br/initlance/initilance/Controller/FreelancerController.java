package com.br.initlance.initilance.Controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

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

import com.br.initlance.initilance.Security.UsuarioDetails;
import com.br.initlance.initilance.Service.UsuarioService;
import com.br.initlance.initilance.entity.Freelancer;
import com.br.initlance.initilance.entity.Usuario;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@Controller
@RequestMapping("/freelancers")
public class FreelancerController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/salvar")
    public String salvarFreelancer(@ModelAttribute("usuario") Freelancer freelancer,
            HttpServletRequest request,
            Model model) {

        String senhaOriginal = freelancer.getSenha();

        try {

            Freelancer salvo = usuarioService.cadastrarFreelancer(freelancer);

            System.out.println("ID SALVO: " + salvo.getIdUsuario());

            autenticarUsuario(salvo.getEmail(), senhaOriginal, request);

            return "redirect:/freelancers/dashboard";

        } catch (Exception ex) {
            ex.printStackTrace();

            model.addAttribute("usuario", freelancer);
            model.addAttribute("erro", ex.getMessage());

            return "freelancers/formularioCadastroFreelancer";
        }
    }

    @GetMapping("/cadastrar")
    public String cadastrarFreelancer(Model model) {
        if (!model.containsAttribute("usuario")) {
            model.addAttribute("usuario", new Freelancer());
        }
        return "freelancers/formularioCadastroFreelancer";
    }

 @GetMapping("/dashboard")
public String dashboard(Model model, Authentication authentication) {

    UsuarioDetails userDetails = (UsuarioDetails) authentication.getPrincipal();
    Usuario usuario = userDetails.getUsuario();

    String nomeCompleto = usuario.getNome();

    // primeiro nome na dashboard
    String primeiroNome = nomeCompleto.split(" ")[0];


    String iniciais = "U"; // fallback

    if (nomeCompleto != null && !nomeCompleto.isEmpty()) {
        String[] partes = nomeCompleto.trim().split("\\s+");

        if (partes.length == 1) {
            iniciais = partes[0].substring(0, 1).toUpperCase();
        } else {
            // PRIMEIRO + SEGUNDO nome (LH para "Luis Henrique Prado")
            iniciais =
                partes[0].substring(0, 1) +
                partes[1].substring(0, 1);

            iniciais = iniciais.toUpperCase();
        }
    }

    //data
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern(
        "EEEE, dd 'de' MMMM 'de' yyyy",
        new Locale("pt", "BR")
    );

    String dataFormatada = LocalDate.now().format(formatter);
    dataFormatada = dataFormatada.substring(0,1).toUpperCase() + dataFormatada.substring(1);

    // 🔹 ENVIO PRO HTML
    model.addAttribute("nome", primeiroNome);
    model.addAttribute("iniciais", iniciais);
    model.addAttribute("data", dataFormatada);

    return "freelancers/dashboard";
}

    private void autenticarUsuario(String email, String senha, HttpServletRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, senha));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        HttpSession session = request.getSession(true);
        session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());
    }
}
