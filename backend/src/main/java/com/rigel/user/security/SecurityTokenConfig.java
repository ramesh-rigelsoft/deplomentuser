package com.rigel.user.security;
//package com.app.todoapp.security;
//
//import java.util.Arrays;
//import java.util.Timer;
//
//import javax.servlet.http.HttpServletResponse;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpMethod;
//import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
//
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//
//import com.app.todoapp.util.AppUtill;
//import com.app.todoapp.util.CryptoAES128;
//
//import java.util.Timer;
//import java.util.TimerTask;
// 
////class Helper extends TimerTask {
////    public static int i = 1;
////     
////    // TimerTask.run() method will be used to perform the action of the task
////     
////    public void run() {
////        System.out.println("This is called " + i++ + " time");
////    }
////}
//
//@Configuration
//@EnableWebSecurity
//@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
//public class SecurityTokenConfig {
//
//	private boolean isRoleSecure=false;
//	
//	@Autowired
//	private JwtConfig jwtConfig;
//	
//	@Autowired
//	private CryptoAES128 cryptoAES128;
//	
////	Timer timer = new Timer();
//	
////	TimerTask task = new Helper();
//     
//	
//	@Autowired
//	private JwtTokenUtil JwtTokenUtil;
//
//	@Value("${security.jwt.header}")
//	private String tokenHeader;
//	
//	@Value("${jwt.route.authentication.path}")
//	private String authenticationPath;
//	
//	@Autowired
//	private UserDetailService userDetailService;
//	
//	//http://localhost:8081/todotask/swagger-ui/
//	private final String[] AUTH_WHITELIST = {
//	        "/authenticate",
//	        "/actuator/**",
//	        "/v2/api-docs",
//	        "/api/todoTask/test/**",
//	        "/api-docs/**",
//	        "/api/actuator/**",
//	        "/swagger-ui/",
//	        "/swagger-resources/**",
//	        "/swagger-ui.html/",
//	        "/v3/api-docs/**",
//	        "/v3/**/**",
//	        "/webjars/**"
//	};
//		
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        http.csrf()
//          .disable()          
//        	.exceptionHandling()
//    		.authenticationEntryPoint((req, rsp, e) -> rsp.sendError(HttpServletResponse.SC_UNAUTHORIZED)).and()
////    		.addFilterAfter(new DecreptRequestFilter(), UsernamePasswordAuthenticationFilter.class)
//    		.addFilterAfter(new JwtTokenAuthenticationFilter(jwtConfig,userDetailService,JwtTokenUtil,cryptoAES128), UsernamePasswordAuthenticationFilter.class)
//    		
//    		.authorizeRequests()
//    		.antMatchers(AUTH_WHITELIST).permitAll()
//    		.antMatchers(HttpMethod.POST,"/api/user/signup/**","/api/user/login/**").permitAll()
////    		.antMatchers(HttpMethod.GET,"/api/todoTask/test/**").permitAll()
//        
////    	    .antMatchers(HttpMethod.DELETE)
////          .hasRole("2")
////          .antMatchers("/admin/**")
////          .hasAnyRole("1","2")
//          
////          .antMatchers(AppUtill.getAllRole())
//          .antMatchers(AppUtill.getUrlRole()).hasAnyAuthority(AppUtill.getAllRole())
//          .anyRequest()
//          .authenticated()
//          .and()
//          .httpBasic()
//          .and()
//          .sessionManagement()
//          .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
////          timer.schedule(task, 200, 5000);
//	       http.headers()
//	       .frameOptions().sameOrigin()
//	       .cacheControl();
//	      
//	       //  xss attack secured
////	       http.headers()
////           .xssProtection()
////           .and()
////           .contentSecurityPolicy("script-src 'self'");
//	       
//	       http.cors();
//        return http.build();
//    }
//    
//	 @Bean
//	    public WebSecurityCustomizer webSecurityCustomizer(){
//	    	return (web) -> web.ignoring()
//	            .antMatchers(
//	                HttpMethod.POST,
//	                authenticationPath)
//	            .and()
//	            .ignoring()
//	            .antMatchers(
//	                HttpMethod.GET,"/","/*.html",
//	                "/favicon.ico",
//	                "/**/*.html",
//	                "/swagger-ui.html#/",
////	                "/demouser/v2/api-docs/",
//	                "/v2/api-docs/",
//	                "/**/*.jsp",
//	                "/**/*.css",
//	                "/**/*.js",
//	                "/**/*.png",
//	                "/**/*.jpg",
//	                "/**/*.jpeg",
//	                "/**/*.JPG",
//	                "/**/*.gif",
//	                "/**/*.map",
//	                "/fonts/**",
//	                "/js/**",
//	                "css/**",
//	                "/images/**",
//	                "/frontend/app/static/**"
//	            ).and()
//	            .ignoring()
//	            .antMatchers("/h2-console/**/**");
//	    }
//	 
//	    @Bean
//	    public CorsConfigurationSource corsConfigurationSource() {
//	        final CorsConfiguration configuration = new CorsConfiguration();
//	        configuration.setAllowCredentials(true);
////	        configuration.setAllowedOrigins(Arrays.asList("*"));
//	        configuration.addAllowedOrigin("http://localhost:8091");
//	        configuration.setAllowedMethods(Arrays.asList("HEAD",
//	                "GET", "POST", "PUT", "DELETE", "PATCH"));
//	        // setAllowCredentials(true) is important, otherwise:
//	        // The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'.
//	        
//	        // setAllowedHeaders is important! Without it, OPTIONS preflight request
//	        // will fail with 403 Invalid CORS request
//	        configuration.setAllowedHeaders(Arrays.asList("Authorization","filter", "Cache-Control", "Content-Type"));
//	        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//	        source.registerCorsConfiguration("/**", configuration);
//	        return source;
//	    }
//}