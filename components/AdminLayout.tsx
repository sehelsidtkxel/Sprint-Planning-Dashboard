"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  CalendarDays,
  GitBranch,
  LayoutDashboard,
  ListTodo,
  LogOut,
} from "lucide-react";
import { AppIcon } from "./icons";

export default function AdminLayout({
  title,
  subtitle,
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/login");
  }

  const links = [
    { label: "Sprints", href: "/admin", icon: CalendarDays },
    { label: "Streams", href: "/admin/streams", icon: GitBranch },
    { label: "Backlog", href: "/admin/backlog", icon: ListTodo },
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
  ];

  const drawerWidth = 280;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#0f172a",
            color: "white",
            borderRight: "1px solid rgba(148,163,184,0.15)",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: 0,
                p: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image
                src="/logo.jpeg"
                alt="Logo"
                width={46}
                height={46}
                style={{ objectFit: "contain" }}
              />
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Signal
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(226,232,240,0.7)" }}>
                Admin Portal
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: "rgba(148,163,184,0.15)" }} />

        <List sx={{ px: 1, py: 1, flex: 1 }}>
          {links.map((link) => {
            const active = pathname === link.href;

            return (
              <ListItemButton
                key={link.href}
                component={Link}
                href={link.href}
                selected={active}
                sx={{
                  borderRadius: 0,
                  my: 0.5,
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    "&:hover": { bgcolor: "primary.main" },
                  },
                  "&:hover": {
                    bgcolor: "rgba(148,163,184,0.15)",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                  <AppIcon icon={link.icon} size="md" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ fontWeight: 700, color: "inherit" }}>
                      {link.label}
                    </Typography>
                  }
                />
              </ListItemButton>
            );
          })}
        </List>

        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="contained"
            color="error"
            onClick={handleLogout}
            startIcon={<AppIcon icon={LogOut} size="sm" />}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      <Box sx={{ flex: 1 }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{ bgcolor: "transparent", color: "text.primary", borderBottom: "1px solid", borderColor: "divider" }}
        >
          <Toolbar sx={{ px: 4, py: 1.5 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                  {subtitle}
                </Typography>
              )}
            </Box>

            {action}
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4 }}>{children}</Box>
      </Box>
    </Box>
  );
}