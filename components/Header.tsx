"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SignalLogo from "./SignalLogo";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { Search } from "lucide-react";
import { AppIcon } from "./icons";
import { supabase } from "../lib/supabase";

function getInitials(email: string): string {
  const [local] = email.split("@");
  const parts = local.split(/[._-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return local.slice(0, 2).toUpperCase();
}

function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 45%, 38%)`;
}

export default function Header({
  search,
  onSearchChange,
}: {
  search: string;
  onSearchChange: (value: string) => void;
}) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setAuthLoaded(true);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setIsAdmin(true);
        setUserEmail(session.user.email ?? null);
      }
      setAuthLoaded(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAdmin(true);
        setUserEmail(session.user.email ?? null);
      } else {
        setIsAdmin(false);
        setUserEmail(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: "#f8fafc",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
        borderRadius: 0,
        boxShadow: "none",
      }}
    >
      <Container maxWidth="xl" disableGutters>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 72,
            height: 72,
            px: { xs: 2, md: 4 },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              minWidth: 0,
            }}
          >
            <SignalLogo height={24} color="#161616" />
          </Box>

          <Stack
            direction="row"
            spacing={{ xs: 1, md: 2 }}
            sx={{ alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}
          >
            <TextField
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search"
              size="small"
              sx={{
                display: { xs: "none", md: "flex" },
                width: 220,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#ffffff",
                  borderRadius: "4px",
                  fontSize: "0.875rem",
                  "& fieldset": {
                    borderRadius: "4px",
                  },
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <AppIcon
                        icon={Search}
                        size="md"
                        style={{ color: "rgba(100, 116, 139, 1)" }}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {isAdmin && (
              <Button
                component={Link}
                href="/admin"
                variant="contained"
                color="primary"
                sx={{
                  px: { xs: 2, md: 2.5 },
                  py: 1,
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  borderRadius: "4px",
                }}
              >
                Admin Panel
              </Button>
            )}

            {authLoaded && (
              <Tooltip
                title={userEmail ?? "Guest"}
                placement="bottom-end"
                arrow
              >
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{
                    alignItems: "center",
                    cursor: "default",
                    pl: 1.5,
                    borderLeft: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      bgcolor: userEmail
                        ? stringToColor(userEmail)
                        : "rgba(100,116,139,0.15)",
                      color: userEmail ? "#fff" : "text.secondary",
                      borderRadius: "4px",
                    }}
                  >
                    {userEmail ? getInitials(userEmail) : "?"}
                  </Avatar>

                  <Box sx={{ display: { xs: "none", md: "block" } }}>
                    <Typography
                      sx={{
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        color: "text.primary",
                        lineHeight: 1.2,
                        maxWidth: 140,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {userEmail ? userEmail.split("@")[0] : "Guest"}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.65rem",
                        color: "text.secondary",
                        lineHeight: 1.2,
                      }}
                    >
                      {userEmail ? "Admin" : "Viewer"}
                    </Typography>
                  </Box>
                </Stack>
              </Tooltip>
            )}
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
