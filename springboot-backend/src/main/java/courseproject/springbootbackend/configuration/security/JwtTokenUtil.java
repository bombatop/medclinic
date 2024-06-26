package courseproject.springbootbackend.configuration.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import courseproject.springbootbackend.model.dto.authorization.TokenGenerationData;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.security.Key;
import java.util.function.Function;

import javax.crypto.SecretKey;

@Component
public class JwtTokenUtil {

    // @Value("${token.signing.key}")
    private final static String SECRET = "53A73E5F1C4E0A2D3B5F2D784E6A1B423D6F247D1F6E5C3A596D635A75327855";

    // @Value("${token.signing.expiration}")
    private final static long EXPIRATION_TIME = 1800000;

    private Key key(String value) {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(value));
    }

    public String generateToken(final TokenGenerationData tokenData) {
        final Map<String, Object> claims = new HashMap<>();
        claims.put("username", tokenData.username());
        claims.put("userId", tokenData.userId());
        claims.put("roleId", tokenData.roleId());
        return createToken(claims);
    }

    public String getToken(final HttpServletRequest request) {
        return request.getHeader("Authorization").substring(7);
    }

    public String createToken(Map<String, Object> claims) {
        return Jwts.builder()
                .claims(claims)
                .subject(claims.get("username").toString())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key(SECRET))
                .compact();
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        return doGenerateToken(claims, userDetails.getUsername());
    }

    private String doGenerateToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
            .claims(claims)
            .subject(claims.get("username").toString())
            .issuedAt(new Date(System.currentTimeMillis()))
            .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
            .signWith(key(SECRET))
            .compact();
    }

    public Boolean validateToken(String token, String username) {
        final String tokenUsername = getUsernameFromToken(token);
        return (tokenUsername.equals(username) && !isTokenExpired(token));
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = getExpirationDateFromToken(token);
        return expiration.before(new Date());
    }

    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public String getIdFromToken(String token) {
        return getClaimFromToken(token, Claims::getId);
    }

    private Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) key(SECRET))
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
