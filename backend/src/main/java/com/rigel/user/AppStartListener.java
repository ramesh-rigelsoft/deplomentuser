package com.rigel.user;
//package com.app.todoapp;
//import org.springframework.boot.context.event.ApplicationReadyEvent;
//import org.springframework.context.event.EventListener;
//import org.springframework.stereotype.Component;
//
//@Component
//public class AppStartListener {
//
//    private boolean browserOpened = false;
//
//    @EventListener(ApplicationReadyEvent.class)
//    public void onReady() {
//
//        System.out.println("ApplicationReadyEvent Fired");
//
//        // DevTools restart guards
//        if (Thread.currentThread().getName().contains("restart")) {
//            System.out.println("DevTools restart detected → skip browser");
//            return;
//        }
//
//        // Prevent multiple window open
//        if (browserOpened) {
//            System.out.println("Browser already opened → skip");
//            return;
//        }
//
//        browserOpened = true;
//
//        new Thread(() -> {
//            try { Thread.sleep(1200); } catch (Exception ignored) {}
//            FXApp.startBrowser();
//        }).start();
//    }
//}
