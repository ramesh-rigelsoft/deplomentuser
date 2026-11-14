package com.rigel.user.security;

import java.util.HashSet;
import java.util.Set;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.rigel.user.dao.IUserDao;
import com.rigel.user.model.User;

@Service
public class UserDetailService implements UserDetailsService {

    private final IUserDao userDao;

    public UserDetailService(IUserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        User user = userDao.findUserByEmailId(username, 0);

        if (user == null) {
            throw new UsernameNotFoundException(
                "No user found with username '" + username + "'."
            );
        }

        String email = user.getEmail_id();

        String usernames = email != null && email.contains("|")
                ? email.split("\\|", 2)[0]
                : email;

        return new JwtUser(
            user.getOwnerId(),
            usernames,
            user.getPassword(),
            mapToGrantedAuthorities(user.getRole()),
            user.getStatus(),
            user.getLastPasswordResetDate()
        );
    }

    private static Set<GrantedAuthority> mapToGrantedAuthorities(String role) {

        Set<GrantedAuthority> grantedAuthorities = new HashSet<>();

        if (role != null && !role.isBlank()) {
            grantedAuthorities.add(
                new SimpleGrantedAuthority(role)
            );
        }

        return grantedAuthorities;
    }
}


//package com.rigel.user.security;
//
//import java.util.HashSet;
//import java.util.Set;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UserDetailsService;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Component;
//import org.springframework.stereotype.Service;
//
//import com.rigel.user.dao.IUserDao;
//import com.rigel.user.model.Roles;
//import com.rigel.user.model.User;
//
//
//@Component
//@Service
//public class UserDetailService implements UserDetailsService {
//
//	@Autowired
//	IUserDao userDao;
//	
//	@Override
//	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
////		System.out.println("User name >>> "+username);
//		User user = userDao.findUserByEmailId(username,0);
//		String usernames=user.getEmail_id().contains("|")?user.getEmail_id().split("|")[0]:user.getEmail_id();
////		System.out.println("User name >>> "+user.getId());
//        if (user!= null) {
//        	return new JwtUser(user.getOwnerId(), usernames,
//        			user.getPassword(), mapToGrantedAuthorities(user.getRole()),
//        			user.getStatus(), user.getLastPasswordResetDate());
//          }else {
//        	throw new UsernameNotFoundException(String.format("No user found with username '%s'.", username));	
//        }
//	}
//	
//	 private static Set<GrantedAuthority> mapToGrantedAuthorities(String roles) {
//		Set<GrantedAuthority> grantedAuthorities = new HashSet<>();
//	    grantedAuthorities.add(new SimpleGrantedAuthority(roles));
////	    System.out.println(grantedAuthorities.contains(new SimpleGrantedAuthority("user")));
//    	return grantedAuthorities;
//    }
//
//}
