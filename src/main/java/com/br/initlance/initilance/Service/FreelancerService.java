package com.br.initlance.initilance.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.br.initlance.initilance.Repository.FreelancerRepository;
import com.br.initlance.initilance.entity.Freelancer;

@Service
public class FreelancerService {
    @Autowired
    private FreelancerRepository freelancerRepository;

    public Freelancer salvar(Freelancer freelancer) {
        return freelancerRepository.save(freelancer);
    }

    public Optional<Freelancer> buscarPorEmail(String email) {
        return freelancerRepository.findByEmail(email);
    }
}
