package com.rigel.user.model.dto;


import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;


@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
@Getter
public class ExpenseDTO {

	@NotBlank(message = "Type is required")
    private String type;

    @NotBlank(message = "Scope is required")
    private String scope;

    private String description;

    @NotNull(message = "Amount is required")
    private Double amount;

    private String proof;

    @NotNull(message = "Date is required")
    private String date;

    private int ownerId;

    private LocalDateTime createdAt;
}
