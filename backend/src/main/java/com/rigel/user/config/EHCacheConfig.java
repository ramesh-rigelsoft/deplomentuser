package com.rigel.user.config;

import org.ehcache.config.builders.CacheConfigurationBuilder;
import org.ehcache.config.builders.ResourcePoolsBuilder;
import org.ehcache.jsr107.Eh107Configuration;
import org.ehcache.jsr107.EhcacheCachingProvider;
import org.springframework.cache.CacheManager;
import org.springframework.cache.jcache.JCacheCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cache.annotation.EnableCaching;

import java.net.URISyntaxException;

import javax.cache.Caching;
import javax.cache.spi.CachingProvider;

@Configuration
@EnableCaching
public class EHCacheConfig {
	
	    @Bean
	    public org.springframework.cache.CacheManager cacheManager() {
	        try {
				return new org.springframework.cache.jcache.JCacheCacheManager(
				    Caching.getCachingProvider().getCacheManager(
				        getClass().getResource("/ehcache.xml").toURI(),
				        getClass().getClassLoader()
				    )
				);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				return null;
			}
	    }
	}
