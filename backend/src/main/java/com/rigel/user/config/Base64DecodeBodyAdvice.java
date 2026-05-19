package com.rigel.user.config;
//package com.app.todoapp.config;
//
//import java.io.ByteArrayInputStream;
//import java.io.IOException;
//import java.io.InputStream;
//import java.lang.reflect.Type;
//import java.nio.charset.StandardCharsets;
//import java.util.Base64;
//
//import org.springframework.core.MethodParameter;
//import org.springframework.http.HttpInputMessage;
//import org.springframework.http.converter.HttpMessageConverter;
//import org.springframework.util.StreamUtils;
//import org.springframework.web.bind.annotation.RestControllerAdvice;
//import org.springframework.web.servlet.mvc.method.annotation.RequestBodyAdviceAdapter;
//
//import com.app.todoapp.annotation.Base64Encoded;
//
//import lombok.extern.slf4j.Slf4j;
//
//@RestControllerAdvice // Don't forget the @RestControllerAdvice annotation. It will take effect for all RestControllers.
//@Slf4j
//public class Base64DecodeBodyAdvice extends RequestBodyAdviceAdapter {
//
//    /**
//        * If this method returns false, the `beforeBodyRead` method will not be executed. 
//        */
//    @Override
//    public boolean supports(MethodParameter methodParameter, Type targetType, Class<? extends HttpMessageConverter<?>> converterType) {
//        // If the parameter is annotated with `@Base64Encoded` then it needs to be decoded.
//        return methodParameter.hasParameterAnnotation(Base64Encoded.class);
//    }
//
//    /**
//        * This method will be executed before spring mvc reads the request body. We can do some pre-processing of the request body here.
//        */
//    @Override
//    public HttpInputMessage beforeBodyRead(HttpInputMessage inputMessage, MethodParameter parameter, Type targetType,
//            Class<? extends HttpMessageConverter<?>> converterType) throws IOException {
//
//        try (InputStream inputStream = inputMessage.getBody()) {
//
//            // Read request body
//            byte[] body = StreamUtils.copyToByteArray(inputStream);
//            
//            log.info("raw: {}", new String(body));
////            byte[] parameterDecode = Base64.getDecoder().decode(parameter.toString().getBytes());
////            System.out.println(parameterDecode);
//
//            // Base64 Decode
//            byte[] decodedBody = Base64.getDecoder().decode(body);
//            
//            log.info("decode: {}", new String(decodedBody, StandardCharsets.UTF_8));
//
//            // Return the decoded body
//            return new DecodeHttpInputMessage(inputMessage.getHeaders(), new ByteArrayInputStream(decodedBody),parameter);
//        }
//    }
//}
