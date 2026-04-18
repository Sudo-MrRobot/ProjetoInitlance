package com.br.initlance.initilance.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.br.initlance.initilance.entity.Freelancer;

@Repository
public interface FreelancerRepository extends JpaRepository<Freelancer, Integer> {
    
}
