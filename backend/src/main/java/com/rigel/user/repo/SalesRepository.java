package com.rigel.user.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rigel.user.model.Invoice;
import com.rigel.user.model.SalesInfo;

@Repository
public interface SalesRepository extends JpaRepository<SalesInfo, String> {
}
