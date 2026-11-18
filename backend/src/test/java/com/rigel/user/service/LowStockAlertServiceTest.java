package com.rigel.user.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import com.rigel.user.dao.ILowStockAlertDao;
import com.rigel.user.model.LowStockAlert;
import com.rigel.user.model.dto.LowStockAlertDto;
import com.rigel.user.serviceimpl.LowStockAlertServiceImpl;

public class LowStockAlertServiceTest {

    private LowStockAlertServiceImpl service;
    private ILowStockAlertDao dao;

    @BeforeEach
    public void setup() {
        service = new LowStockAlertServiceImpl();
        dao = mock(ILowStockAlertDao.class);
        ReflectionTestUtils.setField(service, "lowStockAlertDao", dao);
        service.initDeviceCategories();
    }

    @Test
    public void testResolveSkuCodeFromDeviceJson() {
        // Smartphone is ID 01 in device.json
        String sku1 = service.resolveSkuCode("Apple", "Smartphone", null);
        assertEquals("Apple|01", sku1);

        // Feature Phone is ID 02 in device.json
        String sku2 = service.resolveSkuCode("Samsung", "Feature Phone", "");
        assertEquals("Samsung|02", sku2);

        // Headphone is ID 10 in device.json
        String sku3 = service.resolveSkuCode("Sony", "Headphone", null);
        assertEquals("Sony|10", sku3);

        // Unknown item defaults to 97 (Other)
        String sku4 = service.resolveSkuCode("CustomBrand", "UnknownWidget", null);
        assertEquals("CustomBrand|97", sku4);
    }

    @Test
    public void testResolveSkuCodeProvidedExplicitly() {
        String sku = service.resolveSkuCode("Boat", "Data Cable", "Boat|26");
        assertEquals("Boat|26", sku);
    }

    @Test
    public void testSaveAlertGeneratesSkuCodeAndPersists() {
        when(dao.save(any(LowStockAlert.class))).thenAnswer(invocation -> invocation.getArgument(0));

        LowStockAlertDto dto = LowStockAlertDto.builder()
                .ownerId(1)
                .branchCode("BR001")
                .brand("Apple")
                .categoryType("Smartphone")
                .model("iPhone 15 Pro")
                .minimumStockCount(10)
                .status(true)
                .build();

        LowStockAlert saved = service.saveAlert(dto);

        assertNotNull(saved);
        assertEquals("Apple|01", saved.getSkuCode(), "skuCode should be generated as Brand|Id");
        assertEquals("Apple", saved.getBrand());
        assertEquals("Smartphone", saved.getCategoryType());
        assertEquals(10, saved.getMinimumStockCount());
    }
}
