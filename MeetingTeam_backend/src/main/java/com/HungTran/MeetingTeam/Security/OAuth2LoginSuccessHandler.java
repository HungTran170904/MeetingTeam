package com.HungTran.MeetingTeam.Security;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.HungTran.MeetingTeam.Converter.UserConverter;
import com.HungTran.MeetingTeam.DTO.UserDTO;
import com.HungTran.MeetingTeam.Exception.RequestException;
import jakarta.servlet.http.Cookie;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.HungTran.MeetingTeam.Model.User;
import com.HungTran.MeetingTeam.Repository.RoleRepo;
import com.HungTran.MeetingTeam.Repository.UserRepo;
import com.HungTran.MeetingTeam.Util.Constraint;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler{
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private RoleRepo roleRepo;
	@Autowired
	private UserConverter userConverter;
	@Autowired
	private JwtProvider jwtProvider;
	@Value("${frontend.url}")
	private String frontendUrl;
	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws ServletException, IOException {
		try{
			var auth2Token = (OAuth2AuthenticationToken) authentication;
			DefaultOAuth2User principal = (DefaultOAuth2User) auth2Token.getPrincipal();
			Map<String, Object> attributes = principal.getAttributes();
			var dto=getUserInfo(attributes, auth2Token.getAuthorizedClientRegistrationId());

			var grantedAuthorities=List.of(new SimpleGrantedAuthority(dto.getRole()));
			var newAttributes =new HashMap<String,Object>();
			newAttributes.put("id", dto.getId());
			var newUser = new DefaultOAuth2User(grantedAuthorities,newAttributes, "id");

			Authentication securityAuth = new OAuth2AuthenticationToken(newUser,grantedAuthorities,
					auth2Token.getAuthorizedClientRegistrationId());
			SecurityContextHolder.getContext().setAuthentication(securityAuth);
			response.addCookie(jwtProvider.generateTokenCookie(securityAuth));
			this.setDefaultTargetUrl(frontendUrl+"/friendChat");
		}
		catch(Exception e){
			e.printStackTrace();
			this.setDefaultTargetUrl(frontendUrl+"/login?error=The credentials of your social account does not satisfy our requirement. Please login by other method");
		}
		this.setAlwaysUseDefaultTargetUrl(true);
		super.onAuthenticationSuccess(request, response, authentication);
	}
	private UserDTO getUserInfo(Map<String, Object> attributes, String provider){
		String email =(String) attributes.get("email");
		if(email==null) throw new RequestException("Email field of your provider account is null. Please fill it");
		User user=userRepo.findByEmail(email).orElse(null);
		if(user==null){
			String name=null, avatar_url=null;
			if(provider.equals(Constraint.GOOGLE)){
				name=(String) attributes.get("name");
				avatar_url=(String) attributes.get("picture");
			}
			else if(provider.equals(Constraint.GITHUB)){
				name=(String) attributes.get("login");
				avatar_url=(String) attributes.get("avatar_url");
			}
			var newUser=User.builder()
					.email(email)
					.nickName(name)
					.provider(provider.toUpperCase())
					.role(roleRepo.findByRoleName(Constraint.USER))
					.urlIcon(avatar_url)
					.lastActive(LocalDateTime.now())
					.isActivated(true)
					.build();
			user=userRepo.save(newUser);
		}
		return userConverter.convertUserToDTO(user);
	}
}
