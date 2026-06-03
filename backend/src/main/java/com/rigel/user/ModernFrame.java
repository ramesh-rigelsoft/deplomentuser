package com.rigel.user;

import java.awt.*;
import java.awt.event.*;
import javax.swing.*;
import javax.swing.border.LineBorder;

public class ModernFrame {

    public static JFrame createModernFrame() {
    	
    	// 1. Load icon
        Image icon = null;
        try {
            icon = Toolkit.getDefaultToolkit()
                    .getImage(ModernFrame.class.getResource("/l3.png"));
            System.out.println("Icon loaded: " + icon);
        } catch (Exception e) {
            System.out.println("Icon failed: " + e.getMessage());
        }

        // 2. Set taskbar icon
        try {
            Taskbar taskbar = Taskbar.getTaskbar();
            taskbar.setIconImage(icon);
            System.out.println("Taskbar icon set");
        } catch (Exception ex) {
            System.out.println("Taskbar unsupported: " + ex.getMessage());
        }

        JFrame frame = new JFrame();
        frame.setUndecorated(true);
        frame.setExtendedState(JFrame.MAXIMIZED_BOTH);

        // Border on all sides
        frame.getRootPane().setBorder(
            BorderFactory.createCompoundBorder(
                new LineBorder(new Color(70, 70, 70), 2, true),
                BorderFactory.createMatteBorder(2, 2, 2, 2, new Color(50, 50, 50))
            )
        );

        frame.getContentPane().setBackground(new Color(32, 32, 32)); // dark background


        //-----------------------------------------
        // TOP BAR
        //-----------------------------------------
        JPanel topBar = new JPanel();
        topBar.setBackground(new Color(45, 45, 45));
        topBar.setPreferredSize(new Dimension(frame.getWidth(), 45));
        topBar.setLayout(new BorderLayout());

        JPanel buttonPanel = new JPanel();
        buttonPanel.setOpaque(false);
        buttonPanel.setLayout(new FlowLayout(FlowLayout.RIGHT, 10, 8));

        JButton minBtn = createIconButton("–", new Color(255, 215, 0));     // Minimize
        JButton closeBtn = createIconButton("✕", new Color(255, 50, 50));   // Close

        // Minimize action
        minBtn.addActionListener(e -> frame.setState(JFrame.ICONIFIED));

        // Close action
        closeBtn.addActionListener(e -> frame.dispose());

        buttonPanel.add(minBtn);
        buttonPanel.add(closeBtn);  // Only minimize + close


        //-----------------------------------------
        // DRAG WINDOW
        //-----------------------------------------
        final int[] mouseX = new int[1];
        final int[] mouseY = new int[1];

        topBar.addMouseListener(new MouseAdapter() {
            public void mousePressed(MouseEvent e) {
                mouseX[0] = e.getX();
                mouseY[0] = e.getY();
            }
        });

        topBar.addMouseMotionListener(new MouseMotionAdapter() {
            public void mouseDragged(MouseEvent e) {
                frame.setLocation(
                    e.getXOnScreen() - mouseX[0],
                    e.getYOnScreen() - mouseY[0]
                );
            }
        });


        topBar.add(buttonPanel, BorderLayout.EAST);
        frame.add(topBar, BorderLayout.NORTH);

        return frame;
    }


    //-----------------------------------------
    // BUTTON STYLE
    //-----------------------------------------
    private static JButton createIconButton(String symbol, Color bgColor) {
        JButton btn = new JButton(symbol);

        btn.setPreferredSize(new Dimension(45, 30));
        btn.setFont(new Font("SansSerif", Font.BOLD, 18));
        btn.setForeground(Color.WHITE);
        btn.setBackground(bgColor);

        btn.setBorderPainted(false);
        btn.setFocusPainted(false);
        btn.setOpaque(true);
        btn.setBorder(new LineBorder(new Color(30, 30, 30), 1, true));

        btn.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseEntered(MouseEvent e) {
                btn.setBackground(bgColor.darker());
            }
            @Override
            public void mouseExited(MouseEvent e) {
                btn.setBackground(bgColor);
            }
        });

        return btn;
    }
}
